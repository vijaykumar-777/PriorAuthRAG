# Minimal Frontend Specification: Prior Authorization RAG Interface

**Document Version:** 1.0.0  
**Target System:** Multi-Document TOC-Guided Hierarchical Prior Authorization RAG  
**Design Philosophy:** Minimalist, high-clarity clinical decision support UI with zero fluff, immediate visual determinations, and collapsible evidence drill-downs.

---

## 1. Executive Overview

The frontend serves as an operational portal for clinical reviewers, prior auth coordinators, and physicians to evaluate whether a proposed procedure or clinical condition requires commercial prior authorization and what specific clinical criteria and documentation must be satisfied.

### Key Objectives
1. **Instant Clarity:** The reviewer must see the Prior Auth status (`YES` / `NO` / `NOT REQUIRED`) in under 1 second of loading.
2. **Transparent Evidence Trail:** Clear display of which medical policy and TOC subsections were cited.
3. **Actionable Checklists:** Categorized required findings and documentation checklists that can be verified against patient charts.
4. **Minimal Technical Overhead:** Single-page interface deployable with standard vanilla HTML/CSS/JS or lightweight framework, communicating with a lightweight REST API.

---

## 2. Page Layout & Wireframe

```
+---------------------------------------------------------------------------------------+
|  [+] PriorAuth RAG Portal                       System Status: [● Online - Groq/Ollama] |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  [ SEARCH & QUERY INPUT ]                                                             |
|  +----------------------------------------------------------------------+  [ RUN ]   |
|  | e.g., When is adjacent segment disease considered medically necessary |  [CLEAR]   |
|  +----------------------------------------------------------------------+            |
|  Quick Samples: [CPT 22551 ACDF] [Adjacent Segment] [CPT 85025 CBC] [Knee TKA 27447]  |
|                                                                                       |
|  [ PIPELINE STATUS STEPPER ] (Visible during execution)                               |
|  (✓) Master Table  ->  (✓) Policy & TOC Routing  ->  (✓) Hybrid Search  ->  (✓) LLM   |
|                                                                                       |
|=======================================================================================|
|  [ DETERMINATION HEADER CARD ]                                                        |
|  +---------------------------------------------------------------------------------+  |
|  |  PRIOR AUTHORIZATION: [ YES - REQUIRED ]       Policy: Cigna ACDF (CMM-601)    |  |
|  |  Referred Sections: [ CMM-601.7: Adjacent Segment Disease (TOC: S12.1.1, S12.1.2) ]  |
|  +---------------------------------------------------------------------------------+  |
|                                                                                       |
|  [ CLINICAL CRITERIA TABS / PANELS ]                                                  |
|  +---------------------------------------------------------------------------------+  |
|  | [1. Medical Necessity Indications (2)] | 2. Non-Indications | 3. Documentation |  |
|  +---------------------------------------------------------------------------------+  |
|  |                                                                                 |  |
|  |  ▼ Category: Adjacent Segment Disease > Radiculopathy                           |  |
|  |    [ ] > 6 months since prior cervical decompression/fusion                     |  |
|  |    [ ] Significant daily pain causing functional impairment                     |  |
|  |    [ ] Failed >= 6 weeks conservative therapy (PT, NSAIDs, injections)          |  |
|  |    [ ] MRI/CT demonstrates concordant nerve root compression                    |  |
|  |    [ ] Nicotine-free status confirmed by objective cotinine testing             |  |
|  |                                                                                 |  |
|  |  ▼ Category: Adjacent Segment Disease > Myelopathy                              |  |
|  |    [ ] Symptoms: upper/lower weakness, gait ataxia, fine motor loss             |  |
|  |    [ ] Physical exam: positive Hoffmann/Babinski, hyperreflexia, clonus         |  |
|  |    [ ] Imaging: cervical spinal cord compression or stenosis                   |  |
|  +---------------------------------------------------------------------------------+  |
|                                                                                       |
|  [ NON-INDICATIONS & EXCLUSIONS ] (Rose Alert Box)                                    |
|  ! Not covered if < 6 months from prior surgery                                       |
|  ! Isolated axial neck pain without radiculopathy/myelopathy                          |
|  ! Active unmanaged behavioral health or opioid use disorders                         |
|                                                                                       |
|  [ REQUIRED DOCUMENTATION CHECKLIST ] (Sky Blue Checklist Card)                       |
|  [ ] Flexion/extension lateral cervical x-rays and MRI/CT reports                     |
|  [ ] Physical therapy progress notes documenting 6-week conservative trial            |
|  [ ] Lab cotinine test result confirming nicotine abstinence                          |
|                                                                                       |
|  [ FOOTER CONTROLS ]                                                                  |
|  [Copy Structured JSON]  [Print / Export PDF]  [View Raw API Response]               |
+---------------------------------------------------------------------------------------+
```

