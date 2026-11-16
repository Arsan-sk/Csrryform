'use client';

import React from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  totalFiltered: number;
  onAssignSection?: (section: 'showroom' | 'selectedPieces' | 'artGallery') => void;
  onRemoveFromSections?: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionsBar({
  selectedCount,
  totalFiltered,
  onAssignSection,
  onRemoveFromSections,
  onDelete,
  onClear,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="bg-espresso text-ivory p-3 sm:px-5 sm:py-3.5 rounded-sm shadow-xl flex flex-wrap items-center justify-between gap-3 mb-4 sticky top-4 z-30 border border-brass/30 animate-in fade-in slide-in-from-top-2 duration-200"
      role="region"
      aria-label="Bulk actions toolbar"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-brass font-bold">
          {selectedCount} Selected
        </span>
        <span className="text-xs text-ivory/50 hidden sm:inline">
          (of {totalFiltered} filtered items)
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-ivory/70 hover:text-ivory underline ml-2 cursor-pointer"
        >
          Deselect all
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onAssignSection && (
          <div className="flex items-center border border-ivory/20 rounded-sm overflow-hidden text-xs">
            <span className="px-2.5 py-1.5 bg-ivory/10 text-ivory/70 border-r border-ivory/20 font-mono text-[11px]">
              Assign to:
            </span>
            <button
              type="button"
              onClick={() => onAssignSection('showroom')}
              className="px-2.5 py-1.5 hover:bg-ivory/15 transition-colors border-r border-ivory/20 cursor-pointer"
              title="Add eligible selected products to Chapter 4 Showroom"
            >
              Showroom
            </button>
            <button
              type="button"
              onClick={() => onAssignSection('selectedPieces')}
              className="px-2.5 py-1.5 hover:bg-ivory/15 transition-colors border-r border-ivory/20 cursor-pointer"
              title="Add eligible selected products to Selected Pieces (Max 6)"
            >
              Selected Pieces
            </button>
            <button
              type="button"
              onClick={() => onAssignSection('artGallery')}
              className="px-2.5 py-1.5 hover:bg-ivory/15 transition-colors cursor-pointer"
              title="Add eligible selected products to Art Gallery (Max 3)"
            >
              Art Gallery
            </button>
          </div>
        )}

        {onRemoveFromSections && (
          <button
            type="button"
            onClick={onRemoveFromSections}
            className="px-3 py-1.5 text-xs text-ivory/80 hover:text-ivory border border-ivory/20 rounded-sm hover:bg-ivory/10 transition-colors cursor-pointer"
            title="Remove selected products from all landing page sections"
          >
            Clear Sections
          </button>
        )}

        {/* Prominent Trash Delete Action Button */}
        <button
          type="button"
          onClick={onDelete}
          className="px-3.5 py-1.5 text-xs font-medium bg-wine text-white rounded-sm hover:bg-wine/90 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto sm:ml-0"
          title="Delete selected products"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Delete ({selectedCount})</span>
        </button>
      </div>
    </div>
  );
}
