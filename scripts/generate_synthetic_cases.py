#!/usr/bin/env python3
"""
Generate Synthetic Test Cases & Clinical EHR Documents
File: scripts/generate_synthetic_cases.py

Generates 50 synthetic test cases across 10 CPT codes:
1. Builds generic patient JSON records (data/synthetic_cases/cases/SYN-XXX.json)
2. Generates realistic clinical EHR text documents (data/synthetic_cases/documents/SYN-XXX/)
3. Exports data/synthetic_cases/Synthetic_Test_Cases.xlsx with:
   - Sheet 1: Case_Level (11 columns)
   - Sheet 2: Criterion_Level (6 columns)

Anchored to Policy_Ground_Truth.xlsx with zero policy leaks into clinical patient records.
"""

from typing import List, Dict, Any, Optional
import os
import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import pandas as pd
from dotenv import load_dotenv

from patient_schema import (
    GenericPatient, Demographics, Diagnosis, Symptom,
    Medication, ImagingStudy, LabResult, ConservativeTreatment
)
from case_matrix import get_case_matrix, PAYER, POLICY_ID

load_dotenv()

GROUND_TRUTH_FILE = "data/ground_truth/Policy_Ground_Truth.xlsx"
OUTPUT_EXCEL = "data/synthetic_cases/Synthetic_Test_Cases.xlsx"
CASES_DIR = "data/synthetic_cases/cases"
DOCS_DIR = "data/synthetic_cases/documents"

def load_ground_truth_criteria():
    df = pd.read_excel(GROUND_TRUTH_FILE, dtype=str, keep_default_na=False)
    criteria_by_cpt = {}
    for _, row in df.iterrows():
        cpt = row["CPT"]
        cond = row["Condition/Indication"]
        key = (cpt, cond)
        if key not in criteria_by_cpt:
            criteria_by_cpt[key] = []
        criteria_by_cpt[key].append({
            "cpt": cpt,
            "procedure": row["Procedure"],
            "condition": cond,
            "criterion_id": row["Criterion ID"],
            "criterion": row["Medical-Necessity Criterion"],
            "logic": row["Logic"],
            "threshold": row["Threshold"],
            "documentation": row["Documentation Required"],
            "exception": row["Exception/Exclusion"],
            "page": row["Page"],
            "section": row["Section"],
            "source_text": row["Source Text"]
        })
    return criteria_by_cpt, df

