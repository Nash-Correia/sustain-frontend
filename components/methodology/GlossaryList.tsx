export default function GlossaryList() {
  const items = [
    { term: "Materiality", def: "Relevance of a factor to enterprise value and stakeholder impact." },
    { term: "Normalization", def: "Adjusting raw metrics for sectoral or size differences." },
    { term: "Governance tilt", def: "Higher emphasis on governance indicators in the composite score." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-semibold text-teal-900">Glossary</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x) => (
          <div key={x.term} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <dt className="font-semibold text-teal-900">{x.term}</dt>
            <dd className="mt-1 text-sm text-gray-600">{x.def}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
