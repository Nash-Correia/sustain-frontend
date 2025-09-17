import React from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

// Data for the link columns to keep the JSX clean
const footerSections = [
  {
    title: "Links",
    links: [
      { text: "About IiAS", href: ROUTES.about },
      { text: "Company Profile", href: "#" }, // Placeholder link
    ],
  },
  {
    title: "Products",
    links: [
      { text: "Voting Advisory", href: "#" }, // Placeholder link
      { text: "Voting Analytics", href: "#" }, // Placeholder link
      { text: "Compayre", href: "#" }, // Placeholder link
      { text: "Governance Scorecard", href: "#" }, // Placeholder link
      { text: "ESG Advisory", href: ROUTES.productB },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "Privacy Policy", href: "#" }, // Placeholder link
      { text: "Terms of Use", href: "#" }, // Placeholder link
      { text: "Disclaimer", href: "#" }, // Placeholder link
      { text: "Return and refund policy", href: "#" }, // Placeholder link
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white text-brand-dark border-t border-gray-200 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section with columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link href={link.href} className="text-gray-600 hover:text-gray-900 underline underline-offset-4 transition-colors">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-gray-900">Contact</h3>
            <div className="mt-4 space-y-3">
              <a href="mailto:solutions@iias.in" className="block text-gray-600 hover:text-gray-900 underline underline-offset-4 transition-colors">
                solutions@iias.in
              </a>
              <a href="tel:022-6123-5509" className="block text-gray-600 hover:text-gray-900 underline underline-offset-4 transition-colors">
                022-6123-5509
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-500">
            © {new Date().getFullYear()} IiAS. All Rights Reserved.
          </span>
          <div className="flex items-center gap-6 text-sm">
             <Link href="#" className="text-gray-500 hover:text-gray-900 underline underline-offset-4 transition-colors">
               Disclaimer
             </Link>
             <Link href="#" className="text-gray-500 hover:text-gray-900 underline underline-offset-4 transition-colors">
               Terms & Conditions
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}