def generate_ehr_documents(case_id: str, case_data: Dict[str, Any], patient: GenericPatient, case_dir: str):
    os.makedirs(case_dir, exist_ok=True)
    p = case_data["patient_params"]
    cpt = case_data["cpt"]
    cond = case_data["condition"]
    age = p["age"]
    sex = p["sex"]
    level = p.get("level", "C5-C6")
    
    # 1. Physician Consultation Note
    doc_refs = []
    physician_path = os.path.join(case_dir, "physician_note.txt")
    doc_refs.append("physician_note.txt")
    
    pain_desc = "severe, unremitting daily pain" if p["pain_daily"] else "intermittent mild aching"
    rad_desc = "radiating down the right upper extremity into the shoulder and hand with numbness" if p["radicular_pain"] else "localized to the posterior neck without radiation"
    
    urgency_txt = ""
    if p.get("urgent"):
        urgency_txt = f"\n*** URGENT ASSESSMENT: Patient demonstrates rapid progressive motor deficit ({p.get('exam_motor')}). Emergency surgical decompression indicated. ***\n"
        
    physician_content = f"""CLINICAL CONSULTATION NOTE
PATIENT ID: {case_id}
DATE OF SERVICE: 2026-08-20
ATTENDING SURGEON: Dr. Marcus Vance, MD (Neurosurgery & Spine)

DEMOGRAPHICS: {age}-year-old {('Female' if sex == 'F' else 'Male')}
CHIEF COMPLAINT: Neck and right arm pain lasting {p['symptom_weeks']} weeks.

HISTORY OF PRESENT ILLNESS:
The patient is a {age}-year-old {('female' if sex == 'F' else 'male')} who presents for surgical evaluation of cervical spine symptoms.
Symptoms began approximately {p['symptom_weeks']} weeks ago. Patient describes {pain_desc}, {rad_desc}.
Functional impact: Significant disability affecting work and daily activities of daily living.
{urgency_txt}
PAST MEDICAL HISTORY:
- Cervical spondylosis
- No unmanaged major depressive disorder, psychiatric illness, or substance abuse disorder.

PHYSICAL EXAMINATION:
- Constitutional: Alert, oriented x 3, in mild-to-moderate distress.
- Cervical Spine: Tenderness over mid-cervical spinous processes. Restricted extension and lateral rotation.
- Motor: {p['exam_motor']}
- Sensory: {p['exam_sensory']}
- Reflexes: {p['exam_reflex']}
- Provocative Signs: Spurling maneuver is {p['spurling']}.
- Gait: {'Normal non-ataxic gait' if 'ataxic' not in str(p.get('mri_finding','')).lower() else 'Ataxic, wide-based gait'}

CONSERVATIVE MANAGEMENT REVIEW:
- Completed {p['pt_weeks']} weeks ({p['pt_sessions']} visits) of provider-directed physical therapy.
- Response: {('No clinically meaningful functional improvement' if p['pt_weeks'] > 0 else 'None attempted prior to surgical request')}.
- Medications: Trial of NSAIDs (Meloxicam 15mg daily) and Gabapentin (300mg TID) with inadequate symptom relief.

ASSESSMENT & SURGICAL PLAN:
Diagnosis: {cond} ({level})
Proposed Procedure: CPT {cpt} ({level})
Plan: Patient has failed conservative management (or presents with acute emergent deficit). Recommended anterior cervical surgical intervention.
"""
    with open(physician_path, "w") as f:
        f.write(physician_content.strip())

    # 2. MRI Report
    if p.get("mri_finding") is not None and p.get("missing_field") != "mri_report":
        mri_path = os.path.join(case_dir, "mri_report.txt")
        doc_refs.append("mri_report.txt")
        mri_content = f"""DEPARTMENT OF RADIOLOGY - MRI REPORT
PATIENT ID: {case_id}
EXAMINATION: MRI CERVICAL SPINE WITHOUT INTRAVENOUS CONTRAST
DATE: 2026-08-15

CLINICAL INDICATION: {cond}, {p['symptom_weeks']} weeks duration.
TECHNIQUE: Multi-planar, multi-sequence T1, T2, and STIR sagittal and axial images.

FINDINGS:
Craniocervical junction: Unremarkable.
Vertebral body heights and marrow signal: Preserved.
C2-C3: Normal disc morphology, patent neural foramina.
C3-C4: Mild disc desiccation, no significant central canal or foraminal stenosis.
C4-C5: Mild uncinate spurring.
Target Interspace / Segment ({level}):
{p['mri_finding']}

IMPRESSION:
1. Concordant cervical spine pathology at {level} as detailed above.
2. {'Severe neural compression concordant with clinical radiculopathy/myelopathy' if not p.get('conflict') else 'DISCORDANT: Findings do not correlate with severe radicular symptoms at requested level.'}
"""
        with open(mri_path, "w") as f:
            f.write(mri_content.strip())

    # 3. Dynamic X-ray Report
    if p.get("xray_flex_ext") is not None and p.get("missing_field") not in ["xray_flex_ext", "xray_dynamic_films"]:
        xray_path = os.path.join(case_dir, "xray_report.txt")
        doc_refs.append("xray_report.txt")
        xray_content = f"""DEPARTMENT OF RADIOLOGY - X-RAY REPORT
PATIENT ID: {case_id}
EXAMINATION: CERVICAL SPINE 4-VIEW (AP, LATERAL, FLEXION, EXTENSION DYNAMIC VIEWS)
DATE: 2026-08-12

FINDINGS:
AP and lateral views demonstrate normal cervical lordosis without acute fracture.
Dynamic flexion and extension lateral views:
{p['xray_flex_ext']}

IMPRESSION:
Evaluation of dynamic instability completed. {p['xray_flex_ext']}.
"""
        with open(xray_path, "w") as f:
            f.write(xray_content.strip())

    # 4. Physical Therapy Progress Summary
    if p["pt_weeks"] > 0 and p.get("missing_field") != "pt_notes":
        pt_path = os.path.join(case_dir, "pt_notes.txt")
        doc_refs.append("pt_notes.txt")
        pt_content = f"""APEX PHYSICAL THERAPY - DISCHARGE & PROGRESS SUMMARY
PATIENT ID: {case_id}
EPISODE DATES: 2026-06-15 to 2026-08-10 ({p['pt_weeks']} WEEKS TOTAL)
SESSIONS COMPLETED: {p['pt_sessions']} attended sessions (prescribed 2-3x weekly).

THERAPEUTIC INTERVENTIONS:
- Cervical spine postural re-education
- Isometric cervical stabilization and scapular retractor strengthening
- Manual cervical distraction and thoracic mobilization
- Home exercise program (HEP) instruction and compliance tracking

DISCHARGE ASSESSMENT:
Patient completed {p['pt_weeks']} weeks of active structured rehabilitation.
Pain levels remain 7/10 with persistent radicular symptoms into the arm.
Conclusion: Patient achieved less than clinically meaningful functional improvement despite faithful adherence.
"""
        with open(pt_path, "w") as f:
            f.write(pt_content.strip())

    # 5. Laboratory Cotinine Report
    if p.get("cotinine_result") is not None and p.get("missing_field") != "cotinine_test":
        lab_path = os.path.join(case_dir, "lab_report.txt")
        doc_refs.append("lab_report.txt")
        lab_content = f"""QUEST CLINICAL PATHOLOGY - TOXICOLOGY REPORT
PATIENT ID: {case_id}
SPECIMEN: URINE
COLLECTION DATE: 2026-08-18

TEST: URINE COTININE SCREEN (LC-MS/MS)
RESULT: {p['cotinine_result']}
REFERENCE RANGE:
  Non-smoker / Tobacco-free: < 10.0 ng/mL
  Passive exposure: 10.0 - 50.0 ng/mL
  Active tobacco / nicotine user: > 50.0 ng/mL

INTERPRETATION:
{('Specimen confirms tobacco / nicotine abstinence (>6 weeks duration)' if 'negative' in str(p['cotinine_result']).lower() else 'Specimen indicates active nicotine or tobacco metabolite presence.')}
"""
        with open(lab_path, "w") as f:
            f.write(lab_content.strip())

    return doc_refs

