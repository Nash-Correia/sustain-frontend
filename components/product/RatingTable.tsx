"use client";
import React, { useEffect, useRef, useState } from "react";

// Types
export type RatingRow = {
  company: string;
  sector: string;
  rating: string; // e.g., A+, B, C+
  year: number;   // 2024, 2023
  reportUrl?: string;
};

type Props = {
  rows: RatingRow[];
  page: number;
  pages: number;
  onPage: (p: number) => void;
  // Filters
  filterCompany: string;
  onFilterCompany: (v: string) => void;
  companyOptions: string[];
  filterYear: number;
  onFilterYear: (v: number) => void;
  yearOptions: number[];
  onRequest: (company: string) => void;
};

export default function RatingTable(p: Props) {
  return (
    <div className="rounded-[14px] border border-gray-300 bg-white shadow-sm">
      {/* table header */}
      <div className="grid grid-cols-[1.2fr_1fr_.6fr_.6fr] items-center px-6 h-14 rounded-t-[14px] border-b border-gray-200 text-[15px] font-semibold text-[#1C6C6C]">
        {/* Company Name + dropdown */}
        <div className="relative">
          <HeaderDropdown
            label="Company Name"
            chevron
            selectedLabel={
              p.filterCompany === "All Companies" ? undefined : p.filterCompany
            }
          >
            <MenuList>
              {p.companyOptions.map((opt) => (
                <MenuItem
                  key={opt}
                  selected={p.filterCompany === opt}
                  onClick={() => p.onFilterCompany(opt)}
                >
                  {opt}
                </MenuItem>
              ))}
            </MenuList>
          </HeaderDropdown>
        </div>

        <div className="text-center">ESG Sector</div>
        <div className="text-center">ESG Rating</div>

        {/* Year dropdown (defaults to 2024) */}
        <div className="relative flex items-center justify-center">
          <HeaderDropdown
            label={`${p.filterYear} Report`}
            chevron
            center
          >
            <MenuList align="right">
              {p.yearOptions.map((y) => (
                <MenuItem
                  key={y}
                  selected={p.filterYear === y}
                  onClick={() => p.onFilterYear(y)}
                >
                  {y} Report
                </MenuItem>
              ))}
            </MenuList>
          </HeaderDropdown>
        </div>
      </div>

      {/* rows */}
      <ul className="divide-y divide-gray-200">
        {p.rows.map((r, i) => (
          <li
            key={`${r.company}-${i}`}
            className="grid grid-cols-[1.2fr_1fr_.6fr_.6fr] items-center px-6 py-3">
            <div className="text-[15px] text-gray-900">{r.company}</div>
            <div className="text-[14px] text-gray-600 text-center">
              {r.sector}
            </div>
            <div className="text-[14px] font-extrabold text-gray-900 text-center">
              {r.rating}
            </div>
            <div className="text-center">
<button
className="text-[14px] font-medium text-[#1D7AEA] hover:underline"
onClick={() => p.onRequest(r.company)}
>
Download
</button>
            </div>
          </li>
        ))}
      </ul>

      {/* footer / pagination */}
      <div className="flex items-center justify-center gap-2 px-4 h-16 border-t border-gray-200 rounded-b-[14px]">
        <PagerButton ariaLabel="First" disabled={p.page === 1} onClick={() => p.onPage(1)}>
          <ChevronsLeft className="h-4 w-4" />
        </PagerButton>
        <PagerButton ariaLabel="Prev" disabled={p.page === 1} onClick={() => p.onPage(p.page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </PagerButton>

        {/* numbers */}
        <div className="mx-2 flex items-center gap-2">
          {makeWindow(p.page, p.pages).map((n, idx) =>
            n === -1 ? (
              <span key={`dots-${idx}`} className="text-gray-400 select-none">
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => p.onPage(n)}
                className={
                  n === p.page
                    ? "h-8 w-8 rounded-full bg-gray-900 text-white text-[13px] font-semibold"
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
    </div>
  );
}

/* ---------- Header dropdown primitives (no deps) ---------- */

function HeaderDropdown({
  label,
  children,
  chevron = false,
  center = false,
  selectedLabel,
}: {
  label: string;
  children: React.ReactNode;
  chevron?: boolean;
  center?: boolean;
  selectedLabel?: string;
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
    <div ref={ref} className="inline-flex items-center gap-1">
      <button
        className="inline-flex items-center gap-2 text-[#195D5D]"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{label}</span>
        {chevron && <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {/* hint of selected filter (subtle) */}
      {selectedLabel && (
        <span className="ml-2 text-xs text-gray-500 truncate max-w-[18ch]" title={selectedLabel}>
          {selectedLabel}
        </span>
      )}

      <div
        className={[
          "absolute z-30 mt-2 min-w-[240px] rounded-xl border border-gray-200 bg-white shadow-xl",
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
  return (
    <div className={["py-2", align === "right" ? "text-right" : ""].join(" ")}>
      {children}
    </div>
  );
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
        selected
          ? "bg-gray-100 text-gray-900 font-medium"
          : "text-gray-700 hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ---------- Pagination primitives ---------- */

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
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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

/* ---------- Inline icons (no deps) ---------- */

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