---

## 3. Component Specifications

### 3.1. Query Console (`<QueryConsole />`)
- **Input Field:** Large text input (`font-size: 1.05rem`), auto-expanding or single-line with enter key trigger.
- **Quick Query Pills:** Clickable chips for common clinical query patterns:
  - `"CPT 22551 ACDF criteria"`
  - `"When is adjacent segment disease considered medically necessary"`
  - `"Is prior auth required for routine complete blood count CPT 85025"`
  - `"Coverage requirements for CPT 27447 total knee arthroplasty"`
  - `"Non-indications for lumbar spinal fusion"`
- **Execute Button:** Visual loading state with disabled input during inference.

### 3.2. Execution Progress Stepper (`<PipelineStepper />`)
Animated 4-node stepper displaying real-time stage transitions:
1. `Stage 1: Master Table CPT Lookup` (50ms)
2. `Stage 2: Multi-Document TOC Routing` (~1-2s)
3. `Stage 3: Scoped Hybrid Retrieval` (~0.5s)
4. `Stage 4: Structured LLM Synthesis` (~10-20s)

### 3.3. Determination Header (`<DeterminationBanner />`)
- **Status Badge:**
  - `YES`: Green badge (`bg: #ecfdf5`, `border: #10b981`, `text: #065f46`)
  - `NO` (Routine Bypass): Blue badge (`bg: #eff6ff`, `border: #3b82f6`, `text: #1e40af`)
  - `NOT APPLICABLE`: Gray/Amber badge (`bg: #fefce8`, `border: #eab308`, `text: #854d0e`)
- **Policy Name:** Displayed as bold subtitle (e.g., `Cigna ACDF (CMM-601)`).
- **Cited Section Tags:** Clickable pill tags showing `[TOC: S12.1.1] Adjacent Segment Disease`.

### 3.4. Clinical Indications Accordion (`<IndicationsView />`)
- Groups indications by `Guideline Category` (e.g., *Radiculopathy*, *Myelopathy*, *Spondylolisthesis*).
- Interactive checkboxes next to each criterion allowing a nurse or physician to check off criteria in real-time as they audit clinical charts.
- Highlights boolean logic (e.g., **"ALL of the following"**, **"At least TWO of the following"**).

### 3.5. Non-Indications Callout Box (`<NonIndicationsCallout />`)
- Red/Rose styling (`bg: #fff1f2`, `border: #f43f5e`).
- Unambiguous list of clinical contraindications, experimental exclusions, or scenarios deemed not medically necessary.

### 3.6. Documentation Checklist (`<DocumentationChecklist />`)
- Blue/Indigo styling (`bg: #f8fafc`, `border: #cbd5e1`).
- Bulleted checklist of exact required records (imaging views, PT dates, lab tests, operative reports).

### 3.7. Raw JSON Modal / Drawer (`<JsonDrawer />`)
- Hidden by default; toggled via **"View Raw JSON"** button.
- Syntax-highlighted JSON viewer with one-click **"Copy JSON to Clipboard"**.

---

