export default function ProcessSteps() {
  const steps = [
    { t: "Universe & Sources", d: "Coverage definition; disclosures; filings; verified third‑party data." },
    { t: "Normalization", d: "Sector context; market‑specific thresholds; materiality mapping." },
    { t: "Scoring", d: "Indicator scoring with pillar weights; governance tilt where relevant." },
    { t: "Quality review", d: "Dual‑control checks; exception handling; change logs." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-semibold text-teal-900">How We Rate</h2>
      <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, idx) => (
          <li key={s.t} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-xs text-gray-500">Step {idx + 1}</div>
            <div className="mt-1 text-teal-900 font-semibold">{s.t}</div>
            <div className="mt-1 text-sm text-gray-600">{s.d}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
