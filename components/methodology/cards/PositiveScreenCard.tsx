import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

export default function PositiveScreenCard() {
  return (
    <InfoSection id="positive" title="Positive Screen">
      <p className="lead">
        This screen measures a company's commitment to global principles and standards that demonstrate ESG leadership. It helps identify companies that are proactive in their ESG journey.
      </p>
      
      <div className="mt-6 space-y-6">
        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2">Assessment Framework</h3>
          <p>Companies are scored on a scale of <strong className="text-green-700">0/Low/Medium/High</strong> based on their level of commitment and implementation of global best practices.</p>
        </div>

        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2">Key Components Evaluated</h3>
          <p>We assess a company's formal commitment to and reporting on key global principles and initiatives, including:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>UN Global Compact:</strong> Commitment to human rights, labor, environment, and anti-corruption principles.</li>
            <li><strong>Science-Based Targets (SBTi):</strong> Climate targets that are in line with climate science.</li>
            <li><strong>RE100:</strong> Commitment to 100% renewable electricity.</li>
            <li><strong>Task Force on Climate-related Financial Disclosures (TCFD):</strong> Framework for disclosing climate-related risks.</li>
          </ul>
        </div>
        <div>
            <h3 className="font-bold text-xl text-brand-dark mb-2">Benefits for Companies</h3>
            <p>Adhering to these principles enhances credibility, increases stakeholder confidence, improves risk management, and can provide better access to markets and ESG-conscious investors.</p>
        </div>
      </div>
    </InfoSection>
  );
}