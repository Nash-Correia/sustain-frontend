export default function StatsGrid() {
  const stats = [
    { k: ">500", v: "Companies covered" },
    { k: "35+", v: "Sectors mapped" },
    { k: "15Y", v: "Advisory track record" },
    { k: "AA", v: "Methodology aligned" },
  ];
  return (
    <section className="bg-gray-50 border-y border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div key={item.v} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
              <dt className="text-2xl font-semibold text-teal-900">{item.k}</dt>
              <dd className="mt-1 text-sm text-gray-600">{item.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

