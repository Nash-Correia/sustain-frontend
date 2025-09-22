import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

// Reusable component for each section to maintain consistency
const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
    </div>
    {children}
  </div>
);

// Icons (embedded as SVGs to avoid dependencies)
const FrameworkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const ComponentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const BenefitsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export default function PositiveScreenCard() {
  return (
    <InfoSection id="positive" title="Positive Screen">
      <p className="lead">
        This screen measures a company's commitment to global principles and standards that demonstrate ESG leadership. It helps identify companies that are proactive in their ESG journey.
      </p>
      
      <div className="mt-8 grid md:grid-cols-1 gap-8">
        <InfoCard icon={<FrameworkIcon />} title="Assessment Framework">
          <p>Companies are scored on a scale of <strong className="text-green-700">0/Low/Medium/High</strong> based on their level of commitment and implementation of global best practices.</p>
        </InfoCard>

        <InfoCard icon={<ComponentsIcon />} title="Key Components Evaluated">
          <p>We assess a company's formal commitment to and reporting on key global principles and initiatives, including:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>UN Global Compact:</strong> Commitment to human rights, labor, environment, and anti-corruption principles.</li>
            <li><strong>Science-Based Targets (SBTi):</strong> Climate targets that are in line with climate science.</li>
            <li><strong>RE100:</strong> Commitment to 100% renewable electricity.</li>
            <li><strong>Task Force on Climate-related Financial Disclosures (TCFD):</strong> Framework for disclosing climate-related risks.</li>
          </ul>
        </InfoCard>

        <InfoCard icon={<BenefitsIcon />} title="Benefits for Companies">
            <p>Adhering to these principles enhances credibility, increases stakeholder confidence, improves risk management, and can provide better access to markets and ESG-conscious investors.</p>
        </InfoCard>
      </div>
    </InfoSection>
  );
}