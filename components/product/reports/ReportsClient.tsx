// components/product/RatingsClient.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import RatingTable, { type RatingRow } from "@/components/product/reports/ReportsTable";
import { getCompanyData, type CompanyDataRow } from "@/lib/excel-data";
import { LOGIN, SHOW_TABS_FOR_EMPTY_USER } from "@/lib/feature-flags";
import RequestReportModal from "./RequestReportModal";
import { div } from "framer-motion/client";

/**
 * RatingsClient with scroll view (pagination removed)
 * - Tab switch (All Companies | My Reports) when LOGIN=true
 * - Ownership check: if user owns/downloaded a report → show "Show" action
 * - Inbuilt PDF viewer modal for "Show"
 * - Request report modal opened from "Download"
 */

// ===== Mock "user reports" (replace with real DB/API later) =====
type UserReport = { company: string; year: number; reportUrl: string };
const DUMMY_USER_REPORTS: UserReport[] = [
  { company: "HDFC Bank Limited", year: 2024, reportUrl: "/reports/sample.pdf" },
];

// Grade ordering helper for sorting (A+ best → D worst)
const GRADE_ORDER = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D"];
const gradeRank = (g: string) => {
  const i = GRADE_ORDER.indexOf(g?.toUpperCase?.() ?? "");
  return i === -1 ? Number.POSITIVE_INFINITY : i;
};

// PAGINATION REMOVED - Using scroll view instead
// const PAGE_SIZE = 10;

