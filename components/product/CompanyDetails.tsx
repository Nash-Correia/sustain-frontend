"use client";

import { CompanyDataRow } from "@/lib/excel-data";
import { formatNumber } from "./productUtils";

type GaugeData = { score: number; rating: string; name: string };

const CompanyDetails = ({
  company,
  handleAddToPortfolio,
  gaugeData, // currently unused; keep or remove depending on future use
}: {
  company: CompanyDataRow;
  handleAddToPortfolio: (company: CompanyDataRow) => void;
  gaugeData: GaugeData;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {company.companyName || "-"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Company • {company.sector || "-"} Sector
          </p>
        </div>
        <button
          onClick={() => handleAddToPortfolio(company)}
          aria-label={`Add ${company.companyName} to list`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add to List
        </button>
      </div>

      {/* Composite + Rating */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-lg text-green-700 font-medium">ESG Composite Score</p>
          <p className="text-5xl font-bold text-green-900">
            {formatNumber(company.composite ?? 0)}
          </p>
        </div>
        <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-lg text-blue-700 font-medium">ESG Rating</p>
          <p className="text-5xl font-bold text-blue-900">{company.grade || "-"}</p>
        </div>
      </div>

      {/* Pillar Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-3xl font-bold text-green-900">
            {formatNumber(company.e_score ?? 0)}
          </p>
          <p className="text-base text-green-700 mt-1">E-Pillar Score</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-3xl font-bold text-blue-900">
            {formatNumber(company.s_score ?? 0)}
          </p>
          <p className="text-base text-blue-700 mt-1">S-Pillar Score</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <p className="text-3xl font-bold text-purple-900">
            {formatNumber(company.g_score ?? 0)}
          </p>
          <p className="text-base text-purple-700 mt-1">G-Pillar Score</p>
        </div>
      </div>

      {/* Screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
          <p className="text-3xl font-bold text-teal-900 break-words line-clamp-3">
            {company.positive || "-"}
          </p>
          <p className="text-base text-teal-700 mt-1">Positive Screen</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <p className="text-3xl font-bold text-red-900 break-words line-clamp-3">
            {company.negative || "-"}
          </p>
          <p className="text-base text-red-700 mt-1">Negative Screen</p>
        </div>
      </div>

      {/* Controversy */}
      <div className="grid grid-cols-1">
        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
          <p className="text-3xl font-bold text-yellow-900 break-words line-clamp-3">
            {company.controversy || "-"}
          </p>
          <p className="text-base text-yellow-700 mt-1">Controversy Rating</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
