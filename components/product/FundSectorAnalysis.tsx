import React from 'react';

// Define the shape of the data this component will receive.
interface AnalysisData {
  bestInSector: { sector: string; company: string }[];
  overallBest: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

// Define the component's props.
interface FundSectorAnalysisProps {
  title: string;
  data: AnalysisData;
}

// A helper component to display a single statistic.
const StatCard = ({ label, value }: { label: string; value: string | number }) => (
    <div className="bg-gray-50 border p-4 rounded-lg text-center">
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</p>
        <p className="text-4xl font-bold text-brand-action mt-1">{value}</p>
    </div>
);

export default function FundSectorAnalysis({ title, data }: FundSectorAnalysisProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-brand-dark mb-6">{title}</h3>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left side: Best performers */}
        <div className="space-y-6">
          {/* Overall Best Performer */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Overall Top Performer</h4>
            <div className="text-xl text-brand-dark p-4 bg-green-50 border border-green-200 rounded-md">
                {data.overallBest}
            </div>
          </div>
          
          {/* Best Performers by Sector (only if data is available) */}
          {data.bestInSector.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Top Performer by Sector</h4>
              <ul className="space-y-2">
                {data.bestInSector.map(item => (
                  <li key={item.sector} className="text-sm p-3 bg-gray-50 border rounded-md">
                    <span className="font-medium text-gray-600">{item.sector}:</span>
                    <span className="ml-2 font-semibold text-gray-900">{item.company}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right side: Score statistics */}
        <div className="space-y-4">
            <StatCard label="Average Score" value={data.averageScore} />
            <div className="grid grid-cols-2 gap-4">
                <StatCard label="Highest Score" value={data.highestScore} />
                <StatCard label="Lowest Score" value={data.lowestScore} />
            </div>
        </div>
      </div>
    </div>
  );
}

