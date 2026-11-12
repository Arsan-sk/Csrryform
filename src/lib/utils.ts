// CARRYFORM — General utility functions

/**
 * Format a price amount with currency code.
 * Returns null if price is null/undefined (e.g. enquire-only products).
 */
export function formatPrice(
  amount: number | null | undefined,
  currency = 'INR'
): string | null {
  if (amount == null) return null;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a slugified version of a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Truncate a string to maxLength, adding ellipsis if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Returns "New" badge text for products flagged as new.
 */
export function getProductBadge(flags: { featured: boolean; new: boolean }): string | null {
  if (flags.new) return 'New';
  if (flags.featured) return 'Featured';
  return null;
}

