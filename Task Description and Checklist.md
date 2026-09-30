# **PRIOR AUTHORIZATION — 3-WEEK TECHNICAL TASK CHECKLIST**

## **OBJECTIVE**

Build and validate a test framework for the existing Prior Authorization pipeline.

Overall flow:

GROUND TRUTH → SYNTHETIC TEST CASES → ACTUAL SYSTEM TESTING → VALIDATION

---

# **PART 1 — GROUND TRUTH**

## **1\. Select policy and CPTs**

\[X\] Select 1 payer/policy PDF to start.

\[X\] Identify 10 CPT codes from the policy.

\[X\] For each CPT, identify the procedure description.

\[X\] For each CPT, identify whether **Prior Authorization is required**.

\[X\] Identify the applicable condition/indication for each CPT.

\[X\] Identify all medical-necessity criteria.

\[X\] Identify whether criteria use **AND / OR** logic.

\[X\] Identify thresholds (e.g., ≥6 weeks).

\[X\] Identify documentation requirements.

\[X\] Identify exceptions/exclusions.

\[X\] Record the exact page number for each requirement.

\[X\] Record the exact policy section.

\[X\] Record the relevant source text.

---

## **2\. Create `Policy_Ground_Truth.xlsx`**

Create **one row per medical-necessity criterion**, rather than putting all criteria for a CPT into one cell.

Required columns:

\[X\] Payer

\[X\] Policy ID

\[X\] CPT

\[X\] Procedure

\[X\] Condition/Indication

\[X\] PA Required

\[X\] Criterion ID

\[X\] Medical-Necessity Criterion

\[X\] Logic (AND/OR)

\[X\] Threshold

\[X\] Documentation Required

\[X\] Exception/Exclusion

\[X\] Page

\[X\] Section

\[X\] Source Text

Example:

| Payer | Policy ID | CPT | Procedure | Condition | PA Required | Criterion ID | Criterion | Logic | Threshold | Documentation | Exception | Page | Section | Source Text |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| BrightCare | BC001 | 22551 | Cervical fusion | Radiculopathy | Yes | C1 | Radiculopathy documented | AND | — | Physician note | — | 4 | Medical Necessity | ... |
| BrightCare | BC001 | 22551 | Cervical fusion | Radiculopathy | Yes | C2 | MRI evidence | AND | — | MRI report | — | 4 | Medical Necessity | ... |
| BrightCare | BC001 | 22551 | Cervical fusion | Radiculopathy | Yes | C3 | Conservative treatment | AND | ≥6 weeks | PT records | — | 4 | Medical Necessity | ... |

---

## **3\. Validate the ground truth**

\[ \] Check every entry against the original PDF.

\[ \] Verify CPT codes.

\[ \] Verify PA requirement.

\[ \] Verify medical-necessity criteria.

\[ \] Verify documentation requirements.

\[ \] Verify AND/OR logic.

\[ \] Verify exceptions.

\[ \] Verify page numbers.

\[ \] Verify source text.

\[ \] Do NOT use an LLM to establish the ground truth.

### **Deliverables**

\[ \] `Policy_Ground_Truth.xlsx`

\[ \] List of 10 CPTs

\[ \] Source pages/sections for every requirement

# **PART 2 — SYNTHETIC TEST CASE DATA GENERATION**

## **4\. Create generic patient schema**

Create a reusable patient structure that can represent a synthetic patient regardless of payer, CPT, or condition.

Include:

\[X\] Patient ID

\[X\] Age

\[X\] Sex

\[X\] Diagnosis/condition

\[X\] Symptoms

\[X\] Symptom duration

\[X\] Clinical findings

\[X\] Previous treatments

\[X\] Conservative treatment

\[X\] Medications

\[X\] Imaging

\[X\] Laboratory results

\[X\] Previous procedures

\[X\] Physician assessment

\[X\] Relevant clinical history

\[X\] Supporting documents

Example:

{  
  "patient\_id": "SYN-001",  
  "demographics": {  
    "age": 52,  
    "sex": "F"  
  },  
  "diagnoses": \[\],  
  "symptoms": \[\],  
  "symptom\_duration": \[\],  
  "clinical\_findings": \[\],  
  "treatments": \[\],  
  "medications": \[\],  
  "imaging": \[\],  
  "labs": \[\],  
  "procedures": \[\],  
  "documents": \[\]  
}

IMPORTANT:

