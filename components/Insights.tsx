"use client";
import { useRef, useState, useEffect } from 'react';

// Mock InsightCard component for demo - matches your actual component structure
interface InsightCardProps {
  title: string;
  imageUrl?: string;
  onReadMore?: () => void;
}

const InsightCard = ({ 
  title, 
  imageUrl, 
  onReadMore 
}: InsightCardProps) => {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col">
      {/* Image section */}
      <div className="aspect-video bg-gray-200">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No image available</span>
          </div>
        )} 
      </div>
      
      {/* Content section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-brand-dark mb-4">{title}</h3>
        
        {/* Read More button */}
        <div className="text-left">
          <button
            className="text-[14px] font-medium text-[#1D7AEA] hover:underline"
            onClick={onReadMore}
          >
            Read More
          </button>
        </div>
      </div>
    </article>
  );
};

// A simple, reusable Arrow Icon for the navigation buttons
const ArrowIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create duplicated items for infinite scroll effect
  const duplicatedItems = [...items, ...items, ...items];

  // Auto-scroll function
  const autoScroll = () => {
    if (scrollContainerRef.current && isAutoScrolling) {
      const container = scrollContainerRef.current;
      const cardWidth = 300;
      const gap = 24;
      const scrollDistance = cardWidth + gap;
      
      // Scroll to the right
      container.scrollBy({ left: scrollDistance, behavior: 'smooth' });
      
      // Check if we need to reset position for infinite loop
      setTimeout(() => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const itemsWidth = (cardWidth + gap) * items.length;
        
        // If we've scrolled past the first set of duplicated items
        if (scrollLeft >= itemsWidth) {
          // Reset to the beginning without animation
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = 0;
          setTimeout(() => {
            container.style.scrollBehavior = 'smooth';
          }, 50);
        }
      }, 300);
    }
  };

  // Start auto-scroll
  const startAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
    autoScrollIntervalRef.current = setInterval(autoScroll, 3000); // Scroll every 3 seconds
  };

  // Stop auto-scroll
  const stopAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  // Manual scroll function
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 300;
      const gap = 24;
      const scrollDistance = cardWidth + gap;
      
      const scrollOffset = direction === 'left' ? -scrollDistance : scrollDistance;
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
      
      // Handle infinite loop for manual scrolling
      setTimeout(() => {
        const container = scrollContainerRef.current;
        if (container) {
          const { scrollLeft, scrollWidth, clientWidth } = container;
          const itemsWidth = (cardWidth + gap) * items.length;
          
          if (direction === 'right' && scrollLeft >= itemsWidth) {
            container.style.scrollBehavior = 'auto';
            container.scrollLeft = 0;
            setTimeout(() => {
              container.style.scrollBehavior = 'smooth';
            }, 50);
          } else if (direction === 'left' && scrollLeft <= 0) {
            container.style.scrollBehavior = 'auto';
            container.scrollLeft = itemsWidth;
            setTimeout(() => {
              container.style.scrollBehavior = 'smooth';
            }, 50);
          }
        }
      }, 300);
    }
  };

  // Toggle auto-scroll
  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  // Initialize auto-scroll and cleanup
  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => stopAutoScroll();
  }, [isAutoScrolling]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    if (isAutoScrolling) {
      startAutoScroll();
    }
  };

  return (
    <section id="insights" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Title and Controls */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-dark">Latest News and Insights</h2>

      </div>
      
      {/* Cards with side navigation */}
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left navigation button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full border border-gray-300 bg-white shadow-md grid place-items-center transition-all duration-200 transform rotate-180 text-gray-600 hover:bg-gray-50 hover:border-gray-400 cursor-pointer hover:shadow-lg"
          aria-label="Previous Insight"
        >
          <ArrowIcon className="h-6 w-6" />
        </button>

        {/* Right navigation button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full border border-gray-300 bg-white shadow-md grid place-items-center transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:border-gray-400 cursor-pointer hover:shadow-lg"
          aria-label="Next Insight"
        >
          <ArrowIcon className="h-6 w-6" />
        </button>

        {/* Scrollable container with infinite items */}
        <div 
          ref={scrollContainerRef} 
          className="flex gap-6 pb-4 -mb-4 overflow-x-auto scrollbar-hide scroll-smooth px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex-shrink-0 w-full sm:w-[300px]">
              <InsightCard 
                title={item.title} 
                onReadMore={() => console.log(`Reading more about: ${item.title}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}