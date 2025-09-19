import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

export default function GovernancePillarCard() {
  return (
    <InfoSection id="governance" title="Governance Pillar">
      <p className="lead">
        The Governance pillar evaluates corporate governance practices and stakeholder rights protection. This pillar carries a strong <strong className="text-yellow-600">40% weight for both manufacturing and services companies</strong>, reflecting its fundamental importance across all business types.
      </p>
      
      <div className="mt-8 space-y-8">
        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">1. Policies</h3>
          <p><strong>What it measures:</strong> The foundation of corporate governance through comprehensive policy frameworks.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Key Elements:</strong> Includes frameworks for accountability, transparency standards, ethical conduct guidelines, and stakeholder alignment to support responsible and effective corporate management.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">2. Responsibilities of the Board</h3>
          <p><strong>What it measures:</strong> Board independence, effectiveness, and shareholder alignment.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Independence Assessment:</strong> Companies with independent Chairs and board independence levels exceeding regulatory requirements score higher.</li>
            <li><strong>Shareholder Relations:</strong> A high amount of pushback on board resolutions from institutional shareholders can indicate dissatisfaction with company practices.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">3. Disclosures and Transparency</h3>
          <p><strong>What it measures:</strong> Transparency levels and adherence to ethical practices.</p>
           <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Core Components:</strong> A higher level of disclosure promotes shareholder trust. The company must publish an ethics policy and clearly articulate its stance on corruption and bribery.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">4. Board Diversity</h3>
          <p><strong>What it measures:</strong> Board composition diversity for enhanced decision-making and avoiding "group-think".</p>
           <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Aspirational Targets:</strong> For the full effect of gender diversity, it is believed that women must comprise at least <strong className="text-yellow-600">30% of the board</strong>.</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">5. Stakeholder Management</h3>
          <p><strong>What it measures:</strong> Relationship management across all stakeholder groups, including employees, shareholders, suppliers, and regulators.</p>
           <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Assessment Areas:</strong> This is especially critical in related-party transactions, where transparency and strong governance can address potential conflicts of interest.</li>
          </ul>
        </div>
      </div>
    </InfoSection>
  );
}