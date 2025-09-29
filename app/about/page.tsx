"use client";
import React, { useState } from "react";

/* ---------- Reusable ---------- */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">{children}</h2>
);

/* ---------- Icons ---------- */
const IndependenceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);
const TransparencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const AccountabilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ReadPolicyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

/* ---------- Lightweight PDF Modal (embedded viewer) ---------- */
function PdfModal({
  open,
  title,
  src,
  onClose,
}: {
  open: boolean;
  title: string;
  src: string;
  onClose: () => void;
}) {
  if (!open) return null;
  // Encode the URL safely (spaces, punctuation)
  const encoded = encodeURI(src);

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" onClick={onClose} />
      <div className="absolute inset-x-0 top-8 mx-auto w-[95vw] max-w-5xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 h-14 rounded-t-2xl">
          <h3 className="truncate text-base font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            <a
              href={encoded}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline text-sm text-[#1D7AEA] hover:underline"
            >
              Open in new tab
            </a>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
        <div className="rounded-b-2xl overflow-hidden">
          <iframe
            src={encoded}
            title={title}
            className="block h-[75vh] w-full"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */

const AboutHero = () => (
  <section className="bg-brand-surface">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark">About</h1>
      <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
        Institutional Investor Advisory Services India Limited (IiAS) is an advisory firm, dedicated to providing participants in the Indian market with independent opinions, research and data on corporate governance and ESG issues as well as voting recommendations on shareholder resolutions.
      </p>
    </div>
  </section>
);

const OurPurpose = () => (
  <section className="px-6 sm:px-10 lg:px-16 py-20">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="order-2 md:order-1 space-y-4 text-gray-700 text-lg">
        <h2 className="text-3xl font-bold text-brand-dark mb-4">Our Purpose</h2>
        <p>
          IiAS provides bespoke research and assists institutions in their engagement with company managements and their boards. It runs two cloud-based platforms: SMART, to help investors with reporting on their stewardship activities, and ADRIAN, a repository of resolutions and institutional voting patterns.
        </p>
        <p>
          IiAS has worked with some of India's largest hedge funds, alternate investment funds, and PE Funds to guide them in their ESG assessments and integrate ESG into their investment decisions.
        </p>
      </div>
      <div className="order-1 md:order-2">
        {/* Replace with a real image placed at public/images/about/our-purpose.jpg */}
        <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-200">
          <img
            src="/images/about/our-purpose.jpg"
            alt="Our Purpose"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

const OurCommitment = () => {
  const commitments = [
    { icon: <IndependenceIcon />, title: "Independence", description: "Our research and recommendations are driven by data and an unbiased assessment of corporate governance practices." },
    { icon: <TransparencyIcon />, title: "Transparency", description: "We believe in clear, open communication and provide detailed insights into our methodologies and voting guidelines." },
    { icon: <AccountabilityIcon />, title: "Accountability", description: "We hold ourselves to the highest standards of integrity and are committed to promoting accountability in the Indian market." },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle>Our Commitment</SectionTitle>
        <div className="grid md:grid-cols-3 gap-8">
          {commitments.map((item) => (
            <div key={item.title} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="flex-shrink-0 w-20 h-20 mx-auto mb-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-brand-dark">{item.title}</h3>
              <p className="mt-4 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OurPeople = () => {
  // IMPORTANT: remove "/public" from paths; files live under /public and are served from "/"
  const team = [
    { name: "Amit Tandon", title: "Founder & Managing Director", imageUrl: "/images/team/amit-tandon.jpeg" },
    { name: "Hetal Dalal", title: "President & COO", imageUrl: "/images/team/hetal-dalal.jpg" },
    { name: "Anil Singhvi", title: "Founder, Non-Executive Director", imageUrl: "/images/team/anil-singhvi.jpeg" },
    { name: "Deven Sharma", title: "Non-Executive Director", imageUrl: "/images/team/deven-sharma.jpeg" },
    { name: "V. Srinivasan", title: "Independent Non-Executive Director", imageUrl: "/images/team/v-srinivasan.png" },
    { name: "Dr. Shubhada Rao", title: "Independent Non-Executive Director", imageUrl: "/images/team/shubhada-rao.jpg" },
    { name: "Alok Vajpeyi", title: "Independent Non-Executive Director", imageUrl: "/images/team/alok-vajpeyi.png" },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle>Our People</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center group">
              <div className="w-48 h-48 mx-auto rounded-full bg-gray-100 mb-4 overflow-hidden transform group-hover:scale-105 transition-transform border border-gray-200">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-brand-dark">{member.name}</h3>
              <p className="text-gray-600">{member.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

type Policy = { title: string; description: string; href: string };

const Policies = () => {
  // IMPORTANT: remove "/public" from hrefs; public files are served at "/..."
  const policies: Policy[] = [
    {
      title: "IiAS Voting Recommendations' Methodology and Process",
      description:
        "A brief note outlining the method and process that IiAS' analysts follow in arriving at voting recommendations.",
      href: "/about/policies/IiAS Voting Recommendations’ Methodology and Process.pdf",
    },
    {
      title: "Securities Trading Policy",
      description:
        "Our voting advisory reports recommend how investors should vote on shareholder resolutions – these do not carry any buy or sell recommendations.",
      href: "/about/policies/Securities Trading Policy.pdf",
    },
    {
      title: "Anti-Money Laundering Policy",
      description:
        "IiAS has adopted this AML Policy, which is commensurate with the nature of its business, organizational structure and type of clients and transactions.",
      href: "/about/policies/Anti-Money Laundering Policy.pdf",
    },
    {
      title: "Website Privacy Policy",
      description: "In general, this Website may be visited without revealing information about yourself.",
      href: "/about/policies/Website Privacy Policy.pdf",
    },
    {
      title:
        "Policy on dealing with Complaints and Grievances received from Market Participants",
      description:
        "A brief note outlining the process that will be followed in dealing with complaints and grievances received from market participants.",
      href: "/about/policies/Complaints and Grievances Policy.pdf",
    },
    {
      title: "Review and Oversight Committee",
      description:
        "The Review and Oversight Committee (ROC) has been constituted to oversee the voting recommendations published by IiAS.",
      href: "/about/policies/Review and Oversight Committee.pdf",
    },
    {
      title:
        "Policy on Communication with Investors, Companies, Media and Regulators",
      description:
        "This policy lays down the basis of IiAS' communication with such stakeholders, with specific context to its voting advisory and engagement services.",
      href: "/about/policies/Communication Policy.pdf",
    },
    {
      title: "Policy on Prevention of Sexual Harassment",
      description:
        "IiAS is an equal employment opportunity company and is committed to creating a healthy working environment.",
      href: "/about/policies/Policy on Prevention of Sexual Harassment.pdf",
    },
    {
      title: "Code of Conduct",
      description:
        "IiAS' employees and others performing work for IiAS or on its behalf are expected to act lawfully, honestly, ethically, and in the best interests of the company.",
      href: "../public/about/policies/Code of Conduct.pdf",
    },
  ];

  const [viewer, setViewer] = useState<{ open: boolean; title: string; href: string }>({
    open: false,
    title: "",
    href: "",
  });

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle>Policies</SectionTitle>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {policies.map((policy) => {
              const encoded = encodeURI(policy.href);
              return (
                <div key={policy.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-brand-dark">{policy.title}</h3>
                  <p className="mt-2 text-gray-600">{policy.description}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {/* View in-site (modal) */}
                    <button
                      type="button"
                      onClick={() => setViewer({ open: true, title: policy.title, href: encoded })}
                      className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      View PDF
                    </button>
                    {/* Open in new tab (direct link) */}
                    <a
                      href={encoded}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-teal-600 font-semibold hover:underline"
                    >
                      Read Policy <ReadPolicyIcon />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <PdfModal
        open={viewer.open}
        title={viewer.title}
        src={viewer.href}
        onClose={() => setViewer({ open: false, title: "", href: "" })}
      />
    </section>
  );
};

/* ---------- Disclosure (after Policies) ---------- */
const Disclosure = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle>Disclosure</SectionTitle>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4 text-gray-700">
          <p>
            IiAS Sustain provides independent research and voting recommendations based on publicly available
            information, company disclosures, and our proprietary methodology. Our opinions are not investment
            advice or an offer to buy/sell securities. While care is taken to ensure accuracy, IiAS does not
            guarantee completeness and will not be liable for losses arising from reliance on this material.
          </p>
          <p>
            Conflicts of interest are managed via documented policies and oversight by the Review and Oversight
            Committee. Employees are subject to a Code of Conduct and Securities Trading Policy.
          </p>

          {/* Optional: downloadable disclosure PDF if you have one */}
          <div className="pt-2">
            <a
              href={encodeURI("/about/policies/Disclosure.pdf")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              View Full Disclosure (PDF)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Page ---------- */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurPurpose />
      <OurCommitment />
      <OurPeople />
      <Policies />
      <Disclosure />
    </>
  );
}
