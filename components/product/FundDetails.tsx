"use client";

import { useEffect, useMemo, useState } from "react";
import { CompanyDataRow, FundDataRow } from "@/lib/excel-data";
import { formatNumber, getColumnStats, getCellClass } from "./productUtils";

type Props = {
  fund: FundDataRow | null;
  allCompanyData: CompanyDataRow[];
  handleAddFundToList: (fund: FundDataRow) => void;
};

export default function FundDetails({
  fund,
  allCompanyData,
  handleAddFundToList,
}: Props) {
  if (!fund || !fund.fundName || !fund.fundName.trim()) {
    return null;
  }

  const [isExpanded, setIsExpanded] = useState(false);

  // Reset expansion when fund changes (independent per selection)
  useEffect(() => {
    setIsExpanded(false);
  }, [fund.fundName]);

  // TODO: replace this with actual fund holdings mapping
  const rows = useMemo(() => {
    return allCompanyData.slice(5, 20);
  }, [allCompanyData]);

  const totalCompanies = rows.length;

  // ✅ Use COMPOSITE for averages (not esgScore)
  const avgScore =
    totalCompanies > 0
      ? rows.reduce((sum, r) => sum + (r.composite ?? 0), 0) / totalCompanies
      : 0;

  // Include composite in page stats so we can color-scale that column too
  const pageStats = useMemo(
    () => getColumnStats(rows, ["composite", "esgScore", "e_score", "s_score", "g_score"]),
    [rows]
  );

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      {/* Header */}
    <div className="sticky top-0 bg-white  items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-brand-dark">{fund.fundName}</h3>
        </div>
      <div className="flex items-center justify-end mb-6">


        {/* Add to List (funds) */}
        <button
          onClick={() => handleAddFundToList(fund)}
          className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
        >
          Add to List
        </button>
      </div>

      {/* Overview tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-600 font-medium">Total Companies</p>
          <p className="text-3xl font-bold text-indigo-800">{totalCompanies}</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
          {/* ✅ Label changed */}
          <p className="text-sm text-teal-600 font-medium">Average ESG Composite Score</p>
          <p className="text-3xl font-bold text-teal-800">{formatNumber(avgScore)}</p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all"
        >
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Companies table */}
      {totalCompanies > 0 ? (
        <div className="relative h-[400px] overflow-y-auto overflow-x-hidden rounded-lg border border-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-600">
          <table className="w-full text-sm table-fixed">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="text-left p-3 font-bold text-gray-700">Company</th>
                <th className="text-left p-3 font-bold text-gray-700">Sector</th>
                <th className="text-center p-3 font-bold text-gray-700">ESG Score</th>
                {/* ✅ Rename header to ESG Composite Score */}
                <th className="text-center p-3 font-bold text-gray-700">ESG Composite Score</th>
                <th className="text-center p-3 font-bold text-gray-700">Rating</th>

                {isExpanded && (
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
              {rows.map((company, index) => (
                <tr
                  key={`${company.isin || company.companyName}-${index}`}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3 font-medium text-gray-800">{company.companyName}</td>
                  <td className="p-3 font-medium text-gray-800">{company.sector}</td>
                  <td className={`p-3 text-center ${getCellClass("esgScore", company.esgScore, pageStats)}`}>
                    {formatNumber(company.esgScore ?? 0)}
                  </td>
                  {/* ✅ Use composite with color scale */}
                  <td className={`p-2 text-center ${getCellClass("composite", company.composite, pageStats)}`}>
                    {formatNumber(company.composite ?? 0)}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {company.grade ?? "-"}
                    </span>
                  </td>

                  {isExpanded && (
                    <>
                      <td className={`p-3 text-center ${getCellClass("e_score", company.e_score, pageStats)}`}>
                        {formatNumber(company.e_score ?? 0)}
                      </td>
                      <td className={`p-3 text-center ${getCellClass("s_score", company.s_score, pageStats)}`}>
                        {formatNumber(company.s_score ?? 0)}
                      </td>
                      <td className={`p-3 text-center ${getCellClass("g_score", company.g_score, pageStats)}`}>
                        {formatNumber(company.g_score ?? 0)}
                      </td>
                      <td className="p-3 text-center">{company.positive || "-"}</td>
                      <td className="p-3 text-center">{company.negative || "-"}</td>
                      <td className="p-3 text-center">{company.controversy || "-"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-ui-border rounded-lg p-6 bg-ui-fill text-ui-text-secondary">
          No companies available for this fund’s current holdings.
        </div>
      )}
    </div>
  );
}
