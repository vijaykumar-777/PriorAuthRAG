import React, { useState } from 'react';

interface MedicalPoliciesViewProps {
  onShowToast: (msg: string, icon?: string) => void;
}

interface PolicyCard {
  id: string;
  payer: string;
  code: string;
  title: string;
  description: string;
  pages: number;
  chunks: number;
  syncPercent: number;
  reviewDate: string;
  status: 'Active' | 'Re-index Pending' | 'Statutory Baseline';
  hasDrift?: boolean;
}

const initialPolicies: PolicyCard[] = [
  {
    id: 'cigna-601',
    payer: 'Cigna',
    code: 'CMM-601',
    title: 'Cervical Spine Decompression and Fusion (ACDF)',
    description: 'Mandatory criteria for anterior cervical discectomy with anterior instrumentation. Requires documented conservative care ≥ 6 weeks unless acute myelopathy.',
    pages: 48,
    chunks: 142,
    syncPercent: 100,
    reviewDate: 'Jan 2025 Review',
    status: 'Active',
  },
  {
    id: 'uhc-0543',
    payer: 'UHC Commercial',
    code: '2024T0543',
    title: 'Lumbar Fusion & Disc Arthroplasty',
    description: 'Clinical coverage guidelines for single or multi-level lumbar arthrodesis, posterior interbody, and total disc replacement indications.',
    pages: 64,
    chunks: 198,
    syncPercent: 100,
    reviewDate: 'Dec 2024 Review',
    status: 'Active',
  },
  {
    id: 'anthem-83',
    payer: 'Anthem',
    code: 'CG-SURG-83',
    title: 'Bariatric Surgery & Metabolic Interventions',
    description: 'Roux-en-Y, sleeve gastrectomy, and revisional metabolic surgery qualification protocols. BMI thresholds with comorbidity documentation requirements.',
    pages: 32,
    chunks: 88,
    syncPercent: 100,
    reviewDate: 'Nov 2024 Review',
    status: 'Active',
  },
  {
    id: 'aetna-0325',
    payer: 'Aetna CVS',
    code: 'CPB 0325',
    title: 'Magnetic Resonance Imaging (MRI) Spine & Musculoskeletal',
    description: 'Payer bulletin update detected 2 days ago. Prior auth criteria additions for axial spondyloarthritis protocols and weight-bearing scans.',
    pages: 76,
    chunks: 230,
    syncPercent: 74,
    reviewDate: 'Payer Rev: 48h ago',
    status: 'Re-index Pending',
    hasDrift: true,
  },
  {
    id: 'cms-150',
    payer: 'Medicare CMS',
    code: 'NCD 150.10',
    title: 'Lumbar Spinal Decompression - NCD Baseline',
    description: 'National Coverage Determination establishing strict non-coverage for percutaneous laser lumbar discectomy and standardized open decompression rules.',
    pages: 18,
    chunks: 44,
    syncPercent: 100,
    reviewDate: 'Federal Register',
    status: 'Statutory Baseline',
  },
  {
    id: 'humana-098',
    payer: 'Humana',
    code: 'H-MED-098',
    title: 'Total Knee & Hip Arthroplasty (TKA/THA)',
    description: 'Inpatient vs outpatient setting criteria, Kellgren-Lawrence radiographic scoring thresholds, and structured Physical Therapy log evaluations.',
    pages: 52,
    chunks: 160,
    syncPercent: 100,
    reviewDate: 'Jan 2025 Review',
    status: 'Active',
  },
];

