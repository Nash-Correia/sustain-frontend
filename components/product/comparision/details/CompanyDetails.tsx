"use client";

import { CompanyDataRow } from "@/lib/excel-data";
import { formatNumber } from "../../productUtils";
import GreenRatingGauge from "../../GreenRatingGauge";

type GaugeData = { score: number; rating: string; name: string };

const CompanyDetails = ({
  company,
  handleAddToPortfolio, // kept for parity, button moved to sticky bar
  gaugeData, // reserved
}: {
  company: CompanyDataRow;
  handleAddToPortfolio: (company: CompanyDataRow) => void;
  gaugeData: GaugeData;
}) => {
  if (!company || !company.companyName) return null;

  const clamp100 = (n: number | undefined | null) =>
    Math.max(0, Math.min(100, Number(n ?? 0)));

  const eVal = clamp100(company.e_score);
  const sVal = clamp100(company.s_score);
  const gVal = clamp100(company.g_score);
  const compositeVal = clamp100(company.composite);
  const esgScoreVal = clamp100(company.esgScore);

  const tileOuter = "flex justify-center";
  const tileInner = "w-full max-w-[260px] rounded-lg border p-5 text-center";

  const Bar = ({ value, className }: { value: number; className: string }) => (
    <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${className}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
      {/* (Title + Add moved to page-level sticky bar) */}

      {/* KPI ribbon - Increased size for top priority items */}
{/* <div className="flex flex-wrap items-stretch gap-4 mb-6">
  <div className="relative inline-flex flex-col gap-2 rounded-xl border-2 border-brand-action/20 px-6 py-4 bg-gradient-to-br from-white to-gray-50 shadow-sm overflow-hidden group transition-all duration-300">
    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-action/5 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold relative z-10">ESG Rating</span>
    <span className="text-4xl font-black leading-none text-brand-dark relative z-10">
      {company.grade || "-"}
    </span>
  </div>
  
  <div className="inline-flex items-center gap-4 rounded-xl border border-gray-200 px-5 py-4 bg-white shadow-sm  transition-shadow duration-300">
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Composite Score</span>
      <span className="text-2xl font-bold leading-none text-gray-900">
        {formatNumber(compositeVal)}
      </span>
    </div>
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-surface to-brand-action/10 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-action">
        <path d="M6 18V10" />
        <path d="M12 18V6" />
        <path d="M18 18V12" />
      </svg>
    </div>
  </div>
</div> */}

      {/* Progress group - Slightly smaller */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="min-w-[110px] text-sm text-gray-700 font-medium">Environmental</div>
          <Bar value={eVal} className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600" />
          <div className="w-14 text-right text-sm font-semibold text-gray-900 tabular-nums">
            {formatNumber(eVal)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-[110px] text-sm text-gray-700 font-medium">Social</div>
          <Bar value={sVal} className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />
          <div className="w-14 text-right text-sm font-semibold text-gray-900 tabular-nums">
            {formatNumber(sVal)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-[110px] text-sm text-gray-700 font-medium">Governance</div>
          <Bar value={gVal} className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
          <div className="w-14 text-right text-sm font-semibold text-gray-900 tabular-nums">
            {formatNumber(gVal)}
          </div>
        </div>
      </div>

      {/* Screens - Medium size cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

        {/* ESG Score - Third Priority (Medium-Large) */}
        <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow duration-300">
          <div>
            <p className="text-xs text-gray-600 font-sm uppercase tracking-wider">
              ESG Pillar Score
            </p>
            <p className="text-xl font-semibold text-slate-800 mt-1 break-words">
              {company.esgScore || "-"}
            </p>
          </div>
          <div className="flex-shrink-0 bg-gray-100 rounded-full p-2.5 ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18V10" stroke="#228B22" />
              <path d="M12 18V6" stroke="#4169E1" />
              <path d="M18 18V12" stroke="#FFBF00" />
            </svg>
          </div>
        </div>

        {/* Positive Screen - Lower Priority (Medium) */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow duration-300">
          <div>
            <p className="text-xs text-teal-700 font-sm uppercase tracking-wider">
              Positive Screen
            </p>
            <p className="text-lg font-semibold text-teal-900 mt-1 break-words">
              {company.positive || "-"}
            </p>
          </div>
          <div className="flex-shrink-0 bg-teal-100 rounded-full p-2 ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-teal-600"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        </div>

        {/* Negative Screen - Lower Priority (Medium) */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow duration-300">
          <div>
            <p className="text-xs text-rose-700 font-sm uppercase tracking-wider">
              Negative Screen
            </p>
            <p className="text-lg font-semibold text-rose-900 mt-1 break-words">
              {company.negative || "-"}
            </p>
          </div>
          <div className="flex-shrink-0 bg-rose-100 rounded-full p-2 ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-rose-600"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m14.5 9.5-5 5" />
              <path d="m9.5 9.5 5 5" />
            </svg>
          </div>
        </div>

        {/* Controversy Rating - Lower Priority (Medium) */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow duration-300">
          <div>
            <p className="text-xs text-amber-700 font-sm uppercase tracking-wider">
              Controversy Rating
            </p>
            <p className="text-lg font-semibold text-amber-900 mt-1 break-words">
              {company.controversy || "-"}
            </p>
          </div>
          <div className="flex-shrink-0 bg-amber-100 rounded-full p-2 ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-600"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
        </div>

      </div>

</div>



  );
};

export default CompanyDetails;






// <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">

//   {/* --- 1. Main Highlight: Rating & Composite Score --- */}
//   <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 mb-8 pb-8 border-b border-gray-200">
//     {/* ESG Rating (Grade) */}
//     <div className="text-center">
//       <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">ESG Rating</p>
//       <p className="text-7xl sm:text-8xl font-bold text-brand-dark leading-none mt-2">
//         {company.grade || "-"}
//       </p>
//     </div>

//     {/* Composite Score & ESG Score */}
//     <div className="flex-1 space-y-4">
//       <div className="flex items-baseline gap-3">
//         <p className="text-4xl font-bold text-gray-800">{formatNumber(compositeVal)}</p>
//         <p className="text-lg text-gray-600">Composite Score</p>
//       </div>
//        <div className="flex items-baseline gap-3">
//         <p className="text-2xl font-semibold text-gray-700">{formatNumber(esgScoreVal)}</p>
//         <p className="text-md text-gray-500">ESG Score</p>
//       </div>
//     </div>
//   </div>

//   {/* --- 2. Pillar Scores (E, S, G) --- */}
//   <div className="space-y-4 mb-8">
//     <h3 className="text-lg font-semibold text-gray-800 mb-3">Pillar Performance</h3>
//     {/* Environmental */}
//     <div className="flex items-center gap-4">
//       <div className="w-28 text-sm text-gray-600 font-medium">Environmental</div>
//       <Bar value={eVal} className="bg-gradient-to-r from-emerald-400 to-emerald-600" />
//       <div className="w-12 text-right text-sm font-semibold text-gray-900 tabular-nums">
//         {formatNumber(eVal)}
//       </div>
//     </div>
//     {/* Social */}
//     <div className="flex items-center gap-4">
//       <div className="w-28 text-sm text-gray-600 font-medium">Social</div>
//       <Bar value={sVal} className="bg-gradient-to-r from-sky-400 to-indigo-600" />
//       <div className="w-12 text-right text-sm font-semibold text-gray-900 tabular-nums">
//         {formatNumber(sVal)}
//       </div>
//     </div>
//     {/* Governance */}
//     <div className="flex items-center gap-4">
//       <div className="w-28 text-sm text-gray-600 font-medium">Governance</div>
//       <Bar value={gVal} className="bg-gradient-to-r from-amber-400 to-amber-600" />
//       <div className="w-12 text-right text-sm font-semibold text-gray-900 tabular-nums">
//         {formatNumber(gVal)}
//       </div>
//     </div>
//   </div>

//   {/* --- 3. Screens & Controversy --- */}
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//     {/* Positive Screen */}
//     <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
//       <p className="text-xs text-teal-800 font-medium uppercase tracking-wider">Positive Screen</p>
//       <p className="text-xl font-semibold text-teal-900 mt-1 truncate">
//         {company.positive || "-"}
//       </p>
//     </div>
//     {/* Negative Screen */}
//     <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
//       <p className="text-xs text-rose-800 font-medium uppercase tracking-wider">Negative Screen</p>
//       <p className="text-xl font-semibold text-rose-900 mt-1 truncate">
//         {company.negative || "-"}
//       </p>
//     </div>
//     {/* Controversy Rating */}
//     <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
//       <p className="text-xs text-amber-800 font-medium uppercase tracking-wider">Controversy</p>
//       <p className="text-xl font-semibold text-amber-900 mt-1 truncate">
//         {company.controversy || "-"}
//       </p>
//     </div>
//   </div>

// </div>





















// <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
//   {(() => {
//     /* ---------- Helper components ---------- */
//     const InsightCard = ({
//       title,
//       value,
//       color,
//     }: {
//       title: string;
//       value: string;
//       color: "teal" | "rose" | "amber";
//     }) => {
//       const palette = {
//         teal: {
//           bg: "bg-teal-50",
//           border: "border-teal-200",
//           title: "text-teal-700",
//           value: "text-teal-900",
//         },
//         rose: {
//           bg: "bg-rose-50",
//           border: "border-rose-200",
//           title: "text-rose-700",
//           value: "text-rose-900",
//         },
//         amber: {
//           bg: "bg-amber-50",
//           border: "border-amber-200",
//           title: "text-amber-700",
//           value: "text-amber-900",
//         },
//       }[color];

//       return (
//         <div
//           className={`h-full rounded-lg border ${palette.border} ${palette.bg} p-4`}
//         >
//           <p
//             className={`text-[11px] sm:text-xs ${palette.title} font-semibold uppercase tracking-wider`}
//           >
//             {title}
//           </p>
//           <p
//             className={`mt-1 text-base sm:text-lg font-semibold ${palette.value} leading-snug`}
//             title={value}
//           >
//             {value || "—"}
//           </p>
//         </div>
//       );
//     };

//     const RadarChart = ({
//       e,
//       s,
//       g,
//       size = 240,
//     }: {
//       e: number;
//       s: number;
//       g: number;
//       size?: number;
//     }) => {
//       const max = 100;
//       const c = size / 2;
//       const angles = [
//         -Math.PI / 2, // top
//         (2 * Math.PI) / 3 - Math.PI / 2, // left-down
//         (4 * Math.PI) / 3 - Math.PI / 2, // right-down
//       ];
//       const point = (score: number, angle: number) => {
//         const r = (score / max) * (c * 0.82);
//         return [c + r * Math.cos(angle), c + r * Math.sin(angle)];
//       };

//       const pts = [point(e, angles[0]), point(s, angles[1]), point(g, angles[2])]
//         .map(([x, y]) => `${x},${y}`)
//         .join(" ");

//       const ring = (r: number) =>
//         angles.map((a) => point(r, a)).map(([x, y]) => `${x},${y}`).join(" ");

//       const labelPt = (r: number, i: number) => {
//         const [x, y] = point(r, angles[i]);
//         return { x, y };
//       };

//       const labels = ["E", "S", "G"];
//       const labelColors = ["#059669", "#0284c7", "#d97706"];

//       return (
//         <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//           {[25, 50, 75, 100].map((r) => (
//             <polygon
//               key={r}
//               points={ring(r)}
//               fill="none"
//               stroke="#e5e7eb"
//               strokeWidth="1"
//             />
//           ))}
//           {angles.map((a, i) => {
//             const [x, y] = point(100, a);
//             return (
//               <line
//                 key={i}
//                 x1={c}
//                 y1={c}
//                 x2={x}
//                 y2={y}
//                 stroke="#d1d5db"
//                 strokeWidth="1"
//               />
//             );
//           })}
//           <polygon
//             points={pts}
//             fill="rgba(16, 185, 129, 0.35)"
//             stroke="#10b981"
//             strokeWidth="2"
//           />
//           {labels.map((lab, i) => {
//             const { x, y } = labelPt(115, i);
//             return (
//               <text
//                 key={lab}
//                 x={x}
//                 y={y}
//                 textAnchor="middle"
//                 fontSize="12"
//                 fontWeight="700"
//                 fill={labelColors[i]}
//                 dominantBaseline="middle"
//               >
//                 {lab}
//               </text>
//             );
//           })}
//         </svg>
//       );
//     };

//     /* ---------- Main content ---------- */

//     return (
//       <>
//         {/* 1) Hero: Composite score + headline */}
//         <div className="grid items-center gap-6 sm:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-[1fr_minmax(0,1.1fr)] pb-8 mb-8 border-b border-gray-200">
//           {/* Gauge on the left at md+, stacked on mobile */}
//           <div className="flex justify-center md:justify-start">
//             <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
//               <GreenRatingGauge
//                 score={compositeVal}
//                 rating={company.grade || "-"}
//                 fundName="Composite Score"
//               />
//               <p className="mt-2 text-center text-xs text-gray-500">
//                 ESG Composite (0–100)
//               </p>
//             </div>
//           </div>

//           {/* Text block */}
//           <div className="text-center md:text-left">
//             <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
//               Overall ESG Performance
//             </h3>
//             <p className="mt-3 text-base sm:text-lg leading-relaxed text-gray-600 max-w-prose md:max-w-none mx-auto md:mx-0">
//               This company has a composite score of{" "}
//               <span className="font-semibold text-gray-900">
//                 {formatNumber(compositeVal)}
//               </span>
//               , resulting in a{" "}
//               <span className="font-semibold text-gray-900">
//                 {company.grade || "N/A"}
//               </span>{" "}
//               rating.
//             </p>

//             {/* Quick chips for hierarchy */}
//             <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
//               <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
//                 ESG Composite Score
//               </span>
//               <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
//                 ESG Rating: {company.grade || "—"}
//               </span>
//             </div>
//           </div>
//         </div>`   `

//         {/* 2) Pillars: copy + radar */}
//         <div className="grid gap-6 lg:gap-10 md:grid-cols-2 items-center mb-10">
//           <div>
//             <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
//               Pillar Breakdown
//             </h3>
//             <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-prose">
//               The radar chart visualizes performance across the three pillars.
//               A larger area implies stronger performance relative to the 0–100
//               scale.
//             </p>

//             <dl className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
//               <div className="rounded-lg bg-emerald-50 ring-1 ring-emerald-200 p-3 text-center">
//                 <dt className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
//                   Environmental
//                 </dt>
//                 <dd className="mt-1 text-lg font-bold text-emerald-900">
//                   {formatNumber(eVal)}
//                 </dd>
//               </div>
//               <div className="rounded-lg bg-sky-50 ring-1 ring-sky-200 p-3 text-center">
//                 <dt className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
//                   Social
//                 </dt>
//                 <dd className="mt-1 text-lg font-bold text-sky-900">
//                   {formatNumber(sVal)}
//                 </dd>
//               </div>
//               <div className="rounded-lg bg-amber-50 ring-1 ring-amber-200 p-3 text-center">
//                 <dt className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
//                   Governance
//                 </dt>
//                 <dd className="mt-1 text-lg font-bold text-amber-900">
//                   {formatNumber(gVal)}
//                 </dd>
//               </div>
//             </dl>
//           </div>

//           <div className="flex items-center justify-center">
//             <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
//               <RadarChart e={eVal} s={sVal} g={gVal} />
//             </div>
//           </div>
//         </div>

//         {/* 3) Additional insights */}
//         <div>
//           <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
//             Additional Insights
//           </h3>
//           <p className="text-sm text-gray-600 mb-4">
//             High-level screens and controversy flag for quick context.
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <InsightCard
//               title="Positive Screen"
//               value={company.positive || "—"}
//               color="teal"
//             />
//             <InsightCard
//               title="Negative Screen"
//               value={company.negative || "—"}
//               color="rose"
//             />
//             <InsightCard
//               title="Controversy"
//               value={company.controversy || "—"}
//               color="amber"
//             />
//           </div>
//         </div>
//       </>
//     );
//   })()}
// </div>


















// <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
//   {/* Header */}
//   <div className="mb-6 flex items-start justify-between gap-4">
//     <div>
//       <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">Acme Industries</h3>
//       <p className="mt-1 text-sm text-gray-600">
//         Snapshot of composite score, pillar performance, and screens
//       </p>
//     </div>
//     <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 bg-gray-50 text-gray-700 ring-gray-200">
//       Grade: <span className="ml-1 font-bold text-gray-900">A</span>
//     </span>
//   </div>

//   {/* Bento grid */}
//   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//     {/* Donut + composite */}
//     <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
//       <div className="relative">
//         {/* Donut SVG */}
//         <svg width="168" height="168" viewBox="0 0 168 168">
//           <circle cx="84" cy="84" r="70" fill="none" stroke="#e5e7eb" strokeWidth="14" />
//           <circle
//             cx="84"
//             cy="84"
//             r="70"
//             fill="none"
//             stroke="#059669"
//             strokeWidth="14"
//             strokeLinecap="round"
//             strokeDasharray={`${2 * Math.PI * 70 * 0.746} ${2 * Math.PI * 70}`}
//             transform="rotate(-90 84 84)"
//           />
//         </svg>
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <div className="text-3xl font-extrabold text-gray-900 leading-none">74.6</div>
//           <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">Composite</div>
//         </div>
//       </div>
//       <div className="mt-3 flex items-center gap-2">
//         <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 bg-emerald-50 text-emerald-800 ring-emerald-200">
//           Strong
//         </span>
//         <span className="text-xs text-gray-500">0–100 scale</span>
//       </div>
//     </div>

//     {/* Pillars */}
//     <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
//       <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">
//         Pillar Breakdown
//       </h4>
//       <div className="space-y-4">
//         {/* Environmental */}
//         <div>
//           <div className="flex items-baseline justify-between">
//             <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
//               Environmental
//             </span>
//             <span className="text-sm font-bold text-gray-900">77</span>
//           </div>
//           <div className="relative h-2.5 w-full rounded-full bg-gray-100 ring-1 ring-gray-200">
//             <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500" style={{ width: "77%" }} />
//           </div>
//         </div>
//         {/* Social */}
//         <div>
//           <div className="flex items-baseline justify-between">
//             <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">
//               Social
//             </span>
//             <span className="text-sm font-bold text-gray-900">69</span>
//           </div>
//           <div className="relative h-2.5 w-full rounded-full bg-gray-100 ring-1 ring-gray-200">
//             <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-sky-300 to-sky-500" style={{ width: "69%" }} />
//           </div>
//         </div>
//         {/* Governance */}
//         <div>
//           <div className="flex items-baseline justify-between">
//             <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
//               Governance
//             </span>
//             <span className="text-sm font-bold text-gray-900">78</span>
//           </div>
//           <div className="relative h-2.5 w-full rounded-full bg-gray-100 ring-1 ring-gray-200">
//             <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500" style={{ width: "78%" }} />
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Insights + Ladder */}
//     <div className="flex flex-col gap-4">
//       <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
//         <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">
//           Screens & Flags
//         </h4>
//         <div className="flex flex-wrap gap-2">
//           <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 bg-emerald-50 text-emerald-800 ring-emerald-200">
//             Positive: Strong Climate Strategy
//           </span>
//           <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 bg-rose-50 text-rose-800 ring-rose-200">
//             Negative: Supply Chain Risks
//           </span>
//           <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 bg-amber-50 text-amber-900 ring-amber-200">
//             Controversy: Low
//           </span>
//         </div>
//       </div>

//       <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
//         <div className="mb-2 flex items-center justify-between">
//           <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-700">Grade Ladder</h4>
//           <span className="text-xs text-gray-500">Higher ←→ Lower</span>
//         </div>
//         <div className="grid grid-cols-8 gap-1">
//           {["A+","A","B+","B","C+","C","D"].map((g) => (
//             <div
//               key={g}
//               className={`flex h-8 items-center justify-center rounded-md border text-xs font-semibold ${
//                 g === "A"
//                   ? "bg-emerald-600 text-white border-emerald-600"
//                   : "bg-white text-gray-700 border-gray-200"
//               }`}
//             >
//               {g}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>


























