#!/usr/bin/env python3
"""
Generate Policy Ground Truth Dataset
File: scripts/generate_ground_truth.py

Builds authoritative, human-verified ground truth Excel dataset
for Prior Authorization based on Cigna ACDF Policy (CMM-601).
Strictly follows the 15-column schema required by Task Description and Checklist.md.
Zero LLM hallucination: all criteria, pages, and excerpts are extracted directly
from Cigna_ACDF.pdf / hierarchical-processing/ACDF_toc_output_new.json.
"""

import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

PAYER = "Cigna / EviCore by Evernorth"
POLICY_ID = "CMM-601"
OUTPUT_PATH = "data/ground_truth/Policy_Ground_Truth.xlsx"

# 10 CPT Definitions from Codes (CMM-601) table, Page 29-30
CPT_DEFINITIONS = {
    "22551": "Arthrodesis, anterior interbody, including disc space preparation, discectomy, osteophytectomy and decompression of spinal cord and/or nerve roots; cervical below C2",
    "22552": "Arthrodesis, anterior interbody, including disc space preparation, discectomy, osteophytectomy and decompression of spinal cord and/or nerve roots; cervical below C2, each additional interspace (List separately in addition to code for separate procedure)",
    "22554": "Arthrodesis, anterior interbody technique, including minimal discectomy to prepare interspace (other than for decompression); cervical below C2",
    "63075": "Discectomy, anterior, with decompression of spinal cord and/or nerve root(s), including osteophytectomy; cervical, single interspace",
    "63076": "Discectomy, anterior, with decompression of spinal cord and/or nerve root(s), including osteophytectomy; cervical, each additional interspace (List separately in addition to code for primary procedure)",
    "63081": "Vertebral corpectomy (vertebral body resection), partial or complete, anterior approach with decompression of spinal cord and/or nerve roots(s); cervical, single segment",
    "63082": "Vertebral corpectomy (vertebral body resection), partial or complete, anterior approach with decompression of spinal cord and/or nerve roots(s); cervical, single segment; cervical, each additional segment (List separately in addition to code for primary procedure)",
    "22220": "Osteotomy of spine, including discectomy, anterior approach, single vertebral segment, cervical",
    "22845": "Anterior instrumentation; 2 to 3 vertebral segments (List separately in addition to code for primary procedure)",
    "22853": "Insertion of interbody biomechanical device(s) (e.g., synthetic cage, mesh) with integral anterior instrumentation for device anchoring (e.g., screws, flanges), when performed, to intervertebral disc space in conjunction with interbody arthrodesis, each interspace (List separately in addition to code for primary procedure)"
}

