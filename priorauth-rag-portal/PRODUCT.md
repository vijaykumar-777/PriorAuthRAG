# Product Overview: PriorAuth RAG Decision Portal

## Purpose
PriorAuth RAG is an AI-powered Clinical Decision Support engine built for prior authorization intake coordinators, nurse reviewers, and medical directors. It provides instantaneous, evidence-grounded determinations and medical necessity criteria evaluation directly mapped to commercial health plan coverage policies (e.g., Cigna CMM guidelines, UHC, Medicare).

## Primary Users & Jobs
- **Intake Specialists**: Inquire about CPT codes (e.g., CPT 22551, 22552, 29881) to determine immediately whether commercial Prior Authorization is Required, Not Required, or an Add-On procedure.
- **Clinical & Medical Reviewers**: Review complex surgical requests (e.g., Adjacent Segment Disease, Lumbar Fusion with Decompression, Knee Arthroscopy) against specific clinical indication checklists, contraindications, conservative therapy durations, and required chart documentation.

## Core Capabilities
- **4-Stage Retrieval Engine**:
  1. CPT Master Table & Intent Classification
  2. Multi-Document Hierarchical Table-of-Contents (TOC) Routing
  3. Scoped Hybrid Retrieval (BM25 Lexical + Ollama Dense Vectors)
  4. Structured Clinical LLM Synthesis (Groq Qwen 3.8-27b)
- **Checklist Verification**: Interactive checkboxes to verify patient clinical criteria item-by-item against policy findings.
- **Clinical EHR Export**: One-click generation of formatted clinical review notes for Epic/Cerner chart pasting.

## Platform
- **Web**: React 19 + TypeScript + Tailwind CSS (Vite dev server on port 3000, proxied to FastAPI backend on port 8000).
