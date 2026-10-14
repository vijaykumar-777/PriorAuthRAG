/**
 * PriorAuth RAG Decision Portal
 * Clean, minimal, zero-static clinical decision engine
 */

import React, { useState } from 'react';
import { ToastMessage } from './types.ts';
import { MinimalHeader, MinimalViewType } from './components/MinimalHeader.tsx';
import { MinimalDecisionEngine } from './components/MinimalDecisionEngine.tsx';
import { MinimalPoliciesView } from './components/MinimalPoliciesView.tsx';
import { Toast } from './components/Toast.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<MinimalViewType>('decision-engine');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, icon = 'check_circle', type: ToastMessage['type'] = 'success') => {
    setToast({
      id: `${Date.now()}-${Math.random()}`,
      message,
      icon,
      type,
    });
  };

  return (
    <div className="bg-background min-h-screen text-on-surface font-sans antialiased flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Clean Global Header */}
      <MinimalHeader
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col pb-12">
        {currentView === 'decision-engine' && (
          <MinimalDecisionEngine onShowToast={showToast} />
        )}

        {currentView === 'policies-toc' && (
          <MinimalPoliciesView onShowToast={showToast} />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-surface-container py-6 text-center text-xs text-outline">
        <p>PriorAuth RAG • Multi-Document TOC Routing &amp; Scoped Hybrid Retrieval Engine</p>
      </footer>

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
