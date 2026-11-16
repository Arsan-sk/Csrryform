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
            className="w-11 h-11 rounded-full bg-wine/15 text-wine flex items-center justify-center font-bold text-xl flex-shrink-0"
            aria-hidden="true"
          >
            {/* Clear Trash/Delete Icon */}
            <svg
              className="w-5 h-5 text-wine"
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
          </span>
          <div className="flex-1">
            <h2 id="delete-dialog-title" className="font-serif text-2xl text-espresso">
              {title}
            </h2>
            <p className="text-sm text-espresso/70 mt-2 leading-relaxed">
              {itemCount > 1 ? (
                <>
                  Are you sure you want to permanently delete <strong>{itemCount} selected products</strong> from the catalogue?
                </>
              ) : (
                <>
                  Are you sure you want to delete <strong>&ldquo;{itemName}&rdquo;</strong> from the catalogue?
                </>
              )}
            </p>
            <p className="text-xs text-wine/80 font-mono mt-3 bg-wine/5 p-2 rounded-sm border border-wine/10">
              Note: This action permanently removes the selected item(s). You can restore original sample demo data at any time via &ldquo;Reset demo content&rdquo;.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-espresso/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="admin-secondary px-4 py-2 text-sm text-espresso hover:bg-espresso/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium bg-wine text-white rounded-sm hover:bg-wine/90 active:scale-98 transition-all disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <svg
              className="w-4 h-4"
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
            <span>{isDeleting ? 'Deleting…' : itemCount > 1 ? `Delete ${itemCount} Items` : 'Delete Permanently'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
