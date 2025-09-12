import InsightCard from "@/components/InsightCard";

export default function Insights() {
  const items = [
    { title: "Insight headline goes here 1" },
    { title: "Insight headline goes here 2" },
    { title: "Insight headline goes here 3" },
  ];
  return (
    <section id="insights" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold text-teal-900">Latest Insights</h2>
        <a href="#" className="text-sm text-teal-800 hover:underline">View all</a>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x) => (<InsightCard key={x.title} title={x.title} />))}
      </div>
    </section>
  );
}

