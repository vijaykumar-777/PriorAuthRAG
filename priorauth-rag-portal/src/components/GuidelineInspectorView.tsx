import React, { useState } from 'react';

interface GuidelineInspectorViewProps {
  onShowToast: (msg: string, icon?: string) => void;
}

export const GuidelineInspectorView: React.FC<GuidelineInspectorViewProps> = ({ onShowToast }) => {
  const [selectedPolicy, setSelectedPolicy] = useState('CMM-601');
  const [activeSection, setActiveSection] = useState('S12.1.1');
  const [payerScope, setPayerScope] = useState('all');
  const [searchQuery, setSearchQuery] = useState('Adjacent Segment Disease Radiculopathy');
  const [isMetadataExpanded, setIsMetadataExpanded] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxQuery, setSandboxQuery] = useState(
    'Patient has C5-C6 pain after 2021 C6-C7 fusion, completed 8 wks PT, cotinine negative.'
  );

  const handleReindex = () => {
    onShowToast(`Re-indexing ${selectedPolicy} against Milvus & Pinecone hybrid cluster...`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Command & Policy Control Header */}
      <div className="px-gutter-lg py-space-md bg-surface-container-low flex flex-col gap-space-md shadow-sm border-b border-surface-container">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          {/* Policy Identity & Versioning */}
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm font-bold">
              <span className="material-symbols-outlined text-[24px]">manage_search</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Guideline Inspector
                </span>
                <span className="px-space-xs py-space-2xs rounded bg-surface-container-highest text-primary font-code-sm text-code-sm font-semibold">
                  v2025.2.1
                </span>
                <span className="flex items-center gap-space-2xs px-space-xs py-space-2xs rounded bg-secondary/15 text-secondary font-label-sm text-label-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Live Production Index
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Deep Chunk Inspection • Groq Hybrid Dense + BM25 Retrieval Engine
              </span>
            </div>
          </div>

          {/* Policy Switcher & Operational Meta */}
          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="flex flex-col items-end mr-space-sm">
              <span className="font-label-sm text-label-sm text-outline">Index Last Refreshed</span>
              <span className="font-code-sm text-code-sm text-on-surface font-semibold">
                Feb 24, 2025 • 03:14:08 UTC
              </span>
            </div>
            <div className="relative inline-block">
              <select
                value={selectedPolicy}
                onChange={(e) => {
                  setSelectedPolicy(e.target.value);
                  onShowToast(`Switched active policy to ${e.target.value}`);
                }}
                className="appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md pl-space-md pr-9 py-space-sm rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-surface-container"
              >
                <option value="CMM-601">CMM-601: Anterior Cervical Discectomy &amp; Fusion (ACDF)</option>
                <option value="CMM-402">CMM-402: Total Hip / Knee Arthroplasty (THA/TKA)</option>
                <option value="CMM-815">CMM-815: Lumbar Spinal Fusion (PLIF/TLIF/ALIF)</option>
                <option value="CMM-320">CMM-320: Percutaneous Coronary Intervention (PCI)</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
            <button
              onClick={handleReindex}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-space-xs transition-colors shadow-sm border border-surface-container"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Re-Index</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
          <div className="flex-1 min-w-[280px] max-w-2xl relative">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by clinical keywords (e.g. 'adjacent disc'), CPT codes (22551, 63075), or chunk ID..."
              className="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm pl-10 pr-space-md py-space-sm rounded-lg shadow-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container"
            />
            <span className="absolute right-space-sm top-1/2 -translate-y-1/2 px-space-xs py-space-2xs bg-surface-container text-on-surface-variant font-code-sm text-code-sm rounded">
              /
            </span>
          </div>

          {/* Filter Badges & Payer Selectors */}
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="font-label-sm text-label-sm text-outline mr-space-xs uppercase tracking-wider font-semibold">
              Payer Scope:
            </span>
            {[
              { id: 'all', label: 'All Payers' },
              { id: 'cms', label: 'CMS NCD/LCD' },
              { id: 'uhc', label: 'UHC Commercial' },
              { id: 'aetna', label: 'Aetna' },
              { id: 'cigna', label: 'Cigna' },
            ].map((scope) => (
              <button
                key={scope.id}
                onClick={() => setPayerScope(scope.id)}
                className={`px-space-sm py-space-2xs rounded-full font-label-sm text-label-sm font-medium transition-all shadow-sm ${
                  payerScope === scope.id
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant border border-surface-container'
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Canvas: Left TOC Tree & Right Deep Chunk Inspector */}
      <div className="px-gutter-lg py-space-lg grid grid-cols-12 gap-space-lg items-start">
        {/* LEFT PANE: 4 of 12 Columns - Multi-Document TOC Tree */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-space-md">
          {/* Section TOC Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm border border-surface-container">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  TOC Chunk Hierarchy
                </span>
              </div>
              <span className="font-code-sm text-code-sm px-space-xs py-space-2xs bg-surface-container text-on-surface-variant rounded">
                48 Chunks • 6 Sections
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Hierarchical structure parsed by RAG recursive chunker (512-token target, 64-token stride overlap).
            </p>

            {/* TOC Node List */}
            <div className="flex flex-col gap-space-xs mt-space-xs">
              {/* Node 1 */}
              <div
                onClick={() => {
                  setActiveSection('S1.0');
                  onShowToast('Focused Section S1.0 Scope & Coding Hierarchy');
                }}
                className={`p-space-sm rounded-lg transition-colors cursor-pointer flex flex-col gap-space-2xs ${
                  activeSection === 'S1.0' ? 'bg-primary-container/10 border border-primary/20' : 'bg-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      S1.0 Scope &amp; Coding Hierarchy
                    </span>
                  </div>
                  <span className="px-space-xs py-space-2xs bg-surface-container text-on-surface-variant font-code-sm text-code-sm rounded">
                    CPT 22551, 22554
                  </span>
                </div>
                <div className="flex items-center gap-space-sm pl-6">
                  <span className="font-label-sm text-label-sm text-outline">3 chunks</span>
                  <span className="font-label-sm text-label-sm text-outline">•</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">Dense Indexed</span>
                </div>
              </div>

              {/* Node 2 */}
              <div
                onClick={() => {
                  setActiveSection('S6.0');
                  onShowToast('Focused Section S6.0 Primary Indications');
                }}
                className={`p-space-sm rounded-lg transition-colors cursor-pointer flex flex-col gap-space-2xs ${
                  activeSection === 'S6.0' ? 'bg-primary-container/10 border border-primary/20' : 'bg-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      S6.0 Primary Indications
                    </span>
                  </div>
                  <span className="px-space-xs py-space-2xs bg-surface-container-high text-primary font-code-sm text-code-sm rounded">
                    6 criteria
                  </span>
                </div>
                <div className="flex items-center gap-space-sm pl-6">
                  <span className="font-label-sm text-label-sm text-outline">8 chunks</span>
                  <span className="font-label-sm text-label-sm text-outline">•</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">Dense + Sparse</span>
                </div>
              </div>

              {/* Node 3: Active Branch S12.0 */}
              <div className="p-space-sm rounded-lg bg-primary-container/10 border border-primary/20 flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">expand_more</span>
                    <span className="font-label-md text-label-md text-primary font-bold">
                      S12.0 Adjacent Segment Disease
                    </span>
                  </div>
                  <span className="px-space-xs py-space-2xs bg-primary text-on-primary font-code-sm text-code-sm rounded font-bold">
                    Active Branch
                  </span>
                </div>
                <div className="flex items-center gap-space-sm pl-6">
                  <span className="font-label-sm text-label-sm text-primary font-medium">8 Chunks Total</span>
                  <span className="font-label-sm text-label-sm text-outline">•</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">bge-large-en-v1.5</span>
                </div>

                {/* Subtree */}
                <div className="flex flex-col gap-space-2xs pl-4 pt-space-xs">
                  {/* S12.1.1 Selected */}
                  <div
                    onClick={() => setActiveSection('S12.1.1')}
                    className={`p-space-sm rounded-lg shadow-sm flex flex-col gap-space-2xs cursor-pointer border ${
                      activeSection === 'S12.1.1'
                        ? 'bg-surface-container-lowest border-primary'
                        : 'bg-surface hover:bg-surface-container border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          S12.1.1 Radiculopathy Specifics
                        </span>
                      </div>
                      <span className="px-space-xs py-space-2xs bg-secondary/15 text-secondary font-code-sm text-code-sm font-bold rounded">
                        Top RRF Match
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-outline pl-3 font-label-sm text-label-sm">
                      <span>5 chunks • 2 citations</span>
                      <span className="font-code-sm text-code-sm text-primary font-semibold">RRF 0.941</span>
                    </div>
                  </div>

                  {/* S12.1.2 */}
                  <div
                    onClick={() => {
                      setActiveSection('S12.1.2');
                      onShowToast('Switched to S12.1.2 Myelopathy Exceptions');
                    }}
                    className={`p-space-sm rounded-lg transition-colors cursor-pointer flex flex-col gap-space-2xs border ${
                      activeSection === 'S12.1.2'
                        ? 'bg-surface-container-lowest border-primary'
                        : 'hover:bg-surface-container border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                        <span className="font-label-md text-label-md text-on-surface">
                          S12.1.2 Myelopathy Exceptions
                        </span>
                      </div>
                      <span className="px-space-xs py-space-2xs bg-surface-container text-on-surface-variant font-code-sm text-code-sm rounded">
                        3 chunks
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-outline pl-3 font-label-sm text-label-sm">
                      <span>1 exception rule</span>
                      <span className="font-code-sm text-code-sm">RRF 0.612</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Node 4 */}
              <div
                onClick={() => {
                  setActiveSection('S18.0');
                  onShowToast('Focused Section S18.0 Contraindications & Exclusions');
                }}
                className={`p-space-sm rounded-lg transition-colors cursor-pointer flex flex-col gap-space-2xs ${
                  activeSection === 'S18.0' ? 'bg-primary-container/10 border border-primary/20' : 'bg-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      S18.0 Contraindications &amp; Exclusions
                    </span>
                  </div>
                  <span className="px-space-xs py-space-2xs bg-error-container text-on-error-container font-code-sm text-code-sm font-medium rounded">
                    7 items
                  </span>
                </div>
                <div className="flex items-center gap-space-sm pl-6">
                  <span className="font-label-sm text-label-sm text-outline">12 chunks</span>
                  <span className="font-label-sm text-label-sm text-outline">•</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">Dense + Sparse</span>
                </div>
              </div>

              {/* Node 5 */}
              <div
                onClick={() => {
                  setActiveSection('S24.0');
                  onShowToast('Focused Section S24.0 Documentation Checklist');
                }}
                className={`p-space-sm rounded-lg transition-colors cursor-pointer flex flex-col gap-space-2xs ${
                  activeSection === 'S24.0' ? 'bg-primary-container/10 border border-primary/20' : 'bg-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      S24.0 Documentation Checklist
                    </span>
                  </div>
                  <span className="px-space-xs py-space-2xs bg-surface-container-high text-primary font-code-sm text-code-sm font-medium rounded">
                    4 items
                  </span>
                </div>
                <div className="flex items-center gap-space-sm pl-6">
                  <span className="font-label-sm text-label-sm text-outline">6 chunks</span>
                  <span className="font-label-sm text-label-sm text-outline">•</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">Complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Embedding Space & Vector Density Visual Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">
                Vector Space Metrics
              </span>
              <span className="font-code-sm text-code-sm px-space-xs py-space-2xs bg-surface-container text-primary font-bold rounded">
                1,024 Dim
              </span>
            </div>
            {/* Inline SVG Gauge */}
            <div className="flex items-center gap-space-md py-space-xs">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-highest stroke-current"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary stroke-current"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeDasharray="94.1, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-code-sm text-code-sm font-bold text-on-surface">
                  94.1%
                </div>
              </div>
              <div className="flex flex-col gap-space-2xs min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface font-bold">
                  RRF Coherence Score
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Sparse BM25 + Dense BGE alignment high confidence.
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
              <div className="p-space-xs bg-surface-container-low rounded flex flex-col">
                <span className="font-label-sm text-label-sm text-outline">Mean Token Stride</span>
                <span className="font-code-sm text-code-sm text-on-surface font-semibold">64 tokens</span>
              </div>
              <div className="p-space-xs bg-surface-container-low rounded flex flex-col">
                <span className="font-label-sm text-label-sm text-outline">Quantization</span>
                <span className="font-code-sm text-code-sm text-on-surface font-semibold">FP16 Scaled</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: 8 of 12 Columns - Deep Policy Chunk Inspector */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-space-lg">
          {/* Primary Active Chunk Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-surface-container">
            {/* Breadcrumb & Top Inspector Actions */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-xs">
              <div className="flex items-center gap-space-xs flex-wrap font-label-sm text-label-sm">
                <span className="text-outline">CMM-601</span>
                <span className="text-outline">/</span>
                <span className="text-outline">Section 12.0 Adjacent Segment</span>
                <span className="text-outline">/</span>
                <span className="text-primary font-bold">Section 12.1.1</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => setShowSandbox(true)}
                  className="px-space-sm py-space-xs rounded-lg bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold flex items-center gap-space-xs hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                  <span>Test Vector Query</span>
                </button>
                <button
                  onClick={() => onShowToast('Chunk flagged for clinical policy committee review')}
                  className="px-space-sm py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-space-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  <span>Flag Chunk</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(
                        {
                          chunk_id: 'CMM-601-S12-CHK-04',
                          section: '12.1.1',
                          title: 'Adjacent Segment Disease - Radiculopathy Sub-criteria',
                          rrf_score: 0.941,
                        },
                        null,
                        2
                      )
                    );
                    onShowToast('Chunk JSON copied to clipboard');
                  }}
                  className="p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                  title="Export JSON"
                >
                  <span className="material-symbols-outlined text-[18px]">data_object</span>
                </button>
              </div>
            </div>

            {/* Section Title */}
            <div className="flex flex-col gap-space-2xs">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  Section 12.1.1: Adjacent Segment Disease - Radiculopathy Sub-criteria
                </span>
                <span className="px-space-xs py-space-2xs bg-secondary-fixed text-on-secondary-container rounded font-label-sm text-label-sm font-semibold">
                  Strict Rule
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                CPT Anchor: 22551 (Cervical Fusion, Anterior), 22552 (Each Additional), 63075 (Discectomy Cervical)
              </span>
            </div>

            {/* Grounded Policy Text */}
            <div className="p-space-lg bg-surface-container-low rounded-xl flex flex-col gap-space-md border border-surface-container">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-bold">
                  Grounded Policy Text (Parsed Chunk #04)
                </span>
                <div className="flex items-center gap-space-sm font-label-sm text-label-sm flex-wrap">
                  <span className="flex items-center gap-space-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Clinical Timeline
                  </span>
                  <span className="flex items-center gap-space-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Conservative Mandate
                  </span>
                  <span className="flex items-center gap-space-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span> Lab Prerequisite
                  </span>
                </div>
              </div>

              {/* Clause Text with semantic entity badges */}
              <div className="font-body-lg text-body-lg text-on-surface leading-relaxed flex flex-col gap-space-sm">
                <p>
                  Re-operation or adjacent level cervical fusion is considered{' '}
                  <strong className="font-bold text-on-surface">medically necessary</strong> only when progressive symptomatic
                  radiculopathy or persistent myelopathy is documented at a segment immediately superior or inferior to a
                  previous fusion site. Patient symptoms must have persisted for a minimum of{' '}
                  <span className="px-space-xs py-space-2xs rounded bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm font-semibold inline-flex items-center gap-space-2xs">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> [Duration &gt;= 6 months]
                  </span>{' '}
                  following index surgical stabilization, substantiated by clinical neurological exam findings demonstrating
                  corresponding dermatomal sensory deficit or myotomal motor deficit (grade ≤ 4/5).
                </p>
                <p>
                  In addition to neurological verification, candidates must provide documented failure of a consecutive course of
                  structured non-operative treatment spanning{' '}
                  <span className="px-space-xs py-space-2xs rounded bg-secondary-fixed text-on-secondary-container font-code-sm text-code-sm font-semibold inline-flex items-center gap-space-2xs">
                    <span className="material-symbols-outlined text-[14px]">physical_therapy</span> [Conservative Care &gt;= 6 weeks]
                  </span>{' '}
                  including physical therapy, cervical traction, or guided epidural steroid injections within the preceding 12
                  months. Active nicotine use is an absolute temporary disqualifier; an{' '}
                  <span className="px-space-xs py-space-2xs rounded bg-tertiary-fixed text-on-tertiary-fixed font-code-sm text-code-sm font-semibold inline-flex items-center gap-space-2xs">
                    <span className="material-symbols-outlined text-[14px]">science</span> [Objective Cotinine Test &lt; 5 ng/mL]
                  </span>{' '}
                  must be administered and archived within 30 days prior to authorization submission.
                </p>
              </div>
            </div>

            {/* Hybrid Retrieval Breakdown Card */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  Hybrid RAG Retrieval Breakdown
                </span>
                <span className="font-code-sm text-code-sm text-on-surface-variant">
                  Llama-3.3 70B Grounding Confidence
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Dense Cosine */}
                <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs shadow-sm border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline font-semibold">Dense Vector (Cosine)</span>
                    <span className="material-symbols-outlined text-primary text-[18px]">hub</span>
                  </div>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-xl text-headline-xl text-primary font-bold">0.892</span>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">Top 0.5%</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Model: <code className="font-code-sm text-code-sm text-on-surface">bge-large-en-v1.5</code>
                  </span>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-2xs overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '89.2%' }}></div>
                  </div>
                </div>

                {/* BM25 */}
                <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs shadow-sm border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline font-semibold">BM25 Sparse Score</span>
                    <span className="material-symbols-outlined text-secondary text-[18px]">match_word</span>
                  </div>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-xl text-headline-xl text-secondary font-bold">14.82</span>
                    <span className="font-label-sm text-label-sm text-outline">/ 18.0 max</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Key Tokens: <span className="font-code-sm text-code-sm text-on-surface font-semibold">"adjacent", "radiculopathy"</span>
                  </span>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-2xs overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '82.3%' }}></div>
                  </div>
                </div>

                {/* Combined RRF */}
                <div className="p-space-md bg-surface-container rounded-xl flex flex-col gap-space-xs shadow-sm border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-primary font-bold">RRF Combined Score</span>
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  </div>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-xl text-headline-xl text-on-surface font-bold">0.941</span>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">Optimal Rank #1</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    K-Constant: 60 • Weight: Dense 0.7 / BM25 0.3
                  </span>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-space-2xs overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '94.1%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Citation & Evidence Mapping */}
            <div className="flex flex-col gap-space-sm pt-space-xs">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                Clinical Citation &amp; Evidence Mapping
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Citation 1 */}
                <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs shadow-sm hover:shadow-md transition-shadow border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="px-space-xs py-space-2xs rounded bg-surface-container text-primary font-code-sm text-code-sm font-bold">
                      CMS NCD 150.10
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">Mandatory Coverage Rule</span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Medicare National Coverage Determination for Spinal Cervical Fusion
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    Requires verification of failed non-operative therapies prior to revision procedures at adjacent spinal vertebral junctures.
                  </p>
                  <div className="flex items-center justify-between pt-space-2xs">
                    <span className="font-label-sm text-label-sm text-secondary font-medium flex items-center gap-space-2xs">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Harmonized 100%
                    </span>
                    <button
                      onClick={() => onShowToast('Opening CMS NCD 150.10 statutory reference')}
                      className="font-label-sm text-label-sm text-primary font-semibold hover:underline flex items-center gap-space-2xs"
                    >
                      Inspect Rule <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
                  </div>
                </div>

                {/* Citation 2 */}
                <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs shadow-sm hover:shadow-md transition-shadow border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="px-space-xs py-space-2xs rounded bg-surface-container text-primary font-code-sm text-code-sm font-bold">
                      NASS / AAOS 2024
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">Clinical Guideline Practice</span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    North American Spine Society Adjacent Segment Cervical Arthrodesis Standards
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    Recommends objective nicotine testing and 6 weeks active physiotherapy before considering revision instrumentation.
                  </p>
                  <div className="flex items-center justify-between pt-space-2xs">
                    <span className="font-label-sm text-label-sm text-secondary font-medium flex items-center gap-space-2xs">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Evidence Grade A
                    </span>
                    <button
                      onClick={() => onShowToast('Opening NASS/AAOS 2024 Evidence Dossier')}
                      className="font-label-sm text-label-sm text-primary font-semibold hover:underline flex items-center gap-space-2xs"
                    >
                      Inspect Guideline <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chunk Vector Metadata Accordion */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <div
                onClick={() => setIsMetadataExpanded(!isMetadataExpanded)}
                className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg cursor-pointer select-none border border-surface-container-high/60"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Chunk Vector Metadata &amp; Cryptographic Traceability
                  </span>
                  <span className="font-code-sm text-code-sm px-space-xs py-space-2xs bg-surface-container-lowest text-outline rounded">
                    #CMM-601-S12-CHK-04
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                    isMetadataExpanded ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </div>

              {isMetadataExpanded && (
                <div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-space-sm animate-in fade-in">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-outline">Character Span</span>
                      <span className="font-code-sm text-code-sm text-on-surface font-semibold">
                        14,208 — 15,480 (1,272 chars)
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-outline">Token Count</span>
                      <span className="font-code-sm text-code-sm text-on-surface font-semibold">312 tokens</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-outline">Parser Strategy</span>
                      <span className="font-code-sm text-code-sm text-on-surface font-semibold">
                        RecursiveMarkdownSplitter
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-outline">Llama-3.3 Status</span>
                      <span className="font-code-sm text-code-sm text-secondary font-bold">
                        Verified Zero Hallucination
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-space-2xs pt-space-xs">
                    <span className="font-label-sm text-label-sm text-outline">SHA-256 Checksum</span>
                    <div className="p-space-xs bg-surface-container-lowest rounded font-code-sm text-code-sm text-on-surface-variant truncate select-all border border-surface-container">
                      e8f902ac79b8a1c97a47ef0342918bbce72c845b91d24590390a88bf0a4e70ef
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Vector Similarity Simulation Sandbox */}
          {showSandbox && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-surface-container animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">science</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">
                    Live Semantic Query Projection
                  </span>
                </div>
                <button
                  onClick={() => setShowSandbox(false)}
                  className="text-outline hover:text-on-surface p-space-2xs rounded"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Simulating live cosine projection against the vector database using current Clinical Reviewer prompt parameters.
              </p>
              <div className="flex flex-col gap-space-xs">
                <input
                  type="text"
                  value={sandboxQuery}
                  onChange={(e) => setSandboxQuery(e.target.value)}
                  className="p-space-sm bg-surface-container-low rounded-lg text-body-sm font-body-sm text-on-surface outline-none focus:ring-1 focus:ring-primary border border-surface-container"
                />
                <div className="flex items-center justify-between font-label-sm text-label-sm pt-1">
                  <span className="text-on-surface font-semibold">Semantic Match Score:</span>
                  <span className="text-secondary font-bold font-code-sm text-code-sm">Top Match: 96.8% Similarity</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '96.8%' }}></div>
                </div>
              </div>
              <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
                <span className="font-code-sm text-code-sm text-on-surface font-medium">
                  Target Section: S12.1.1 (Chunk-04)
                </span>
                <span className="px-space-xs py-space-2xs bg-secondary/15 text-secondary font-label-sm text-label-sm font-semibold rounded">
                  Prior Auth Auto-Satisfied
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