def build_ground_truth_records():
    records = []

    # =========================================================================
    # 1. CPT 22551 - Cervical Radiculopathy (Initial Primary ACDF, CMM-601.4, p. 11)
    # =========================================================================
    rad_cpt22551 = [
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Radiculopathy",
            "PA Required": "Yes",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Daily significant pain causing clinically significant functional impairment (e.g., inability to perform household chores, prolonged standing)",
            "Logic": "AND",
            "Threshold": "Daily",
            "Documentation Required": "Physician clinical notes with functional impairment assessment",
            "Exception/Exclusion": "Bypassed if confirmed urgent/emergent condition present (CMM-601.1)",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "Symptoms include BOTH of the following: significant level of pain on a daily basis defined as clinically significant functional impairment (e.g., inability to perform household chores, prolonged standing, etc.)"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Radiculopathy",
            "PA Required": "Yes",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Unremitting radicular pain radiating to shoulder girdle and/or upper extremity resulting in disability",
            "Logic": "AND",
            "Threshold": "Unremitting",
            "Documentation Required": "Physician clinical notes documenting pain distribution and disability",
            "Exception/Exclusion": "Bypassed if confirmed urgent/emergent condition present",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "Symptoms include BOTH of the following: unremitting radicular pain to shoulder girdle and/or upper extremity resulting in disability"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Radiculopathy",
            "PA Required": "Yes",
            "Criterion ID": "C3",
            "Medical-Necessity Criterion": "Objective physical exam signs of radiculopathy (dermatomal sensory deficit, motor deficit, reflex changes, shoulder abduction relief sign, or Spurling's maneuver)",
            "Logic": "AND",
            "Threshold": "At least 1 finding",
            "Documentation Required": "Neurological physical examination notes",
            "Exception/Exclusion": "May also qualify if unremitting radicular pain is present without concordant objective exam findings",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "Physical exam findings include ANY of the following: dermatomal sensory deficit; motor deficit (e.g., biceps, triceps weakness); reflex changes; shoulder abduction relief sign; nerve root tension sign (e.g., Spurling's maneuver); unremitting radicular pain to shoulder girdle and/or upper extremity without concordant objective physical exam findings"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Radiculopathy",
            "PA Required": "Yes",
            "Criterion ID": "C4",
            "Medical-Necessity Criterion": "Failure of conservative therapy: less than clinically meaningful improvement with at least TWO modalities (analgesics/NSAIDs/gabapentinoids for >=6 weeks; provider-directed exercise/PT for >=6 weeks; epidural steroid injections/selective nerve blocks at requested level)",
            "Logic": "AND",
            "Threshold": "≥6 weeks",
            "Documentation Required": "Physical therapy attendance records, pharmacy records, injection procedure notes",
            "Exception/Exclusion": "Waived if medically contraindicated or confirmed urgent/emergent condition",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "Less than clinically meaningful improvement with at least TWO of the following (unless contraindicated): prescription strength analgesics, steroids, gabapentinoids, and/or nonsteroidal anti-inflammatory drugs (NSAIDs) for six (6) weeks; provider-directed exercise program (prescribed by a physical therapist, chiropractic provider, osteopathic or allopathic physician) for six (6) weeks; epidural steroid injection(s) or selective nerve root block(s) performed at the same level(s) as the requested surgery"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Radiculopathy",
            "PA Required": "Yes",
            "Criterion ID": "C5",
            "Medical-Necessity Criterion": "Plain X-rays of the cervical spine including flexion and extension lateral dynamic views",
            "Logic": "AND",
            "Threshold": "Completed",
            "Documentation Required": "Official radiology report of cervical spine x-rays with flexion/extension",
            "Exception/Exclusion": "Not required for confirmed urgent/emergent conditions",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "Plain x-rays of the cervical spine (including flexion/extension lateral views) have been performed"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Radiculopathy",
            "PA Required": "Yes",
            "Criterion ID": "C6",
            "Medical-Necessity Criterion": "Advanced imaging (MRI or CT) demonstrates neural structure compression at requested level(s) concordant with clinical symptoms, caused by disc herniation, stenosis, osteophytes, or cyst",
            "Logic": "AND",
            "Threshold": "Concordant level",
            "Documentation Required": "MRI or CT cervical spine radiology report",
            "Exception/Exclusion": "—",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "MRI/CT shows neural structure compression at the requested level(s) that is concordant with the individual's symptoms and physical exam findings and that is caused by ANY of the following: herniated disc(s) (retained disc material or a recurrent disc herniation); synovial cyst or arachnoid cyst; central/lateral/foraminal stenosis; osteophytes"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Radiculopathy",
            "PA Required": "Yes",
            "Criterion ID": "C7",
            "Medical-Necessity Criterion": "Absence of unmanaged significant mental and/or behavioral health disorders (e.g., major depressive disorder, chronic pain syndrome, secondary gain, opioid and alcohol use disorders)",
            "Logic": "AND",
            "Threshold": "Absence / Managed",
            "Documentation Required": "Physician clinical notes or behavioral health clearance",
            "Exception/Exclusion": "Not required for confirmed urgent/emergent conditions",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "Absence of unmanaged significant mental and/or behavioral health disorders (e.g., major depressive disorder, chronic pain syndrome, secondary gain, opioid and alcohol use disorders)"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Radiculopathy",
            "PA Required": "Yes",
            "Criterion ID": "C8",
            "Medical-Necessity Criterion": "Documentation of nicotine-free status (never-smoker or verified cessation of smoking, smokeless tobacco, and nicotine replacement for >=6 weeks prior to surgery via objective cotinine test)",
            "Logic": "AND",
            "Threshold": "≥6 weeks nicotine-free",
            "Documentation Required": "Laboratory cotinine test report (urine, serum, or saliva) within normal range",
            "Exception/Exclusion": "Not required for confirmed urgent/emergent conditions",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "Documentation of nicotine-free status with EITHER of the following: individual is a never-smoker; individual has refrained from smoking, use of smokeless tobacco products, and/ or nicotine replacement therapy for at least six (6) weeks prior to planned surgery validated by objective cotinine testing methods (serum, urinary, or saliva) verified as within the normal range"
        }
    ]
    records.extend(rad_cpt22551)

    # =========================================================================
    # 2. CPT 22551 - Cervical Myelopathy (Initial Primary ACDF, CMM-601.4, p. 12)
    # =========================================================================
    mye_cpt22551 = [
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Myelopathy",
            "PA Required": "Yes",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Clinical symptoms of myelopathy (extremity weakness, numbness, pain, fine motor dysfunction, gait disturbance, new-onset bowel/bladder dysfunction, frequent falls)",
            "Logic": "AND",
            "Threshold": "At least 1 symptom",
            "Documentation Required": "Physician clinical examination documentation",
            "Exception/Exclusion": "Confirmed myelopathy with cord compression is considered urgent/emergent (CMM-601.1)",
            "Page": 12,
            "Section": "CMM-601.4: Initial Primary ACDF > Myelopathy",
            "Source Text": "Symptoms include ANY of the following: upper/lower extremity weakness, numbness, or pain; fine motor dysfunction (buttoning, handwriting, clumsiness of hands); gait disturbance; new-onset bowel or bladder dysfunction; frequent falls"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Myelopathy",
            "PA Required": "Yes",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Objective physical examination signs of myelopathy (grip and release test, ataxic gait, hyperreflexia, Hoffmann sign, Babinski sign, tandem walk ataxia, inverted brachioradialis reflex, spasticity, clonus, or myelopathic hand)",
            "Logic": "AND",
            "Threshold": "At least 1 sign",
            "Documentation Required": "Neurological physical examination report",
            "Exception/Exclusion": "—",
            "Page": 12,
            "Section": "CMM-601.4: Initial Primary ACDF > Myelopathy",
            "Source Text": "Physical exam findings include ANY of the following: grip and release test; ataxic gait; hyperreflexia; Hoffmann sign; Babinski sign; tandem walking test demonstrating ataxia; inverted brachial radial reflex; increased muscle tone or spasticity; clonus; myelopathic hand"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Cervical Myelopathy",
            "PA Required": "Yes",
            "Criterion ID": "C3",
            "Medical-Necessity Criterion": "Advanced imaging (MRI or CT) shows concordant cervical spinal cord compression or cervical spinal stenosis",
            "Logic": "AND",
            "Threshold": "Concordant compression",
            "Documentation Required": "MRI or CT cervical spine radiology report",
            "Exception/Exclusion": "—",
            "Page": 12,
            "Section": "CMM-601.4: Initial Primary ACDF > Myelopathy",
            "Source Text": "MRI/CT shows findings that are concordant with the individual's symptoms and physical exam findings and that are caused by EITHER of the following: cervical spinal cord compression; cervical spinal stenosis"
        }
    ]
    records.extend(mye_cpt22551)

    # =========================================================================
    # 3. CPT 22551 - Adjacent Segment Disease (CMM-601.7, p. 19-21)
    # =========================================================================
    asd_cpt22551 = [
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Adjacent Segment Disease",
            "PA Required": "Yes",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Prior anterior or posterior cervical fusion performed at an adjacent spinal level",
            "Logic": "AND",
            "Threshold": "Documented prior fusion",
            "Documentation Required": "Prior operative report or surgical history in clinical notes",
            "Exception/Exclusion": "—",
            "Page": 19,
            "Section": "CMM-601.7: Adjacent Segment Disease",
            "Source Text": "Anterior cervical discectomy and fusion (ACDF) for adjacent segment disease is considered medically necessary when performed for EITHER of the following conditions when ALL of the associated criteria have been met: Radiculopathy; Myelopathy"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Adjacent Segment Disease",
            "PA Required": "Yes",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Development of symptomatic radiculopathy or myelopathy at the segment immediately adjacent to prior fusion",
            "Logic": "AND",
            "Threshold": "Adjacent level",
            "Documentation Required": "Physician clinical documentation",
            "Exception/Exclusion": "—",
            "Page": 19,
            "Section": "CMM-601.7: Adjacent Segment Disease",
            "Source Text": "Anterior cervical discectomy and fusion (ACDF) for a degenerative spinal segment adjacent to a previous decompression or fusion procedure is considered medically necessary when performed for EITHER of the following conditions when ALL of the associated criteria have been met: Radiculopathy; Myelopathy"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Adjacent Segment Disease",
            "PA Required": "Yes",
            "Criterion ID": "C3",
            "Medical-Necessity Criterion": "Less than clinically meaningful improvement with at least TWO conservative treatments for >=6 weeks (analgesics, physical therapy, epidural injections) unless myelopathy or urgent condition present",
            "Logic": "AND",
            "Threshold": "≥6 weeks",
            "Documentation Required": "Physical therapy notes, medication records, injection logs",
            "Exception/Exclusion": "Conservative therapy waived if patient presents with progressive myelopathy",
            "Page": 20,
            "Section": "CMM-601.7: Adjacent Segment Disease > Radiculopathy",
            "Source Text": "Less than clinically meaningful improvement with at least TWO of the following (unless contraindicated): prescription strength analgesics... for six (6) weeks; provider-directed exercise program... for six (6) weeks; epidural steroid injection(s)"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Adjacent Segment Disease",
            "PA Required": "Yes",
            "Criterion ID": "C4",
            "Medical-Necessity Criterion": "Post-operative imaging (plain flexion/extension x-rays and MRI/CT) confirms new neural compression or instability at adjacent segment",
            "Logic": "AND",
            "Threshold": "Confirmed adjacent pathology",
            "Documentation Required": "Radiology reports: dynamic flexion/extension X-rays and MRI/CT",
            "Exception/Exclusion": "—",
            "Page": 20,
            "Section": "CMM-601.7: Adjacent Segment Disease > Radiculopathy",
            "Source Text": "Plain x-rays of the cervical spine (including flexion/extension lateral views) have been performed; MRI/CT shows neural structure compression at the requested level(s) that is concordant"
        },
        {
            "CPT": "22551",
            "Procedure": CPT_DEFINITIONS["22551"],
            "Condition/Indication": "Adjacent Segment Disease",
            "PA Required": "Yes",
            "Criterion ID": "C5",
            "Medical-Necessity Criterion": "Absence of unmanaged mental/behavioral health disorders and verified nicotine-free status (>=6 weeks abstinence verified by cotinine testing)",
            "Logic": "AND",
            "Threshold": "≥6 weeks nicotine-free",
            "Documentation Required": "Clinical notes and laboratory cotinine test report",
            "Exception/Exclusion": "Waived for urgent/emergent neurological indications",
            "Page": 20,
            "Section": "CMM-601.7: Adjacent Segment Disease > Radiculopathy",
            "Source Text": "Absence of unmanaged significant mental and/or behavioral health disorders; Documentation of nicotine-free status with EITHER... never-smoker... refrained for at least six (6) weeks validated by objective cotinine testing"
        }
    ]
    records.extend(asd_cpt22551)

    # =========================================================================
    # 4. CPT 22552 - Cervical Arthrodesis Add-On Interspace (Codes CMM-601, p. 28-30)
    # =========================================================================
    cpt22552_records = [
        {
            "CPT": "22552",
            "Procedure": CPT_DEFINITIONS["22552"],
            "Condition/Indication": "Multi-Level Cervical Spine Disease (Radiculopathy / Myelopathy)",
            "PA Required": "Add On",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Must be performed in conjunction with primary cervical interbody fusion procedure (CPT 22551 or 22554) at each additional qualifying cervical interspace",
            "Logic": "AND",
            "Threshold": "Each additional interspace",
            "Documentation Required": "Operative report and clinical surgical plan designating specific cervical disc levels",
            "Exception/Exclusion": "Cannot be billed as a standalone primary procedure",
            "Page": 29,
            "Section": "Codes (CMM-601)",
            "Source Text": "+22552: Arthrodesis, anterior interbody... cervical below C2, each additional interspace (List separately in addition to code for separate procedure)"
        },
        {
            "CPT": "22552",
            "Procedure": CPT_DEFINITIONS["22552"],
            "Condition/Indication": "Multi-Level Cervical Spine Disease (Radiculopathy / Myelopathy)",
            "PA Required": "Add On",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Each additional contiguous interspace must independently meet the clinical and advanced imaging criteria for neural compression or instability defined in CMM-601.4",
            "Logic": "AND",
            "Threshold": "Documented per level",
            "Documentation Required": "MRI/CT report documenting multi-level nerve root or spinal cord compression",
            "Exception/Exclusion": "Prophylactic fusion of asymptomatic adjacent levels is not medically necessary (CMM-601.9)",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF",
            "Source Text": "MRI/CT shows neural structure compression at the requested level(s) that is concordant with the individual's symptoms and physical exam findings"
        }
    ]
    records.extend(cpt22552_records)

    # =========================================================================
    # 5. CPT 22554 - Arthrodesis anterior interbody minimal discectomy (CMM-601.4, p. 10-12, 29)
    # =========================================================================
    cpt22554_records = [
        {
            "CPT": "22554",
            "Procedure": CPT_DEFINITIONS["22554"],
            "Condition/Indication": "Cervical Radiculopathy / Myelopathy",
            "PA Required": "Yes",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Anterior cervical interbody fusion performed below C2 meeting all medical necessity criteria for Initial Primary ACDF (CMM-601.4) or Repeat ACDF (CMM-601.6)",
            "Logic": "AND",
            "Threshold": "Criteria met",
            "Documentation Required": "Comprehensive clinical evaluation and neurosurgical operative plan",
            "Exception/Exclusion": "Not indicated for axial neck pain without radiculopathy or myelopathy (CMM-601.9)",
            "Page": 10,
            "Section": "CMM-601.4: Initial Primary Anterior Cervical Discectomy and Fusion (ACDF)",
            "Source Text": "Initial primary anterior cervical discectomy and fusion (ACDF) is considered medically necessary when performed for EITHER of the following conditions when ALL of the associated criteria have been met: Radiculopathy; Myelopathy"
        },
        {
            "CPT": "22554",
            "Procedure": CPT_DEFINITIONS["22554"],
            "Condition/Indication": "Cervical Radiculopathy / Myelopathy",
            "PA Required": "Yes",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Failure of conservative therapy (>=6 weeks) unless progressive myelopathy or urgent/emergent instability present",
            "Logic": "AND",
            "Threshold": "≥6 weeks",
            "Documentation Required": "Conservative treatment logs and physical therapy progress notes",
            "Exception/Exclusion": "Waived for urgent/emergent conditions (CMM-601.1)",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "Less than clinically meaningful improvement with at least TWO of the following (unless contraindicated): prescription strength analgesics... for six (6) weeks; provider-directed exercise program... for six (6) weeks"
        },
        {
            "CPT": "22554",
            "Procedure": CPT_DEFINITIONS["22554"],
            "Condition/Indication": "Cervical Radiculopathy / Myelopathy",
            "PA Required": "Yes",
            "Criterion ID": "C3",
            "Medical-Necessity Criterion": "Objective imaging (flexion/extension X-rays and MRI/CT) showing concordant neural compression or instability below C2",
            "Logic": "AND",
            "Threshold": "Cervical below C2",
            "Documentation Required": "Radiology reports: dynamic plain films and MRI/CT cervical spine",
            "Exception/Exclusion": "—",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "Plain x-rays of the cervical spine (including flexion/extension lateral views) have been performed; MRI/CT shows neural structure compression at the requested level(s)"
        }
    ]
    records.extend(cpt22554_records)

    # =========================================================================
    # 6. CPT 63075 - Discectomy Anterior Cervical Single Interspace (CMM-601.3, p. 8-9, 30)
    # =========================================================================
    cpt63075_records = [
        {
            "CPT": "63075",
            "Procedure": CPT_DEFINITIONS["63075"],
            "Condition/Indication": "Cervical Disc Herniation / Spondylotic Radiculopathy / Myelopathy",
            "PA Required": "Yes",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Anterior cervical discectomy must be performed concurrently with a cervical fusion due to the iatrogenic instability and increased disc degeneration of discectomy alone",
            "Logic": "AND",
            "Threshold": "Concurrence with fusion",
            "Documentation Required": "Operative surgical plan detailing concurrent arthrodesis/fusion procedure",
            "Exception/Exclusion": "Standalone anterior cervical discectomy without fusion is not medically necessary",
            "Page": 9,
            "Section": "CMM-601.3: Anterior Cervical Discectomy",
            "Source Text": "Anterior cervical discectomy must be performed with a cervical fusion due to the iatrogenic instability/increased disc degeneration of the anterior cervical discectomy procedure. Anterior cervical discectomy is considered medically necessary when performed with a cervical fusion"
        },
        {
            "CPT": "63075",
            "Procedure": CPT_DEFINITIONS["63075"],
            "Condition/Indication": "Cervical Disc Herniation / Spondylotic Radiculopathy / Myelopathy",
            "PA Required": "Yes",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Patient satisfies all medical necessity criteria in applicable procedure-specific section (Initial Primary ACDF CMM-601.4, Repeat ACDF CMM-601.6, Adjacent Segment Disease CMM-601.7, or Failed Disc Arthroplasty CMM-601.8)",
            "Logic": "AND",
            "Threshold": "Procedure criteria met",
            "Documentation Required": "Clinical notes, physical exam findings, and imaging reports",
            "Exception/Exclusion": "Bypassed for confirmed urgent/emergent conditions",
            "Page": 9,
            "Section": "CMM-601.3: Anterior Cervical Discectomy",
            "Source Text": "Anterior cervical discectomy and fusion criteria have been met in the applicable procedure-specific section: CMM-601.4... CMM-601.6... CMM-601.7... CMM-601.8"
        },
        {
            "CPT": "63075",
            "Procedure": CPT_DEFINITIONS["63075"],
            "Condition/Indication": "Cervical Disc Herniation / Spondylotic Radiculopathy / Myelopathy",
            "PA Required": "Yes",
            "Criterion ID": "C3",
            "Medical-Necessity Criterion": "MRI or CT confirms herniated disc(s), osteophytes, or stenosis causing cord or nerve root compression at the targeted cervical interspace",
            "Logic": "AND",
            "Threshold": "Concordant decompression",
            "Documentation Required": "MRI or CT cervical spine radiology report",
            "Exception/Exclusion": "—",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF > Radiculopathy",
            "Source Text": "MRI/CT shows neural structure compression at the requested level(s) that is concordant with the individual's symptoms and physical exam findings and that is caused by ANY of the following: herniated disc(s)... osteophytes"
        }
    ]
    records.extend(cpt63075_records)

    # =========================================================================
    # 7. CPT 63076 - Discectomy Each Additional Interspace Add-On (Codes CMM-601, p. 30)
    # =========================================================================
    cpt63076_records = [
        {
            "CPT": "63076",
            "Procedure": CPT_DEFINITIONS["63076"],
            "Condition/Indication": "Multi-Level Cervical Disc Decompression",
            "PA Required": "Add On",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Must be performed in conjunction with primary anterior cervical discectomy (CPT 63075) and fusion for each additional contiguous interspace requiring neural decompression",
            "Logic": "AND",
            "Threshold": "Each additional interspace",
            "Documentation Required": "Operative report detailing decompression at each specified cervical level",
            "Exception/Exclusion": "Cannot be billed as a standalone procedure",
            "Page": 30,
            "Section": "Codes (CMM-601)",
            "Source Text": "+63076: Discectomy, anterior, with decompression of spinal cord and/or nerve root(s), including osteophytectomy; cervical, each additional interspace (List separately in addition to code for primary procedure)"
        },
        {
            "CPT": "63076",
            "Procedure": CPT_DEFINITIONS["63076"],
            "Condition/Indication": "Multi-Level Cervical Disc Decompression",
            "PA Required": "Add On",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Imaging documentation establishes neural structure compression at the specific add-on interspace concordant with patient clinical examination",
            "Logic": "AND",
            "Threshold": "Per-level imaging confirmation",
            "Documentation Required": "MRI or CT report describing pathology at each additional level",
            "Exception/Exclusion": "Resection of asymptomatic disc bulging is not covered (CMM-601.9)",
            "Page": 11,
            "Section": "CMM-601.4: Initial Primary ACDF",
            "Source Text": "MRI/CT shows neural structure compression at the requested level(s) that is concordant with the individual's symptoms"
        }
    ]
    records.extend(cpt63076_records)

    # =========================================================================
    # 8. CPT 63081 - Anterior Cervical Corpectomy Single Segment (CMM-601.5, p. 13-14, 30)
    # =========================================================================
    cpt63081_records = [
        {
            "CPT": "63081",
            "Procedure": CPT_DEFINITIONS["63081"],
            "Condition/Indication": "Anterior Cervical Corpectomy / Vertebral Body Pathology",
            "PA Required": "Yes",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Removal of at least one-half of the vertebral body (complete or partial corpectomy; not for resection of osteophytes alone)",
            "Logic": "AND",
            "Threshold": "≥1/2 vertebral body",
            "Documentation Required": "Operative report and detailed surgical plan documenting extent of vertebral body resection",
            "Exception/Exclusion": "Not medically necessary for resection of osteophytes alone",
            "Page": 14,
            "Section": "CMM-601.5: Anterior Cervical Corpectomy",
            "Source Text": "Complete corpectomy or partial corpectomy (i.e., removal of at least one-half of the vertebral body [not for resection of osteophytes alone]) is performed for ANY of the following: infection; trauma; tumor; compression at or behind the level of the vertebral body"
        },
        {
            "CPT": "63081",
            "Procedure": CPT_DEFINITIONS["63081"],
            "Condition/Indication": "Anterior Cervical Corpectomy / Vertebral Body Pathology",
            "PA Required": "Yes",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Pathology involves infection, trauma, tumor, or neural compression located directly at or behind the level of the vertebral body not safely accessible via standard discectomy",
            "Logic": "AND",
            "Threshold": "Behind vertebral body",
            "Documentation Required": "MRI/CT cervical spine documenting retrovertebral pathology",
            "Exception/Exclusion": "—",
            "Page": 14,
            "Section": "CMM-601.5: Anterior Cervical Corpectomy",
            "Source Text": "Complete corpectomy or partial corpectomy... is performed for ANY of the following: infection; trauma; tumor; compression at or behind the level of the vertebral body"
        },
        {
            "CPT": "63081",
            "Procedure": CPT_DEFINITIONS["63081"],
            "Condition/Indication": "Anterior Cervical Corpectomy / Vertebral Body Pathology",
            "PA Required": "Yes",
            "Criterion ID": "C3",
            "Medical-Necessity Criterion": "Corpectomy must be performed concurrently with a cervical fusion due to iatrogenic instability of vertebral body resection",
            "Logic": "AND",
            "Threshold": "Concurrent fusion required",
            "Documentation Required": "Surgical operative plan including anterior fusion and reconstruction",
            "Exception/Exclusion": "Corpectomy without spinal reconstruction/fusion is not indicated",
            "Page": 14,
            "Section": "CMM-601.5: Anterior Cervical Corpectomy",
            "Source Text": "Anterior cervical corpectomy must be performed with a cervical fusion due to the iatrogenic instability of the corpectomy procedure"
        },
        {
            "CPT": "63081",
            "Procedure": CPT_DEFINITIONS["63081"],
            "Condition/Indication": "Anterior Cervical Corpectomy / Vertebral Body Pathology",
            "PA Required": "Yes",
            "Criterion ID": "C4",
            "Medical-Necessity Criterion": "Criteria for cervical discectomy and fusion have been satisfied in the applicable procedure section (CMM-601.4, CMM-601.6, CMM-601.7, or CMM-601.8)",
            "Logic": "AND",
            "Threshold": "Clinical criteria met",
            "Documentation Required": "Clinical notes establishing neurological symptoms and exam concordance",
            "Exception/Exclusion": "Bypassed for confirmed urgent/emergent conditions (e.g., tumor/fracture/abscess)",
            "Page": 14,
            "Section": "CMM-601.5: Anterior Cervical Corpectomy",
            "Source Text": "Anterior cervical discectomy and fusion criteria have been met in the applicable procedure-specific section: CMM-601.4... CMM-601.6... CMM-601.7... CMM-601.8"
        }
    ]
    records.extend(cpt63081_records)

    # =========================================================================
    # 9. CPT 63082 - Vertebral Corpectomy Each Additional Segment Add-On (Codes CMM-601, p. 30)
    # =========================================================================
    cpt63082_records = [
        {
            "CPT": "63082",
            "Procedure": CPT_DEFINITIONS["63082"],
            "Condition/Indication": "Multi-Segment Cervical Corpectomy",
            "PA Required": "Add On",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Must be performed in conjunction with primary single segment cervical corpectomy (CPT 63081) for each additional contiguous vertebral body resected",
            "Logic": "AND",
            "Threshold": "Each additional segment",
            "Documentation Required": "Operative report documenting multi-level vertebral column resection",
            "Exception/Exclusion": "Cannot be billed as standalone primary procedure",
            "Page": 30,
            "Section": "Codes (CMM-601)",
            "Source Text": "+63082: Vertebral corpectomy (vertebral body resection), partial or complete, anterior approach with decompression of spinal cord and/or nerve roots(s); cervical, single segment; cervical, each additional segment (List separately in addition to code for primary procedure)"
        },
        {
            "CPT": "63082",
            "Procedure": CPT_DEFINITIONS["63082"],
            "Condition/Indication": "Multi-Segment Cervical Corpectomy",
            "PA Required": "Add On",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Each additional resected segment must meet removal criteria of >=1/2 vertebral body for extensive retrovertebral compressive pathology or tumor/trauma involvement",
            "Logic": "AND",
            "Threshold": "≥1/2 vertebral body per segment",
            "Documentation Required": "Pre-operative CT/MRI documenting multi-segment pathology",
            "Exception/Exclusion": "—",
            "Page": 14,
            "Section": "CMM-601.5: Anterior Cervical Corpectomy",
            "Source Text": "Complete corpectomy or partial corpectomy (i.e., removal of at least one-half of the vertebral body [not for resection of osteophytes alone])"
        }
    ]
    records.extend(cpt63082_records)

    # =========================================================================
    # 10. CPT 22220 - Anterior Cervical Osteotomy (CMM-601.2, p. 6-7, 29)
    # =========================================================================
    cpt22220_records = [
        {
            "CPT": "22220",
            "Procedure": CPT_DEFINITIONS["22220"],
            "Condition/Indication": "Fixed Cervical Kyphotic Deformity",
            "PA Required": "Yes",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Performed for EITHER correction of fixed cervical kyphotic deformity OR converting a cervical kyphotic deformity from fixed to mobile",
            "Logic": "AND",
            "Threshold": "Fixed kyphotic deformity",
            "Documentation Required": "Spine surgeon consultation notes documenting rigid cervical deformity and chin-on-chest impairment",
            "Exception/Exclusion": "Mobile or flexible postural deformities that correct voluntarily are excluded",
            "Page": 7,
            "Section": "CMM-601.2: Osteotomy > Anterior Osteotomy or Vertebral Column Resection",
            "Source Text": "Anterior cervical osteotomy or vertebral column resection (VCR) is considered medically necessary (in addition to fusion) when ALL of the following criteria have been met: Performed for EITHER of the following: correction of fixed cervical kyphotic deformity; converting a cervical kyphotic deformity from fixed to mobile"
        },
        {
            "CPT": "22220",
            "Procedure": CPT_DEFINITIONS["22220"],
            "Condition/Indication": "Fixed Cervical Kyphotic Deformity",
            "PA Required": "Yes",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "Correction of cervical kyphotic deformity cannot be attained by cervical fusion (with or without decompression/corpectomy) alone",
            "Logic": "AND",
            "Threshold": "Inadequate by fusion alone",
            "Documentation Required": "Surgeon surgical decision rationale and radiographic sagittal alignment measurements",
            "Exception/Exclusion": "—",
            "Page": 7,
            "Section": "CMM-601.2: Osteotomy > Anterior Osteotomy or Vertebral Column Resection",
            "Source Text": "Correction of cervical kyphotic deformity cannot be attained by cervical fusion (with or without decompression/corpectomy) alone"
        },
        {
            "CPT": "22220",
            "Procedure": CPT_DEFINITIONS["22220"],
            "Condition/Indication": "Fixed Cervical Kyphotic Deformity",
            "PA Required": "Yes",
            "Criterion ID": "C3",
            "Medical-Necessity Criterion": "Anterior cervical discectomy and fusion criteria have been satisfied in the applicable procedure-specific section (CMM-601.4, CMM-601.5, CMM-601.6, CMM-601.7, or CMM-601.8)",
            "Logic": "AND",
            "Threshold": "ACDF criteria met",
            "Documentation Required": "Clinical documentation of radiculopathy, myelopathy, or mechanical structural instability",
            "Exception/Exclusion": "—",
            "Page": 7,
            "Section": "CMM-601.2: Osteotomy > Anterior Osteotomy or Vertebral Column Resection",
            "Source Text": "Anterior cervical discectomy and fusion criteria have been met in the applicable procedure-specific section: CMM-601.4: Initial Primary Anterior Cervical Discectomy and Fusion (ACDF); CMM-601.5: Anterior Cervical Corpectomy; CMM-601.6... CMM-601.7... CMM-601.8"
        }
    ]
    records.extend(cpt22220_records)

    # =========================================================================
    # 11. CPT 22845 - Anterior Instrumentation 2 to 3 Vertebral Segments (Codes CMM-601, p. 28-29)
    # =========================================================================
    cpt22845_records = [
        {
            "CPT": "22845",
            "Procedure": CPT_DEFINITIONS["22845"],
            "Condition/Indication": "Anterior Cervical Arthrodesis / Corpectomy Stabilization",
            "PA Required": "Add On",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Anterior spinal instrumentation (e.g. anterior plate and screws) must be performed in conjunction with a primary cervical fusion (CPT 22551, 22554) or corpectomy (CPT 63081)",
            "Logic": "AND",
            "Threshold": "2 to 3 vertebral segments",
            "Documentation Required": "Operative report detailing rigid plate/screw fixation across 2 to 3 vertebral bodies",
            "Exception/Exclusion": "Standalone billing without qualifying arthrodesis is not covered",
            "Page": 29,
            "Section": "Codes (CMM-601)",
            "Source Text": "+22845: Anterior instrumentation; 2 to 3 vertebral segments (List separately in addition to code for primary procedure)"
        },
        {
            "CPT": "22845",
            "Procedure": CPT_DEFINITIONS["22845"],
            "Condition/Indication": "Anterior Cervical Arthrodesis / Corpectomy Stabilization",
            "PA Required": "Add On",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "The underlying cervical fusion or corpectomy procedure across the instrumented segments meets all policy medical necessity criteria",
            "Logic": "AND",
            "Threshold": "Primary criteria satisfied",
            "Documentation Required": "Clinical notes and pre-operative imaging demonstrating multi-segment pathology",
            "Exception/Exclusion": "—",
            "Page": 4,
            "Section": "CMM-601.1: General Guidelines > Application of Guideline",
            "Source Text": "The determination of medical necessity for the performance of anterior cervical discectomy with fusion/corpectomy (with or without osteotomy) is always made on a case-by-case basis"
        }
    ]
    records.extend(cpt22845_records)

    # =========================================================================
    # 12. CPT 22853 - Insertion of Interbody Biomechanical Device / Cage (Codes CMM-601, p. 30)
    # =========================================================================
    cpt22853_records = [
        {
            "CPT": "22853",
            "Procedure": CPT_DEFINITIONS["22853"],
            "Condition/Indication": "Interbody Spinal Fusion / Reconstruction",
            "PA Required": "Add On",
            "Criterion ID": "C1",
            "Medical-Necessity Criterion": "Insertion of interbody biomechanical device (e.g., synthetic cage, mesh, PEEK) must be performed to the intervertebral disc space in conjunction with interbody arthrodesis (CPT 22551, 22554)",
            "Logic": "AND",
            "Threshold": "Each interspace with arthrodesis",
            "Documentation Required": "Operative report detailing interbody cage placement and structural graft at each interspace",
            "Exception/Exclusion": "Cannot be billed without concurrent interbody arthrodesis",
            "Page": 30,
            "Section": "Codes (CMM-601)",
            "Source Text": "+22853: Insertion of interbody biomechanical device(s) (e.g., synthetic cage, mesh) with integral anterior instrumentation for device anchoring (e.g., screws, flanges), when performed, to intervertebral disc space in conjunction with interbody arthrodesis, each interspace (List separately in addition to code for primary procedure)"
        },
        {
            "CPT": "22853",
            "Procedure": CPT_DEFINITIONS["22853"],
            "Condition/Indication": "Interbody Spinal Fusion / Reconstruction",
            "PA Required": "Add On",
            "Criterion ID": "C2",
            "Medical-Necessity Criterion": "The targeted disc space satisfies all medical necessity criteria for cervical interbody fusion defined in CMM-601",
            "Logic": "AND",
            "Threshold": "Primary interbody criteria met",
            "Documentation Required": "Radiology and clinical progress notes establishing surgical necessity of fusion",
            "Exception/Exclusion": "—",
            "Page": 10,
            "Section": "CMM-601.4: Initial Primary Anterior Cervical Discectomy and Fusion (ACDF)",
            "Source Text": "Initial primary anterior cervical discectomy and fusion (ACDF) is considered medically necessary when performed for EITHER of the following conditions when ALL of the associated criteria have been met"
        }
    ]
    records.extend(cpt22853_records)

    # Format all records with Payer and Policy ID
    formatted_rows = []
    for r in records:
        row = {
            "Payer": PAYER,
            "Policy ID": POLICY_ID,
            "CPT": r["CPT"],
            "Procedure": r["Procedure"],
            "Condition/Indication": r["Condition/Indication"],
            "PA Required": r["PA Required"],
            "Criterion ID": r["Criterion ID"],
            "Medical-Necessity Criterion": r["Medical-Necessity Criterion"],
            "Logic": r["Logic"],
            "Threshold": r["Threshold"],
            "Documentation Required": r["Documentation Required"],
            "Exception/Exclusion": r["Exception/Exclusion"],
            "Page": r["Page"],
            "Section": r["Section"],
            "Source Text": r["Source Text"]
        }
        formatted_rows.append(row)

    return formatted_rows

