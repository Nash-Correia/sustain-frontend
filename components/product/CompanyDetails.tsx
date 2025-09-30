"use client";

import { CompanyDataRow } from "@/lib/excel-data";
import { formatNumber } from "./productUtils";

type GaugeData = { score: number; rating: string; name: string };

const CompanyDetails = ({
  company,
  handleAddToPortfolio, // kept for parity, button moved to sticky bar
  gaugeData, // reserved
}: {
  company: CompanyDataRow;
  handleAddToPortfolio: (company: CompanyDataRow) => void;
  gaugeData: GaugeData;
}) => {
  if (!company || !company.companyName) return null;

  const clamp100 = (n: number | undefined | null) =>
    Math.max(0, Math.min(100, Number(n ?? 0)));

  const eVal = clamp100(company.e_score);
  const sVal = clamp100(company.s_score);
  const gVal = clamp100(company.g_score);
  const compositeVal = clamp100(company.composite);
  const esgScoreVal = clamp100(company.esgScore);

  const tileOuter = "flex justify-center";
  const tileInner = "w-full max-w-[260px] rounded-lg border p-5 text-center";

  const Bar = ({ value, className }: { value: number; className: string }) => (
    <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${className}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );

  return (
    <div className="bg-white border border-gray-200  p-6 sm:p-8 shadow-sm">
      {/* (Title + Add moved to page-level sticky bar) */}

      {/* KPI ribbon */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        <div className="inline-flex items-baseline gap-2 rounded-lg border px-3 py-2 bg-white shadow-sm border-gray-200">
          <span className="text-xs uppercase tracking-wide text-gray-600">ESG Composite Score</span>
          <span className="text-lg font-bold leading-none text-gray-900">
            {formatNumber(compositeVal)}
          </span>
        </div>
        <div className="inline-flex items-baseline gap-2 rounded-lg border px-3 py-2 bg-gray-50 border-gray-200">
          <span className="text-xs uppercase tracking-wide text-gray-600">ESG Score</span>
          <span className="text-lg font-bold leading-none text-gray-900">
            {formatNumber(esgScoreVal)}
          </span>
        </div>
        <div className="inline-flex items-baseline gap-2 rounded-lg border px-3 py-2 bg-gray-50 border-gray-200">
          <span className="text-xs uppercase tracking-wide text-gray-600">ESG Rating</span>
          <span className="text-lg font-bold leading-none text-gray-900">
            {company.grade || "-"}
          </span>
        </div>
      </div>

      {/* Progress group */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="min-w-[110px] text-m text-gray-700 font-medium">Environmental</div>
          <Bar value={eVal} className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600" />
          <div className="w-14 text-right text-m font-semibold text-gray-900 tabular-nums">
            {formatNumber(eVal)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-[110px] text-m text-gray-700 font-medium">Social</div>
          <Bar value={sVal} className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />
          <div className="w-14 text-right text-m font-semibold text-gray-900 tabular-nums">
            {formatNumber(sVal)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-[110px] text-m text-gray-700 font-medium">Governance</div>
          <Bar value={gVal} className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
          <div className="w-14 text-right text-m font-semibold text-gray-900 tabular-nums">
            {formatNumber(gVal)}
          </div>
        </div>
      </div>

      {/* Screens */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

  {/* Positive Screen Card */}
  <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 shadow-sm  transition-shadow duration-300">
    <div>
      <p className="text-sm text-teal-800 font-medium uppercase tracking-wider">
        Positive Screen
      </p>
      <p className="text-2xl font-bold text-teal-900 mt-1 break-words">
        {company.positive || "-"}
      </p>
    </div>
    <div className="flex-shrink-0 bg-teal-100 rounded-full p-3 ml-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-teal-600"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </div>
  </div>

  {/* Negative Screen Card */}
  <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 shadow-sm  transition-shadow duration-300">
    <div>
      <p className="text-sm text-rose-800 font-medium uppercase tracking-wider">
        Negative Screen
      </p>
      <p className="text-2xl font-bold text-rose-900 mt-1 break-words">
        {company.negative || "-"}
      </p>
    </div>
    <div className="flex-shrink-0 bg-rose-100 rounded-full p-3 ml-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-rose-600"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m14.5 9.5-5 5" />
        <path d="m9.5 9.5 5 5" />
      </svg>
    </div>
  </div>

  {/* Controversy Rating Card */}
  <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 shadow-sm  transition-shadow duration-300">
    <div>
      <p className="text-sm text-amber-800 font-medium uppercase tracking-wider">
        Controversy Rating
      </p>
      <p className="text-2xl font-bold text-amber-900 mt-1 break-words">
        {company.controversy || "-"}
      </p>
    </div>
    <div className="flex-shrink-0 bg-amber-100 rounded-full p-3 ml-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-600"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    </div>
  </div>

</div>


    </div>
  );
};

export default CompanyDetails;
