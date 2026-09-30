#!/usr/bin/env python3
"""
Synthetic Case Matrix Definition
File: scripts/case_matrix.py

Defines the distribution and clinical parameters for 50 synthetic test cases
spanning all 10 CPT codes and all 8 test case archetypes:
1. All Criteria Met (MET)
2. One Criterion Failed (NOT MET)
3. Information Missing (UNKNOWN)
4. Wrong Condition / Indication (NOT MET)
5. Boundary Condition (Threshold edges)
6. Exception / Urgent (MET via bypass)
7. Conflicting Evidence (CONFLICT / REVIEW)
8. Missing Supporting Document (MISSING DOCUMENT / UNKNOWN)

Every case defines both case-level metadata and criterion-level expected evaluations.
"""

from typing import List, Dict, Any

PAYER = "Cigna / EviCore by Evernorth"
POLICY_ID = "CMM-601"

def get_case_matrix() -> List[Dict[str, Any]]:
    cases = []

    # =========================================================================
    # CPT 22551 (8 Cases: SYN-001 to SYN-008)
    # Procedure: Arthrodesis, anterior interbody, cervical below C2 (ACDF single level)
    # =========================================================================
    cases.append({
        "case_id": "SYN-001",
        "cpt": "22551",
        "condition": "Cervical Radiculopathy",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Classic textbook cervical radiculopathy at C5-C6 with 8 weeks PT, concordant MRI foraminal stenosis, negative cotinine.",
        "patient_params": {
            "age": 48, "sex": "F", "level": "C5-C6", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 right biceps weakness",
            "exam_sensory": "C6 hypoesthesia", "exam_reflex": "1+ right biceps", "spurling": "positive",
            "xray_flex_ext": "Dynamic X-rays normal, no translation", "mri_finding": "C5-C6 herniated disc with right C6 nerve root compression",
            "cotinine_result": "Negative (<10 ng/mL)", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {} # All MET
    })

    cases.append({
        "case_id": "SYN-002",
        "cpt": "22551",
        "condition": "Cervical Radiculopathy",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C4: Patient completed only 3 weeks of physical therapy instead of mandatory 6 weeks.",
        "patient_params": {
            "age": 52, "sex": "M", "level": "C6-C7", "symptom_weeks": 6, "pt_weeks": 3, "pt_sessions": 6,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 triceps weakness",
            "exam_sensory": "C7 hypoesthesia", "exam_reflex": "1+ right triceps", "spurling": "positive",
            "xray_flex_ext": "Normal dynamic views", "mri_finding": "C6-C7 disc extrusion with left C7 nerve root compression",
            "cotinine_result": "Negative (<10 ng/mL)", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C4": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-003",
        "cpt": "22551",
        "condition": "Cervical Radiculopathy",
        "test_type": "Information Missing",
        "expected_overall": "UNKNOWN",
        "expected_missing": "Documentation of nicotine-free status (cotinine test absent)",
        "expected_exception": "—",
        "notes": "Missing Criterion C8: Medical record does not contain smoking cessation documentation or cotinine lab test.",
        "patient_params": {
            "age": 55, "sex": "M", "level": "C5-C6", "symptom_weeks": 14, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 biceps weakness",
            "exam_sensory": "C6 dermatomal deficit", "exam_reflex": "1+ right brachioradialis", "spurling": "positive",
            "xray_flex_ext": "Dynamic X-rays completed", "mri_finding": "C5-C6 disc extrusion with C6 compression",
            "cotinine_result": None, "smoker_status": "unknown / not documented",
            "mental_health": "normal", "missing_field": "cotinine_test", "conflict": False
        },
        "criterion_overrides": {"C8": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-004",
        "cpt": "22551",
        "condition": "Axial Neck Pain without Radiculopathy",
        "test_type": "Wrong Condition / Indication",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Indication is isolated axial mechanical neck pain without neurological radiculopathy or myelopathy (Non-indication under CMM-601.9).",
        "patient_params": {
            "age": 41, "sex": "F", "level": "C4-C5", "symptom_weeks": 20, "pt_weeks": 10, "pt_sessions": 20,
            "pain_daily": True, "radicular_pain": False, "exam_motor": "5/5 normal strength throughout",
            "exam_sensory": "Intact sensations", "exam_reflex": "2+ symmetric", "spurling": "negative",
            "xray_flex_ext": "Mild disc space narrowing C4-C5", "mri_finding": "Mild disc desiccation C4-C5 without neural foraminal stenosis or cord compression",
            "cotinine_result": "Negative (<10 ng/mL)", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C2": "NOT MET", "C3": "NOT MET", "C6": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-005",
        "cpt": "22551",
        "condition": "Cervical Radiculopathy",
        "test_type": "Boundary Condition",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Threshold boundary testing: Patient completed exactly 6 weeks (42 days) of physical therapy, meeting the threshold.",
        "patient_params": {
            "age": 60, "sex": "F", "level": "C6-C7", "symptom_weeks": 7, "pt_weeks": 6, "pt_sessions": 12,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 triceps weakness",
            "exam_sensory": "C7 dermatomal paresthesias", "exam_reflex": "Trace triceps", "spurling": "positive",
            "xray_flex_ext": "Dynamic X-rays completed", "mri_finding": "C6-C7 foraminal stenosis with C7 root abutment",
            "cotinine_result": "Negative (<10 ng/mL)", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {} # Exactly at boundary -> MET
    })

    cases.append({
        "case_id": "SYN-006",
        "cpt": "22551",
        "condition": "Cervical Radiculopathy / Emergency Deficit",
        "test_type": "Exception / Urgent",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "Confirmed urgent condition: Rapidly progressive grade 2/5 motor weakness bypasses conservative therapy (CMM-601.1)",
        "notes": "Urgent/Emergent bypass: Patient presents with acute, rapidly progressive grade 2/5 right wrist drop and biceps weakness. Conservative care and nicotine wait waived.",
        "patient_params": {
            "age": 45, "sex": "M", "level": "C5-C6", "symptom_weeks": 1, "pt_weeks": 0, "pt_sessions": 0,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "2/5 severe weakness right biceps and wrist extension",
            "exam_sensory": "C6 numbness", "exam_reflex": "Absent right biceps reflex", "spurling": "positive",
            "xray_flex_ext": "Not performed due to acute acute motor loss", "mri_finding": "C5-C6 massive herniated disc fragment with acute neural compression",
            "cotinine_result": "Positive (active smoker)", "smoker_status": "active smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False, "urgent": True
        },
        "criterion_overrides": {"C4": "MET (Bypassed)", "C5": "MET (Bypassed)", "C8": "MET (Bypassed)"}
    })

    cases.append({
        "case_id": "SYN-007",
        "cpt": "22551",
        "condition": "Cervical Radiculopathy",
        "test_type": "Conflicting Evidence",
        "expected_overall": "CONFLICT",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Clinic note documents severe right-sided C6 radiculopathy, but official MRI report explicitly reads completely normal patent C5-C6 foramina bilaterally.",
        "patient_params": {
            "age": 49, "sex": "F", "level": "C5-C6", "symptom_weeks": 10, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 right biceps weakness",
            "exam_sensory": "C6 sensory loss", "exam_reflex": "1+ biceps", "spurling": "positive",
            "xray_flex_ext": "Normal", "mri_finding": "Normal cervical spine MRI. Unremarkable disc morphology, patent neural foramina at C5-C6 bilaterally.",
            "cotinine_result": "Negative (<10 ng/mL)", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": True
        },
        "criterion_overrides": {"C6": "CONFLICT"}
    })

    cases.append({
        "case_id": "SYN-008",
        "cpt": "22551",
        "condition": "Cervical Myelopathy",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Cervical myelopathy with ataxic gait, Hoffmann sign, and MRI showing cervical spinal cord compression with cord signal change.",
        "patient_params": {
            "age": 67, "sex": "M", "level": "C4-C5", "symptom_weeks": 16, "pt_weeks": 0, "pt_sessions": 0,
            "pain_daily": True, "radicular_pain": False, "exam_motor": "Diffuse 4/5 upper extremity weakness, clumsiness buttoning shirts",
            "exam_sensory": "Loss of proprioception fingertips", "exam_reflex": "Hyperreflexia 3+ bilaterally", "spurling": "negative",
            "xray_flex_ext": "Severe degenerative spondylosis C4-C5", "mri_finding": "C4-C5 severe cervical spinal canal stenosis with cord compression and intrinsic T2 hyperintensity",
            "cotinine_result": "Negative (<10 ng/mL)", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    # =========================================================================
    # CPT 22552 (4 Cases: SYN-009 to SYN-012)
    # Procedure: Arthrodesis anterior interbody each additional interspace (Add-on)
    # =========================================================================
    cases.append({
        "case_id": "SYN-009",
        "cpt": "22552",
        "condition": "Multi-Level Cervical Radiculopathy",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Two-level ACDF C5-C6 (22551) and C6-C7 (22552). Both levels demonstrate multi-level concordant neural compression on MRI.",
        "patient_params": {
            "age": 54, "sex": "M", "level": "C6-C7 (Add-on to C5-C6)", "symptom_weeks": 16, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 biceps and triceps weakness",
            "exam_sensory": "C6 and C7 sensory loss", "exam_reflex": "Depressed C6/C7 reflexes", "spurling": "positive",
            "xray_flex_ext": "Two-level degenerative disc disease", "mri_finding": "Two-level severe stenosis: C5-C6 and C6-C7 disc protrusions with foraminal nerve root compression",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-010",
        "cpt": "22552",
        "condition": "Multi-Level Cervical Spondylosis",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Add-on interspace C6-C7 lacks evidence of neural compression or instability (prophylactic fusion excluded under CMM-601.9).",
        "patient_params": {
            "age": 58, "sex": "F", "level": "C6-C7 (Add-on to C5-C6)", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 biceps weakness, 5/5 triceps",
            "exam_sensory": "C6 sensory loss only, C7 intact", "exam_reflex": "Depressed C6 reflex only", "spurling": "positive right",
            "xray_flex_ext": "Normal stability C6-C7", "mri_finding": "C5-C6 severe right foraminal stenosis; C6-C7 normal disc height without stenosis or neural impingement",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C2": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-011",
        "cpt": "22552",
        "condition": "Multi-Level Cervical Radiculopathy",
        "test_type": "Missing Supporting Document",
        "expected_overall": "UNKNOWN",
        "expected_missing": "MRI or CT imaging report covering the add-on interspace level",
        "expected_exception": "—",
        "notes": "Surgical request includes C6-C7 add-on level, but submitted MRI report only covers C3-C6.",
        "patient_params": {
            "age": 51, "sex": "M", "level": "C6-C7 (Add-on)", "symptom_weeks": 10, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "Biceps weakness", "exam_sensory": "Sensory deficit",
            "exam_reflex": "Abnormal reflexes", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "MRI imaging limited to C3-C6; lower cervical spine C6-C7 not visualized",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": "mri_addon_level", "conflict": False
        },
        "criterion_overrides": {"C2": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-012",
        "cpt": "22552",
        "condition": "Multi-Level Cervical Disease",
        "test_type": "Boundary Condition",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Standalone billing of add-on code 22552 without the primary procedure code 22551/22554.",
        "patient_params": {
            "age": 62, "sex": "M", "level": "C6-C7 alone", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "Weakness", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "Foraminal stenosis C6-C7", "cotinine_result": "Negative", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET"}
    })

    # =========================================================================
    # CPT 22554 (5 Cases: SYN-013 to SYN-017)
    # Procedure: Arthrodesis anterior interbody minimal discectomy below C2
    # =========================================================================
    cases.append({
        "case_id": "SYN-013",
        "cpt": "22554",
        "condition": "Cervical Radiculopathy",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Anterior cervical fusion below C2 with minimal discectomy meeting all primary criteria.",
        "patient_params": {
            "age": 47, "sex": "F", "level": "C4-C5", "symptom_weeks": 14, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 deltoid/biceps weakness",
            "exam_sensory": "C5 numbness", "exam_reflex": "Depressed biceps", "spurling": "positive",
            "xray_flex_ext": "Completed", "mri_finding": "C4-C5 disc extrusion with C5 nerve root compression",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-014",
        "cpt": "22554",
        "condition": "Cervical Radiculopathy",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C2: Zero conservative therapy attempted prior to surgical request.",
        "patient_params": {
            "age": 53, "sex": "M", "level": "C5-C6", "symptom_weeks": 4, "pt_weeks": 0, "pt_sessions": 0,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 biceps weakness",
            "exam_sensory": "C6 sensory loss", "exam_reflex": "Depressed", "spurling": "positive",
            "xray_flex_ext": "Normal", "mri_finding": "C5-C6 disc bulge with mild stenosis",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C2": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-015",
        "cpt": "22554",
        "condition": "Cervical Spondylosis",
        "test_type": "Information Missing",
        "expected_overall": "UNKNOWN",
        "expected_missing": "Dynamic flexion/extension lateral plain X-ray report",
        "expected_exception": "—",
        "notes": "Criterion C3 Missing: Required flexion/extension dynamic lateral plain X-rays not submitted.",
        "patient_params": {
            "age": 56, "sex": "F", "level": "C5-C6", "symptom_weeks": 10, "pt_weeks": 6, "pt_sessions": 12,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 motor", "exam_sensory": "Sensory deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": None,
            "mri_finding": "C5-C6 stenosis", "cotinine_result": "Negative", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": "xray_flex_ext", "conflict": False
        },
        "criterion_overrides": {"C3": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-016",
        "cpt": "22554",
        "condition": "Postural Neck Strain",
        "test_type": "Wrong Condition / Indication",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Diagnosis is muscular tension headache and neck strain; no radicular or cord pathology present.",
        "patient_params": {
            "age": 36, "sex": "M", "level": "C4-C5", "symptom_weeks": 8, "pt_weeks": 6, "pt_sessions": 12,
            "pain_daily": True, "radicular_pain": False, "exam_motor": "5/5 normal", "exam_sensory": "Intact",
            "exam_reflex": "2+ normal", "spurling": "negative", "xray_flex_ext": "Normal",
            "mri_finding": "Normal cervical MRI without disc pathology", "cotinine_result": "Negative", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET", "C3": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-017",
        "cpt": "22554",
        "condition": "Cervical Radiculopathy",
        "test_type": "Boundary Condition",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Conservative treatment boundary failure: 5 weeks and 5 days of PT (39 days total), falling short of >=6 weeks.",
        "patient_params": {
            "age": 44, "sex": "F", "level": "C5-C6", "symptom_weeks": 6, "pt_weeks": 5.5, "pt_sessions": 10,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 weakness", "exam_sensory": "C6 deficit",
            "exam_reflex": "1+ reflex", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "C5-C6 disc extrusion with foraminal compression", "cotinine_result": "Negative", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C2": "NOT MET"}
    })

    # =========================================================================
    # CPT 63075 (5 Cases: SYN-018 to SYN-022)
    # Procedure: Discectomy anterior single interspace cervical
    # =========================================================================
    cases.append({
        "case_id": "SYN-018",
        "cpt": "63075",
        "condition": "Cervical Disc Herniation / Radiculopathy",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Anterior discectomy with decompression performed concurrently with cervical arthrodesis meeting all clinical criteria.",
        "patient_params": {
            "age": 50, "sex": "M", "level": "C5-C6", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 right biceps weakness",
            "exam_sensory": "C6 numbness", "exam_reflex": "1+ biceps", "spurling": "positive",
            "xray_flex_ext": "Normal stability", "mri_finding": "C5-C6 large disc herniation compressing C6 nerve root",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-019",
        "cpt": "63075",
        "condition": "Cervical Disc Herniation",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C1: Surgical plan requests standalone anterior cervical discectomy WITHOUT fusion (prohibited by CMM-601.3).",
        "patient_params": {
            "age": 42, "sex": "F", "level": "C5-C6", "symptom_weeks": 10, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 biceps weakness",
            "exam_sensory": "C6 sensory deficit", "exam_reflex": "1+ biceps", "spurling": "positive",
            "xray_flex_ext": "Normal", "mri_finding": "C5-C6 disc extrusion with C6 root compression",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal",
            "missing_field": None, "conflict": False, "standalone_discectomy": True
        },
        "criterion_overrides": {"C1": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-020",
        "cpt": "63075",
        "condition": "Cervical Disc Herniation / Radiculopathy",
        "test_type": "Information Missing",
        "expected_overall": "UNKNOWN",
        "expected_missing": "Cervical spine MRI or CT report",
        "expected_exception": "—",
        "notes": "Criterion C3 Missing: No post-contrast or pre-contrast MRI/CT report submitted.",
        "patient_params": {
            "age": 55, "sex": "M", "level": "C5-C6", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 motor", "exam_sensory": "Sensory deficit",
            "exam_reflex": "1+ reflex", "spurling": "positive", "xray_flex_ext": "Normal", "mri_finding": None,
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": "mri_report", "conflict": False
        },
        "criterion_overrides": {"C3": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-021",
        "cpt": "63075",
        "condition": "Cervical Disc Herniation",
        "test_type": "Conflicting Evidence",
        "expected_overall": "CONFLICT",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Surgeon notes state left C6 radiculopathy and requested surgery at C5-C6; imaging shows left compression at C6-C7, not C5-C6.",
        "patient_params": {
            "age": 49, "sex": "M", "level": "C5-C6 requested, C6-C7 pathology on MRI", "symptom_weeks": 10, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 biceps weakness", "exam_sensory": "C6 sensory deficit",
            "exam_reflex": "1+ biceps", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "C5-C6 is completely normal. Severe disc extrusion is present at C6-C7 compressing C7 nerve root.",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": True
        },
        "criterion_overrides": {"C3": "CONFLICT"}
    })

    cases.append({
        "case_id": "SYN-022",
        "cpt": "63075",
        "condition": "Acute Traumatic Disc Rupture with Deficit",
        "test_type": "Exception / Urgent",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "Urgent condition: Acute traumatic disc extrusion with rapidly progressive motor deficit (CMM-601.1)",
        "notes": "Urgent bypass: Acute traumatic disc extrusion with rapid motor decline waives conservative treatment.",
        "patient_params": {
            "age": 39, "sex": "M", "level": "C5-C6", "symptom_weeks": 1, "pt_weeks": 0, "pt_sessions": 0,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "Grade 2/5 deltoid and biceps weakness",
            "exam_sensory": "C5/C6 sensory deficit", "exam_reflex": "Absent", "spurling": "positive",
            "xray_flex_ext": "Deferred", "mri_finding": "Acute massive traumatic disc herniation with severe canal and foraminal compromise",
            "cotinine_result": "Active smoker", "smoker_status": "active smoker", "mental_health": "normal",
            "missing_field": None, "conflict": False, "urgent": True
        },
        "criterion_overrides": {}
    })

    # =========================================================================
    # CPT 63076 (4 Cases: SYN-023 to SYN-026)
    # Procedure: Discectomy anterior each additional interspace (Add-on)
    # =========================================================================
    cases.append({
        "case_id": "SYN-023",
        "cpt": "63076",
        "condition": "Multi-Level Disc Herniation Decompression",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Two-level anterior discectomy C5-C6 and C6-C7 with confirmed neural compression at both levels.",
        "patient_params": {
            "age": 57, "sex": "F", "level": "C6-C7 (Add-on)", "symptom_weeks": 14, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 biceps and triceps", "exam_sensory": "C6 and C7 deficits",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "C5-C6 and C6-C7 both exhibit significant disc osteophyte complex with neuroforaminal stenosis",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-024",
        "cpt": "63076",
        "condition": "Multi-Level Decompression",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C1: Add-on code billed without primary discectomy code 63075.",
        "patient_params": {
            "age": 61, "sex": "M", "level": "C6-C7 alone", "symptom_weeks": 10, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "Weakness", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "C6-C7 stenosis", "cotinine_result": "Negative", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-025",
        "cpt": "63076",
        "condition": "Multi-Level Decompression",
        "test_type": "Information Missing",
        "expected_overall": "UNKNOWN",
        "expected_missing": "MRI report documenting neural structure compression at add-on interspace",
        "expected_exception": "—",
        "notes": "Add-on interspace C6-C7 lacks diagnostic radiology description.",
        "patient_params": {
            "age": 53, "sex": "F", "level": "C6-C7 (Add-on)", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "Weakness", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "C5-C6 visualized and compressed. Report incomplete regarding C6-C7 status.",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal",
            "missing_field": "mri_addon_level", "conflict": False
        },
        "criterion_overrides": {"C2": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-026",
        "cpt": "63076",
        "condition": "Multi-Level Cervical Spondylosis",
        "test_type": "Wrong Condition / Indication",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Add-on level requested for mild non-compressive disc bulge without neural encroachment.",
        "patient_params": {
            "age": 64, "sex": "M", "level": "C6-C7 (Add-on)", "symptom_weeks": 10, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "Normal triceps", "exam_sensory": "Normal C7",
            "exam_reflex": "Normal", "spurling": "positive C6 only", "xray_flex_ext": "Normal",
            "mri_finding": "C6-C7 broad-based mild bulge without foraminal narrowing or root impingement",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C2": "NOT MET"}
    })

    # =========================================================================
    # CPT 63081 (6 Cases: SYN-027 to SYN-032)
    # Procedure: Vertebral corpectomy anterior single segment cervical
    # =========================================================================
    cases.append({
        "case_id": "SYN-027",
        "cpt": "63081",
        "condition": "Retrovertebral Cord Compression",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "C6 corpectomy for severe retrovertebral cord compression extending behind C6 vertebral body, performed with fusion.",
        "patient_params": {
            "age": 62, "sex": "M", "level": "C6 vertebral body", "symptom_weeks": 20, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 quadriparesis / clumsiness", "exam_sensory": "Sensory level",
            "exam_reflex": "Hyperreflexic 3+, Hoffmann positive", "spurling": "positive", "xray_flex_ext": "Completed",
            "mri_finding": "Severe ossification of posterior longitudinal ligament (OPLL) behind C6 vertebral body causing high-grade cord compression",
            "corpectomy_resection": "Complete C6 vertebral body resection planned with cage and anterior plate",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-028",
        "cpt": "63081",
        "condition": "Osteophytes Only (Inappropriate for Corpectomy)",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C1: Resection requested solely for osteophytes at the disc margin, explicitly excluded by CMM-601.5.",
        "patient_params": {
            "age": 58, "sex": "F", "level": "C5 vertebral body", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 weakness", "exam_sensory": "C6 deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "Marginal anterior osteophytes without retrovertebral body pathology or cord compression behind C5",
            "corpectomy_resection": "Osteophytectomy alone at disc borders",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET", "C2": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-029",
        "cpt": "63081",
        "condition": "Cervical Osteomyelitis / Discitis",
        "test_type": "Exception / Urgent",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "Urgent condition: Spinal osteomyelitis with vertebral body destruction (CMM-601.1 / CMM-601.5)",
        "notes": "Emergency bypass: Acute C5 vertebral osteomyelitis/abscess requiring urgent corpectomy debridement and fusion.",
        "patient_params": {
            "age": 69, "sex": "M", "level": "C5 vertebral body", "symptom_weeks": 2, "pt_weeks": 0, "pt_sessions": 0,
            "pain_daily": True, "radicular_pain": False, "exam_motor": "3/5 myelopathic weakness", "exam_sensory": "Sensory deficit",
            "exam_reflex": "Hyperreflexic", "spurling": "negative", "xray_flex_ext": "Destruction C5",
            "mri_finding": "C5 osteomyelitis/discitis with extensive bony destruction and epidural abscess compressing cord",
            "corpectomy_resection": "Total C5 corpectomy debridement and structural reconstruction",
            "cotinine_result": "Active smoker", "smoker_status": "active smoker", "mental_health": "normal",
            "missing_field": None, "conflict": False, "urgent": True
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-030",
        "cpt": "63081",
        "condition": "Cervical Corpectomy without Fusion",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C3: Corpectomy planned without concurrent cervical fusion/stabilization.",
        "patient_params": {
            "age": 52, "sex": "M", "level": "C5", "symptom_weeks": 16, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Hyperreflexic", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "Retrovertebral disc fragment behind C5 body",
            "corpectomy_resection": "C5 corpectomy decompression without bone graft, cage, or instrumentation",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C3": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-031",
        "cpt": "63081",
        "condition": "Vertebral Body Pathology",
        "test_type": "Information Missing",
        "expected_overall": "UNKNOWN",
        "expected_missing": "CT or MRI report establishing retrovertebral location of compression",
        "expected_exception": "—",
        "notes": "Criterion C2 Missing: Advanced imaging missing; unable to confirm retrovertebral pathology.",
        "patient_params": {
            "age": 60, "sex": "F", "level": "C6", "symptom_weeks": 14, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Completed", "mri_finding": None,
            "corpectomy_resection": "C6 corpectomy and fusion", "cotinine_result": "Negative", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": "mri_report", "conflict": False
        },
        "criterion_overrides": {"C2": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-032",
        "cpt": "63081",
        "condition": "Vertebral Body Pathology",
        "test_type": "Boundary Condition",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Resection threshold boundary: Surgical plan documents removal of only 20% of anterior body (<1/2 vertebral body threshold).",
        "patient_params": {
            "age": 56, "sex": "M", "level": "C5", "symptom_weeks": 10, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "Anterior osteophyte trough with 20% shallow body resection planned",
            "corpectomy_resection": "Superficial 20% partial resection, not meeting >=1/2 body requirement",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET"}
    })

    # =========================================================================
    # CPT 63082 (4 Cases: SYN-033 to SYN-036)
    # Procedure: Vertebral corpectomy cervical each additional segment (Add-on)
    # =========================================================================
    cases.append({
        "case_id": "SYN-033",
        "cpt": "63082",
        "condition": "Multi-Segment Corpectomy",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Two-level corpectomy C5 and C6 for continuous retrovertebral cord compression.",
        "patient_params": {
            "age": 66, "sex": "M", "level": "C6 (Add-on to C5)", "symptom_weeks": 24, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Sensory deficit",
            "exam_reflex": "Hyperreflexic", "spurling": "positive", "xray_flex_ext": "Completed",
            "mri_finding": "Continuous retrovertebral OPLL extending behind both C5 and C6 vertebral bodies",
            "corpectomy_resection": "Two-level corpectomy C5-C6 with strut reconstruction",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-034",
        "cpt": "63082",
        "condition": "Multi-Segment Corpectomy",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C1: Add-on code billed without primary single segment corpectomy code 63081.",
        "patient_params": {
            "age": 59, "sex": "F", "level": "C6 alone", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "C6 body lesion", "corpectomy_resection": "C6 corpectomy",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-035",
        "cpt": "63082",
        "condition": "Multi-Segment Corpectomy",
        "test_type": "Missing Supporting Document",
        "expected_overall": "UNKNOWN",
        "expected_missing": "Imaging report confirming multi-level retrovertebral pathology at second segment",
        "expected_exception": "—",
        "notes": "Pathology at second vertebral body segment not confirmed by radiologic study.",
        "patient_params": {
            "age": 68, "sex": "M", "level": "C6 (Add-on)", "symptom_weeks": 16, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Hyperreflexic", "spurling": "positive", "xray_flex_ext": "Completed",
            "mri_finding": "C5 well described with tumor involvement; C6 body status omitted from report",
            "corpectomy_resection": "Two-level corpectomy planned", "cotinine_result": "Negative", "smoker_status": "never-smoker",
            "mental_health": "normal", "missing_field": "mri_addon_level", "conflict": False
        },
        "criterion_overrides": {"C2": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-036",
        "cpt": "63082",
        "condition": "Multi-Segment Corpectomy",
        "test_type": "Boundary Condition",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Second segment meets exact 50% vertebral body resection threshold with confirmed posterior pathology.",
        "patient_params": {
            "age": 63, "sex": "F", "level": "C6 (Add-on to C5)", "symptom_weeks": 18, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Hyperreflexic", "spurling": "positive", "xray_flex_ext": "Completed",
            "mri_finding": "Multi-level OPLL involving C5 and exactly half of C6",
            "corpectomy_resection": "Full C5 resection plus exactly 50% partial C6 corpectomy",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    # =========================================================================
    # CPT 22220 (5 Cases: SYN-037 to SYN-041)
    # Procedure: Osteotomy of spine, anterior approach, single segment, cervical
    # =========================================================================
    cases.append({
        "case_id": "SYN-037",
        "cpt": "22220",
        "condition": "Fixed Cervical Kyphotic Deformity",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Rigid fixed cervical kyphosis causing horizontal gaze impairment, not correctable by fusion alone, ACDF criteria met.",
        "patient_params": {
            "age": 59, "sex": "M", "level": "C5-C6", "symptom_weeks": 30, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive",
            "xray_flex_ext": "Dynamic lateral radiographs confirm rigid fixed 35° kyphotic deformity without motion on flexion/extension",
            "mri_finding": "Anterior cord tenting over kyphotic apex at C5-C6",
            "osteotomy_rationale": "Deformity is fixed; wedge osteotomy necessary to restore cervical lordosis as fusion alone cannot correct",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-038",
        "cpt": "22220",
        "condition": "Mobile Cervical Postural Deformity",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C1: Kyphosis is mobile and flexible, reducing completely on extension views (fixed deformity required).",
        "patient_params": {
            "age": 46, "sex": "F", "level": "C5-C6", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Normal", "spurling": "positive",
            "xray_flex_ext": "Extension lateral radiograph demonstrates complete reduction of kyphosis to neutral lordosis (flexible deformity)",
            "mri_finding": "Mild disc bulge without fixed spinal deformity",
            "osteotomy_rationale": "Surgeon requested osteotomy despite flexible nature of deformity",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-039",
        "cpt": "22220",
        "condition": "Fixed Cervical Kyphotic Deformity",
        "test_type": "Information Missing",
        "expected_overall": "UNKNOWN",
        "expected_missing": "Dynamic flexion/extension radiographs or whole spine sagittal alignment films",
        "expected_exception": "—",
        "notes": "Criterion C1/C2 Missing: Absence of dynamic lateral X-rays to establish whether deformity is fixed vs flexible.",
        "patient_params": {
            "age": 65, "sex": "M", "level": "C5-C6", "symptom_weeks": 20, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": None,
            "mri_finding": "Cervical kyphosis noted on supine MRI", "osteotomy_rationale": "Clinical notes state kyphosis without dynamic imaging",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": "xray_dynamic_films", "conflict": False
        },
        "criterion_overrides": {"C1": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-040",
        "cpt": "22220",
        "condition": "Mild Cervical Kyphosis Correctable by Fusion",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C2: Pre-operative analysis shows deformity can be fully corrected by routine interbody cage distraction alone.",
        "patient_params": {
            "age": 51, "sex": "F", "level": "C4-C5", "symptom_weeks": 14, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Normal", "spurling": "positive", "xray_flex_ext": "Mild 8° kyphosis",
            "mri_finding": "C4-C5 disc space collapse",
            "osteotomy_rationale": "Radiologist and consulting surgeon note deformity easily attained by anterior lordotic cage and fusion alone",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C2": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-041",
        "cpt": "22220",
        "condition": "Severe Ankylosing Spondylitis Chin-on-Chest Deformity",
        "test_type": "Exception / Urgent",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "Urgent/Emergency structural airway and swallowing compromise due to severe fixed kyphosis",
        "notes": "Severe rigid fixed deformity causing progressive dysphagia and impaired horizontal gaze meeting surgical necessity.",
        "patient_params": {
            "age": 58, "sex": "M", "level": "C6-C7", "symptom_weeks": 40, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Hyperreflexic", "spurling": "positive",
            "xray_flex_ext": "Severe rigid 45° cervical kyphosis, autofused facets, dynamic views show absolute zero motion",
            "mri_finding": "Severe cord compression at apex",
            "osteotomy_rationale": "Three-column anterior osteotomy required to break anterior fusion mass and restore alignment",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    # =========================================================================
    # CPT 22845 (5 Cases: SYN-042 to SYN-046)
    # Procedure: Anterior instrumentation; 2 to 3 vertebral segments (Add-on)
    # =========================================================================
    cases.append({
        "case_id": "SYN-042",
        "cpt": "22845",
        "condition": "Cervical Arthrodesis Instrumentation",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Anterior rigid plate instrumentation across C5-C6-C7 (3 vertebral bodies) in conjunction with qualifying two-level ACDF.",
        "patient_params": {
            "age": 55, "sex": "M", "level": "C5 to C7 (3 vertebral segments)", "symptom_weeks": 16, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Completed",
            "mri_finding": "Two-level stenosis C5-C7", "instrumentation": "Anterior cervical plate spanning C5, C6, and C7 with bicortical screws",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-043",
        "cpt": "22845",
        "condition": "Instrumentation Without Fusion",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C1: Anterior plate requested without an approved arthrodesis/corpectomy procedure.",
        "patient_params": {
            "age": 48, "sex": "F", "level": "C5-C6", "symptom_weeks": 8, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Normal", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "Disc bulge", "instrumentation": "Plate fixation requested alone without bone graft or cage arthrodesis",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-044",
        "cpt": "22845",
        "condition": "Cervical Arthrodesis Instrumentation",
        "test_type": "Information Missing",
        "expected_overall": "UNKNOWN",
        "expected_missing": "Operative surgical plan detailing segments to be instrumented",
        "expected_exception": "—",
        "notes": "Criterion C1 Missing: Operative report/plan does not specify vertebral segments instrumented.",
        "patient_params": {
            "age": 52, "sex": "M", "level": "Unspecified cervical segments", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "Multi-level changes", "instrumentation": "Instrumentation requested without level specification",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal",
            "missing_field": "operative_plan_levels", "conflict": False
        },
        "criterion_overrides": {"C1": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-045",
        "cpt": "22845",
        "condition": "Long-Segment Instrumentation (Boundary)",
        "test_type": "Boundary Condition",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Code boundary: Procedure instruments 5 vertebral segments (C3-C7), which requires code 22846 (4 to 7 segments), not 22845 (2 to 3 segments).",
        "patient_params": {
            "age": 70, "sex": "M", "level": "C3 to C7 (5 vertebral segments)", "symptom_weeks": 20, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Hyperreflexic", "spurling": "positive", "xray_flex_ext": "Completed",
            "mri_finding": "Multi-level C3-C7 stenosis", "instrumentation": "Long segment plate spanning 5 vertebral segments (C3 through C7)",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-046",
        "cpt": "22845",
        "condition": "Corpectomy Reconstruction Stabilization",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Rigid anterior plate stabilization spanning C4-C5-C6 across qualifying C5 corpectomy defect.",
        "patient_params": {
            "age": 64, "sex": "F", "level": "C4 to C6 across C5 corpectomy", "symptom_weeks": 16, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Hyperreflexic", "spurling": "positive", "xray_flex_ext": "Completed",
            "mri_finding": "C5 retrovertebral compression", "instrumentation": "Anterior plate spanning C4 to C6",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    # =========================================================================
    # CPT 22853 (4 Cases: SYN-047 to SYN-050)
    # Procedure: Insertion of interbody biomechanical device (cage), each interspace
    # =========================================================================
    cases.append({
        "case_id": "SYN-047",
        "cpt": "22853",
        "condition": "Interbody Cage Arthrodesis",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "PEEK interbody spacer cage with integrated anchoring performed in conjunction with qualifying ACDF at C5-C6.",
        "patient_params": {
            "age": 52, "sex": "F", "level": "C5-C6", "symptom_weeks": 12, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Completed",
            "mri_finding": "C5-C6 disc extrusion with foraminal narrowing", "cage_details": "Titanium-coated PEEK interbody cage packed with autologous bone graft",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    cases.append({
        "case_id": "SYN-048",
        "cpt": "22853",
        "condition": "Cage Insertion Without Arthrodesis",
        "test_type": "One Criterion Failed",
        "expected_overall": "NOT MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Failed Criterion C1: Interbody cage insertion billed without qualifying interbody arthrodesis/fusion.",
        "patient_params": {
            "age": 45, "sex": "M", "level": "C5-C6", "symptom_weeks": 8, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Normal", "spurling": "positive", "xray_flex_ext": "Normal",
            "mri_finding": "Disc collapse", "cage_details": "Spacer insertion planned without interbody fusion preparation or arthrodesis billing",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {"C1": "NOT MET"}
    })

    cases.append({
        "case_id": "SYN-049",
        "cpt": "22853",
        "condition": "Interbody Cage Arthrodesis",
        "test_type": "Missing Supporting Document",
        "expected_overall": "UNKNOWN",
        "expected_missing": "Surgical plan confirming interbody cage placement level",
        "expected_exception": "—",
        "notes": "Criterion C1 Missing: Operative booking does not include device specifications or intended interspace.",
        "patient_params": {
            "age": 57, "sex": "M", "level": "Unspecified", "symptom_weeks": 10, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5", "exam_sensory": "Deficit",
            "exam_reflex": "Depressed", "spurling": "positive", "xray_flex_ext": "Completed",
            "mri_finding": "Stenosis", "cage_details": "Device not detailed in pre-operative documentation",
            "cotinine_result": "Negative", "smoker_status": "never-smoker", "mental_health": "normal",
            "missing_field": "operative_cage_spec", "conflict": False
        },
        "criterion_overrides": {"C1": "UNKNOWN"}
    })

    cases.append({
        "case_id": "SYN-050",
        "cpt": "22853",
        "condition": "Interbody Cage Arthrodesis",
        "test_type": "All Criteria Met",
        "expected_overall": "MET",
        "expected_missing": "—",
        "expected_exception": "—",
        "notes": "Interbody device insertion at C6-C7 with comprehensive documented medical necessity for primary fusion.",
        "patient_params": {
            "age": 60, "sex": "M", "level": "C6-C7", "symptom_weeks": 16, "pt_weeks": 8, "pt_sessions": 16,
            "pain_daily": True, "radicular_pain": True, "exam_motor": "4/5 triceps weakness",
            "exam_sensory": "C7 dermatomal paresthesias", "exam_reflex": "1+ triceps reflex", "spurling": "positive",
            "xray_flex_ext": "Dynamic X-rays normal", "mri_finding": "C6-C7 severe foraminal stenosis with C7 root compression",
            "cage_details": "Interbody PEEK cage with integral anchoring screws",
            "cotinine_result": "Negative (<10 ng/mL)", "smoker_status": "never-smoker", "mental_health": "normal", "missing_field": None, "conflict": False
        },
        "criterion_overrides": {}
    })

    return cases

if __name__ == "__main__":
    matrix = get_case_matrix()
    print(f"Total defined cases: {len(matrix)}")
    cpt_counts = {}
    type_counts = {}
    for c in matrix:
        cpt = c["cpt"]
        t = c["test_type"]
        cpt_counts[cpt] = cpt_counts.get(cpt, 0) + 1
        type_counts[t] = type_counts.get(t, 0) + 1
    print("CPT Distribution:", cpt_counts)
    print("Test Type Distribution:", type_counts)
