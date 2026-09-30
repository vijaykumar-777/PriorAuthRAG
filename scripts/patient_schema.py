#!/usr/bin/env python3
"""
Generic Clinical Patient Schema
File: scripts/patient_schema.py

Defines a reusable, payer-agnostic clinical patient data model for Prior Authorization.
Contains strictly clinical EHR observations (demographics, symptoms, physical exam,
conservative therapies, imaging, labs, and documents).
Zero policy criteria or answer keys are hardcoded in this schema.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional
import json

@dataclass
class Demographics:
    age: int
    sex: str
    dob: Optional[str] = None
    mrn: Optional[str] = None

@dataclass
class Diagnosis:
    code: str
    description: str
    status: str = "active"
    onset_date: Optional[str] = None

@dataclass
class Symptom:
    symptom: str
    location: str
    severity: str
    frequency: str = "daily"
    duration_weeks: Optional[int] = None

@dataclass
class Medication:
    name: str
    dosage: str
    duration_weeks: int
    response: str

@dataclass
class ImagingStudy:
    modality: str  # MRI, CT, X-ray
    type: str      # e.g., Cervical spine flexion/extension
    date: str
    findings: str
    impression: Optional[str] = None

@dataclass
class LabResult:
    test: str
    date: str
    value: str
    reference_range: Optional[str] = None
    interpretation: Optional[str] = None

@dataclass
class ConservativeTreatment:
    pt_weeks: int
    pt_sessions: int
    provider: str
    modalities: List[str] = field(default_factory=list)
    response: str = "Inadequate relief"
    contraindicated: bool = False
    contraindication_reason: Optional[str] = None

@dataclass
class GenericPatient:
    patient_id: str
    demographics: Demographics
    diagnoses: List[Diagnosis] = field(default_factory=list)
    symptoms: List[Symptom] = field(default_factory=list)
    symptom_duration: str = ""
    clinical_findings: Dict[str, Any] = field(default_factory=dict)
    treatments: List[str] = field(default_factory=list)
    conservative_treatment: Optional[ConservativeTreatment] = None
    medications: List[Medication] = field(default_factory=list)
    imaging: List[ImagingStudy] = field(default_factory=list)
    labs: List[LabResult] = field(default_factory=list)
    procedures: List[Dict[str, Any]] = field(default_factory=list)
    physician_assessment: str = ""
    documents: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "GenericPatient":
        d_data = data.get("demographics", {})
        demographics = Demographics(**d_data) if isinstance(d_data, dict) else d_data
        
        diagnoses = [Diagnosis(**d) if isinstance(d, dict) else d for d in data.get("diagnoses", [])]
        symptoms = [Symptom(**s) if isinstance(s, dict) else s for s in data.get("symptoms", [])]
        medications = [Medication(**m) if isinstance(m, dict) else m for m in data.get("medications", [])]
        imaging = [ImagingStudy(**img) if isinstance(img, dict) else img for img in data.get("imaging", [])]
        labs = [LabResult(**l) if isinstance(l, dict) else l for l in data.get("labs", [])]
        
        ct_data = data.get("conservative_treatment")
        conservative_treatment = None
        if ct_data and isinstance(ct_data, dict):
            conservative_treatment = ConservativeTreatment(**ct_data)
        elif isinstance(ct_data, ConservativeTreatment):
            conservative_treatment = ct_data
            
        return cls(
            patient_id=data["patient_id"],
            demographics=demographics,
            diagnoses=diagnoses,
            symptoms=symptoms,
            symptom_duration=data.get("symptom_duration", ""),
            clinical_findings=data.get("clinical_findings", {}),
            treatments=data.get("treatments", []),
            conservative_treatment=conservative_treatment,
            medications=medications,
            imaging=imaging,
            labs=labs,
            procedures=data.get("procedures", []),
            physician_assessment=data.get("physician_assessment", ""),
            documents=data.get("documents", [])
        )
