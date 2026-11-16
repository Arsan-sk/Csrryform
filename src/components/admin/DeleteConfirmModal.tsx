'use client';

import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemCount?: number;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  title = 'Delete Product',
  itemCount = 1,
  itemName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="admin-modal max-w-md w-full border border-wine/30 bg-ivory p-6 sm:p-8 shadow-2xl rounded-sm">
        <div className="flex items-start gap-4">
          <span
            className="w-10 h-10 rounded-full bg-wine/15 text-wine flex items-center justify-center font-bold text-lg flex-shrink-0"
            aria-hidden="true"
          >
            ✕
          </span>
          <div className="flex-1">
            <h2 id="delete-dialog-title" className="font-serif text-2xl text-espresso">
              {title}
            </h2>
            <p className="text-sm text-espresso/70 mt-2 leading-relaxed">
              {itemCount > 1 ? (
                <>
                  Are you sure you want to permanently delete <strong>{itemCount} selected products</strong> from your local demonstration catalogue?
                </>
              ) : (
                <>
                  Are you sure you want to delete <strong>&ldquo;{itemName}&rdquo;</strong> from your local demonstration catalogue?
                </>
              )}
            </p>
            <p className="text-xs text-wine/80 font-mono mt-3 bg-wine/5 p-2 rounded-sm border border-wine/10">
              Note: This action modifies your browser&apos;s local storage state. You can restore original sample data at any time via &ldquo;Reset demo content&rdquo;.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-espresso/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="admin-secondary px-4 py-2 text-sm text-espresso hover:bg-espresso/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium bg-wine text-white rounded-sm hover:bg-wine/90 active:scale-98 transition-all disabled:opacity-50"
          >
            {isDeleting ? 'Deleting…' : itemCount > 1 ? `Delete ${itemCount} Items` : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
