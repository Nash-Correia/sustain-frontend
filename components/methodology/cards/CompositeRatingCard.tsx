import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

const ratingScaleData = [
  { rating: 'A+', description: 'Leadership', characteristics: 'Exceptional ESG performance, industry benchmark' },
  { rating: 'A', description: 'Advanced', characteristics: 'Strong ESG performance across all dimensions' },
  { rating: 'B+', description: 'Good', characteristics: 'Above-average performance with some areas for improvement' },
  { rating: 'B', description: 'Adequate', characteristics: 'Satisfactory performance meeting basic standards' },
  { rating: 'C+', description: 'Developing', characteristics: 'Below-average performance with significant improvement needed' },
  { rating: 'C', description: 'Weak', characteristics: 'Poor performance requiring substantial ESG enhancement' },
  { rating: 'D', description: 'Nascent', characteristics: 'Minimal ESG practices, significant risk exposure' },
];

export default function CompositeRatingCard() {
  return (
    <InfoSection id="compositeRating" title="Composite Rating">
      <p className="lead">
        What it measures: The final comprehensive ESG assessment combining all pillars, screens, and controversies into a single rating.
      </p>
      
      <div className="mt-6 space-y-6">
        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2">Rating Methodology</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Pillar Score Calculation:</strong> Individual scores are calculated for Environmental, Social, and Governance pillars with sector-specific weightings applied.</li>
            <li><strong>Screen Integration:</strong> The score is adjusted based on a Positive Screen (for adherence to global principles) and a Negative Screen (for involvement in harmful business activities).</li>
            <li><strong>Controversy Overlay:</strong> A controversy rating is applied as a final overlay, adjusted based on the severity of any recent incidents.</li>
            <li><strong>Final Rating Assignment:</strong> The resulting score is used to assign a letter grade, reflecting the company's performance relative to its industry peers.</li>
          </ol>
        </div>

        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2 mt-8">Rating Scale</h3>
           <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Characteristics</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ratingScaleData.map(item => (
                  <tr key={item.rating}>
                    <td className="px-6 py-4 font-bold text-lg">{item.rating}</td>
                    <td className="px-6 py-4 font-semibold">{item.description}</td>
                    <td className="px-6 py-4">{item.characteristics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </InfoSection>
  );
}