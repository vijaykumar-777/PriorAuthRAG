# Commit 22: stage5.5 just before making the changes to the pipeline to get a higher accuracy 50

<nav>
  <a href="../21_0dc6a0a_documentation-part-is-done-and-the-query-adja/README.md">&larr; Previous Commit (0dc6a0a)</a> | 
  <a href="../README.md">All Commits Index</a>
 | <a href="../23_6692cb3_frontend-connected/README.md">Next Commit (6692cb3) &rarr;</a>
</nav>

---

## Metadata

| Attribute | Value |
| :--- | :--- |
| **Commit Index** | `#22` |
| **Short Hash** | `ce7f236` |
| **Full Hash** | `ce7f236d81bdc5d1f43ebcd989611d2cd9d7da9f` |
| **Author** | vijaykumarbk &lt;vijaykumarb@boston-technology.com&gt; |
| **Date** | 2026-09-30 13:42:30 +0530 |
| **Files Affected** | **396** |
| **Lines Added** | **+23949** |
| **Lines Deleted** | **-734** |

## Change Breakdown

- **Added files**: 368
- **Modified files**: 28
- **Deleted files**: 0

## Changed Files List

| Status | File Path | Lines (+/-) |
| :--- | :--- | :--- |
| 🟡 Modified | [.agents/plugins/hook-auto-docs/.state/.stop-hook.lock](../../../.agents/plugins/hook-auto-docs/.state/.stop-hook.lock) | +1 / -1 |
| 🟡 Modified | [.agents/plugins/hook-auto-docs/.state/project2-structure-state.json](../../../.agents/plugins/hook-auto-docs/.state/project2-structure-state.json) | +428 / -1 |
| 🟢 Added | [.doc-agent/pending-commit.flag](../../../.doc-agent/pending-commit.flag) | +1 / -0 |
| 🟡 Modified | [.planning/ROADMAP.md](../../../.planning/ROADMAP.md) | +7 / -0 |
| 🟡 Modified | [.planning/STATE.md](../../../.planning/STATE.md) | +7 / -3 |
| 🟢 Added | [.planning/phases/5.1-CONTEXT.md](../../../.planning/phases/5.1-CONTEXT.md) | +79 / -0 |
| 🟢 Added | [.planning/phases/5.1-PLAN.md](../../../.planning/phases/5.1-PLAN.md) | +151 / -0 |
| 🟢 Added | [.planning/phases/5.2-CONTEXT.md](../../../.planning/phases/5.2-CONTEXT.md) | +63 / -0 |
| 🟢 Added | [.planning/phases/5.2-PLAN.md](../../../.planning/phases/5.2-PLAN.md) | +191 / -0 |
| 🟢 Added | [.planning/phases/5.3-CONTEXT.md](../../../.planning/phases/5.3-CONTEXT.md) | +70 / -0 |
| 🟢 Added | [.planning/phases/5.3-PLAN.md](../../../.planning/phases/5.3-PLAN.md) | +105 / -0 |
| 🟢 Added | [.planning/phases/5.4-CONTEXT.md](../../../.planning/phases/5.4-CONTEXT.md) | +58 / -0 |
| 🟢 Added | [.planning/phases/5.4-PLAN.md](../../../.planning/phases/5.4-PLAN.md) | +121 / -0 |
| 🟢 Added | [.planning/phases/5.5-CONTEXT.md](../../../.planning/phases/5.5-CONTEXT.md) | +54 / -0 |
| 🟢 Added | [.planning/phases/5.5-PLAN.md](../../../.planning/phases/5.5-PLAN.md) | +124 / -0 |
| 🟢 Added | [Task Description and Checklist.md](../../../Task Description and Checklist.md) | +840 / -0 |
| 🟢 Added | [data/ground_truth/Policy_Ground_Truth.xlsx](../../../data/ground_truth/Policy_Ground_Truth.xlsx) | - |
| 🟢 Added | [data/results/PA_Test_Results.xlsx](../../../data/results/PA_Test_Results.xlsx) | - |
| 🟢 Added | [data/results/metrics_summary.json](../../../data/results/metrics_summary.json) | +19 / -0 |
| 🟢 Added | [data/synthetic_cases/Synthetic_Test_Cases.xlsx](../../../data/synthetic_cases/Synthetic_Test_Cases.xlsx) | - |
| 🟢 Added | [data/synthetic_cases/cases/SYN-001.json](../../../data/synthetic_cases/cases/SYN-001.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-002.json](../../../data/synthetic_cases/cases/SYN-002.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-003.json](../../../data/synthetic_cases/cases/SYN-003.json) | +90 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-004.json](../../../data/synthetic_cases/cases/SYN-004.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-005.json](../../../data/synthetic_cases/cases/SYN-005.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-006.json](../../../data/synthetic_cases/cases/SYN-006.json) | +86 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-007.json](../../../data/synthetic_cases/cases/SYN-007.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-008.json](../../../data/synthetic_cases/cases/SYN-008.json) | +86 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-009.json](../../../data/synthetic_cases/cases/SYN-009.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-010.json](../../../data/synthetic_cases/cases/SYN-010.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-011.json](../../../data/synthetic_cases/cases/SYN-011.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-012.json](../../../data/synthetic_cases/cases/SYN-012.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-013.json](../../../data/synthetic_cases/cases/SYN-013.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-014.json](../../../data/synthetic_cases/cases/SYN-014.json) | +86 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-015.json](../../../data/synthetic_cases/cases/SYN-015.json) | +91 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-016.json](../../../data/synthetic_cases/cases/SYN-016.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-017.json](../../../data/synthetic_cases/cases/SYN-017.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-018.json](../../../data/synthetic_cases/cases/SYN-018.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-019.json](../../../data/synthetic_cases/cases/SYN-019.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-020.json](../../../data/synthetic_cases/cases/SYN-020.json) | +91 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-021.json](../../../data/synthetic_cases/cases/SYN-021.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-022.json](../../../data/synthetic_cases/cases/SYN-022.json) | +86 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-023.json](../../../data/synthetic_cases/cases/SYN-023.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-024.json](../../../data/synthetic_cases/cases/SYN-024.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-025.json](../../../data/synthetic_cases/cases/SYN-025.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-026.json](../../../data/synthetic_cases/cases/SYN-026.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-027.json](../../../data/synthetic_cases/cases/SYN-027.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-028.json](../../../data/synthetic_cases/cases/SYN-028.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-029.json](../../../data/synthetic_cases/cases/SYN-029.json) | +86 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-030.json](../../../data/synthetic_cases/cases/SYN-030.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-031.json](../../../data/synthetic_cases/cases/SYN-031.json) | +91 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-032.json](../../../data/synthetic_cases/cases/SYN-032.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-033.json](../../../data/synthetic_cases/cases/SYN-033.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-034.json](../../../data/synthetic_cases/cases/SYN-034.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-035.json](../../../data/synthetic_cases/cases/SYN-035.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-036.json](../../../data/synthetic_cases/cases/SYN-036.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-037.json](../../../data/synthetic_cases/cases/SYN-037.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-038.json](../../../data/synthetic_cases/cases/SYN-038.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-039.json](../../../data/synthetic_cases/cases/SYN-039.json) | +91 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-040.json](../../../data/synthetic_cases/cases/SYN-040.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-041.json](../../../data/synthetic_cases/cases/SYN-041.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-042.json](../../../data/synthetic_cases/cases/SYN-042.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-043.json](../../../data/synthetic_cases/cases/SYN-043.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-044.json](../../../data/synthetic_cases/cases/SYN-044.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-045.json](../../../data/synthetic_cases/cases/SYN-045.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-046.json](../../../data/synthetic_cases/cases/SYN-046.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-047.json](../../../data/synthetic_cases/cases/SYN-047.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-048.json](../../../data/synthetic_cases/cases/SYN-048.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-049.json](../../../data/synthetic_cases/cases/SYN-049.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/cases/SYN-050.json](../../../data/synthetic_cases/cases/SYN-050.json) | +99 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-001/lab_report.txt](../../../data/synthetic_cases/documents/SYN-001/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-001/mri_report.txt](../../../data/synthetic_cases/documents/SYN-001/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-001/physician_note.txt](../../../data/synthetic_cases/documents/SYN-001/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-001/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-001/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-001/xray_report.txt](../../../data/synthetic_cases/documents/SYN-001/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-002/lab_report.txt](../../../data/synthetic_cases/documents/SYN-002/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-002/mri_report.txt](../../../data/synthetic_cases/documents/SYN-002/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-002/physician_note.txt](../../../data/synthetic_cases/documents/SYN-002/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-002/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-002/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-002/xray_report.txt](../../../data/synthetic_cases/documents/SYN-002/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-003/mri_report.txt](../../../data/synthetic_cases/documents/SYN-003/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-003/physician_note.txt](../../../data/synthetic_cases/documents/SYN-003/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-003/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-003/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-003/xray_report.txt](../../../data/synthetic_cases/documents/SYN-003/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-004/lab_report.txt](../../../data/synthetic_cases/documents/SYN-004/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-004/mri_report.txt](../../../data/synthetic_cases/documents/SYN-004/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-004/physician_note.txt](../../../data/synthetic_cases/documents/SYN-004/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-004/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-004/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-004/xray_report.txt](../../../data/synthetic_cases/documents/SYN-004/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-005/lab_report.txt](../../../data/synthetic_cases/documents/SYN-005/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-005/mri_report.txt](../../../data/synthetic_cases/documents/SYN-005/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-005/physician_note.txt](../../../data/synthetic_cases/documents/SYN-005/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-005/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-005/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-005/xray_report.txt](../../../data/synthetic_cases/documents/SYN-005/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-006/lab_report.txt](../../../data/synthetic_cases/documents/SYN-006/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-006/mri_report.txt](../../../data/synthetic_cases/documents/SYN-006/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-006/physician_note.txt](../../../data/synthetic_cases/documents/SYN-006/physician_note.txt) | +37 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-006/xray_report.txt](../../../data/synthetic_cases/documents/SYN-006/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-007/lab_report.txt](../../../data/synthetic_cases/documents/SYN-007/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-007/mri_report.txt](../../../data/synthetic_cases/documents/SYN-007/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-007/physician_note.txt](../../../data/synthetic_cases/documents/SYN-007/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-007/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-007/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-007/xray_report.txt](../../../data/synthetic_cases/documents/SYN-007/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-008/lab_report.txt](../../../data/synthetic_cases/documents/SYN-008/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-008/mri_report.txt](../../../data/synthetic_cases/documents/SYN-008/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-008/physician_note.txt](../../../data/synthetic_cases/documents/SYN-008/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-008/xray_report.txt](../../../data/synthetic_cases/documents/SYN-008/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-009/lab_report.txt](../../../data/synthetic_cases/documents/SYN-009/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-009/mri_report.txt](../../../data/synthetic_cases/documents/SYN-009/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-009/physician_note.txt](../../../data/synthetic_cases/documents/SYN-009/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-009/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-009/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-009/xray_report.txt](../../../data/synthetic_cases/documents/SYN-009/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-010/lab_report.txt](../../../data/synthetic_cases/documents/SYN-010/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-010/mri_report.txt](../../../data/synthetic_cases/documents/SYN-010/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-010/physician_note.txt](../../../data/synthetic_cases/documents/SYN-010/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-010/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-010/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-010/xray_report.txt](../../../data/synthetic_cases/documents/SYN-010/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-011/lab_report.txt](../../../data/synthetic_cases/documents/SYN-011/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-011/mri_report.txt](../../../data/synthetic_cases/documents/SYN-011/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-011/physician_note.txt](../../../data/synthetic_cases/documents/SYN-011/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-011/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-011/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-011/xray_report.txt](../../../data/synthetic_cases/documents/SYN-011/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-012/lab_report.txt](../../../data/synthetic_cases/documents/SYN-012/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-012/mri_report.txt](../../../data/synthetic_cases/documents/SYN-012/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-012/physician_note.txt](../../../data/synthetic_cases/documents/SYN-012/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-012/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-012/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-012/xray_report.txt](../../../data/synthetic_cases/documents/SYN-012/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-013/lab_report.txt](../../../data/synthetic_cases/documents/SYN-013/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-013/mri_report.txt](../../../data/synthetic_cases/documents/SYN-013/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-013/physician_note.txt](../../../data/synthetic_cases/documents/SYN-013/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-013/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-013/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-013/xray_report.txt](../../../data/synthetic_cases/documents/SYN-013/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-014/lab_report.txt](../../../data/synthetic_cases/documents/SYN-014/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-014/mri_report.txt](../../../data/synthetic_cases/documents/SYN-014/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-014/physician_note.txt](../../../data/synthetic_cases/documents/SYN-014/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-014/xray_report.txt](../../../data/synthetic_cases/documents/SYN-014/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-015/lab_report.txt](../../../data/synthetic_cases/documents/SYN-015/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-015/mri_report.txt](../../../data/synthetic_cases/documents/SYN-015/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-015/physician_note.txt](../../../data/synthetic_cases/documents/SYN-015/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-015/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-015/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-016/lab_report.txt](../../../data/synthetic_cases/documents/SYN-016/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-016/mri_report.txt](../../../data/synthetic_cases/documents/SYN-016/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-016/physician_note.txt](../../../data/synthetic_cases/documents/SYN-016/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-016/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-016/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-016/xray_report.txt](../../../data/synthetic_cases/documents/SYN-016/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-017/lab_report.txt](../../../data/synthetic_cases/documents/SYN-017/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-017/mri_report.txt](../../../data/synthetic_cases/documents/SYN-017/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-017/physician_note.txt](../../../data/synthetic_cases/documents/SYN-017/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-017/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-017/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-017/xray_report.txt](../../../data/synthetic_cases/documents/SYN-017/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-018/lab_report.txt](../../../data/synthetic_cases/documents/SYN-018/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-018/mri_report.txt](../../../data/synthetic_cases/documents/SYN-018/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-018/physician_note.txt](../../../data/synthetic_cases/documents/SYN-018/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-018/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-018/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-018/xray_report.txt](../../../data/synthetic_cases/documents/SYN-018/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-019/lab_report.txt](../../../data/synthetic_cases/documents/SYN-019/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-019/mri_report.txt](../../../data/synthetic_cases/documents/SYN-019/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-019/physician_note.txt](../../../data/synthetic_cases/documents/SYN-019/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-019/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-019/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-019/xray_report.txt](../../../data/synthetic_cases/documents/SYN-019/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-020/lab_report.txt](../../../data/synthetic_cases/documents/SYN-020/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-020/physician_note.txt](../../../data/synthetic_cases/documents/SYN-020/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-020/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-020/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-020/xray_report.txt](../../../data/synthetic_cases/documents/SYN-020/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-021/lab_report.txt](../../../data/synthetic_cases/documents/SYN-021/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-021/mri_report.txt](../../../data/synthetic_cases/documents/SYN-021/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-021/physician_note.txt](../../../data/synthetic_cases/documents/SYN-021/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-021/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-021/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-021/xray_report.txt](../../../data/synthetic_cases/documents/SYN-021/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-022/lab_report.txt](../../../data/synthetic_cases/documents/SYN-022/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-022/mri_report.txt](../../../data/synthetic_cases/documents/SYN-022/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-022/physician_note.txt](../../../data/synthetic_cases/documents/SYN-022/physician_note.txt) | +37 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-022/xray_report.txt](../../../data/synthetic_cases/documents/SYN-022/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-023/lab_report.txt](../../../data/synthetic_cases/documents/SYN-023/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-023/mri_report.txt](../../../data/synthetic_cases/documents/SYN-023/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-023/physician_note.txt](../../../data/synthetic_cases/documents/SYN-023/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-023/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-023/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-023/xray_report.txt](../../../data/synthetic_cases/documents/SYN-023/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-024/lab_report.txt](../../../data/synthetic_cases/documents/SYN-024/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-024/mri_report.txt](../../../data/synthetic_cases/documents/SYN-024/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-024/physician_note.txt](../../../data/synthetic_cases/documents/SYN-024/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-024/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-024/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-024/xray_report.txt](../../../data/synthetic_cases/documents/SYN-024/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-025/lab_report.txt](../../../data/synthetic_cases/documents/SYN-025/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-025/mri_report.txt](../../../data/synthetic_cases/documents/SYN-025/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-025/physician_note.txt](../../../data/synthetic_cases/documents/SYN-025/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-025/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-025/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-025/xray_report.txt](../../../data/synthetic_cases/documents/SYN-025/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-026/lab_report.txt](../../../data/synthetic_cases/documents/SYN-026/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-026/mri_report.txt](../../../data/synthetic_cases/documents/SYN-026/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-026/physician_note.txt](../../../data/synthetic_cases/documents/SYN-026/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-026/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-026/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-026/xray_report.txt](../../../data/synthetic_cases/documents/SYN-026/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-027/lab_report.txt](../../../data/synthetic_cases/documents/SYN-027/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-027/mri_report.txt](../../../data/synthetic_cases/documents/SYN-027/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-027/physician_note.txt](../../../data/synthetic_cases/documents/SYN-027/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-027/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-027/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-027/xray_report.txt](../../../data/synthetic_cases/documents/SYN-027/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-028/lab_report.txt](../../../data/synthetic_cases/documents/SYN-028/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-028/mri_report.txt](../../../data/synthetic_cases/documents/SYN-028/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-028/physician_note.txt](../../../data/synthetic_cases/documents/SYN-028/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-028/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-028/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-028/xray_report.txt](../../../data/synthetic_cases/documents/SYN-028/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-029/lab_report.txt](../../../data/synthetic_cases/documents/SYN-029/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-029/mri_report.txt](../../../data/synthetic_cases/documents/SYN-029/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-029/physician_note.txt](../../../data/synthetic_cases/documents/SYN-029/physician_note.txt) | +37 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-029/xray_report.txt](../../../data/synthetic_cases/documents/SYN-029/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-030/lab_report.txt](../../../data/synthetic_cases/documents/SYN-030/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-030/mri_report.txt](../../../data/synthetic_cases/documents/SYN-030/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-030/physician_note.txt](../../../data/synthetic_cases/documents/SYN-030/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-030/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-030/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-030/xray_report.txt](../../../data/synthetic_cases/documents/SYN-030/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-031/lab_report.txt](../../../data/synthetic_cases/documents/SYN-031/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-031/physician_note.txt](../../../data/synthetic_cases/documents/SYN-031/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-031/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-031/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-031/xray_report.txt](../../../data/synthetic_cases/documents/SYN-031/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-032/lab_report.txt](../../../data/synthetic_cases/documents/SYN-032/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-032/mri_report.txt](../../../data/synthetic_cases/documents/SYN-032/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-032/physician_note.txt](../../../data/synthetic_cases/documents/SYN-032/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-032/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-032/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-032/xray_report.txt](../../../data/synthetic_cases/documents/SYN-032/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-033/lab_report.txt](../../../data/synthetic_cases/documents/SYN-033/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-033/mri_report.txt](../../../data/synthetic_cases/documents/SYN-033/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-033/physician_note.txt](../../../data/synthetic_cases/documents/SYN-033/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-033/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-033/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-033/xray_report.txt](../../../data/synthetic_cases/documents/SYN-033/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-034/lab_report.txt](../../../data/synthetic_cases/documents/SYN-034/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-034/mri_report.txt](../../../data/synthetic_cases/documents/SYN-034/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-034/physician_note.txt](../../../data/synthetic_cases/documents/SYN-034/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-034/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-034/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-034/xray_report.txt](../../../data/synthetic_cases/documents/SYN-034/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-035/lab_report.txt](../../../data/synthetic_cases/documents/SYN-035/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-035/mri_report.txt](../../../data/synthetic_cases/documents/SYN-035/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-035/physician_note.txt](../../../data/synthetic_cases/documents/SYN-035/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-035/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-035/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-035/xray_report.txt](../../../data/synthetic_cases/documents/SYN-035/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-036/lab_report.txt](../../../data/synthetic_cases/documents/SYN-036/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-036/mri_report.txt](../../../data/synthetic_cases/documents/SYN-036/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-036/physician_note.txt](../../../data/synthetic_cases/documents/SYN-036/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-036/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-036/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-036/xray_report.txt](../../../data/synthetic_cases/documents/SYN-036/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-037/lab_report.txt](../../../data/synthetic_cases/documents/SYN-037/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-037/mri_report.txt](../../../data/synthetic_cases/documents/SYN-037/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-037/physician_note.txt](../../../data/synthetic_cases/documents/SYN-037/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-037/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-037/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-037/xray_report.txt](../../../data/synthetic_cases/documents/SYN-037/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-038/lab_report.txt](../../../data/synthetic_cases/documents/SYN-038/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-038/mri_report.txt](../../../data/synthetic_cases/documents/SYN-038/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-038/physician_note.txt](../../../data/synthetic_cases/documents/SYN-038/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-038/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-038/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-038/xray_report.txt](../../../data/synthetic_cases/documents/SYN-038/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-039/lab_report.txt](../../../data/synthetic_cases/documents/SYN-039/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-039/mri_report.txt](../../../data/synthetic_cases/documents/SYN-039/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-039/physician_note.txt](../../../data/synthetic_cases/documents/SYN-039/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-039/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-039/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-040/lab_report.txt](../../../data/synthetic_cases/documents/SYN-040/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-040/mri_report.txt](../../../data/synthetic_cases/documents/SYN-040/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-040/physician_note.txt](../../../data/synthetic_cases/documents/SYN-040/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-040/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-040/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-040/xray_report.txt](../../../data/synthetic_cases/documents/SYN-040/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-041/lab_report.txt](../../../data/synthetic_cases/documents/SYN-041/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-041/mri_report.txt](../../../data/synthetic_cases/documents/SYN-041/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-041/physician_note.txt](../../../data/synthetic_cases/documents/SYN-041/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-041/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-041/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-041/xray_report.txt](../../../data/synthetic_cases/documents/SYN-041/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-042/lab_report.txt](../../../data/synthetic_cases/documents/SYN-042/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-042/mri_report.txt](../../../data/synthetic_cases/documents/SYN-042/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-042/physician_note.txt](../../../data/synthetic_cases/documents/SYN-042/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-042/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-042/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-042/xray_report.txt](../../../data/synthetic_cases/documents/SYN-042/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-043/lab_report.txt](../../../data/synthetic_cases/documents/SYN-043/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-043/mri_report.txt](../../../data/synthetic_cases/documents/SYN-043/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-043/physician_note.txt](../../../data/synthetic_cases/documents/SYN-043/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-043/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-043/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-043/xray_report.txt](../../../data/synthetic_cases/documents/SYN-043/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-044/lab_report.txt](../../../data/synthetic_cases/documents/SYN-044/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-044/mri_report.txt](../../../data/synthetic_cases/documents/SYN-044/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-044/physician_note.txt](../../../data/synthetic_cases/documents/SYN-044/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-044/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-044/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-044/xray_report.txt](../../../data/synthetic_cases/documents/SYN-044/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-045/lab_report.txt](../../../data/synthetic_cases/documents/SYN-045/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-045/mri_report.txt](../../../data/synthetic_cases/documents/SYN-045/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-045/physician_note.txt](../../../data/synthetic_cases/documents/SYN-045/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-045/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-045/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-045/xray_report.txt](../../../data/synthetic_cases/documents/SYN-045/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-046/lab_report.txt](../../../data/synthetic_cases/documents/SYN-046/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-046/mri_report.txt](../../../data/synthetic_cases/documents/SYN-046/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-046/physician_note.txt](../../../data/synthetic_cases/documents/SYN-046/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-046/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-046/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-046/xray_report.txt](../../../data/synthetic_cases/documents/SYN-046/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-047/lab_report.txt](../../../data/synthetic_cases/documents/SYN-047/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-047/mri_report.txt](../../../data/synthetic_cases/documents/SYN-047/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-047/physician_note.txt](../../../data/synthetic_cases/documents/SYN-047/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-047/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-047/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-047/xray_report.txt](../../../data/synthetic_cases/documents/SYN-047/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-048/lab_report.txt](../../../data/synthetic_cases/documents/SYN-048/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-048/mri_report.txt](../../../data/synthetic_cases/documents/SYN-048/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-048/physician_note.txt](../../../data/synthetic_cases/documents/SYN-048/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-048/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-048/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-048/xray_report.txt](../../../data/synthetic_cases/documents/SYN-048/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-049/lab_report.txt](../../../data/synthetic_cases/documents/SYN-049/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-049/mri_report.txt](../../../data/synthetic_cases/documents/SYN-049/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-049/physician_note.txt](../../../data/synthetic_cases/documents/SYN-049/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-049/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-049/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-049/xray_report.txt](../../../data/synthetic_cases/documents/SYN-049/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-050/lab_report.txt](../../../data/synthetic_cases/documents/SYN-050/lab_report.txt) | +14 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-050/mri_report.txt](../../../data/synthetic_cases/documents/SYN-050/mri_report.txt) | +20 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-050/physician_note.txt](../../../data/synthetic_cases/documents/SYN-050/physician_note.txt) | +35 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-050/pt_notes.txt](../../../data/synthetic_cases/documents/SYN-050/pt_notes.txt) | +15 / -0 |
| 🟢 Added | [data/synthetic_cases/documents/SYN-050/xray_report.txt](../../../data/synthetic_cases/documents/SYN-050/xray_report.txt) | +12 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-001.json](../../../data/test_runs/latest/cases/SYN-001.json) | +73 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-002.json](../../../data/test_runs/latest/cases/SYN-002.json) | +72 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-003.json](../../../data/test_runs/latest/cases/SYN-003.json) | +98 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-004.json](../../../data/test_runs/latest/cases/SYN-004.json) | +46 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-005.json](../../../data/test_runs/latest/cases/SYN-005.json) | +56 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-006.json](../../../data/test_runs/latest/cases/SYN-006.json) | +237 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-007.json](../../../data/test_runs/latest/cases/SYN-007.json) | +56 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-008.json](../../../data/test_runs/latest/cases/SYN-008.json) | +49 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-009.json](../../../data/test_runs/latest/cases/SYN-009.json) | +73 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-010.json](../../../data/test_runs/latest/cases/SYN-010.json) | +66 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-011.json](../../../data/test_runs/latest/cases/SYN-011.json) | +84 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-012.json](../../../data/test_runs/latest/cases/SYN-012.json) | +84 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-013.json](../../../data/test_runs/latest/cases/SYN-013.json) | +73 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-014.json](../../../data/test_runs/latest/cases/SYN-014.json) | +70 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-015.json](../../../data/test_runs/latest/cases/SYN-015.json) | +237 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-016.json](../../../data/test_runs/latest/cases/SYN-016.json) | +66 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-017.json](../../../data/test_runs/latest/cases/SYN-017.json) | +73 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-018.json](../../../data/test_runs/latest/cases/SYN-018.json) | +72 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-019.json](../../../data/test_runs/latest/cases/SYN-019.json) | +70 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-020.json](../../../data/test_runs/latest/cases/SYN-020.json) | +66 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-021.json](../../../data/test_runs/latest/cases/SYN-021.json) | +73 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-022.json](../../../data/test_runs/latest/cases/SYN-022.json) | +86 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-023.json](../../../data/test_runs/latest/cases/SYN-023.json) | +86 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-024.json](../../../data/test_runs/latest/cases/SYN-024.json) | +56 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-025.json](../../../data/test_runs/latest/cases/SYN-025.json) | +59 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-026.json](../../../data/test_runs/latest/cases/SYN-026.json) | +73 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-027.json](../../../data/test_runs/latest/cases/SYN-027.json) | +42 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-028.json](../../../data/test_runs/latest/cases/SYN-028.json) | +35 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-029.json](../../../data/test_runs/latest/cases/SYN-029.json) | +37 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-030.json](../../../data/test_runs/latest/cases/SYN-030.json) | +63 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-031.json](../../../data/test_runs/latest/cases/SYN-031.json) | +42 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-032.json](../../../data/test_runs/latest/cases/SYN-032.json) | +38 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-033.json](../../../data/test_runs/latest/cases/SYN-033.json) | +35 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-034.json](../../../data/test_runs/latest/cases/SYN-034.json) | +38 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-035.json](../../../data/test_runs/latest/cases/SYN-035.json) | +63 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-036.json](../../../data/test_runs/latest/cases/SYN-036.json) | +63 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-037.json](../../../data/test_runs/latest/cases/SYN-037.json) | +84 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-038.json](../../../data/test_runs/latest/cases/SYN-038.json) | +38 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-039.json](../../../data/test_runs/latest/cases/SYN-039.json) | +244 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-040.json](../../../data/test_runs/latest/cases/SYN-040.json) | +35 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-041.json](../../../data/test_runs/latest/cases/SYN-041.json) | +35 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-042.json](../../../data/test_runs/latest/cases/SYN-042.json) | +38 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-043.json](../../../data/test_runs/latest/cases/SYN-043.json) | +32 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-044.json](../../../data/test_runs/latest/cases/SYN-044.json) | +53 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-045.json](../../../data/test_runs/latest/cases/SYN-045.json) | +38 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-046.json](../../../data/test_runs/latest/cases/SYN-046.json) | +39 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-047.json](../../../data/test_runs/latest/cases/SYN-047.json) | +100 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-048.json](../../../data/test_runs/latest/cases/SYN-048.json) | +53 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-049.json](../../../data/test_runs/latest/cases/SYN-049.json) | +39 / -0 |
| 🟢 Added | [data/test_runs/latest/cases/SYN-050.json](../../../data/test_runs/latest/cases/SYN-050.json) | +39 / -0 |
| 🟢 Added | [data/test_runs/latest/system_run_results.json](../../../data/test_runs/latest/system_run_results.json) | +3479 / -0 |
| 🟡 Modified | [documentation/GIT_HISTORY.md](../../../documentation/GIT_HISTORY.md) | +91 / -6 |
| 🟡 Modified | [documentation/PROJECT_STRUCTURE.md](../../../documentation/PROJECT_STRUCTURE.md) | +568 / -141 |
| 🟡 Modified | [documentation/commits/01_5d00445_copy-project/README.md](../../../documentation/commits/01_5d00445_copy-project/README.md) | +14 / -31 |
| 🟡 Modified | [documentation/commits/02_a7b0a69_2nd/README.md](../../../documentation/commits/02_a7b0a69_2nd/README.md) | +16 / -26 |
| 🟡 Modified | [documentation/commits/03_9c6bc65_working/README.md](../../../documentation/commits/03_9c6bc65_working/README.md) | +16 / -27 |
| 🟡 Modified | [documentation/commits/04_0c3d41e_removed-unnecessary-files/README.md](../../../documentation/commits/04_0c3d41e_removed-unnecessary-files/README.md) | +16 / -27 |
| 🟡 Modified | [documentation/commits/05_5bf450b_idk/README.md](../../../documentation/commits/05_5bf450b_idk/README.md) | +16 / -26 |
| 🟡 Modified | [documentation/commits/06_c963ca5_execution-steps/README.md](../../../documentation/commits/06_c963ca5_execution-steps/README.md) | +16 / -25 |
| 🟡 Modified | [documentation/commits/07_00b1acc_lumbar-done/README.md](../../../documentation/commits/07_00b1acc_lumbar-done/README.md) | +16 / -33 |
| 🟡 Modified | [documentation/commits/08_1079351_lab-management-pdf/README.md](../../../documentation/commits/08_1079351_lab-management-pdf/README.md) | +16 / -25 |
| 🟡 Modified | [documentation/commits/09_214a6d4_no-change/README.md](../../../documentation/commits/09_214a6d4_no-change/README.md) | +16 / -26 |
| 🟡 Modified | [documentation/commits/10_ddb23b3_noocr/README.md](../../../documentation/commits/10_ddb23b3_noocr/README.md) | +16 / -27 |
| 🟡 Modified | [documentation/commits/11_de2c621_fallback-version/README.md](../../../documentation/commits/11_de2c621_fallback-version/README.md) | +16 / -26 |
| 🟡 Modified | [documentation/commits/12_c13c799_after-falbback-execution-for-lab/README.md](../../../documentation/commits/12_c13c799_after-falbback-execution-for-lab/README.md) | +16 / -32 |
| 🟡 Modified | [documentation/commits/13_eb6d9dc_fallback-commit/README.md](../../../documentation/commits/13_eb6d9dc_fallback-commit/README.md) | +16 / -32 |
| 🟡 Modified | [documentation/commits/14_06638e4_5-00-ending-commit/README.md](../../../documentation/commits/14_06638e4_5-00-ending-commit/README.md) | +16 / -31 |
| 🟡 Modified | [documentation/commits/15_df5ef5f_same-day-last/README.md](../../../documentation/commits/15_df5ef5f_same-day-last/README.md) | +16 / -25 |
| 🟡 Modified | [documentation/commits/16_5b3c2e0_22sept/README.md](../../../documentation/commits/16_5b3c2e0_22sept/README.md) | +16 / -26 |
| 🟡 Modified | [documentation/commits/17_ae27c3d_sept22/README.md](../../../documentation/commits/17_ae27c3d_sept22/README.md) | +16 / -25 |
| 🟡 Modified | [documentation/commits/18_97b0ac3_radiation-also-done/README.md](../../../documentation/commits/18_97b0ac3_radiation-also-done/README.md) | +16 / -32 |
| 🟡 Modified | [documentation/commits/19_ccb759a_graphified/README.md](../../../documentation/commits/19_ccb759a_graphified/README.md) | +16 / -25 |
| 🟡 Modified | [documentation/commits/20_882a68c_before-fixes-everything-is-working/README.md](../../../documentation/commits/20_882a68c_before-fixes-everything-is-working/README.md) | +16 / -25 |
| 🟢 Added | [documentation/commits/21_0dc6a0a_documentation-part-is-done-and-the-query-adja/README.md](../../../documentation/commits/21_0dc6a0a_documentation-part-is-done-and-the-query-adja/README.md) | +103 / -0 |
| 🟡 Modified | [documentation/commits/README.md](../../../documentation/commits/README.md) | +31 / -27 |
| 🟡 Modified | [retrieval-hierarchical.py](../../../retrieval-hierarchical.py) | +14 / -3 |
| 🟢 Added | [scripts/case_matrix.py](../../../scripts/case_matrix.py) | +1060 / -0 |
| 🟢 Added | [scripts/compare_test_results.py](../../../scripts/compare_test_results.py) | +514 / -0 |
| 🟢 Added | [scripts/generate_ground_truth.py](../../../scripts/generate_ground_truth.py) | +826 / -0 |
| 🟢 Added | [scripts/generate_synthetic_cases.py](../../../scripts/generate_synthetic_cases.py) | +547 / -0 |
| 🟢 Added | [scripts/patient_schema.py](../../../scripts/patient_schema.py) | +127 / -0 |
| 🟢 Added | [scripts/run_pa_test_harness.py](../../../scripts/run_pa_test_harness.py) | +268 / -0 |
| 🟢 Added | [scripts/verify_ground_truth.py](../../../scripts/verify_ground_truth.py) | +173 / -0 |
| 🟢 Added | [scripts/verify_results_workbook.py](../../../scripts/verify_results_workbook.py) | +145 / -0 |
| 🟢 Added | [scripts/verify_synthetic_cases.py](../../../scripts/verify_synthetic_cases.py) | +257 / -0 |
| 🟢 Added | [scripts/verify_test_run.py](../../../scripts/verify_test_run.py) | +135 / -0 |

---

<nav>
  <a href="../21_0dc6a0a_documentation-part-is-done-and-the-query-adja/README.md">&larr; Previous Commit (0dc6a0a)</a> | 
  <a href="../README.md">All Commits Index</a>
 | <a href="../23_6692cb3_frontend-connected/README.md">Next Commit (6692cb3) &rarr;</a>
</nav>
