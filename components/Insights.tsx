"use client";
import { useRef } from 'react'; // Import useRef
import InsightCard from "@/components/InsightCard";

// A simple, reusable Arrow Icon for the navigation buttons
const ArrowIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} >
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
)

export default function Insights() {
  const items = [
    { title: "SEBI's New Disclosure Norms" },
    { title: "The Rise of ESG in India" },
    { title: "Proxy Advisory Trends 2025" },
    { title: "Corporate Governance in Nifty 50" },
    { title: "Another Insight Headline" },
  ];

  // Create a ref to hold the scrollable div
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll the container
  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  // Calculate the width of one card plus its gap to scroll correctly
  // Card width is 300px, gap is 24px (gap-6)
  const cardWidth = 300 + 24;

  return (
    <section id="insights" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-brand-dark">Latest News and Insights</h2>
        <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scroll(-cardWidth)}
              className="h-12 w-12 rounded-full border border-gray-300 grid place-items-center text-gray-600 hover:bg-white transition-colors transform rotate-180"
              aria-label="Previous Insight"
            >
                <ArrowIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => scroll(cardWidth)}
              className="h-12 w-12 rounded-full border border-gray-300 grid place-items-center text-gray-600 hover:bg-white transition-colors"
              aria-label="Next Insight"
            >
                <ArrowIcon className="h-6 w-6" />
            </button>
        </div>
      </div>
      
      {/* Scrollable container with the ref */}
      <div ref={scrollContainerRef} className="flex gap-6 pb-4 -mb-4 overflow-x-auto scrollbar-hide">
        {items.map((x) => (
            <div key={x.title} className="flex-shrink-0 w-full sm:w-[300px]">
                <InsightCard title={x.title} />
            </div>
        ))}
      </div>
    </section>
  );
}