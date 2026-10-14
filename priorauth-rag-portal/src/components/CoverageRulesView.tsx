import React, { useState } from 'react';

interface CoverageRulesViewProps {
  onShowToast: (msg: string, icon?: string) => void;
}

interface RuleItem {
  id: string;
  code: string;
  cpt: string;
  procedure: string;
  description: string;
  specialty: string;
  triggerType: 'Deterministic Match' | 'RAG Boolean Checklist' | 'LLM Clinical Necessity' | 'Routine Bypass';
  condition: string;
  conditionNote: string;
  payer: string;
  payerCode: string;
  updatedDate: string;
  status: 'Active' | 'Staging' | 'Deprecated';
  version: string;
  latency: string;
}

const initialRules: RuleItem[] = [
  {
    id: 'RUL-SPN-22551-A',
    code: 'RUL-SPN-22551-A',
    cpt: '22551',
    procedure: 'Anterior Cervical Arthrodesis (ACDF)',
    description: 'Cervical spinal fusion with decompression; single interspace, cervical.',
    specialty: 'Spine Surgery',
    triggerType: 'RAG Boolean Checklist',
    condition: 'PT >= 6 wks AND VAS >= 4 AND MRI confirmed nerve root compression',
    conditionNote: 'Exception: Immediate bypass if myelopathy or severe rapid motor deficit present',
    payer: 'UnitedHealthcare (UHC)',
    payerCode: '2024T0543',
    updatedDate: 'Jan 15, 2025',
    status: 'Active',
    version: 'v4.2.1',
    latency: '42ms',
  },
  {
    id: 'RUL-ORT-27447-B',
    code: 'RUL-ORT-27447-B',
    cpt: '27447',
    procedure: 'Total Knee Arthroplasty (TKA)',
    description: 'Arthroplasty, knee, condyle and plateau; medial and lateral compartments with or without patella resurfacing.',
    specialty: 'Orthopedics',
    triggerType: 'Deterministic Match',
    condition: 'Kellgren-Lawrence >= Grade 3 AND 12+ wks non-op therapy AND BMI < 40',
    conditionNote: 'Includes intra-articular steroid or viscosupplementation history',
    payer: 'Cigna Commercial',
    payerCode: 'CMM-601',
    updatedDate: 'Nov 01, 2024',
    status: 'Active',
    version: 'v3.1.0',
    latency: '22ms',
  },
  {
    id: 'RUL-RAD-72148-C',
    code: 'RUL-RAD-72148-C',
    cpt: '72148',
    procedure: 'MRI Lumbar Spine w/o Contrast',
    description: 'Magnetic resonance imaging, spinal canal and contents, lumbar; without contrast material.',
    specialty: 'Radiology',
    triggerType: 'Routine Bypass',
    condition: 'Red Flag Indication: Cauda Equina OR Cancer History OR Acute Neurologic Deficit',
    conditionNote: 'Bypasses standard 6-week conservative care trial automatically',
    payer: 'Anthem / Elevance',
    payerCode: 'CG-SURG-83',
    updatedDate: 'Dec 12, 2024',
    status: 'Active',
    version: 'v2.0.4',
    latency: '11ms',
  },
  {
    id: 'RUL-CRD-33361-D',
    code: 'RUL-CRD-33361-D',
    cpt: '33361',
    procedure: 'TAVR / Transcatheter Aortic Valve',
    description: 'Transcatheter aortic valve replacement (TAVR/TAVI) with prosthesis; percutaneous femoral artery approach.',
    specialty: 'Cardiology',
    triggerType: 'LLM Clinical Necessity',
    condition: 'Aortic Valve Area < 1.0 cm² AND Mean Gradient > 40 mmHg AND STS Risk Score eval',
    conditionNote: 'Requires Heart Team multidisciplinary note validation via Llama-3.3',
    payer: 'UnitedHealthcare (UHC)',
    payerCode: 'NCD 20.32',
    updatedDate: 'Feb 02, 2025',
    status: 'Active',
    version: 'v1.8.0',
    latency: '1.1s',
  },
  {
    id: 'RUL-SPN-22845-E',
    code: 'RUL-SPN-22845-E',
    cpt: '22845',
    procedure: 'Anterior Instrumentation (2-3 Segments)',
    description: 'Anterior spinal instrumentation; 2 to 3 vertebral segments (List separately with primary code).',
    specialty: 'Spine Surgery',
    triggerType: 'Deterministic Match',
    condition: 'Co-billed with eligible primary fusion CPT (22551 or 22554) AND Multi-level indication',
    conditionNote: 'Automated cross-code add-on validation rule',
    payer: 'Aetna Medicare',
    payerCode: 'CPB 0016',
    updatedDate: 'Pending Clinical Review',
    status: 'Staging',
    version: 'v0.9.2',
    latency: 'Staging',
  },
  {
    id: 'RUL-ORT-29881-F',
    code: 'RUL-ORT-29881-F',
    cpt: '29881',
    procedure: 'Knee Arthroscopy w/ Meniscectomy',
    description: 'Arthroscopy, knee, surgical; with meniscectomy (medial OR lateral, including any meniscal shaving).',
    specialty: 'Orthopedics',
    triggerType: 'RAG Boolean Checklist',
    condition: 'Mechanical Locking/Catching AND MRI positive acute tear AND Absence of severe advanced OA',
    conditionNote: 'Auto-Deny flag if isolated degenerative tear with severe tri-compartment OA',
    payer: 'Anthem / Elevance',
    payerCode: 'CG-SURG-87',
    updatedDate: 'Oct 20, 2024',
    status: 'Active',
    version: 'v2.4.0',
    latency: '55ms',
  },
  {
    id: 'RUL-RAD-70553-G',
    code: 'RUL-RAD-70553-G',
    cpt: '70553',
    procedure: 'MRI Brain w/ & w/o Contrast',
    description: 'Magnetic resonance imaging, brain without and with contrast material.',
    specialty: 'Radiology',
    triggerType: 'LLM Clinical Necessity',
    condition: 'Superceded by 2025 Multi-Tier Neuro-Oncology criteria engine',
    conditionNote: 'Archived on Jan 01, 2025',
    payer: 'Cigna Commercial',
    payerCode: 'RAD-2023-ARCH',
    updatedDate: 'Archived',
    status: 'Deprecated',
    version: 'v1.0.0',
    latency: 'Deprecated',
  },
];

