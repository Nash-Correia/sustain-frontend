// components/product/SectorDetails.tsx
"use client";

import { useState } from "react";
import { CompanyDataRow } from "@/lib/excel-data";
import { formatNumber, getColumnStats, getExtremeChipClass } from "./productUtils";

type GaugeData = { score: number; rating: string; name: string };

const SectorDetails = ({
  sectorName,
  allCompanyData,
  gaugeData, // unused here (reserved)
  onAddSector,            // ⬅️ optional add handler (matches ProductAPage)
  stickyTopOffsetPx = 80, // ⬅️ accepted for parity; not used inside this card
}: {
  sectorName: string;
  allCompanyData: CompanyDataRow[];
  gaugeData: GaugeData;
  onAddSector?: (sectorName: string) => void;
  stickyTopOffsetPx?: number;
}) => {
  if (!sectorName || !sectorName.trim()) return null;

  const [isExpanded, setIsExpanded] = useState(false);

  const companiesInSector = allCompanyData.filter((c) => c.sector === sectorName);
  const totalCompanies = companiesInSector.length;
  if (totalCompanies === 0) return null;

  // Stats for strict min/max chips
  const numericColumns = ["composite", "esgScore", "e_score", "s_score", "g_score"];
  const pageStats = getColumnStats(companiesInSector, numericColumns);

  const totalComposite = companiesInSector.reduce((acc, c) => acc + (c.composite ?? 0), 0);
  const avgComposite = totalCompanies > 0 ? totalComposite / totalCompanies : 0;

  let sectorGrade = "D";
  if (avgComposite > 75) sectorGrade = "A+";
  else if (avgComposite >= 70) sectorGrade = "A";
  else if (avgComposite >= 65) sectorGrade = "B+";
  else if (avgComposite >= 60) sectorGrade = "B";
  else if (avgComposite >= 55) sectorGrade = "C+";
  else if (avgComposite >= 50) sectorGrade = "C";

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      {/* Title was moved to page-level sticky bar. We keep only an optional Add button here. */}
      {/* <div className="flex justify-end mb-4">
        {onAddSector && (
          <button
            onClick={() => onAddSector(sectorName)}
            aria-label={`Add ${sectorName} sector to list`}
            className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
          >
            Add to List
          </button>
        )}
      </div> */}

      {/* Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Average ESG Composite Score Card */}
        <div className="flex items-center p-6 bg-white rounded-xl border border-gray-300 shadow-sm ">
          <div className="mr-5 flex-shrink-0 bg-teal-100 rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-teal-600"
            >
              <path d="M0 0h24v24H0z" stroke="none" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M13.41 10.59l4.59 -4.59" />
              <path d="M7 12a5 5 0 0 1 5 -5" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{formatNumber(avgComposite)}</p>
            <p className="text-sm text-gray-600 font-medium">Average ESG Composite Score</p>
          </div>
        </div>

        {/* Sector Rating Card */}
        <div className="flex items-center p-6 bg-white rounded-xl border border-gray-300 shadow-sm ">
          <div className="mr-5 flex-shrink-0 bg-cyan-100 rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cyan-600"
            >
              <path d="M12 15l-3.5 -3.5" />
              <path d="M15 12l-3.5 3.5" />
              <path d="M10 21h4" />
              <path d="M12 21v-4" />
              <path d="M4.22 10.22l1.42 1.42" />
              <path d="M18.36 11.64l1.42 -1.42" />
              <path d="M12 3a9 9 0 0 0 0 18" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{sectorGrade}</p>
            <p className="text-sm text-gray-600 font-medium">Sector Rating</p>
          </div>
        </div>

        {/* Total Companies Card */}
        <div className="flex items-center p-6 bg-white rounded-xl border border-gray-300 shadow-sm ">
          <div className="mr-5 flex-shrink-0 bg-indigo-100 rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600"
            >
              <path d="M3 21h18" />
              <path d="M5 21v-14l8 -4v18" />
              <path d="M19 21v-10l-6 -4" />
              <path d="M9 9v0" />
              <path d="M9 12v0" />
              <path d="M9 15v0" />
              <path d="M9 18v0" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{totalCompanies}</p>
            <p className="text-sm text-gray-600 font-medium">Total Companies</p>
          </div>
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

      {/* Table */}
      <div className="relative h-[400px] overflow-auto rounded-lg border border-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-600">
        <table className="w-full text-sm table-fixed">
          {!isExpanded ? (
            <>
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-bold text-gray-700">Company</th>
                  <th className="text-center p-3 font-bold text-gray-700">ESG Score</th>
                  <th className="text-center p-3 font-bold text-gray-700">ESG Composite Score</th>
                  <th className="text-center p-3 font-bold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody>
                {companiesInSector.map((company, index) => (
                  <tr key={`${index}-collapsed`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{company.companyName}</td>
                    <td className="p-3 text-center text-gray-800">
                      <span className={getExtremeChipClass("esgScore", company.esgScore, pageStats)}>
                        {formatNumber(company.esgScore ?? 0)}
                      </span>
                    </td>
                    <td className="p-2 text-center text-gray-800">
                      <span className={getExtremeChipClass("composite", company.composite, pageStats)}>
                        {formatNumber(company.composite ?? 0)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {company.grade ?? "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <>
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-bold text-gray-700">Company</th>
                  <th className="text-center p-3 font-bold text-gray-700">E-Pillar</th>
                  <th className="text-center p-3 font-bold text-gray-700">S-Pillar</th>
                  <th className="text-center p-3 font-bold text-gray-700">G-Pillar</th>
                  <th className="text-center p-3 font-bold text-gray-700">ESG Score</th>
                  <th className="text-center p-3 font-bold text-gray-700">Positive</th>
                  <th className="text-center p-3 font-bold text-gray-700">Negative</th>
                  <th className="text-center p-3 font-bold text-gray-700">Controversy</th>
                  <th className="text-center p-3 font-bold text-gray-700">Composite</th>
                  <th className="text-center p-3 font-bold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody>
                {companiesInSector.map((company, index) => (
                  <tr key={`${index}-expanded`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{company.companyName}</td>
                    <td className="p-3 text-center text-gray-800">
                      <span className={getExtremeChipClass("e_score", company.e_score, pageStats)}>
                        {formatNumber(company.e_score ?? 0)}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-800">
                      <span className={getExtremeChipClass("s_score", company.s_score, pageStats)}>
                        {formatNumber(company.s_score ?? 0)}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-800">
                      <span className={getExtremeChipClass("g_score", company.g_score, pageStats)}>
                        {formatNumber(company.g_score ?? 0)}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-800">
                      <span className={getExtremeChipClass("esgScore", company.esgScore, pageStats)}>
                        {formatNumber(company.esgScore ?? 0)}
                      </span>
                    </td>
                    <td className="p-3 text-center">{company.positive || "-"}</td>
                    <td className="p-3 text-center">{company.negative || "-"}</td>
                    <td className="p-3 text-center">{company.controversy || "-"}</td>
                    <td className="p-3 text-center text-gray-800">
                      <span className={getExtremeChipClass("composite", company.composite, pageStats)}>
                        {formatNumber(company.composite ?? 0)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {company.grade ?? "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default SectorDetails;