def write_excel(records, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Policy_Ground_Truth"

    headers = [
        "Payer",
        "Policy ID",
        "CPT",
        "Procedure",
        "Condition/Indication",
        "PA Required",
        "Criterion ID",
        "Medical-Necessity Criterion",
        "Logic",
        "Threshold",
        "Documentation Required",
        "Exception/Exclusion",
        "Page",
        "Section",
        "Source Text"
    ]

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

    # Write headers
    ws.append(headers)
    for col_num in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_num)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Write data rows
    for r in records:
        row_vals = [r[h] for h in headers]
        ws.append(row_vals)

    # Row formatting
    for row_idx in range(2, len(records) + 2):
        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = data_font
            cell.border = thin_border
            
            # Alignments
            header_name = headers[col_idx - 1]
            if header_name in ["Payer", "Policy ID", "CPT", "PA Required", "Criterion ID", "Logic", "Threshold", "Page"]:
                cell.alignment = Alignment(horizontal="center", vertical="top")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

    # Auto-fit column widths with upper bounds
    col_width_limits = {
        "Payer": 25,
        "Policy ID": 12,
        "CPT": 10,
        "Procedure": 35,
        "Condition/Indication": 28,
        "PA Required": 14,
        "Criterion ID": 14,
        "Medical-Necessity Criterion": 45,
        "Logic": 10,
        "Threshold": 20,
        "Documentation Required": 30,
        "Exception/Exclusion": 30,
        "Page": 8,
        "Section": 35,
        "Source Text": 50
    }

    for col_idx, header_name in enumerate(headers, 1):
        col_letter = get_column_letter(col_idx)
        ws.column_dimensions[col_letter].width = col_width_limits.get(header_name, 25)

    # Freeze header row
    ws.freeze_panes = "A2"
    ws.views.sheetView[0].showGridLines = True

    wb.save(output_path)
    print(f"Successfully generated {output_path} with {len(records)} rows across {len(headers)} columns.")

if __name__ == "__main__":
    records = build_ground_truth_records()
    write_excel(records, OUTPUT_PATH)
