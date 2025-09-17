"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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

export default function SearchHero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    // You can update this URL to a dedicated search results page if you have one
    const url = `/?q=${encodeURIComponent(query)}`;
    router.push(url);
  }

return (
    <section aria-label="Site search" className="pt-8 pb-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form /* ... */ className="mx-auto max-w-2xl flex items-stretch gap-2">
          {/* ... */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-dark px-4 sm:px-5 text-white text-base font-medium shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
          >
            <SearchIcon className="text-white h-5 w-5" />
            <span className="hidden sm:inline">Search</span> {/* Text appears on small screens and up */}
          </button>
        </form>
      </div>
    </section>
  );
}
