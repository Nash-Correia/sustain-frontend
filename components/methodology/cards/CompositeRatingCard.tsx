import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

// Reusable component for each section to maintain consistency
const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
    </div>
    {children}
  </div>
);

// Icons (embedded as SVGs to avoid dependencies)
const MethodologyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;

export default function CompositeRatingCard() {
  return (
    <InfoSection id="compositeRating" title="Composite Rating">
      <p className="lead">
        <strong>What it measures:</strong> The final comprehensive ESG assessment combining all pillars, screens, and controversies into a single rating.
      </p>
      
      <div className="mt-8 grid md:grid-cols-1 gap-8">
        <InfoCard icon={<MethodologyIcon />} title="Rating Methodology">
          <ol className="list-decimal list-outside space-y-6 ml-5">
            <li>
              <strong className="text-lg block mb-2">Pillar Score Calculation</strong>
              <p className="text-gray-600">
                Each pillar (Environmental, Social, and Governance) receives an individual score based on comprehensive evaluation criteria. 
                Weightings vary by sector - manufacturing companies have higher environmental weights, while service companies emphasize social factors. 
                These sector-specific adjustments ensure relevant aspects receive appropriate focus.
              </p>
            </li>
            
            <li>
              <strong className="text-lg block mb-2">Screen Integration</strong>
              <p className="text-gray-600">
                The base score is then modified through two screening processes:
              </p>
              <ul className="list-disc ml-6 my-2 space-y-2 text-gray-600">
                <li>Positive Screen rewards commitments to global sustainability initiatives and standards</li>
                <li>Negative Screen applies penalties for involvement in controversial or highly-polluting sectors</li>
              </ul>
              <p className="text-gray-600">
                This dual screening ensures both positive contributions and potential concerns are factored in.
              </p>
            </li>
            
            <li>
              <strong className="text-lg block mb-2">Controversy Overlay</strong>
              <p className="text-gray-600">
                Recent controversies or incidents are evaluated based on their severity, scale, and company response.
                Significant controversies can override other positive performance indicators, reflecting the importance
                of ongoing responsible business conduct and effective risk management.
              </p>
            </li>
            
            <li>
              <strong className="text-lg block mb-2">Final Rating Assignment</strong>
              <p className="text-gray-600">
                The composite score, incorporating all above elements, is mapped to calculate the score for 
                the companies using weighting according to IiAS clasification as services or manufacturing.
              </p>
            </li>

            <li>
              <strong className="text-lg block mb-2">Grading Structure</strong>
              <p className="text-gray-600">
                The composite score, incorporating all above elements, is mapped to our A+ to D rating scale.
                This final grade reflects overall ESG performance, with A+ representing exceptional leadership
                and D indicating significant room for improvement in ESG practices.
              </p>
            </li>
          </ol>
        </InfoCard>
      </div>
    </InfoSection>
  );
}