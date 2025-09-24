// components/product/AnalysisCard.tsx
import React from "react";
import { formatNumber } from "./productUtils";
import type { CompanyDataRow } from "@/lib/excel-data";

/**
 * AnalysisCard
 * - safer TypeScript types
 * - guards against empty arrays
 * - explicit types for analysis result and sector entries
 */

type SelectedItem = { name: string; type: "Funds" | "Sectors" | "Companies" } | null;

type AnalysisResult = {
  bestCompany: string;
  worstCompany: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalCompanies: number;
  sectorBreakdown: Record<string, { count: number; avgScore: number }>;
  riskAnalysis: { high: number; medium: number; low: number };
  screeningCompliance: number; // percentage 0-100
};

export default function AnalysisCard({
  selectedItem,
  allCompanyData,
}: {
  selectedItem: SelectedItem;
  allCompanyData: CompanyDataRow[];
}) {
  if (!selectedItem) return null;

  // --- Small internal stat-card component ---
  const StatCard = ({
    label,
    value,
    trend,
    description,
  }: {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    description?: string;
  }) => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-bold text-brand-action">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      {trend && (
        <div className={`text-xs mt-1 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}>
          {trend === "up" ? "↗ Above Average" : trend === "down" ? "↘ Below Average" : "→ Average"}
        </div>
      )}
    </div>
  );

  // --- analysis helper ---
  const analyzeData = (companies: CompanyDataRow[]): AnalysisResult => {
    if (!companies || companies.length === 0) {
      return {
        bestCompany: "N/A",
        worstCompany: "N/A",
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalCompanies: 0,
        sectorBreakdown: {},
        riskAnalysis: { high: 0, medium: 0, low: 0 },
        screeningCompliance: 0,
      };
    }

    const scores = companies.map((c) => Number(c.esgScore || 0));
    const controversyScores = companies.map((c) => Number(c.controversy || 0));
    const screenScores = companies.map((c) => Number(c.positive || 0));

    // safe reduces using first element as initial
    const bestCompanyRow = companies.reduce((best, current) =>
      current.esgScore > best.esgScore ? current : best,
    companies[0]);

    const worstCompanyRow = companies.reduce((worst, current) =>
      current.esgScore < worst.esgScore ? current : worst,
    companies[0]);

    // sector breakdown
    const sectorBreakdown: Record<string, { count: number; avgScore: number }> = {};
    companies.forEach((company) => {
      const sector = company.sector || "Unknown";
      if (!sectorBreakdown[sector]) sectorBreakdown[sector] = { count: 0, avgScore: 0 };
      sectorBreakdown[sector].count++;
    });
    Object.keys(sectorBreakdown).forEach((sector) => {
      const sectorCompanies = companies.filter((c) => (c.sector || "Unknown") === sector);
      const avgScore =
        sectorCompanies.reduce((s, c) => s + Number(c.esgScore || 0), 0) / Math.max(1, sectorCompanies.length);
      sectorBreakdown[sector].avgScore = avgScore;
    });

    const riskAnalysis = {
      high: controversyScores.filter((score) => score > 70).length,
      medium: controversyScores.filter((score) => score >= 40 && score <= 70).length,
      low: controversyScores.filter((score) => score < 40).length,
    };

    const passedScreening = screenScores.filter((score) => score > 60).length;
    const screeningCompliance = (passedScreening / companies.length) * 100;

    const averageScore = scores.length ? scores.reduce((s, v) => s + v, 0) / scores.length : 0;

    return {
      bestCompany: bestCompanyRow.companyName || "N/A",
      worstCompany: worstCompanyRow.companyName || "N/A",
      averageScore,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      totalCompanies: companies.length,
      sectorBreakdown,
      riskAnalysis,
      screeningCompliance,
    };
  };

  // --- derive companies + analysis depending on selectedItem ---
  let companies: CompanyDataRow[] = [];
  let analysisData: AnalysisResult | null = null;
  let cardTitle = "";

  switch (selectedItem.type) {
    case "Funds": {
      // placeholder slice for fund holdings (keeps previous behaviour)
      companies = allCompanyData.slice(5, 20);
      analysisData = analyzeData(companies);
      cardTitle = `${selectedItem.name} - Fund Analysis`;
      break;
    }
    case "Companies": {
      const company = allCompanyData.find((c) => c.companyName === selectedItem.name);
      if (company) {
        companies = allCompanyData.filter((c) => c.sector === company.sector && c.companyName !== company.companyName);
        analysisData = analyzeData(companies);
        cardTitle = `${company.sector} Sector - Peer Analysis`;
      }
      break;
    }
    case "Sectors": {
      companies = allCompanyData.filter((c) => c.sector === selectedItem.name);
      analysisData = analyzeData(companies);
      cardTitle = `${selectedItem.name} Sector - Analysis`;
      break;
    }
    default:
      analysisData = null;
  }

  // nothing to show
  if (!analysisData || analysisData.totalCompanies === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-brand-dark mb-4">Analysis</h3>
        <p className="text-gray-500 text-center py-8">No data available for analysis.</p>
      </div>
    );
  }

  // typed sector entries
  const sectorEntries = (Object.entries(analysisData.sectorBreakdown) as [string, { count: number; avgScore: number }][])
    .sort((a, b) => b[1].avgScore - a[1].avgScore)
    .slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-brand-dark mb-6">{cardTitle}</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Companies" value={analysisData.totalCompanies} description="In analysis" />
        <StatCard label="Average ESG" value={analysisData.averageScore} description="Composite score" />
        <StatCard label="Best Performer" value={analysisData.highestScore} trend="up" description="Highest ESG score" />
        <StatCard label="Screening Pass Rate" value={`${formatNumber(analysisData.screeningCompliance)}%`} description="Compliance rate" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Performance Leaders</h4>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">🏆 Top Performer</span>
                  <span className="text-lg font-bold text-green-800">{formatNumber(analysisData.highestScore)}</span>
                </div>
                <p className="text-green-900 font-semibold mt-1">{analysisData.bestCompany}</p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-700">⚠️ Needs Improvement</span>
                  <span className="text-lg font-bold text-red-800">{formatNumber(analysisData.lowestScore)}</span>
                </div>
                <p className="text-red-900 font-semibold mt-1">{analysisData.worstCompany}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {sectorEntries.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Sector Performance</h4>
              <div className="space-y-2">
                {sectorEntries.map(([sector, data], index) => (
                  <div key={sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-800">{sector}</span>
                      <span className="text-xs text-gray-500 ml-2">({data.count} companies)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800">{formatNumber(data.avgScore)}</span>
                      {index === 0 && <span className="text-xs text-green-600 ml-1">👑</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
