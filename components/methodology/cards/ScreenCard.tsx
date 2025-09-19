import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

export default function ScreenCard() {
  return (
    <InfoSection id="screen" title="Screens - Risk Assessment Layer">
      <p className="lead">
        Screens provide an additional layer of assessment that evaluates companies beyond their operational ESG performance, considering their adherence to global principles and the nature of their business activities.
      </p>
      
      <div className="mt-6">
        <h3 className="font-bold text-xl text-brand-dark mb-2">Purpose and Importance</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Risk Identification:</strong> Identifying potential ESG risks beyond operational metrics.</li>
          <li><strong>Global Standards Alignment:</strong> Assessing commitment to international principles.</li>
          <li><strong>Business Model Evaluation:</strong> Considering inherent ESG risks in business activities.</li>
          <li><strong>Holistic Assessment:</strong> Providing a complete picture beyond operational performance.</li>
        </ul>
      </div>
    </InfoSection>
  );
}