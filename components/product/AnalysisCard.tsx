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

// ---------- Shared analysis logic (COMPOSITE-driven) ----------
function analyzeData(companies: CompanyDataRow[]): AnalysisResult {
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
    (best, current) =>
      (Number(current.composite ?? 0) > Number(best.composite ?? 0) ? current : best),
    companies[0]
  );
  const worstCompanyRow = companies.reduce(
    (worst, current) =>
      (Number(current.composite ?? 0) < Number(worst.composite ?? 0) ? current : worst),
    companies[0]
  );

  // sector breakdown
  const sectorBreakdown: Record<string, { count: number; avgScore: number }> = {};
  companies.forEach((c) => {
    const sector = c.sector || "Unknown";
    if (!sectorBreakdown[sector]) sectorBreakdown[sector] = { count: 0, avgScore: 0 };
    sectorBreakdown[sector].count++;
  });
  Object.keys(sectorBreakdown).forEach((sector) => {
    const list = companies.filter((c) => (c.sector || "Unknown") === sector);
    const avg = list.reduce((s, c) => s + Number(c.composite ?? 0), 0) / Math.max(1, list.length);
    sectorBreakdown[sector].avgScore = avg;
  });

  const averageScore =
    scores.length > 0 ? scores.reduce((s, v) => s + v, 0) / scores.length : 0;

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
}

