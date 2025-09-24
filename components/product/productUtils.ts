// components/product/productUtils.ts
export const formatNumber = (value: number | string): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? "0.00" : num.toFixed(0);
};

export const getColumnStats = (data: any[], columns: string[]) => {
  const stats: { [key: string]: { min: number; max: number; avg: number } } = {};

  columns.forEach((column) => {
    const values = data.map((item) => Number(item[column])).filter((v) => !isNaN(v));
    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      stats[column] = { min, max, avg };
    }
  });

  return stats;
};

export const getCellClass = (column: string, value: number | string, stats: any) => {
  const numValue = Number(value);
  if (isNaN(numValue) || !stats[column]) return "";

  const { min, max, avg } = stats[column];
  const tolerance = 0.01;

  if (Math.abs(numValue - max) < tolerance) return "bg-green-100 text-green-800 font-bold border border-green-300";
  if (Math.abs(numValue - min) < tolerance) return "bg-red-100 text-red-800 font-bold border border-red-300";
  if (Math.abs(numValue - avg) < tolerance) return "bg-blue-100 text-blue-800 font-semibold border border-blue-300";

  return "";
};
