#!/usr/bin/env python3
"""
Production-Like Prior Authorization Testing Runner Harness
File: scripts/run_pa_test_harness.py

Executes the Prior Authorization pipeline blindly against 50 synthetic patient cases.
Strictly isolated from ground truth answer keys:
1. Stage 1 (Policy Retrieval): Ingests (Payer, CPT, Condition) and retrieves coverage policy
   criteria from Cigna_ACDF.pdf via hierarchical RAG pipeline.
2. Stage 2 (Clinical Determination Engine): Evaluates submitted patient EHR documents against
   retrieved policy rules to determine criterion-by-criterion and overall outcomes.
3. Checkpointed & Resumable: Writes per-case outputs to data/test_runs/latest/cases/<Case_ID>.json
   and updates master data/test_runs/latest/system_run_results.json.
"""

import os
import sys

# Ensure workspace root is in sys.path
WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if WORKSPACE_ROOT not in sys.path:
    sys.path.insert(0, WORKSPACE_ROOT)

import json
import time
import argparse
import importlib
from datetime import datetime
from typing import Dict, Any, List

# Load hierarchical RAG pipeline dynamically
rag = importlib.import_module("retrieval-hierarchical")

CASES_DIR = "data/synthetic_cases/cases"
DOCS_DIR = "data/synthetic_cases/documents"
OUTPUT_DIR = "data/test_runs/latest"
CASES_OUTPUT_DIR = os.path.join(OUTPUT_DIR, "cases")
MASTER_RESULTS_FILE = os.path.join(OUTPUT_DIR, "system_run_results.json")

def load_patient_case(case_id: str) -> tuple[Dict[str, Any], str]:
    """Load patient JSON record and assemble all submitted EHR text documents."""
    json_path = os.path.join(CASES_DIR, f"{case_id}.json")
    with open(json_path, "r", encoding="utf-8") as f:
        case_data = json.load(f)

    # Assemble EHR documents
    doc_folder = os.path.join(DOCS_DIR, case_id)
    doc_texts = []
    if os.path.exists(doc_folder):
        for fname in sorted(os.listdir(doc_folder)):
            if fname.endswith(".txt"):
                fpath = os.path.join(doc_folder, fname)
                with open(fpath, "r", encoding="utf-8") as df:
                    content = df.read().strip()
                doc_texts.append(f"--- DOCUMENT: {fname} ---\n{content}\n")

    assembled_docs = "\n".join(doc_texts) if doc_texts else "No attached clinical documents submitted."
    return case_data, assembled_docs

def evaluate_patient_case(case_id: str, case_data: Dict[str, Any], ehr_text: str) -> Dict[str, Any]:
    """
    Execute 2-Stage Blind Determination Flow:
    Stage 1: Policy Retrieval from Cigna ACDF manual via RAG
    Stage 2: Clinical Evidence Determination
    """
    start_time = time.time()
    
    # Extract clinical inputs (NO ground truth answer keys)
    diagnoses = case_data.get("diagnoses", [])
    condition = diagnoses[0].get("description", "Cervical Spine Disease") if diagnoses else "Cervical Spine Disease"
    
    # Infer requested CPT from clinical notes / assessment or procedures
    cpt = "22551" # default
    assessment = case_data.get("physician_assessment", "")
    for line in ehr_text.splitlines():
        if "Proposed Procedure: CPT " in line:
            cpt = line.split("Proposed Procedure: CPT ")[1].split()[0].strip()
            break
            
    payer = "Cigna"
    query = f"Prior authorization criteria for CPT {cpt} {condition} under {payer}"

    # -------------------------------------------------------------
    # STAGE 1: Policy Retrieval via Hierarchical RAG
    # -------------------------------------------------------------
    table_analysis = rag.check_master_table_prior_auth(query)
    pa_status = table_analysis.get("prior_auth_required", "Yes")
    cpt_desc = table_analysis.get("primary_description", "")
    matched_cpts = table_analysis.get("matched_cpts", [cpt])

    doc_key, routed_toc_ids = rag.route_query_to_toc(
        query=query,
        prior_auth_status=pa_status,
        cpt_desc=cpt_desc,
        matched_cpts=matched_cpts
    )

    doc_info = rag.registry.get_document(doc_key)
    policy_name = doc_info["display_name"] if doc_info else "Cigna ACDF (CMM-601)"

    results = rag.retrieve_scoped_chunks(
        query=query,
        doc_key=doc_key,
        candidate_toc_ids=routed_toc_ids,
        top_k=8
    )
    policy_context = rag.build_context(results)

    # -------------------------------------------------------------
    # STAGE 2: Clinical Evidence Determination Engine
    # -------------------------------------------------------------
    determination_prompt = f"""You are a Board-Certified Medical Director and Prior Authorization Clinical Auditor.
Evaluate whether the submitted patient medical records satisfy the health plan's medical necessity policy criteria for the requested procedure.

REQUESTED PROCEDURE: CPT {cpt} ({cpt_desc})
CLINICAL INDICATION: {condition}
PAYER POLICY: {policy_name}

RETRIEVED HEALTH PLAN POLICY CRITERIA (FROM POLICY MANUAL):
{policy_context}

SUBMITTED PATIENT MEDICAL RECORDS (EHR DOCUMENTS):
{ehr_text}

INSTRUCTIONS:
1. Carefully compare the patient's submitted records against each medical necessity requirement in the policy.
2. For each relevant requirement:
   - "criterion_id": Short identifier (e.g., "C1", "C2", "C3"...)
   - "criterion": Clear description of the medical necessity criterion
   - "system_result": Strictly one of ["MET", "NOT MET", "UNKNOWN", "CONFLICT"]
     * Use "MET" if the clinical record satisfies the requirement (or if a confirmed urgent/emergent exception waives it).
     * Use "NOT MET" if the patient's findings or treatment duration explicitly fail the required threshold.
     * Use "UNKNOWN" if required evidence or a mandatory report (e.g. imaging, physical therapy notes, cotinine test) is missing from the submitted records.
     * Use "CONFLICT" if submitted documents contain direct contradictory evidence (e.g. clinic note reports radiculopathy, but MRI explicitly states completely normal patent foramina).
   - "patient_evidence": Verbatim quote or specific finding from the patient notes.
   - "policy_citation": Policy section or page cited.
3. List any "missing_information" (omitted mandatory tests, reports, or timeframes).
4. Determine "system_overall_result":
   - "MET": If all applicable criteria are satisfied, or if a documented urgent/emergent exception warrants surgical bypass.
   - "NOT MET": If one or more criteria fail.
   - "UNKNOWN": If key required clinical documentation is missing and prevents complete adjudication.
   - "CONFLICT": If contradictory evidence prevents clear determination.
5. Provide clinical "notes" summarizing the determination rationale.

OUTPUT FORMAT: Return STRICTLY a JSON object without markdown fences, with these exact keys:
{{
  "case_id": "{case_id}",
  "cpt": "{cpt}",
  "condition": "{condition}",
  "selected_policy": "{policy_name}",
  "pa_required": "{pa_status}",
  "system_overall_result": "MET | NOT MET | UNKNOWN | CONFLICT",
  "missing_information": ["..."],
  "criterion_evaluations": [
    {{
      "criterion_id": "C1",
      "criterion": "...",
      "system_result": "MET | NOT MET | UNKNOWN | CONFLICT",
      "patient_evidence": "...",
      "policy_citation": "..."
    }}
  ],
  "notes": "..."
}}
"""

    raw_response = rag.call_llm(determination_prompt, json_mode=True)
    parsed_json = rag.extract_clean_json(raw_response)
    
    elapsed = round(time.time() - start_time, 2)
    parsed_json["case_id"] = case_id
    parsed_json["cpt"] = cpt
    parsed_json["condition"] = condition
    parsed_json["selected_policy"] = policy_name
    parsed_json["pa_required"] = pa_status
    parsed_json["runtime_seconds"] = elapsed
    parsed_json["timestamp"] = datetime.now().isoformat()

    return parsed_json

