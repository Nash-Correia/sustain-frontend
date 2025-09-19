import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

export default function SocialPillarCard() {
  return (
    <InfoSection id="social" title="Social Pillar">
      <p className="lead">
        The Social pillar evaluates workforce well-being, diversity, and stakeholder relationships. This pillar carries a <strong className="text-blue-700">30% weight for manufacturing</strong> companies and a <strong className="text-blue-700">40% weight for services</strong> companies, reflecting the higher human capital intensity in service sectors.
      </p>
      
      <div className="mt-8 space-y-8">
        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">1. Workforce Well-being</h3>
          [cite_start]<p><strong>What it measures:</strong> Employee welfare, safety, and working conditions aligned with National Guidelines on Responsible Business Conduct, Principle 3, and SDG 8 (Decent Work and Economic Growth)[cite: 106].</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            [cite_start]<li><strong>Key Focus Areas:</strong> Adherence to regulations on minimum wages, benefits, and human rights; provision of a safe, hygienic, and harassment-free work environment; and effective grievance redressal mechanisms[cite: 108, 110, 111].</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">2. Workforce Diversity</h3>
          <p><strong>What it measures:</strong> Representation and inclusion across all levels of the organization.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            [cite_start]<li><strong>Aspirational Goals:</strong> IiAS believes companies should aspire to have at least <strong className="text-blue-700">30% representation of women</strong> in their total workforce and among Key Managerial Personnel (KMP)[cite: 113].</li>
            [cite_start]<li><strong>Progressive Indicators:</strong> Evaluation includes gender pay parity, women in senior management, and career advancement opportunities for underrepresented groups[cite: 115].</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">3. Product and Stakeholder Responsibility</h3>
          <p><strong>What it measures:</strong> Consumer safety, product quality, and broader stakeholder impact management.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            [cite_start]<li><strong>Assessment Components:</strong> Systems ensuring goods and services are safe, create mutual value, and mitigate adverse effects on consumers and society are evaluated[cite: 117, 118].</li>
            [cite_start]<li><strong>Performance Indicators:</strong> A lower number of product recalls, data privacy complaints, and unfair trade practice cases lead to a higher score[cite: 119].</li>
          </ul>
        </div>
      </div>
    </InfoSection>
  );
}