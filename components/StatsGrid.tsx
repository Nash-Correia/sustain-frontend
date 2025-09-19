export default function StatsGrid() {
  const stats = [
    { value: "500", label: "Companies Covered" },
    { value: "14 +", label: "Years of Excellence" },
    { value: "SEBI", label: "Registered ERP" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <dt className="text-4xl font-bold text-brand-dark">{item.value}</dt>
            <dd className="mt-2 text-base text-gray-600">{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}