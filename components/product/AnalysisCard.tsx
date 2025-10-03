// components/product/AnalysisCard.tsx
"use client";

import React from "react";
import { formatNumber } from "./productUtils";
import type { CompanyDataRow } from "@/lib/excel-data";
import {
  Landmark,
  FileText,
  Award,
  ChevronRight,
  Leaf,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,     // New icon import
  GraduationCap,   // New icon import
  TrendingUp,      // New icon import
  Minus,           // New icon import
  TrendingDown,    // New icon import
} from 'lucide-react';

// --- ICONS ---
const PillarIcon = () => <Landmark className="w-12 h-12 text-teal-700" />;
const ScreenIcon = () => <FileText className="w-12 h-12 text-teal-700" />;
const RatingIcon = () => <Award className="w-12 h-12 text-yellow-500" />;
const GradeIcon = () => <GraduationCap className="w-12 h-12 text-teal-500" />; // New Icon
const ThickArrow = () => <ChevronRight className="w-10 h-10 text-gray-400" />;
const VerticalThickArrow = () => <ChevronDown className="w-10 h-10 text-gray-400 my-2" />; // New Component
const EnvIcon = () => <Leaf className="w-9 h-9" style={{ color: '#1c4439' }} />;
const SocialIcon = () => <Users className="w-9 h-9" style={{ color: '#6ec8bd' }} />;
const GovIcon = () => <Building2 className="w-9 h-9" style={{ color: '#cada8e' }} />;
const PositiveIcon = () => <CheckCircle2 className="w-9 h-9 text-green-600" />;
const NegativeIcon = () => <XCircle className="w-9 h-9 text-red-600" />;
const ControversyIcon = () => <AlertTriangle className="w-9 h-9 text-yellow-500" />;



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
  screeningCompliance: number;

  bestRow: CompanyDataRow | null;
  worstRow: CompanyDataRow | null;
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
      bestRow: null,            // <- NEW
      worstRow: null,           // <- NEW
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
    bestRow: bestCompanyRow,     // <- NEW
    worstRow: worstCompanyRow,   // <- NEW
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right">{value ?? "—"}</span>
    </div>
  );
}

function Badge({
  children,
  tone = "neutral", // "positive" | "negative" | "warn" | "neutral"
}: {
  children: React.ReactNode;
  tone?: "positive" | "negative" | "warn" | "neutral";
}) {
  const toneMap: Record<string, string> = {
    positive: "bg-green-50 text-green-700 ring-green-200",
    negative: "bg-rose-50 text-rose-700 ring-rose-200",
    warn: "bg-amber-50 text-amber-700 ring-amber-200",
    neutral: "bg-gray-50 text-gray-700 ring-gray-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneMap[tone]}`}>
      {children}
    </span>
  );
}

function CompanyDetailCard({
  title,
  score,
  name,
  row,
  tone,
}: {
  title: string;
  score: number;
  name: string;
  row: CompanyDataRow | null;
  tone: "positive" | "negative";
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-start justify-between">
        <p className={`text-m py-3 font-semibold uppercase tracking-wider ${tone === "positive" ? "text-green-700" : "text-red-700"}`}>
          {title}
        </p>
        <div className={`p-2 rounded-full ${tone === "positive" ? "bg-green-50" : "bg-rose-50"}`}>
          {tone === "positive" ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-rose-600" />}
        </div>
      </div>

      <div className="mt-1">
        {/* <p className="text-4xl font-bold text-gray-800">{formatNumber(score)}</p> */}
        <p className={`font-semibold ${tone === "positive" ? "text-green-700" : "text-red-700"} truncate`}>
          {name || "N/A"}
        </p>
      </div>

      {/* Full details */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-100 p-3">
          <DetailRow label="E-Pillar Score" value={row ? formatNumber(row.e_score) : "—"} />
          <DetailRow label="S-Pillar Score" value={row ? formatNumber(row.s_score) : "—"} />
          <DetailRow label="G-Pillar Score" value={row ? formatNumber(row.g_score) : "—"} />
          <DetailRow label="ESG Pillar Score" value={row ? formatNumber(row.esgScore) : "—"} />
          <DetailRow label="ESG Composite Score" value={row ? formatNumber(row.composite) : "—"} />
        </div>

        <div className="rounded-lg border border-gray-100 p-3">
          <DetailRow label="ESG Rating" value={row?.grade || "—"} />
          <div className="flex items-center justify-between gap-4 py-1">
            <span className="text-xs font-medium text-gray-500">Positive Screen</span>
            <span className="text-sm text-right">
              {row?.positive ? <Badge tone="positive">{row.positive}</Badge> : <Badge>—</Badge>}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-1">
            <span className="text-xs font-medium text-gray-500">Negative Screen</span>
            <span className="text-sm text-right">
              {row?.negative ? <Badge tone="negative">{row.negative}</Badge> : <Badge>—</Badge>}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-1">
            <span className="text-xs font-medium text-gray-500">Controversy Rating</span>
            <span className="text-sm text-right">
              {row?.controversy ? <Badge tone="warn">{row.controversy}</Badge> : <Badge>—</Badge>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopAndBottom({ result }: { result: AnalysisResult }) {
  const best = result.bestRow;
  const worst = result.worstRow;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CompanyDetailCard
          title="Top ESG Performer"
          score={result.highestScore}
          name={result.bestCompany}
          row={best}
          tone="positive"
        />
        <CompanyDetailCard
          title="Needs Improvement"
          score={result.lowestScore}
          name={result.worstCompany}
          row={worst}
          tone="negative"
        />
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
      <h4 className={`font-semibold ${titleClass} mb-4`}>
        Sectoral Average ESG Composite Performance
      </h4>
      <div className="max-h-[12.2rem] overflow-y-auto pr-2">
        <div className="space-y-2">
          {entries.map(([sector, data], index) => (
            <div
              key={sector}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <span className="text-sm font-medium text-gray-800">
                  {sector}
                </span>
                {/* This span now conditionally checks the count */}
                <span className="text-xs text-gray-500 ml-2">
                  ({data.count} {data.count === 1 ? "company" : "companies"})
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
                // description={`Best: ${selection.bestCompany}`}
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
      {/* Global universe tile pair */}
      <section>
        <h3 className="text-2xl font-bold text-brand-dark mb-1">IIAS rated universe</h3>
        <p className="text-sm text-ui-text-secondary mb-4">
          Highest and lowest <b>ESG Composite</b> performers across all covered companies.
        </p>
        <TopAndBottom result={global} />
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
                //description={`Best: ${selection.bestCompany}`}
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
            {/* Global universe tile pair */}
      <section>
        <h3 className="text-2xl font-bold text-brand-dark mb-1">IiAS rated universe</h3>
        <p className="text-sm text-ui-text-secondary mb-4">
          Highest and lowest <b>ESG Composite</b> performers across all covered companies.
        </p>
        <TopAndBottom result={global} />
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
                //description={`Best: ${selection.bestCompany}`}
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
            {/* Global universe tile pair */}
      <section>
        <h3 className="text-2xl font-bold text-brand-dark mb-1">IiAS rated universe</h3>
        <p className="text-sm text-ui-text-secondary mb-4">
          Highest and lowest <b>ESG Composite Score</b> performers across all covered companies.
        </p>
        <TopAndBottom result={global} />
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