\[X\] Keep the patient schema generic.

\[X\] Do NOT hard-code payer-specific requirements into the patient schema.

---

## **5\. Use policy criteria to design test cases**

For each CPT/condition, use the actual policy criteria from `Policy_Ground_Truth.xlsx` to design test cases.

The input to the **synthetic test-case generator** should be:

\[X\] Payer

\[X\] Policy ID

\[X\] CPT

\[X\] Procedure

\[X\] Condition/Indication

\[X\] Medical-necessity criteria

\[X\] AND/OR logic

\[X\] Thresholds

\[X\] Exceptions

\[X\] Documentation requirements

IMPORTANT:

\[X\] These policy criteria are used to **generate the test case**.

\[X\] They are NOT provided to the PA system as the expected answer during actual testing.

---

### **Test Case 1 — All Criteria Met**

\[X\] Create a case where every policy criterion is satisfied.

\[X\] Expected result \= MET.

---

### **Test Case 2 — One Criterion Not Met**

\[X\] Create a case where exactly one criterion fails.

\[X\] Expected result \= NOT MET.

\[X\] Record which criterion fails.

---

### **Test Case 3 — Information Missing**

\[X\] Remove one required piece of information.

\[X\] Expected result \= UNKNOWN.

\[X\] Do NOT treat missing information as NOT MET.

---

### **Test Case 4 — Wrong Condition**

\[X\] Create a patient with a different diagnosis/indication.

\[X\] Record the expected result.

---

### **Test Case 5 — Boundary Condition**

If the policy has a threshold:

\[X\] Create a case exactly at the threshold.

\[X\] Create a case just below the threshold.

\[X\] Create a case just above the threshold.

Example:

\[X\] 6 weeks → MET

\[X\] 5 weeks → NOT MET

\[X\] 6 weeks \+ 1 day → MET

---

### **Test Case 6 — Exception**

If the policy contains an exception:

\[X\] Create a patient who triggers the exception.

\[X\] Record expected result.

---

### **Test Case 7 — Conflicting Evidence**

\[X\] Create two documents containing conflicting information.

\[X\] Record expected result as CONFLICT/REVIEW where appropriate.

---

### **Test Case 8 — Missing Document**

\[X\] Create a case where the clinical requirement may be satisfied but the required supporting document is absent.

\[X\] Record expected result.

---

## **6\. Create synthetic cases for the 10 CPTs**

For each CPT:

\[X\] Identify applicable condition.

\[X\] Identify policy criteria.

\[X\] Create test cases covering the relevant policy rules and failure modes.

\[X\] Target 5–8 test cases per CPT.

\[X\] Include different test-case types.

\[X\] Give each case a unique Case ID.

\[X\] Make the patient clinically plausible.

\[X\] Ensure all patient data is fictional.

Target:

\[X\] Approximately 50–80 total synthetic cases.

IMPORTANT:

The 5–8 cases per CPT is a **target**, not an absolute requirement. Create enough cases to exercise the important rules and failure modes for each CPT.

---

## **7\. Create `Synthetic_Test_Cases.xlsx`**

Maintain both **case-level** and **criterion-level** expected results.

### **Case-level table**

Required columns:

\[X\] Case ID

\[X\] Payer

\[X\] Policy ID

\[X\] CPT

\[X\] Procedure

\[X\] Condition

\[X\] Test Case Type

\[X\] Expected Overall Result

\[X\] Expected Missing Information

\[X\] Expected Exception

\[X\] Notes

Example:

| Case ID | Payer | CPT | Condition | Test Type | Expected Overall Result |
| ----- | ----- | ----- | ----- | ----- | ----- |
| C001 | BrightCare | 22551 | Radiculopathy | All criteria met | MET |
| C002 | BrightCare | 22551 | Radiculopathy | One criterion failed | NOT MET |
| C003 | BrightCare | 22551 | Radiculopathy | Missing information | UNKNOWN |

### **Criterion-level table**

Required columns:

\[X\] Case ID

\[X\] Criterion ID

\[X\] Criterion

\[X\] Expected Result

\[X\] Patient Evidence

\[X\] Notes

Example:

| Case ID | Criterion ID | Criterion | Expected Result | Patient Evidence |
| ----- | ----- | ----- | ----- | ----- |
| C001 | C1 | Diagnosis documented | MET | Physician note |
| C001 | C2 | MRI evidence | MET | MRI report |
| C001 | C3 | ≥6 weeks treatment | MET | PT note |
| C002 | C1 | Diagnosis documented | MET | Physician note |
| C002 | C2 | MRI evidence | MET | MRI report |
| C002 | C3 | ≥6 weeks treatment | NOT MET | 3 weeks PT |

