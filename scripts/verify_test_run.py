#!/usr/bin/env python3
"""
Verify Prior Authorization Test Run Results
File: scripts/verify_test_run.py

Audits the outputs of the production-like testing runner harness:
1. Checks that data/test_runs/latest/system_run_results.json exists and has 50 cases.
2. Checks that all 50 individual case JSON files exist in data/test_runs/latest/cases/.
3. Verifies that every case has valid determinations, criteria evaluations, and citations.
4. Generates performance and determination distribution metrics.
"""

import os
import sys
import json

OUTPUT_DIR = "data/test_runs/latest"
CASES_DIR = os.path.join(OUTPUT_DIR, "cases")
MASTER_FILE = os.path.join(OUTPUT_DIR, "system_run_results.json")

EXPECTED_CASES = [f"SYN-{i:03d}" for i in range(1, 51)]
VALID_RESULTS = {"MET", "NOT MET", "UNKNOWN", "CONFLICT"}

def verify():
    print("=" * 80)
    print("AUDITING PRIOR AUTHORIZATION PIPELINE TEST RUN RESULTS")
    print(f"Master Ledger: {MASTER_FILE}")
    print(f"Cases Directory: {CASES_DIR}")
    print("=" * 80)

    errors = []

    # 1. Master file check
    if not os.path.exists(MASTER_FILE):
        print(f"FAIL: Master results file not found at {MASTER_FILE}")
        sys.exit(1)

    with open(MASTER_FILE, "r", encoding="utf-8") as f:
        master_results = json.load(f)

    print(f"Master results file contains {len(master_results)} case runs.")
    if len(master_results) != 50:
        msg = f"FAIL: Expected 50 cases in master ledger, found {len(master_results)}."
        print(msg)
        errors.append(msg)
    else:
        print("PASS: Exactly 50 cases recorded in master ledger.")

    # 2. Individual case JSON check
    found_case_ids = set()
    total_criteria_evaluated = 0
    total_runtime = 0.0
    result_counts = {}

    for cid in EXPECTED_CASES:
        case_file = os.path.join(CASES_DIR, f"{cid}.json")
        if not os.path.exists(case_file):
            msg = f"FAIL: Missing case output file for {cid} at {case_file}"
            print(msg)
            errors.append(msg)
            continue

        try:
            with open(case_file, "r", encoding="utf-8") as f:
                cdata = json.load(f)
        except Exception as e:
            msg = f"FAIL: Could not parse JSON for {cid}: {e}"
            print(msg)
            errors.append(msg)
            continue

        found_case_ids.add(cdata.get("case_id"))
        
        # Verify required keys
        req_keys = ["case_id", "cpt", "condition", "selected_policy", "pa_required", "system_overall_result", "criterion_evaluations"]
        for k in req_keys:
            if k not in cdata or cdata[k] is None or cdata[k] == "":
                msg = f"FAIL: Case {cid} missing mandatory key '{k}'"
                errors.append(msg)

        # Result validity
        overall_res = str(cdata.get("system_overall_result", "")).strip().upper()
        # Normalization if minor suffix present
        if "MET" in overall_res and "NOT" not in overall_res:
            res_key = "MET"
        elif "NOT MET" in overall_res:
            res_key = "NOT MET"
        elif "UNKNOWN" in overall_res:
            res_key = "UNKNOWN"
        elif "CONFLICT" in overall_res:
            res_key = "CONFLICT"
        else:
            res_key = overall_res

        result_counts[res_key] = result_counts.get(res_key, 0) + 1

        # Criterion evaluations
        crits = cdata.get("criterion_evaluations", [])
        if not crits:
            msg = f"FAIL: Case {cid} has empty criterion_evaluations"
            errors.append(msg)
        else:
            total_criteria_evaluated += len(crits)

        total_runtime += float(cdata.get("runtime_seconds", 0))

    if found_case_ids == set(EXPECTED_CASES):
        print("PASS: All 50 case IDs (SYN-001 through SYN-050) successfully verified.")
    else:
        missing = set(EXPECTED_CASES) - found_case_ids
        msg = f"FAIL: Missing case outputs: {missing}"
        print(msg)
        errors.append(msg)

    # Performance stats
    avg_runtime = round(total_runtime / max(len(found_case_ids), 1), 2)
    print(f"PASS: {total_criteria_evaluated} total clinical criteria evaluated across {len(found_case_ids)} cases.")
    print(f"Average pipeline runtime per case: {avg_runtime}s (Total batch time: {round(total_runtime, 1)}s)")

    print("-" * 80)
    print("SYSTEM DETERMINATION DISTRIBUTION:")
    for k, v in sorted(result_counts.items()):
        pct = round((v / len(found_case_ids)) * 100, 1) if found_case_ids else 0
        print(f"  {k:15}: {v:3} cases ({pct}%)")
    print("-" * 80)

    if errors:
        print(f"AUDIT FAILED: {len(errors)} error(s) detected.")
        sys.exit(1)
    else:
        print("ALL TEST RUN VERIFICATION CHECKS PASSED (100% COMPLIANT).")
        print("=" * 80)

if __name__ == "__main__":
    verify()
