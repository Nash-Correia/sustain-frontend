export function PillarCard({ title, desc, items }: { title: string; desc: string; items?: string[] }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-teal-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
      {items && (
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
          {items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

