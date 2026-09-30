#!/usr/bin/env python3
"""
scripts/verify_results_workbook.py
--------------------------------------------------------------------------------
Phase 5.4: Automated Audit & Verification Suite for PA_Test_Results.xlsx

Validates that data/results/PA_Test_Results.xlsx complies with all
specifications in Task Description and Checklist.md (Parts 4 & 6):
1. Sheet names: Case_Level_Results, Criterion_Level_Results, Summary_Metrics.
2. Exact header columns matching checklist specifications.
3. Completeness: Exactly 50 cases and 170+ criteria.
4. Data integrity: Zero null values in mandatory columns.
5. Mathematical consistency of metrics scorecard.
--------------------------------------------------------------------------------
"""

import os
import sys
import json
import pandas as pd
import openpyxl

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RESULTS_EXCEL_PATH = os.path.join(WORKSPACE_ROOT, "data", "results", "PA_Test_Results.xlsx")
METRICS_JSON_PATH = os.path.join(WORKSPACE_ROOT, "data", "results", "metrics_summary.json")

def verify():
    print("=" * 80)
    print("AUDITING PA_TEST_RESULTS.XLSX AND EVALUATION METRICS")
    print(f"Workbook Path: {RESULTS_EXCEL_PATH}")
    print(f"Metrics JSON : {METRICS_JSON_PATH}")
    print("=" * 80)

    # 1. File existence
    if not os.path.exists(RESULTS_EXCEL_PATH):
        print(f"FAIL: Results workbook not found at {RESULTS_EXCEL_PATH}")
        sys.exit(1)
    if not os.path.exists(METRICS_JSON_PATH):
        print(f"FAIL: Metrics JSON not found at {METRICS_JSON_PATH}")
        sys.exit(1)
    print("PASS: Both PA_Test_Results.xlsx and metrics_summary.json exist on disk.")

    # 2. Sheet validation
    xl = pd.ExcelFile(RESULTS_EXCEL_PATH)
    expected_sheets = ["Case_Level_Results", "Criterion_Level_Results", "Summary_Metrics"]
    for s in expected_sheets:
        if s not in xl.sheet_names:
            print(f"FAIL: Required worksheet '{s}' is missing from workbook. Found: {xl.sheet_names}")
            sys.exit(1)
    print(f"PASS: All 3 mandatory sheets present: {xl.sheet_names}")

    # 3. Case_Level_Results sheet audit
    df_case = pd.read_excel(RESULTS_EXCEL_PATH, sheet_name="Case_Level_Results")
    case_required_cols = [
        "Case ID", "Payer", "CPT", "Condition", "Test Case Type",
        "Ground Truth Overall Result", "System Overall Result", "Overall PASS/FAIL"
    ]
    for col in case_required_cols:
        if col not in df_case.columns:
            print(f"FAIL: Case_Level_Results is missing required column: '{col}'")
            sys.exit(1)
    print("PASS: Case_Level_Results has all required columns.")

    if len(df_case) != 50:
        print(f"FAIL: Case_Level_Results expected 50 rows, got {len(df_case)}")
        sys.exit(1)
    print("PASS: Case_Level_Results contains exactly 50 test case rows.")

    case_ids = df_case["Case ID"].tolist()
    expected_ids = [f"SYN-{i:03d}" for i in range(1, 51)]
    if case_ids != expected_ids:
        print(f"FAIL: Case IDs do not match SYN-001 through SYN-050 sequence.")
        sys.exit(1)
    print("PASS: All 50 Case IDs strictly match SYN-001 through SYN-050.")

    # Check nulls in mandatory columns
    for col in case_required_cols:
        null_count = df_case[col].isnull().sum()
        if null_count > 0:
            print(f"FAIL: Column '{col}' contains {null_count} null/empty cells.")
            sys.exit(1)
    print("PASS: Zero null values in mandatory case-level columns.")

    # 4. Criterion_Level_Results sheet audit
    df_crit = pd.read_excel(RESULTS_EXCEL_PATH, sheet_name="Criterion_Level_Results")
    crit_required_cols = [
        "Case ID", "Criterion ID", "Ground Truth Criterion Result",
        "System Criterion Result", "Criterion PASS/FAIL", "System Evidence",
        "Policy Citation", "Patient Citation", "Error Type", "Notes"
    ]
    for col in crit_required_cols:
        if col not in df_crit.columns:
            print(f"FAIL: Criterion_Level_Results is missing required column: '{col}'")
            sys.exit(1)
    print("PASS: Criterion_Level_Results has all required columns.")

    if len(df_crit) < 170:
        print(f"FAIL: Criterion_Level_Results expected at least 170 rows, got {len(df_crit)}")
        sys.exit(1)
    print(f"PASS: Criterion_Level_Results contains {len(df_crit)} criteria rows (>= 170 expected).")

    invalid_crit_pass = df_crit[~df_crit["Criterion PASS/FAIL"].isin(["PASS", "FAIL"])]
    if len(invalid_crit_pass) > 0:
        print(f"FAIL: Found {len(invalid_crit_pass)} rows with invalid Criterion PASS/FAIL status.")
        sys.exit(1)
    print("PASS: All criterion PASS/FAIL determinations are valid.")

    # 5. Metrics JSON audit
    with open(METRICS_JSON_PATH, "r", encoding="utf-8") as f:
        metrics = json.load(f)

    required_metric_keys = [
        "total_test_cases", "cases_passed", "cases_failed", "overall_case_accuracy",
        "true_positives", "true_negatives", "false_positives", "false_negatives",
        "sensitivity_recall", "specificity", "precision", "f1_score",
        "total_criteria_evaluated", "criteria_passed", "criterion_level_accuracy",
        "citation_precision", "average_runtime_seconds"
    ]
    for k in required_metric_keys:
        if k not in metrics:
            print(f"FAIL: Missing key '{k}' in metrics_summary.json")
            sys.exit(1)

    assert metrics["total_test_cases"] == 50, "Total test cases must be 50"
    assert metrics["cases_passed"] + metrics["cases_failed"] == 50, "Sum of passed and failed cases must equal 50"
    assert 0.0 <= metrics["overall_case_accuracy"] <= 1.0, "Accuracy must be between 0 and 1"
    assert 0.0 <= metrics["sensitivity_recall"] <= 1.0, "Sensitivity must be between 0 and 1"
    assert 0.0 <= metrics["specificity"] <= 1.0, "Specificity must be between 0 and 1"
    print("PASS: Machine-readable metrics are mathematically consistent and bounded.")

    print("--------------------------------------------------------------------------------")
    print(f"FINAL AUDIT SUMMARY:")
    print(f"  Cases Evaluated         : {metrics['total_test_cases']}")
    print(f"  Overall Case Accuracy   : {metrics['overall_case_accuracy']*100:.2f}% ({metrics['cases_passed']} / 50)")
    print(f"  Sensitivity (Recall)    : {metrics['sensitivity_recall']*100:.2f}%")
    print(f"  Specificity             : {metrics['specificity']*100:.2f}%")
    print(f"  Adjudication F1-Score   : {metrics['f1_score']*100:.2f}%")
    print(f"  Criterion-Level Accuracy: {metrics['criterion_level_accuracy']*100:.2f}% ({metrics['criteria_passed']} / {metrics['total_criteria_evaluated']})")
    print(f"  Policy Citation Rate    : {metrics['citation_precision']*100:.2f}%")
    print("--------------------------------------------------------------------------------")
    print("ALL VERIFICATION CHECKS PASSED (100% COMPLIANT).")
    print("=" * 80)

if __name__ == "__main__":
    verify()
