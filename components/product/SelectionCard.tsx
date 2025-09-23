// components/product/SelectionCard.tsx
import React from "react";
import DRatingTable from "./DRatingTable";
import PaginationControls from "./PaginationControls";
import { formatNumber, getColumnStats, getCellClass } from "./productUtils";
import RatingLegend from "@/components/product/RatingLegend";
import DetailedInfoTable from "@/components/product/DetailedInfoTable";
import CompanyInfoCard from "@/components/product/CompanyInfoCard";
import FundSectorAnalysis from "@/components/product/FundSectorAnalysis";
import type { CompanyDataRow, FundDataRow, PortfolioCompany } from "@/lib/excel-data";

type SelectedItem = { name: string; type: 'Funds' | 'Sectors' | 'Companies' } | null;

export default function SelectionCard({
  selectedItem,
  allCompanyData,
  allFundData,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleAddToPortfolio,
  gaugeData,
}: {
  selectedItem: SelectedItem;
  allCompanyData: CompanyDataRow[];
  allFundData: FundDataRow[];
  currentPage: number;
  setCurrentPage: (p: number) => void;
  itemsPerPage: number;
  handleAddToPortfolio: (company: CompanyDataRow) => void;
  gaugeData: { score: number; rating: string; name: string };
}) {
  if (!selectedItem) return null;

  // Reusable empty-rows helper
  const emptyRowsFor = (count: number) => Array(Math.max(0, count)).fill(null);

  switch (selectedItem.type) {
    case "Funds": {
      const fund = allFundData.find((f) => f.fundName === selectedItem.name);
      if (!fund) return null;

      const companiesInFund = allCompanyData.slice(5, 20); // placeholder
      const totalCompanies = companiesInFund.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedCompanies = companiesInFund.slice(startIndex, startIndex + itemsPerPage);
      const numericColumns = ["esgScore", "screen", "controversy_screen"];
      const pageStats = getColumnStats(paginatedCompanies, numericColumns);

      return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark">{fund.fundName}</h3>

              {/* RatingTable below header (per request) */}
              <DRatingTable name={gaugeData.name || fund.fundName} score={gaugeData.score ?? fund.score ?? 0} rating={gaugeData.rating ?? fund.grade ?? 'X'} />

              <p className="text-sm text-gray-600 mt-1">Fund • {totalCompanies} Companies</p>
            </div>
          </div>

          {/* Fund Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">ESG Score</p>
              <p className="text-3xl font-bold text-blue-800">{formatNumber(fund.score)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Grade</p>
              <p className="text-3xl font-bold text-green-800">{fund.grade}</p>
            </div>
          </div>

          {/* Holdings table */}
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">Company</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Sector</th>
                    <th className="text-center p-3 font-semibold text-gray-700">ESG Score</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Screen</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Controversy</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCompanies.map((company, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{company.companyName}</td>
                      <td className="p-3 text-left text-gray-600">{company.sector}</td>
                      <td className={`p-3 text-center font-semibold transition-colors duration-300 rounded-md ${getCellClass('esgScore', company.esgScore, pageStats)}`}>
                        {formatNumber(company.esgScore)}
                      </td>
                      <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('screen', company.screen, pageStats)}`}>
                        {formatNumber(company.screen)}
                      </td>
                      <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('controversy_screen', company.controversy_screen, pageStats)}`}>
                        {formatNumber(company.controversy_screen)}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{company.grade}</span>
                      </td>
                    </tr>
                  ))}

                  {emptyRowsFor(itemsPerPage - paginatedCompanies.length).map((_, idx) => (
                    <tr key={`empty-${idx}`} className="border-b border-gray-100">
                      <td className="p-3" style={{ height: '53px' }}>&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationControls totalItems={totalCompanies} currentPage={currentPage} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} />
          </div>
        </div>
      );
    }

    case "Companies": {
      const company = allCompanyData.find((c) => c.companyName === selectedItem.name);
      if (!company) return null;

      return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark">{company.companyName}</h3>

              {/* RatingTable below header */}
              <DRatingTable name={gaugeData.name || company.companyName} score={gaugeData.score ?? company.esgScore ?? 0} rating={gaugeData.rating ?? company.grade ?? 'X'} />

              <p className="text-sm text-gray-600 mt-1">Company • {company.sector} Sector</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAddToPortfolio(company)}
                className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
              >
                Add to List
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <RatingLegend />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Environmental</p>
              <p className="text-3xl font-bold text-green-800">{formatNumber(company.e_score)}</p>
              <p className="text-xs text-green-600 mt-1">E-Score</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Social</p>
              <p className="text-3xl font-bold text-blue-800">{formatNumber(company.s_score)}</p>
              <p className="text-xs text-blue-600 mt-1">S-Score</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-medium">Governance</p>
              <p className="text-3xl font-bold text-purple-800">{formatNumber(company.g_score)}</p>
              <p className="text-xs text-purple-600 mt-1">G-Score</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-600 font-medium">Screen Score</p>
              <p className="text-3xl font-bold text-orange-800">{formatNumber(company.screen)}</p>
              <p className="text-xs text-orange-600 mt-1">Screening</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-medium">Controversy</p>
              <p className="text-3xl font-bold text-red-800">{formatNumber(company.controversy_screen)}</p>
              <p className="text-xs text-red-600 mt-1">Risk Level</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">ESG Summary</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Overall ESG Score:</span>
                <span className="ml-2 font-bold text-brand-action">{formatNumber(company.esgScore)}</span>
              </div>
              <div>
                <span className="text-gray-600">Industry Position:</span>
                <span className="ml-2 font-semibold text-gray-800">{company.grade} Grade</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case "Sectors": {
      const companiesInSector = allCompanyData.filter((c) => c.sector === selectedItem.name);
      const totalCompanies = companiesInSector.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedCompanies = companiesInSector.slice(startIndex, startIndex + itemsPerPage);
      const numericColumns = ["esgScore", "e_score", "s_score", "g_score", "screen", "controversy_screen"];
      const pageStats = getColumnStats(paginatedCompanies, numericColumns);
      const totalScore = companiesInSector.reduce((acc, c) => acc + (c.esgScore || 0), 0);
      const avgScore = totalCompanies === 0 ? 0 : totalScore / totalCompanies;

      let sectorGrade = "D";
      if (avgScore > 75) sectorGrade = "A+";
      else if (avgScore >= 70) sectorGrade = "A";
      else if (avgScore >= 65) sectorGrade = "B+";
      else if (avgScore >= 60) sectorGrade = "B";
      else if (avgScore >= 55) sectorGrade = "C+";
      else if (avgScore >= 50) sectorGrade = "C";

      return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark">{selectedItem.name} Sector</h3>

              {/* RatingTable below header */}
              <DRatingTable name={gaugeData.name || `${selectedItem.name} Sector`} score={gaugeData.score ?? Math.round(avgScore) ?? 0} rating={gaugeData.rating ?? sectorGrade ?? 'N/A'} />

              <p className="text-sm text-gray-600 mt-1">Sector Analysis • {totalCompanies} companies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
              <p className="text-sm text-indigo-600 font-medium">Total Companies</p>
              <p className="text-3xl font-bold text-indigo-800">{totalCompanies}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
              <p className="text-sm text-teal-600 font-medium">Average ESG Score</p>
              <p className="text-3xl font-bold text-teal-800">{formatNumber(avgScore)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
              <p className="text-sm text-cyan-600 font-medium">Sector Grade</p>
              <p className="text-3xl font-bold text-cyan-800">{sectorGrade}</p>
            </div>
          </div>

          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">Company</th>
                    <th className="text-center p-3 font-semibold text-gray-700">ESG Score</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Grade</th>
                    <th className="text-center p-3 font-semibold text-gray-700">E-Score</th>
                    <th className="text-center p-3 font-semibold text-gray-700">S-Score</th>
                    <th className="text-center p-3 font-semibold text-gray-700">G-Score</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Screen</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Controversy</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCompanies.map((company, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{company.companyName}</td>
                      <td className={`p-3 text-center font-semibold transition-colors duration-300 rounded-md ${getCellClass('esgScore', company.esgScore, pageStats)}`}>
                        {formatNumber(company.esgScore)}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{company.grade}</span>
                      </td>
                      <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('e_score', company.e_score, pageStats)}`}>
                        {formatNumber(company.e_score)}
                      </td>
                      <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('s_score', company.s_score, pageStats)}`}>
                        {formatNumber(company.s_score)}
                      </td>
                      <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('g_score', company.g_score, pageStats)}`}>
                        {formatNumber(company.g_score)}
                      </td>
                      <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('screen', company.screen, pageStats)}`}>
                        {formatNumber(company.screen)}
                      </td>
                      <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('controversy_screen', company.controversy_screen, pageStats)}`}>
                        {formatNumber(company.controversy_screen)}
                      </td>
                    </tr>
                  ))}

                  {emptyRowsFor(itemsPerPage - paginatedCompanies.length).map((_, idx) => (
                    <tr key={`empty-${idx}`} className="border-b border-gray-100">
                      <td className="p-3" style={{ height: '53px' }}>&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                      <td className="p-3">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationControls totalItems={totalCompanies} currentPage={currentPage} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} />
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
