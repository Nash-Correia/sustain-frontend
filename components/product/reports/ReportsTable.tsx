// components/product/ReportsTable.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * RatingTable — filters with SCROLL VIEW (pagination removed)
 * Enhancements:
 * - Company/Sector: multi-select dropdowns with search & checkboxes
 * - Rating: sort toggle (asc/desc/off)
 * - Year: simple dropdown
 * - Scrollable tbody with fixed height
 * - Action column shows: "Show", "Download", or disabled "Download"
 */

export type RatingRow = {
  company: string;
  sector: string;
  rating: string;
  year: number;
  reportUrl?: string;
};

type SortOrder = "asc" | "desc" | null;

type Props = {
  // All rows (no pagination)
  rows: RatingRow[];
  
  // PAGINATION PROPS KEPT FOR BACKWARDS COMPATIBILITY BUT NOT USED
  // page?: number;
  // pages?: number;
  // onPage?: (p: number) => void;

  // Company filter (multi)
  companyOptions?: string[];
  filterCompanies?: string[];
  onFilterCompanies?: (values: string[]) => void;

  // Sector filter (multi)
  sectorOptions?: string[];
  filterSectors?: string[];
  onFilterSectors?: (values: string[]) => void;

  // Rating sort
  sortRating?: SortOrder;
  onSortRating?: (order: SortOrder) => void;

  // Year (unchanged single-select)
  filterYear: number;
  onFilterYear: (v: number) => void;
  yearOptions: number[];

  // Actions
  onRequest: (company: string) => void;

  // Auth + ownership
  isLoggedIn?: boolean;
  hasReport?: (company: string, year: number) => boolean;
  onShow?: (row: RatingRow) => void;
};

const ROW_H = "h-12"; // ~48px per row

