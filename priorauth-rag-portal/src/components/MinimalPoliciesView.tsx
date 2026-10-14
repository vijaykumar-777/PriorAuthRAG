import React, { useState, useEffect, useMemo } from 'react';

interface PolicyItem {
  doc_key: string;
  display_name: string;
  toc_nodes: number;
  chunks: number;
  status: string;
}

interface TreeNode {
  toc_id?: string;
  heading_level?: number;
  title?: string;
  section_title?: string;
  name?: string;
  id?: string;
  page?: number;
  children?: TreeNode[];
  subsections?: TreeNode[];
}

interface TreeLine {
  id: string;
  rawText: string;
  prefix: string;
  connector: string;
  tocId?: string;
  title: string;
  page?: number;
  depth: number;
  isLast: boolean;
  hasChildren: boolean;
}

interface MinimalPoliciesViewProps {
  onShowToast: (msg: string, icon?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onSelectQueryForPolicy?: (query: string) => void;
}

export const MinimalPoliciesView: React.FC<MinimalPoliciesViewProps> = ({ onShowToast }) => {
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>('Cigna_ACDF');
  const [rawTreeNodes, setRawTreeNodes] = useState<TreeNode[]>([]);
  const [tocLoading, setTocLoading] = useState(false);
  const [tocFilter, setTocFilter] = useState('');
  const [viewMode, setViewMode] = useState<'visual-tree' | 'raw-ascii'>('visual-tree');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/policies')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.policies) {
          setPolicies(data.policies);
        }
      })
      .catch((err) => {
        onShowToast(`Failed to load policies: ${err.message}`, 'error', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedKey) return;
    setTocLoading(true);
    setTocFilter('');
    fetch(`/api/toc?doc_key=${selectedKey}`)
      .then((res) => res.json())
      .then((data) => {
        // Extract the hierarchical tree array from either toc_tree or toc.toc_tree or toc
        const tree =
          data?.toc_tree ||
          data?.toc?.toc_tree ||
          (Array.isArray(data?.toc) ? data?.toc : []);
        setRawTreeNodes(tree);
      })
      .catch((err) => {
        console.error('Error fetching TOC', err);
        setRawTreeNodes([]);
      })
      .finally(() => setTocLoading(false));
  }, [selectedKey]);

  // Build the text format tree structure with tree branch connectors (├──, └──, │)
  const { lines, rawString, totalCount, maxDepth } = useMemo(() => {
    if (!rawTreeNodes || rawTreeNodes.length === 0) {
      return { lines: [], rawString: '', totalCount: 0, maxDepth: 0 };
    }

    const result: TreeLine[] = [];
    const rawLines: string[] = [];
    let count = 0;
    let deepest = 0;

    // Recursive search filter preserving hierarchy branch ancestry
    function filterTree(nodes: TreeNode[], kw: string): TreeNode[] {
      if (!kw.trim()) return nodes;
      const lowerKw = kw.toLowerCase();

      return nodes
        .map((node) => {
          const title = (node.title || node.section_title || node.name || '').toLowerCase();
          const id = (node.toc_id || node.id || '').toLowerCase();
          const matchesSelf = title.includes(lowerKw) || id.includes(lowerKw);

          const childList = node.children || node.subsections || [];
          const filteredChildren = filterTree(childList, kw);

          if (matchesSelf || filteredChildren.length > 0) {
            return {
              ...node,
              children: filteredChildren.length > 0 ? filteredChildren : childList,
            };
          }
          return null;
        })
        .filter(Boolean) as TreeNode[];
    }

    const activeNodes = filterTree(rawTreeNodes, tocFilter);

    function traverse(nodes: TreeNode[], curPrefix: string, depth: number) {
      if (depth > deepest) deepest = depth;

      nodes.forEach((item, index) => {
        count++;
        const isLast = index === nodes.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const subPrefix = curPrefix + (isLast ? '    ' : '│   ');

        const tocId = item.toc_id || item.id;
        const title = item.title || item.section_title || item.name || 'Untitled Section';
        const page = item.page;
        const pageStr = page !== undefined ? ` (p. ${page})` : '';
        const idStr = tocId ? `[${tocId}] ` : '';

        const lineRaw = `${curPrefix}${connector}${idStr}${title}${pageStr}`;
        rawLines.push(lineRaw);

        const children = item.children || item.subsections || [];

        result.push({
          id: `${tocId || 'node'}-${depth}-${index}-${title}`,
          rawText: lineRaw,
          prefix: curPrefix,
          connector,
          tocId,
          title,
          page,
          depth,
          isLast,
          hasChildren: children.length > 0,
        });

        if (children.length > 0) {
          traverse(children, subPrefix, depth + 1);
        }
      });
    }

    traverse(activeNodes, '', 0);

    return {
      lines: result,
      rawString: rawLines.join('\n'),
      totalCount: count,
      maxDepth: deepest,
    };
  }, [rawTreeNodes, tocFilter]);

  // Copy full ASCII tree to clipboard
  const handleCopyTree = () => {
    if (!rawString) return;
    navigator.clipboard.writeText(rawString);
    setCopied(true);
    onShowToast('TOC text tree copied to clipboard', 'content_copy', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy single section node text
  const handleCopyLine = (rawLine: string) => {
    navigator.clipboard.writeText(rawLine);
    onShowToast('Section line copied', 'content_copy', 'info');
  };

  const selectedPolicy = policies.find((p) => p.doc_key === selectedKey);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Registered Coverage Policies &amp; TOC Ontologies
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Hierarchical Table of Contents text tree indexed for surgical &amp; prior auth retrieval.
          </p>
        </div>
        <div className="text-xs font-mono text-outline">
          {policies.length} Active Production Policies
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-outline">Loading registered policies...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Policy Cards List */}
          <div className="lg:col-span-1 flex flex-col space-y-3">
            {policies.map((p) => {
              const isSelected = selectedKey === p.doc_key;
              return (
                <button
                  key={p.doc_key}
                  onClick={() => setSelectedKey(p.doc_key)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col space-y-2 ${
                    isSelected
                      ? 'bg-surface-container-lowest border-primary shadow-xs ring-1 ring-primary'
                      : 'bg-surface-container-low border-surface-container-high hover:border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                      {p.doc_key}
                    </span>
                    <span className="text-xs text-secondary font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {p.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface line-clamp-2">
                    {p.display_name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-outline pt-1">
                    <span>{p.chunks} chunk nodes</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Policy TOC Tree Inspector in Text Format */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xs p-6 flex flex-col space-y-4">
            {/* Header with Title and Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-container">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-outline">
                    TOC Text Tree
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-surface-container-high text-on-surface-variant">
                    {totalCount} sections • depth {maxDepth + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-on-surface mt-0.5">
                  {selectedPolicy?.display_name || selectedKey}
                </h3>
              </div>

              {/* Action Toolbar: Filter, Format Toggle, Copy */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search / Filter in Tree */}
                <div className="relative w-full sm:w-48">
                  <input
                    type="text"
                    value={tocFilter}
                    onChange={(e) => setTocFilter(e.target.value)}
                    placeholder="Filter tree..."
                    className="w-full px-3 py-1.5 pl-8 rounded-lg border border-surface-container-high bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="material-symbols-outlined absolute left-2 top-2 text-outline text-[16px]">
                    search
                  </span>
                  {tocFilter && (
                    <button
                      onClick={() => setTocFilter('')}
                      className="absolute right-2 top-1.5 text-xs text-outline hover:text-on-surface cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg border border-surface-container-high text-xs">
                  <button
                    onClick={() => setViewMode('visual-tree')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      viewMode === 'visual-tree'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="Interactive Text Tree with line highlights"
                  >
                    Tree View
                  </button>
                  <button
                    onClick={() => setViewMode('raw-ascii')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      viewMode === 'raw-ascii'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="Pure Raw ASCII Text"
                  >
                    Raw ASCII
                  </button>
                </div>

                {/* Copy Tree Button */}
                <button
                  onClick={handleCopyTree}
                  disabled={lines.length === 0}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium flex items-center gap-1.5 border border-surface-container-highest transition-colors cursor-pointer disabled:opacity-40"
                  title="Copy whole tree structure"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied!' : 'Copy Tree'}</span>
                </button>
              </div>
            </div>

            {/* Tree Content Area */}
            {tocLoading ? (
              <div className="p-12 text-center text-xs text-outline flex flex-col items-center justify-center space-y-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Parsing and building hierarchical TOC text tree...</span>
              </div>
            ) : lines.length === 0 ? (
              <div className="p-12 text-center text-xs text-outline italic">
                {tocFilter
                  ? `No sections matching "${tocFilter}".`
                  : 'No Table of Contents tree available for this policy.'}
              </div>
            ) : viewMode === 'raw-ascii' ? (
              /* Raw Plaintext ASCII Tree View */
              <div className="relative">
                <pre className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container text-on-surface font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto max-h-[600px] select-all whitespace-pre">
                  {rawString}
                </pre>
              </div>
            ) : (
              /* Visual Text Format Tree */
              <div className="rounded-xl border border-surface-container bg-surface-container-lowest p-4 max-h-[620px] overflow-y-auto overflow-x-auto">
                <div className="font-mono text-xs sm:text-[13px] leading-relaxed select-text space-y-0.5">
                  {lines.map((line) => {
                    const isFilteredMatch =
                      tocFilter &&
                      (line.title.toLowerCase().includes(tocFilter.toLowerCase()) ||
                        (line.tocId && line.tocId.toLowerCase().includes(tocFilter.toLowerCase())));

                    return (
                      <div
                        key={line.id}
                        onClick={() => handleCopyLine(line.rawText)}
                        className={`group flex items-baseline hover:bg-surface-container-low px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          isFilteredMatch ? 'bg-primary-fixed/20 text-on-surface font-medium' : ''
                        }`}
                        title="Click to copy section"
                      >
                        {/* Tree Branch Connector Graphic in Text */}
                        <span className="text-primary/70 font-semibold select-none whitespace-pre">
                          {line.prefix}
                          {line.connector}
                        </span>

                        {/* TOC Section ID Badge */}
                        {line.tocId && (
                          <span className="mr-1.5 px-1.5 py-0.2 rounded text-[11px] font-bold bg-surface-container-high text-primary border border-primary/20 shrink-0">
                            {line.tocId}
                          </span>
                        )}

                        {/* Section Title */}
                        <span
                          className={`text-on-surface flex-1 truncate ${
                            line.depth === 0 ? 'font-bold' : line.depth === 1 ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {line.title}
                        </span>

                        {/* Page Number Tag */}
                        {line.page !== undefined && (
                          <span className="text-[11px] text-outline ml-3 shrink-0 select-none group-hover:text-primary">
                            p. {line.page}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tree Footer / Helper Note */}
            <div className="flex items-center justify-between text-[11px] text-outline pt-2 px-1">
              <span>
                Format: Pure Unicode Text Tree (<code className="font-mono text-primary">├──</code>,{' '}
                <code className="font-mono text-primary">└──</code>,{' '}
                <code className="font-mono text-primary">│</code>)
              </span>
              <span>Click any node to copy section line</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
