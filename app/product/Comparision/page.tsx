// app/(whatever-your-route-is)/ProductAPage.tsx
"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  getCompanyData,
  getFundData,
  CompanyDataRow,
  FundDataRow,
  PortfolioCompany,
} from "@/lib/excel-data";
import TabbedSearch from "@/components/product/comparision/TabbedSearch";
import FundsComparisonTable from "@/components/product/comparision/CustomComparisonTable";
import FundDetails from "@/components/product/comparision/details/FundDetails";
import SectorDetails from "@/components/product/comparision/details/SectorDetails";
import CompanyDetails from "@/components/product/comparision/details/CompanyDetails";
import AnalysisCard from "@/components/product/comparision/PeerAnalysisCard";

type SelectedItem =
  | { name: string; type: "Funds" | "Sectors" | "Companies" }
  | null;

/* =========================
   Helpers
========================= */

function gradeFromScore(avg: number): string {
  if (avg > 75) return "A+";
  if (avg >= 70) return "A";
  if (avg >= 65) return "B+";
  if (avg >= 60) return "B";
  if (avg >= 55) return "C+";
  if (avg >= 50) return "C";
  return "D";
}

function companyComposite(c: CompanyDataRow): number | null {
  const v =
    typeof (c as any).composite === "number"
      ? (c as any).composite
      : typeof c.esgScore === "number"
      ? c.esgScore
      : null;
  return v;
}

// Only the grade letter gets color; containers are neutral
function gradeTextColor(ratingRaw: string | undefined | null) {
  const r = (ratingRaw ?? "").toUpperCase().trim();
  if (!r || r === "N/A" || r === "X") return "text-gray-700";
  if (r.startsWith("A+")) return "text-rating-a-plus";
  if (r.startsWith("A")) return "text-rating-a";
  if (r.startsWith("B+")) return "text-rating-b-plus";
  if (r.startsWith("B")) return "text-rating-b";
  if (r.startsWith("C+")) return "text-rating-c-plus";
  if (r.startsWith("C")) return "text-rating-c";
  if (r.startsWith("D")) return "text-rating-d";
  return "text-gray-700";
}

/** Smooth, GPU-friendly sticky detector for a sticky header element.
 *  Checks headerRef.top <= offsetPx using rAF-throttled scroll listener.
 */
