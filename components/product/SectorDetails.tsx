// components/product/SectorDetails.tsx
"use client";

import { useState } from "react";
import { CompanyDataRow } from "@/lib/excel-data";
import { formatNumber, getColumnStats, getCellClass } from "./productUtils";

type GaugeData = { score: number; rating: string; name: string };

const SectorDetails = ({
  sectorName,
  allCompanyData,
  gaugeData, // unused for now
  /** Optional: handle "Add to list" for this sector */
  onAddSector,
  /** Optional: if you have a fixed navbar, pass its height (e.g., 64) */
  stickyTopOffsetPx = 0,
}: {
  sectorName: string;
  allCompanyData: CompanyDataRow[];
  gaugeData: GaugeData;
  onAddSector?: (sectorName: string) => void;
  stickyTopOffsetPx?: number;
}) => {
  // Guard: no sector selected
  if (!sectorName || !sectorName.trim()) {
    return null;
  }

  const [isExpanded, setIsExpanded] = useState(false);

  const companiesInSector = allCompanyData.filter(
    (c) => c.sector === sectorName
  );
  const totalCompanies = companiesInSector.length;

  // Guard: no rows
  if (totalCompanies === 0) {
    return null;
  }

  const numericColumns: string[] = [
    "composite",
    "esgScore",
    "e_score",
    "s_score",
    "g_score",
  ];
  const pageStats = getColumnStats(companiesInSector, numericColumns);

  // Compute averages
  const totalComposite = companiesInSector.reduce(
    (acc, c) => acc + (c.composite ?? 0),
    0
  );
  const avgComposite =
    totalCompanies > 0 ? totalComposite / totalCompanies : 0;

  let sectorGrade = "D";
  if (avgComposite > 75) sectorGrade = "A+";
  else if (avgComposite >= 70) sectorGrade = "A";
  else if (avgComposite >= 65) sectorGrade = "B+";
  else if (avgComposite >= 60) sectorGrade = "B";
  else if (avgComposite >= 55) sectorGrade = "C+";
  else if (avgComposite >= 50) sectorGrade = "C";

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      {/* === Header with sticky sector name & normal Add button === */}
      <div
        className="
          grid grid-cols-[1fr_auto]
          items-center
          gap-3
          mb-6
        "
      >
        {/* LEFT: Sticky sector name ONLY */}
        <div
          className="
            -mx-6 px-6 py-2
            bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70
          "
          style={{ top: stickyTopOffsetPx }}
        >
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-brand-dark truncate">
              {sectorName} Sector
            </h3>
          </div>
        </div>

        {/* RIGHT: Add button (same style as CompanyDetails) */}
        <div className="justify-end">
          {onAddSector && (
            <button
              onClick={() => onAddSector(sectorName)}
              aria-label={`Add ${sectorName} sector to list`}
              className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
            >
              Add to List
            </button>
          )}
        </div>
      </div>

      {/* Overview tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-600 font-medium">Total Companies</p>
          <p className="text-3xl font-bold text-indigo-800">
            {totalCompanies}
          </p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
          <p className="text-sm text-teal-600 font-medium">
            Average ESG Composite Score
          </p>
          <p className="text-3xl font-bold text-teal-800">
            {formatNumber(avgComposite)}
          </p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
          <p className="text-sm text-cyan-600 font-medium">Sector Rating</p>
          <p className="text-3xl font-bold text-cyan-800">{sectorGrade}</p>
        </div>
      </div>

      {/* Expand control */}
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
      <div className="relative h-[400px] overflow-y-auto overflow-x-hidden rounded-lg border border-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-600">
        <table className="w-full text-sm table-fixed">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="text-left p-3 font-bold text-gray-700">Company</th>
              <th className="text-center p-3 font-bold text-gray-700">
                ESG Score
              </th>
              <th className="text-center p-3 font-bold text-gray-700">
                ESG Composite Score
              </th>
              <th className="text-center p-3 font-bold text-gray-700">Rating</th>

              {isExpanded && (
                <>
                  <th className="text-center p-3 font-bold text-gray-700">
                    E-Score
                  </th>
                  <th className="text-center p-3 font-bold text-gray-700">
                    S-Score
                  </th>
                  <th className="text-center p-3 font-bold text-gray-700">
                    G-Score
                  </th>
                  <th className="text-center p-3 font-bold text-gray-700">
                    Positive
                  </th>
                  <th className="text-center p-3 font-bold text-gray-700">
                    Negative
                  </th>
                  <th className="text-center p-3 font-bold text-gray-700">
                    Controversy
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {companiesInSector.map((company, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3 font-medium text-gray-800">
                  {company.companyName}
                </td>

                <td
                  className={`p-3 text-center ${getCellClass(
                    "esgScore",
                    company.esgScore,
                    pageStats
                  )}`}
                >
                  {formatNumber(company.esgScore ?? 0)}
                </td>

                <td
                  className={`p-2 text-center ${getCellClass(
                    "composite",
                    company.composite,
                    pageStats
                  )}`}
                >
                  {formatNumber(company.composite ?? 0)}
                </td>

                <td className="p-3 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {company.grade ?? "-"}
                  </span>
                </td>

                {isExpanded && (
                  <>
                    <td
                      className={`p-3 text-center ${getCellClass(
                        "e_score",
                        company.e_score,
                        pageStats
                      )}`}
                    >
                      {formatNumber(company.e_score ?? 0)}
                    </td>
                    <td
                      className={`p-3 text-center ${getCellClass(
                        "s_score",
                        company.s_score,
                        pageStats
                      )}`}
                    >
                      {formatNumber(company.s_score ?? 0)}
                    </td>
                    <td
                      className={`p-3 text-center ${getCellClass(
                        "g_score",
                        company.g_score,
                        pageStats
                      )}`}
                    >
                      {formatNumber(company.g_score ?? 0)}
                    </td>
                    <td className="p-3 text-center">
                      {company.positive || "-"}
                    </td>
                    <td className="p-3 text-center">
                      {company.negative || "-"}
                    </td>
                    <td className="p-3 text-center">
                      {company.controversy || "-"}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectorDetails;
