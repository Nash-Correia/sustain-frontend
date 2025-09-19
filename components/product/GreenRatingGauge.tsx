import React from 'react';
import { clsx } from '@/lib/utils';

// Helper to calculate SVG arc path
const getArcPath = (startAngle: number, endAngle: number, radius: number, outerRadius: number) => {
  const startRad = startAngle * (Math.PI / 180);
  const endRad = endAngle * (Math.PI / 180);
  const x1 = 100 + radius * Math.cos(startRad);
  const y1 = 100 + radius * Math.sin(startRad);
  const x2 = 100 + radius * Math.cos(endRad);
  const y2 = 100 + radius * Math.sin(endRad);
  const ox1 = 100 + outerRadius * Math.cos(startRad);
  const oy1 = 100 + outerRadius * Math.sin(startRad);
  const ox2 = 100 + outerRadius * Math.cos(endRad);
  const oy2 = 100 + outerRadius * Math.sin(endRad);
  
  const largeArcFlag = endRad - startRad <= Math.PI ? "0" : "1";

  return `M ${x1} ${y1} L ${ox1} ${oy1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${ox2} ${oy2} L ${x2} ${y2} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`;
};


// Data for each segment of the gauge, now with direct hex color values
// matching tailwind.config.ts
const gaugeSegments = [
    { rating: 'A+', color: '#22543d', startAngle: -180, endAngle: -154.3 },
    { rating: 'A', color: '#2f855a', startAngle: -154.3, endAngle: -128.6 },
    { rating: 'B+', color: '#38a169', startAngle: -128.6, endAngle: -102.9 },
    { rating: 'B', color: '#97a35b', startAngle: -102.9, endAngle: -77.2 },
    { rating: 'C+', color: '#d69e2e', startAngle: -77.2, endAngle: -51.5 },
    { rating: 'C', color: '#b7791f', startAngle: -51.5, endAngle: -25.8 },
    { rating: 'D', color: '#97266d', startAngle: -25.8, endAngle: 0 },
];

// Helper to get styling details, now returning hex codes and rotation
const getRatingVisuals = (rating: any) => {
    const ratingStr = String(rating || '').toUpperCase();
    switch (ratingStr) {
        case 'A+': return { color: '#22543d', needleRotation: -80 };
        case 'A': return { color: '#2f855a', needleRotation: -55 };
        case 'B+': return { color: '#38a169', needleRotation: -30 };
        case 'B': return { color: '#97a35b', needleRotation: 0 };
        case 'C+': return { color: '#d69e2e', needleRotation: 30 };
        case 'C': return { color: '#b7791f', needleRotation: 55 };
        case 'D': return { color: '#97266d', needleRotation: 80 };
        default: return { color: '#9ca3af', needleRotation: 0 }; // gray-400
    }
};

interface GreenRatingGaugeProps {
  score: number;
  rating: string;
  fundName: string;
}

export default function GreenRatingGauge({ score, rating, fundName }: GreenRatingGaugeProps) {
  const { color, needleRotation } = getRatingVisuals(rating);
  const showData = score > 0 && rating && rating !== 'X';

  const needleStyle = {
    transform: `rotate(${needleRotation}deg)`,
  };

  return (
    <div className="bg-ui-surface border border-ui-border rounded-large p-6 sm:p-8">
      <div className="relative max-w-sm mx-auto flex flex-col items-center">
        <div className="relative w-full">
          <svg viewBox="0 0 200 110" className="w-full">
            {/* Gauge segments with correct colors */}
            {gaugeSegments.map((segment) => (
              <path key={segment.rating} d={getArcPath(segment.startAngle, segment.endAngle, 65, 95)} fill={segment.color} stroke="#fff" strokeWidth="2" />
            ))}
            {/* Labels on top of segments */}
            {gaugeSegments.map(({ rating, startAngle, endAngle }) => {
              const midAngle = (startAngle + endAngle) / 2 * (Math.PI / 180);
              const x = 100 + 80 * Math.cos(midAngle);
              const y = 100 + 80 * Math.sin(midAngle);
              return <text key={`label-${rating}`} x={x} y={y} dy="0.35em" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{rating}</text>;
            })}
          </svg>

          {/* White semi-circle to cover the bottom */}
          <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-[130px] h-[65px] bg-ui-surface"></div>
          
          {/* Needle, only shown when there is data */}
          {showData && (
            <>
              <div className="absolute bottom-[10px] left-0 right-0 h-1/2 flex justify-center" style={{ transformOrigin: 'bottom center' }}>
                 <div className="w-1 h-[75px] origin-bottom transition-transform duration-700 ease-out" style={needleStyle}>
                  <div className="w-full h-full bg-brand-dark rounded-t-full"></div>
                </div>
              </div>
              <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-5 h-5 bg-brand-dark rounded-full border-4 border-ui-surface"></div>
            </>
          )}

           {/* Center Text displaying the RATING (Letter Grade) */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 text-center">
             <span className="text-5xl font-bold" style={{ color: showData ? color : 'transparent' }}>
               {showData ? rating : ''}
             </span>
           </div>
        </div>

        <p className="text-center text-2xl font-bold text-ui-text-primary mt-4 h-8">
          {showData ? fundName : 'Select a fund to see its rating'}
        </p>
        <p className="text-center text-sm text-ui-text-secondary mt-2 max-w-xs mx-auto">
          Ratings are calculated based on a weighted average, in line with each fund's % allocation of AUM.
        </p>
      </div>
    </div>
  );
}
