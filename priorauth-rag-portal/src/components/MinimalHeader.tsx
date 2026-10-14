import React from 'react';

export type MinimalViewType = 'decision-engine' | 'policies-toc';

interface MinimalHeaderProps {
  currentView: MinimalViewType;
  onNavigate: (view: MinimalViewType) => void;
  onOpenApiDocs?: () => void;
}

export const MinimalHeader: React.FC<MinimalHeaderProps> = ({
  currentView,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md ring-2 ring-cyan-400/40">
            PA
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-on-surface tracking-tight leading-tight flex items-center gap-2">
              PriorAuth RAG
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-primary text-white rounded-full">v2.0</span>
            </span>
            <span className="text-[11px] font-semibold text-primary tracking-wide uppercase">
              Clinical Decision Support Engine
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 bg-surface-container p-1 rounded-2xl border-2 border-surface-container-highest shadow-inner">
          <button
            onClick={() => onNavigate('decision-engine')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              currentView === 'decision-engine'
                ? 'bg-primary text-white shadow-md'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">stethoscope</span>
            <span>Decision Engine</span>
          </button>

          <button
            onClick={() => onNavigate('policies-toc')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              currentView === 'policies-toc'
                ? 'bg-primary text-white shadow-md'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">library_books</span>
            <span>Policies &amp; TOC</span>
          </button>
        </nav>

        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 border-2 border-emerald-400/60 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-emerald-950 font-bold text-xs tracking-tight">
            Online • Qwen 3.8-27b
          </span>
        </div>
      </div>
    </header>
  );
};