def build_generic_patient(case_data: Dict[str, Any]) -> GenericPatient:
    p = case_data["patient_params"]
    cid = case_data["case_id"]
    cond = case_data["condition"]
    
    # Demographics
    demographics = Demographics(
        age=p["age"],
        sex=p["sex"],
        dob="1974-05-12",
        mrn=f"MRN-{10000 + int(cid.replace('SYN-', ''))}"
    )
    
    # Diagnosis
    diagnoses = [
        Diagnosis(
            code="M50.122" if "Radiculopathy" in cond else ("M50.02" if "Myelopathy" in cond else "M50.80"),
            description=cond,
            status="active",
            onset_date="2026-05-01"
        )
    ]
    
    # Symptoms
    symptoms = [
        Symptom(
            symptom=cond,
            location="Cervical spine / Upper Extremity",
            severity="Severe" if p["pain_daily"] else "Mild",
            frequency="daily" if p["pain_daily"] else "intermittent",
            duration_weeks=p["symptom_weeks"]
        )
    ]
    
    # Medications
    medications = [
        Medication(name="Gabapentin", dosage="300mg TID", duration_weeks=p["pt_weeks"], response="Inadequate relief"),
        Medication(name="Meloxicam", dosage="15mg Daily", duration_weeks=p["pt_weeks"], response="Partial relief")
    ]
    
    # Imaging
    imaging = []
    if p.get("xray_flex_ext") and p.get("missing_field") not in ["xray_flex_ext", "xray_dynamic_films"]:
        imaging.append(ImagingStudy(
            modality="X-ray",
            type="Cervical spine dynamic flexion/extension",
            date="2026-08-12",
            findings=p["xray_flex_ext"],
            impression="Dynamic stability study evaluated"
        ))
    if p.get("mri_finding") and p.get("missing_field") != "mri_report":
        imaging.append(ImagingStudy(
            modality="MRI",
            type="Cervical spine without contrast",
            date="2026-08-15",
            findings=p["mri_finding"],
            impression="Target interspace compression noted"
        ))
        
    # Labs
    labs = []
    if p.get("cotinine_result") and p.get("missing_field") != "cotinine_test":
        labs.append(LabResult(
            test="Urine cotinine (LC-MS/MS)",
            date="2026-08-18",
            value=p["cotinine_result"],
            reference_range="< 10 ng/mL",
            interpretation="Tobacco-free / Negative" if "negative" in str(p["cotinine_result"]).lower() else "Active tobacco presence"
        ))
        
    # Conservative treatment
    conservative_treatment = None
    if p["pt_weeks"] > 0:
        conservative_treatment = ConservativeTreatment(
            pt_weeks=int(p["pt_weeks"]),
            pt_sessions=p["pt_sessions"],
            provider="Apex Physical Therapy Clinic",
            modalities=["Therapeutic exercise", "Manual therapy", "Postural re-education"],
            response="Less than clinically meaningful improvement"
        )
        
    clinical_findings = {
        "motor": p["exam_motor"],
        "sensory": p["exam_sensory"],
        "reflexes": p["exam_reflex"],
        "spurling": p["spurling"]
    }
    
    patient = GenericPatient(
        patient_id=cid,
        demographics=demographics,
        diagnoses=diagnoses,
        symptoms=symptoms,
        symptom_duration=f"{p['symptom_weeks']} weeks",
        clinical_findings=clinical_findings,
        treatments=["Physical therapy", "Oral analgesics", "Activity modification"],
        conservative_treatment=conservative_treatment,
        medications=medications,
        imaging=imaging,
        labs=labs,
        procedures=[],
        physician_assessment=f"Patient presents with {cond} refractory to conservative measures.",
        documents=[]
    )
    return patient