def run_harness(force: bool = False, limit: int = None, single_case: str = None):
    print("=" * 80)
    print("STARTING PRIOR AUTHORIZATION PIPELINE TESTING HARNESS")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Output Directory: {CASES_OUTPUT_DIR}")
    print("=" * 80)

    os.makedirs(CASES_OUTPUT_DIR, exist_ok=True)

    # Discover cases
    all_case_files = sorted([f for f in os.listdir(CASES_DIR) if f.startswith("SYN-") and f.endswith(".json")])
    if single_case:
        all_case_files = [f"{single_case}.json" if not single_case.endswith(".json") else single_case]
    elif limit:
        all_case_files = all_case_files[:limit]

    total_cases = len(all_case_files)
    print(f"Total cases queued for execution: {total_cases}")

    # Load master ledger if exists
    master_results = {}
    if os.path.exists(MASTER_RESULTS_FILE) and not force:
        try:
            with open(MASTER_RESULTS_FILE, "r", encoding="utf-8") as f:
                loaded = json.load(f)
                master_results = {r["case_id"]: r for r in loaded}
        except Exception:
            master_results = {}

    completed_count = 0
    skipped_count = 0

    for idx, fname in enumerate(all_case_files, 1):
        cid = fname.replace(".json", "")
        case_out_path = os.path.join(CASES_OUTPUT_DIR, f"{cid}.json")

        # Checkpoint check
        if os.path.exists(case_out_path) and not force and os.path.getsize(case_out_path) > 10:
            print(f"[{idx}/{total_cases}] Case {cid}: Already completed (checkpoint cached). Skipping.")
            if cid not in master_results:
                with open(case_out_path, "r", encoding="utf-8") as f:
                    master_results[cid] = json.load(f)
            skipped_count += 1
            continue

        print(f"\n[{idx}/{total_cases}] Running Case {cid}...")
        try:
            case_data, ehr_text = load_patient_case(cid)
            result = evaluate_patient_case(cid, case_data, ehr_text)
            
            # Save checkpoint
            with open(case_out_path, "w", encoding="utf-8") as f:
                json.dump(result, f, indent=2, ensure_ascii=False)

            master_results[cid] = result
            completed_count += 1

            overall = result.get("system_overall_result", "N/A")
            num_crits = len(result.get("criterion_evaluations", []))
            secs = result.get("runtime_seconds", 0)
            print(f"  -> Result: {overall} | Evaluated {num_crits} criteria | Runtime: {secs}s")

            # Adaptive throttling delay
            time.sleep(1.5)

        except Exception as e:
            print(f"  ERROR processing {cid}: {e}")
            import traceback
            traceback.print_exc()

        # Update master ledger incrementally
        with open(MASTER_RESULTS_FILE, "w", encoding="utf-8") as f:
            json.dump(list(master_results.values()), f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 80)
    print("TEST HARNESS BATCH RUN COMPLETE")
    print(f"Total Cases: {total_cases} | Completed: {completed_count} | Cached: {skipped_count}")
    print(f"Master Ledger saved to: {MASTER_RESULTS_FILE}")
    print("=" * 80)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Prior Authorization Testing Harness")
    parser.add_argument("--force", action="store_true", help="Re-run all cases bypassing checkpoint cache")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of cases to execute")
    parser.add_argument("--case", type=str, default=None, help="Execute a single case ID (e.g. SYN-001)")
    args = parser.parse_args()

    run_harness(force=args.force, limit=args.limit, single_case=args.case)
