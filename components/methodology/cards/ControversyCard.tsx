import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

export default function ControversyCard() {
  return (
    <InfoSection id="controversy" title="Controversy Rating">
      <p className="lead">
        This rating tracks a company's record of ESG-related incidents, violations, and negative events that impact the company, environment, or society. It serves as a key indicator of the robustness of a company's risk management processes.
      </p>
      
      <div className="mt-6 space-y-6">
        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2">Assessment Framework</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Scoring Scale:</strong> Controversies are scored based on impact severity on a scale of <strong className="text-orange-600">None / Moderate / Serious / Severe</strong>.</li>
            <li><strong>Time Horizon:</strong> We use a three-year look-back period with dynamic, real-time tracking of new incidents.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2">Types of Controversies Tracked</h3>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800">Environmental</h4>
              <ul className="text-sm list-disc list-inside mt-2 text-gray-700">
                <li>Pollution incidents</li>
                <li>Regulatory violations</li>
                <li>Waste management failures</li>
                <li>Biodiversity damage</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800">Social</h4>
              <ul className="text-sm list-disc list-inside mt-2 text-gray-700">
                <li>Human rights violations</li>
                <li>Workplace safety incidents</li>
                <li>Discriminatory practices</li>
                <li>Product safety issues</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800">Governance</h4>
              <ul className="text-sm list-disc list-inside mt-2 text-gray-700">
                <li>Corruption and bribery</li>
                <li>Financial misstatements</li>
                <li>Shareholder rights violations</li>
                <li>Executive misconduct</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </InfoSection>
  );
}