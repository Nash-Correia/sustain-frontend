// components/product/AnalysisCard.tsx
"use client";

import React from "react";
import { formatNumber } from "./productUtils";
import type { CompanyDataRow } from "@/lib/excel-data";

type SelectedItem =
  | { name: string; type: "Funds" | "Sectors" | "Companies" }
  | null;

type AnalysisResult = {
  bestCompany: string;
  worstCompany: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalCompanies: number;
  sectorBreakdown: Record<string, { count: number; avgScore: number }>;
  screeningCompliance: number; // percentage 0-100
};

export default function AnalysisCard({
  selectedItem,
  allCompanyData,
}: {
  selectedItem: SelectedItem;
  allCompanyData: CompanyDataRow[];
}) {
  // Guard — if no selection or blank name, render nothing
  if (!selectedItem || !selectedItem.name || !selectedItem.name.trim()) {
    return null;
  }

  // Category variants (Funds / Sectors / Companies)
  const getVariant = (type: "Funds" | "Sectors" | "Companies") => {
    switch (type) {
      case "Funds":
        return {
          title: "text-brand-action",
          statValue: "text-brand-action",
          statBg: "from-brand-surface to-brand-bg-light",
          statBorder: "border-ui-border",
          goodCard: "bg-green-50 border-green-200 text-green-900",
          badCard: "bg-red-50 border-red-200 text-red-900",
          sectionTitle: "text-brand-dark",
          infoBg: "bg-brand-surface",
          subtitle: "",
          avgLabel: "Fund Average",
          bestLabel: "Top ESG Composite Score",
          passLabel: "",
          selectionHighlightsTitle: "Fund highlights",
        };
      case "Sectors":
        return {
          title: "text-brand-teal-dark",
          statValue: "text-brand-teal-dark",
          statBg: "from-cyan-50 to-cyan-100",
          statBorder: "border-cyan-200",
          goodCard: "bg-emerald-50 border-emerald-200 text-emerald-900",
          badCard: "bg-rose-50 border-rose-200 text-rose-900",
          sectionTitle: "text-brand-teal-dark",
          infoBg: "bg-cyan-50",
          subtitle: "All companies mapped to this sector.",
          avgLabel: "Sectoral Average",
          bestLabel: "Sectoral Top ESG Composite Score",
          passLabel: "",
          selectionHighlightsTitle: "Sector highlights",
        };
      case "Companies":
        return {
          title: "text-brand-dark",
          statValue: "text-purple-800",
          statBg: "from-gray-50 to-gray-100",
          statBorder: "border-gray-200",
          goodCard: "bg-amber-50 border-amber-200 text-amber-900",
          badCard: "bg-stone-50 border-stone-200 text-stone-900",
          sectionTitle: "text-brand-dark",
          infoBg: "bg-yellow-50",
          subtitle: "Peer comparison within the same sector.",
          avgLabel: "Sectoral Average ESG Composite Score",
          bestLabel: "Sectoral Top ESG Composite Score",
          passLabel: "",
          selectionHighlightsTitle: "Peer highlights",
        };
    }
  };

  const variant = getVariant(selectedItem.type);

  // Small stat card
  const StatCard = ({
    label,
    value,
    description,
    trend,
  }: {
    label: string;
    value: string | number;
    description?: string;
    trend?: "up" | "down" | "neutral";
  }) => (
    <div
      className={`bg-gradient-to-br ${variant.statBg} border ${variant.statBorder} p-4 rounded-lg text-center hover:shadow-sm transition`}
    >
      <p className="text-[11px] font-medium text-ui-text-secondary uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`text-3xl font-bold ${variant.statValue}`}>
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
      {description && (
        <p className="text-xs text-ui-text-secondary mt-1">{description}</p>
      )}
      {trend && (
        <div
          className={`text-xs mt-1 ${
            trend === "up"
              ? "text-green-600"
              : trend === "down"
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {trend === "up"
            ? "↗ Above average"
            : trend === "down"
            ? "↘ Below average"
            : "→ Around average"}
        </div>
      )}
    </div>
  );

  // ---- Analysis using COMPOSITE scores ----
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
        screeningCompliance: 0,
      };
    }

    const scores = companies.map((c) => Number(c.composite ?? 0));

    const isEmptyOrNA = (s?: string) =>
      !s || s.trim().length === 0 || s.trim().toUpperCase() === "NA";
    const passedScreening = companies.filter(
      (c) => !isEmptyOrNA(c.positive) && isEmptyOrNA(c.negative)
    ).length;
    const screeningCompliance = (passedScreening / companies.length) * 100;

    const bestCompanyRow = companies.reduce(
      (best, current) => (Number(current.composite ?? 0) > Number(best.composite ?? 0) ? current : best),
      companies[0]
    );
    const worstCompanyRow = companies.reduce(
      (worst, current) => (Number(current.composite ?? 0) < Number(worst.composite ?? 0) ? current : worst),
      companies[0]
    );

    const sectorBreakdown: Record<string, { count: number; avgScore: number }> = {};
    companies.forEach((c) => {
      const sector = c.sector || "Unknown";
      if (!sectorBreakdown[sector]) sectorBreakdown[sector] = { count: 0, avgScore: 0 };
      sectorBreakdown[sector].count++;
    });
    Object.keys(sectorBreakdown).forEach((sector) => {
      const list = companies.filter((c) => (c.sector || "Unknown") === sector);
      const avg =
        list.reduce((s, c) => s + Number(c.composite ?? 0), 0) /
        Math.max(1, list.length);
      sectorBreakdown[sector].avgScore = avg;
    });

    const averageScore =
      scores.length > 0
        ? scores.reduce((s, v) => s + v, 0) / scores.length
        : 0;

    return {
      bestCompany: bestCompanyRow.companyName || "N/A",
      worstCompany: worstCompanyRow.companyName || "N/A",
      averageScore,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      totalCompanies: companies.length,
      sectorBreakdown,
      screeningCompliance,
    };
  };

  // ---- Scopes ----
  const globalAnalysis = analyzeData(allCompanyData);

  let selectionCompanies: CompanyDataRow[] = [];
  let selectionAnalysis: AnalysisResult | null = null;
  let cardTitle = "";
  let helperSubtitle = variant.subtitle;

  switch (selectedItem.type) {
    case "Funds": {
      selectionCompanies = allCompanyData.slice(5, 20); // TODO: replace with actual fund holdings (by ISINs)
      selectionAnalysis = analyzeData(selectionCompanies);
      cardTitle = `${selectedItem.name} — Fund Analysis`;
      break;
    }
    case "Companies": {
      const company = allCompanyData.find(
        (c) => c.companyName === selectedItem.name
      );
      if (company) {
        selectionCompanies = allCompanyData.filter(
          (c) => c.sector === company.sector && c.companyName !== company.companyName
        );
        selectionAnalysis = analyzeData(selectionCompanies);
        cardTitle = `${company.sector} — Peer Analysis`;
      }
      break;
    }
    case "Sectors": {
      selectionCompanies = allCompanyData.filter(
        (c) => c.sector === selectedItem.name
      );
      selectionAnalysis = analyzeData(selectionCompanies);
      cardTitle = `${selectedItem.name} — Sector Analysis`;
      break;
    }
    default:
      selectionAnalysis = null;
  }

  const hasSelection = !!selectionAnalysis && selectionAnalysis.totalCompanies > 0;

  const sectorEntries = hasSelection
    ? (Object.entries(
        selectionAnalysis!.sectorBreakdown
      ) as [string, { count: number; avgScore: number }][]).sort(
        (a, b) => b[1].avgScore - a[1].avgScore
      ).slice(0, 5)
    : [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-8">
      {/* Global universe highlight */}
      <section>
        <h3 className="text-2xl font-bold text-brand-dark mb-1">
          IIAS rated universe
        </h3>
        <p className="text-sm text-ui-text-secondary mb-4">
          Top and lowest <b>ESG Composite</b> performers across all covered companies.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Global Top */}
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-m font-medium text-green-700">
                Top ESG Performer
              </span>
              <span className="text-lg font-bold text-green-900">
                {formatNumber(globalAnalysis.highestScore)}
              </span>
            </div>
            <p className="font-semibold mt-1 text-green-900">
              {globalAnalysis.bestCompany}
            </p>
          </div>

          {/* Global Lowest */}
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-m font-medium text-red-700">
                Need Improvement
              </span>
              <span className="text-lg font-bold text-red-900">
                {formatNumber(globalAnalysis.lowestScore)}
              </span>
            </div>
            <p className="font-semibold mt-1 text-red-900">
              {globalAnalysis.worstCompany}
            </p>
          </div>
        </div>
      </section>

      {/* Selection analysis */}
      <section>
        <h3 className={`text-2xl font-bold ${variant.title} mb-1`}>{cardTitle}</h3>
        <p className={`text-sm ${variant.sectionTitle} opacity-80 mb-6`}>
          {helperSubtitle}
        </p>

        {hasSelection ? (
          <>
            {/* Stats */}
            <div className="order-1 grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Total Companies"
                value={selectionAnalysis!.totalCompanies}
                description="included in this view"
              />
              <StatCard
                label={variant.avgLabel}
                value={selectionAnalysis!.averageScore}
                description="ESG Composite Score"
              />
              <StatCard
                label={variant.bestLabel}
                value={selectionAnalysis!.highestScore}
                trend="up"
                description={`Best: ${selectionAnalysis!.bestCompany}`}
              />
              {/* <StatCard
                label="Screening Pass Rate"
                value={`${formatNumber(selectionAnalysis!.screeningCompliance)}%`}
                description={variant.passLabel}
              /> */}
            </div>

            {/* Highlights + Sector performance */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="order-2 space-y-6">
                <h4 className={`font-semibold ${variant.sectionTitle} mb-4`}>
                  {variant.selectionHighlightsTitle}
                </h4>
                <div className="space-y-3">
                  <div className={`p-4 border rounded-lg ${variant.goodCard}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-m font-medium">🏅 Top ESG Performer</span>
                      <span className="text-lg font-bold">
                        {formatNumber(selectionAnalysis!.highestScore)}
                      </span>
                    </div>
                    <p className="font-semibold mt-1">
                      {selectionAnalysis!.bestCompany}
                    </p>
                  </div>

                  <div className={`p-4 border rounded-lg ${variant.badCard}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-m font-medium">⚠ Needs Improvement</span>
                      <span className="text-lg font-bold">
                        {formatNumber(selectionAnalysis!.lowestScore)}
                      </span>
                    </div>
                    <p className="font-semibold mt-1">
                      {selectionAnalysis!.worstCompany}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sector performance */}
              <div className="space-y-6">
                {sectorEntries.length > 0 && (
                  <div>
                    <h4 className={`font-semibold ${variant.sectionTitle} mb-4`}>
                      Sectoral ESG Composite Performance
                    </h4>
                    <div className="space-y-2">
                      {sectorEntries.map(([sector, data], index) => (
                        <div
                          key={sector}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <span className="text-sm font-medium text-gray-800">
                              {sector}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({data.count} companies)
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-800">
                              {formatNumber(data.avgScore)}
                            </span>
                            {index === 0 && (
                              <span className="text-xs text-green-700 ml-1"></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="border border-ui-border rounded-lg p-6 bg-ui-fill text-ui-text-secondary">
            No companies available in this selection.
          </div>
        )}
      </section>
    </div>
  );
}
