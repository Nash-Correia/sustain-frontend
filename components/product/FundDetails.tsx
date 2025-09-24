"use client";

import { useState } from "react";
import { CompanyDataRow, FundDataRow } from "@/lib/excel-data";
import { formatNumber, getColumnStats, getCellClass } from "./productUtils";

type Props = {
  fund: FundDataRow;
  allCompanyData: CompanyDataRow[];
  gaugeData: { score: number; rating: string; name: string };
};

const DETAILS_WIDTH = 740; // px — width of sliding details rail

export default function FundDetails({ fund, allCompanyData }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // TODO: replace with actual fund holdings
  const companiesInFund = allCompanyData.slice(5, 20);
  const numericColumns = ["esgScore", "e_score", "s_score", "g_score"];
  const pageStats = getColumnStats(companiesInFund, numericColumns);

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      {/* Header / tiles */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-brand-dark">{fund.fundName}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Fund • {companiesInFund.length} Companies
          </p>
        </div>
      </div>

      {/* External expand/collapse button - positioned outside entire table container */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1"></div>
        <button
          onClick={() => setIsExpanded(v => !v)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Hide details" : "Show details"}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <span>{isExpanded ? "Hide Details" : "Show Details"}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Table container */}
      <div className="relative">

        {/* Scroll area: vertical-only scroll */}
        <div className="relative h-[600px] overflow-y-auto overflow-x-hidden rounded-lg border border-gray-200">
          {/* Base table wrapper adds right padding when details are shown */}
          <div
            className="transition-[padding] duration-300 ease-in-out"
            style={{ paddingRight: isExpanded ? DETAILS_WIDTH : 0 }}
          >
            <table className="w-full table-fixed text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-bold text-gray-700">Company</th>
                  <th className="text-left p-3 font-bold text-gray-700">Sector</th>
                  <th className="text-center p-3 font-bold text-gray-700">ESG Score</th>
                  <th className="text-center p-3 font-bold text-gray-700">Composite Score</th>
                  <th className="text-center p-3 font-bold text-gray-700">Grade</th>
                </tr>
              </thead>

              <tbody>
                {companiesInFund.map((company, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800 truncate">
                      {company.companyName}
                    </td>
                    <td className="p-3 text-left text-gray-600 truncate">
                      {company.sector}
                    </td>
                    <td
                      className={`p-3 text-center ${getCellClass(
                        "esgScore",
                        company.esgScore,
                        pageStats
                      )}`}
                    >
                      {formatNumber(company.esgScore)}
                    </td>
                    <td className="p-3 text-center">
                      {formatNumber((company as any).composite ?? "")}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {company.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DETAILS RAIL (slides in from right, no horizontal scroll added) */}
          <div
            className="absolute top-0 right-0 h-full bg-white shadow-sm"
            style={{
              width: DETAILS_WIDTH,
              transform: `translateX(${isExpanded ? 0 : DETAILS_WIDTH}px)`,
              transition: "transform 300ms ease-in-out",
            }}
          >
            {/* Sticky header inside rail */}
            <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-center p-3 font-bold text-gray-700">E-Score</th>
                    <th className="text-center p-3 font-bold text-gray-700">S-Score</th>
                    <th className="text-center p-3 font-bold text-gray-700">G-Score</th>
                    <th className="text-center p-3 font-bold text-gray-700">Positive</th>
                    <th className="text-center p-3 font-bold text-gray-700">Negative</th>
                    <th className="text-center p-3 font-bold text-gray-700">Controversy</th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Details rows (scrolls together with the outer container) */}
            <table className="w-full table-fixed text-sm">
              <tbody>
                {companiesInFund.map((company, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td
                      className={`p-3 text-center ${getCellClass(
                        "e_score",
                        (company as any).e_score,
                        pageStats
                      )}`}
                    >
                      {formatNumber((company as any).e_score ?? "")}
                    </td>
                    <td
                      className={`p-3 text-center ${getCellClass(
                        "s_score",
                        (company as any).s_score,
                        pageStats
                      )}`}
                    >
                      {formatNumber((company as any).s_score ?? "")}
                    </td>
                    <td
                      className={`p-3 text-center ${getCellClass(
                        "g_score",
                        (company as any).g_score,
                        pageStats
                      )}`}
                    >
                      {formatNumber((company as any).g_score ?? "")}
                    </td>
                    <td className="p-3 text-center truncate">
                      {(company as any).positive || "-"}
                    </td>
                    <td className="p-3 text-center truncate">
                      {(company as any).negative || "-"}
                    </td>
                    <td className="p-3 text-center truncate">
                      {(company as any).controversy || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* END details rail */}
        </div>
      </div>
    </div>
  );
}