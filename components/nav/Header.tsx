"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ROUTES, SITE } from "@/lib/constants";
import { clsx } from "@/lib/utils";

function Dropdown({
  label,
  align = "right",
  children,
}: {
  label: React.ReactNode;
  align?: "left" | "right";
  children: React.ReactNode;
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
    <div className="relative" ref={ref}>
      <button
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-md inline-flex items-center gap-1"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        <svg className={clsx("h-4 w-4 transition-transform", open && "rotate-180")} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
        </svg>
      </button>
      <div
        className={clsx(
          "absolute z-30 mt-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-xl",
          align === "right" ? "right-0" : "left-0",
          open ? "block" : "hidden"
        )}
        role="menu"
        aria-hidden={!open}
      >
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
}

function MenuItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center gap-2">
      
            <img 
  src="/logos/iias-sustain-logo.png" 
  alt="My Site Logo" 
  className="h-14 w-14" 
/>
            <span className="font-semibold tracking-tight">{SITE.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <Dropdown label={<>Products</>} align="left">
                <MenuItem href={ROUTES.productA}>Product Sub‑page 1</MenuItem>
                <MenuItem href={ROUTES.productB}>Product Sub‑page 2</MenuItem>
              </Dropdown>
              <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </div>

            <div className="relative group">
              <Link href={ROUTES.methodology} className="px-2 py-2 text-xl font-medium text-black hover:text-gray-700 transition-colors">
                Methodology
              </Link>
              <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </div>

            <div className="relative group">
              <Link href={ROUTES.policies} className="px-2 py-2 text-xl font-medium text-black hover:text-gray-700 transition-colors">
                Policies
              </Link>
              <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </div>

            <div className="relative group">
              <Link href={ROUTES.about} className="px-2 py-2 text-xl font-medium text-black hover:text-gray-700 transition-colors">
                About
              </Link>
              <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </div>
          </nav>

          {/* Login Button */}
          <div className="hidden md:block">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-lg shadow-lg transition-colors">
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-800">
                <span>Products</span>
                <span className="ml-2">▾</span>
              </summary>
              <div className="pl-4 py-2 space-y-1">
                <Link className="block text-sm text-gray-700 py-1" href={ROUTES.productA}>Product Sub‑page 1</Link>
                <Link className="block text-sm text-gray-700 py-1" href={ROUTES.productB}>Product Sub‑page 2</Link>
              </div>
            </details>
            <Link className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-800" href={ROUTES.methodology}>Methodology</Link>
            <Link className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-800" href={ROUTES.policies}>Policies</Link>
            <Link className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-800" href={ROUTES.about}>About</Link>
            <button className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors">
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