// ---------- Small UI bits ----------
function StatCard({
  label,
  value,
  description,
  trend,
  bgFrom,
  bgTo,
  border,
  valueClass,
}: {
  label: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  bgFrom: string;
  bgTo: string;
  border: string;
  valueClass: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${bgFrom} ${bgTo} border ${border} p-4 rounded-lg text-center hover:shadow-sm transition`}>
      {/* Increased label size slightly for readability on small screens */}
      <p className="text-xs sm:text-sm font-medium text-ui-text-secondary uppercase tracking-wide mb-1">
        {label}
      </p>
      {/* Increased main number font size for stronger visual hierarchy */}
      <p className={`text-4xl sm:text-5xl leading-tight font-extrabold ${valueClass}`}>
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
      {/* Slight bump to description size */}
      {description && <p className="text-sm text-ui-text-secondary mt-1">{description}</p>}
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
          {trend === "up" ? "↗ Above average" : trend === "down" ? "↘ Below average" : "→ Around average"}
        </div>
      )}
    </div>
  );
}

function TopAndBottom({ result }: { result: AnalysisResult }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-m py-3 font-semibold text-green-700 uppercase tracking-wider">
              Top ESG Performer
            </p>
            <div className="p-2 bg-green-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   className="text-green-600">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold text-gray-800 mt-2">
              {formatNumber(result.highestScore)}
            </p>
            <p className="font-semibold text-green-700 truncate">{result.bestCompany}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-m py-3 font-semibold text-red-700 uppercase tracking-wider">
              Needs Improvement
            </p>
            <div className="p-2 bg-red-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   className="text-red-600">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                <polyline points="17 18 23 18 23 12"></polyline>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold text-gray-800 mt-2">
              {formatNumber(result.lowestScore)}
            </p>
            <p className="font-semibold text-red-700 truncate">{result.worstCompany}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectorPerformanceList({
  entries,
  titleClass,
}: {
  entries: [string, { count: number; avgScore: number }][];
  titleClass: string;
}) {
  if (!entries.length) return null;
  return (
    <div>
      <h4 className={`font-semibold ${titleClass} mb-4`}>Sectoral ESG Composite Performance</h4>
      <div className="space-y-2">
        {entries.map(([sector, data], index) => (
          <div key={sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-800">{sector}</span>
              <span className="text-xs text-gray-500 ml-2">({data.count} companies)</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-800">{formatNumber(data.avgScore)}</span>
              {index === 0 && <span className="text-xs text-green-700 ml-1"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Funds Section ----------
function FundsSection({
  fundName,
  allCompanyData,
}: {
  fundName: string;
  allCompanyData: CompanyDataRow[];
}) {
  // TODO: replace with actual holdings (ISIN map) when available
  const selectionCompanies = allCompanyData.slice(5, 20);
  const selection = analyzeData(selectionCompanies);
  const global = analyzeData(allCompanyData);

  const sectorEntries = Object.entries(selection.sectorBreakdown)
    .sort((a, b) => b[1].avgScore - a[1].avgScore)
    .slice(0, 5) as [string, { count: number; avgScore: number }][];

  return (
    <div className="bg-white border border-gray-200 p-6 sm:p-8 space-y-8">
      {/* Global universe tile pair */}
      <section>
        <h3 className="text-2xl font-bold text-brand-dark mb-1">IIAS rated universe</h3>
        <p className="text-sm text-ui-text-secondary mb-4">
          Top and lowest <b>ESG Composite</b> performers across all covered companies.
        </p>
        <TopAndBottom result={global} />
      </section>

      {/* Fund analysis */}
      <section>
        <h3 className="text-2xl font-bold text-brand-action mb-1">{fundName} — Fund Analysis</h3>
        <p className="text-sm text-brand-dark/80 mb-6">
          Fund holdings overview and composite distribution.
        </p>

        {selection.totalCompanies > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Total Companies"
                value={selection.totalCompanies}
                description="included in this view"
                bgFrom="from-brand-surface"
                bgTo="to-brand-bg-light"
                border="border-ui-border"
                valueClass="text-brand-action"
              />
              <StatCard
                label="Fund Average"
                value={selection.averageScore}
                description="ESG Composite Score"
                bgFrom="from-brand-surface"
                bgTo="to-brand-bg-light"
                border="border-ui-border"
                valueClass="text-brand-action"
              />
              <StatCard
                label="Top ESG Composite Score"
                value={selection.highestScore}
                trend="up"
                description={`Best: ${selection.bestCompany}`}
                bgFrom="from-brand-surface"
                bgTo="to-brand-bg-light"
                border="border-ui-border"
                valueClass="text-brand-action"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="font-semibold text-brand-dark mb-4">Fund highlights</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200 text-green-900">
                    <div className="flex items-center justify-between">
                      <span className="text-m font-medium">🏅 Top ESG Performer</span>
                      <span className="text-lg font-bold">{formatNumber(selection.highestScore)}</span>
                    </div>
                    <p className="font-semibold mt-1">{selection.bestCompany}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-rose-50 border-rose-200 text-rose-900">
                    <div className="flex items-center justify-between">
                      <span className="text-m font-medium">⚠ Needs Improvement</span>
                      <span className="text-lg font-bold">{formatNumber(selection.lowestScore)}</span>
                    </div>
                    <p className="font-semibold mt-1">{selection.worstCompany}</p>
                  </div>
                </div>
              </div>

              <SectorPerformanceList entries={sectorEntries} titleClass="text-brand-dark" />
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

// ---------- Sectors Section ----------
function SectorsSection({
  sectorName,
  allCompanyData,
}: {
  sectorName: string;
  allCompanyData: CompanyDataRow[];
}) {
  const selectionCompanies = allCompanyData.filter((c) => c.sector === sectorName);
  const selection = analyzeData(selectionCompanies);
  const global = analyzeData(allCompanyData);

  const sectorEntries = Object.entries(selection.sectorBreakdown)
    .sort((a, b) => b[1].avgScore - a[1].avgScore)
    .slice(0, 5) as [string, { count: number; avgScore: number }][];

  return (
    <div className="bg-white border border-gray-200 p-6 sm:p-8 space-y-8">
      {/* Global universe tile pair */}
      <section>
        <h3 className="text-2xl font-bold text-brand-dark mb-1">IIAS rated universe</h3>
        <p className="text-sm text-ui-text-secondary mb-4">
          Top and lowest <b>ESG Composite</b> performers across all covered companies.
        </p>
        <TopAndBottom result={global} />
      </section>

      {/* Sector analysis */}
      <section>
        <h3 className="text-2xl font-bold text-brand-teal-dark mb-1">
          {sectorName} — Sector Analysis
        </h3>
        <p className="text-sm text-brand-teal-dark/80 mb-6">
          All companies mapped to this sector.
        </p>

        {selection.totalCompanies > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Total Companies"
                value={selection.totalCompanies}
                description="included in this sector"
                bgFrom="from-cyan-50"
                bgTo="to-cyan-100"
                border="border-cyan-200"
                valueClass="text-brand-teal-dark"
              />
              <StatCard
                label="Sectoral Average"
                value={selection.averageScore}
                description="ESG Composite Score"
                bgFrom="from-cyan-50"
                bgTo="to-cyan-100"
                border="border-cyan-200"
                valueClass="text-brand-teal-dark"
              />
              <StatCard
                label="Sectoral Top ESG Composite Score"
                value={selection.highestScore}
                trend="up"
                description={`Best: ${selection.bestCompany}`}
                bgFrom="from-cyan-50"
                bgTo="to-cyan-100"
                border="border-cyan-200"
                valueClass="text-brand-teal-dark"
              />
            </div>

            <div >
              <div className="space-y-6">
                <h4 className="font-semibold text-brand-teal-dark mb-4">Sector highlights</h4>
                <div className="grid lg:grid-cols-2 gap-8 ">
                  <div className="p-4 border rounded-lg bg-emerald-50 border-emerald-200 text-emerald-900">
                    <div className="flex items-center justify-between">
                      <span className="text-m font-medium">🏅 Top ESG Performer</span>
                      <span className="text-lg font-bold">{formatNumber(selection.highestScore)}</span>
                    </div>
                    <p className="font-semibold mt-1">{selection.bestCompany}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-rose-50 border-rose-200 text-rose-900">
                    <div className="flex items-center justify-between">
                      <span className="text-m font-medium">⚠ Needs Improvement</span>
                      <span className="text-lg font-bold">{formatNumber(selection.lowestScore)}</span>
                    </div>
                    <p className="font-semibold mt-1">{selection.worstCompany}</p>
                  </div>
                </div>
              </div>

              {/* <SectorPerformanceList entries={sectorEntries} titleClass="text-brand-teal-dark" /> */}
            </div>
          </>
        ) : (
          <div className="border border-ui-border rounded-lg p-6 bg-ui-fill text-ui-text-secondary">
            No companies available in this sector.
          </div>
        )}
      </section>
    </div>
  );
}

// ---------- Companies Section ----------
function CompaniesSection({
  companyName,
  allCompanyData,
}: {
  companyName: string;
  allCompanyData: CompanyDataRow[];
}) {
  const company = allCompanyData.find((c) => c.companyName === companyName);
  const peers = company
    ? allCompanyData.filter(
        (c) => c.sector === company.sector && c.companyName !== company.companyName
      )
    : [];
  const selection = analyzeData(peers);
  const global = analyzeData(allCompanyData);

  const sectorEntries = Object.entries(selection.sectorBreakdown)
    .sort((a, b) => b[1].avgScore - a[1].avgScore)
    .slice(0, 5) as [string, { count: number; avgScore: number }][];

  return (
    <div className="bg-white border border-gray-200 p-6 sm:p-8 space-y-10">
      {/* Global universe tile pair */}
      <section>
        <h3 className="text-2xl font-bold text-brand-dark mb-1">IIAS rated universe</h3>
        <p className="text-sm text-ui-text-secondary mb-4">
          Top and lowest <b>ESG Composite</b> performers across all covered companies.
        </p>
        <TopAndBottom result={global} />
      </section>

      {/* Peer analysis */}
      <section>
        <h3 className="text-2xl font-bold text-brand-dark mb-1">
          {company?.sector || "Peer"} — Peer Analysis
        </h3>
        <p className="text-sm text-brand-dark/80 mb-6">Peer comparison within the same sector.</p>

        {selection.totalCompanies > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Peers Considered"
                value={selection.totalCompanies}
                description="in this sector (excl. selected)"
                bgFrom="from-gray-50"
                bgTo="to-gray-100"
                border="border-gray-200"
                valueClass="text-purple-800"
              />
              <StatCard
                label="Sectoral Average ESG Composite Score"
                value={selection.averageScore}
                description="Peer average"
                bgFrom="from-gray-50"
                bgTo="to-gray-100"
                border="border-gray-200"
                valueClass="text-purple-800"
              />
              <StatCard
                label="Sectoral Top ESG Composite Score"
                value={selection.highestScore}
                trend="up"
                description={`Best: ${selection.bestCompany}`}
                bgFrom="from-gray-50"
                bgTo="to-gray-100"
                border="border-gray-200"
                valueClass="text-purple-800"
              />
            </div>

            <div >
              <div className="space-y-6">
                <h4 className="font-semibold text-brand-dark mb-4">Peer highlights</h4>
                <div className="grid lg:grid-cols-2 gap-8 ">
                  <div className="p-4 border rounded-lg bg-amber-50 border-amber-200 text-amber-900">
                    <div className="flex items-center justify-between">
                      <span className="text-m font-medium">🏅 Top ESG Performer</span>
                      <span className="text-lg font-bold">{formatNumber(selection.highestScore)}</span>
                    </div>
                    <p className="font-semibold mt-1">{selection.bestCompany}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-stone-50 border-stone-200 text-stone-900">
                    <div className="flex items-center justify-between">
                      <span className="text-m font-medium">⚠ Needs Improvement</span>
                      <span className="text-lg font-bold">{formatNumber(selection.lowestScore)}</span>
                    </div>
                    <p className="font-semibold mt-1">{selection.worstCompany}</p>
                  </div>
                </div>
              </div>

              {/* <SectorPerformanceList entries={sectorEntries} titleClass="text-brand-dark" /> */}
            </div>
          </>
        ) : (
          <div className="border border-ui-border rounded-lg p-6 bg-ui-fill text-ui-text-secondary">
            No peers found for this company’s sector.
          </div>
        )}
      </section>
    </div>
  );
}

// ---------- Main switch: three distinct versions in one file ----------
export default function AnalysisCard({
  selectedItem,
  allCompanyData,
}: {
  selectedItem: SelectedItem;
  allCompanyData: CompanyDataRow[];
}) {
  if (!selectedItem || !selectedItem.name?.trim()) return null;

  if (selectedItem.type === "Funds") {
    return <FundsSection fundName={selectedItem.name} allCompanyData={allCompanyData} />;
  }
  if (selectedItem.type === "Sectors") {
    return <SectorsSection sectorName={selectedItem.name} allCompanyData={allCompanyData} />;
  }
  // Companies
  return <CompaniesSection companyName={selectedItem.name} allCompanyData={allCompanyData} />;
}
