interface InsightCardProps {
  title: string;
}

export default function InsightCard({ title }: InsightCardProps) {
  return (
    <article className="overflow-hidden rounded-large border border-gray-200 bg-white shadow-sm h-full">
      {/* Placeholder for an image */}
      <div className="aspect-video bg-gray-200" />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-brand-dark">{title}</h3>
      </div>
    </article>
  );
}