export const CoverageRulesView: React.FC<CoverageRulesViewProps> = ({ onShowToast }) => {
  // Simulator State
  const [simAge, setSimAge] = useState(54);
  const [simPt, setSimPt] = useState(7);
  const [simVas, setSimVas] = useState(7);
  const [simDeficit, setSimDeficit] = useState(false);
  const [simImaging, setSimImaging] = useState<'mri_confirmed' | 'mild_bulge' | 'xray_only'>('mri_confirmed');
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  // Table Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [triggerFilter, setTriggerFilter] = useState('ALL');
  const [payerFilter, setPayerFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Simulation Logic Calculations
  const urgentPassed = simDeficit;
  const ptPassed = simPt >= 6 && simVas >= 4;
  const imagingPassed = simImaging === 'mri_confirmed';
  const isApproved = (urgentPassed || ptPassed) && imagingPassed;

  // Filter Table
  const filteredRules = initialRules.filter((rule) => {
    const text = `${rule.code} ${rule.cpt} ${rule.procedure} ${rule.description} ${rule.condition} ${rule.payer}`.toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase().trim());
    const matchesSpecialty = specialtyFilter === 'ALL' || rule.specialty === specialtyFilter;
    const matchesTrigger = triggerFilter === 'ALL' || rule.triggerType === triggerFilter;
    const matchesPayer =
      payerFilter === 'ALL' ||
      (payerFilter === 'UHC' && rule.payer.includes('UHC')) ||
      (payerFilter === 'Cigna' && rule.payer.includes('Cigna')) ||
      (payerFilter === 'Anthem' && rule.payer.includes('Anthem')) ||
      (payerFilter === 'Aetna' && rule.payer.includes('Aetna'));
    const matchesStatus = statusFilter === 'ALL' || rule.status === statusFilter;

    return matchesSearch && matchesSpecialty && matchesTrigger && matchesPayer && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSpecialtyFilter('ALL');
    setTriggerFilter('ALL');
    setPayerFilter('ALL');
    setStatusFilter('ALL');
    onShowToast('Filters reset to default view');
  };

  const handleResetSimulator = () => {
    setSimAge(54);
    setSimPt(7);
    setSimVas(7);
    setSimDeficit(false);
    setSimImaging('mri_confirmed');
    onShowToast('Simulator parameters reset');
  };

  const scrollToSimulator = () => {
    const element = document.getElementById('simulator-panel');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-gutter-lg py-space-lg flex flex-col gap-space-lg max-w-[1720px] mx-auto w-full">
        {/* Top Action & View Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Coverage Rules Engine &amp; Logic Matrix</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Coverage Rules &amp; Decision Logic Matrix
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Configured decision trees, CPT code mappings, and automated RAG routing rules for commercial prior authorization.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={scrollToSimulator}
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">play_circle</span>
              <span>Open Rule Simulator</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(initialRules, null, 2));
                onShowToast('Exported coverage rules schema to JSON');
              }}
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all shadow-sm border border-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>Export Schema (JSON)</span>
            </button>
            <button
              onClick={() => onShowToast('New Decision Tree Builder wizard opened')}
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Decision Tree</span>
            </button>
          </div>
        </div>

        {/* Metric KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm relative overflow-hidden border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Active Rule Sets
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
              </div>
            </div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">48</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Policies</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-space-xs">
              <span className="flex items-center gap-space-2xs text-secondary font-semibold font-code-sm text-code-sm">
                <span className="material-symbols-outlined text-[14px]">checklist</span> 1,240 Rules
              </span>
              <span className="text-on-surface-variant text-label-sm font-label-sm">Active &amp; Versioned</span>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-space-2xs">
              <div className="bg-primary h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm relative overflow-hidden border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Auto-Determination Bypass
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
            </div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">34.2%</span>
              <span className="font-code-sm text-code-sm text-secondary font-bold flex items-center">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +3.8%
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-space-xs">
              <span className="text-on-surface-variant font-label-sm text-label-sm truncate">Routine cleared sans review</span>
              <span className="font-code-sm text-code-sm text-on-surface font-semibold">428/day</span>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-space-2xs">
              <div className="bg-secondary h-full rounded-full" style={{ width: '34.2%' }}></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm relative overflow-hidden border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Evaluation Latency
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">speed</span>
              </div>
            </div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                38<span className="font-headline-md text-headline-md font-normal">ms</span>
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">+ 1.2s RAG</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-space-xs">
              <span className="text-on-surface-variant font-label-sm text-label-sm">Groq Llama-3.3 70B</span>
              <span className="font-code-sm text-code-sm text-secondary font-bold">p95: 1.48s</span>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-space-2xs">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm relative overflow-hidden border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Disputed Logic Flags
              </span>
              <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
            </div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-error font-bold tracking-tight">3</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Pending Review</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-space-xs">
              <span className="text-error font-label-sm text-label-sm">Conflicting payer guidelines</span>
              <button
                onClick={() => setIsConflictModalOpen(true)}
                className="font-label-sm text-label-sm text-primary hover:underline font-semibold"
              >
                Inspect
              </button>
            </div>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-space-2xs">
              <div className="bg-error h-full rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>

        {/* Dynamic Rule Simulator / Sandbox Drawer */}
        <div
          id="simulator-panel"
          className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md transition-all duration-300 border border-surface-container"
        >
          <div className="flex flex-col lg:flex-row items-start justify-between gap-space-lg pb-space-md border-b border-surface-container">
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">terminal</span>
              </div>
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">
                    Quick Rule Test Sandbox
                  </span>
                  <span className="px-space-xs py-space-2xs bg-surface-container-high text-primary font-code-sm text-code-sm rounded font-semibold">
                    Interactive Engine
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Inject synthetic patient parameters to validate deterministic rule evaluation and RAG necessity gates in real-time.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-sm self-end lg:self-auto">
              <button
                onClick={() => onShowToast(`Logic executed: ${isApproved ? 'Approved' : 'Denied'}`)}
                className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Execute Logic Tree</span>
              </button>
              <button
                onClick={handleResetSimulator}
                className="px-space-sm py-space-sm rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Simulator Inputs & Graph Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg pt-space-sm">
            {/* Variable Inputs (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-low p-space-md rounded-lg border border-surface-container">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
                <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Patient Parameters
                </span>
                <span className="font-code-sm text-code-sm text-outline">Target: CPT-22551 (ACDF)</span>
              </div>
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Patient Age</label>
                  <input
                    type="number"
                    value={simAge}
                    onChange={(e) => setSimAge(Number(e.target.value))}
                    className="px-space-sm py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
                  />
                </div>
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Conservative PT (Weeks)
                  </label>
                  <input
                    type="number"
                    value={simPt}
                    onChange={(e) => setSimPt(Number(e.target.value))}
                    className="px-space-sm py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    VAS Pain Score (1-10)
                  </label>
                  <select
                    value={simVas}
                    onChange={(e) => setSimVas(Number(e.target.value))}
                    className="px-space-sm py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
                  >
                    <option value={2}>2 - Mild</option>
                    <option value={4}>4 - Moderate</option>
                    <option value={7}>7 - Severe Intractable</option>
                    <option value={9}>9 - Extreme</option>
                  </select>
                </div>
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Rapid Motor Deficit / Myelopathy
                  </label>
                  <select
                    value={simDeficit ? 'true' : 'false'}
                    onChange={(e) => setSimDeficit(e.target.value === 'true')}
                    className="px-space-sm py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
                  >
                    <option value="false">No (Stable)</option>
                    <option value="true">Yes (Progressive / Urgent)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Diagnostic Imaging Findings
                </label>
                <select
                  value={simImaging}
                  onChange={(e) => setSimImaging(e.target.value as any)}
                  className="px-space-sm py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
                >
                  <option value="mri_confirmed">
                    MRI Cervical: Confirmed root compression &amp; osteophyte at C5-C6
                  </option>
                  <option value="mild_bulge">MRI Cervical: Mild disc bulge without cord/nerve impingement</option>
                  <option value="xray_only">X-Ray Only: Mild spondylosis (No Advanced Cross-Sectional MRI)</option>
                </select>
              </div>
              <div className="flex items-center justify-between text-outline text-label-sm font-label-sm pt-space-xs">
                <span>Target Policy: UHC 2024T0543</span>
                <span className="font-code-sm text-code-sm text-secondary font-semibold">Logic Hash: 9d1b-7a2e</span>
              </div>
            </div>

            {/* Simulated Decision Graph & Branch Flow (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-lg border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                  Computed Logic Flow Trace
                </span>
                <span
                  className={`px-space-sm py-space-2xs rounded-full font-code-sm text-code-sm font-bold flex items-center gap-space-2xs ${
                    isApproved
                      ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isApproved ? 'check_circle' : 'cancel'}
                  </span>
                  <span>{isApproved ? 'COVERAGE APPROVED (DETERMINISTIC)' : 'COVERAGE DENIED / MISSING CRITERIA'}</span>
                </span>
              </div>

              {/* Step By Step Decision Tree Visualizer */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                {/* Step 1 */}
                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-lowest shadow-sm border border-surface-container">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-code-sm text-code-sm font-bold">
                      1
                    </span>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface font-bold">Urgent Bypass Check</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant font-code-sm text-code-sm">
                        Param: motor_deficit == true?
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-code-sm text-code-sm font-bold ${
                        urgentPassed ? 'text-secondary' : 'text-on-surface-variant'
                      }`}
                    >
                      {urgentPassed
                        ? 'Branch: TRUE (Emergency Rapid Deficit Bypass)'
                        : 'Branch: False (Proceed to Conservative)'}
                    </span>
                  </div>
                </div>

                {/* Connector line */}
                <div className="h-3 w-0.5 bg-outline-variant ml-7"></div>

                {/* Step 2 */}
                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-lowest shadow-sm border border-surface-container">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-code-sm text-code-sm font-bold">
                      2
                    </span>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface font-bold">
                        Conservative Care Threshold
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant font-code-sm text-code-sm">
                        Param: pt_weeks &gt;= 6 AND vas_score &gt;= 4
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-code-sm text-code-sm font-bold ${
                        urgentPassed
                          ? 'text-on-surface-variant'
                          : ptPassed
                          ? 'text-secondary'
                          : 'text-error'
                      }`}
                    >
                      {urgentPassed
                        ? 'SKIPPED (PT waived via myelopathy clause)'
                        : ptPassed
                        ? `PASSED (${simPt} wks >= 6, VAS ${simVas} >= 4)`
                        : `FAILED (${simPt} wks < 6 or VAS ${simVas} < 4)`}
                    </span>
                  </div>
                </div>

                {/* Connector line */}
                <div className="h-3 w-0.5 bg-outline-variant ml-7"></div>

                {/* Step 3 */}
                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-lowest shadow-sm border border-surface-container">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-code-sm text-code-sm font-bold">
                      3
                    </span>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface font-bold">
                        Objective Imaging Concordance
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant font-code-sm text-code-sm">
                        Param: MRI/CT proves neural compression at operative tier
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-code-sm text-code-sm font-bold ${
                        imagingPassed ? 'text-secondary' : 'text-error'
                      }`}
                    >
                      {imagingPassed
                        ? 'PASSED (C5-C6 Cord/Root Confirmed)'
                        : simImaging === 'mild_bulge'
                        ? 'FAILED (Mild bulge without cord impingement)'
                        : 'FAILED (X-ray insufficient; MRI required)'}
                    </span>
                  </div>
                </div>

                {/* Connector line */}
                <div className="h-3 w-0.5 bg-outline-variant ml-7"></div>

                {/* Outcome */}
                <div
                  className={`flex items-center justify-between p-space-sm rounded-lg shadow-sm border ${
                    isApproved
                      ? 'bg-secondary-fixed-dim/20 border-secondary/30'
                      : 'bg-error-container/30 border-error/30'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-code-sm text-code-sm font-bold ${
                        isApproved ? 'bg-secondary text-on-secondary' : 'bg-error text-on-error'
                      }`}
                    >
                      {isApproved ? '✓' : '!'}
                    </span>
                    <div>
                      <div
                        className={`font-label-md text-label-md font-bold ${
                          isApproved ? 'text-on-secondary-fixed-variant' : 'text-error'
                        }`}
                      >
                        {isApproved
                          ? 'Determination: RAG Met Standard / Auto-Approved'
                          : 'Determination: Logic Threshold Not Met — Sent for MD Review'}
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant font-code-sm text-code-sm">
                        Policy Ref: UHC 2024T0543 Section 4.2.1 Cervical Decompression
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-code-sm text-code-sm font-bold ${
                        isApproved ? 'text-secondary' : 'text-error'
                      }`}
                    >
                      Execution: 41ms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Rules Grid / Matrix Container */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-surface-container">
          {/* Filter Toolbar */}
          <div className="p-space-md bg-surface-container-low flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md border-b border-surface-container">
            {/* Left: Search & Filters */}
            <div className="flex flex-wrap items-center gap-space-sm flex-1">
              {/* Search Input */}
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Rule ID, CPT code, policy term..."
                  className="w-full pl-9 pr-space-md py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
                />
              </div>

              {/* Specialty Filter */}
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="px-space-sm py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
              >
                <option value="ALL">All Specialties (4)</option>
                <option value="Spine Surgery">Spine Surgery</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Radiology">Radiology</option>
              </select>

              {/* Trigger Type Filter */}
              <select
                value={triggerFilter}
                onChange={(e) => setTriggerFilter(e.target.value)}
                className="px-space-sm py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
              >
                <option value="ALL">All Trigger Types</option>
                <option value="Deterministic Match">Deterministic Match</option>
                <option value="RAG Boolean Checklist">RAG Boolean Checklist</option>
                <option value="LLM Clinical Necessity">LLM Clinical Necessity</option>
                <option value="Routine Bypass">Routine Bypass</option>
              </select>

              {/* Payer Filter */}
              <select
                value={payerFilter}
                onChange={(e) => setPayerFilter(e.target.value)}
                className="px-space-sm py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
              >
                <option value="ALL">All Payers</option>
                <option value="UHC">UnitedHealthcare (UHC)</option>
                <option value="Cigna">Cigna Commercial</option>
                <option value="Anthem">Anthem / Elevance</option>
                <option value="Aetna">Aetna Medicare</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-space-sm py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Staging">Staging / Draft</option>
                <option value="Deprecated">Deprecated</option>
              </select>
            </div>

            {/* Right: Counter & Reset */}
            <div className="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm justify-between lg:justify-end">
              <span>Showing {filteredRules.length} of {initialRules.length} Rules</span>
              <button
                onClick={handleResetFilters}
                className="text-primary hover:underline font-semibold font-label-sm text-label-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Main Rules Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container">
                  <th className="py-space-sm px-space-md">Rule ID &amp; Policy Code</th>
                  <th className="py-space-sm px-space-md">Primary CPT / HCPCS</th>
                  <th className="py-space-sm px-space-md">Decision Trigger Type</th>
                  <th className="py-space-sm px-space-md">Threshold &amp; Boolean Condition</th>
                  <th className="py-space-sm px-space-md">Payer Policy</th>
                  <th className="py-space-sm px-space-md">Status</th>
                  <th className="py-space-sm px-space-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredRules.map((rule) => {
                  return (
                    <tr
                      key={rule.id}
                      className={`hover:bg-surface-container-high/40 transition-colors ${
                        rule.status === 'Deprecated' ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="py-space-md px-space-md align-top">
                        <div className="flex flex-col gap-space-2xs">
                          <span className="font-code-sm text-code-sm text-primary font-bold">{rule.code}</span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">{rule.specialty}</span>
                          <span className="font-code-sm text-code-sm text-outline">
                            {rule.version} • Latency: {rule.latency}
                          </span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md align-top">
                        <div className="flex flex-col gap-space-2xs">
                          <div className="flex items-center gap-space-xs">
                            <span className="px-space-xs py-space-2xs bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm rounded font-bold">
                              {rule.cpt}
                            </span>
                            <span
                              className={`font-label-md text-label-md font-semibold text-on-surface ${
                                rule.status === 'Deprecated' ? 'line-through text-outline' : ''
                              }`}
                            >
                              {rule.procedure}
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                            {rule.description}
                          </span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md align-top">
                        <span
                          className={`inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded font-label-sm text-label-sm font-semibold ${
                            rule.triggerType === 'Deterministic Match'
                              ? 'bg-surface-container-high text-secondary'
                              : rule.triggerType === 'Routine Bypass'
                              ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                              : 'bg-surface-container-high text-primary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {rule.triggerType === 'Deterministic Match'
                              ? 'flash_on'
                              : rule.triggerType === 'Routine Bypass'
                              ? 'sync_saved_locally'
                              : 'checklist_rtl'}
                          </span>
                          {rule.triggerType}
                        </span>
                      </td>
                      <td className="py-space-md px-space-md align-top max-w-sm">
                        <div className="flex flex-col gap-space-2xs">
                          <div className="bg-surface-container p-space-xs rounded font-code-sm text-code-sm text-on-surface">
                            {rule.condition}
                          </div>
                          <span
                            className={`font-label-sm text-label-sm font-medium ${
                              rule.conditionNote.includes('Auto-Deny')
                                ? 'text-error'
                                : rule.conditionNote.includes('Exception')
                                ? 'text-secondary'
                                : 'text-outline'
                            }`}
                          >
                            {rule.conditionNote}
                          </span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md align-top">
                        <div className="flex flex-col gap-space-2xs">
                          <span className="font-label-md text-label-md text-on-surface font-semibold">{rule.payer}</span>
                          <span className="font-code-sm text-code-sm text-on-surface-variant">{rule.payerCode}</span>
                          <span className="font-label-sm text-label-sm text-outline">Updated: {rule.updatedDate}</span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md align-top">
                        <span
                          className={`inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded-full font-code-sm text-code-sm font-bold ${
                            rule.status === 'Active'
                              ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                              : rule.status === 'Staging'
                              ? 'bg-surface-container-highest text-on-surface-variant'
                              : 'bg-surface-container-high text-outline'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              rule.status === 'Active'
                                ? 'bg-secondary'
                                : rule.status === 'Staging'
                                ? 'bg-outline'
                                : 'bg-outline/50'
                            }`}
                          ></span>
                          {rule.status}
                        </span>
                      </td>
                      <td className="py-space-md px-space-md align-top text-right">
                        <div className="flex items-center justify-end gap-space-xs">
                          <button
                            onClick={() => {
                              scrollToSimulator();
                              if (rule.cpt === '22551') {
                                setSimPt(7);
                                setSimVas(7);
                              } else {
                                setSimPt(12);
                                setSimVas(6);
                              }
                              onShowToast(`Loaded Rule ${rule.code} parameters into simulator`);
                            }}
                            className="p-space-xs rounded-lg hover:bg-surface-container-high text-primary transition-colors"
                            title="Test in Sandbox"
                          >
                            <span className="material-symbols-outlined text-[18px]">play_circle</span>
                          </button>
                          <button
                            onClick={() => onShowToast(`AST logic editor opened for ${rule.code}`)}
                            className="p-space-xs rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
                            title="Edit Logic AST"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => onShowToast(`Dependency graph displayed for ${rule.code}`)}
                            className="p-space-xs rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors"
                            title="View Graph Dependencies"
                          >
                            <span className="material-symbols-outlined text-[18px]">hub</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span>Rows per page: <strong>10</strong></span>
              <span className="text-outline">|</span>
              <span>Index synchronized with Milvus Vector Engine &amp; SQL Policy Graph</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="px-space-sm py-space-xs font-code-sm text-code-sm font-bold bg-primary text-on-primary rounded">
                1
              </span>
              <button
                onClick={() => onShowToast('Page 2')}
                className="px-space-sm py-space-xs rounded bg-surface-container-lowest shadow-sm hover:bg-surface-container-high text-on-surface border border-surface-container"
              >
                2
              </button>
              <button
                onClick={() => onShowToast('Page 3')}
                className="px-space-sm py-space-xs rounded bg-surface-container-lowest shadow-sm hover:bg-surface-container-high text-on-surface border border-surface-container"
              >
                3
              </button>
            </div>
          </div>
        </div>

        {/* Payer Coverage Mandates & Vector RAG Sync Status Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
          {/* Card 1: Payer Sync */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                Payer Guideline Sync
              </span>
              <span className="material-symbols-outlined text-primary text-[20px]">sync</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Automated daily ingestion of clinical coverage bulletins and policy updates.
            </p>
            <div className="flex flex-col gap-space-xs pt-space-2xs">
              <div className="flex items-center justify-between p-space-xs rounded bg-surface-container-low">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-md text-label-md text-on-surface">UnitedHealthcare (UHC)</span>
                </div>
                <span className="font-code-sm text-code-sm text-secondary font-bold">Current (Today 04:00)</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded bg-surface-container-low">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-md text-label-md text-on-surface">Cigna Commercial</span>
                </div>
                <span className="font-code-sm text-code-sm text-secondary font-bold">Current (Yesterday)</span>
              </div>
              <div className="flex items-center justify-between p-space-xs rounded bg-surface-container-low">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span className="font-label-md text-label-md text-on-surface">Anthem / Elevance</span>
                </div>
                <span className="font-code-sm text-code-sm text-error font-bold">1 Conflict Flagged</span>
              </div>
            </div>
          </div>

          {/* Card 2: Deterministic vs RAG Load */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                Deterministic vs RAG Load
              </span>
              <span className="font-code-sm text-code-sm text-secondary font-bold">99.98% Uptime</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Evaluation distribution across fast deterministic rules vs deep LLM RAG pipelines.
            </p>
            <div className="flex items-center gap-space-md pt-space-xs">
              {/* Donut Chart */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="68, 100"
                    strokeLinecap="round"
                    strokeWidth="4.5"
                  />
                  <path
                    className="text-secondary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="32, 100"
                    strokeDashoffset="-68"
                    strokeLinecap="round"
                    strokeWidth="4.5"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-code-sm text-code-sm font-bold text-on-surface">
                  68%
                </div>
              </div>
              <div className="flex flex-col gap-space-2xs text-body-sm font-body-sm flex-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-space-2xs">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>Deterministic
                  </span>
                  <span className="font-code-sm text-code-sm font-bold">68.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-space-2xs">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>RAG / LLM
                  </span>
                  <span className="font-code-sm text-code-sm font-bold">31.6%</span>
                </div>
                <div className="text-label-sm font-label-sm text-outline pt-space-2xs">
                  Cost saving: ~$0.042/eval
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Conflict Detector */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-space-sm border border-surface-container">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Policy Conflict Detector
                </span>
                <span className="w-6 h-6 rounded-full bg-error-container text-error flex items-center justify-center font-bold text-[12px]">
                  !
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <strong>Anthem vs InterQual 2025:</strong> Discrepancy detected on physical therapy requirement prior to cervical spine decompression with documented acute radiculopathy.
              </p>
            </div>
            <div className="flex items-center justify-between pt-space-xs">
              <span className="font-code-sm text-code-sm text-error font-bold">Review Priority: HIGH</span>
              <button
                onClick={() => setIsConflictModalOpen(true)}
                className="px-space-md py-space-xs bg-error text-on-error rounded-lg font-label-sm text-label-sm hover:bg-tertiary transition-all font-semibold"
              >
                Open Conflict Resolver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Resolver Modal */}
      {isConflictModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md animate-in fade-in">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-error-container text-error flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Payer Guideline Conflict Resolver
                  </h3>
                  <span className="font-label-sm text-label-sm text-outline">
                    Anthem CG-SURG-83 vs. InterQual 2025 Standard
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsConflictModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm font-body-sm text-body-sm">
              <div className="p-space-sm bg-surface-container-low rounded-lg">
                <span className="font-bold text-on-surface">Clause Conflict Details:</span>
                <p className="text-on-surface-variant mt-1">
                  Anthem CG-SURG-83 mandates 6 weeks of PT with zero exceptions for radiculopathy unless motor deficit is ≤ grade 3/5. InterQual 2025 permits conservative trial waiver if severe acute unremitting radicular pain with motor deficit ≤ 4/5.
                </p>
              </div>

              <div className="flex flex-col gap-space-xs">
                <span className="font-bold text-on-surface">Resolution Action:</span>
                <label className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low cursor-pointer">
                  <input type="radio" name="resAction" defaultChecked className="text-primary accent-primary" />
                  <span>Enforce Strict Payer Rule (Anthem CG-SURG-83)</span>
                </label>
                <label className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low cursor-pointer">
                  <input type="radio" name="resAction" className="text-primary accent-primary" />
                  <span>Permit InterQual 2025 Clinical Waiver with Peer-to-Peer Flag</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container">
              <button
                onClick={() => setIsConflictModalOpen(false)}
                className="px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface font-label-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsConflictModalOpen(false);
                  onShowToast('Conflict resolution committed to Policy Graph AST');
                }}
                className="px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-label-md font-semibold shadow-sm"
              >
                Commit Rule Amendment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
