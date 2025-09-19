import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

export default function EnvironmentalPillarCard() {
  return (
    <InfoSection id="environmental" title="Environmental Pillar">
      <p className="lead">
        The Environmental pillar evaluates how companies manage their impact on natural resources, climate change, and environmental sustainability. This pillar carries a <strong className="text-green-700">30% weight for manufacturing</strong> companies and <strong className="text-green-700">20% for services</strong> companies.
      </p>
      
      <div className="mt-8 space-y-8">
        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">1. Emissions and Carbon Footprint</h3>
          <p><strong>What it measures:</strong> Annual greenhouse gas (GHG) emissions across all scopes and decarbonization strategies.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Evaluation Criteria:</strong> Declining emission trends, emission intensity metrics (MTCO2 equivalent/INR turnover), and the presence of a clear decarbonization strategy are key indicators of performance.</li>
          </ul>
          <img src="/image_7b9dcb.png" alt="Scope 1, 2, and 3 Emissions Diagram" className="my-4 rounded-lg shadow-md" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">2. Energy, Resource Management and Circularity</h3>
          <p><strong>What it measures:</strong> Energy consumption patterns, water usage efficiency, and waste management practices.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Energy:</strong> Assesses total energy consumption, energy intensity, and the percentage of renewable energy in the mix. Special recognition is given to <strong className="text-green-700">RE100 signatories</strong>.</li>
            <li><strong>Water:</strong> Evaluates water withdrawal/consumption trends and water intensity. Aspirational goals like "Water Positive" are noted.</li>
            <li><strong>Circularity:</strong> Tracks total waste generation and intensity. Commitments to <strong className="text-green-700">Zero Liquid Discharge</strong> and <strong className="text-green-700">Zero Waste to Landfill</strong> are considered best practices.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">3. Sustainable Sourcing and Business Resilience</h3>
          <p><strong>What it measures:</strong> The extension of sustainable practices to the value chain and business continuity planning.</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Sourcing:</strong> Focuses on sustainable input sourcing, local sourcing initiatives, and engagement with small and medium enterprises.</li>
            <li><strong>Resilience:</strong> Assesses the presence of certified Business Continuity Management Systems.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-dark border-b pb-2 mb-4">4. Technologies for Social Impact</h3>
          <p><strong>What it measures:</strong> Investment in technologies that improve environmental and social impacts.</p>
           <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Key Indicators:</strong> R&D costs, capital expenditure in decarbonization projects, and investments supporting emission reduction.</li>
          </ul>
        </div>
      </div>
    </InfoSection>
  );
}