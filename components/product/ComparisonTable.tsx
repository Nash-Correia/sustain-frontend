export default function ComparisonTable({ rows }: { rows: Array<{ feature: string; a?: string; b?: string }> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-semibold text-teal-900">Compare Products</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-2xl overflow-hidden">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3 border-b border-gray-200">Feature</th>
              <th className="p-3 border-b border-gray-200">Product A</th>
              <th className="p-3 border-b border-gray-200">Product B</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.feature} className="odd:bg-white even:bg-gray-50">
                <td className="p-3 border-b border-gray-100 font-medium text-gray-800">{r.feature}</td>
                <td className="p-3 border-b border-gray-100 text-gray-700">{r.a || "—"}</td>
                <td className="p-3 border-b border-gray-100 text-gray-700">{r.b || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

