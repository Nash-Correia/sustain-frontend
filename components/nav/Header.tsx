// components/nav/Header.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { clsx } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

/** Props we may inject into dropdown children */
type WithSetOpen = { setOpen?: (v: boolean) => void };

/** Type guard: is a valid React element */
function isElement(node: React.ReactNode): node is React.ReactElement {
  return React.isValidElement(node);
}

/** Type guard: a Fragment with children (so props.children is known) */
function isFragmentElement(
  node: React.ReactNode
): node is React.ReactElement<{ children?: React.ReactNode }> {
  return isElement(node) && node.type === React.Fragment;
}

/** Safely inject setOpen into children (skips Fragments themselves, recurses into their children) */
function injectSetOpenIntoChildren(
  children: React.ReactNode,
  setOpen: (v: boolean) => void
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!isElement(child)) return child;

    // If it's a Fragment, do NOT pass props to the Fragment; recurse into its children
    if (isFragmentElement(child)) {
      const fragKids = injectSetOpenIntoChildren(child.props.children, setOpen);
      return <>{fragKids}</>;
    }

    // Normal element: clone with setOpen prop
    return React.cloneElement(child as React.ReactElement<WithSetOpen>, { setOpen });
  });
}

/** Reusable Dropdown */
function Dropdown({
  label,
  children,
  className,
  align = "right", // "right" | "center"
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: "right" | "center";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const renderedChildren = injectSetOpenIntoChildren(children, setOpen);

  return (
    <div className="relative" ref={ref}>
      <button
        className={clsx("inline-flex items-center gap-2", className)}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        <svg
          className={clsx("h-5 w-5 transition-transform", open && "rotate-180")}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
      </button>

      <div
        className={clsx(
          "absolute z-30 mt-3 w-64 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden transition-all duration-150 ease-out",
          align === "center" ? "left-1/2 -translate-x-1/2" : "right-0",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        role="menu"
        aria-hidden={!open}
      >
        <div className="py-2">{renderedChildren}</div>
      </div>
    </div>
  );
}

/** Link item used inside dropdowns */
function MenuItem({
  href,
  children,
  setOpen,
}: {
  href: string;
  children: React.ReactNode;
  setOpen?: (v: boolean) => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block w-full text-left px-4 py-2 text-lg text-gray-700 hover:bg-gray-50"
      onClick={() => setOpen?.(false)}
    >
      {children}
    </Link>
  );
}

/** Action item (button) used inside dropdowns */
function MenuAction({
  onClick,
  children,
  setOpen,
}: {
  onClick: () => void;
  children: React.ReactNode;
  setOpen?: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className="block w-full text-left px-4 py-2 text-lg text-gray-700 hover:bg-gray-50"
      onClick={() => {
        onClick();
        setOpen?.(false);
      }}
    >
      {children}
    </button>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Base classes for top nav links
  const navLinkClasses =
    "relative px-2 py-2 text-xl font-medium text-gray-900 hover:text-gray-700 transition-colors after:content-[''] after:absolute after:left-2 after:right-2 after:bottom-0 after:h-0.5 after:bg-teal-600 after:transform after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100";

  // One auth button: either "Login" or "User" with dropdown
  const authLabel = !user ? "Login" : "User";
  const authButtonClasses =
    "px-5 py-3 bg-login-btn hover:bg-opacity-90 text-white font-bold text-lg rounded-md shadow-sm transition-colors";

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <img src="/logo/iias-sustain-logo.png" alt="IIAS Sustain" className="h-18 w-22" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8 text-xl">
              <Dropdown label="Products" className={navLinkClasses} align="center">
                <MenuItem href={ROUTES.productA}>ESG Comparison</MenuItem>
                <MenuItem href={ROUTES.productB}>ESG Reports</MenuItem>
              </Dropdown>

              <Link href={ROUTES.methodology} className={navLinkClasses}>
                Methodology
              </Link>
              <Link href={ROUTES.about} className={navLinkClasses}>
                About
              </Link>
            </nav>

            {/* ✅ Single Auth Button with Dropdown */}
            <Dropdown label={authLabel} className={authButtonClasses} align="right">
              {!user ? (
                <>
                  <MenuItem href={ROUTES.login}>Login</MenuItem>
                  <MenuItem href={ROUTES.signup}>Sign Up</MenuItem>
                </>
              ) : (
                <>
                  <MenuAction onClick={signOut}>Logout</MenuAction>
                </>
              )}
            </Dropdown>
          </div>

          {/* Mobile toggle */}
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

      {/* TODO: Mobile menu implementation can mirror the single-button logic if needed */}
    </header>
  );
}
