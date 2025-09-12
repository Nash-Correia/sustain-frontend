export default function FAQ() {
  const qa = [
    { q: "How often are ratings updated?", a: "Typically annually with interim updates for material events." },
    { q: "Do sectors have different weights?", a: "Yes, sector context influences normalization and thresholds." },
    { q: "Is methodology downloadable?", a: "A summary PDF is available below; a full guide can be shared on request." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-semibold text-teal-900">FAQs</h2>
      <div className="mt-4 space-y-3">
        {qa.map((x) => (
          <details key={x.q} className="rounded-2xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer text-teal-900 font-semibold">{x.q}</summary>
            <p className="mt-2 text-sm text-gray-600">{x.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

