import React, { useState } from 'react';

interface ClinicalAuditLogViewProps {
  onShowToast: (msg: string, icon?: string) => void;
}

interface AuditEvent {
  id: string;
  timeAgo: string;
  timeUtc: string;
  procedure: string;
  cpt: string;
  bodyRegion: string;
  mrn: string;
  payer: string;
  payerKey: string;
  confidence: number;
  status: 'pa-required' | 'approved' | 'routine' | 'override';
  determinationLabel: string;
  determinationDesc: string;
  reviewerAvatar: string;
  reviewerName: string;
  reviewerAction: string;
  actionColor: string;
}

const auditData: AuditEvent[] = [
  {
    id: 'PA-2025-98412',
    timeAgo: '14 mins ago',
    timeUtc: '14:26:08 UTC',
    procedure: 'ACDF (Adjacent Segment Disease)',
    cpt: 'CPT 22551',
    bodyRegion: 'Cervical Spine',
    mrn: '***-4910',
    payer: 'Cigna Commercial (OpenAccess)',
    payerKey: 'cigna',
    confidence: 99.2,
    status: 'pa-required',
    determinationLabel: 'PA Required (Incomplete 2/5)',
    determinationDesc: 'Missing Cotinine assay & 6-wk physical therapy progress notes.',
    reviewerAvatar: 'V',
    reviewerName: 'Dr. E. Vance',
    reviewerAction: 'Records Requested',
    actionColor: 'text-tertiary',
  },
  {
    id: 'PA-2025-98390',
    timeAgo: '48 mins ago',
    timeUtc: '13:52:19 UTC',
    procedure: 'Total Knee Arthroplasty (TKA)',
    cpt: 'CPT 27447',
    bodyRegion: 'Right Knee',
    mrn: '***-1844',
    payer: 'Humana Medicare Advantage',
    payerKey: 'humana',
    confidence: 98.4,
    status: 'approved',
    determinationLabel: 'Approved (Deterministic Match)',
    determinationDesc: 'Grade 4 Kellgren-Lawrence severe medial compartment loss confirmed.',
    reviewerAvatar: 'P',
    reviewerName: 'Dr. S. Patel',
    reviewerAction: 'Auto-Submitted to Payer API',
    actionColor: 'text-secondary',
  },
  {
    id: 'PA-2025-98365',
    timeAgo: '2 hrs ago',
    timeUtc: '12:40:55 UTC',
    procedure: 'MRI Lumbar Spine w/o Contrast',
    cpt: 'CPT 72148',
    bodyRegion: 'Diagnostic Neuro',
    mrn: '***-6623',
    payer: 'Anthem / Elevance BluePriority',
    payerKey: 'anthem',
    confidence: 100,
    status: 'routine',
    determinationLabel: 'Routine Bypass (No PA Needed)',
    determinationDesc: 'Policy TOC-RAD-2025: First-line radiculopathy exempt from pre-cert.',
    reviewerAvatar: 'SYS',
    reviewerName: 'RAG Pipeline Auto',
    reviewerAction: 'Clearance Token Issued',
    actionColor: 'text-primary',
  },
  {
    id: 'PA-2025-98310',
    timeAgo: '3 hrs ago',
    timeUtc: '11:15:02 UTC',
    procedure: 'TAVR Transcatheter Aortic Valve',
    cpt: 'CPT 33361',
    bodyRegion: 'Structural Cardio',
    mrn: '***-8820',
    payer: 'UHC Medicare Advantage Choice',
    payerKey: 'uhc',
    confidence: 96.1,
    status: 'approved',
    determinationLabel: 'Approved (Criteria 5/5)',
    determinationDesc: 'Heart Team Multidisciplinary Consensus verified & STS Risk > 8%.',
    reviewerAvatar: 'C',
    reviewerName: 'Dr. M. Chen',
    reviewerAction: 'Final Approval Expedited',
    actionColor: 'text-secondary',
  },
  {
    id: 'PA-2025-98284',
    timeAgo: '5 hrs ago',
    timeUtc: '09:28:44 UTC',
    procedure: 'Knee Arthroscopy Meniscectomy',
    cpt: 'CPT 29881',
    bodyRegion: 'Ortho Ambulatory',
    mrn: '***-3291',
    payer: 'Anthem Commercial PPO',
    payerKey: 'anthem',
    confidence: 94.8,
    status: 'override',
    determinationLabel: 'Reviewer Override Applied',
    determinationDesc: 'RAG flagged degenerative tear; Surgeon provided acute mechanical locking documentation.',
    reviewerAvatar: 'V',
    reviewerName: 'Dr. E. Vance',
    reviewerAction: 'Approved with Clinical Note',
    actionColor: 'text-primary',
  },
];