def generate_all_cases():
    print("=" * 80)
    print("GENERATING 50 SYNTHETIC TEST CASES FOR PRIOR AUTHORIZATION")
    print("=" * 80)
    
    os.makedirs(CASES_DIR, exist_ok=True)
    os.makedirs(DOCS_DIR, exist_ok=True)
    
    criteria_by_cpt, gt_df = load_ground_truth_criteria()
    matrix = get_case_matrix()
    
    case_level_rows = []
    criterion_level_rows = []
    
    for case_data in matrix:
        cid = case_data["case_id"]
        cpt = case_data["cpt"]
        cond = case_data["condition"]
        test_type = case_data["test_type"]
        expected_overall = case_data["expected_overall"]
        expected_missing = case_data["expected_missing"]
        expected_exception = case_data["expected_exception"]
        notes = case_data["notes"]
        overrides = case_data.get("criterion_overrides", {})
        
        # Build patient
        patient = build_generic_patient(case_data)
        
        # Generate EHR documents
        case_doc_dir = os.path.join(DOCS_DIR, cid)
        doc_refs = generate_ehr_documents(cid, case_data, patient, case_doc_dir)
        patient.documents = doc_refs
        
        # Save JSON
        json_path = os.path.join(CASES_DIR, f"{cid}.json")
        with open(json_path, "w") as f:
            f.write(patient.to_json(indent=2))
            
        # Get procedure title from ground truth
        proc_matches = gt_df[gt_df["CPT"] == cpt]["Procedure"].values
        proc_title = proc_matches[0] if len(proc_matches) > 0 else f"Procedure for CPT {cpt}"
        
        # 1. Case-Level row
        case_row = {
            "Case ID": cid,
            "Payer": PAYER,
            "Policy ID": POLICY_ID,
            "CPT": cpt,
            "Procedure": proc_title,
            "Condition": cond,
            "Test Case Type": test_type,
            "Expected Overall Result": expected_overall,
            "Expected Missing Information": expected_missing,
            "Expected Exception": expected_exception,
            "Notes": notes
        }
        case_level_rows.append(case_row)
        
        # 2. Criterion-Level rows
        # Match criteria from ground truth for this CPT
        matching_criteria = []
        for (c_cpt, c_cond), crit_list in criteria_by_cpt.items():
            if c_cpt == cpt:
                # If specific condition matches or default
                if cond.lower() in c_cond.lower() or c_cond.lower() in cond.lower() or len(matching_criteria) == 0:
                    matching_criteria = crit_list
                    
        # If no specific condition match, take all criteria for that CPT
        if not matching_criteria:
            matching_criteria = [c for c_list in criteria_by_cpt.values() for c in c_list if c["cpt"] == cpt]
            
        p_params = case_data["patient_params"]
        for crit in matching_criteria:
            crit_id = crit["criterion_id"]
            crit_text = crit["criterion"]
            
            # Determine expected result for this criterion
            if crit_id in overrides:
                crit_expected = overrides[crit_id]
            else:
                crit_expected = "MET"
                
            # Evidence text
            if crit_expected == "MET":
                ev_text = f"Documented in clinical records: concordant findings for {crit_id}."
            elif crit_expected == "NOT MET":
                ev_text = f"Clinical records fail requirement: deficient finding for {crit_id}."
            elif crit_expected == "UNKNOWN":
                ev_text = f"Required documentation for {crit_id} omitted from patient record."
            elif crit_expected == "CONFLICT":
                ev_text = f"Conflicting findings between physician clinic note and radiology report for {crit_id}."
            elif "Bypassed" in crit_expected:
                ev_text = f"Requirement waived due to confirmed urgent/emergent condition ({crit_id})."
            else:
                ev_text = f"Record evaluated for {crit_id}."
                
            crit_row = {
                "Case ID": cid,
                "Criterion ID": crit_id,
                "Criterion": crit_text,
                "Expected Result": crit_expected,
                "Patient Evidence": ev_text,
                "Notes": f"Case {cid} test scenario: {test_type} ({crit_id} -> {crit_expected})"
            }
            criterion_level_rows.append(crit_row)

    print(f"Generated {len(case_level_rows)} case-level records.")
    print(f"Generated {len(criterion_level_rows)} criterion-level records.")
    
    # Write to Excel
    write_synthetic_excel(case_level_rows, criterion_level_rows, OUTPUT_EXCEL)

