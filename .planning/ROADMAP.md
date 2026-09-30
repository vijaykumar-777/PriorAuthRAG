# Project Roadmap & Milestones

## Completed Milestones
- **Milestone 1: 4-Stage Hierarchical RAG Core Architecture**
  - Implement Stage 1 CPT Master Table lookup engine (`cpt_table_lookup.py`).
  - Implement Stage 2 Dynamic TOC Router & Document Registry (`document_registry.py`).
  - Implement Stage 3 Scoped Hybrid Retrieval with Sibling Condition Completion (`hybrid_search_hierarchical.py`).
  - Implement Stage 4 Clinical JSON Synthesis with multi-tier JSON repair (`retrieval-hierarchical.py`).
- **Milestone 2: Dense PDF Fallback Ingestion Pipeline**
  - Dual-strategy router for large (>300 page) policy manuals (`fallback/`).
  - Successfully ingested Cigna Laboratory Management policy (910 pages).
- **Milestone 3: Evaluation Benchmark Infrastructure**
  - 20-query evaluation suite (`eval_lab_management_benchmark.py`).

## Active & Upcoming Milestones
- **Milestone 4: Codebase Onboarding & Standardized GSD Planning Setup**
  - Phase 1: Codebase Mapping (`.planning/codebase/` STACK, ARCHITECTURE, STRUCTURE, etc.).
  - Phase 2: Project Setup (`PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`).
  - Phase 3: Automated Policy Ingestion CLI Tooling.
- **Milestone 5: Prior Authorization Testing & Validation Framework (3-Week Implementation)**
  - Phase 5.1: Ground Truth Specification & Manual Dataset Creation (`Policy_Ground_Truth.xlsx`) [COMPLETED]
  - Phase 5.2: Generic Clinical Patient Schema & Synthetic Test Case Generator (`Synthetic_Test_Cases.xlsx`) [COMPLETED]
  - Phase 5.3: Production-Like Testing Runner Harness & Batch Execution Pipeline [COMPLETED]
  - Phase 5.4: Automated Comparison Engine & Reporting Suite (`PA_Test_Results.xlsx`) [COMPLETED]
  - Phase 5.5: Error Root-Cause Analysis, Pipeline Hardening & Permanent Regression Suite

