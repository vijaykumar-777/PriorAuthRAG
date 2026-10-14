import React, { useState, useEffect, useRef } from 'react';

export interface ClinicalResultData {
  'Prior auth required'?: string;
  'Policy Name'?: string;
  'Referred Sections'?: string[];
  'Medical necessity indications'?: Array<{
    'Guideline Category'?: string;
    'Required findings'?: string[];
    Source?: string;
  }>;
  'Non-Indications'?: string[];
  'Important criteria & exceptions'?: string[];
  'Documentation required'?: string[];
  Notice?: string;
}

export interface QueryResponsePayload {
  success: boolean;
  query: string;
  elapsed_seconds?: number;
  data: ClinicalResultData;
  metadata?: {
    timestamp?: string;
    engine?: string;
    embedding_engine?: string;
    elapsed_seconds?: number;
    prior_auth_status?: string;
    policy_name?: string;
  };
}

interface MinimalDecisionEngineProps {
  onShowToast: (msg: string, icon?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const SAMPLE_QUERIES = [
  'When is adjacent segment disease considered medically necessary',
  'Is CPT 22551 prior auth required?',
  'What are the non-indications for lumbar fusion?',
  'Conservative management requirements for anterior cervical discectomy',
  'Precertification requirements for knee surgery CPT 29881',
];

const STAGES = [
  { id: 1, label: 'CPT Master Table & Intent Check', desc: 'Precertification lookup & rule screening' },
  { id: 2, label: 'Multi-Document TOC Routing', desc: 'Ontology traversal to target policy section' },
  { id: 3, label: 'Scoped Hybrid Retrieval', desc: 'BM25 lexical + Ollama dense vector search' },
  { id: 4, label: 'Clinical LLM Synthesis', desc: 'Groq Qwen 3.8-27b structured JSON extraction' },
];

export const MinimalDecisionEngine: React.FC<MinimalDecisionEngineProps> = ({ onShowToast }) => {
  const [query, setQuery] = useState('When is adjacent segment disease considered medically necessary');
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTimer, setElapsedTimer] = useState(0);
  const [activeTab, setActiveTab] = useState<'indications' | 'non-indications' | 'documentation' | 'exceptions' | 'json'>('indications');
  const [result, setResult] = useState<QueryResponsePayload | null>(null);
  const [checkedFindings, setCheckedFindings] = useState<Record<string, boolean>>({});
  const [filterKeyword, setFilterKeyword] = useState('');
  const [recentQueries, setRecentQueries] = useState<Array<{ filename: string; query: string; policy_name: string; prior_auth: string; data: any }>>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch recent queries from backend history
  useEffect(() => {
    fetch('/api/history?limit=8')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.history) {
          const formatted = data.history.map((h: any) => {
            const cleanQuery = h.filename
              .replace(/^\d+_\d+_/, '')
              .replace(/\.json$/, '')
              .replace(/_/g, ' ');
            return {
              filename: h.filename,
              query: cleanQuery,
              policy_name: h.policy_name,
              prior_auth: h.prior_auth_required,
              data: h.data,
            };
          });
          setRecentQueries(formatted);
        }
      })
      .catch((err) => console.log('Could not load history', err));
  }, []);

  // Timer effect while loading
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setElapsedTimer(0);
      interval = setInterval(() => {
        setElapsedTimer((prev) => +(prev + 0.1).toFixed(1));
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Global Keyboard Shortcuts (P1: Power-User Acceleration)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea';

      // "/" focuses search input
      if (e.key === '/' && !isInputActive) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }

      // "Esc" blurs search input
      if (e.key === 'Escape' && isInputActive) {
        inputRef.current?.blur();
        return;
      }

      // "Ctrl+Enter" or "Cmd+Enter" runs evaluation
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isLoading) {
          handleRunQuery();
        }
        return;
      }

      // "1" - "5" switch tabs when not typing
      if (!isInputActive && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === '1') setActiveTab('indications');
        if (e.key === '2') setActiveTab('non-indications');
        if (e.key === '3') setActiveTab('documentation');
        if (e.key === '4') setActiveTab('exceptions');
        if (e.key === '5') setActiveTab('json');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, query]);

  const handleRunQuery = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : query).trim();
    if (!q) {
      onShowToast('Please enter a clinical question or CPT code', 'warning', 'warning');
      return;
    }
    if (queryText !== undefined) {
      setQuery(queryText);
    }

    setIsLoading(true);
    setCheckedFindings({});
    setFilterKeyword('');

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const payload: QueryResponsePayload = await response.json();
      setResult(payload);
      onShowToast(`Evaluated in ${payload.elapsed_seconds || 0}s`, 'check_circle', 'success');

      // Refresh history list
      fetch('/api/history?limit=8')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.history) {
            const formatted = data.history.map((h: any) => ({
              filename: h.filename,
              query: h.filename.replace(/^\d+_\d+_/, '').replace(/\.json$/, '').replace(/_/g, ' '),
              policy_name: h.policy_name,
              prior_auth: h.prior_auth_required,
              data: h.data,
            }));
            setRecentQueries(formatted);
          }
        })
        .catch(() => {});
    } catch (err: any) {
      onShowToast(`Evaluation failed: ${err.message}`, 'error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: any) => {
    setQuery(item.query);
    setResult({
      success: true,
      query: item.query,
      data: item.data,
      metadata: {
        timestamp: new Date().toISOString(),
        engine: 'groq:qwen/qwen3.8-27b',
        prior_auth_status: item.prior_auth,
        policy_name: item.policy_name,
      },
    });
    setCheckedFindings({});
    setFilterKeyword('');
    onShowToast(`Loaded query: "${item.query.slice(0, 35)}..."`, 'history', 'info');
  };

  const toggleFinding = (key: string) => {
    setCheckedFindings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine current active pipeline stage based on elapsed time (P1: Progressive Stepper)
  const getCurrentStageId = (seconds: number) => {
    if (seconds < 2.5) return 1;
    if (seconds < 7.5) return 2;
    if (seconds < 16.0) return 3;
    return 4;
  };
  const currentStageId = getCurrentStageId(elapsedTimer);

  const data = result?.data;
  const paStatus = (data?.['Prior auth required'] || 'Yes').toUpperCase();
  const policyName = data?.['Policy Name'] || 'None Identified';
  const referredSections = data?.['Referred Sections'] || [];
  const rawIndications = data?.['Medical necessity indications'] || [];
  const nonIndications = data?.['Non-Indications'] || [];
  const requiredDocs = data?.['Documentation required'] || [];
  const exceptions = data?.['Important criteria & exceptions'] || [];

  const isPaRequired = paStatus.includes('YES') || paStatus.includes('REQUIRED');
  const isPaNotRequired = paStatus.includes('NO') || paStatus.includes('ROUTINE');

  // Filter indications by search keyword (P2: In-Page Filter)
  const filteredIndications = rawIndications
    .map((cat) => {
      if (!filterKeyword.trim()) return cat;
      const kw = filterKeyword.toLowerCase();
      const catMatches = (cat['Guideline Category'] || '').toLowerCase().includes(kw);
      const matchingFindings = (cat['Required findings'] || []).filter((f) => f.toLowerCase().includes(kw));
      if (catMatches) return cat;
      if (matchingFindings.length > 0) {
        return { ...cat, 'Required findings': matchingFindings };
      }
      return null;
    })
    .filter(Boolean) as typeof rawIndications;

  // Format & Copy Clinical Review Note for EHR (P2: Clinical Export)
  const handleCopyClinicalNote = () => {
    if (!result) return;
    const timestamp = new Date().toLocaleString();
    let note = `======================================================================\n`;
    note += `PRIOR AUTHORIZATION CLINICAL REVIEW DETERMINATION\n`;
    note += `======================================================================\n`;
    note += `Date / Time         : ${timestamp}\n`;
    note += `Inquiry / Procedure : ${result.query}\n`;
    note += `Governing Policy    : ${policyName}\n`;
    note += `Determination       : ${isPaRequired ? 'PRIOR AUTHORIZATION REQUIRED' : isPaNotRequired ? 'NO PRIOR AUTHORIZATION REQUIRED' : paStatus}\n`;
    if (referredSections.length > 0) {
      note += `Cited Policy Sections: ${referredSections.join(', ')}\n`;
    }
    note += `\nCLINICAL INDICATION FINDINGS & CHART VERIFICATION:\n`;

    rawIndications.forEach((cat, cIdx) => {
      note += `\n[ ${cat['Guideline Category'] || 'Indication'} ]\n`;
      (cat['Required findings'] || []).forEach((f, fIdx) => {
        const key = `ind-${cIdx}-${fIdx}`;
        const checked = checkedFindings[key];
        note += `  ${checked ? '[X] MET    :' : '[ ] PENDING:'} ${f}\n`;
      });
    });

    if (requiredDocs.length > 0) {
      note += `\nREQUIRED DOCUMENTATION FOR SUBMISSION:\n`;
      requiredDocs.forEach((doc, idx) => {
        const key = `doc-${idx}`;
        const checked = checkedFindings[key];
        note += `  ${checked ? '[X] VERIFIED:' : '[ ] REQUIRED:'} ${doc}\n`;
      });
    }

    if (nonIndications.length > 0) {
      note += `\nEXCLUSIONS & NON-INDICATIONS TO RULE OUT:\n`;
      nonIndications.forEach((ni) => {
        note += `  • ${ni}\n`;
      });
    }

    note += `\n======================================================================\n`;
    note += `Generated by PriorAuth RAG Clinical Decision Support Engine\n`;
    note += `Inference Model: Groq Qwen-3.8-27b | Embeddings: Ollama Gemma-300M\n`;
    note += `======================================================================\n`;

    navigator.clipboard.writeText(note);
    onShowToast('Clinical review note copied for Epic/Cerner chart pasting', 'assignment_turned_in', 'success');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col space-y-8">
      {/* Search Bar & Prompt Card - Bolder Clinical Command Center */}
      {/* Search Bar & Prompt Card - Refined & Calm Clinical Engine */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xs p-6 sm:p-8 flex flex-col space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
              Prior Authorization Clinical Decision Engine
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Ask clinical indications, contraindications, or inquire by CPT code. Grounded in Cigna, UHC &amp; CMS policies.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-container/40 text-on-secondary-fixed-variant border border-secondary/20">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Hierarchical RAG Online
            </span>
          </div>
        </div>

        {/* Input box with shortcut indicators */}
        <div className="relative flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && !e.ctrlKey && !e.metaKey && handleRunQuery()}
              placeholder="e.g., When is adjacent segment disease considered medically necessary"
              className="w-full px-4 py-3 pl-11 pr-16 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm sm:text-base placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-outline text-[20px]">
              search
            </span>
            <span className="hidden sm:inline-block absolute right-3.5 top-3.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-surface-container-high text-outline rounded border border-surface-container-highest">
              /
            </span>
          </div>
          <button
            onClick={() => handleRunQuery()}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-xs sm:text-sm hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Evaluating ({elapsedTimer}s)...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Run Decision Pipeline</span>
                <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-white/20 rounded">
                  Ctrl+↵
                </span>
              </>
            )}
          </button>
        </div>

        {/* Quick Example Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
          <span className="text-outline font-medium">Examples:</span>
          {SAMPLE_QUERIES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleRunQuery(sample)}
              disabled={isLoading}
              className="px-3 py-1 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-surface-container-high transition-colors text-left text-xs cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Progressive 4-Stage Pipeline Stepper (P1 Feature) */}
      {isLoading && (
        <div className="bg-surface-container-lowest rounded-2xl border border-primary/20 shadow-xs p-6 sm:p-8 flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">Hierarchical RAG Execution in Progress</h3>
                <p className="text-xs text-on-surface-variant">Live traversal across medical policies &amp; ontology nodes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-outline font-medium">Pipeline Clock:</span>
              <span className="text-sm font-mono px-3 py-1 rounded-lg bg-surface-container-high text-primary font-bold">
                {elapsedTimer}s
              </span>
            </div>
          </div>

          {/* Stepper nodes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STAGES.map((stg) => {
              const isPast = stg.id < currentStageId;
              const isCurrent = stg.id === currentStageId;
              const isUpcoming = stg.id > currentStageId;

              return (
                <div
                  key={stg.id}
                  className={`p-4 rounded-xl border flex flex-col space-y-2 transition-all ${
                    isCurrent
                      ? 'bg-primary-fixed/20 border-primary ring-2 ring-primary/20 shadow-xs'
                      : isPast
                      ? 'bg-secondary-fixed/20 border-secondary/40'
                      : 'bg-surface-container-low border-surface-container-high opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-primary text-white animate-pulse'
                          : isPast
                          ? 'bg-secondary text-white'
                          : 'bg-surface-container-high text-outline'
                      }`}
                    >
                      {isPast ? '✓' : stg.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isCurrent ? 'text-primary' : isPast ? 'text-secondary' : 'text-outline'
                      }`}
                    >
                      {isCurrent ? 'Processing...' : isPast ? 'Complete' : 'Queued'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{stg.label}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">{stg.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Section */}
      {!isLoading && result && (
        <div className="flex flex-col space-y-6 animate-fadeIn">
          {/* Determination Card */}
          <div className="bg-surface-container-lowest rounded-3xl border-2 border-surface-container shadow-sm p-6 sm:p-8 flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-container">
              <div className="flex flex-col space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">
                  Coverage Determination Verdict
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-black tracking-wide uppercase inline-flex items-center gap-2.5 shadow-xs ${
                      isPaRequired
                        ? 'bg-amber-100/90 text-amber-950 border-2 border-amber-500'
                        : isPaNotRequired
                        ? 'bg-emerald-100/90 text-emerald-950 border-2 border-emerald-500'
                        : 'bg-blue-100/90 text-blue-950 border-2 border-blue-500'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isPaRequired ? 'bg-amber-600 animate-pulse' : isPaNotRequired ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}
                    />
                    {isPaRequired
                      ? 'Prior Authorization Required'
                      : isPaNotRequired
                      ? 'No Prior Auth Required'
                      : paStatus}
                  </span>
                  <span className="text-xs text-outline font-mono font-medium">
                    {result.elapsed_seconds ? `Engine Latency: ${result.elapsed_seconds}s` : ''}
                  </span>
                </div>
              </div>

              {/* Actions & Policy Pill */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs text-on-surface bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container-high shadow-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">menu_book</span>
                  <span className="font-bold text-on-surface max-w-[280px] truncate">{policyName}</span>
                </div>

                {/* Copy Clinical Review Note Button (P2 Feature) */}
                <button
                  onClick={handleCopyClinicalNote}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  title="Generate formatted clinical justification note for EHR / patient chart"
                >
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                  <span>Copy Clinical Review Note</span>
                </button>
              </div>
            </div>

            {/* Referred Sections */}
            {referredSections.length > 0 && (
              <div className="flex flex-col space-y-2">
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                  Cited Policy Sections
                </span>
                <div className="flex flex-wrap gap-2">
                  {referredSections.map((sec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-surface-container-high/60 text-on-surface text-xs font-medium border border-surface-container-highest inline-flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[14px] text-primary">bookmark</span>
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notice if any */}
            {data?.Notice && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[20px] text-blue-700 shrink-0">info</span>
                  <p>{data.Notice}</p>
                </div>
              </div>
            )}

            {/* Tab Navigation with shortcut cues */}
            <div className="flex border-b border-surface-container gap-2 sm:gap-6 overflow-x-auto pt-2">
              <button
                onClick={() => setActiveTab('indications')}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'indications'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
                <span>Medical Necessity Indications ({rawIndications.length})</span>
                <span className="text-[10px] font-mono text-outline">[1]</span>
              </button>

              <button
                onClick={() => setActiveTab('non-indications')}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'non-indications'
                    ? 'border-error text-error'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">block</span>
                <span>Non-Indications &amp; Exclusions ({nonIndications.length})</span>
                <span className="text-[10px] font-mono text-outline">[2]</span>
              </button>

              <button
                onClick={() => setActiveTab('documentation')}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'documentation'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">checklist</span>
                <span>Required Documentation ({requiredDocs.length})</span>
                <span className="text-[10px] font-mono text-outline">[3]</span>
              </button>

              <button
                onClick={() => setActiveTab('exceptions')}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'exceptions'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">rule</span>
                <span>Criteria &amp; Exceptions ({exceptions.length})</span>
                <span className="text-[10px] font-mono text-outline">[4]</span>
              </button>

              <button
                onClick={() => setActiveTab('json')}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'json'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">data_object</span>
                <span>Raw JSON</span>
                <span className="text-[10px] font-mono text-outline">[5]</span>
              </button>
            </div>

            {/* Tab 1: Indications with In-Page Search Filter (P2 Feature) */}
            {activeTab === 'indications' && (
              <div className="flex flex-col space-y-4 pt-2">
                {/* Search filter input */}
                {rawIndications.length > 0 && (
                  <div className="relative">
                    <input
                      type="text"
                      value={filterKeyword}
                      onChange={(e) => setFilterKeyword(e.target.value)}
                      placeholder="Filter criteria findings by keyword (e.g., mri, radiculopathy, cotinine, 6 weeks)..."
                      className="w-full px-3.5 py-2 pl-9 rounded-xl border border-surface-container-high bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-[16px]">
                      filter_list
                    </span>
                    {filterKeyword && (
                      <button
                        onClick={() => setFilterKeyword('')}
                        className="absolute right-2.5 top-2 text-xs text-outline hover:text-on-surface cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                {filteredIndications.length === 0 ? (
                  <p className="text-sm text-outline italic py-4 text-center">
                    {filterKeyword ? `No findings match "${filterKeyword}".` : 'No explicit medical necessity indications extracted.'}
                  </p>
                ) : (
                  filteredIndications.map((cat, cIdx) => (
                    <div key={cIdx} className="bg-surface-container-low rounded-xl border border-surface-container-high p-5 flex flex-col space-y-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">check_box</span>
                          <h4 className="text-sm font-bold text-on-surface">
                            {cat['Guideline Category'] || 'Indication Criteria'}
                          </h4>
                        </div>
                        {cat.Source && (
                          <span className="text-xs text-outline font-mono px-2.5 py-1 rounded bg-surface-container-highest">
                            {cat.Source}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2.5">
                        {(cat['Required findings'] || []).map((finding, fIdx) => {
                          const key = `ind-${cIdx}-${fIdx}`;
                          const isChecked = !!checkedFindings[key];
                          return (
                            <label
                              key={fIdx}
                              onClick={() => toggleFinding(key)}
                              className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-3 cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-secondary-fixed/30 border-secondary text-on-surface font-medium'
                                  : 'bg-surface-container-lowest border-surface-container-high text-on-surface hover:border-primary/40'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer shrink-0"
                              />
                              <span className="leading-relaxed">{finding}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Non-Indications */}
            {activeTab === 'non-indications' && (
              <div className="flex flex-col space-y-3 pt-2">
                {nonIndications.length === 0 ? (
                  <p className="text-sm text-outline italic">No specific non-indications or exclusions identified.</p>
                ) : (
                  nonIndications.map((nonInd, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-error-container/20 border border-error/30 text-on-surface flex items-start gap-3 text-xs sm:text-sm"
                    >
                      <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">
                        cancel
                      </span>
                      <span className="leading-relaxed">{nonInd}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Documentation Required */}
            {activeTab === 'documentation' && (
              <div className="flex flex-col space-y-3 pt-2">
                {requiredDocs.length === 0 ? (
                  <p className="text-sm text-outline italic">No specific chart documentation checklist generated.</p>
                ) : (
                  requiredDocs.map((doc, idx) => {
                    const key = `doc-${idx}`;
                    const isChecked = !!checkedFindings[key];
                    return (
                      <label
                        key={idx}
                        onClick={() => toggleFinding(key)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-secondary-fixed/30 border-secondary text-on-surface font-medium'
                            : 'bg-surface-container-lowest border-surface-container-high text-on-surface hover:border-primary/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer shrink-0"
                        />
                        <span className="leading-relaxed">{doc}</span>
                      </label>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 4: Important Criteria & Exceptions */}
            {activeTab === 'exceptions' && (
              <div className="flex flex-col space-y-3 pt-2">
                {exceptions.length === 0 ? (
                  <p className="text-sm text-outline italic">No exceptions or special caveats listed.</p>
                ) : (
                  exceptions.map((exc, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface flex items-start gap-3 text-xs sm:text-sm"
                    >
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                        priority_high
                      </span>
                      <span className="leading-relaxed">{exc}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 5: Raw JSON */}
            {activeTab === 'json' && (
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                      onShowToast('JSON copied to clipboard', 'content_copy', 'success');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Copy JSON</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real Query History Quick-Access */}
      {recentQueries.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xs p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">history</span>
              <span>Recent Evaluations ({recentQueries.length})</span>
            </h3>
            <span className="text-xs text-outline">Click any to inspect</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentQueries.map((item, idx) => {
              const pa = (item.prior_auth || 'Yes').toUpperCase();
              const isReq = pa.includes('YES') || pa.includes('REQUIRED');
              return (
                <button
                  key={idx}
                  onClick={() => loadFromHistory(item)}
                  className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high hover:border-primary/40 text-left transition-all flex flex-col space-y-1.5 cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isReq ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {item.prior_auth}
                    </span>
                    <span className="text-[11px] text-outline font-medium truncate max-w-[200px]">
                      {item.policy_name}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {item.query}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
