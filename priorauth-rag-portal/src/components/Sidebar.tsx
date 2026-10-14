import React from 'react';
import { ViewType } from '../types.ts';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

interface NavItem {
  id: ViewType;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'prior-auth-dashboard', label: 'Active Authorizations', icon: 'verified' },
  { id: 'clinical-guidelines-rag', label: 'Guideline Inspector', icon: 'library_books' },
  { id: 'coverage-rules', label: 'Coverage Rules', icon: 'rule' },
  { id: 'medical-policies', label: 'Medical Policies', icon: 'menu_book' },
  { id: 'toc-index', label: 'TOC Index', icon: 'view_list' },
  { id: 'audit-trail', label: 'Clinical Audit Log', icon: 'history' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex flex-col justify-between py-space-md px-space-sm overflow-y-auto">
      <div className="flex flex-col gap-space-sm">
        <div className="px-space-sm py-space-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Review Workflows
          </span>
        </div>

        <nav className="flex flex-col gap-space-2xs">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-all font-body-sm text-body-sm w-full ${
                  isActive
                    ? 'bg-primary text-on-primary font-label-lg shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-space-xs p-space-sm bg-surface-container rounded-lg border border-surface-container-high/60">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface font-semibold">
            RAG Model Engine
          </span>
          <span className="font-code-sm text-code-sm text-secondary font-bold">
            Active
          </span>
        </div>
        <span className="font-code-sm text-code-sm text-on-surface-variant">
          v3.4.1-rc • groq-llama-70b
        </span>
      </div>
    </aside>
  );
};
