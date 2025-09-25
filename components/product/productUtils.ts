// components/product/productUtils.ts

// ---------- Formatting ----------
export function formatNumber(value: number | string, digits: number = 0): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(n)) return digits > 0 ? "0.0".padEnd(2 + digits, "0") : "0";
  return n.toFixed(digits);
}

// ---------- Stats Types ----------
export type ColumnStat = {
  min: number;
  max: number;
  mean: number;
};

export type ColumnStatsMap = Record<string, ColumnStat>;

// ---------- Stats Computation ----------
/**
 * Compute min/max/mean for provided numeric columns.
 * Non-finite values are ignored.
 */
export function getColumnStats<T extends Record<string, any>>(
  rows: T[],
  numericColumns: string[]
): ColumnStatsMap {
  const stats: ColumnStatsMap = {};

  for (const col of numericColumns) {
    const vals: number[] = [];
    for (const r of rows) {
      const v = Number(r?.[col]);
      if (Number.isFinite(v)) vals.push(v);
    }
    if (vals.length === 0) {
      stats[col] = { min: 0, max: 0, mean: 0 };
      continue;
    }
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
    stats[col] = { min, max, mean };
  }

  return stats;
}

// ---------- Gentle Heat Class ----------
/**
 * Gentle text color scaling based on percentile within [min, max].
 * Use for subtle emphasis. Combine with getExtremeClass for bold extremes.
 */
export function getCellClass(
  column: string,
  value: number | string,
  stats: ColumnStatsMap
): string {
  const v = Number(value);
  const s = stats[column];
  if (!Number.isFinite(v) || !s) return "";

  const span = s.max - s.min;
  const p = span === 0 ? 0.5 : (v - s.min) / span; // 0..1

  if (p >= 0.8) return "text-green-700";
  if (p >= 0.6) return "text-green-600";
  if (p <= 0.2) return "text-red-700";
  if (p <= 0.4) return "text-red-600";
  return "text-gray-700";
}

// ---------- Extreme Highlight ----------
/**
 * Bold highlight for absolute extremes (highest/lowest) of a column.
 * Optionally restrict with `highlightColumns` to only some columns.
 * Returns background + ring + stronger text styles.
 *
 * Usage:
 * className={`${getCellClass(...)} ${getExtremeClass("composite", v, stats, ["composite"])}`}
 */
export function getExtremeClass(
  column: string,
  value: number | null | undefined,
  stats: ColumnStatsMap,
  highlightColumns?: string[]
): string {
  if (highlightColumns && !highlightColumns.includes(column)) return "";
  const v = Number(value);
  const s = stats[column];
  if (!Number.isFinite(v) || !s) return "";

  // Float-safe equality check
  const EPS = 1e-9;
  const isMax = Math.abs(v - s.max) <= EPS * (Math.abs(s.max) + 1);
  const isMin = Math.abs(v - s.min) <= EPS * (Math.abs(s.min) + 1);

  if (isMax) {
    return "bg-green-50 text-green-800 font-semibold ring-1 ring-green-300";
  }
  if (isMin) {
    return "bg-red-50 text-red-800 font-semibold ring-1 ring-red-300";
  }
  return "";
}
