// Money is stored everywhere as integer cents to avoid floating-point rounding
// bugs (e.g. 0.1 + 0.2). Conversions to/from dollars happen only at the UI edge.

/**
 * Parse a user-entered dollar string (e.g. "100", "99.50") into integer cents.
 * Returns NaN for anything that isn't a finite number.
 */
export function dollarsToCents(input: string | number): number {
  const n = typeof input === 'number' ? input : parseFloat(input.trim())
  if (!Number.isFinite(n)) return NaN
  return Math.round(n * 100)
}

/** Format integer cents as a US dollar string, e.g. 40000 -> "$400.00". */
export function formatCents(cents: number): string {
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const dollars = Math.floor(abs / 100)
  const remainder = abs % 100
  return `${sign}$${dollars.toLocaleString('en-US')}.${remainder
    .toString()
    .padStart(2, '0')}`
}
