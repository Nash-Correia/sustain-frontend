"use client";

import React, { useEffect, useRef, useState } from "react";
import { tooltipData } from "@/lib/tooltipData";

type Align = "left" | "center" | "right";

type InfoTooltipProps = {
  id: string;
  mode?: "click" | "hover";
  align?: Align;
  panelWidthClass?: string; // default "w-80"
  className?: string;
  titleOverride?: string;
};

const InfoIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5} // Thinner stroke
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <circle cx="12" cy="8" r="0.5" fill="currentColor" />
  </svg>
);

export function InfoTooltip({
  id,
  mode = "click",
  align = "left",
  panelWidthClass = "w-80",
  className,
  titleOverride,
}: InfoTooltipProps) {
  const info = tooltipData[id];
  if (!info) return null;

  const title = titleOverride ?? info.title;
  const desc = info.description;

  return mode === "hover" ? (
    <HoverTooltip
      title={title}
      desc={desc}
      align={align}
      panelWidthClass={panelWidthClass}
      className={className}
    />
  ) : (
    <ClickPopover
      title={title}
      desc={desc}
      align={align}
      panelWidthClass={panelWidthClass}
      className={className}
    />
  );
}

/* ------------------ Hover Tooltip ------------------ */
function HoverTooltip({
  title,
  desc,
  align,
  panelWidthClass,
  className,
}: {
  title: string;
  desc: string;
  align: Align;
  panelWidthClass: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const pos =
    align === "center"
      ? "left-1/2 -translate-x-1/2"
      : align === "right"
      ? "right-0"
      : "left-0";

  return (
    <span
      className={`relative inline-flex ${className ?? ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span
        className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        role="img"
        aria-label="More info"
        tabIndex={0}
      >
        <InfoIcon />
      </span>

      <div
        role="tooltip"
        className={`
          absolute ${pos} bottom-full mb-2 z-[60] ${panelWidthClass}
          rounded-lg bg-white p-3 text-sm shadow-md ring-1 ring-black/10
          transition-all duration-150 ease-out
          ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}
        `}
      >
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="mt-1 text-gray-600 text-justify leading-relaxed">{desc}</p>
        <div
          className={`
            absolute top-full h-2 w-2 rotate-45 bg-white ring-1 ring-black/10
            ${align === "center" ? "left-1/2 -translate-x-1/2" : align === "right" ? "right-3" : "left-3"}
          `}
        />
      </div>
    </span>
  );
}

/* ------------------ Click Popover (small modal) ------------------ */
function ClickPopover({
  title,
  desc,
  align,
  panelWidthClass,
  className,
}: {
  title: string;
  desc: string;
  align: Align;
  panelWidthClass: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // ✅ NEW: close when NOT hovering (pointer leaves icon/panel)
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!ref.current) return;
      const isInside = ref.current.contains(e.target as Node);
      if (!isInside) setOpen(false);
    }
    if (open) document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [open]);

  const pos =
    align === "center"
      ? "left-1/2 -translate-x-1/2 origin-top"
      : align === "right"
      ? "right-0 origin-top-right"
      : "left-0 origin-top-left";

  return (
    <div className={`relative inline-flex ${className ?? ""}`} ref={ref}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full  text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <InfoIcon />
        <span className="sr-only">Show info</span>
      </button>

      <div
        role="dialog"
        aria-modal="false"
        className={`
          absolute ${pos} top-full mt-2 z-[60] ${panelWidthClass}
          rounded-xl border border-gray-200 bg-white p-4 shadow-xl
          transition-all duration-150 ease-out
          ${open ? "opacity-90 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-1 pointer-events-none"}
        `}
      >
        <div className="flex items-start gap-2">
          {/* <span className=" inline-flex h-4 w-7 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-200">
            <InfoIcon className="h-3 w-3" />
          </span> */}
        <div className="min-w-0">
            <h4 className="text-sm text-left font-semibold text-gray-900 opacity-80">{title}</h4>
            <p className="mt-1 text-sm text-gray-600 text-justify leading-relaxed opacity-60">{desc}</p>
          </div>
        </div>

        <div
          className={`
            absolute -top-2 h-3 w-3 rotate-45 bg-white border-t border-l border-gray-200
            ${align === "center" ? "left-1/2 -translate-x-1/2" : align === "right" ? "right-6" : "left-6"}
          `}
        />
      </div>
    </div>
  );
}