## 4. REST API Contract

The frontend connects to a minimal backend endpoint (FastAPI or Flask):

### `POST /api/query`

#### Request Payload:
```json
{
  "query": "When is adjacent segment disease considered medically necessary for cervical spine surgery?"
}
```

#### Response Payload (Matches standard project schema):
```json
{
  "Prior auth required": "Yes",
  "Policy Name": "Cigna ACDF (CMM-601: Anterior Cervical Discectomy and Fusion)",
  "Referred Sections": [
    "CMM-601.7: Adjacent Segment Disease > Radiculopathy (TOC: S12.1.1)",
    "CMM-601.7: Adjacent Segment Disease > Myelopathy (TOC: S12.1.2)"
  ],
  "Medical necessity indications": [
    {
      "Guideline Category": "Adjacent Segment Disease > Radiculopathy",
      "Required findings": [
        "Greater than six (6) months since prior cervical decompression or fusion",
        "Significant daily functional impairment and radicular pain",
        "Failed >= 6 consecutive weeks conservative care (PT, NSAIDs, injections)",
        "MRI/CT concordant neural compression",
        "Verified nicotine-free status via objective cotinine test"
      ],
      "Source": "CMM-601.7: Adjacent Segment Disease > Radiculopathy (TOC: S12.1.1)"
    }
  ],
  "Non-Indications": [
    "Surgery performed less than 6 months after prior surgery",
    "Isolated axial neck pain without radiculopathy or myelopathy",
    "Unmanaged mental health or opioid use disorders"
  ],
  "Important criteria & exceptions": [
    "Conservative care requirement waived if rapid progressive neurological deficit is present"
  ],
  "Documentation required": [
    "Flexion/extension lateral cervical x-rays and advanced imaging (MRI/CT)",
    "Physical therapy progress notes documenting 6-week conservative trial",
    "Objective lab cotinine test result within normal non-smoker limits"
  ]
}
```

---

## 5. Technology Stack & Implementation Recommendations

1. **Lightweight Backend:**
   - **FastAPI** (`backend/app.py`): ~50 lines of Python code importing `retrieval-hierarchical.py` and exposing `/api/query` with CORS enabled.
2. **Minimal Single-Page Frontend (No Build Steps Required):**
   - **HTML5:** Semantic structure with native dialog for JSON modal.
   - **Vanilla CSS:** CSS custom properties for clinical palette, flexbox/grid layout, responsive mobile/tablet breakpoints.
   - **Vanilla JavaScript:** `fetch('/api/query')` with async/await, DOM updates, and copy-to-clipboard.
3. **Zero Heavy Dependencies:**
   - No React/Webpack build toolchain required unless scaling to an enterprise EHR-embedded application.
   - Runs out-of-the-box via `uvicorn backend.app:app --port 8000`.

---

## 6. Color Tokens & Design System

| Token | Hex / HSL | Usage |
| :--- | :--- | :--- |
| `--color-bg` | `#f8fafc` (Slate 50) | Main page background |
| `--color-surface` | `#ffffff` | Card surfaces, modals |
| `--color-primary` | `#0284c7` (Sky 600) | Primary buttons, active tabs |
| `--color-text-main`| `#0f172a` (Slate 900) | Primary headings, criteria text |
| `--color-text-muted`| `#64748b` (Slate 500) | Secondary subtitles, timestamps |
| `--status-yes-bg` | `#ecfdf5` (Emerald 50) | `Prior Auth: Yes` background |
| `--status-yes-text`| `#065f46` (Emerald 800)| `Prior Auth: Yes` text |
| `--status-no-bg` | `#eff6ff` (Blue 50) | `Prior Auth: No` background |
| `--status-no-text` | `#1e40af` (Blue 800) | `Prior Auth: No` text |
| `--danger-bg` | `#fff1f2` (Rose 50) | Non-indications card background |
| `--danger-border` | `#f43f5e` (Rose 500) | Non-indications left border accent |