function useHeaderSticky(headerRef: React.RefObject<HTMLElement>, offsetPx = 80) {
  const [isStuck, setIsStuck] = useState(false);
  const rafRef = useRef<number | null>(null);

  const readIsStuck = useCallback(() => {
    const el = headerRef.current;
    if (!el) return false;
    const top = el.getBoundingClientRect().top;
    // Sticky "sticks" when its top touches the offset line (top-20 ≈ 80px)
    return top <= offsetPx + 0.5;
  }, [headerRef, offsetPx]);

  const onScroll = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const next = readIsStuck();
      // Avoid setState if value is unchanged
      setIsStuck(prev => (prev !== next ? next : prev));
    });
  }, [readIsStuck]);

  useEffect(() => {
    // initialize
    const init = () => setIsStuck(readIsStuck());
    init();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", init);

    // Re-check after paint (helps when content above loads async)
    const id = window.setTimeout(init, 0);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", init);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [onScroll, readIsStuck]);

  return isStuck;
}

/* =========================
   Page
========================= */

export default function ProductAPage() {
  const [allCompanyData, setAllCompanyData] = useState<CompanyDataRow[]>([]);
  const [allFundData, setAllFundData] = useState<FundDataRow[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Lists
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<FundDataRow[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  // Load data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [companyData, fundData] = await Promise.all([getCompanyData(), getFundData()]);
        if (!cancelled) {
          setAllCompanyData(companyData);
          setAllFundData(fundData);
        }
      } catch (e: any) {
        console.error("Failed to load data", e);
        if (!cancelled) setLoadError("Failed to load data. Please try again.");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Lookups & options
  const { companyOptions, fundOptions, sectorOptions, companyMap, fundMap, companiesBySector } =
    useMemo(() => {
      const cMap = new Map<string, CompanyDataRow>();
      const fMap = new Map<string, FundDataRow>();
      const bySector = new Map<string, CompanyDataRow[]>();

      for (const c of allCompanyData) {
        if (c.companyName) cMap.set(c.companyName, c);
        const sec = c.sector;
        if (sec) {
          if (!bySector.has(sec)) bySector.set(sec, []);
          bySector.get(sec)!.push(c);
        }
      }
      for (const f of allFundData) {
        if (f.fundName) fMap.set(f.fundName, f);
      }

      const companies = allCompanyData.map((c) => c.companyName).filter(Boolean) as string[];
      const funds = allFundData.map((f) => f.fundName).filter(Boolean) as string[];
      const sectors = Array.from(new Set(allCompanyData.map((c) => c.sector).filter(Boolean))) as string[];

      return {
        companyOptions: companies,
        fundOptions: funds,
        sectorOptions: sectors,
        companyMap: cMap,
        fundMap: fMap,
        companiesBySector: bySector,
      };
    }, [allCompanyData, allFundData]);

  // Gauge data (unified)
  const gaugeData = useMemo(() => {
    if (!selectedItem || !selectedItem.name?.trim()) {
      return { score: 0, rating: "N/A", name: "Select an item" };
    }

    if (selectedItem.type === "Funds") {
      const fund = fundMap.get(selectedItem.name);
      return {
        score: typeof fund?.score === "number" ? fund!.score : 0,
        rating: fund?.grade ?? "N/A",
        name: fund?.fundName ?? selectedItem.name,
      };
    }

    if (selectedItem.type === "Companies") {
      const company = companyMap.get(selectedItem.name);
      const score = company ? companyComposite(company) ?? 0 : 0;
      return {
        score,
        rating: company?.grade ?? "N/A",
        name: company?.companyName ?? selectedItem.name,
      };
    }

    if (selectedItem.type === "Sectors") {
      const list = companiesBySector.get(selectedItem.name) ?? [];
      if (list.length === 0) {
        return { score: 0, rating: "N/A", name: `${selectedItem.name} (Sector)` };
      }
      const total = list.reduce((acc, c) => acc + (companyComposite(c) ?? 0), 0);
      const avg = Math.round(total / list.length);
      return {
        score: avg,
        rating: gradeFromScore(avg),
        name: `${selectedItem.name} (Sector Average)`,
      };
    }

    return { score: 0, rating: "N/A", name: selectedItem.name };
  }, [selectedItem, fundMap, companyMap, companiesBySector]);

  // handlers
  const handleSelection = useCallback(
    (value: string, type: "Funds" | "Companies" | "Sectors") => {
      setSelectedItem({ name: value, type });
    },
    []
  );

  const handleAddCompanyToList = useCallback((company: CompanyDataRow) => {
    const item: PortfolioCompany = {
      companyName: company.companyName,
      isin: company.isin,
      aum: 0,
      esgScore: company.esgScore,
    };
    setPortfolioCompanies((prev) =>
      prev.some((p) => p.isin === item.isin) ? prev : [...prev, item]
    );
  }, []);

  const handleRemoveCompanyFromList = useCallback((isin: string) => {
    setPortfolioCompanies((prev) => prev.filter((p) => p.isin !== isin));
  }, []);

  const handleAddFundToList = useCallback((fund: FundDataRow) => {
    setSelectedFunds((prev) =>
      prev.some((f) => f.fundName === fund.fundName) ? prev : [...prev, fund]
    );
  }, []);

  const handleRemoveFundFromList = useCallback((fundName: string) => {
    setSelectedFunds((prev) => prev.filter((f) => f.fundName !== fundName));
  }, []);

  const handleAddSectorToList = useCallback((sectorName: string) => {
    const clean = sectorName.trim();
    if (!clean) return;
    setSelectedSectors((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
  }, []);

  const handleRemoveSectorFromList = useCallback((sectorName: string) => {
    setSelectedSectors((prev) => prev.filter((s) => s !== sectorName));
  }, []);

  /* =========================
     Sticky Context Bar (self-contained, smooth)
  ========================= */

  const StickyContextBar = () => {
    if (!selectedItem?.name) return null;

    const headerRef = useRef<HTMLElement | null>(null);
    const isStuck = useHeaderSticky(headerRef as React.RefObject<HTMLElement>, 80);

    // defaults
    let title = selectedItem.name;
    let subtitle: string | null = null;
    let ratingText: string = "N/A";
    let compositeVal: number | null = null;
    let addBtn: React.ReactNode = null;

    // dedupe checks
    const isFundAlready =
      selectedItem.type === "Funds" &&
      !!fundMap.get(selectedItem.name) &&
      selectedFunds.some((f) => f.fundName === selectedItem.name);

    const isCompanyAlready =
      selectedItem.type === "Companies" &&
      !!companyMap.get(selectedItem.name) &&
      portfolioCompanies.some((p) => p.companyName === selectedItem.name);

    const isSectorAlready =
      selectedItem.type === "Sectors" && selectedSectors.includes(selectedItem.name);

    const alreadyAdded = isFundAlready || isCompanyAlready || isSectorAlready;

    if (selectedItem.type === "Funds") {
      const fund = fundMap.get(selectedItem.name);
      if (!fund) return null;
      title = fund.fundName;
      ratingText = fund.grade || "N/A";
      compositeVal = typeof fund.score === "number" ? fund.score : null;
      addBtn = (
        <button
          onClick={() => handleAddFundToList(fund)}
          disabled={alreadyAdded}
          className={[
            "px-4 py-2 rounded-lg text-sm font-medium transition-opacity",
            alreadyAdded
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-brand-action text-white hover:opacity-90",
          ].join(" ")}
        >
          Compare
        </button>
      );
    } else if (selectedItem.type === "Companies") {
      const company = companyMap.get(selectedItem.name);
      if (!company) return null;
      title = company.companyName;
      subtitle = company.sector || null;
      ratingText = company.grade || "N/A";
      compositeVal = companyComposite(company);
      addBtn = (
        <button
          onClick={() => handleAddCompanyToList(company)}
          disabled={alreadyAdded}
          className={[
            "px-4 py-2 rounded-lg text-sm font-medium transition-opacity",
            alreadyAdded
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-brand-action text-white hover:opacity-90",
          ].join(" ")}
        >
          Add to Portfolio
        </button>
      );
    } else if (selectedItem.type === "Sectors") {
      title = `${selectedItem.name} Sector`;
      const list = companiesBySector.get(selectedItem.name) ?? [];
      if (list.length > 0) {
        const totalComposite = list.reduce((s, c) => s + (companyComposite(c) ?? 0), 0);
        const avgComposite = Math.round(totalComposite / list.length);
        compositeVal = avgComposite;
        ratingText = gradeFromScore(avgComposite);
      }
      addBtn = (
        <button
          onClick={() => handleAddSectorToList(selectedItem.name)}
          disabled={alreadyAdded}
          className={[
            "px-4 py-2 rounded-lg text-sm font-medium transition-opacity",
            alreadyAdded
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-brand-action text-white hover:opacity-90",
          ].join(" ")}
        >
          Compare
        </button>
      );
    }

    const isCompany = selectedItem.type === "Companies";
    const gradeColorCls = gradeTextColor(ratingText);

    // Fixed title/subtitle sizes
const titleCls = isStuck ? "text-xl" : "text-2xl sm:text-3xl";
const subtitleCls = isStuck ? "text-sm" : "text-base";

    // GPU-accelerated scaling for smoothness (no layout shift)
    const scale = isStuck ? 0.9 : 1; // tweak 0.92–0.85 to taste

    return (
      <section
        ref={headerRef as React.RefObject<HTMLElement>}
        role="region"
        aria-label="Context"
        className="sticky top-20 z-30 bg-white border-b border-gray-200 py-6"
      >
        <div className="flex items-center justify-between gap-6 px-6">
          {/* Left: title/subtitle + metrics */}
          <div className="flex items-center gap-8 min-w-0 flex-1">
            <div className="min-w-0">
              <h2 className={["font-semibold text-brand-dark truncate", titleCls].join(" ")}>
                {title}
              </h2>
              {subtitle && (
                <p className={["mt-0.5 text-ui-text-secondary truncate", subtitleCls].join(" ")}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Company Metrics */}
            {isCompany && (
              <div
                className="flex items-stretch gap-6 transform-gpu will-change-transform transition-transform duration-200 ease-out"
                style={{ transform: `scale(${scale})` }}
              >
                {/* ESG Rating */}
                <div className="w-[132px]">
                  <div className="mt-1 rounded-xl border border-gray-200 p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 text-left">
                      ESG Rating
                    </div>
                    <div
                      className={[
                        "leading-none font-extrabold text-center tracking-tight",
                        "text-5xl", // keep font static; scale container instead
                        gradeColorCls,
                      ].join(" ")}
                      aria-live="polite"
                      title="ESG grade"
                    >
                      {ratingText || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Composite */}
                <div className="min-w-[220px]">
                  <div className="mt-1 rounded-xl border border-gray-200 p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 text-left">
                      ESG Composite Score
                    </div>
                    <div className="flex justify-center">
                      <div
                        className={["font-bold text-gray-900", "text-3xl"].join(" ")}
                        title="Composite score"
                      >
                        {typeof compositeVal === "number" ? Math.round(compositeVal) : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: action */}
          <div className="flex-shrink-0">{addBtn}</div>
        </div>
      </section>
    );
  };

  /* =========================
     Render
  ========================= */

  const renderSelectionCard = () => {
    if (!selectedItem || !selectedItem.name?.trim()) return null;

    switch (selectedItem.type) {
      case "Funds": {
        const fund = fundMap.get(selectedItem.name);
        if (!fund) return null;
        return (
          <FundDetails
            fund={fund}
            allCompanyData={allCompanyData}
            handleAddFundToList={handleAddFundToList}
          />
        );
      }
      case "Companies": {
        const company = companyMap.get(selectedItem.name);
        if (!company) return null;
        return (
          <CompanyDetails
            company={company}
            handleAddToPortfolio={handleAddCompanyToList}
            gaugeData={gaugeData}
          />
        );
      }
      case "Sectors": {
        return (
          <SectorDetails
            sectorName={selectedItem.name}
            allCompanyData={allCompanyData}
            gaugeData={gaugeData}
            onAddSector={handleAddSectorToList}
            stickyTopOffsetPx={80}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="bg-brand-bg-light space-y-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loadError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {loadError}
          </div>
        )}

        <div className="space-y-8">
          <TabbedSearch
            fundOptions={fundOptions}
            companyOptions={companyOptions}
            sectorOptions={sectorOptions}
            onSelect={handleSelection}
          />

          {selectedItem ? (
            <section className="relative">
              <StickyContextBar />

              {/* Details card */}
              {renderSelectionCard()}

              {/* Analysis card */}
              <AnalysisCard selectedItem={selectedItem} allCompanyData={allCompanyData} />

              {/* Comparison lists */}
              {selectedItem.type === "Funds" && selectedFunds.length > 0 && (
                <FundsComparisonTable
                  mode="funds"
                  funds={selectedFunds}
                  onRemoveFund={handleRemoveFundFromList}
                />
              )}

              {selectedItem.type === "Sectors" && selectedSectors.length > 0 && (
                <FundsComparisonTable
                  mode="sectors"
                  sectors={selectedSectors}
                  allCompanyData={allCompanyData}
                  onRemoveSector={handleRemoveSectorFromList}
                />
              )}

              {selectedItem.type === "Companies" && portfolioCompanies.length > 0 && (
                <FundsComparisonTable
                  mode="companies"
                  companies={portfolioCompanies}
                  onRemoveCompany={handleRemoveCompanyFromList}
                />
              )}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
