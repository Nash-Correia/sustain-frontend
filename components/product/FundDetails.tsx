"use client";

import { useState } from "react";
import { CompanyDataRow, FundDataRow } from "@/lib/excel-data";
import { formatNumber, getColumnStats, getCellClass } from "./productUtils";

type Props = {
  fund: FundDataRow;
  allCompanyData: CompanyDataRow[];
};

export default function FundDetails({ fund, allCompanyData }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Placeholder: replace with real fund holdings
  const rows = allCompanyData.slice(5, 20);

  const totalCompanies = rows.length;
  const avgScore =
    totalCompanies > 0
      ? rows.reduce((sum, r) => sum + (r.esgScore || 0), 0) / totalCompanies
      : 0;

  const pageStats = getColumnStats(rows, ["esgScore", "e_score", "s_score", "g_score"]);

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-brand-dark">{fund.fundName}</h3>
          <p className="text-sm text-gray-600 mt-1">Fund • {totalCompanies} Companies</p>
        </div>


      </div>

      {/* Overview tiles (moved OUTSIDE the header row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-600 font-medium">Total Companies</p>
          <p className="text-3xl font-bold text-indigo-800">{totalCompanies}</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
          <p className="text-sm text-teal-600 font-medium">Average ESG Score</p>
          <p className="text-3xl font-bold text-teal-800">{formatNumber(avgScore)}</p>
        </div>
      </div>
        <div className="sticky top-0 flex items-right">
        <button
          onClick={() => setExpanded(v => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {expanded ? "Hide details" : "Show details"}
          <span className={`transition-transform ${expanded ? "rotate-180" : ""}`}>▼</span>
        </button>
        </div>
      {/* Table */}
      <div className="relative h-[400px] overflow-y-auto rounded-lg border border-gray-200">


        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-100 ">
            <tr>
              {/* Always visible */}
              <th className="text-left p-3 font-bold text-gray-700">Company</th>
              <th className="text-left p-3 font-bold text-gray-700">Sector</th>
              <th className="text-center p-3 font-bold text-gray-700">ESG Score</th>
              <th className="text-center p-3 font-bold text-gray-700">Composite</th>
              <th className="text-center p-3 font-bold text-gray-700">Grade</th>

              {/* Extra columns only when expanded */}
              {expanded && (
                <>
                  <th className="text-center p-3 font-bold text-gray-700">E-Score</th>
                  <th className="text-center p-3 font-bold text-gray-700">S-Score</th>
                  <th className="text-center p-3 font-bold text-gray-700">G-Score</th>
                  <th className="text-center p-3 font-bold text-gray-700">Positive</th>
                  <th className="text-center p-3 font-bold text-gray-700">Negative</th>
                  <th className="text-center p-3 font-bold text-gray-700">Controversy</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((c, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                {/* Always visible */}
                <td className="p-3 font-medium text-gray-800">{c.companyName}</td>
                <td className="p-3 text-left text-gray-600">{c.sector}</td>
                <td className={`p-3 text-center ${getCellClass("esgScore", c.esgScore, pageStats)}`}>
                  {formatNumber(c.esgScore)}
                </td>
                <td className="p-3 text-center">{formatNumber((c as any).composite ?? "")}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {c.grade}
                  </span>
                </td>

                {/* Extra columns only when expanded */}
                {expanded && (
                  <>
                    <td className={`p-3 text-center ${getCellClass("e_score", (c as any).e_score, pageStats)}`}>
                      {formatNumber((c as any).e_score ?? "")}
                    </td>
                    <td className={`p-3 text-center ${getCellClass("s_score", (c as any).s_score, pageStats)}`}>
                      {formatNumber((c as any).s_score ?? "")}
                    </td>
                    <td className={`p-3 text-center ${getCellClass("g_score", (c as any).g_score, pageStats)}`}>
                      {formatNumber((c as any).g_score ?? "")}
                    </td>
                    <td className="p-3 text-center">{(c as any).positive || "-"}</td>
                    <td className="p-3 text-center">{(c as any).negative || "-"}</td>
                    <td className="p-3 text-center">{(c as any).controversy || "-"}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
