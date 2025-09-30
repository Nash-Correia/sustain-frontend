"use client";

import { tooltipData } from "@/lib/tooltipData";

export function InfoTooltip({ id }: { id: string }) {
  const info = tooltipData[id];

  if (!info) {
    // Return null or a default state if the ID is not found
    return null; 
  }

  return (
    <div className="group relative inline-flex">
      <div className="ml-2 flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-gray-400 text-gray-500 hover:bg-gray-100">
        <span className="text-xs font-semibold">?</span>
      </div>
      {/* Tooltip Popup */}
      <div className="
        absolute left-1/2 z-10 w-64 -translate-x-1/2 
        transform rounded-lg bg-white p-4 text-sm 
        shadow-lg ring-1 ring-gray-900/10
        opacity-0 group-hover:opacity-100 
        transition-opacity duration-200 ease-in-out
        pointer-events-none group-hover:pointer-events-auto
        bottom-full mb-2
      ">
        <h4 className="font-bold text-gray-900">{info.title}</h4>
        <p className="mt-1 text-gray-600">{info.description}</p>
        {/* Arrow pointing down */}
        <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45 transform bg-white ring-1 ring-gray-900/10"></div>
      </div>
    </div>
  );
}
