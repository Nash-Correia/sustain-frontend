"use client";
import React, { useRef, useState, useEffect } from "react";

export default function MultiSelect({
  options,
  selected,
  onChange,
  label = "Select Company",
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  label?: string;
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

  const allSelected = selected.length === options.length;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-[#D0E6E3] px-4 py-2 text-left text-[14px] text-gray-800"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{label}</span>
        <ChevronDown className="h-5 w-5 text-gray-500" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xl">
          <div className="max-h-56 overflow-auto">
            <ul className="divide-y divide-gray-100">
              {options.map((opt) => {
                const checked = selected.includes(opt);
                return (
                  <li key={opt} className="bg-[#E9F3F1]">
                    <label className="flex items-center gap-2 px-3 py-2 text-[13px] text-gray-800">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...selected, opt]
                            : selected.filter((x) => x !== opt);
                          onChange(next);
                        }}
                      />
                      <span className="truncate">{opt}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex items-center justify-between bg-white px-3 py-2 text-[13px]">
            <button
              type="button"
              className="rounded border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50"
              onClick={() => onChange(allSelected ? [] : options)}
            >
              {allSelected ? "Clear All" : "Select All"}
            </button>
            <button
              type="button"
              className="rounded bg-gray-900 px-3 py-1 text-white"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