---

## **8\. Create synthetic clinical documents**

For selected cases, create realistic fictional clinical documents.

Create, where relevant:

\[X\] Physician note

\[X\] Specialist note

\[X\] Imaging report

\[X\] Physical therapy note

\[X\] Medication history

\[X\] Laboratory report

\[X\] Procedure history

Create variations:

\[X\] Complete documentation

\[X\] Missing documentation

\[X\] Ambiguous documentation

\[X\] Conflicting documentation

For each document:

\[X\] Assign a Case ID.

\[X\] Assign a Document ID.

\[X\] Record the document type.

\[X\] Record which criterion(s) the document contains evidence for.

Create a document tracker:

| Case ID | Document ID | Document Type | File Name | Contains Evidence For |
| ----- | ----- | ----- | ----- | ----- |
| C001 | DOC001 | Physician Note | C001\_physician.pdf | C1, C4 |
| C001 | DOC002 | MRI Report | C001\_mri.pdf | C2 |
| C001 | DOC003 | PT Note | C001\_pt.pdf | C3 |

### **Deliverables**

\[X\] Generic patient schema

\[X\] Synthetic patient generator

\[X\] `Synthetic_Test_Cases.xlsx`

\[X\] Synthetic clinical documents

\[X\] Approximately 50–80 test cases

# **PART 3 — ACTUAL TESTING OF THE PA PIPELINE**

## **9\. Define actual system input**

For each test case, give the existing PA system:

\[X\] Payer

\[X\] CPT

\[X\] Condition/indication

\[X\] Synthetic patient clinical documents

\[X\] Payer documents, if required by the existing system

DO NOT give the system:

\[X\] Expected answer

\[X\] Expected MET/NOT MET/UNKNOWN

\[X\] Expected PA result

\[X\] Expected failed criterion

\[X\] Ground-truth result

The system should receive the information it would receive in the real-world workflow.

---

## **10\. Run all test cases through the PA pipeline**

For every case:

\[X\] Run the PA determination.

\[X\] Capture PA required/not required.

\[X\] Capture selected policy.

\[X\] Capture applicable medical-necessity criteria.

\[X\] Capture criterion-by-criterion results.

\[X\] Capture missing information.

\[X\] Capture supporting patient evidence.

\[X\] Capture policy evidence.

\[X\] Capture source citations/pages.

# **PART 4 — VALIDATE SYSTEM RESULTS**

## **11\. Compare system output with ground truth**

For every case:

\[X\] Compare PA determination.

\[X\] Compare policy selection.

\[X\] Compare each medical-necessity criterion.

\[X\] Compare MET results.

\[X\] Compare NOT MET results.

\[X\] Compare UNKNOWN results.

\[X\] Compare exception handling.

\[X\] Compare missing-documentation identification.

\[X\] Compare citations.

---

## **12\. Create `PA_Test_Results.xlsx`**

Maintain both **case-level** and **criterion-level** results.

### **Case-level results**

Required columns:

\[X\] Case ID

\[X\] Payer

\[X\] CPT

\[X\] Condition

\[X\] Test Case Type

\[X\] Ground Truth Overall Result

\[X\] System Overall Result

\[X\] Overall PASS/FAIL

Example:

| Case ID | CPT | Ground Truth | System Result | Pass/Fail |
| ----- | ----- | ----- | ----- | ----- |
| C001 | 22551 | MET | MET | PASS |
| C002 | 22551 | NOT MET | MET | FAIL |

### **Criterion-level results**

Required columns:

\[X\] Case ID

\[X\] Criterion ID

\[X\] Ground Truth Criterion Result

\[X\] System Criterion Result

\[X\] Criterion PASS/FAIL

\[X\] System Evidence

\[X\] Policy Citation

\[X\] Patient Citation

\[X\] Error Type

\[X\] Notes

Example:

| Case ID | Criterion ID | Ground Truth | System Result | Pass/Fail | System Evidence | Policy Citation |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| C001 | C1 | MET | MET | PASS | Physician note | p.4 |
| C001 | C2 | MET | MET | PASS | MRI report | p.4 |
| C001 | C3 | MET | NOT MET | FAIL | PT note | p.4 |

