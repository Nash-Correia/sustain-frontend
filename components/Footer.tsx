import React from "react";
import Link from "next/link";
import { ROUTES, SITE } from "@/lib/constants";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-600" aria-hidden />
            <span className="font-semibold text-white">{SITE.name}</span>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Advisory, ratings, and research for better governance outcomes.
          </p>
        </div>

        <div className="text-sm">
          <div className="font-semibold text-white">Links</div>
          <ul className="mt-2 space-y-1">
            <li><Link href={ROUTES.home} className="hover:underline">Home</Link></li>
            <li><Link href={ROUTES.methodology} className="hover:underline">Methodology</Link></li>
            <li><Link href={ROUTES.about} className="hover:underline">About</Link></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="font-semibold text-white">Newsletter</div>
          <p className="mt-2 text-gray-400">Get updates on new insights.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-gray-500 flex flex-wrap items-center justify-between">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <div className="space-x-4">
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
