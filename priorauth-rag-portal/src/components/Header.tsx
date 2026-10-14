import React from 'react';
import { ViewType } from '../types.ts';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenApiDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenApiDocs,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-inverse-surface text-inverse-on-surface shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      <div className="h-16 w-full px-gutter-lg flex items-center justify-between gap-space-md">
        {/* Left Brand & Engine Status */}
        <div className="flex items-center gap-space-lg">
          <button
            onClick={() => onNavigate('prior-auth-dashboard')}
            className="flex items-center gap-space-sm text-left group focus:outline-none"
          >
            <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md text-headline-md font-bold group-hover:scale-105 transition-transform">
              +
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md leading-none text-inverse-on-surface tracking-tight font-bold">
                PriorAuth RAG Portal
              </span>
              <span className="font-label-sm text-label-sm text-outline-variant uppercase tracking-wider">
                Clinical Decision Support
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-space-2xs bg-surface-container-lowest/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse"></span>
            <span className="font-code-sm text-code-sm text-inverse-on-surface">
              Online - Groq / Llama-3.3 70B RAG
            </span>
          </div>

          <div className="hidden md:flex items-center gap-space-xs text-outline-variant font-label-sm text-label-sm">
            <span className="text-outline-variant/60">/</span>
            <span className="text-inverse-on-surface font-label-md text-label-md">
              Clinical Policy &amp; Coverage Engine
            </span>
          </div>
        </div>

        {/* Right Nav & Reviewer Profile */}
        <div className="flex items-center gap-space-lg">
          <nav className="hidden lg:flex items-center gap-space-xs">
            <button
              onClick={() => onNavigate('medical-policies')}
              className={`px-space-sm py-space-xs font-label-md text-label-md rounded-lg transition-colors ${
                currentView === 'medical-policies'
                  ? 'bg-surface-container-lowest/20 text-inverse-on-surface font-bold'
                  : 'text-outline-variant hover:text-inverse-on-surface hover:bg-surface-container-lowest/10'
              }`}
            >
              Medical Policies
            </button>
            <button
              onClick={() => onNavigate('toc-index')}
              className={`px-space-sm py-space-xs font-label-md text-label-md rounded-lg transition-colors ${
                currentView === 'toc-index'
                  ? 'bg-surface-container-lowest/20 text-inverse-on-surface font-bold'
                  : 'text-outline-variant hover:text-inverse-on-surface hover:bg-surface-container-lowest/10'
              }`}
            >
              TOC Index
            </button>
            <button
              onClick={onOpenApiDocs}
              className="px-space-sm py-space-xs font-label-md text-label-md text-outline-variant hover:text-inverse-on-surface hover:bg-surface-container-lowest/10 rounded-lg transition-colors"
            >
              API Docs
            </button>
          </nav>

          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="font-label-md text-label-md text-inverse-on-surface leading-tight font-semibold">
                Dr. E. Vance
              </span>
              <span className="font-label-sm text-label-sm text-outline-variant">
                Clinical Reviewer
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm font-bold text-xs">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
