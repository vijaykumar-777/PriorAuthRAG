# Prior Authorization Hierarchical RAG Platform: Complete Project Master Documentation

**Project Name:** `PriorAuthRAG` / `project2`  
**System Type:** Clinical Decision Support & Automated Utilization Review Engine  
**Architecture:** 4-Stage Multi-Document Hierarchical RAG with Deterministic Master Table Precertification  
**Primary Tech Stack:** Python 3.12 (FastAPI, LangChain, Groq Qwen-3.8-27b, Ollama Gemma-300M, BM25, Docling) + TypeScript (React 19, Vite, Tailwind CSS)  
**Evaluation Performance:** 86.54% End-to-End Accuracy | 96.15% Prior Auth Classification Accuracy | 100% Precision (YES) | 100% Recall (NO)  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Clinical Problem Statement & Healthcare Context](#2-clinical-problem-statement--healthcare-context)
3. [Chronological Evolution of the Project](#3-chronological-evolution-of-the-project)
4. [Approaches Explored & Why Prior Architectures Failed](#4-approaches-explored--why-prior-architectures-failed)
5. [Final System Architecture: The 4-Stage Pipeline](#5-final-system-architecture-the-4-stage-pipeline)
6. [Data Ingestion, Ontologies & Knowledge Bases](#6-data-ingestion-ontologies--knowledge-bases)
7. [Comprehensive 52-Query Benchmark Evaluation](#7-comprehensive-52-query-benchmark-evaluation)
8. [Clinical Review Portal & Frontend Architecture](#8-clinical-review-portal--frontend-architecture)
9. [Key Technical Challenges & Engineering Solutions](#9-key-technical-challenges--engineering-solutions)
10. [Operations, Deployment & How to Run](#10-operations-deployment--how-to-run)
11. [Repository Structure & File Manifest](#11-repository-structure--file-manifest)

---

## 1. Executive Summary

The **Prior Authorization Hierarchical RAG Platform** is an enterprise-grade artificial intelligence engine designed to automate clinical utilization review for healthcare payers and provider networks. 

Prior authorization is universally recognized as the single largest administrative bottleneck in US healthcare. Clinicians, nurses, and intake coordinators routinely spend 15 to 30 minutes per request manually cross-referencing **14,000+ line master precertification spreadsheets** and navigating **dense 50-to-300+ page clinical coverage policy bulletins** (such as Cigna, UnitedHealthcare, and CMS guidelines).

This project replaces error-prone manual reviews and naive semantic search with a **4-stage hierarchical retrieval and clinical synthesis engine**:
1. **Deterministic Master Table Check:** Instant verification against 14,000+ CPT/HCPCS codes, identifying commercial precertification status and review platforms (e.g., CareCore National, EviCore).
2. **Multi-Document Table of Contents (TOC) Routing:** Uses Docling-extracted hierarchical TOC ontologies to isolate the governing policy document and section branch without brittle keyword hardcoding.
3. **Scoped Hybrid Retrieval:** Executes dual-stage BM25 keyword and dense vector retrieval strictly within the routed TOC branch, preserving parent condition headers and resolving cross-references.
4. **Structured Clinical JSON Synthesis:** Uses high-throughput LLM inference (`qwen/qwen3.8-27b`) to generate audit-ready determinations with medical necessity findings, contraindications, and documentation checklists.

Across a rigorous **52-query clinical benchmark suite**, the platform achieved an overall **86.54% end-to-end accuracy**, **96.15% prior authorization classification accuracy**, **100% precision on Prior Auth YES decisions**, and **100% recall on routine non-precertified services**.

---

## 2. Clinical Problem Statement & Healthcare Context

### The Payer & Provider Dilemma
When a physician orders an advanced surgery, diagnostic test, or therapy (such as an Anterior Cervical Discectomy and Fusion, Lumbar Fusion with Decompression, Total Knee Arthroplasty, or BRCA1/2 Next-Generation Sequencing), health plans require **prior authorization** before agreeing to reimburse the care.

To adjudicate each request, utilization review teams must navigate two disparate data layers:

```
+---------------------------------------------------------------------------------------------------+
| TWO DISPARATE DATA LAYERS IN HEALTHCARE UTILIZATION REVIEW                                        |
+---------------------------------------------------------------------------------------------------+
|  LAYER 1: The Payer Master Precertification Table (Billing / Administrative Layer)                 |
|  - Highly structured, massive database (14,000+ rows).                                             |
|  - Answers: "Is precertification required for CPT code 22551?" (YES / NO / ADD-ON).                |
|  - Identifies: Program (Musculoskeletal), Category (ACDF), Case Build Platform (CareCore National).|
|  - Lacks: Clinical indications, symptom duration, imaging criteria, or lab thresholds.            |
+---------------------------------------------------------------------------------------------------+
|  LAYER 2: The Medical Coverage Policy Guidelines (Clinical / Legal Layer)                         |
|  - Multi-hundred page PDF clinical bulletins written by medical directors.                        |
|  - Answers: "What exact clinical findings make ACDF medically necessary?"                          |
|  - Specifies: 6 weeks of conservative therapy, objective cotinine testing, MRI neural compression. |
|  - Challenge: Extremely dense, hierarchical, with complex exception rules and cross-references.   |
+---------------------------------------------------------------------------------------------------+
```

### Why Standard GenAI & Naive RAG Fail in Clinical Utilization Review
1. **The Semantic Trap of Shared Medical Words:** Clinical terms like *"stent"*, *"artery"*, *"instability"*, *"revascularization"*, and *"imaging"* appear across completely unrelated specialties (Cardiology, Peripheral Vascular, Radiation Oncology, and Spine Surgery). Global vector search frequently pulls chunks from the wrong clinical domain.
2. **Loss of Parent Heading Context:** A retrieved bullet point like *"Must have tried 6 weeks of conservative therapy"* is meaningless unless the system knows whether it belongs to *Cervical Radiculopathy*, *Lumbar Spondylolisthesis*, or *Knee Osteoarthritis*.
3. **Negative Case Hallucinations:** When asked about routine office tests (CBC, lipid panel, routine urinalysis), standard vector search finds semantic similarity in general pathology documents and hallucinates that prior auth is required when it is not.
4. **Dual-Spine Policy Ambiguity:** Conditions like *"Adjacent Segment Disease"* exist in both Cervical Spine (`CMM-601.7`) and Lumbar Spine (`CMM-609.6`) policies. Unstructured RAG cannot resolve which anatomical site applies without structured hierarchical routing.

---

## 3. Chronological Evolution of the Project

The codebase evolved over 23 major git commits spanning September to October 2026:

| Phase | Timeline | Key Commits | Major Breakthroughs & Milestones |
| :--- | :--- | :--- | :--- |
| **Phase 1: Inception & PDF Parsing** | Sep 8 – Sep 11 | `5d00445`, `00b1acc`, `1079351` | Initial repository creation; ingestion of raw Cigna policy PDFs (ACDF, Lumbar, Lab Management) using pdfplumber and early chunking scripts. |
| **Phase 2: OCR & LiteParse Experiments** | Sep 15 – Sep 18 | `ddb23b3`, `de2c621`, `c13c799` | Replaced slow OCR pipelines with LiteParse/Docling; extracted structured heading levels (`#`, `##`, `###`) and built initial BM25 + dense index matrices. |
| **Phase 3: Multi-Specialty Expansion** | Sep 22 – Sep 24 | `5b3c2e0`, `97b0ac3`, `ccb759a` | Ingested Cigna Radiation Oncology guidelines (316 pages); integrated Knowledge Graph analysis (Graphify); built centralized `document_registry.py`. |
| **Phase 4: TOC-Level Routing & Fallbacks** | Sep 25 – Sep 30 | `882a68c`, `0dc6a0a`, `ce7f236` | Identified critical routing failures on ambiguous conditions; engineered Stage 2 constrained TOC candidate router and dynamic condition completion. |
| **Phase 5: Production Portal & Verification** | Oct 14 – Oct 15 | `6692cb3` & HEAD | Integrated production FastAPI backend with minimal React/Vite portal; conducted 52-query clinical benchmark; implemented single-command launcher (`run.sh`/`run.py`); hardened out-of-index CPT handling and rate limiting. |

---

## 4. Approaches Explored & Why Prior Architectures Failed

```
                      EVOLUTION OF RETRIEVAL PARADIGMS
                      
  [1. Naive Flat RAG]        [2. Global Hybrid Search]      [3. 4-Stage Hierarchical RAG]
   Fixed 500-token chunks     BM25 + Dense across corpus     Master Table -> TOC -> Scoped
   Cosine similarity only     No domain isolation            Hybrid -> Structured Synthesis
            │                            │                                  │
            ▼                            ▼                                  ▼
   ❌ 54% Accuracy              ❌ 68% Accuracy                    ✅ 86.5% Accuracy
   ❌ Lost parent headers       ❌ Cross-domain matches            ✅ 100% Precision (YES)
   ❌ Hallucinated routine tests ❌ False positive fallbacks        ✅ 100% Recall (NO)
```

### Approach 1: Naive Flat Chunking & Dense Embeddings
- **Mechanism:** Segmented documents into 500-token windows with 50-token overlap; indexed into Weaviate / ChromaDB.
- **Why It Failed:** 
  - Subsections lost their parent context. A chunk discussing *"Failed conservative management"* could not tell whether it applied to cervical radiculopathy, myelopathy, or repeat revision surgery.
  - Alphanumeric CPT codes (`22551`, `27447`) had near-zero semantic proximity to clinical narrative text in vector space.

### Approach 2: Global Hybrid Search (BM25 + Dense)
- **Mechanism:** Ran parallel BM25 and dense vector searches across all 5 indexed policies simultaneously, combining scores with Reciprocal Rank Fusion (RRF).
- **Why It Failed:**
  - Lexical terms in medicine are heavily overloaded. Queries for leg vascular stents (`CPT 37269`) scored high in Radiation Oncology due to coronary brachytherapy text containing *stent*, *artery*, and *angioplasty*.
  - When asked about routine blood tests, global search always retrieved *some* laboratory guideline chunk, causing the LLM to falsely claim that routine office visits or basic lipid panels required prior authorization.

### Approach 3: Rule-Based / Regex Query Routers
- **Mechanism:** Hardcoded regex maps (e.g., `r"\bknee\b"` &rarr; `Cigna_Knee`).
- **Why It Failed:**
  - Clinicians query by abbreviations, symptoms, and functional deficits (e.g., *"unremitting arm pain with drop in grip strength"* rather than *"cervical radiculopathy"*).
  - Conditions like *"Adjacent Segment Disease"* exist in multiple spinal policies; static keyword matching had no way to distinguish anatomical intent.

---

## 5. Final System Architecture: The 4-Stage Pipeline

```
+----------------------------------------------------------------------------------------------------+
|                               DETAILED 4-STAGE PIPELINE ARCHITECTURE                               |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  Incoming Clinical Query (e.g., "is prior auth required for CPT 37269" or clinical question)       |
|                                                                                                    |
|  ════════════════════════════════════════════════════════════════════════════════════════════════  |
|  STAGE 1: MASTER PRECERTIFICATION TABLE CHECK (cpt_table_lookup.py)                               |
|  ════════════════════════════════════════════════════════════════════════════════════════════════  |
|  • Tier 1: Fast Regex Extraction (0ms) -> Searches output/table.json (14,025 lines, 1,787 CPTs).  |
|    - Direct CPT match: Extracts Prior Auth Status, Program, Category, Case Build Platform.         |
|  • Tier 2: LLM Clinical Verifier (Groq Qwen-3.8-27b) -> For natural language questions.           |
|    - Distinguishes Billable Procedure vs Diagnosis vs Routine Non-Precert Test.                   |
|    - Routine Non-Precert Bypass: Immediately routes routine tests (CBC, Lipid, TSH) to NO.         |
|                                                                                                    |
|                                        │                                                           |
|                                        ▼                                                           |
|  ════════════════════════════════════════════════════════════════════════════════════════════════  |
|  STAGE 2: MULTI-DOCUMENT TOC ROUTING (retrieval-hierarchical.py: route_query_to_toc)              |
|  ════════════════════════════════════════════════════════════════════════════════════════════════  |
|  • Candidate Section Ranker: Evaluates flat_toc across all registered documents:                   |
|    - Direct CPT presence in chunk tables (+25.0 boost)                                             |
|    - Focused BM25 query on procedure category/terms                                                |
|    - Title lexical overlap ratio with flat_toc nodes (+3.0 to +8.0 boost)                         |
|    - Clinical subsection density boost (+2.0 per valid child subsection)                          |
|  • Constrained LLM Router Prompt: Injects procedure program, category, and anatomical rules.       |
|    - Selects single candidate index (1-N) or strict "selected_candidate": null.                   |
|    - Strict Null Handling: Out-of-index procedures (e.g. vascular stents) are NEVER forced into    |
|      unrelated policies (e.g., Radiation Oncology).                                                |
|                                                                                                    |
|                                        │                                                           |
|                                        ▼                                                           |
|  ════════════════════════════════════════════════════════════════════════════════════════════════  |
|  STAGE 3: SCOPED HYBRID RETRIEVAL (retrieval-hierarchical.py: retrieve_scoped_chunks)              |
|  ════════════════════════════════════════════════════════════════════════════════════════════════  |
|  • Bounded Scope: Retrieves chunks ONLY belonging to routed TOC branches (eliminates 95% noise).   |
|  • Hierarchical Condition Completion: Restores full breadcrumb path (Parent > Section > Indication)|
|  • Dynamic Cross-Reference Resolution: Detects intra-policy delegations (e.g., "per CMM-609.4")   |
|    and retrieves referenced sub-criteria while anchoring the primary governing section.           |
|                                                                                                    |
|                                        │                                                           |
|                                        ▼                                                           |
|  ════════════════════════════════════════════════════════════════════════════════════════════════  |
|  STAGE 4: STRUCTURED CLINICAL SYNTHESIS (retrieval-hierarchical.py: normalize_clinical_json)     |
|  ════════════════════════════════════════════════════════════════════════════════════════════════  |
|  • Schema-Enforced JSON Output: Validates against strict clinical determination contract:         |
|    - Prior auth required: ("Yes" | "No" | "Pending Policy Review")                                 |
|    - Policy Name: Governing payer policy title                                                     |
|    - Referred Sections: Specific TOC citations with section IDs                                    |
|    - Medical necessity indications: Multi-category findings (pain, imaging, conservative therapy)  |
|    - Non-Indications: Exclusions and contraindications to rule out                                 |
|    - Important criteria & exceptions: Waivers, smoking cessation, and cotinine validation rules   |
|    - Documentation required: Plain x-rays, MRI/CT, medication logs, operative reports             |
|    - Notice: Contextual summary explaining determination and platform routing                      |
+----------------------------------------------------------------------------------------------------+
```

---

## 6. Data Ingestion, Ontologies & Knowledge Bases

### 1. Master Precertification Table (`output/table.json`)
- **Total Lines:** 14,025 lines
- **Total Procedures:** 1,787 CPT/HCPCS codes
- **Data Attributes:** `Program`, `Category`, `CPT® Code`, `CPT® Code Description`, `Commercial Prior Authorization Required?`, `Commercial Case Build Platform`, `External Notation`.
- **Specialty Programs:** Musculoskeletal, Vascular Interventions, Radiation Oncology, Cardiology, Gastroenterology, Ophthalmology, Durable Medical Equipment.

### 2. Registered Medical Coverage Policies
The active document registry (`hierarchical-processing/document_registry.py`) manages 5 production payer policy ontologies parsed via Docling:

| Document Key | Display Name | Total Pages | Flat TOC Nodes | Indexed Chunks | Governing Domain |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **`Cigna_ACDF`** | Cigna ACDF (CMM-601: Anterior Cervical Discectomy and Fusion) | 26 | 172 | 75 | Cervical Spine Surgery, Radiculopathy, Myelopathy, Corpectomy, Adjacent Segment Disease |
| **`Cigna_Lumbar_Fusion`** | Cigna Lumbar Fusion (CMM-609: Lumbar Fusion with Decompression) | 50 | 286 | 82 | Lumbar Arthrodesis, Instability, Deformity, Spondylolisthesis, Pseudarthrosis |
| **`Cigna_Knee`** | Cigna Knee Surgery (CMM-312) | 24 | 83 | 68 | Total Knee Arthroplasty, Arthroscopy, Chondroplasty, Meniscectomy |
| **`Cigna_Lab_Management`** | Cigna Laboratory Management Guidelines | 358 | 481 | 185 | Molecular Pathology, Genetic Testing, Hereditary Cancer, Pharmacogenomics |
| **`Cigna_Radiation_Oncology`** | Cigna Radiation Oncology Guidelines | 316 | 143 | 140 | IGRT, SBRT/SRS, Proton Beam, Brachytherapy, Radiopharmaceuticals |

---

## 7. Comprehensive 52-Query Benchmark Evaluation

An exhaustive evaluation benchmark was executed across **52 real-world clinical queries** covering 6 distinct query cohorts:

```
================================================================================
                      52-QUERY EVALUATION SUMMARY SCORECARD
================================================================================
Overall End-to-End Accuracy        : 86.54% (45/52)
Prior Auth Classification Accuracy : 96.15% (50/52)
  - Precision (YES Determinations) : 100.0%  (39/39)
  - Recall (YES Determinations)    : 95.12%  (39/41)
  - F1-Score (YES Determinations)  : 97.50%
  - Precision (NO Determinations)  : 84.62%  (11/13)
  - Recall (NO Determinations)     : 100.0%  (11/11)
  - F1-Score (NO Determinations)   : 91.67%
  - Macro-Averaged F1-Score        : 94.59%
Stage 1 (Master Table Lookup)      : 96.15% accuracy
Stage 2 (Policy Document Routing)  : 77.50% accuracy (31/40 applicable)
Stage 3 & 4 (Synthesis & Schema)   : 100.0% valid structured JSON schema
--------------------------------------------------------------------------------
Latency Statistics                 : Mean: 30.25s | Median: 23.86s | P90: 80.69s
Total Benchmark Execution Time     : 1572.91s (~26.2 minutes)
================================================================================
```

### Confusion Matrix

```
                     PREDICTED YES     PREDICTED NO
  ACTUAL YES              39                 2               (Total: 41)
  ACTUAL NO                0                11               (Total: 11)
```
- **Zero False Positives:** The system never imposed a prior authorization requirement on a routine non-precertified service.
- **100% Precision on YES:** Every procedure flagged as requiring prior authorization was verified correct against payer rules.

### Performance by Clinical Cohort

| Query Cohort | Cases | Passed | Accuracy | Avg Latency | Characteristics |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Unambiguous CPT Codes** | 15 | 14 | **93.3%** | 27.04s | Direct inquiries by CPT code (e.g., CPT 22612, 81162, 22207, 77520). |
| **Real Clinical Conditions** | 12 | 11 | **91.7%** | 45.76s | Symptoms and pathologies (e.g., cervical radiculopathy, myelopathy, pseudoarthrosis). |
| **Yes/No Clinical Questions** | 10 | 10 | **100.0%** | 31.95s | Direct binary questions (e.g., *"Is prior auth required for routine chest x-ray?"*). |
| **Routine Non-Precert Services** | 6 | 6 | **100.0%** | 7.79s | Negative cases (CBC, lipid panel, urinalysis, HbA1c) cleanly bypassed. |
| **Database Master Table Matches** | 1 | 1 | **100.0%** | 0.81s | Instant sub-second master table resolution. |
| **Ambiguous / Vague Queries** | 8 | 3 | **37.5%** | 31.39s | Stress-test cohort with incomplete clinical details. |

---

## 8. Clinical Review Portal & Frontend Architecture

The user interface was built to provide clinicians and review nurses with an immediate, high-signal workspace:

```
+----------------------------------------------------------------------------------------------------+
|                                    MINIMAL CLINICAL PORTAL LAYOUT                                  |
+----------------------------------------------------------------------------------------------------+
|  [HEADER] PriorAuth RAG Portal  |  Decision Engine  |  Coverage Policies & TOC  |  API: 127.0.0.1  |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [COMMAND BAR]                                                                                     |
|  [  e.g., When is adjacent segment disease considered medically necessary            ] [Evaluate]  |
|  Quick Shortcuts: [ / ] Focus Search   [ Esc ] Clear   [ Ctrl+Enter ] Run   [ 1-5 ] Switch Tabs    |
|                                                                                                    |
|  [PROGRESSIVE 4-STAGE PIPELINE STEPPER]                                                            |
|  (✓) Stage 1: Master Table  ──> (✓) Stage 2: TOC Routing ──> (✓) Stage 3: Retrieval ──> (✓) Stage 4|
|                                                                                                    |
|  [DETERMINATION SUMMARY CARD]                                                                      |
|  Determination : PRIOR AUTHORIZATION REQUIRED                                                     |
|  Policy        : Cigna Lumbar Fusion (CMM-609)                                                     |
|  Citations     : CMM-609.6: Adjacent Segment Disease, CMM-609.4, CMM-609.5                        |
|  Actions       : [ Copy Clinical Review Note for EHR ] [ Copy Raw JSON ]                           |
|                                                                                                    |
|  [TABBED CLINICAL FINDINGS INSPECTOR]                                                              |
|  [ 1. Indications (6) ] [ 2. Non-Indications (4) ] [ 3. Documentation (5) ] [ 4. Exceptions ]     |
|  Filter criteria: [ Filter findings...                                      ]                      |
|  ☑ [Met] Prior adjacent-level fusion performed at least 6 months prior.                            |
|  ☐ [Pending] Imaging demonstrates dynamic instability >3mm or Grade II+ spondylolisthesis.         |
|  ☑ [Met] Validated nicotine-free status for 6 weeks via objective cotinine test.                  |
+----------------------------------------------------------------------------------------------------+
```

### Key Frontend Features
1. **Progressive 4-Stage Stepper:** Visualizes pipeline execution in real-time, displaying elapsed times for Stage 1 (Master Table), Stage 2 (TOC Routing), Stage 3 (Scoped Retrieval), and Stage 4 (Clinical Synthesis).
2. **Authentic Directory Text Tree Inspector:** Renders the policy Table of Contents in true directory tree syntax (`├──`, `└──`, `│   `), complete with section pills, page numbers, search filtering, and one-click line copying.
3. **EHR Clinical Note Exporter:** Automatically compiles checked findings, cited sections, governing policy, and determination into a standardized clinical memo formatted for Epic or Cerner chart notes.
4. **Global Keyboard Accelerators:**
   - `/`: Focus search input
   - `Esc`: Clear or blur search
   - `Ctrl + Enter` / `Cmd + Enter`: Trigger clinical evaluation
   - `1` – `5`: Instant switching between *Indications*, *Non-Indications*, *Documentation*, *Exceptions*, and *Raw JSON* tabs.

---

## 9. Key Technical Challenges & Engineering Solutions

### Challenge 1: Out-of-Index CPT Fallback Trap (CPT 37269 & Radiation Oncology)
- **Problem:** When querying `CPT 37269` (femoral-popliteal leg stent), Stage 1 confirmed Prior Auth was required under *Vascular Interventions*. However, because no peripheral vascular policy PDF was indexed, BM25 searched the 100-word CPT description and matched *Brachytherapy of the Coronary Arteries* in Radiation Oncology. Even though the LLM router returned `selected_candidate: null`, an old fallback rule (`elif score >= 35.0`) overrode the LLM and forced Radiation Oncology.
- **Solution:** 
  1. Injected anatomical domain rules into the LLM prompt (peripheral vascular &ne; coronary brachytherapy).
  2. Enforced strict null handling: if the LLM returns `null`, the system **strictly respects the rejection** and never forces an arbitrary fallback.
  3. Structured Master Table Notice: When a CPT is verified in the Master Table but no clinical policy is in the registry, the system outputs the verified determination (`Prior Auth: Yes`, Program: `Vascular Interventions`, Platform: `CareCore National`) and leaves the clinical checklist empty rather than hallucinating wrong criteria.

### Challenge 2: Groq API Rate Limiting (8,000 TPM Ceiling & HTTP 429 Errors)
- **Problem:** Groq's API key has an **8,000 Tokens Per Minute (TPM)** ceiling for `qwen/qwen3.8-27b`. Because `call_llm` had hardcoded `max_tokens: 5000` across all stages, a single query with 4,500 prompt tokens reserved `4,500 + 5,000 = 9,500 tokens`, instantly breaching the 8,000 TPM limit and triggering HTTP 429 errors on follow-up calls.
- **Solution:** 
  1. Implemented **dynamic token budgeting** by stage:
     - Stage 1 Verifier: `max_tokens=150`
     - Stage 2 TOC Router: `max_tokens=200`
     - Stage 4 Synthesis: `max_tokens=1500`
  2. Added seamless local Ollama fallback (`192.168.0.33` hosting `Qwen3.8-27B-GGUF` and `medgemma-1.5-4b`) if Groq encounters rate limits or network latency.

### Challenge 3: Cross-Reference Drowning (Adjacent Segment Disease Source Attribution)
- **Problem:** In `Cigna_Lumbar_Fusion`, Section `S9.2 (CMM-609.6: Adjacent Segment Disease)` requires prior fusion &ge; 6 months prior **AND** compliance with `CMM-609.4` (Fusion with Decompression) or `CMM-609.5` (without Decompression). The cross-reference resolver pulled 12 extra chunks from those general sections, causing the LLM to attribute indications to general fusion sections rather than Adjacent Segment Disease.
- **Solution:** Anchored the primary routed section (`CMM-609.6`) as the immutable governing source in `normalize_clinical_json`. Sub-criteria from `CMM-609.4` are explicitly marked as cross-referenced prerequisite findings under the main policy.

---

## 10. Operations, Deployment & How to Run

### Unified Single-Command Launcher
The entire platform (FastAPI backend on port `8000` + Vite frontend on port `3000`) can be started with a single command:

```bash
# Option 1: Executable bash launcher
./run.sh

# Option 2: Unified Python orchestrator
python3 run.py

# Option 3: npm runner
npm run dev
```

### What the Launcher Does Automatically
1. **Port Cleanup:** Detects and cleanly frees ports `8000` and `3000` if occupied by zombie processes.
2. **Virtual Environment Detection:** Automatically binds to `./venv/bin/python`.
3. **Dependency Verification:** Verifies frontend `node_modules` and runs `npm install` if missing.
4. **Backend Readiness Polling:** Boots FastAPI and verifies `http://127.0.0.1:8000/api/health` before launching the Vite dev server.
5. **Unified Colored Logs:** Streams backend logs in `[BACKEND]` (cyan) and frontend logs in `[FRONTEND]` (green).
6. **Graceful Termination:** Intercepts `Ctrl+C` (SIGINT/SIGTERM) and terminates all child process groups with zero orphaned background tasks.

### Active Endpoints

| Service | Address | Description |
| :--- | :--- | :--- |
| **Frontend Portal** | `http://localhost:3000` | Clinician Review Portal & Decision Engine |
| **Backend API** | `http://127.0.0.1:8000` | FastAPI REST API |
| **Query Endpoint** | `POST http://127.0.0.1:8000/api/query` | Executes 4-stage retrieval and structured synthesis |
| **Policies Endpoint** | `GET http://127.0.0.1:8000/api/policies` | Lists registered payer coverage policies and chunk metrics |
| **TOC Endpoint** | `GET http://127.0.0.1:8000/api/toc?doc_key=...` | Returns hierarchical TOC tree for directory visualization |
| **History Endpoint** | `GET http://127.0.0.1:8000/api/history` | Retrieves recently generated clinical evaluation reports |
| **Swagger Docs** | `http://127.0.0.1:8000/docs` | Interactive OpenAPI documentation and testing sandbox |

---

## 11. Repository Structure & File Manifest

```
project2/
├── run.sh                                   # Executable bash launcher for both servers
├── run.py                                   # Unified Python orchestrator (healthchecks, port management)
├── api_server.py                            # Production FastAPI server exposing /api/query, /api/toc, etc.
├── retrieval-hierarchical.py                # Core 4-stage hierarchical RAG pipeline
├── hybrid_search_hierarchical.py            # Bounded BM25 + dense hybrid search functions
├── cpt_table_lookup.py                      # Stage 1 deterministic master table search engine
├── document_registry.py                     # Multi-policy registry managing TOCs, BM25, and metadata
├── output/
│   └── table.json                           # Cigna Master Precertification Table (14,025 lines, 1,787 CPTs)
├── data/
│   ├── knowledge_bases/                     # Policy embeddings (.npy), BM25 (.pkl), and metadata (.json)
│   ├── results_new/                         # Timestamped structured JSON determination reports
│   └── test_runs/                           # 52-query benchmark results and evaluation metrics
├── priorauth-rag-portal/                    # React 19 + TypeScript + Vite frontend
│   ├── src/
│   │   ├── App.tsx                          # Root application layout
│   │   ├── components/
│   │   │   ├── MinimalHeader.tsx            # Midnight Executive Navy navigation bar
│   │   │   ├── MinimalDecisionEngine.tsx    # Command bar, 4-stage stepper, checklist, EHR export
│   │   │   ├── MinimalPoliciesView.tsx      # Directory text tree inspector (├──, └──)
│   │   │   └── Toast.tsx                    # System notification alerts
│   │   └── types.ts                         # TypeScript interfaces for API payloads
│   ├── vite.config.ts                       # Vite server configuration with /api reverse proxy
│   └── package.json                         # Frontend dependencies
├── 50q_hierarchical_rag_evaluation_report.md# Complete 52-query benchmark evaluation scorecard
├── FRONTEND_SPEC.md                         # Frontend design tokens and specification
└── PROJECT_OVERVIEW.md                      # This comprehensive master project documentation
```

---

*This document serves as the comprehensive technical overview of the Prior Authorization Hierarchical RAG Platform, verifying its architecture, clinical validity, benchmark performance, and operational deployment.*
