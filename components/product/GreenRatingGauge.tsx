import React from 'react';

// This data will help us build the gauge segments programmatically
const gaugeSegments = [
  { color: 'bg-rating-d', rotation: 'rotate-[290deg]' },
  { color: 'bg-rating-c', rotation: 'rotate-[263deg]' },
  { color: 'bg-rating-c-plus', rotation: 'rotate-[236deg]' },
  { color: 'bg-rating-b', rotation: 'rotate-[209deg]' },
  { color: 'bg-rating-b-plus', rotation: 'rotate-[182deg]' },
  { color: 'bg-rating-a', rotation: 'rotate-[155deg]' },
  { color: 'bg-rating-a-plus', rotation: 'rotate-[135deg]' },
];

// Helper function to get the rating category from a score
const getRatingFromScore = (score: number) => {
    if (score > 70) return 'A+';
    if (score >= 65) return 'A';
    if (score >= 60) return 'B+';
    if (score >= 55) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    if (score > 0) return 'D';
    return 'X'; // Default for a score of 0 or less
};

// Define the props for the component
interface GreenRatingGaugeProps {
  score: number;
}

export default function GreenRatingGauge({ score }: GreenRatingGaugeProps) {
  const rating = getRatingFromScore(score);

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      <div className="relative max-w-sm mx-auto flex flex-col items-center">
        {/* The Gauge */}
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          {/* Each segment is a clipped, rotated div */}
          {gaugeSegments.map((segment) => (
            <div key={segment.color} className={`absolute inset-0 ${segment.rotation} [clip-path:polygon(50%_0%,100%_0%,100%_100%,50%_100%)]`}>
              <div className={`w-1/2 h-full ${segment.color}`}></div>
            </div>
          ))}
          {/* White overlay to create the arc effect */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-[calc(100%-60px)] h-[calc(200%-60px)] bg-white rounded-full"></div>
          </div>
        </div>

        {/* The Labels */}
        <div className="absolute top-[25%] left-0 right-0 flex justify-between text-sm font-semibold text-gray-500 px-2">
          <span>A+</span>
          <span>B+</span>
          <span>C+</span>
          <span>D</span>
        </div>
        
        {/* The Center Circle - now displays the dynamic rating */}
        <div className="absolute top-1/2 -translate-y-1/2 w-28 h-28 bg-white rounded-full border-4 border-gray-200 flex items-center justify-center shadow-md">
            <span className="text-5xl font-bold text-brand-dark">{rating}</span>
        </div>
      </div>
      <p className="text-center text-2xl font-bold text-brand-dark mt-4">Fund Name</p>
      <p className="text-center text-xs text-gray-500 mt-2 max-w-xs mx-auto">
        Ratings are calculated based on a weighted average, in line with each fund's % allocation of AUM.
      </p>
    </div>
  );
}