export const MedicalPoliciesView: React.FC<MedicalPoliciesViewProps> = ({ onShowToast }) => {
  const [policies, setPolicies] = useState<PolicyCard[]>(initialPolicies);
  const [searchQuery, setSearchQuery] = useState('');
  const [payerFilter, setPayerFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [selectedBulletin, setSelectedBulletin] = useState<'aetna' | 'uhc' | 'cigna'>('aetna');
  const [isApprovingDiff, setIsApprovingDiff] = useState(false);

  React.useEffect(() => {
    fetch('/api/policies')
      .then(res => res.json())
      .then(data => {
        if (data && data.policies && data.policies.length > 0) {
          const backendCards: PolicyCard[] = data.policies.map((p: any, idx: number) => ({
            id: p.doc_key,
            payer: 'Cigna',
            code: p.doc_key.replace('_', '-'),
            title: p.display_name,
            description: `Live Hierarchical RAG indexed policy. ${p.chunks} chunk nodes indexed for hybrid semantic + BM25 retrieval.`,
            pages: Math.ceil(p.chunks / 3) || 24,
            chunks: p.chunks,
            syncPercent: 100,
            reviewDate: 'Active Production Index',
            status: 'Active' as const,
          }));
          setPolicies(prev => {
            const keys = new Set(backendCards.map(b => b.id));
            const remaining = prev.filter(p => !keys.has(p.id));
            return [...backendCards, ...remaining];
          });
        }
      })
      .catch(err => console.log('Could not fetch backend policies', err));
  }, []);

  // New PDF Form state
  const [newPayer, setNewPayer] = useState('Cigna Healthcare');
  const [newPolicyId, setNewPolicyId] = useState('');

  const filteredPolicies = policies.filter((p) => {
    const text = `${p.title} ${p.description} ${p.code} ${p.payer}`.toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase().trim());

    let matchesPayer = true;
    if (payerFilter !== 'all') {
      const pText = p.payer.toLowerCase();
      matchesPayer = pText.includes(payerFilter.toLowerCase());
    }

    let matchesSpecialty = true;
    if (specialtyFilter !== 'all') {
      if (specialtyFilter === 'spine' && !text.includes('spine') && !text.includes('fusion') && !text.includes('decompression')) {
        matchesSpecialty = false;
      }
      if (specialtyFilter === 'bariatric' && !text.includes('bariatric') && !text.includes('metabolic')) {
        matchesSpecialty = false;
      }
      if (specialtyFilter === 'radiology' && !text.includes('mri') && !text.includes('radiology')) {
        matchesSpecialty = false;
      }
      if (specialtyFilter === 'cardio' && !text.includes('coronary') && !text.includes('cardio') && !text.includes('tavr')) {
        matchesSpecialty = false;
      }
    }

    return matchesSearch && matchesPayer && matchesSpecialty;
  });

  const handleApproveDiff = () => {
    setIsApprovingDiff(true);
    setTimeout(() => {
      setIsApprovingDiff(false);
      // update Aetna policy sync percent to 100%
      setPolicies((prev) =>
        prev.map((item) =>
          item.code === 'CPB 0325'
            ? { ...item, syncPercent: 100, status: 'Active', hasDrift: false }
            : item
        )
      );
      onShowToast('Aetna CPB 0325 embeddings updated: 230 chunks re-indexed');
    }, 1200);
  };

  const handleIngestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyId.trim()) {
      onShowToast('Please provide a policy document ID (e.g. CMM-704)', 'warning');
      return;
    }
    const newDoc: PolicyCard = {
      id: `policy-${Date.now()}`,
      payer: newPayer,
      code: newPolicyId.toUpperCase(),
      title: `${newPayer} Clinical Policy ${newPolicyId.toUpperCase()}`,
      description: 'Newly ingested clinical guidelines document. OCR segmentation and vector embeddings processing.',
      pages: 42,
      chunks: 118,
      syncPercent: 100,
      reviewDate: 'Today (Ingested)',
      status: 'Active',
    };
    setPolicies([newDoc, ...policies]);
    setIsIngestModalOpen(false);
    setNewPolicyId('');
    onShowToast(`Policy ${newDoc.code} ingested and 118 vector chunks deployed to Qdrant!`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-gutter-lg py-space-lg flex flex-col gap-space-lg max-w-[1720px] mx-auto w-full">
        {/* Top Context & Action Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-md bg-surface-container-low rounded-xl shadow-sm border border-surface-container">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">folder_managed</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Medical Policies Library &amp; Ingestion Pipeline
                </span>
                <span className="px-space-xs py-space-2xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-semibold">
                  Live Production Vector DB
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant truncate">
                Authoritative payer clinical guidelines, coverage determination memoranda, and vector index sync status.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm shrink-0 self-end lg:self-auto flex-wrap">
            <button
              onClick={() => onShowToast('Exporting 142 Policy schemas to clinical JSON-LD registry')}
              className="px-space-md py-space-sm bg-surface-container-lowest text-on-surface font-label-md text-label-md rounded-lg shadow-sm hover:bg-surface-container transition-all flex items-center gap-space-xs border border-surface-container"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export Policy Registry</span>
            </button>
            <button
              onClick={() => onShowToast('Crawler query executed: Pinecone vector indices verified with zero drift')}
              className="px-space-md py-space-sm bg-surface-container-lowest text-primary font-label-md text-label-md rounded-lg shadow-sm hover:bg-surface-container transition-all flex items-center gap-space-xs border border-surface-container"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Sync Payer Bulletins</span>
            </button>
            <button
              onClick={() => setIsIngestModalOpen(true)}
              className="px-space-md py-space-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-space-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Ingest New Payer Policy PDF</span>
            </button>
          </div>
        </div>

        {/* Pipeline Metric Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Vector Store Health
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">99.98%</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">Nominal</span>
            </div>
            <div className="mt-space-xs flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
              <span>Pinecone / Qdrant Hybrid</span>
              <span className="text-on-surface font-semibold">Latency: 14ms</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Ingested Policy PDFs
              </span>
              <span className="material-symbols-outlined text-[20px] text-primary">menu_book</span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">{policies.length + 136}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Active Documents</span>
            </div>
            <div className="mt-space-xs flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
              <span>Synced 42 mins ago</span>
              <span className="text-secondary font-semibold">32,840 Chunks</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Pending Re-Indexing
              </span>
              <span className="material-symbols-outlined text-[20px] text-tertiary">notification_important</span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-tertiary font-bold">4</span>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold">Annual Cycle Drift</span>
            </div>
            <div className="mt-space-xs flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
              <span>1 Urgent Payer Bulletin</span>
              <span
                onClick={() => onShowToast('Filtering queue for annual policy drifts')}
                className="text-tertiary underline cursor-pointer font-semibold"
              >
                Review Queue
              </span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Embedding Engine
              </span>
              <span className="px-space-2xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm font-bold">
                v4-3072d
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">Llama-3.3</span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">70B Ingest</span>
            </div>
            <div className="mt-space-xs flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
              <span>Overlap: 120 Tokens</span>
              <span className="text-secondary font-semibold">Cosine Index</span>
            </div>
          </div>
        </div>

        {/* Search, Filter & View Toggle */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container">
          <div className="flex items-center gap-space-sm flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by policy ID, keyword (e.g. ACDF, Spine, Arthroplasty)..."
                className="w-full h-10 pl-10 pr-space-md bg-surface-container-low text-on-surface rounded-lg font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-colors border border-surface-container"
              />
            </div>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            {/* Payer Filter */}
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Payer:</span>
              <select
                value={payerFilter}
                onChange={(e) => setPayerFilter(e.target.value)}
                className="h-9 px-space-sm bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg focus:outline-none cursor-pointer border border-surface-container"
              >
                <option value="all">All Payers (142)</option>
                <option value="cigna">Cigna Healthcare (34)</option>
                <option value="uhc">UnitedHealthcare (48)</option>
                <option value="anthem">Anthem / Elevance (22)</option>
                <option value="aetna">Aetna CVS Health (26)</option>
                <option value="medicare">CMS / Medicare MACs (12)</option>
              </select>
            </div>

            {/* Specialty Filter */}
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Specialty:</span>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="h-9 px-space-sm bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg focus:outline-none cursor-pointer border border-surface-container"
              >
                <option value="all">All Specialties</option>
                <option value="spine">Orthopedic / Spine Surgery</option>
                <option value="bariatric">Bariatric / Metabolic</option>
                <option value="radiology">Diagnostic Radiology &amp; MRI</option>
                <option value="cardio">Cardiovascular &amp; EP</option>
              </select>
            </div>

            {/* View Switcher */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-surface-container">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-space-xs py-1 rounded font-label-sm text-label-sm flex items-center ${
                  viewMode === 'grid'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Grid View"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-space-xs py-1 rounded font-label-sm text-label-sm flex items-center ${
                  viewMode === 'list'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="List View"
              >
                <span className="material-symbols-outlined text-[16px]">view_list</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area: Catalog & Sentinel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Left/Center: Policy Catalog Cards (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  Ingested Payer Guidelines
                </span>
                <span className="px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-code-sm">
                  Showing {filteredPolicies.length} prioritized
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Automated embeddings refreshed daily at 02:00 UTC
              </span>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {filteredPolicies.map((p) => (
                  <div
                    key={p.id}
                    className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group relative overflow-hidden border border-surface-container"
                  >
                    {p.hasDrift && (
                      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                        <div className="absolute transform rotate-45 bg-tertiary text-on-tertiary font-code-sm text-[10px] py-0.5 right-[-35px] top-[18px] w-[120px] text-center font-bold">
                          DRIFT
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="flex items-start justify-between gap-space-sm">
                        <div className="flex items-center gap-space-xs">
                          <span className="px-space-xs py-space-2xs rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase font-bold">
                            {p.payer}
                          </span>
                          <span className="font-code-sm text-code-sm text-outline">{p.code}</span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-space-xs py-0.5 rounded font-label-sm text-label-sm ${
                            p.status === 'Active'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : p.status === 'Re-index Pending'
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'Active'
                                ? 'bg-secondary'
                                : p.status === 'Re-index Pending'
                                ? 'bg-tertiary'
                                : 'bg-primary'
                            }`}
                          ></span>
                          {p.status}
                        </span>
                      </div>
                      <h3 className="mt-space-sm font-headline-md text-headline-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-space-md pt-space-sm bg-surface-container-low/50 -mx-space-md -mb-space-md px-space-md pb-space-md rounded-b-xl flex flex-col gap-space-xs border-t border-surface-container">
                      <div className="flex items-center justify-between font-code-sm text-code-sm text-on-surface-variant">
                        <span>
                          PDF Volume: <strong className="text-on-surface">{p.pages} pages</strong>
                        </span>
                        <span>
                          RAG Chunks: <strong className="text-on-surface">{p.chunks}</strong>
                        </span>
                      </div>
                      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.hasDrift ? 'bg-tertiary' : 'bg-secondary'}`}
                          style={{ width: `${p.syncPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between font-label-sm text-label-sm pt-space-2xs">
                        {p.hasDrift ? (
                          <button
                            onClick={() => {
                              onShowToast(`Triggered vector embedding re-run for ${p.code}`);
                              setPolicies((prev) =>
                                prev.map((item) =>
                                  item.id === p.id
                                    ? { ...item, syncPercent: 100, status: 'Active', hasDrift: false }
                                    : item
                                )
                              );
                            }}
                            className="text-tertiary font-semibold hover:underline flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">refresh</span>
                            Trigger Vector Embed
                          </button>
                        ) : (
                          <span className="text-secondary font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            {p.syncPercent}% Vector Synced
                          </span>
                        )}
                        <span className="text-outline">{p.reviewDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container divide-y divide-surface-container">
                {filteredPolicies.map((p) => (
                  <div key={p.id} className="p-space-md flex items-center justify-between gap-space-md hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-space-md min-w-0 flex-1">
                      <span className="px-space-xs py-1 bg-primary-fixed text-on-primary-fixed font-code-sm font-bold rounded">
                        {p.code}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                          {p.title}
                        </span>
                        <span className="text-outline text-body-sm line-clamp-1">
                          {p.payer} • {p.pages} pages • {p.chunks} RAG Chunks
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-sm">
                      <span
                        className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold ${
                          p.status === 'Active'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        }`}
                      >
                        {p.status}
                      </span>
                      <button
                        onClick={() => onShowToast(`Inspecting document details for ${p.code}`)}
                        className="px-space-sm py-1 bg-surface-container hover:bg-surface-container-high rounded font-label-sm"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ingestion Pipeline Queue Visualizer */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-space-xs font-bold">
                  <span className="material-symbols-outlined text-[18px] text-primary">data_thresholding</span>
                  Real-time Ingestion Stream &amp; OCR Vectorization Queue
                </span>
                <span className="font-code-sm text-code-sm text-secondary font-semibold">
                  Worker Node #2 Active
                </span>
              </div>
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <div className="flex items-center justify-between font-code-sm text-code-sm">
                  <span className="text-on-surface font-medium">Aetna CPB 0325 - Section 4: MRI Lumbar Re-chunking</span>
                  <span className="text-primary font-bold">172 / 230 Chunks (74%)</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '74%' }}></div>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>Embedding latency: 82ms per batch</span>
                  <span>Tokens processed: 86,412 / 115,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sentinel & Diff Preview (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md sticky top-20 border border-surface-container">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">radar</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-headline-md text-on-surface leading-tight font-semibold">
                      Policy Update Sentinel
                    </span>
                    <span className="font-label-sm text-label-sm text-tertiary font-bold">
                      3 New Q1 2025 Commercial Bulletins
                    </span>
                  </div>
                </div>
                <span className="px-space-xs py-space-2xs rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant">
                  Crawler Auto
                </span>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Automated crawler identified modifications to policy authorization clauses. Clinical review required prior to promoting into active RAG decision flow.
              </p>

              {/* Bulletin Selection Pills */}
              <div className="flex flex-col gap-space-xs">
                <div
                  onClick={() => setSelectedBulletin('aetna')}
                  className={`p-space-sm rounded-lg flex items-center justify-between cursor-pointer transition-colors border ${
                    selectedBulletin === 'aetna'
                      ? 'bg-surface-container-low border-primary/30'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-container'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      Aetna CPB 0325 (MRI Spine)
                    </span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">
                      Published: Feb 18, 2025
                    </span>
                  </div>
                  <span className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-code-sm text-code-sm font-semibold">
                    Diff Detected
                  </span>
                </div>

                <div
                  onClick={() => {
                    setSelectedBulletin('uhc');
                    onShowToast('Loaded UHC Commercial Total Joint bulletin details');
                  }}
                  className={`p-space-sm rounded-lg flex items-center justify-between cursor-pointer transition-colors border ${
                    selectedBulletin === 'uhc'
                      ? 'bg-surface-container-low border-primary/30'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-container'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      UHC Commercial (Total Joint)
                    </span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">
                      Published: Feb 16, 2025
                    </span>
                  </div>
                  <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-code-sm text-code-sm font-medium">
                    Scheduled
                  </span>
                </div>

                <div
                  onClick={() => {
                    setSelectedBulletin('cigna');
                    onShowToast('Cigna Musculoskeletal Guidelines review verified');
                  }}
                  className={`p-space-sm rounded-lg flex items-center justify-between cursor-pointer transition-colors border ${
                    selectedBulletin === 'cigna'
                      ? 'bg-surface-container-low border-primary/30'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-container'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      Cigna Musculoskeletal Guidelines
                    </span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">
                      Published: Feb 12, 2025
                    </span>
                  </div>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm">
                    Review Done
                  </span>
                </div>
              </div>

              {/* Side-by-Side Diff Preview Section */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-semibold">
                    Clause Diff Preview: CPB 0325 §4.2
                  </span>
                  <span className="font-code-sm text-code-sm text-outline">Simulated Groq Extraction</span>
                </div>

                <div className="flex flex-col gap-space-xs text-left font-code-sm text-code-sm">
                  {/* Previous Version */}
                  <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-1 border border-surface-container">
                    <span className="text-tertiary font-bold flex items-center gap-1 font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[14px]">remove_circle</span>
                      Current Active Policy (2024.3)
                    </span>
                    <p className="text-on-surface-variant leading-relaxed">
                      "...Lumbar MRI is medically necessary for low back pain only when conservative management for at least{' '}
                      <span className="bg-error-container text-on-error-container px-1 py-0.5 rounded font-semibold">
                        4 consecutive weeks
                      </span>{' '}
                      has failed, excluding red flags..."
                    </p>
                  </div>

                  {/* New Detected Version */}
                  <div className="p-space-sm bg-secondary-container/40 rounded-lg flex flex-col gap-1 border border-secondary-container">
                    <span className="text-secondary font-bold flex items-center gap-1 font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[14px]">add_circle</span>
                      Payer Bulletin Draft (Q1 2025)
                    </span>
                    <p className="text-on-surface leading-relaxed">
                      "...Lumbar MRI is medically necessary for low back pain only when conservative management for at least{' '}
                      <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-1 py-0.5 rounded font-semibold">
                        6 consecutive weeks including 4 PT sessions
                      </span>{' '}
                      has failed, excluding red flags..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <button
                  onClick={handleApproveDiff}
                  disabled={isApprovingDiff}
                  className="w-full py-space-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-space-xs font-semibold disabled:opacity-75"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isApprovingDiff ? 'animate-spin' : ''}`}>
                    {isApprovingDiff ? 'sync' : 'done_all'}
                  </span>
                  <span>{isApprovingDiff ? 'Processing Embeddings...' : 'Approve & Trigger Vector Embeddings'}</span>
                </button>
                <button
                  onClick={() => onShowToast('Routed policy diff to Dr. E. Vance clinical review queue')}
                  className="w-full py-space-sm bg-surface-container-low text-tertiary font-label-md text-label-md rounded-lg hover:bg-surface-container transition-all flex items-center justify-center gap-space-xs font-semibold border border-surface-container"
                >
                  <span className="material-symbols-outlined text-[16px]">rule</span>
                  <span>Route to Dr. Vance for Clinical Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingest PDF Modal */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md animate-in fade-in">
          <form
            onSubmit={handleIngestSubmit}
            className="bg-surface-container-lowest max-w-xl w-full rounded-2xl shadow-xl p-space-lg flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">upload_file</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Ingest Clinical Policy PDF
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    OCR parsing, semantic chunking &amp; Pinecone vectorization
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIngestModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Payer Organization</label>
              <select
                value={newPayer}
                onChange={(e) => setNewPayer(e.target.value)}
                className="h-10 px-space-sm bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none border border-surface-container"
              >
                <option>Cigna Healthcare</option>
                <option>UnitedHealthcare (UHC)</option>
                <option>Anthem / Elevance Health</option>
                <option>Aetna / CVS Health</option>
                <option>Humana Inc.</option>
                <option>CMS (Medicare NCD / LCD)</option>
              </select>
            </div>

            <div className="flex flex-col gap-space-sm">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Policy Document Identifier
              </label>
              <input
                type="text"
                value={newPolicyId}
                onChange={(e) => setNewPolicyId(e.target.value)}
                placeholder="e.g. CMM-704 or CPB-0891"
                required
                className="h-10 px-space-sm bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none placeholder:text-outline border border-surface-container"
              />
            </div>

            <div
              onClick={() => onShowToast('Mock PDF selected: 42 pages parsed')}
              className="p-space-lg rounded-xl bg-surface-container-low flex flex-col items-center justify-center gap-space-xs text-center cursor-pointer hover:bg-surface-container transition-colors border-2 border-dashed border-outline-variant"
            >
              <span className="material-symbols-outlined text-[36px] text-primary">cloud_upload</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Drag &amp; drop Payer Policy PDF here
              </span>
              <span className="font-code-sm text-code-sm text-on-surface-variant">
                Supports PDF up to 120MB • Multi-column OCR enabled
              </span>
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container">
              <button
                type="button"
                onClick={() => setIsIngestModalOpen(false)}
                className="px-space-md py-space-sm bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container transition-colors flex items-center gap-space-xs font-semibold shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">memory</span>
                <span>Begin Vector Chunking</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