export default function RatingTable(p: Props) {
  // --------- Null-safe fallbacks ----------
  const companyOptions = p.companyOptions ?? [];
  const sectorOptions = p.sectorOptions ?? [];
  const filterCompanies = p.filterCompanies ?? [];
  const filterSectors = p.filterSectors ?? [];
  const sortRating: SortOrder = p.sortRating ?? null;
  const onFilterCompanies = p.onFilterCompanies ?? (() => {});
  const onFilterSectors = p.onFilterSectors ?? (() => {});
  const onSortRating = p.onSortRating ?? (() => {});
  const isLoggedIn = p.isLoggedIn ?? false;
  const hasReport = p.hasReport ?? (() => false);
  const onShow = p.onShow ?? (() => {});

  function toggleRatingSort() {
    if (sortRating === null) return onSortRating("asc");
    if (sortRating === "asc") return onSortRating("desc");
    return onSortRating(null);
  }

  return (
    <div className="pt-4 sm:pt-6">
      <div className="rounded-[14px] border border-gray-300 bg-white shadow-sm overflow-hidden">
        {/* ====================== TABLE HEADER ====================== */}
        <div className="grid grid-cols-[1.2fr_1fr_.6fr_.6fr] items-center px-4 sm:px-6 h-14 rounded-t-[14px] border-b border-gray-200 text-[15px] font-semibold text-[#1C6C6C] bg-white sticky top-0 z-10">
          {/* Company (multi-select) */}
          <div className="relative">
            <MultiSelectDropdown
              label="Company"
              options={companyOptions}
              selected={filterCompanies}
              onChange={onFilterCompanies}
              placeholder="Search companies..."
            />
          </div>

          {/* Sector (multi-select) */}
          <div className="relative flex items-left justify-left">
            <MultiSelectDropdown
              label="ESG Sector"
              options={sectorOptions}
              selected={filterSectors}
              onChange={onFilterSectors}
              placeholder="Search sectors..."
              center
            />
          </div>

          {/* Rating (sort asc/desc) */}
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={toggleRatingSort}
              aria-pressed={!!sortRating}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[#195D5D] hover:bg-gray-50"
              title="Toggle rating sort"
            >
              <span>ESG Rating</span>
              {sortRating === "asc" ? (
                <SortUp className="h-4 w-4 text-gray-400" />
              ) : sortRating === "desc" ? (
                <SortDown className="h-4 w-4 text-gray-400" />
              ) : (
                <SortBoth className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Year */}
          <div className="relative flex items-center justify-center">
            <HeaderDropdown label={`${p.filterYear} Report`} chevron center>
              <MenuList align="right">
                {p.yearOptions.map((y) => (
                  <MenuItem key={y} selected={p.filterYear === y} onClick={() => p.onFilterYear(y)}>
                    {y} Report
                  </MenuItem>
                ))}
              </MenuList>
            </HeaderDropdown>
          </div>
        </div>

        {/* ====================== SCROLLABLE TABLE BODY ====================== */}
        <div className="overflow-y-auto max-h-[600px]">
          <ul className="divide-y divide-gray-200">
            {(p.rows ?? []).length === 0 ? (
              <li className="px-4 sm:px-6 py-12 text-center text-gray-500">
                No results found
              </li>
            ) : (
              (p.rows ?? []).map((r, i) => {
                const owned = hasReport(r.company, r.year);
                return (
                  <li
                    key={`${r.company}-${i}`}
                    className={`grid min-w-0 grid-cols-[1.2fr_1fr_.6fr_.6fr] items-center px-4 sm:px-6 ${ROW_H}`}
                  >
                    <div className="min-w-0 truncate text-[15px] text-gray-900">{r.company}</div>
                    <div className="text-left text-[14px] text-gray-600">{r.sector}</div>
                    <div className="text-center text-[14px] font-extrabold text-gray-900">{r.rating}</div>
                    <div className="text-center">
                      {owned ? (
                        <button
                          className="text-[14px] font-medium text-[#195D5D] hover:underline"
                          onClick={() => onShow(r)}
                        >
                          Show
                        </button>
                      ) : isLoggedIn ? (
                        <button
                          className="text-[14px] font-medium text-[#1D7AEA] hover:underline"
                          onClick={() => p.onRequest(r.company)}
                        >
                          Download
                        </button>
                      ) : (
                        <button
                          className="text-[14px] font-medium text-gray-400 cursor-not-allowed"
                          disabled
                          title="Sign in to download"
                        >
                          Download
                        </button>
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* ====================== FOOTER / PAGINATION (COMMENTED OUT) ====================== */}
        {/* 
        <div className="flex items-center justify-center gap-2 px-4 h-16 border-t border-gray-200 rounded-b-[14px]">
          <PagerButton ariaLabel="First" disabled={p.page === 1} onClick={() => p.onPage(1)}>
            <ChevronsLeft className="h-4 w-4" />
          </PagerButton>
          <PagerButton ariaLabel="Prev" disabled={p.page === 1} onClick={() => p.onPage(p.page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </PagerButton>

          <div className="mx-2 flex items-center gap-2">
            {makeWindow(p.page, p.pages).map((n, idx) =>
              n === -1 ? (
                <span key={`dots-${idx}`} className="select-none text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={n}
                  onClick={() => p.onPage(n)}
                  className={
                    n === p.page
                      ? "h-8 w-8 rounded-full bg-gray-900 text-[13px] font-semibold text-white"
                      : "h-8 w-8 rounded-full text-[13px] text-gray-500 hover:bg-gray-100"
                  }
                >
                  {n}
                </button>
              )
            )}
          </div>

          <PagerButton ariaLabel="Next" disabled={p.page === p.pages} onClick={() => p.onPage(p.page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </PagerButton>
          <PagerButton ariaLabel="Last" disabled={p.page === p.pages} onClick={() => p.onPage(p.pages)}>
            <ChevronsRight className="h-4 w-4" />
          </PagerButton>
        </div>
        */}
      </div>
    </div>
  );
}

/* ====================== MULTI-SELECT DROPDOWN ====================== */
// ... (rest of the component code remains exactly the same)

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = "Search...",
  center = false,
}: {
  label: string;
  options?: string[];
  selected?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  center?: boolean;
}) {
  const safeOptions = options ?? [];
  const safeSelected = selected ?? [];
  const emitChange = onChange ?? (() => {});

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return safeOptions;
    const nq = q.toLowerCase();
    return safeOptions.filter((o) => o.toLowerCase().includes(nq));
  }, [safeOptions, q]);

  const allSelected = safeSelected.length === safeOptions.length && safeOptions.length > 0;

  function toggleOne(value: string) {
    if (safeSelected.includes(value)) {
      emitChange(safeSelected.filter((v) => v !== value));
    } else {
      emitChange([...safeSelected, value]);
    }
  }
  function selectAll() {
    emitChange([...safeOptions]);
  }
  function clearAll() {
    emitChange([]);
  }

  return (
    <div ref={ref} className="inline-flex items-center gap-2 relative">
      <button
        className="inline-flex items-center gap-2 text-[#195D5D]"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        type="button"
      >
        <span>{label}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      <div
        className={[
          "absolute top-full z-50 mt-2 min-w-[280px] rounded-xl border border-gray-200 bg-white shadow-xl",
          center ? "left-1/2 -translate-x-1/2" : "left-0",
          open ? "block" : "hidden",
        ].join(" ")}
        role="menu"
      >
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2 rounded-md border border-gray-200 px-2">
            <SearchIcon className="h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
            {q && (
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setQ("")}
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={allSelected ? clearAll : selectAll}
              className="text-xs font-medium text-[#195D5D] hover:underline"
            >
              {allSelected ? "Clear all" : "Select all"}
            </button>
            {safeSelected.length > 0 && !allSelected && (
              <button type="button" onClick={clearAll} className="text-xs text-gray-500 hover:underline">
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="max-h-64 overflow-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No matches</div>
          ) : (
            filtered.map((opt) => {
              const isChecked = safeSelected.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#195D5D] focus:ring-[#195D5D]"
                    checked={isChecked}
                    onChange={() => toggleOne(opt)}
                  />
                  <span className={isChecked ? "font-medium text-gray-900" : "text-gray-700"}>{opt}</span>
                </label>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-3 py-2">
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====================== SIMPLE DROPDOWN (YEAR) ====================== */

function HeaderDropdown({
  label,
  children,
  chevron = false,
  center = false,
}: {
  label: string;
  children: React.ReactNode;
  chevron?: boolean;
  center?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="inline-flex items-center gap-1 relative">
      <button
        className="inline-flex items-center gap-2 text-[#195D5D]"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        type="button"
      >
        <span>{label}</span>
        {chevron && <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      <div
        className={[
          "absolute top-full z-50 mt-2 min-w-[240px] rounded-xl border border-gray-200 bg-white shadow-xl",
          center ? "left-1/2 -translate-x-1/2" : "left-0",
          open ? "block" : "hidden",
        ].join(" ")}
        role="menu"
      >
        {children}
      </div>
    </div>
  );
}

function MenuList({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return <div className={["py-2", align === "right" ? "text-right" : ""].join(" ")}>{children}</div>;
}

function MenuItem({
  children,
  onClick,
  selected = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className={[
        "block w-full px-4 py-2 text-left text-[14px]",
        selected ? "bg-gray-100 font-medium text-gray-900" : "text-gray-700 hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ====================== PAGINATION PRIMITIVES (COMMENTED OUT - KEPT FOR REFERENCE) ====================== */
/*
function PagerButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={[
        "grid h-8 w-8 place-items-center rounded-lg border",
        disabled
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function makeWindow(page: number, pages: number) {
  const res: number[] = [];
  const low = Math.max(2, page - 1);
  const high = Math.min(pages - 1, page + 1);
  res.push(1);
  if (low > 2) res.push(-1);
  for (let i = low; i <= high; i++) res.push(i);
  if (high < pages - 1) res.push(-1);
  if (pages > 1) res.push(pages);
  return res;
}
*/

/* ====================== INLINE ICONS ====================== */

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
function ChevronsLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M11 19l-7-7 7-7" />
      <path d="M18 19l-7-7 7-7" />
    </svg>
  );
}
function ChevronsRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M13 5l7 7-7 7" />
      <path d="M6 5l7 7-7 7" />
    </svg>
  );
}
function SortBoth(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M8 18V6m0 0l-3 3m3-3l3 3" />
      <path d="M16 6v12m0 0l-3-3m3 3l3-3" />
    </svg>
  );
}
function SortUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M8 18V6m0 0l-3 3m3-3l3 3" />
    </svg>
  );
}
function SortDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M16 6v12m0 0l-3-3m3 3l3-3" />
    </svg>
  );
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}