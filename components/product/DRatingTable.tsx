// components/product/RatingTable.tsx
import React from "react";

export default function DRatingTable({ name, score, rating }: { name: string; score: number; rating: string }) {
  const fmt = (v: number) => (typeof v === "number" ? v.toFixed(0) : String(v));
  return (
    <div className="mt-4 mb-4">
      <div className="inline-flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2">
        <div className="text-left">
          <div className="text-xs text-gray-500">Item</div>
          <div className="font-medium text-gray-800">{name}</div>
        </div>
        <div className="text-left">
          <div className="text-xs text-gray-500">Score</div>
          <div className="font-semibold text-brand-action text-lg">{fmt(score)}</div>
        </div>
        <div className="text-left">
          <div className="text-xs text-gray-500">Rating</div>
          <div className="px-2 py-1 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">{rating}</div>
        </div>
      </div>
    </div>
  );
}
