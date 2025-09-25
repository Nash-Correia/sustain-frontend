// components/product/CompanyDetails.tsx
"use client";

import { CompanyDataRow } from "@/lib/excel-data";
import { formatNumber } from "./productUtils";

type GaugeData = { score: number; rating: string; name: string };

const CompanyDetails = ({
  company,
  handleAddToPortfolio,
  gaugeData, // reserved for future use
}: {
  company: CompanyDataRow;
  handleAddToPortfolio: (company: CompanyDataRow) => void;
  gaugeData: GaugeData;
}) => {
  // Guard if no company object provided
  if (!company || !company.companyName) return null;

  // Normalize values (cap to [0,100] for progress bars)
  const clamp100 = (n: number | undefined | null) =>
    Math.max(0, Math.min(100, Number(n ?? 0)));

  const eVal = clamp100(company.e_score);
  const sVal = clamp100(company.s_score);
  const gVal = clamp100(company.g_score);
  const compositeVal = clamp100(company.composite);
  const esgScoreVal = clamp100(company.esgScore);

  // Distinct gradients for each metric
  const gradients = {
    environmental: "linear-gradient(90deg, rgba(16,185,129,0.95) 0%, rgba(5,150,105,0.95) 100%)", // emerald 500 -> 600
    social:        "linear-gradient(90deg, rgba(59,130,246,0.95) 0%, rgba(99,102,241,0.95) 100%)", // blue 500 -> indigo 500
    governance:    "linear-gradient(90deg, rgba(251,191,36,0.95) 0%, rgba(234,88,12,0.95) 100%)",  // amber 400 -> orange 600
    composite:     "linear-gradient(90deg, rgba(52,211,153,0.95) 0%, rgba(20,184,166,0.95) 100%)", // emerald 400 -> teal 500
  };

  // Small colored dot
  const Dot = ({ className = "" }: { className?: string }) => (
    <span
      className={`inline-block h-2 w-2 rounded-full ${className}`}
      aria-hidden
    />
  );

  // Generic progress row with custom gradient & dot
  const ProgressRow = ({
    label,
    value,
    gradient,
    dotClass,
  }: {
    label: string;
    value: number;
    gradient: string;
    dotClass: string;
  }) => (
    <div className="flex items-center gap-3">
      <div className="min-w-[120px] flex items-center gap-2 text-sm text-gray-700">
        <Dot className={dotClass} />
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${value}%`,
            background: gradient,
          }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          role="progressbar"
        />
      </div>
      <div className="w-14 text-right text-sm font-semibold text-gray-900 tabular-nums">
        {formatNumber(value)}
      </div>
    </div>
  );

  // Tiny KPI chip
  const Kpi = ({
    label,
    value,
    emphasize = false,
  }: {
    label: string;
    value: string | number;
    emphasize?: boolean;
  }) => (
    <div
      className={`inline-flex items-baseline gap-2 rounded-lg border px-3 py-2 ${
        emphasize ? "bg-white shadow-sm" : "bg-gray-50"
      } border-gray-200`}
    >
      <span className="text-xs uppercase tracking-wide text-gray-600">
        {label}
      </span>
      <span
        className={`${
          emphasize ? "text-xl" : "text-lg"
        } font-bold leading-none text-gray-900`}
      >
        {typeof value === "number" ? formatNumber(value) : value}
      </span>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold text-brand-dark truncate">
            {company.companyName}
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {company.sector || "—"}
          </p>
        </div>

        <button
          onClick={() => handleAddToPortfolio(company)}
          aria-label={`Add ${company.companyName} to list`}
          className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
        >
          Add to List
        </button>
      </div>

      {/* KPI ribbon (very compact) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        <Kpi label="Composite" value={compositeVal} emphasize />
        <Kpi label="ESG Score" value={esgScoreVal} />
        <Kpi label="Grade" value={company.grade || "-"} />
        <Kpi label="ISIN" value={company.isin || "-"} />
      </div>

      {/* Compact progress group with DISTINCT gradients */}
      <div className="space-y-3 mb-8">
        <ProgressRow
          label="Environmental"
          value={eVal}
          gradient={gradients.environmental}
          dotClass="bg-emerald-600"
        />
        <ProgressRow
          label="Social"
          value={sVal}
          gradient={gradients.social}
          dotClass="bg-indigo-600"
        />
        <ProgressRow
          label="Governance"
          value={gVal}
          gradient={gradients.governance}
          dotClass="bg-amber-500"
        />
        <div className="pt-1 border-t border-gray-100" />
        <ProgressRow
          label="Composite"
          value={compositeVal}
          gradient={gradients.composite}
          dotClass="bg-teal-600"
        />
      </div>

      {/* Screens & Controversy — compact notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Dot className="bg-teal-500" />
            <span className="text-xs font-semibold text-teal-800 uppercase tracking-wide">
              Positive Screen
            </span>
          </div>
          <p className="text-sm text-teal-900 leading-relaxed break-words">
            {company.positive || "—"}
          </p>
        </div>

        <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Dot className="bg-rose-500" />
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wide">
              Negative Screen
            </span>
          </div>
          <p className="text-sm text-rose-900 leading-relaxed break-words">
            {company.negative || "—"}
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Dot className="bg-amber-500" />
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
              Controversy
            </span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed break-words">
            {company.controversy || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
