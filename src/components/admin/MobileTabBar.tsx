'use client';

import React from 'react';
import Link from 'next/link';
import type { Panel } from './AdminDashboard';

const panelMeta: Record<Panel, { label: string; icon: string }> = {
  overview: { label: 'Overview', icon: '⌂' },
  products: { label: 'Products', icon: '▦' },
  collections: { label: 'Collections', icon: '◇' },
  content: { label: 'Content', icon: '✦' },
};

interface MobileTabBarProps {
  activePanel: Panel;
  onChange: (panel: Panel) => void;
}

export function MobileTabBar({ activePanel, onChange }: MobileTabBarProps) {
  const panels: Panel[] = ['overview', 'products', 'collections', 'content'];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-espresso/10 shadow-lg px-2 pb-2 pt-1 md:hidden"
      role="tablist"
      aria-label="Admin panel navigation"
    >
      <div className="flex items-center justify-around gap-1 max-w-5xl mx-auto">
        {panels.map((panel) => (
          <button
            key={panel}
            onClick={() => onChange(panel)}
            className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all min-w-[60px] ${
              activePanel === panel
                ? 'bg-wine/10 text-wine'
                : 'text-espresso/60 hover:text-espresso hover:bg-espresso/5'
            }`}
            role="tab"
            aria-selected={activePanel === panel}
            aria-label={panelMeta[panel].label}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              {panelMeta[panel].icon}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider font-medium">
              {panelMeta[panel].label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}