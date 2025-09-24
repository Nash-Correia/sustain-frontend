"use client";

import { CompanyDataRow } from "@/lib/excel-data";
import { formatNumber } from "./productUtils";

const CompanyDetails = ({
  company,
  handleAddToPortfolio,
  gaugeData,
}: {
  company: CompanyDataRow;
  handleAddToPortfolio: (company: CompanyDataRow) => void;
  gaugeData: { score: number; rating: string; name: string };
}) => {
  return (
    <div className="  bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-brand-dark">
            {company.companyName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Company • {company.sector} Sector
          </p>
        </div>
        <button
          onClick={() => handleAddToPortfolio(company)}
          className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
        >
          Add to List
        </button>
      </div>

      {/* Composite + Rating */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-lg text-green-600 font-medium">ESG Composite Score</p>
          <p className="text-5xl font-bold text-green-800">
            {formatNumber(company.composite)}
          </p>
        </div>
        <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-lg text-blue-600 font-medium">ESG Rating</p>
          <p className="text-5xl font-bold text-blue-800">{company.grade}</p>
        </div>
      </div>

      {/* Pillar Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-3xl font-bold text-green-800">{formatNumber(company.e_score)}</p>
          <p className="text-base text-green-600 mt-1">E-Pillar Score</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-3xl font-bold text-blue-800">{formatNumber(company.s_score)}</p>
          <p className="text-base text-blue-600 mt-1">S-Pillar Score</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <p className="text-3xl font-bold text-purple-800">{formatNumber(company.g_score)}</p>
          <p className="text-base text-purple-600 mt-1">G-Pillar Score</p>
        </div>
      </div>

      {/* Screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
          <p className="text-3xl font-bold text-teal-800">{company.positive}</p>
          <p className="text-base text-teal-600 mt-1">Positive Screen</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <p className="text-3xl font-bold text-red-800">{company.negative}</p>
          <p className="text-base text-red-600 mt-1">Negative Screen</p>
        </div>
      </div>

      {/* Controversy */}
      <div className="grid grid-cols-1">
        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
          <p className="text-3xl font-bold text-yellow-800">{company.controversy}</p>
          <p className="text-base text-yellow-600 mt-1">Controversy Rating</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
