import React from "react";
import { motion, Transition } from "framer-motion";

// --- SVG Icons ---
const CompanyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
  </svg>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ErpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const PriIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 11l-4 4-4-4"/>
    <path d="M5 15V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2"/>
    <path d="M15 13l4-4 4 4"/>
    <path d="M19 9V20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2"/>
  </svg>
);

const ReportsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

export default function StatsGrid() {
  const stats = [
    { value: "Top 500 Mcap", label: "Companies Covered", Icon: CompanyIcon },
    { value: "2010", label: "Years of Establishment", Icon: CalendarIcon },
    { value: "SEBI", label: "Registered ERP", Icon: ErpIcon },
    { value: "PRI", label: "Signatory of PRI", Icon: PriIcon },
    { value: "500+", label: "Reports Generated", Icon: ReportsIcon },
  ];

  // Spring transition
  const spring: Transition = {
    type: "spring",
    damping: 15,
    stiffness: 120,
  };

  // Motion variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: spring },
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex flex-col items-center gap-6">
        {/* First row */}
        <div className="flex justify-center gap-10 flex-wrap">
          {stats.slice(0, 3).map((item, index) => (
            <motion.div
              key={item.label}
              className="w-64 rounded-xl bg-white p-6 text-center shadow-lg hover:shadow-xl flex flex-col items-center"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...spring, delay: index * 0.1 }}
            >
              <item.Icon className="h-16 w-16 mb-4 text-teal-600" />
              <dt className="text-4xl font-bold text-brand-dark">{item.value}</dt>
              <dd className="mt-2 text-base text-gray-600">{item.label}</dd>
            </motion.div>
          ))}
        </div>

        {/* Second row */}
        <div className="flex justify-center gap-10 flex-wrap">
          {stats.slice(3).map((item, index) => (
            <motion.div
              key={item.label}
              className="w-64 rounded-xl bg-white p-6 text-center shadow-lg hover:shadow-xl flex flex-col items-center"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...spring, delay: index * 0.1 }}
            >
              <item.Icon className="h-16 w-16 mb-4 text-teal-600" />
              <dt className="text-4xl font-bold text-brand-dark">{item.value}</dt>
              <dd className="mt-2 text-base text-gray-600">{item.label}</dd>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
