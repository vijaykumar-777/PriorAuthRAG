import React, { useState } from 'react';
import { ToastMessage } from '../types.ts';

interface ActiveAuthorizationsViewProps {
  onShowToast: (msg: string, icon?: string) => void;
  onNavigateToToc?: () => void;
}

export const ActiveAuthorizationsView: React.FC<ActiveAuthorizationsViewProps> = ({
  onShowToast,
  onNavigateToToc,
}) => {
  const [queryText, setQueryText] = useState('CPT 22551 ACDF criteria for adjacent segment disease');
  const [isRunning, setIsRunning] = useState(false);
  const [simStatus, setSimStatus] = useState<'REQUIRED' | 'ROUTINE' | 'EXCLUSIONS'>('REQUIRED');
  const [activeTab, setActiveTab] = useState<'indications' | 'contra' | 'chart'>('indications');
  const [isJsonDrawerOpen, setIsJsonDrawerOpen] = useState(false);

  // Checkboxes for Category 1 (Radiculopathy - 5 items)
  const [cat1Checks, setCat1Checks] = useState<boolean[]>([true, true, false, false, false]);
  // Checkboxes for Category 2 (Myelopathy - 3 items)
  const [cat2Checks, setCat2Checks] = useState<boolean[]>([false, false, false]);
  // Checkboxes for Chart Verification (3 items)
  const [docChecks, setDocChecks] = useState<boolean[]>([true, false, false]);

  const cat1Count = cat1Checks.filter(Boolean).length;
  const cat2Count = cat2Checks.filter(Boolean).length;
  const isApproved = cat1Count === 5 || cat2Count >= 2;

  const [liveData, setLiveData] = useState<any>(null);
  const [liveMetadata, setLiveMetadata] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [stageTimings, setStageTimings] = useState({ s1: 0.04, s2: 1.10, s3: 0.40, s4: 1.20 });
  const [dynamicChecks, setDynamicChecks] = useState<{ [key: string]: boolean }>({});

  const handleRunEval = async (mode: 'REQUIRED' | 'ROUTINE' | 'EXCLUSIONS' = 'REQUIRED', customText?: string) => {
    const q = (customText !== undefined ? customText : queryText).trim();
    if (!q) {
      onShowToast('Please enter a clinical query or CPT code.', 'warning');
      return;
    }

    setIsRunning(true);
    setActiveStage(1);
    const t0 = Date.now();

    const t1 = setTimeout(() => setActiveStage(2), 600);
    const t2 = setTimeout(() => setActiveStage(3), 2000);
    const t3 = setTimeout(() => setActiveStage(4), 3500);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();
      const resultData = json.data;
      const totalSec = json.elapsed_seconds || Math.round((Date.now() - t0) / 100) / 10;

      setLiveData(resultData);
      setLiveMetadata(json.metadata || { elapsed_seconds: totalSec, engine: 'groq:qwen/qwen3.8-27b' });
      setStageTimings({
        s1: 0.04,
        s2: Math.max(0.5, Math.round(totalSec * 0.25 * 10) / 10),
        s3: Math.max(0.3, Math.round(totalSec * 0.15 * 10) / 10),
        s4: Math.max(1.0, Math.round(totalSec * 0.60 * 10) / 10),
      });

      // Update determination status
      const paRaw = String(resultData['Prior auth required'] || '').trim().toLowerCase();
      if (paRaw.includes('yes')) {
        setSimStatus('REQUIRED');
        onShowToast(`Prior Authorization Required • ${resultData['Policy Name'] || 'Policy Match'}`);
      } else if (paRaw.includes('no')) {
        setSimStatus('ROUTINE');
        onShowToast('Routine procedure recognized: Prior authorization NOT required.');
      } else {
        setSimStatus('EXCLUSIONS');
        onShowToast(`Status: ${resultData['Prior auth required'] || 'Review Required'}`, 'warning');
      }
    } catch (err) {
      console.warn('Live API request failed, falling back to simulated engine:', err);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setSimStatus(mode);
      if (mode === 'ROUTINE') {
        onShowToast('Routine procedure recognized: Prior authorization bypassed.');
      } else if (mode === 'EXCLUSIONS') {
        onShowToast('Absolute exclusions detected! Check Non-Indications tab.', 'warning');
      } else {
        onShowToast('Simulated evaluation: Prior Authorization Required.');
      }
    } finally {
      setIsRunning(false);
      setActiveStage(0);
    }
  };

  const toggleDynamicCheck = (key: string) => {
    setDynamicChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectPreset = (query: string, mode: 'REQUIRED' | 'ROUTINE' | 'EXCLUSIONS') => {
    setQueryText(query);
    handleRunEval(mode, query);
  };

  const toggleCat1 = (index: number) => {
    const updated = [...cat1Checks];
    updated[index] = !updated[index];
    setCat1Checks(updated);
  };

  const toggleCat2 = (index: number) => {
    const updated = [...cat2Checks];
    updated[index] = !updated[index];
    setCat2Checks(updated);
  };

  const toggleDoc = (index: number) => {
    const updated = [...docChecks];
    updated[index] = !updated[index];
    setDocChecks(updated);
  };

  const handleToggleAllDocs = () => {
    const allChecked = docChecks.every(Boolean);
    setDocChecks(docChecks.map(() => !allChecked));
    onShowToast(allChecked ? 'Documentation verifications reset' : 'All 3 clinical chart records verified!');
  };

  const rawJsonData = {
    query_metadata: {
      timestamp: new Date().toISOString(),
      query_text: queryText,
      engine: 'groq:llama-3.3-70b-versatile',
      total_latency_ms: 2742,
      tokens_evaluated: 8192,
    },
    determination: {
      prior_authorization_required: simStatus === 'REQUIRED',
      determination_status:
        simStatus === 'REQUIRED'
          ? 'YES - REQUIRED'
          : simStatus === 'ROUTINE'
          ? 'ROUTINE BYPASS'
          : 'NON-COVERED / CONTRAINDICATED',
      cpt_code: '22551',
      description: 'Anterior Cervical Arthrodesis / Discectomy (Single Interspace)',
      category: 'Spine Surgery / Decompression',
    },
    policy: {
      payer_id: 'CIGNA_HEALTH_2025',
      policy_id: 'CMM-601.7',
      policy_name: 'Anterior Cervical Discectomy and Fusion (ACDF)',
      effective_date: '2024-01-01',
      toc_anchors: [
        { anchor_id: 'S12.1.1', title: 'Adjacent Segment Disease > Radiculopathy', confidence: 0.941 },
        { anchor_id: 'S12.1.2', title: 'Adjacent Segment Disease > Myelopathy', confidence: 0.892 },
      ],
    },
    indications: [
      {
        category: 'Adjacent Segment Disease > Radiculopathy',
        satisfied_count: cat1Count,
        required_count: 5,
        criteria: [
          { text: 'Greater than 6 months since prior cervical surgery', satisfied: cat1Checks[0] },
          { text: 'Significant daily functional impairment and unremitting neck/arm pain', satisfied: cat1Checks[1] },
          { text: 'Failed >= 6 consecutive weeks conservative care', satisfied: cat1Checks[2] },
          { text: 'MRI/CT concordant with neural compression at C6-C7', satisfied: cat1Checks[3] },
          { text: 'Verified nicotine-free status via objective cotinine test', satisfied: cat1Checks[4] },
        ],
      },
      {
        category: 'Adjacent Segment Disease > Myelopathy',
        satisfied_count: cat2Count,
        required_count: 2,
        criteria: [
          { text: 'Gait instability, broad-based ataxia, fine motor loss', satisfied: cat2Checks[0] },
          { text: 'Positive Hoffmann test, Babinski, hyperreflexia', satisfied: cat2Checks[1] },
          { text: 'Spinal canal AP diameter < 10 mm or T2 signal hyperintensity', satisfied: cat2Checks[2] },
        ],
      },
    ],
  };

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(rawJsonData, null, 2));
    onShowToast('JSON schema copied to clipboard!');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Telemetry & Tenant Strip */}
      <div className="w-full bg-surface-container-low px-gutter-lg py-space-sm flex flex-wrap items-center justify-between gap-space-md shadow-sm border-b border-surface-container">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center gap-space-xs px-space-sm py-space-2xs bg-surface-container-lowest rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-code-sm text-code-sm text-secondary font-semibold">
              Online - Groq / Llama-3.3 70B RAG
            </span>
            <span className="font-label-sm text-label-sm text-outline">| 182ms avg latency</span>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
            <span>Active Payer Policy Engine:</span>
            <span className="font-semibold text-on-surface">Commercial Guidelines (2025 rev)</span>
          </div>
          <div className="hidden md:flex items-center gap-space-xs font-code-sm text-code-sm text-outline">
            <span>Tenant ID: #PAYER-992-EAST</span>
            <span>•</span>
            <span>HIPAA Tier 4 Active</span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Session Match Accuracy
          </span>
          <div className="flex items-center gap-space-xs px-space-sm py-space-2xs bg-surface-container rounded-lg">
            <span className="font-code-sm text-code-sm font-bold text-primary">99.2%</span>
            <span className="material-symbols-outlined text-primary text-[14px]">insights</span>
          </div>
        </div>
      </div>

      {/* Primary Workspace Wrapper */}
      <div className="w-full px-gutter-lg py-space-lg flex flex-col gap-space-lg">
        {/* 1. QUERY CONSOLE */}
        <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[22px]">manage_search</span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Clinical Policy Query Console
              </h2>
              <span className="px-space-xs py-space-2xs bg-surface-container-high text-primary font-code-sm text-code-sm rounded">
                POST /api/v1/rag-eval
              </span>
            </div>
            <div className="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
              <span>Search targets: CPT codes, HCPCS, Clinical Indications, Policy TOC IDs</span>
            </div>
          </div>

          {/* Search Input & Triggers */}
          <div className="relative flex flex-col sm:flex-row items-stretch gap-space-sm">
            <div className="relative flex-1">
              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRunEval(simStatus);
                  }
                }}
                className="w-full resize-none rounded-xl bg-surface-bright px-space-base py-space-md font-body-md text-body-md text-on-surface outline-none transition-all placeholder:text-outline focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-sm"
                placeholder="Enter clinical request or CPT code (e.g. CPT 22551 ACDF criteria for adjacent segment radiculopathy)..."
                rows={2}
              />
              <div className="absolute right-space-md bottom-space-md flex items-center gap-space-xs text-outline font-code-sm text-code-sm pointer-events-none">
                <span>Press</span>
                <kbd className="px-space-xs py-0.5 bg-surface-container rounded text-[10px] uppercase font-bold text-on-surface">
                  Enter ↵
                </kbd>
                <span>to evaluate</span>
              </div>
            </div>
            <div className="flex sm:flex-col justify-end gap-space-sm min-w-[150px]">
              <button
                onClick={() => handleRunEval(simStatus)}
                disabled={isRunning}
                className="flex-1 flex items-center justify-center gap-space-xs px-space-lg py-space-sm bg-primary text-on-primary font-label-lg text-label-lg rounded-xl hover:bg-primary-container shadow-sm transition-all active:scale-95 disabled:opacity-75"
              >
                <span className={`material-symbols-outlined text-[18px] ${isRunning ? 'animate-spin' : ''}`}>
                  {isRunning ? 'refresh' : 'play_arrow'}
                </span>
                <span>{isRunning ? 'Evaluating...' : 'Run RAG Eval'}</span>
              </button>
              <button
                onClick={() => setQueryText('')}
                className="flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">clear_all</span>
                <span>Clear Input</span>
              </button>
            </div>
          </div>

          {/* Quick Query Suggestions */}
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Preset Clinical Inquiries (Click to Load):
            </span>
            <div className="flex flex-wrap items-center gap-space-xs">
              <button
                onClick={() =>
                  handleSelectPreset(
                    'CPT 22551 ACDF criteria for adjacent segment disease',
                    'REQUIRED'
                  )
                }
                className="group flex items-center gap-1.5 px-space-sm py-1 bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm rounded-lg transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform"></span>
                <span>CPT 22551 ACDF criteria</span>
              </button>
              <button
                onClick={() =>
                  handleSelectPreset(
                    'When is adjacent segment disease considered medically necessary',
                    'REQUIRED'
                  )
                }
                className="group flex items-center gap-1.5 px-space-sm py-1 bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm rounded-lg transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform"></span>
                <span>When is adjacent segment disease considered medically necessary</span>
              </button>
              <button
                onClick={() =>
                  handleSelectPreset(
                    'Is prior auth required for routine complete blood count CPT 85025',
                    'ROUTINE'
                  )
                }
                className="group flex items-center gap-1.5 px-space-sm py-1 bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm rounded-lg transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary group-hover:scale-125 transition-transform"></span>
                <span>Routine CBC CPT 85025 requirement</span>
              </button>
              <button
                onClick={() =>
                  handleSelectPreset(
                    'Coverage requirements for CPT 27447 total knee arthroplasty',
                    'REQUIRED'
                  )
                }
                className="group flex items-center gap-1.5 px-space-sm py-1 bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm rounded-lg transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform"></span>
                <span>CPT 27447 Total Knee Arthroplasty</span>
              </button>
              <button
                onClick={() =>
                  handleSelectPreset(
                    'Non-indications and absolute exclusions for lumbar spinal fusion',
                    'EXCLUSIONS'
                  )
                }
                className="group flex items-center gap-1.5 px-space-sm py-1 bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm rounded-lg transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary group-hover:scale-125 transition-transform"></span>
                <span>Non-indications for Lumbar Spinal Fusion</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. PIPELINE EXECUTION STEPPER */}
        <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
          <div className="flex items-center justify-between pb-space-sm">
            <span className="font-label-md text-label-md uppercase tracking-wider font-bold text-on-surface-variant">
              Live RAG Retrieval Graph Pipeline
            </span>
            <span className="font-code-sm text-code-sm text-secondary font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Execution Nominal (2.742s total)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-sm pt-space-xs">
            {/* Stage 1 */}
            <div
              className={`rounded-xl p-space-md flex flex-col gap-space-xs transition-all ${
                isRunning ? 'bg-primary-fixed/30 animate-pulse' : 'bg-surface-bright hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-[14px]">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <span className="font-code-sm text-code-sm text-outline font-semibold">Stage 1/4</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface">Master CPT Lookup</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                CPT 22551 mapped to Category III Spine Policy
              </span>
              <div className="mt-auto pt-space-xs flex items-center justify-between">
                <span className="font-code-sm text-code-sm px-space-xs py-0.5 bg-surface-container text-primary font-bold rounded">
                  42 ms
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">Matched</span>
              </div>
            </div>

            {/* Stage 2 */}
            <div
              className={`rounded-xl p-space-md flex flex-col gap-space-xs transition-all ${
                isRunning ? 'bg-primary-fixed/30 animate-pulse' : 'bg-surface-bright hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-[14px]">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <span className="font-code-sm text-code-sm text-outline font-semibold">Stage 2/4</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface">Multi-Doc TOC Routing</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Traversed 42 guidelines; pinned S12.1.1 &amp; S12.1.2
              </span>
              <div className="mt-auto pt-space-xs flex items-center justify-between">
                <span className="font-code-sm text-code-sm px-space-xs py-0.5 bg-surface-container text-primary font-bold rounded">
                  1.10 s
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">Traversed</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div
              className={`rounded-xl p-space-md flex flex-col gap-space-xs transition-all ${
                isRunning ? 'bg-primary-fixed/30 animate-pulse' : 'bg-surface-bright hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-[14px]">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <span className="font-code-sm text-code-sm text-outline font-semibold">Stage 3/4</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface">Scoped Hybrid Retrieval</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Dense vector top-k=6 + BM25 keyword anchor
              </span>
              <div className="mt-auto pt-space-xs flex items-center justify-between">
                <span className="font-code-sm text-code-sm px-space-xs py-0.5 bg-surface-container text-primary font-bold rounded">
                  0.40 s
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">Dense 0.892</span>
              </div>
            </div>

            {/* Stage 4 */}
            <div
              className={`rounded-xl p-space-md flex flex-col gap-space-xs transition-all ${
                isRunning ? 'bg-primary-fixed/30 animate-pulse' : 'bg-surface-bright hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-[14px]">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <span className="font-code-sm text-code-sm text-outline font-semibold">Stage 4/4</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface">Structured LLM Synthesis</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Llama-3.3 70B strict JSON criteria extraction
              </span>
              <div className="mt-auto pt-space-xs flex items-center justify-between">
                <span className="font-code-sm text-code-sm px-space-xs py-0.5 bg-surface-container text-primary font-bold rounded">
                  1.20 s
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">Synthesized</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DETERMINATION HEADER CARD */}
        <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm">
            {/* Status determination badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-space-md">
              <div
                className={`flex items-center gap-space-sm px-space-base py-space-sm rounded-xl shadow-sm ${
                  simStatus === 'REQUIRED'
                    ? 'bg-secondary-container text-on-secondary-container'
                    : simStatus === 'ROUTINE'
                    ? 'bg-primary-fixed text-on-primary-fixed'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {simStatus === 'REQUIRED'
                    ? 'verified'
                    : simStatus === 'ROUTINE'
                    ? 'bolt'
                    : 'warning'}
                </span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-extrabold">
                    Determination Result
                  </span>
                  <span className="font-headline-md text-headline-md font-extrabold tracking-tight">
                    {simStatus === 'REQUIRED'
                      ? 'PRIOR AUTHORIZATION: YES - REQUIRED'
                      : simStatus === 'ROUTINE'
                      ? 'ROUTINE PROCEDURE: NO PA REQUIRED'
                      : 'NON-COVERED / CONTRAINDICATED'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
                  Clinical Category
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Cervical Spine Decompression / Arthrodesis
                </span>
              </div>
            </div>

            {/* Simulation switcher */}
            <div className="flex items-center gap-space-xs bg-surface-container p-1 rounded-xl">
              <span className="font-label-sm text-label-sm text-on-surface-variant px-space-xs font-semibold">
                Simulate:
              </span>
              <button
                onClick={() => setSimStatus('REQUIRED')}
                className={`px-space-sm py-1 font-label-sm text-label-sm rounded-lg font-semibold transition-all ${
                  simStatus === 'REQUIRED'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Prior Auth Req
              </button>
              <button
                onClick={() => setSimStatus('ROUTINE')}
                className={`px-space-sm py-1 font-label-sm text-label-sm rounded-lg font-semibold transition-all ${
                  simStatus === 'ROUTINE'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Routine Bypass
              </button>
              <button
                onClick={() => setSimStatus('EXCLUSIONS')}
                className={`px-space-sm py-1 font-label-sm text-label-sm rounded-lg font-semibold transition-all ${
                  simStatus === 'EXCLUSIONS'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Exclusions Found
              </button>
            </div>
          </div>

          {/* Policy Metadata Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md p-space-md bg-surface-container-low rounded-xl">
            <div className="flex flex-col gap-0.5">
              <span className="font-label-sm text-label-sm text-outline uppercase font-bold">
                Payer Clinical Policy
              </span>
              <span className="font-label-lg text-label-lg text-primary font-bold">
                {liveData ? (liveData['Policy Name'] || 'None Identified') : 'Cigna ACDF (CMM-601: Anterior Cervical Discectomy & Fusion)'}
              </span>
              <span className="font-code-sm text-code-sm text-on-surface-variant truncate" title={liveData?.Notice || ''}>
                {liveData?.Notice ? liveData.Notice.slice(0, 80) + '...' : 'Coverage Policy: Registered Invariant'}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-label-sm text-label-sm text-outline uppercase font-bold">
                Engine &amp; Latency
              </span>
              <span className="font-body-md text-body-md text-on-surface font-semibold">
                {liveMetadata ? `${liveMetadata.elapsed_seconds}s execution` : 'Jan 1, 2024 – Dec 31, 2025'}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {liveMetadata?.engine || 'Groq Hybrid Dense + BM25'}
              </span>
            </div>
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-outline uppercase font-bold">
                Referred Policy TOC Anchor Chunks
              </span>
              <div className="flex flex-wrap gap-space-xs">
                {liveData && Array.isArray(liveData['Referred Sections']) && liveData['Referred Sections'].length > 0 ? (
                  liveData['Referred Sections'].map((sec: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={onNavigateToToc}
                      className="inline-flex items-center gap-1 px-space-sm py-0.5 bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm rounded hover:bg-primary-fixed-dim transition-colors"
                      title="Click to view full guideline text in TOC"
                    >
                      <span className="material-symbols-outlined text-[13px]">tag</span>
                      {sec}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      onClick={onNavigateToToc}
                      className="inline-flex items-center gap-1 px-space-sm py-0.5 bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm rounded hover:bg-primary-fixed-dim transition-colors"
                      title="Click to view full guideline text in TOC"
                    >
                      <span className="material-symbols-outlined text-[13px]">tag</span>
                      [TOC: S12.1.1] Radiculopathy
                    </button>
                    <button
                      onClick={onNavigateToToc}
                      className="inline-flex items-center gap-1 px-space-sm py-0.5 bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm rounded hover:bg-primary-fixed-dim transition-colors"
                      title="Click to view full guideline text in TOC"
                    >
                      <span className="material-symbols-outlined text-[13px]">tag</span>
                      [TOC: S12.1.2] Myelopathy
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. MAIN DECISION & CRITERIA REVIEW SPLIT VIEW */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
          {/* Primary Decision Feed (7 cols) */}
          <div className="xl:col-span-7 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              {/* Criteria Tabs Header */}
              <div className="flex items-center border-b border-surface-container-high px-space-sm pt-space-xs bg-surface-container-low">
                <button
                  onClick={() => setActiveTab('indications')}
                  className={`px-space-md py-space-sm font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                    activeTab === 'indications'
                      ? 'font-bold text-primary border-b-2 border-primary'
                      : 'font-semibold text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  <span>1. Medical Necessity Indications</span>
                  <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm font-bold">
                    {liveData && Array.isArray(liveData['Medical necessity indications'])
                      ? liveData['Medical necessity indications'].reduce((acc: number, curr: any) => acc + (curr['Required findings']?.length || 0), 0)
                      : 8}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('contra')}
                  className={`px-space-md py-space-sm font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                    activeTab === 'contra'
                      ? 'font-bold text-primary border-b-2 border-primary'
                      : 'font-semibold text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">report</span>
                  <span>2. Non-Indications &amp; Contra</span>
                  <span className="px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-code-sm text-code-sm font-bold">
                    {liveData && Array.isArray(liveData['Non-Indications']) ? liveData['Non-Indications'].length : 3}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('chart')}
                  className={`px-space-md py-space-sm font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                    activeTab === 'chart'
                      ? 'font-bold text-primary border-b-2 border-primary'
                      : 'font-semibold text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">folder_shared</span>
                  <span>3. Chart Verification</span>
                  <span className="px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface font-code-sm text-code-sm font-bold">
                    {liveData && Array.isArray(liveData['Documentation required']) ? liveData['Documentation required'].length : 3}
                  </span>
                </button>
              </div>

              {/* TAB 1: Indications */}
              {activeTab === 'indications' && (
                <div className="p-space-lg flex flex-col gap-space-lg">
                  {liveData && Array.isArray(liveData['Medical necessity indications']) && liveData['Medical necessity indications'].length > 0 ? (
                    <>
                      {liveData['Medical necessity indications'].map((ind: any, catIdx: number) => {
                        const catName = ind['Guideline Category'] || ind['category'] || `Category ${catIdx + 1}: Clinical Indications`;
                        const findings = ind['Required findings'] || ind['findings'] || [];
                        const satisfiedCount = findings.filter((_: any, fIdx: number) => dynamicChecks[`cat-${catIdx}-item-${fIdx}`]).length;

                        return (
                          <div key={catIdx} className="bg-surface-bright rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs border-b border-surface-container">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-space-xs">
                                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                                  <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                                    {catName}
                                  </h3>
                                </div>
                                {ind['Source'] && (
                                  <span className="font-code-sm text-code-sm text-outline pl-space-sm">
                                    Source: {ind['Source']}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-space-xs">
                                <span className={`px-space-sm py-1 font-code-sm text-code-sm rounded-lg font-bold ${satisfiedCount === findings.length && findings.length > 0 ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface'}`}>
                                  {satisfiedCount} / {findings.length} satisfied
                                </span>
                                <span className="px-space-xs py-1 bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm rounded uppercase font-bold">
                                  EVALUATE CHART
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-space-xs">
                              {findings.map((finding: string, fIdx: number) => {
                                const checkKey = `cat-${catIdx}-item-${fIdx}`;
                                const isChecked = !!dynamicChecks[checkKey];
                                return (
                                  <label key={fIdx} className="group flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleDynamicCheck(checkKey)}
                                      className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                                    />
                                    <div className="flex flex-col gap-0.5 flex-1">
                                      <span className={`font-body-md text-body-md ${isChecked ? 'line-through text-outline font-normal' : 'text-on-surface font-semibold'}`}>
                                        {finding}
                                      </span>
                                    </div>
                                    <span className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded font-bold ${isChecked ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-outline'}`}>
                                      {isChecked ? 'Satisfied' : 'Pending'}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {/* Important criteria & exceptions */}
                      {Array.isArray(liveData['Important criteria & exceptions']) && liveData['Important criteria & exceptions'].length > 0 && (
                        <div className="bg-primary-fixed/30 border-l-4 border-primary p-space-md rounded-xl flex items-start gap-space-sm text-on-surface">
                          <span className="material-symbols-outlined text-primary text-[24px]">info</span>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md font-bold text-primary">
                              Important Criteria &amp; Exceptions
                            </span>
                            <ul className="list-disc pl-5 pt-1 text-sm text-on-surface-variant flex flex-col gap-1">
                              {liveData['Important criteria & exceptions'].map((exc: string, eIdx: number) => (
                                <li key={eIdx}>{exc}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Category 1 */}
                  <div className="bg-surface-bright rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs border-b border-surface-container">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                          <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                            Category 1: Adjacent Segment Disease &gt; Cervical Radiculopathy
                          </h3>
                        </div>
                        <span className="font-code-sm text-code-sm text-outline pl-space-sm">
                          Source: Policy CMM-601.7 • Section TOC: S12.1.1
                        </span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span
                          className={`px-space-sm py-1 font-code-sm text-code-sm rounded-lg font-bold ${
                            cat1Count === 5
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {cat1Count} / 5 satisfied
                        </span>
                        <span className="px-space-xs py-1 bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm rounded uppercase font-bold">
                          ALL 5 REQUIRED
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-xs">
                      {/* Item 1 */}
                      <label className="group flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                        <input
                          type="checkbox"
                          checked={cat1Checks[0]}
                          onChange={() => toggleCat1(0)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span
                            className={`font-body-md text-body-md ${
                              cat1Checks[0]
                                ? 'line-through text-outline font-normal'
                                : 'text-on-surface font-semibold'
                            }`}
                          >
                            Greater than six (6) months since prior cervical decompression or fusion surgery
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Confirmed via EHR operative log: prior C5-C6 fusion on 04/12/2023 (&gt;18 mos prior).
                          </span>
                        </div>
                        <span
                          className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded font-bold ${
                            cat1Checks[0]
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container text-outline'
                          }`}
                        >
                          {cat1Checks[0] ? 'Satisfied' : 'Pending'}
                        </span>
                      </label>

                      {/* Item 2 */}
                      <label className="group flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                        <input
                          type="checkbox"
                          checked={cat1Checks[1]}
                          onChange={() => toggleCat1(1)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span
                            className={`font-body-md text-body-md ${
                              cat1Checks[1]
                                ? 'line-through text-outline font-normal'
                                : 'text-on-surface font-semibold'
                            }`}
                          >
                            Significant daily functional impairment and unremitting radicular neck/arm pain
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Visual Analog Scale (VAS) score 8/10 documented; Neck Disability Index (NDI) &gt; 42%.
                          </span>
                        </div>
                        <span
                          className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded font-bold ${
                            cat1Checks[1]
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container text-outline'
                          }`}
                        >
                          {cat1Checks[1] ? 'Satisfied' : 'Pending'}
                        </span>
                      </label>

                      {/* Item 3 */}
                      <label className="group flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                        <input
                          type="checkbox"
                          checked={cat1Checks[2]}
                          onChange={() => toggleCat1(2)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span
                            className={`font-body-md text-body-md ${
                              cat1Checks[2]
                                ? 'line-through text-outline font-normal'
                                : 'text-on-surface font-semibold'
                            }`}
                          >
                            Failed &gt;= 6 consecutive weeks conservative non-operative care (PT, NSAIDs, cervical traction, or selective epidural injections)
                          </span>
                          <span className="font-body-sm text-body-sm text-tertiary font-medium">
                            {cat1Checks[2]
                              ? 'Verified: Complete physical therapy attendance log submitted.'
                              : 'Pending proof: EHR shows only 3 weeks physical therapy completed. Documentation gap.'}
                          </span>
                        </div>
                        <span
                          className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded font-bold ${
                            cat1Checks[2]
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-tertiary-fixed text-on-tertiary-fixed'
                          }`}
                        >
                          {cat1Checks[2] ? 'Satisfied' : 'Pending Trial'}
                        </span>
                      </label>

                      {/* Item 4 */}
                      <label className="group flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                        <input
                          type="checkbox"
                          checked={cat1Checks[3]}
                          onChange={() => toggleCat1(3)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span
                            className={`font-body-md text-body-md ${
                              cat1Checks[3]
                                ? 'line-through text-outline font-normal'
                                : 'text-on-surface font-semibold'
                            }`}
                          >
                            MRI or CT concordant with neuroforaminal or canal neural compression at adjacent level (C6-C7)
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            MRI cervical spine report dated 11/04/2024 demonstrates moderate C6-C7 disc herniation.
                          </span>
                        </div>
                        <span
                          className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded ${
                            cat1Checks[3]
                              ? 'bg-secondary-container text-on-secondary-container font-bold'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {cat1Checks[3] ? 'Satisfied' : 'Chart Review'}
                        </span>
                      </label>

                      {/* Item 5 */}
                      <label className="group flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                        <input
                          type="checkbox"
                          checked={cat1Checks[4]}
                          onChange={() => toggleCat1(4)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span
                            className={`font-body-md text-body-md ${
                              cat1Checks[4]
                                ? 'line-through text-outline font-normal'
                                : 'text-on-surface font-semibold'
                            }`}
                          >
                            Verified nicotine-free status via objective cotinine test prior to fusion authorization
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            {cat1Checks[4]
                              ? 'Lab verified: Urine cotinine < 5 ng/mL archived on 2025-05-12.'
                              : 'Pre-op lab order active; urine cotinine report awaiting upload.'}
                          </span>
                        </div>
                        <span
                          className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded ${
                            cat1Checks[4]
                              ? 'bg-secondary-container text-on-secondary-container font-bold'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {cat1Checks[4] ? 'Satisfied' : 'Lab Req'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div className="bg-surface-bright rounded-xl p-space-md flex flex-col gap-space-md shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs border-b border-surface-container">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                          <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                            Category 2: Adjacent Segment Disease &gt; Cervical Myelopathy
                          </h3>
                        </div>
                        <span className="font-code-sm text-code-sm text-outline pl-space-sm">
                          Source: Policy CMM-601.7 • Section TOC: S12.1.2
                        </span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <span
                          className={`px-space-sm py-1 font-code-sm text-code-sm rounded-lg font-bold ${
                            cat2Count >= 2
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {cat2Count} / 3 satisfied
                        </span>
                        <span className="px-space-xs py-1 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm rounded uppercase font-bold">
                          MIN 2 REQUIRED
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-xs">
                      {/* Cat 2 Item 1 */}
                      <label className="group flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                        <input
                          type="checkbox"
                          checked={cat2Checks[0]}
                          onChange={() => toggleCat2(0)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span
                            className={`font-body-md text-body-md ${
                              cat2Checks[0]
                                ? 'line-through text-outline font-normal'
                                : 'text-on-surface font-semibold'
                            }`}
                          >
                            Symptom profile: Gait instability, broad-based ataxia, or bilateral loss of hand fine motor skills
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Neurological clinic notes document clumsy buttoning and unsteadiness.
                          </span>
                        </div>
                        <span
                          className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded ${
                            cat2Checks[0]
                              ? 'bg-secondary-container text-on-secondary-container font-bold'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {cat2Checks[0] ? 'Satisfied' : 'Unverified'}
                        </span>
                      </label>

                      {/* Cat 2 Item 2 */}
                      <label className="group flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                        <input
                          type="checkbox"
                          checked={cat2Checks[1]}
                          onChange={() => toggleCat2(1)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span
                            className={`font-body-md text-body-md ${
                              cat2Checks[1]
                                ? 'line-through text-outline font-normal'
                                : 'text-on-surface font-semibold'
                            }`}
                          >
                            Physical Exam Signs: Positive Hoffmann test, extensor plantar response (Babinski), clonus, or hyperreflexia
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Documented brisk 3+ patellar reflexes; bilateral Hoffmann sign present.
                          </span>
                        </div>
                        <span
                          className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded ${
                            cat2Checks[1]
                              ? 'bg-secondary-container text-on-secondary-container font-bold'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {cat2Checks[1] ? 'Satisfied' : 'Unverified'}
                        </span>
                      </label>

                      {/* Cat 2 Item 3 */}
                      <label className="group flex items-start gap-space-md p-space-md bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
                        <input
                          type="checkbox"
                          checked={cat2Checks[2]}
                          onChange={() => toggleCat2(2)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span
                            className={`font-body-md text-body-md ${
                              cat2Checks[2]
                                ? 'line-through text-outline font-normal'
                                : 'text-on-surface font-semibold'
                            }`}
                          >
                            Advanced Imaging: Cord compression, spinal canal AP diameter &lt; 10 mm, or T2 cord signal hyperintensity
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            MRI shows cervical canal narrowed to 8.2mm with focal cord indentation.
                          </span>
                        </div>
                        <span
                          className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded ${
                            cat2Checks[2]
                              ? 'bg-secondary-container text-on-secondary-container font-bold'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {cat2Checks[2] ? 'Satisfied' : 'Unverified'}
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: Contraindications */}
          {activeTab === 'contra' && (
            <div className="p-space-lg flex flex-col gap-space-md">
              <div className="bg-error-container/40 border-l-4 border-error p-space-lg rounded-xl flex flex-col gap-space-sm text-on-error-container">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-error text-[28px]">crisis_alert</span>
                  <span className="font-headline-md text-headline-md font-bold text-on-error-container">
                    Absolute Exclusions &amp; Non-Covered Indications
                  </span>
                </div>
                <p className="font-body-md text-body-md leading-relaxed">
                  Under Payer Clinical Guidelines, surgical intervention is strictly{' '}
                  <strong className="font-bold underline">not medically indicated</strong> when any of the following
                  parameters are present, triggering immediate peer-to-peer review or automatic claim denial:
                </p>
                <ul className="flex flex-col gap-space-sm pt-space-xs">
                  {liveData && Array.isArray(liveData['Non-Indications']) && liveData['Non-Indications'].length > 0 ? (
                    liveData['Non-Indications'].map((nonInd: string, nIdx: number) => (
                      <li key={nIdx} className="flex items-start gap-space-sm bg-surface-container-lowest p-space-md rounded-lg shadow-sm text-on-surface">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">cancel</span>
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg font-bold text-error">
                            {nonInd}
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-space-sm bg-surface-container-lowest p-space-md rounded-lg shadow-sm text-on-surface">
                        <span className="material-symbols-outlined text-error text-[20px]">cancel</span>
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg font-bold text-error">
                            Surgery performed &lt; 6 months post-prior cervical procedure
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Premature re-exploration before adjacent spinal equilibrium stabilizes is non-indicated.
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-space-sm bg-surface-container-lowest p-space-md rounded-lg shadow-sm text-on-surface">
                        <span className="material-symbols-outlined text-error text-[20px]">cancel</span>
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg font-bold text-error">
                            Isolated axial neck pain without radiculopathy or myelopathy
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Mechanical facet neck pain or muscular spasm without objective radicular dermatome correlation is excluded.
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-space-sm bg-surface-container-lowest p-space-md rounded-lg shadow-sm text-on-surface">
                        <span className="material-symbols-outlined text-error text-[20px]">cancel</span>
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg font-bold text-error">
                            Active unmanaged behavioral health or unmanaged substance use disorders
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Active opioid dependency or uncontrolled psychological morbidity requires preoperative clearance.
                          </span>
                        </div>
                      </li>
                    </>
                  )}
                </ul>
              </div>

                  <div className="bg-primary-fixed/30 border-l-4 border-primary p-space-md rounded-xl flex items-start gap-space-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[24px]">info</span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold text-primary">
                        Emergency / Rapid Deterioration Bypass Exception
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        <strong>Notice:</strong> The requirement for 6 weeks of conservative therapy is{' '}
                        <span className="text-primary font-bold">explicitly waived</span> if there is documented rapid progressive
                        neurological motor deficit (e.g., foot drop, sudden triceps weakness) or overt cervical myelopathy.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Chart Verification */}
              {activeTab === 'chart' && (
                <div className="p-space-lg flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs border-b border-surface-container">
                    <div>
                      <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                        Payer-Required Chart Documentation (3 Records)
                      </h3>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Evidence artifacts must be submitted prior to final determination sign-off.
                      </span>
                    </div>
                    <div className="flex items-center gap-space-sm">
                      <button
                        onClick={handleToggleAllDocs}
                        className="px-space-md py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm rounded-lg transition-all font-semibold"
                      >
                        {docChecks.every(Boolean) ? 'Unmark All' : 'Mark All Verified'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-sm">
                    {liveData && Array.isArray(liveData['Documentation required']) && liveData['Documentation required'].length > 0 ? (
                      liveData['Documentation required'].map((docItem: string, dIdx: number) => {
                        const docKey = `live-doc-${dIdx}`;
                        const isDocChecked = !!dynamicChecks[docKey];
                        return (
                          <div key={dIdx} className="p-space-md bg-surface-bright rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-sm">
                            <div className="flex items-start gap-space-sm">
                              <input
                                type="checkbox"
                                checked={isDocChecked}
                                onChange={() => toggleDynamicCheck(docKey)}
                                className="mt-1 w-4 h-4 text-primary rounded accent-primary cursor-pointer"
                              />
                              <div className="flex flex-col">
                                <span className="font-label-md text-label-md font-bold text-on-surface">
                                  {docItem}
                                </span>
                                <span className="font-body-sm text-body-sm text-outline">
                                  Payer-mandated clinical record artifact
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-space-xs shrink-0">
                              <span className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded shadow-sm ${isDocChecked ? 'bg-secondary-container text-on-secondary-container font-bold' : 'bg-surface-container text-outline'}`}>
                                {isDocChecked ? 'Verified' : 'Pending Upload'}
                              </span>
                              <button
                                onClick={() => {
                                  toggleDynamicCheck(docKey);
                                  onShowToast(`Marked verified: ${docItem.slice(0, 35)}...`);
                                }}
                                className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center hover:bg-surface-container transition-all"
                              >
                                <span className="material-symbols-outlined text-[16px] text-primary">upload_file</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        {/* Doc 1 */}
                        <div className="p-space-md bg-surface-bright rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-sm">
                          <div className="flex items-start gap-space-sm">
                            <input
                              type="checkbox"
                              checked={docChecks[0]}
                              onChange={() => toggleDoc(0)}
                              className="mt-1 w-4 h-4 text-primary rounded accent-primary cursor-pointer"
                            />
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md font-bold text-on-surface">
                                Flexion/extension lateral cervical x-rays &amp; advanced imaging (MRI/CT within 6 mos)
                              </span>
                              <span className="font-body-sm text-body-sm text-outline">
                                Must rule out segment gross instability (&gt;3.5 mm translation or &gt;11 deg angular motion).
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-space-xs shrink-0">
                            <span className="px-space-xs py-0.5 bg-surface-container-lowest text-outline font-code-sm text-code-sm rounded shadow-sm border border-surface-container">
                              PDF Attached
                            </span>
                            <button
                              onClick={() => onShowToast('Opening Flexion/Extension Lateral X-Ray Scan PDF')}
                              className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center hover:bg-surface-container transition-all"
                            >
                              <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                            </button>
                          </div>
                        </div>

                        {/* Doc 2 */}
                        <div className="p-space-md bg-surface-bright rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-sm">
                          <div className="flex items-start gap-space-sm">
                            <input
                              type="checkbox"
                              checked={docChecks[1]}
                              onChange={() => toggleDoc(1)}
                              className="mt-1 w-4 h-4 text-primary rounded accent-primary cursor-pointer"
                            />
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md font-bold text-on-surface">
                                Physical therapy progress notes documenting 6-week conservative trial
                              </span>
                              <span className="font-body-sm text-body-sm text-outline">
                                Must contain attendance logs, therapeutic exercises, and post-session functional status.
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-space-xs shrink-0">
                            <span
                              className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded shadow-sm ${
                                docChecks[1]
                                  ? 'bg-secondary-container text-on-secondary-container'
                                  : 'bg-error-container text-on-error-container'
                              }`}
                            >
                              {docChecks[1] ? 'Uploaded' : 'Missing Log'}
                            </span>
                            <button
                              onClick={() => {
                                toggleDoc(1);
                                onShowToast('PT progress log uploaded and parsed');
                              }}
                              className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center hover:bg-surface-container transition-all"
                            >
                              <span className="material-symbols-outlined text-[16px] text-primary">upload_file</span>
                            </button>
                          </div>
                        </div>

                        {/* Doc 3 */}
                        <div className="p-space-md bg-surface-bright rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-sm">
                          <div className="flex items-start gap-space-sm">
                            <input
                              type="checkbox"
                              checked={docChecks[2]}
                              onChange={() => toggleDoc(2)}
                              className="mt-1 w-4 h-4 text-primary rounded accent-primary cursor-pointer"
                            />
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md font-bold text-on-surface">
                                Objective lab cotinine test result confirming nicotine abstinence (&lt;10 ng/mL)
                              </span>
                              <span className="font-body-sm text-body-sm text-outline">
                                Required for all elective arthrodesis applications within 30 days prior to date of procedure.
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-space-xs shrink-0">
                            <span
                              className={`px-space-xs py-0.5 font-code-sm text-code-sm rounded shadow-sm ${
                                docChecks[2]
                                  ? 'bg-secondary-container text-on-secondary-container'
                                  : 'bg-surface-container-lowest text-outline'
                              }`}
                            >
                              {docChecks[2] ? 'Lab Verified' : 'Lab Pending'}
                            </span>
                            <button
                              onClick={() => {
                                toggleDoc(2);
                                onShowToast('Synced with Quest Diagnostics: Cotinine negative (<2 ng/mL)');
                              }}
                              className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center hover:bg-surface-container transition-all"
                            >
                              <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky RAG Evidence & Guideline Inspector (5 cols) */}
          <div className="xl:col-span-5 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md sticky top-20">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">policy</span>
                  <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                    RAG Grounded Citations &amp; Policy Chunks
                  </h3>
                </div>
                <span className="font-code-sm text-code-sm px-space-xs py-0.5 bg-secondary-container text-on-secondary-container rounded font-bold">
                  Hybrid Cosine 0.941
                </span>
              </div>

              {/* Citation Card 1 */}
              <div className="bg-surface-bright rounded-xl p-space-md flex flex-col gap-space-xs border-l-4 border-primary shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-code-sm text-code-sm text-primary font-bold">
                    Section S12.1.1 (Radiculopathy Rules)
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">Page 18 • Line 412</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-normal">
                  "...Cervical discectomy and fusion for adjacent segment disease is considered{' '}
                  <mark className="bg-primary-fixed text-on-primary-fixed px-1 rounded font-medium">
                    medically necessary
                  </mark>{' '}
                  only when unremitting radicular pain with motor/sensory dermatomal distribution persists despite a minimum of{' '}
                  <mark className="bg-primary-fixed text-on-primary-fixed px-1 rounded font-medium">
                    six (6) consecutive weeks of structured non-operative therapy
                  </mark>
                  ..."
                </p>
                <div className="flex items-center justify-between pt-space-2xs text-outline font-code-sm text-code-sm">
                  <span>Token Distance: 14</span>
                  <span className="text-secondary font-semibold">LLM Match: High Relevance</span>
                </div>
              </div>

              {/* Citation Card 2 */}
              <div className="bg-surface-bright rounded-xl p-space-md flex flex-col gap-space-xs border-l-4 border-secondary shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-code-sm text-code-sm text-secondary font-bold">
                    Section S12.1.2 (Myelopathy Exception)
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">Page 19 • Line 468</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-normal">
                  "...In the explicit presence of{' '}
                  <mark className="bg-secondary-container text-on-secondary-container px-1 rounded font-medium">
                    overt cervical myelopathy
                  </mark>{' '}
                  substantiated by upper motor neuron signs or rapidly worsening ataxia, decompression is approved{' '}
                  <mark className="bg-secondary-container text-on-secondary-container px-1 rounded font-medium">
                    without mandatory trial
                  </mark>{' '}
                  of non-operative management..."
                </p>
                <div className="flex items-center justify-between pt-space-2xs text-outline font-code-sm text-code-sm">
                  <span>Token Distance: 22</span>
                  <span className="text-secondary font-semibold">LLM Match: High Relevance</span>
                </div>
              </div>

              {/* Model Telemetry Card */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline uppercase font-bold">
                  Inference Telemetry Details
                </span>
                <div className="grid grid-cols-2 gap-space-xs font-code-sm text-code-sm text-on-surface-variant pt-space-2xs">
                  <div className="flex flex-col">
                    <span className="text-outline">Engine:</span>
                    <span className="font-bold text-on-surface">groq:llama-3.3-70b-versatile</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-outline">Context Window:</span>
                    <span className="font-bold text-on-surface">8,192 / 128,000 tok</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-outline">Prompt Eval Time:</span>
                    <span className="font-bold text-on-surface">312 ms (2,410 t/s)</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-outline">Generation Output:</span>
                    <span className="font-bold text-on-surface">488 tok (184 t/s)</span>
                  </div>
                </div>
              </div>

              {/* Quick Audit Actions */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <button
                  onClick={() => setIsJsonDrawerOpen(true)}
                  className="w-full flex items-center justify-center gap-space-sm px-space-md py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-xl transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  <span>Inspect Raw RAG JSON Payload</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-space-sm px-space-md py-space-sm bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-label-md rounded-xl transition-all border border-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>Print Clinical Audit Summary PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. FOOTER WORKFLOW CONTROLS */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-md border border-surface-container">
          <div className="flex items-center gap-space-md">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isApproved ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isApproved ? 'check_circle' : 'verified'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                {isApproved
                  ? `Review Criteria Satisfied (${cat1Count}/5 radiculopathy, ${cat2Count}/3 myelopathy)`
                  : `Review Incomplete (${cat1Count}/5 radiculopathy satisfied - 5 required for approval)`}
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                {isApproved
                  ? 'All core clinical necessity criteria confirmed. Ready for electronic clearinghouse submission.'
                  : 'Criteria incomplete. Requires clinician validation before electronic PA transmission.'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm w-full sm:w-auto">
            <button
              onClick={copyJsonToClipboard}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              <span>Copy JSON</span>
            </button>
            <button
              onClick={() => {
                onShowToast(
                  isApproved
                    ? 'Determination approved & stamped! Dispatched to Cigna Payer Clearinghouse.'
                    : 'Partial determination logged. Additional evidence requested from provider.'
                );
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-space-xs px-space-lg py-space-sm bg-primary text-on-primary font-label-lg text-label-lg rounded-xl hover:bg-primary-container shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Submit Determination</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. RAW JSON FLYOUT DRAWER */}
      {isJsonDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            onClick={() => setIsJsonDrawerOpen(false)}
            className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-full max-w-2xl h-full bg-surface-container-lowest shadow-2xl p-space-lg flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">data_object</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    REST API Response
                  </h3>
                  <span className="font-code-sm text-code-sm text-outline">
                    POST /api/v1/query-rag • Status 200 OK
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsJsonDrawerOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* JSON Content */}
            <div className="flex-1 my-space-md overflow-hidden rounded-xl bg-inverse-surface text-inverse-on-surface p-space-md font-code-sm text-code-sm flex flex-col">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest/20 mb-space-xs">
                <span className="text-secondary font-bold">application/json • 2,492 bytes</span>
                <button
                  onClick={copyJsonToClipboard}
                  className="flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-highest/20 hover:bg-surface-container-highest/30 text-inverse-on-surface transition-all text-xs"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>Copy Schema</span>
                </button>
              </div>
              <pre className="flex-1 overflow-y-auto pr-space-xs select-all text-surface-container-highest font-code-sm leading-relaxed">
                {JSON.stringify(rawJsonData, null, 2)}
              </pre>
            </div>

            {/* Drawer Footer */}
            <div className="flex items-center justify-between pt-space-sm border-t border-surface-container">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Conforms to PriorAuth JSON Schema v1.0.0
              </span>
              <button
                onClick={() => setIsJsonDrawerOpen(false)}
                className="px-space-lg py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-xl transition-all font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
