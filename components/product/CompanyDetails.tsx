"use client";

import { CompanyDataRow } from "@/lib/excel-data";
import { formatNumber } from "./productUtils";
import RatingLegend from "@/components/product/RatingLegend";
import DRatingTable from "./DRatingTable";

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
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-brand-dark">
            {company.companyName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Company • {company.sector} Sector
          </p>
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
      <div className="space-y-1"></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Environmental</p>
          <p className="text-3xl font-bold text-green-800">
            {formatNumber(company.e_score)}
          </p>
          <p className="text-xs text-green-600 mt-1">E-Score</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Social</p>
          <p className="text-3xl font-bold text-blue-800">
            {formatNumber(company.s_score)}
          </p>
          <p className="text-xs text-blue-600 mt-1">S-Score</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Governance</p>
          <p className="text-3xl font-bold text-purple-800">
            {formatNumber(company.g_score)}
          </p>
          <p className="text-xs text-purple-600 mt-1">G-Score</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">
            Positive Screen Score
          </p>
          <p className="text-3xl font-bold text-orange-800">
            {company.positive}
          </p>
          <p className="text-xs text-orange-600 mt-1">Positive</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">
            Negative Screen score
          </p>
          <p className="text-3xl font-bold text-red-800">{company.negative}</p>
          <p className="text-xs text-red-600 mt-1">Negative</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Controversy</p>
          <p className="text-3xl font-bold text-red-800">{company.controversy}</p>
          <p className="text-xs text-red-600 mt-1">Risk Level</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Composite</p>
          <p className="text-3xl font-bold text-red-800">
            {formatNumber(company.composite)}
          </p>
          <p className="text-xs text-red-600 mt-1">Composite</p>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">ESG Summary</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Overall ESG Score:</span>
            <span className="ml-2 font-bold text-brand-action">
              {formatNumber(company.esgScore)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Industry Position:</span>
            <span className="ml-2 font-semibold text-gray-800">
              {company.grade} Grade
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;