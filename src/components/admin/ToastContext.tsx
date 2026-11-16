'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (type: ToastType, message: string, title?: string) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message, title }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4200);
  }, [removeToast]);

  const success = useCallback((message: string, title?: string) => addToast('success', message, title), [addToast]);
  const error = useCallback((message: string, title?: string) => addToast('error', message, title), [addToast]);
  const warning = useCallback((message: string, title?: string) => addToast('warning', message, title), [addToast]);
  const info = useCallback((message: string, title?: string) => addToast('info', message, title), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[70] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const borderStyles: Record<ToastType, string> = {
    success: 'border-sage/50 bg-ivory text-espresso shadow-lg',
    error: 'border-wine/50 bg-ivory text-espresso shadow-lg',
    warning: 'border-brass/50 bg-ivory text-espresso shadow-lg',
    info: 'border-espresso/30 bg-ivory text-espresso shadow-lg',
  };

  const badgeStyles: Record<ToastType, string> = {
    success: 'bg-sage/20 text-[#445237]',
    error: 'bg-wine/15 text-wine',
    warning: 'bg-brass/25 text-[#73582e]',
    info: 'bg-espresso/15 text-espresso',
  };

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto border rounded-sm p-4 flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${borderStyles[toast.type]}`}
    >
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${badgeStyles[toast.type]}`}
        aria-hidden="true"
      >
        {icons[toast.type]}
      </span>
      <div className="flex-1 min-w-0">
        {toast.title && <p className="text-xs font-serif font-bold tracking-wide mb-0.5">{toast.title}</p>}
        <p className="text-xs leading-relaxed text-espresso/80">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-espresso/40 hover:text-espresso text-base leading-none p-1 -mr-1 -mt-1 transition-colors"
      >
        ×
      </button>
    </div>
  );
}
