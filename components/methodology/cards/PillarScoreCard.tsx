import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

export default function PillarScoreCard() {
  return (
    <InfoSection id="pillarScore" title="ESG Pillars - Foundation of Assessment">
      <p className="lead">
        The IiAS ESG scorecard evaluates over 270 critical parameters per company, structured across three core pillars that form the foundation of sustainable business practices.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2">Key Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Comprehensive Coverage:</strong> 270+ parameters assessed per company.</li>
            <li><strong>Sector-Weighted Scoring:</strong> Performance evaluated within industry context.</li>
            <li><strong>BRSR Core Integration:</strong> Emphasizes disclosed BRSR Core parameters focusing on 9 ESG attributes.</li>
            <li><strong>Transition Focus:</strong> Special emphasis on "Parivartan/Transition" parameters measuring progress.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2">Scoring Methodology</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Rating Scale:</strong> 0/1/2 reflecting quality of disclosures and adherence to global best practices.</li>
            <li><strong>Binary Questions:</strong> Yes/No responses (2 points for positive, 0 for negative).</li>
            <li><strong>"Not Applicable" Options:</strong> Available for manufacturing/services categories.</li>
            <li><strong>No Information:</strong> Zero points awarded when information isn't publicly observable.</li>
          </ul>
        </div>
      </div>

      <h3 className="font-bold text-xl text-brand-dark mt-8 mb-2">Sector Weights Distribution</h3>
      <p>
        The differential weighting recognizes that manufacturing companies typically have higher environmental impact, while services companies have greater social interaction.
      </p>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Social</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Governance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 font-semibold">Manufacturing</td>
              <td className="px-6 py-4">30%</td>
              <td className="px-6 py-4">30%</td>
              <td className="px-6 py-4">40%</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold">Services</td>
              <td className="px-6 py-4">20%</td>
              <td className="px-6 py-4">40%</td>
              <td className="px-6 py-4">40%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </InfoSection>
  );
}