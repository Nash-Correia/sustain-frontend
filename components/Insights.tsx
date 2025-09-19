"use client";
import { useRef, useState, useEffect } from 'react';
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
    { title: "Digital Transformation in Finance" },
    { title: "Sustainable Investment Strategies" },
    { title: "AI in Financial Analysis" },
  ];

  // Create a ref to hold the scrollable div
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Function to check scroll position and update button states
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Function to scroll the container
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 300; // Card width
      const gap = 24; // Gap between cards (gap-6)
      const scrollDistance = cardWidth + gap;
      
      const scrollOffset = direction === 'left' ? -scrollDistance : scrollDistance;
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
      
      // Update button states after scroll animation
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Check scroll position on mount and when items change
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  return (
    <section id="insights" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-dark">Latest News and Insights</h2>
      </div>
      
      {/* Cards with side navigation */}
      <div className="relative">
        {/* Left navigation button */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full border border-gray-300 bg-white shadow-md grid place-items-center transition-all duration-200 transform rotate-180 ${
            canScrollLeft 
              ? 'text-gray-600 hover:bg-gray-50 hover:border-gray-400 cursor-pointer hover:shadow-lg' 
              : 'text-gray-300 cursor-not-allowed bg-gray-50'
          }`}
          aria-label="Previous Insight"
        >
          <ArrowIcon className="h-6 w-6" />
        </button>

        {/* Right navigation button */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full border border-gray-300 bg-white shadow-md grid place-items-center transition-all duration-200 ${
            canScrollRight 
              ? 'text-gray-600 hover:bg-gray-50 hover:border-gray-400 cursor-pointer hover:shadow-lg' 
              : 'text-gray-300 cursor-not-allowed bg-gray-50'
          }`}
          aria-label="Next Insight"
        >
          <ArrowIcon className="h-6 w-6" />
        </button>

        {/* Scrollable container with the ref */}
        <div 
          ref={scrollContainerRef} 
          className="flex gap-6 pb-4 -mb-4 overflow-x-auto scrollbar-hide scroll-smooth px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex-shrink-0 w-full sm:w-[300px]">
              <InsightCard 
                title={item.title} 
                onReadMore={() => console.log(`Reading more about: ${item.title}`)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile navigation dots (optional) */}
      <div className="flex sm:hidden justify-center gap-2 mt-6">
        {Array.from({ length: Math.ceil(items.length / 2) }, (_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300"
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}