def write_synthetic_excel(case_rows, crit_rows, output_path):
    wb = openpyxl.Workbook()
    
    # Styles
    header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Calibri", size=10)
    thin_border = Border(
        left=Side(style='thin', color='D9D9D9'),
        right=Side(style='thin', color='D9D9D9'),
        top=Side(style='thin', color='D9D9D9'),
        bottom=Side(style='thin', color='D9D9D9')
    )
    
    # -------------------------------------------------------------
    # Sheet 1: Case_Level
    # -------------------------------------------------------------
    ws1 = wb.active
    ws1.title = "Case_Level"
    
    case_headers = [
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
    
    ws1.append(case_headers)
    for col_idx in range(1, len(case_headers) + 1):
        cell = ws1.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        
    for r in case_rows:
        ws1.append([r[h] for h in case_headers])
        
    for row_idx in range(2, len(case_rows) + 2):
        for col_idx in range(1, len(case_headers) + 1):
            cell = ws1.cell(row=row_idx, column=col_idx)
            cell.font = data_font
            cell.border = thin_border
            h_name = case_headers[col_idx - 1]
            if h_name in ["Case ID", "Policy ID", "CPT", "Test Case Type", "Expected Overall Result"]:
                cell.alignment = Alignment(horizontal="center", vertical="top")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
                
    case_widths = {
        "Case ID": 12, "Payer": 25, "Policy ID": 12, "CPT": 10, "Procedure": 35,
        "Condition": 28, "Test Case Type": 25, "Expected Overall Result": 22,
        "Expected Missing Information": 32, "Expected Exception": 32, "Notes": 45
    }
    for col_idx, h_name in enumerate(case_headers, 1):
        ws1.column_dimensions[get_column_letter(col_idx)].width = case_widths.get(h_name, 25)
    ws1.freeze_panes = "A2"
    ws1.views.sheetView[0].showGridLines = True
    
    # -------------------------------------------------------------
    # Sheet 2: Criterion_Level
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="Criterion_Level")
    crit_headers = [
        "Case ID",
        "Criterion ID",
        "Criterion",
        "Expected Result",
        "Patient Evidence",
        "Notes"
    ]
    ws2.append(crit_headers)
    for col_idx in range(1, len(crit_headers) + 1):
        cell = ws2.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        
    for r in crit_rows:
        ws2.append([r[h] for h in crit_headers])
        
    for row_idx in range(2, len(crit_rows) + 2):
        for col_idx in range(1, len(crit_headers) + 1):
            cell = ws2.cell(row=row_idx, column=col_idx)
            cell.font = data_font
            cell.border = thin_border
            h_name = crit_headers[col_idx - 1]
            if h_name in ["Case ID", "Criterion ID", "Expected Result"]:
                cell.alignment = Alignment(horizontal="center", vertical="top")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
                
    crit_widths = {
        "Case ID": 12, "Criterion ID": 14, "Criterion": 45,
        "Expected Result": 18, "Patient Evidence": 40, "Notes": 40
    }
    for col_idx, h_name in enumerate(crit_headers, 1):
        ws2.column_dimensions[get_column_letter(col_idx)].width = crit_widths.get(h_name, 25)
    ws2.freeze_panes = "A2"
    ws2.views.sheetView[0].showGridLines = True
    
    wb.save(output_path)
    print(f"Successfully saved {output_path} with {len(case_rows)} cases and {len(crit_rows)} criteria.")

if __name__ == "__main__":
    generate_all_cases()