export const ClinicalAuditLogView: React.FC<ClinicalAuditLogViewProps> = ({ onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('mtd');
  const [payerFilter, setPayerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<AuditEvent | null>(null);
  const [isAddendumOpen, setIsAddendumOpen] = useState(false);
  const [addendumNote, setAddendumNote] = useState('');

  const filteredEvents = auditData.filter((event) => {
    const text = `${event.id} ${event.procedure} ${event.cpt} ${event.mrn} ${event.payer} ${event.reviewerName} ${event.determinationDesc}`.toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase().trim());
    const matchesPayer = payerFilter === 'all' || event.payerKey === payerFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesPayer && matchesStatus;
  });

  const handleOpenDrawer = (item: AuditEvent) => {
    setSelectedCase(item);
  };

  const handleCloseDrawer = () => {
    setSelectedCase(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDateRange('mtd');
    setPayerFilter('all');
    setStatusFilter('all');
    onShowToast('Audit log filters reset');
  };

  const handleSaveAddendum = () => {
    if (!addendumNote.trim()) {
      onShowToast('Please type an addendum note', 'warning');
      return;
    }
    onShowToast(`Clinical addendum appended to ${selectedCase?.id} ledger`);
    setIsAddendumOpen(false);
    setAddendumNote('');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-gutter-lg flex flex-col gap-space-lg max-w-[1720px] mx-auto w-full">
        {/* Top Action Breadcrumb & Context Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-2xs">
            <div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm">
              <span>Clinical Governance</span>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-bold">RAG Verification Engine</span>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold">Audit Stream</span>
            </div>
            <div className="flex items-center gap-space-sm mt-space-2xs">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></div>
              <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                Clinical Audit Log &amp; Determination History
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-4xl">
              Comprehensive HIPAA Tier 4 audit trail of automated RAG vector evaluations, clinical reviewer overrides, and payer prior auth submissions.
            </p>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={() => onShowToast('Electronic Attestation & Signature applied for Dr. E. Vance')}
              className="px-space-md py-space-sm bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors rounded-lg shadow-sm flex items-center gap-space-xs font-label-md text-label-md border border-surface-container"
            >
              <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
              <span>HIPAA Compliance Sign-off</span>
            </button>
            <button
              onClick={() => onShowToast('Generating encrypted HIPAA CSV & PDF Audit Ledger...')}
              className="px-space-md py-space-sm bg-primary text-on-primary hover:bg-primary-container transition-colors rounded-lg shadow-sm flex items-center gap-space-xs font-label-md text-label-md font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_download</span>
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>

        {/* Metric Summary Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Total Evaluations
              </span>
              <span className="px-space-xs py-space-2xs bg-surface-container-low text-primary font-code-sm text-code-sm rounded-lg font-bold">
                30 Days
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">3,842</span>
              <span className="font-label-sm text-label-sm text-secondary flex items-center font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>+14.2%
              </span>
            </div>
            <div className="flex items-center justify-between pt-space-xs">
              <span className="font-body-sm text-body-sm text-outline">Automated &amp; Reviewer Cases</span>
              <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Clinician Concordance
              </span>
              <span className="px-space-xs py-space-2xs bg-secondary-fixed text-on-secondary-fixed-variant font-code-sm text-code-sm rounded-lg font-bold">
                98.7%
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-secondary tracking-tight font-bold">98.7%</span>
              <span className="font-label-sm text-label-sm text-outline">vs LLM RAG</span>
            </div>
            <div className="flex items-center justify-between pt-space-xs">
              <span className="font-body-sm text-body-sm text-outline">Deterministic rule alignment</span>
              <span className="font-code-sm text-code-sm text-secondary font-semibold">Optimal</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Avg Decision Latency
              </span>
              <span className="px-space-xs py-space-2xs bg-surface-container-low text-primary font-code-sm text-code-sm rounded-lg font-bold">
                -90.6%
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">4.2 min</span>
              <span className="font-label-sm text-label-sm text-outline">prior: 45 min</span>
            </div>
            <div className="flex items-center justify-between pt-space-xs">
              <span className="font-body-sm text-body-sm text-outline">End-to-end payer signoff</span>
              <span className="font-code-sm text-code-sm text-primary font-semibold">Triage P1</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Physician Overrides
              </span>
              <span className="px-space-xs py-space-2xs bg-tertiary-fixed text-on-tertiary-fixed-variant font-code-sm text-code-sm rounded-lg font-bold">
                0.7%
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-tertiary tracking-tight font-bold">28 cases</span>
              <span className="font-label-sm text-label-sm text-outline">Policy variance</span>
            </div>
            <div className="flex items-center justify-between pt-space-xs">
              <span className="font-body-sm text-body-sm text-outline">Pending committee review</span>
              <span className="font-code-sm text-code-sm text-tertiary font-semibold">3 unreviewed</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Controls Bar */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm">
            {/* Search input */}
            <div className="md:col-span-5 relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Case ID (#PA-2025-...), MRN, CPT (22551, 27447), or Reviewer..."
                className="w-full bg-surface-container-low text-on-surface pl-9 pr-space-md py-space-sm rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder-outline border border-surface-container"
              />
            </div>

            {/* Date Range Filter */}
            <div className="md:col-span-3 flex items-center">
              <div className="relative w-full">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface pl-3 pr-8 py-space-sm rounded-lg font-body-sm text-body-sm appearance-none focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container cursor-pointer"
                >
                  <option value="today">Today (Past 24 Hours)</option>
                  <option value="last7">Last 7 Days</option>
                  <option value="mtd">Month to Date (30 Days)</option>
                  <option value="custom">Custom Date Range...</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[16px]">
                  calendar_today
                </span>
              </div>
            </div>

            {/* Payer Filter */}
            <div className="md:col-span-2 flex items-center">
              <select
                value={payerFilter}
                onChange={(e) => setPayerFilter(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface px-3 py-space-sm rounded-lg font-body-sm text-body-sm appearance-none focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container cursor-pointer"
              >
                <option value="all">All Payers</option>
                <option value="cigna">Cigna Commercial</option>
                <option value="humana">Humana Medicare</option>
                <option value="anthem">Anthem / Elevance</option>
                <option value="uhc">UHC Medicare Adv</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-2 flex items-center justify-end">
              <button
                onClick={handleResetFilters}
                className="w-full h-full py-space-sm px-space-md bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors rounded-lg font-label-md text-label-md flex items-center justify-center gap-space-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Quick Status Badges Toggle */}
          <div className="flex items-center gap-space-xs flex-wrap pt-space-xs text-label-md font-label-md">
            <span className="text-on-surface-variant mr-space-xs font-semibold">Status Filter:</span>
            {[
              { id: 'all', label: 'All Determinations (3,842)', dotColor: null },
              { id: 'pa-required', label: 'PA Required / Incomplete (421)', dotColor: 'bg-tertiary' },
              { id: 'approved', label: 'Approved Match (2,914)', dotColor: 'bg-secondary' },
              { id: 'routine', label: 'Routine Bypass (479)', dotColor: 'bg-primary' },
              { id: 'override', label: 'Physician Override (28)', dotColor: 'bg-primary-container' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-space-sm py-space-2xs rounded-full transition-all shadow-sm ${
                  statusFilter === tab.id
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                {tab.dotColor && <span className={`w-2 h-2 rounded-full inline-block ${tab.dotColor} mr-1`}></span>}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Audit Trail Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-surface-container">
          <div className="p-space-md flex items-center justify-between bg-surface-container-low border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">history_toggle_off</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                Immutable Clinical Event Ledger
              </span>
              <span className="px-space-xs py-space-2xs bg-secondary-fixed text-on-secondary-fixed-variant rounded font-code-sm text-code-sm font-bold">
                Live Feed
              </span>
            </div>
            <div className="flex items-center gap-space-sm text-outline font-code-sm text-code-sm">
              <span>
                SHA-256 Ledger: <span className="text-on-surface font-mono">0x9f1a...48b3</span>
              </span>
              <span>•</span>
              <span>Sync: Real-time</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md border-b border-surface-container">
                  <th className="py-space-sm px-space-md font-semibold">Case Identifier &amp; Time</th>
                  <th className="py-space-sm px-space-md font-semibold">Clinical Procedure / CPT</th>
                  <th className="py-space-sm px-space-md font-semibold">Patient &amp; Payer</th>
                  <th className="py-space-sm px-space-md font-semibold text-center">RAG Confidence</th>
                  <th className="py-space-sm px-space-md font-semibold">Evaluation &amp; Determination</th>
                  <th className="py-space-sm px-space-md font-semibold">Reviewer &amp; Action</th>
                  <th className="py-space-sm px-space-md font-semibold text-right">Audit Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-body-sm font-body-sm text-on-surface">
                {filteredEvents.map((event) => {
                  return (
                    <tr
                      key={event.id}
                      onClick={() => handleOpenDrawer(event)}
                      className="hover:bg-surface-container-low/60 transition-colors group cursor-pointer"
                    >
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-space-xs">
                            <span className="font-code-sm text-code-sm font-bold text-primary group-hover:underline">
                              #{event.id}
                            </span>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                event.status === 'pa-required'
                                  ? 'bg-tertiary'
                                  : event.status === 'approved'
                                  ? 'bg-secondary'
                                  : event.status === 'routine'
                                  ? 'bg-primary'
                                  : 'bg-primary-container'
                              }`}
                            ></span>
                          </div>
                          <span className="font-code-sm text-code-sm text-outline">
                            {event.timeAgo} • {event.timeUtc}
                          </span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface">{event.procedure}</span>
                          <div className="flex items-center gap-space-xs">
                            <span className="px-space-xs py-space-2xs bg-surface-container text-primary font-code-sm text-code-sm rounded font-bold">
                              {event.cpt}
                            </span>
                            <span className="text-outline text-label-sm font-label-sm">{event.bodyRegion}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className="font-code-sm text-code-sm text-on-surface">
                            MRN: <strong className="font-mono">{event.mrn}</strong>
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">{event.payer}</span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-code-sm text-code-sm font-bold ${
                              event.confidence >= 98
                                ? 'text-secondary'
                                : event.confidence >= 95
                                ? 'text-primary'
                                : 'text-outline'
                            }`}
                          >
                            {event.confidence}%
                          </span>
                          <div className="w-12 h-1 bg-surface-container rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full ${
                                event.confidence >= 98
                                  ? 'bg-secondary'
                                  : event.confidence >= 95
                                  ? 'bg-primary'
                                  : 'bg-outline'
                              }`}
                              style={{ width: `${event.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col gap-space-2xs">
                          <div
                            className={`inline-flex items-center gap-1.5 px-space-xs py-space-2xs rounded font-label-sm text-label-sm w-fit font-semibold ${
                              event.status === 'pa-required'
                                ? 'bg-error-container text-on-error-container'
                                : event.status === 'approved'
                                ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                                : event.status === 'routine'
                                ? 'bg-surface-container-high text-primary'
                                : 'bg-surface-container-highest text-on-surface'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {event.status === 'pa-required'
                                ? 'warning'
                                : event.status === 'approved'
                                ? 'check_circle'
                                : event.status === 'routine'
                                ? 'bolt'
                                : 'edit_note'}
                            </span>
                            <span>{event.determinationLabel}</span>
                          </div>
                          <span className="text-on-surface-variant font-body-sm text-body-sm line-clamp-1">
                            {event.determinationDesc}
                          </span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-space-2xs">
                            <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">
                              {event.reviewerAvatar}
                            </span>
                            <span className="font-label-md text-label-md font-semibold text-on-surface">
                              {event.reviewerName}
                            </span>
                          </div>
                          <span className={`${event.actionColor} font-label-sm text-label-sm font-medium mt-0.5`}>
                            {event.reviewerAction}
                          </span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawer(event);
                          }}
                          className="px-space-sm py-space-xs bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all rounded-lg font-label-sm text-label-sm text-on-surface inline-flex items-center gap-space-2xs"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination / Footer Status */}
          <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant border-t border-surface-container">
            <div className="flex items-center gap-space-xs">
              <span>
                Showing <strong>1 - {filteredEvents.length}</strong> of <strong>3,842</strong> clinical audit events
              </span>
              <span className="text-outline">•</span>
              <span className="text-outline">Latency: 18ms</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="px-space-sm py-space-xs rounded bg-primary text-on-primary font-semibold">1</span>
              <button
                onClick={() => onShowToast('Page 2')}
                className="px-space-sm py-space-xs rounded bg-surface-container text-on-surface hover:bg-surface-variant"
              >
                2
              </button>
              <button
                onClick={() => onShowToast('Page 3')}
                className="px-space-sm py-space-xs rounded bg-surface-container text-on-surface hover:bg-surface-variant"
              >
                3
              </button>
              <span className="px-1 text-outline">...</span>
              <button
                onClick={() => onShowToast('Page 769')}
                className="px-space-sm py-space-xs rounded bg-surface-container text-on-surface hover:bg-surface-variant"
              >
                769
              </button>
            </div>
          </div>
        </div>

        {/* Forensic RAG Trace & Audit Drawer */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <div onClick={handleCloseDrawer} className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity" />
            <div className="relative w-full sm:w-[580px] h-full bg-surface-container-lowest shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="p-space-md bg-inverse-surface text-inverse-on-surface flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined text-[20px]">policy</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-headline-md leading-tight text-inverse-on-surface font-bold">
                      Audit Event #{selectedCase.id}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline-variant">
                      Forensic RAG Inference &amp; Reviewer Attestation
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-outline-variant hover:text-inverse-on-surface hover:bg-surface-container-lowest/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-space-md flex flex-col gap-space-md text-on-surface">
                {/* Case Metadata Banner */}
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                      Target Clinical Request
                    </span>
                    <span
                      className={`px-space-xs py-space-2xs font-code-sm text-code-sm rounded font-bold ${
                        selectedCase.status === 'pa-required'
                          ? 'bg-error-container text-on-error-container'
                          : selectedCase.status === 'approved'
                          ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                          : 'bg-primary-fixed text-on-primary-fixed'
                      }`}
                    >
                      Determination: {selectedCase.determinationLabel}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">
                      {selectedCase.cpt} • {selectedCase.procedure}
                    </span>
                    <span className="font-code-sm text-code-sm text-primary font-bold">Patient {selectedCase.mrn}</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Payer: {selectedCase.payer} • Evaluated: {selectedCase.timeUtc}
                  </span>
                </div>

                {/* SHA-256 Ledger & Attestation Block */}
                <div className="bg-surface-container p-space-md rounded-xl flex flex-col gap-space-xs font-code-sm text-code-sm border border-surface-container-high">
                  <div className="flex items-center justify-between text-outline">
                    <span className="flex items-center gap-space-2xs font-semibold text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
                      HIPAA Tier 4 Cryptographic Seal
                    </span>
                    <span className="text-secondary font-bold">Immutable Anchor</span>
                  </div>
                  <div className="bg-surface-container-lowest p-space-xs rounded font-mono text-[11px] text-on-surface-variant break-all select-all border border-surface-container">
                    SHA256: 0x9f1a8c3d74be348e8942b0124cc87df0a76e93144bf83141235a90e38a201c9b
                  </div>
                  <div className="flex items-center justify-between text-label-sm font-label-sm text-outline pt-space-2xs">
                    <span>
                      Merkle Tree Root: <span className="font-mono text-on-surface font-semibold">Block #1,492,084</span>
                    </span>
                    <span>
                      Zero-Knowledge Proof: <span className="text-secondary font-bold">Valid</span>
                    </span>
                  </div>
                </div>

                {/* 1. Retrieval-Augmented Generation Trace */}
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    1. Retrieval-Augmented Generation Trace
                  </span>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm font-body-sm text-body-sm border border-surface-container">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-on-surface">Engine: Groq / Llama-3.3-70B-Versatile</span>
                      <span className="font-code-sm text-code-sm text-primary bg-primary-fixed px-space-xs py-space-2xs rounded font-bold">
                        Conf: {selectedCase.confidence}%
                      </span>
                    </div>
                    <div className="flex flex-col gap-space-2xs">
                      <span className="font-label-sm text-label-sm text-outline">
                        Retrieved Vector Chunks (Qdrant Clinical Index):
                      </span>
                      <div className="bg-surface-container-lowest p-space-sm rounded-lg text-[12px] flex flex-col gap-1 border border-surface-container">
                        <span className="font-mono text-primary font-semibold">
                          chunk_ref: CG-SURG-05_CervicalSpine_v4.2.pdf (p.14)
                        </span>
                        <p className="text-on-surface-variant italic bg-surface-container-high/40 p-space-xs rounded">
                          "...Criterion 3.2: Patient must demonstrate minimum 6 weeks supervised physical therapy within prior 6 months AND confirmed smoking cessation via cotinine negative lab test if arthrodesis is proposed..."
                        </p>
                        <div className="flex items-center justify-between text-outline text-[11px] pt-1">
                          <span>Cosine Similarity: <strong>0.9412</strong></span>
                          <span>Vector Dimensions: 1536</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Automated Criteria Evaluation */}
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    2. Automated Criteria Evaluation
                  </span>
                  <div className="bg-surface-container-lowest rounded-xl flex flex-col divide-y divide-surface-container shadow-sm border border-surface-container">
                    <div className="p-space-sm flex items-start gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">check_circle</span>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Confirmed Cervical Radiculopathy / Myelopathy
                        </span>
                        <span className="text-label-sm font-label-sm text-outline">
                          EMG &amp; MRI scan notes dated 2025-04-10 match criterion.
                        </span>
                      </div>
                    </div>
                    <div className="p-space-sm flex items-start gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">check_circle</span>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Single / Adjacent Segment Disc Herniation
                        </span>
                        <span className="text-label-sm font-label-sm text-outline">
                          C5-C6 and C6-C7 cord impingement verified.
                        </span>
                      </div>
                    </div>
                    <div className="p-space-sm flex items-start gap-space-sm bg-error-container/20">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5">cancel</span>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-error font-semibold">
                          Supervised Conservative Therapy (6 Weeks)
                        </span>
                        <span className="text-label-sm font-label-sm text-on-surface-variant">
                          Only 2 PT visits documented in EHR; 4 weeks missing.
                        </span>
                      </div>
                    </div>
                    <div className="p-space-sm flex items-start gap-space-sm bg-error-container/20">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5">cancel</span>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-error font-semibold">
                          Serum Cotinine Lab Assay
                        </span>
                        <span className="text-label-sm font-label-sm text-on-surface-variant">
                          No cotinine test found in lab records within 90 days.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Reviewer Digital Signature */}
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    3. Reviewer Digital Signature
                  </span>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm border border-surface-container">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center font-label-md text-label-md">
                          EV
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md font-bold text-on-surface">
                            Dr. Elena Vance, MD, FACS
                          </span>
                          <span className="text-label-sm font-label-sm text-outline">
                            Medical Director, Orthopedic Surgery
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg text-body-sm font-body-sm text-on-surface-variant border border-surface-container">
                      "Concur with automated RAG synthesis. Surgical criteria not satisfied due to absent smoking cessation laboratory verification and incomplete conservative management course. Requesting supplementary records from requesting provider Dr. R. Gallagher prior to formal peer-to-peer or denial."
                    </div>
                    <div className="flex items-center justify-between text-outline font-code-sm text-code-sm pt-space-2xs">
                      <span>NPI: <strong>1849203912</strong></span>
                      <span>Signed: 2025-05-18 14:28:11 UTC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-space-md bg-surface-container-low flex items-center justify-between gap-space-sm border-t border-surface-container">
                <button
                  onClick={() => window.print()}
                  className="px-space-md py-space-sm bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors rounded-lg font-label-md text-label-md flex items-center gap-space-xs border border-surface-container font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Case Packet</span>
                </button>
                <button
                  onClick={() => setIsAddendumOpen(true)}
                  className="px-space-md py-space-sm bg-primary text-on-primary hover:bg-primary-container transition-colors rounded-lg font-label-md text-label-md flex items-center gap-space-xs font-semibold shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add_comment</span>
                  <span>Append Addendum</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Addendum Modal */}
        {isAddendumOpen && (
          <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md animate-in fade-in">
            <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Append Clinical Addendum
                </h3>
                <button
                  onClick={() => setIsAddendumOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Append supplemental provider records, physician peer-to-peer discussion notes, or expedited clinical waivers.
              </p>
              <textarea
                value={addendumNote}
                onChange={(e) => setAddendumNote(e.target.value)}
                placeholder="Enter clinical addendum details..."
                rows={4}
                className="w-full p-space-sm bg-surface-container-low rounded-xl text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container"
              />
              <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container">
                <button
                  onClick={() => setIsAddendumOpen(false)}
                  className="px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface font-label-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAddendum}
                  className="px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-label-md font-semibold shadow-sm"
                >
                  Sign &amp; Append Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
