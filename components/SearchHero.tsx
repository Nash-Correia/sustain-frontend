"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchHero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = q.trim();
    const url = query ? `/?q=${encodeURIComponent(query)}` : "/";
    router.push(url);
  }

  return (
    <section aria-label="Site search" className="bg-[rgba(226,238,240,0.50)] backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={onSubmit} className="mx-auto max-w-4xl flex flex-col md:flex-row items-stretch gap-3">
          <label htmlFor="site-search" className="sr-only">Search</label>
          <input
            id="site-search"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type to search..."
            className="flex-1 h-14 rounded-md border border-black bg-[#F4FAF4] shadow-md px-4 text-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-600"
            autoComplete="off"
          />
          <button
            type="submit"
            className="md:w-auto w-full h-14 inline-flex items-center justify-center gap-2 rounded-[15px] bg-black px-6 text-white text-lg font-medium shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
              <path d="M20 20L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Search</span>
          </button>
        </form>
      </div>
    </section>
  );
}