# **PART 5 — ERROR ANALYSIS**

## **13\. Analyze every failed case**

For each failure:

\[ \] Identify exact failure.

\[ \] Determine whether it is a PDF-processing error.

\[ \] Determine whether it is a retrieval error.

\[ \] Determine whether it is a policy-understanding error.

\[ \] Determine whether it is an AND/OR logic error.

\[ \] Determine whether it is an exception-handling error.

\[ \] Determine whether it is a patient-evidence extraction error.

\[ \] Determine whether it is a medical-necessity reasoning error.

\[ \] Determine whether it is a citation/provenance error.

\[ \] Identify root cause.

\[ \] Fix the issue where appropriate.

\[ \] Re-run the failed test.

\[ \] Record before/after result.

# **PART 6 — AUTOMATED EVALUATION**

## **14\. Build evaluation script**

\[X\] Read ground-truth dataset.

\[X\] Read system output.

\[X\] Match results by Case ID.

\[X\] Compare overall PA determination.

\[X\] Compare individual criteria.

\[X\] Compare MET/NOT MET/UNKNOWN.

\[X\] Compare missing documentation.

\[X\] Compare exceptions.

\[X\] Compare citations.

\[X\] Calculate PASS/FAIL.

---

## **15\. Calculate metrics**

\[X\] Overall accuracy

\[X\] PA determination accuracy

\[X\] False positives

\[X\] False negatives

\[X\] Criterion-level accuracy

\[X\] MET accuracy

\[X\] NOT MET accuracy

\[X\] UNKNOWN accuracy

\[X\] Exception accuracy

\[X\] Missing-documentation accuracy

\[X\] Citation accuracy

# **PART 7 — REGRESSION TEST SUITE**

## **16\. Convert failures into permanent tests**

\[ \] Save important failed cases.

\[ \] Record original failure.

\[ \] Fix pipeline.

\[ \] Re-run test.

\[ \] Confirm fix.

\[ \] Add test to regression suite.

\[ \] Run regression suite after major pipeline changes.

Include:

\[ \] All criteria met

\[ \] One criterion failed

\[ \] Missing information

\[ \] Boundary conditions

\[ \] AND logic

\[ \] OR logic

\[ \] Exceptions

\[ \] Wrong indication

\[ \] Missing documents

\[ \] Conflicting documents

\[ \] Multiple clinical documents

\[ \] Multiple payers

\[ \] Multiple CPTs

# **FINAL DELIVERABLES**

## **Ground Truth**

\[X\] `Policy_Ground_Truth.xlsx`

\[X\] 10 CPTs identified

\[X\] All criteria documented

\[X\] All requirements linked to source pages/sections

## **Synthetic Test Data**

\[X\] Generic patient schema

\[X\] Synthetic patient generator

\[X\] `Synthetic_Test_Cases.xlsx`

\[X\] Approximately 50–80 synthetic test cases

\[X\] Synthetic clinical documents

\[X\] Document-to-case mapping

## **Actual Testing**

\[X\] All test cases run through existing PA pipeline

\[X\] `PA_Test_Results.xlsx`

\[X\] Case-level results

\[X\] Criterion-level results

\[X\] Error classification

## **Evaluation**

\[X\] Automated evaluation script

\[X\] Accuracy metrics

\[ \] Error analysis report

\[ \] Regression test suite

\[ \] README with setup and execution instructions

# **FINAL SUCCESS CRITERION**

The framework should allow a new test to be created using:

PAYER \+ CPT \+ CONDITION \+ PAYER POLICY

↓

Generate synthetic patient

↓

Generate clinical documents

↓

Run existing PA pipeline

↓

Compare system result against ground truth

↓

Produce PASS/FAIL \+ accuracy metrics \+ failure reason

# **IMPORTANT SEPARATION**

## **GROUND TRUTH**

**What does the payer policy actually say?**

This is manually established from the original payer PDF.

↓

## **TEST CASE DATA**

**What fictional patient should we create to test those policy rules?**

The synthetic patient is deliberately designed to MET, NOT MET, or create UNKNOWN/CONFLICT situations against the policy.

↓

## **ACTUAL TESTING**

**What does our PA system determine when given the patient information?**

The system receives the production-like inputs and does not receive the expected answer.

↓

## **VALIDATION**

**Did the system get it right?**

Compare the system output against the independently established ground truth and expected test-case result.

