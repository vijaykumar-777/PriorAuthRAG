import React, { useEffect } from 'react';
import { ToastMessage } from '../types.ts';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-xl flex items-center gap-space-sm transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <span className="material-symbols-outlined text-secondary text-[20px]">
        {toast.icon || 'check_circle'}
      </span>
      <span className="font-body-sm text-body-sm font-medium">
        {toast.message}
      </span>
      <button
        onClick={onClose}
        className="ml-2 text-outline-variant hover:text-inverse-on-surface p-1 rounded focus:outline-none"
        aria-label="Close notification"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};
