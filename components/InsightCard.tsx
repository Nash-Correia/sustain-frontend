interface InsightCardProps {
  title: string;
  tag?: string;
  abstract?: string;
  href?: string;
}

export default function InsightCard({ title, tag = "ESG • Research", abstract = "Short abstract about the report or brief.", href = "#" }: InsightCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="p-5">
        <div className="text-xs uppercase tracking-wide text-teal-700">{tag}</div>
        <h3 className="mt-1 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{abstract}</p>
        <a href={href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-800 hover:underline">
          Read more
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </div>
    </article>
  );
}

