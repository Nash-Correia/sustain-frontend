export default function WeightingTable({ rows }: { rows: Array<{ pillar: string; weight: string; notes?: string }> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-semibold text-teal-900">Pillars & Weights</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-2xl overflow-hidden">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3 border-b border-gray-200">Pillar</th>
              <th className="p-3 border-b border-gray-200">Weight</th>
              <th className="p-3 border-b border-gray-200">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pillar} className="odd:bg-white even:bg-gray-50">
                <td className="p-3 border-b border-gray-100 font-medium text-gray-800">{r.pillar}</td>
                <td className="p-3 border-b border-gray-100 text-gray-700">{r.weight}</td>
                <td className="p-3 border-b border-gray-100 text-gray-700">{r.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

