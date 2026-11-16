'use client';

import React from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  totalFiltered: number;
  onActivate: () => void;
  onDeactivate: () => void;
  onMarkFeatured: () => void;
  onRemoveFeatured: () => void;
  onMarkNew: () => void;
  onRemoveNew: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionsBar({
  selectedCount,
  totalFiltered,
  onActivate,
  onDeactivate,
  onMarkFeatured,
  onRemoveFeatured,
  onMarkNew,
  onRemoveNew,
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
          className="text-xs text-ivory/70 hover:text-ivory underline ml-2"
        >
          Deselect all
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center border border-ivory/20 rounded-sm overflow-hidden text-xs">
          <button
            type="button"
            onClick={onActivate}
            className="px-2.5 py-1.5 hover:bg-ivory/15 transition-colors border-r border-ivory/20"
            title="Make all selected products active"
          >
            Activate
          </button>
          <button
            type="button"
            onClick={onDeactivate}
            className="px-2.5 py-1.5 hover:bg-ivory/15 transition-colors text-ivory/80"
            title="Hide all selected products from showroom"
          >
            Deactivate
          </button>
        </div>

        <div className="flex items-center border border-ivory/20 rounded-sm overflow-hidden text-xs">
          <button
            type="button"
            onClick={onMarkFeatured}
            className="px-2.5 py-1.5 hover:bg-ivory/15 transition-colors border-r border-ivory/20"
            title="Mark selected as featured"
          >
            + Featured
          </button>
          <button
            type="button"
            onClick={onRemoveFeatured}
            className="px-2.5 py-1.5 hover:bg-ivory/15 transition-colors text-ivory/80"
            title="Remove from featured"
          >
            - Featured
          </button>
        </div>

        <div className="flex items-center border border-ivory/20 rounded-sm overflow-hidden text-xs">
          <button
            type="button"
            onClick={onMarkNew}
            className="px-2.5 py-1.5 hover:bg-ivory/15 transition-colors border-r border-ivory/20"
            title="Badge selected as new"
          >
            + New
          </button>
          <button
            type="button"
            onClick={onRemoveNew}
            className="px-2.5 py-1.5 hover:bg-ivory/15 transition-colors text-ivory/80"
            title="Remove new badge"
          >
            - New
          </button>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-1.5 bg-wine text-white text-xs font-medium rounded-sm hover:bg-wine/90 transition-colors ml-1 shadow-xs"
        >
          Delete ({selectedCount})
        </button>
      </div>
    </div>
  );
}
