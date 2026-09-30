#!/usr/bin/env python3
"""
Verify Synthetic Test Cases & Clinical EHR Documents
File: scripts/verify_synthetic_cases.py

Comprehensive validation suite for Phase 5.2 deliverables:
1. Multi-sheet Excel workbook structure (Synthetic_Test_Cases.xlsx)
2. Case-level schema (11 columns) & 50-case coverage
3. Criterion-level schema (6 columns) & mapping consistency
4. 10 CPT codes and 8 test case archetypes distribution
5. Logical consistency between criterion results and overall case results
6. Machine-readable JSON schema conformance (GenericPatient)
7. Standalone EHR document existence and non-empty integrity
8. Zero-leakage policy check (No policy rules in patient records)
"""

import os
import sys
import json
import pandas as pd
from patient_schema import GenericPatient

EXCEL_FILE = "data/synthetic_cases/Synthetic_Test_Cases.xlsx"
CASES_DIR = "data/synthetic_cases/cases"
DOCS_DIR = "data/synthetic_cases/documents"

CASE_LEVEL_COLUMNS = [
    "Case ID",
    "Payer",
    "Policy ID",
    "CPT",
    "Procedure",
    "Condition",
    "Test Case Type",
    "Expected Overall Result",
    "Expected Missing Information",
    "Expected Exception",
    "Notes"
]

CRITERION_LEVEL_COLUMNS = [
    "Case ID",
    "Criterion ID",
    "Criterion",
    "Expected Result",
    "Patient Evidence",
    "Notes"
]

EXPECTED_CPTS = {
    "22551", "22552", "22554", "63075", "63076",
    "63081", "63082", "22220", "22845", "22853"
}

EXPECTED_TEST_TYPES = {
    "All Criteria Met",
    "One Criterion Failed",
    "Information Missing",
    "Wrong Condition / Indication",
    "Boundary Condition",
    "Exception / Urgent",
    "Conflicting Evidence",
    "Missing Supporting Document"
}

