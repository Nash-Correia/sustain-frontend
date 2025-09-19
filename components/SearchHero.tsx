"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef } from "react";

// A simple, reusable Search Icon component
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// Clear icon for clearing search input
const ClearIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function SearchHero() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    // You can update this URL to a dedicated search results page if you have one
    const url = `/?q=${encodeURIComponent(query)}`;
    router.push(url);
  }

  function clearSearch() {
    setQ("");
    inputRef.current?.focus();
  }

  return (
    <section aria-label="Site search" className="pt-8 pb-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form onSubmit={onSubmit} className="mx-auto max-w-3xl">
          <div className="relative">
            {/* Search input container */}
            <div
              className={`relative flex items-center overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all duration-200 ${
                isFocused
                  ? "shadow-lg ring-4 ring-opacity-20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={isFocused ? {
                borderColor: 'var(--color-login-btn)',
                '--tw-ring-color': 'var(--color-login-btn)'
              } as React.CSSProperties : {}}
            >
              {/* Search icon */}
              <div className="pl-4 pr-3">
                <SearchIcon className="text-gray-400 h-5 w-5" />
              </div>

              {/* Input field */}
              <input
                ref={inputRef}
                type="text"
                placeholder="Search companies, insights, reports..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 py-4 pr-4 text-base placeholder-gray-500 border-0 focus:outline-none focus:ring-0 bg-transparent"
                autoComplete="off"
                spellCheck="false"
              />

              {/* Clear button - shows when there's text */}
              {q && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mr-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Clear search"
                >
                  <ClearIcon className="text-gray-400 hover:text-gray-600" />
                </button>
              )}

              {/* Search button */}
              <button
                type="submit"
                disabled={!q.trim()}
                className={`m-1.5 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  q.trim()
                    ? "cursor-pointer hover:opacity-90"
                    : "opacity-50 cursor-not-allowed"
                }`}
                style={q.trim() ? {
                  backgroundColor: 'var(--color-login-btn)',
                  '--tw-ring-color': 'var(--color-login-btn)'
                } as React.CSSProperties : {
                  backgroundColor: '#f3f4f6',
                  color: '#9ca3af'
                }}
              >
                <SearchIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* Optional: Search suggestions or recent searches */}
            {isFocused && !q && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Popular searches
                  </h3>
                  <div className="space-y-2">
                    {[
                      "ESG compliance",
                      "Corporate governance",
                      "Proxy voting",
                      "Sustainability reports",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setQ(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <SearchIcon className="inline h-4 w-4 mr-2 text-gray-400" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Optional: Quick filters or categories */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {[
              "All",
              "Companies",
              "Reports",
              "News",
              "Insights"
            ].map((filter) => (
              <button
                key={filter}
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}