/**
 * Utility functions for Indian Rupee (INR) currency formatting
 */

/**
 * Format numbers according to the Indian numbering system (Lakhs and Crores)
 * e.g., 48500000 -> ₹4.85 Cr
 *       350000 -> ₹3.50 L
 *       45000 -> ₹45,000
 */
export function formatINR(val: number, options?: { compact?: boolean }): string {
  if (isNaN(val)) return '₹0';

  if (options?.compact !== false) {
    if (val >= 10000000) {
      const cr = val / 10000000;
      return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      const l = val / 100000;
      return `₹${l % 1 === 0 ? l : l.toFixed(2)} L`;
    }
  }

  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}

/**
 * Format full amount with Indian comma separation
 * e.g., 48500000 -> ₹4,85,00,000
 */
export function formatIndianNumber(val: number): string {
  if (isNaN(val)) return '₹0';
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}
