export default function ScorecardOverview() {
  const items = [
    { k: "Disclosure", v: "Public reporting and clarity" },
    { k: "Practice", v: "Policies → implementation" },
    { k: "Performance", v: "Outcome evidence where available" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-semibold text-teal-900">Scorecard Dimensions</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.k} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-teal-900 font-semibold">{it.k}</div>
            <div className="mt-1 text-sm text-gray-600">{it.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

