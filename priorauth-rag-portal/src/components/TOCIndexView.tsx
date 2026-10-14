import React, { useState } from 'react';
import { ViewType } from '../types.ts';

interface TOCIndexViewProps {
  onShowToast: (msg: string, icon?: string) => void;
  onNavigateToInspector: () => void;
}

export const TOCIndexView: React.FC<TOCIndexViewProps> = ({
  onShowToast,
  onNavigateToInspector,
}) => {
  const [selectedNode, setSelectedNode] = useState('S12.1.1');
  const [filterQuery, setFilterQuery] = useState('Adjacent Segment Disease S12.1');
  const [activeFilter, setActiveFilter] = useState('All Ortho');
  const [isL1Expanded, setIsL1Expanded] = useState(true);
  const [isL2SpineExpanded, setIsL2SpineExpanded] = useState(true);
  const [isL3CervicalExpanded, setIsL3CervicalExpanded] = useState(true);
  const [isL4CMMExpanded, setIsL4CMMExpanded] = useState(true);
  const [showLatentsModal, setShowLatentsModal] = useState(false);

  const handleExpandAll = () => {
    setIsL1Expanded(true);
    setIsL2SpineExpanded(true);
    setIsL3CervicalExpanded(true);
    setIsL4CMMExpanded(true);
    onShowToast('Expanded all ontology hierarchy levels');
  };

  const handleCollapseAll = () => {
    setIsL1Expanded(false);
    setIsL2SpineExpanded(false);
    setIsL3CervicalExpanded(false);
    setIsL4CMMExpanded(false);
    onShowToast('Collapsed ontology tree');
  };

  return (
    <div className="flex flex-col w-full p-gutter-lg space-y-gutter-lg max-w-[1720px] mx-auto">
      {/* Overview Header & RAG Architecture Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-surface-container">
        <div className="flex flex-col gap-space-xs max-w-3xl">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-space-xs py-space-2xs bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm rounded font-bold">
              STAGE-2 RAG ROUTER
            </span>
            <span className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-space-2xs">
              <span className="material-symbols-outlined text-[14px] text-secondary">memory</span>
              Vector Embeddings + Strict Structural Ontology
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Multi-Document TOC Hierarchical Index &amp; Clinical Ontology Router
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Structural roadmap guiding the Stage 2 TOC-guided retrieval routing for high-accuracy guideline localization across payer policies and surgical coverage bulletins.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => onShowToast('Rebuilding multi-document hierarchical graph index...')}
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container text-on-surface font-label-lg text-label-lg rounded-lg hover:bg-surface-container-high transition-colors border border-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            <span>Rebuild Index</span>
          </button>
          <button
            onClick={() => onShowToast('Routing test executed: Top-1 precision 99.4% confirmed')}
            className="flex items-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary font-label-lg text-label-lg rounded-lg hover:bg-primary-container transition-colors shadow-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            <span>Test Route</span>
          </button>
        </div>
      </div>

      {/* Real-time Ontology Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Indexed TOC Anchors
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-xs">
            <span className="font-headline-xl text-headline-xl text-on-surface font-bold">1,842</span>
            <span className="font-code-sm text-code-sm text-secondary font-semibold">+18 added</span>
          </div>
          <div className="mt-space-xs flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>Across 142 Medical Bulletins</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Routing Precision
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-xs">
            <span className="font-headline-xl text-headline-xl text-on-surface font-bold">99.4%</span>
            <span className="font-code-sm text-code-sm text-secondary font-semibold">Stage-2 Top-1</span>
          </div>
          <div className="mt-space-xs flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Validated vs 1,200 Gold Standard Audits</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Avg Traversal Time
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-xs">
            <span className="font-headline-xl text-headline-xl text-on-surface font-bold">1.1s</span>
            <span className="font-code-sm text-code-sm text-primary font-semibold">p95: 1.48s</span>
          </div>
          <div className="mt-space-xs flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>Llama-3.3 70B inference via Groq</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Clinical Taxonomies
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
          </div>
          <div className="mt-space-md flex items-baseline gap-space-xs">
            <span className="font-headline-xl text-headline-xl text-on-surface font-bold">24</span>
            <span className="font-code-sm text-code-sm text-on-surface-variant font-semibold">Anatomical</span>
          </div>
          <div className="mt-space-xs flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>SNOMED CT &amp; CPT-4 Cross-mapped</span>
          </div>
        </div>
      </div>

      {/* Interactive Breadcrumb & Fast Discovery Rail */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm border border-surface-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter TOC anchors by anatomical structure, surgical procedure, or guideline section ID..."
              className="w-full pl-10 pr-space-md py-space-sm bg-surface-container-low text-on-surface placeholder:text-outline rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container-lowest transition-all border border-surface-container"
            />
            <div className="absolute right-space-sm top-1/2 -translate-y-1/2 flex items-center gap-space-2xs pointer-events-none">
              <span className="px-space-xs py-space-2xs bg-surface-container text-on-surface-variant font-code-sm text-code-sm rounded">
                ⌘K
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs overflow-x-auto pb-space-2xs md:pb-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">Filter:</span>
            {['All Ortho', 'Spine Only', 'Cervical Spec', 'Experimental/Investigational'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-space-sm py-space-xs font-label-sm text-label-sm rounded-lg shrink-0 transition-colors ${
                  activeFilter === f
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Hierarchical Breadcrumb Route */}
        <div className="flex items-center gap-space-xs pt-space-xs overflow-x-auto text-on-surface-variant font-label-sm text-label-sm">
          <span className="text-primary font-label-md text-label-md flex items-center gap-space-2xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">folder_open</span>
            Spine Surgery
          </span>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span>Cervical Region</span>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span>Anterior Approach</span>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span>Decompression &amp; Fusion</span>
          <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
          <span className="bg-primary-fixed text-on-primary-fixed px-space-xs py-space-2xs rounded font-code-sm text-code-sm font-semibold">
            Adjacent Segment Disease (S12.1)
          </span>
        </div>
      </div>

      {/* Main Multi-Pane TOC Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        {/* LEFT 7 COLS: Hierarchical TOC Tree Explorer */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-surface-container">
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[22px]">account_tree</span>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Ontology Tree Explorer</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Deterministic section nodes resolved from Payer Medical Policy CMM-601
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                onClick={handleExpandAll}
                className="px-space-sm py-space-2xs text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm bg-surface-container rounded hover:bg-surface-container-high transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={handleCollapseAll}
                className="px-space-sm py-space-2xs text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm bg-surface-container rounded hover:bg-surface-container-high transition-colors"
              >
                Collapse
              </button>
            </div>
          </div>

          {/* Tree Nodes Container */}
          <div className="space-y-space-xs font-body-sm text-body-sm">
            {/* Level 1 Node */}
            <div className="rounded-lg bg-surface-container-low p-space-xs border border-surface-container">
              <div
                onClick={() => setIsL1Expanded(!isL1Expanded)}
                className="flex items-center justify-between p-space-xs text-on-surface cursor-pointer hover:bg-surface-container rounded select-none"
              >
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    {isL1Expanded ? 'indeterminate_check_box' : 'add_box'}
                  </span>
                  <span className="font-label-lg text-label-lg font-bold">
                    [Level 1] Musculoskeletal &amp; Orthopedic Surgery
                  </span>
                </div>
                <span className="font-code-sm text-code-sm text-on-surface-variant px-space-xs py-space-2xs bg-surface-container rounded">
                  384 nodes
                </span>
              </div>

              {/* Level 2 Spine */}
              {isL1Expanded && (
                <div className="pl-space-md mt-space-2xs space-y-space-2xs animate-in fade-in">
                  <div
                    onClick={() => setIsL2SpineExpanded(!isL2SpineExpanded)}
                    className="flex items-center justify-between p-space-xs text-on-surface cursor-pointer hover:bg-surface-container rounded select-none"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        {isL2SpineExpanded ? 'indeterminate_check_box' : 'add_box'}
                      </span>
                      <span className="font-label-md text-label-md font-semibold">
                        [Level 2] Spine &amp; Neural Axis Interventions
                      </span>
                    </div>
                    <span className="font-code-sm text-code-sm text-on-surface-variant px-space-xs py-space-2xs bg-surface-container rounded">
                      192 nodes
                    </span>
                  </div>

                  {/* Level 3 Cervical */}
                  {isL2SpineExpanded && (
                    <div className="pl-space-md space-y-space-2xs animate-in fade-in">
                      <div
                        onClick={() => setIsL3CervicalExpanded(!isL3CervicalExpanded)}
                        className="flex items-center justify-between p-space-xs text-on-surface cursor-pointer hover:bg-surface-container rounded select-none"
                      >
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            {isL3CervicalExpanded ? 'indeterminate_check_box' : 'add_box'}
                          </span>
                          <span className="font-label-md text-label-md font-semibold">
                            [Level 3] Cervical Spine Procedures
                          </span>
                        </div>
                        <span className="font-code-sm text-code-sm text-on-surface-variant px-space-xs py-space-2xs bg-surface-container rounded">
                          48 nodes
                        </span>
                      </div>

                      {/* Level 4 CMM-601 Policy */}
                      {isL3CervicalExpanded && (
                        <div className="pl-space-md space-y-space-xs animate-in fade-in">
                          <div
                            onClick={() => setIsL4CMMExpanded(!isL4CMMExpanded)}
                            className="flex items-center justify-between p-space-sm bg-surface-container-highest/60 rounded-lg text-on-surface cursor-pointer hover:bg-surface-container-highest transition-colors select-none"
                          >
                            <div className="flex items-center gap-space-xs">
                              <span className="material-symbols-outlined text-[18px] text-primary">menu_book</span>
                              <span className="font-label-lg text-label-lg text-primary font-bold">
                                CMM-601: Anterior Cervical Discectomy &amp; Fusion (ACDF)
                              </span>
                            </div>
                            <span className="px-space-xs py-space-2xs bg-secondary-fixed text-on-secondary-fixed font-code-sm text-code-sm rounded font-bold">
                              Active Policy
                            </span>
                          </div>

                          {/* Level 5 Policy Sections */}
                          {isL4CMMExpanded && (
                            <div className="pl-space-md space-y-space-2xs pt-space-xs animate-in fade-in">
                              {/* S1.0 */}
                              <div
                                onClick={() => {
                                  setSelectedNode('S1.0');
                                  onShowToast('Loaded Section S1.0 Node details');
                                }}
                                className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant"
                              >
                                <div className="flex items-center gap-space-sm">
                                  <span className="material-symbols-outlined text-[16px] text-outline">description</span>
                                  <span className="font-code-sm text-code-sm font-semibold">S1.0</span>
                                  <span>Patient Eligibility &amp; Conservative Mandates</span>
                                </div>
                                <span className="font-code-sm text-code-sm text-outline">6 Rules</span>
                              </div>

                              {/* S4.2 */}
                              <div
                                onClick={() => {
                                  setSelectedNode('S4.2');
                                  onShowToast('Loaded Section S4.2 Node details');
                                }}
                                className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant"
                              >
                                <div className="flex items-center gap-space-sm">
                                  <span className="material-symbols-outlined text-[16px] text-outline">description</span>
                                  <span className="font-code-sm text-code-sm font-semibold">S4.2</span>
                                  <span>Radiculopathy Indications (Primary vs Revision)</span>
                                </div>
                                <span className="font-code-sm text-code-sm text-outline">4 Rules</span>
                              </div>

                              {/* S12.1 Active Focus Node */}
                              <div className="bg-primary/10 rounded-lg p-space-xs border border-primary/20">
                                <div className="flex items-center justify-between p-space-xs rounded bg-primary text-on-primary">
                                  <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                    <span className="font-code-sm text-code-sm font-bold">S12.1</span>
                                    <span className="font-label-md text-label-md font-semibold">
                                      Adjacent Segment Disease (ASD Criteria)
                                    </span>
                                  </div>
                                  <span className="px-space-xs py-space-2xs bg-on-primary/20 text-on-primary font-code-sm text-code-sm rounded uppercase tracking-wider font-bold">
                                    Routing Target
                                  </span>
                                </div>

                                {/* Sub-criteria items */}
                                <div className="pl-space-lg pt-space-xs space-y-space-2xs">
                                  {/* S12.1.1 Selected */}
                                  <div
                                    onClick={() => setSelectedNode('S12.1.1')}
                                    className={`flex items-center justify-between p-space-sm rounded-md shadow-sm cursor-pointer transition-colors ${
                                      selectedNode === 'S12.1.1'
                                        ? 'bg-surface-container-lowest border-2 border-primary'
                                        : 'bg-surface hover:bg-surface-container'
                                    }`}
                                  >
                                    <div className="flex items-center gap-space-xs">
                                      <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                                      <span className="font-code-sm text-code-sm font-bold text-primary">S12.1.1</span>
                                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                                        Radiculopathy Sub-criteria
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-space-xs">
                                      <span className="font-code-sm text-code-sm text-on-surface-variant font-mono">
                                        #TOC-S12.1.1
                                      </span>
                                      <span className="material-symbols-outlined text-[18px] text-primary">
                                        check_circle
                                      </span>
                                    </div>
                                  </div>

                                  {/* S12.1.2 */}
                                  <div
                                    onClick={() => {
                                      setSelectedNode('S12.1.2');
                                      onShowToast('Selected S12.1.2 Myelopathy Exception Path');
                                    }}
                                    className={`flex items-center justify-between p-space-sm rounded-md transition-colors cursor-pointer ${
                                      selectedNode === 'S12.1.2'
                                        ? 'bg-surface-container-lowest border-2 border-primary'
                                        : 'bg-surface-container-low hover:bg-surface-container'
                                    }`}
                                  >
                                    <div className="flex items-center gap-space-xs">
                                      <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                                      <span className="font-code-sm text-code-sm font-semibold text-on-surface">
                                        S12.1.2
                                      </span>
                                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                                        Myelopathy Exception Path
                                      </span>
                                    </div>
                                    <span className="font-code-sm text-code-sm text-outline-variant font-mono">
                                      #TOC-S12.1.2
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* S18.3 Node */}
                              <div
                                onClick={() => {
                                  setSelectedNode('S18.3');
                                  onShowToast('Selected S18.3 Contraindications');
                                }}
                                className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface-variant"
                              >
                                <div className="flex items-center gap-space-sm">
                                  <span className="material-symbols-outlined text-[16px] text-tertiary">
                                    do_not_disturb_on
                                  </span>
                                  <span className="font-code-sm text-code-sm font-semibold text-tertiary">S18.3</span>
                                  <span>Absolute Non-Coverage Contraindications</span>
                                </div>
                                <span className="font-code-sm text-code-sm text-tertiary px-space-xs py-space-2xs bg-tertiary-fixed rounded font-semibold">
                                  Exclusions
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sibling Level 2 Branches */}
                  <div
                    onClick={() => onShowToast('Navigating to Lumbar & Lumbosacral Interventions (112 nodes)')}
                    className="flex items-center justify-between p-space-xs text-on-surface-variant cursor-pointer hover:bg-surface-container rounded opacity-75"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[18px] text-outline">add_box</span>
                      <span className="font-body-sm text-body-sm">[Level 2] Lumbar &amp; Lumbosacral Interventions</span>
                    </div>
                    <span className="font-code-sm text-code-sm text-outline">112 nodes</span>
                  </div>

                  <div
                    onClick={() => onShowToast('Navigating to Thoracic Decompression & Scoliosis (80 nodes)')}
                    className="flex items-center justify-between p-space-xs text-on-surface-variant cursor-pointer hover:bg-surface-container rounded opacity-75"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[18px] text-outline">add_box</span>
                      <span className="font-body-sm text-body-sm">[Level 2] Thoracic Decompression &amp; Scoliosis</span>
                    </div>
                    <span className="font-code-sm text-code-sm text-outline">80 nodes</span>
                  </div>
                </div>
              )}
            </div>

            {/* Level 1 Sibling */}
            <div
              onClick={() => onShowToast('Cardiovascular & Endovascular Therapies (520 nodes)')}
              className="rounded-lg bg-surface-container-low p-space-xs border border-surface-container cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center justify-between p-space-xs text-on-surface-variant opacity-75">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-outline">add_box</span>
                  <span className="font-label-lg text-label-lg">[Level 1] Cardiovascular &amp; Endovascular Therapies</span>
                </div>
                <span className="font-code-sm text-code-sm text-outline px-space-xs py-space-2xs bg-surface-container rounded">
                  520 nodes
                </span>
              </div>
            </div>
          </div>

          {/* Quick Traversal Diagnostics */}
          <div className="p-space-md bg-surface-container-low rounded-lg flex items-center justify-between text-on-surface-variant text-label-sm font-label-sm border border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[18px] text-secondary">alt_route</span>
              <span>Depth: 5 levels • Branch factor: 3.8 avg • Resolution: Instant</span>
            </div>
            <span className="font-code-sm text-code-sm text-on-surface font-mono">TOC SHA256: 7f83b2...a4</span>
          </div>
        </div>

        {/* RIGHT 5 COLS: Selected Node Inspector Panel */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Node Metadata Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-surface-container">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                  Node Details &amp; Semantic Mapping
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-space-2xs font-bold">
                  {selectedNode === 'S12.1.1'
                    ? '[TOC: S12.1.1] Radiculopathy Sub-criteria'
                    : selectedNode === 'S12.1.2'
                    ? '[TOC: S12.1.2] Myelopathy Exception Path'
                    : `[TOC: ${selectedNode}] Coverage Node`}
                </h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-space-xs py-space-2xs bg-secondary-fixed text-on-secondary-fixed font-code-sm text-code-sm font-bold rounded">
                  0.964 SCORE
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-2xs">
                  Top-1 Confidence
                </span>
              </div>
            </div>

            {/* Node Attributes Grid */}
            <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-md rounded-lg text-body-sm font-body-sm border border-surface-container">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Parent Node</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  Cervical Spine Procedures (CMM-601)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Node Unique Identifier</span>
                <span className="font-code-sm text-code-sm text-on-surface font-mono">#{selectedNode}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Ontology Hierarchy Level</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Level 5 (Sub-leaf Criterion)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Target Guideline Offset</span>
                <span className="font-code-sm text-code-sm text-on-surface font-mono">Page 14, Paras 3-7</span>
              </div>
            </div>

            {/* Semantic Routing Rules: Code Mapping */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Clinical Billing Cross-References
              </span>
              <div className="flex flex-wrap gap-space-xs">
                <span className="px-space-xs py-space-2xs bg-primary-fixed text-on-primary-fixed rounded font-code-sm text-code-sm font-medium">
                  CPT 22551 (Primary ACDF)
                </span>
                <span className="px-space-xs py-space-2xs bg-primary-fixed text-on-primary-fixed rounded font-code-sm text-code-sm font-medium">
                  CPT 22554
                </span>
                <span className="px-space-xs py-space-2xs bg-primary-fixed text-on-primary-fixed rounded font-code-sm text-code-sm font-medium">
                  CPT 63075
                </span>
                <span className="px-space-xs py-space-2xs bg-surface-container text-on-surface-variant rounded font-code-sm text-code-sm font-medium">
                  ICD-10 M50.12 (Disc Radiculopathy)
                </span>
                <span className="px-space-xs py-space-2xs bg-surface-container text-on-surface-variant rounded font-code-sm text-code-sm font-medium">
                  ICD-10 M50.22
                </span>
              </div>
            </div>

            {/* RAG Prompt Template Engine Slot */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                  Stage-2 Prompt Template (Groq/Llama-3.3 70B)
                </span>
                <span className="font-code-sm text-code-sm text-secondary font-bold">Ready</span>
              </div>
              <div className="bg-surface-container-highest p-space-md rounded-lg font-code-sm text-code-sm text-on-surface overflow-x-auto border border-surface-container-highest">
                <pre className="font-code-sm text-code-sm whitespace-pre-wrap leading-relaxed text-on-surface-variant">
                  <span className="text-primary font-bold">SYSTEM:</span> You are a clinical reviewer extracting evidence for TOC Node S12.1.1 (Adjacent Segment Radiculopathy).{'\n'}
                  <span className="text-primary font-bold">CONTEXT:</span> [Guideline CMM-601:S12.1.1 Excerpt]{'\n'}
                  <span className="text-primary font-bold">EVALUATE:</span> Does the clinical documentation contain:{'\n'}
                  {'  '}1) Persistent nerve root compression signs verified on MRI/CT?{'\n'}
                  {'  '}2) Failure of &gt;= 6 weeks conservative therapy at adjacent index level?{'\n'}
                  <span className="text-secondary font-bold">OUTPUT:</span> JSON &#123; "satisfied": bool, "confidence": float, "citation_spans": [] &#125;
                </pre>
              </div>
            </div>

            {/* Action Dispatch Bar */}
            <div className="flex flex-col sm:flex-row gap-space-sm pt-space-xs">
              <button
                onClick={onNavigateToInspector}
                className="flex-1 flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary font-label-lg text-label-lg rounded-lg hover:bg-primary-container transition-colors shadow-sm font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                <span>Open in Guideline Inspector</span>
              </button>
              <button
                onClick={() => onShowToast('Executed test evaluation query against TOC node')}
                className="flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-surface-container text-on-surface font-label-lg text-label-lg rounded-lg hover:bg-surface-container-high transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                <span>Execute Test Eval Query</span>
              </button>
            </div>
          </div>

          {/* Stage-2 Routing Confidence Chart & Diagnostics */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Candidate Section Ranking
                </h4>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Top 3 Route Alternatives</span>
            </div>
            <div className="space-y-space-sm">
              {/* Rank 1: S12.1.1 */}
              <div className="flex flex-col gap-space-2xs">
                <div className="flex justify-between items-center text-label-sm font-label-sm">
                  <span className="font-semibold text-on-surface">1. [S12.1.1] Radiculopathy Sub-criteria (Selected)</span>
                  <span className="font-code-sm text-code-sm text-primary font-bold">0.964</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '96.4%' }}></div>
                </div>
              </div>
              {/* Rank 2: S12.1.2 */}
              <div className="flex flex-col gap-space-2xs">
                <div className="flex justify-between items-center text-label-sm font-label-sm">
                  <span className="text-on-surface-variant">2. [S12.1.2] Myelopathy Exception Path</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant font-bold">0.681</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-outline-variant h-full rounded-full" style={{ width: '68.1%' }}></div>
                </div>
              </div>
              {/* Rank 3: S4.2 */}
              <div className="flex flex-col gap-space-2xs">
                <div className="flex justify-between items-center text-label-sm font-label-sm">
                  <span className="text-on-surface-variant">3. [S4.2] Radiculopathy Indications (Primary vs Revision)</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant font-bold">0.419</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-outline-variant h-full rounded-full" style={{ width: '41.9%' }}></div>
                </div>
              </div>
            </div>
            <div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-[14px] text-secondary">check</span>
                Routing Entropy Score: 0.12 (Optimal)
              </span>
              <button
                onClick={() => setShowLatentsModal(true)}
                className="text-primary hover:underline font-label-sm text-label-sm font-semibold"
              >
                View Vector Latents
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Latents Modal */}
      {showLatentsModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md animate-in fade-in">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[22px]">scatter_plot</span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Vector Latents &amp; PCA Embeddings
                </h3>
              </div>
              <button
                onClick={() => setShowLatentsModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              High-dimensional 1536-D embeddings projected onto 2D manifold for clinical distance validation.
            </p>
            <div className="bg-inverse-surface text-inverse-on-surface p-space-md rounded-xl font-code-sm text-code-sm overflow-x-auto max-h-56">
              <pre>{`Node [S12.1.1] Latent Vector Snippet:
[-0.0412, 0.0892, 0.0034, -0.1983, 0.4912, 0.1102, -0.0543, ...]
Norm: 1.0000000 | Dimension: 1536
Nearest Neighbors:
1. S12.1.2 - Distance: 0.0588
2. S4.2    - Distance: 0.5810
3. S18.3   - Distance: 1.2840`}</pre>
            </div>
            <div className="flex justify-end pt-space-xs">
              <button
                onClick={() => setShowLatentsModal(false)}
                className="px-space-md py-space-sm bg-primary text-on-primary rounded-lg font-label-md font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