export default function RatingsClient({ initial = [] as RatingRow[] }) {
  // Raw, fully-loaded rows (mapped from Excel)
  const [allRows, setAllRows] = useState<RatingRow[]>(initial);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Column filter states
  const [filterCompanies, setFilterCompanies] = useState<string[]>([]);
  const [filterSectors, setFilterSectors] = useState<string[]>([]);

  // Rating sort state: "asc" | "desc" | null
  const [sortRating, setSortRating] = useState<"asc" | "desc" | null>(null);

  // Year filter (dropdown)
  const [filterYear, setFilterYear] = useState<number>(2024);
  const yearOptions = [2024, 2023];

  // PAGINATION STATE REMOVED
  // const [page, setPage] = useState(1);

  // Tab state
  type TabKey = "all" | "mine";
  const [tab, setTab] = useState<TabKey>("all");

  // Inbuilt PDF viewer modal state
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState<string>("");

  // Request Report modal state
  const [reqOpen, setReqOpen] = useState(false);
  const [reqDefaultCompany, setReqDefaultCompany] = useState<string | undefined>(undefined);

  // ===== Load from Excel on mount =====
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const companies: CompanyDataRow[] = await getCompanyData();

        const mapped2024: RatingRow[] = companies
          .filter((c) => !!c.companyName && !!c.grade)
          .map((c) => ({
            company: c.companyName,
            sector: c.sector || "—",
            rating: c.grade,
            year: 2024,
            reportUrl: "#",
          }));

        // De-duplicate by company+year
        const seen = new Set<string>();
        const deduped = mapped2024.filter((r) => {
          const key = `${r.company}|${r.year}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // Add ONE synthetic 2023 row for testing
        if (deduped.length > 0) {
          const preferred =
            deduped.find((r) => r.company.toLowerCase() === "infosys limited") ?? deduped[0];
          deduped.push({ ...preferred, year: 2023 });
        }

        if (!cancelled) setAllRows(deduped);
      } catch (e) {
        console.error("Failed loading Excel company data:", e);
        if (!cancelled && initial?.length) setAllRows(initial);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initial]);

  // ----- My reports -----
  const myReports = DUMMY_USER_REPORTS;

  const reportMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of myReports) m.set(`${r.company}|${r.year}`, r.reportUrl);
    return m;
  }, [myReports]);

  const myRows = useMemo<RatingRow[]>(() => {
    if (reportMap.size === 0) return [];
    return allRows
      .map((r) => {
        const key = `${r.company}|${r.year}`;
        if (reportMap.has(key)) {
          return { ...r, reportUrl: reportMap.get(key)! };
        }
        return r;
      })
      .filter((r) => reportMap.has(`${r.company}|${r.year}`));
  }, [allRows, reportMap]);

  const showTabs = LOGIN && (SHOW_TABS_FOR_EMPTY_USER || myRows.length > 0);

  // ===== Base rows depend on active tab =====
  const baseRows = tab === "mine" ? myRows : allRows;

  // ===== Derived option lists =====
  const companyOptions = useMemo(() => {
    const set = new Set<string>();
    baseRows.forEach((r) => set.add(r.company));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [baseRows]);

  const sectorOptions = useMemo(() => {
    const set = new Set<string>();
    baseRows.forEach((r) => set.add(r.sector || "—"));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [baseRows]);

  // ===== Filtering & Sorting - Returns ALL filtered rows (no pagination) =====
  const filteredRows = useMemo(() => {
    let rows = baseRows;

    if (filterCompanies.length > 0) {
      const allow = new Set(filterCompanies);
      rows = rows.filter((r) => allow.has(r.company));
    }

    if (filterSectors.length > 0) {
      const allow = new Set(filterSectors);
      rows = rows.filter((r) => allow.has(r.sector || "—"));
    }

    rows = rows.filter((r) => r.year === filterYear);

    if (sortRating === "asc") {
      rows = [...rows].sort((a, b) => gradeRank(a.rating) - gradeRank(b.rating));
    } else if (sortRating === "desc") {
      rows = [...rows].sort((a, b) => gradeRank(b.rating) - gradeRank(a.rating));
    }

    return rows;
  }, [baseRows, filterCompanies, filterSectors, filterYear, sortRating]);

  // PAGINATION LOGIC REMOVED - No longer slicing rows
  // const pages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  // const pageRows = useMemo(() => {
  //   const start = (page - 1) * PAGE_SIZE;
  //   return filteredRows.slice(start, start + PAGE_SIZE);
  // }, [filteredRows, page]);

  // ===== Ownership helpers =====
  const hasReport = (company: string, year: number) => {
    return reportMap.has(`${company}|${year}`);
  };

  // ===== Actions =====
  function handleRequest(company: string) {

    setReqDefaultCompany(company);
    setReqOpen(true);
  }

  function handleShow(row: RatingRow) {
    const key = `${row.company}|${row.year}`;
    const url = reportMap.get(key) ?? row.reportUrl;
    if (!url || url === "#") {
      alert("No report file is available for this row yet.");
      return;
    }
    setViewerTitle(`${row.company} — ${row.year} Report`);
    setViewerUrl(url);
  }

  // ===== Render =====
  return (
    <section className="w-full">
      {showTabs && (
        <div className="mb-4">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <TabButton active={tab === "all"} onClick={() => setTab("all")}>
              All Companies
            </TabButton>
            <TabButton active={tab === "mine"} onClick={() => setTab("mine")}>
              My Reports
            </TabButton>
          </div>
        </div>
      )}

      <RatingTable
        // Pass ALL filtered rows (scroll view will handle display)
        rows={filteredRows}
        
        // PAGINATION PROPS REMOVED/COMMENTED
        // page={page}
        // pages={pages}
        // onPage={setPage}
        
        // filters (multi)
        companyOptions={companyOptions}
        sectorOptions={sectorOptions}
        filterCompanies={filterCompanies}
        onFilterCompanies={setFilterCompanies}
        filterSectors={filterSectors}
        onFilterSectors={setFilterSectors}
        
        // rating sort
        sortRating={sortRating}
        onSortRating={setSortRating}
        
        // year (single)
        filterYear={filterYear}
        onFilterYear={setFilterYear}
        yearOptions={yearOptions}
        
        // actions
        onRequest={handleRequest}
        isLoggedIn={LOGIN}
        hasReport={hasReport}
        onShow={handleShow}
      />

      {/* Request report modal */}
      <RequestReportModal
        open={reqOpen}
        onClose={() => setReqOpen(false)}
        defaultCompany={reqDefaultCompany}
        year={filterYear}
        loggedIn={LOGIN}
        companyOptions={companyOptions}
      />

      {/* Inbuilt PDF/report viewer */}
      {viewerUrl && (
        <ReportViewerModal
          title={viewerTitle}
          url={viewerUrl}
          onClose={() => setViewerUrl(null)}
        />
      )}
    </section>
  );
}

/* ====================== UI bits ====================== */

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1.5 text-sm rounded-lg transition",
        active ? "bg-gray-900 text-white shadow" : "text-gray-600 hover:bg-gray-50",
      ].join(" ")}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function ReportViewerModal({
  title,
  url,
  onClose,
}: {
  title: string;
  url: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* dialog */}
      <div
        className="absolute inset-x-0 top-10 mx-auto w-[95vw] max-w-6xl rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 h-14 rounded-t-2xl">
          <h3 className="truncate text-base font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline text-sm text-[#1D7AEA] hover:underline"
              title="Open in new tab"
            >
              Open in new tab
            </a>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>

        {/* viewer */}
        <div className="p-0">
          <iframe
            src={url}
            title="Report viewer"
            className="block h-[75vh] w-full rounded-b-2xl"
          />
        </div>
      </div>
    </div>
  );
}