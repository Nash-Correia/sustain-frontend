// components/ui/MultiSelect.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;          // optional inline label above the field
  onReset?: () => void;    // OPTIONAL: show a "Reset" action if provided
  resetLabel?: string;     // OPTIONAL: label for the reset button (default: "Reset")
};

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Search companies…",
  className = "",
  label,
  onReset,
  resetLabel = "Reset",
}: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // For quick lookups
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  // Filter first, then sort: selected → non-selected; both groups A→Z
  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    const base = nq
      ? options.filter((o) => o.toLowerCase().includes(nq))
      : options.slice();

    return base.sort((a, b) => {
      const aSel = selectedSet.has(a);
      const bSel = selectedSet.has(b);
      if (aSel !== bSel) return aSel ? -1 : 1; // selected first
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
  }, [options, q, selectedSet]);

  // Open/close handlers
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // When opening, reset search & focus the input
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQ("");
      setActiveIndex(-1);
    }
  }, [open]);

  function toggle(value: string) {
    if (selectedSet.has(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  function selectAll() {
    onChange([...options]);
  }
  function clearAll() {
    onChange([]);
  }

  const allSelected = selected.length === options.length && options.length > 0;

  // Keyboard navigation inside the list
  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => {
        const next = Math.min(filtered.length - 1, i + 1);
        scrollActiveIntoView(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => {
        const next = Math.max(0, i - 1);
        scrollActiveIntoView(next);
        return next;
      });
    } else if (e.key === "Enter" && activeIndex >= 0 && activeIndex < filtered.length) {
      e.preventDefault();
      toggle(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function scrollActiveIntoView(index: number) {
    const list = listRef.current;
    if (!list) return;
    const item = list.querySelector<HTMLButtonElement>(`[data-index="${index}"]`);
    if (!item) return;

    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const overTop = itemRect.top < listRect.top;
    const overBottom = itemRect.bottom > listRect.bottom;

    if (overTop) list.scrollTop -= listRect.top - itemRect.top + 4;
    else if (overBottom) list.scrollTop += itemRect.bottom - listRect.bottom + 4;
  }

  return (
    <div ref={wrapRef} className={`w-full ${className}`} onKeyDown={onKeyDown}>
      {label && (
        <label className="mb-1 block text-[13px] font-medium text-gray-700">{label}</label>
      )}

      {/* Trigger */}
      <button
        type="button"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-[14px] text-gray-900 hover:bg-gray-50 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 truncate">
            {selected.length === 0 ? (
              <span className="text-gray-400">Select companies</span>
            ) : selected.length === 1 ? (
              <span>{selected[0]}</span>
            ) : (
              <span>{selected.length} selected</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </button>

      {/* Popover */}
      {open && (
        <div className="relative z-50" role="dialog" aria-label="Select companies">
          <div className="absolute left-0 top-2 w-full min-w-[280px] rounded-xl border border-gray-200 bg-white shadow-xl">
            {/* Search + bulk actions */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 rounded-md border border-gray-200 px-2">
                <SearchIcon className="h-4 w-4 text-gray-400" />
                <input
                  ref={inputRef}
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
                <div className="flex items-center gap-3">
                  {/* Reset only shows if onReset is provided */}
                  {onReset && (
                    <button
                      type="button"
                      onClick={() => {
                        onReset?.();
                      }}
                      className="text-xs font-medium text-gray-600 hover:text-gray-800 hover:underline"
                      title="Reset selection"
                    >
                      {resetLabel}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={allSelected ? clearAll : selectAll}
                    className="text-xs font-medium text-[#195D5D] hover:underline"
                  >
                    {allSelected ? "Clear all" : "Select all"}
                  </button>
                  {selected.length > 0 && (
                    <span className="text-xs text-gray-500">{selected.length} selected</span>
                  )}
                </div>
              </div>
            </div>

            {/* List */}
            <div
              ref={listRef}
              className="max-h-64 overflow-auto py-2"
              role="listbox"
              aria-multiselectable="true"
            >
              {filtered.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">No matches</div>
              ) : (
                filtered.map((opt, idx) => {
                  const checked = selectedSet.has(opt);
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={opt}
                      type="button"
                      data-index={idx}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => toggle(opt)}
                      role="option"
                      aria-selected={checked}
                      className={[
                        "flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-sm",
                        active ? "bg-gray-50" : "",
                      ].join(" ")}
                    >
                      <input
                        readOnly
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-[#195D5D] focus:ring-[#195D5D]"
                        checked={checked}
                      />
                      <span className={checked ? "font-medium text-gray-900" : "text-gray-700"}>
                        {opt}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-3 py-2">
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => {
                  setOpen(false);
                  setActiveIndex(-1);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Inline icons (tiny) */
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 9l6 6 6-6" />
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