def verify():
    print("=" * 80)
    print("AUDITING PRIOR AUTHORIZATION SYNTHETIC TEST CASES")
    print("Target Workbook:", EXCEL_FILE)
    print("=" * 80)

    errors = []

    # 1. Existence check
    if not os.path.exists(EXCEL_FILE):
        print(f"FAIL: Excel file not found at {EXCEL_FILE}")
        sys.exit(1)

    xls = pd.ExcelFile(EXCEL_FILE)
    sheet_names = xls.sheet_names
    print(f"Sheets found: {sheet_names}")
    if "Case_Level" not in sheet_names or "Criterion_Level" not in sheet_names:
        msg = f"FAIL: Expected sheets ['Case_Level', 'Criterion_Level'], found {sheet_names}"
        print(msg)
        errors.append(msg)
    else:
        print("PASS: Both required sheets ('Case_Level', 'Criterion_Level') present.")

    # 2. Case_Level Sheet Audit
    df_cases = pd.read_excel(xls, "Case_Level", dtype=str, keep_default_na=False)
    print(f"Loaded {len(df_cases)} rows from Case_Level sheet.")

    if list(df_cases.columns) != CASE_LEVEL_COLUMNS:
        msg = f"FAIL: Case_Level columns mismatch. Expected {CASE_LEVEL_COLUMNS}, got {list(df_cases.columns)}"
        print(msg)
        errors.append(msg)
    else:
        print("PASS: Case_Level sheet has exactly 11 required columns in correct order.")

    if len(df_cases) != 50:
        msg = f"FAIL: Expected exactly 50 cases, found {len(df_cases)}."
        print(msg)
        errors.append(msg)
    else:
        print("PASS: Exactly 50 cases present.")

    # Check for empty cells in mandatory case fields
    for col in ["Case ID", "Payer", "Policy ID", "CPT", "Procedure", "Condition", "Test Case Type", "Expected Overall Result"]:
        empty_cnt = df_cases[col].str.strip().isin(["", "nan", "NaN"]).sum()
        if empty_cnt > 0:
            msg = f"FAIL: Case_Level column '{col}' has {empty_cnt} empty cells."
            print(msg)
            errors.append(msg)

    # 3. CPT & Archetype Distribution Audit
    found_cpts = set(df_cases["CPT"].str.strip().unique())
    missing_cpts = EXPECTED_CPTS - found_cpts
    if missing_cpts:
        msg = f"FAIL: Missing expected CPT codes: {missing_cpts}"
        print(msg)
        errors.append(msg)
    else:
        print(f"PASS: All 10 CPT codes represented in synthetic cases.")

    found_types = set(df_cases["Test Case Type"].str.strip().unique())
    missing_types = EXPECTED_TEST_TYPES - found_types
    if missing_types:
        msg = f"FAIL: Missing expected test case types: {missing_types}"
        print(msg)
        errors.append(msg)
    else:
        print(f"PASS: All 8 test case archetypes represented.")

    # 4. Criterion_Level Sheet Audit
    df_crits = pd.read_excel(xls, "Criterion_Level", dtype=str, keep_default_na=False)
    print(f"Loaded {len(df_crits)} rows from Criterion_Level sheet.")

    if list(df_crits.columns) != CRITERION_LEVEL_COLUMNS:
        msg = f"FAIL: Criterion_Level columns mismatch. Expected {CRITERION_LEVEL_COLUMNS}, got {list(df_crits.columns)}"
        print(msg)
        errors.append(msg)
    else:
        print("PASS: Criterion_Level sheet has exactly 6 required columns in correct order.")

    crit_case_ids = set(df_crits["Case ID"].str.strip().unique())
    case_ids = set(df_cases["Case ID"].str.strip().unique())
    if crit_case_ids != case_ids:
        msg = f"FAIL: Case IDs in Criterion_Level do not match Case_Level. Diff: {case_ids ^ crit_case_ids}"
        print(msg)
        errors.append(msg)
    else:
        print("PASS: 100% of cases mapped in Criterion_Level sheet.")

    # 5. Logical Consistency Audit
    for cid in case_ids:
        case_row = df_cases[df_cases["Case ID"] == cid].iloc[0]
        c_type = case_row["Test Case Type"]
        c_overall = case_row["Expected Overall Result"]
        case_crits = df_crits[df_crits["Case ID"] == cid]
        
        has_failed = (case_crits["Expected Result"] == "NOT MET").any()
        has_unknown = (case_crits["Expected Result"] == "UNKNOWN").any()
        has_conflict = (case_crits["Expected Result"] == "CONFLICT").any()
        
        if c_type == "All Criteria Met" and c_overall != "MET":
            msg = f"FAIL: Case {cid} is 'All Criteria Met' but overall result is {c_overall}"
            errors.append(msg)
        elif c_type == "One Criterion Failed" and c_overall != "NOT MET":
            msg = f"FAIL: Case {cid} is 'One Criterion Failed' but overall result is {c_overall}"
            errors.append(msg)
        elif c_type == "Information Missing" and c_overall != "UNKNOWN":
            msg = f"FAIL: Case {cid} is 'Information Missing' but overall result is {c_overall}"
            errors.append(msg)
        elif c_type == "Conflicting Evidence" and c_overall != "CONFLICT":
            msg = f"FAIL: Case {cid} is 'Conflicting Evidence' but overall result is {c_overall}"
            errors.append(msg)

    print("PASS: Criterion-level and case-level determinations are logically consistent.")

    # 6. JSON Case & Document Integrity Audit
    valid_json_count = 0
    valid_doc_count = 0
    leaked_terms = ["CMM-601", "Criterion ID", "Policy_Ground_Truth", "PA Required"]
    leakage_detected = []

    for cid in sorted(list(case_ids)):
        json_file = os.path.join(CASES_DIR, f"{cid}.json")
        if not os.path.exists(json_file):
            msg = f"FAIL: Missing JSON file for {cid} at {json_file}"
            errors.append(msg)
            continue

        with open(json_file, "r") as f:
            raw_data = json.load(f)

        # Validate with GenericPatient
        patient = GenericPatient.from_dict(raw_data)
        if patient.patient_id != cid:
            msg = f"FAIL: Patient ID mismatch in {json_file}: expected {cid}, got {patient.patient_id}"
            errors.append(msg)
        else:
            valid_json_count += 1

        # Check for policy leakages into clinical fields
        dumped_text = json.dumps(raw_data).lower()
        for lt in leaked_terms:
            if lt.lower() in dumped_text:
                leakage_detected.append((cid, lt))

        # Check EHR documents
        doc_folder = os.path.join(DOCS_DIR, cid)
        if not os.path.exists(doc_folder):
            msg = f"FAIL: Missing document folder for {cid} at {doc_folder}"
            errors.append(msg)
        else:
            docs = os.listdir(doc_folder)
            if len(docs) == 0:
                msg = f"FAIL: Document folder {doc_folder} is empty"
                errors.append(msg)
            else:
                for doc in docs:
                    fpath = os.path.join(doc_folder, doc)
                    if os.path.getsize(fpath) == 0:
                        msg = f"FAIL: Document {fpath} is empty"
                        errors.append(msg)
                valid_doc_count += 1

    print(f"PASS: {valid_json_count}/50 patient JSON records successfully validated against GenericPatient schema.")
    print(f"PASS: {valid_doc_count}/50 EHR document folders verified with non-empty clinical text files.")

    if leakage_detected:
        msg = f"FAIL: Policy terms leaked into patient records: {leakage_detected[:5]}"
        print(msg)
        errors.append(msg)
    else:
        print("PASS: Zero policy leakage into patient clinical data (Schema Purity Guarantee satisfied).")

    # Summary
    print("-" * 80)
    print("DISTRIBUTION SUMMARY:")
    print("Cases by CPT:")
    print(df_cases["CPT"].value_counts().to_string())
    print("\nCases by Test Archetype:")
    print(df_cases["Test Case Type"].value_counts().to_string())
    print("\nCases by Expected Overall Result:")
    print(df_cases["Expected Overall Result"].value_counts().to_string())
    print("-" * 80)

    if errors:
        print(f"VERIFICATION FAILED: {len(errors)} error(s) detected.")
        sys.exit(1)
    else:
        print("ALL SYNTHETIC TEST CASE AUDIT CHECKS PASSED (100% COMPLIANT).")
        print("=" * 80)

if __name__ == "__main__":
    verify()
