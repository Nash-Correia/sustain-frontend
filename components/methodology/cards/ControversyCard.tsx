import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

// Reusable component for the framework section
const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
    </div>
    {children}
  </div>
);

// Reusable component for each controversy type
const ControversyTypeCard = ({ icon, title, items, color }: { icon: React.ReactNode, title: string, items: string[], color: string }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
        <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${color}-100 text-${color}-700 flex items-center justify-center`}>
                {icon}
            </div>
            <h4 className={`font-semibold text-${color}-800`}>{title}</h4>
        </div>
        <ul className="text-sm list-disc list-inside mt-3 text-gray-700 space-y-1">
            {items.map(item => <li key={item}>{item}</li>)}
        </ul>
    </div>
);

// Icons (embedded as SVGs to avoid dependencies)
const FrameworkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const EnvIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const SocialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m17-10a4 4 0 11-8 0 4 4 0 018 0zm-1-9a4 4 0 100 8 4 4 0 000-8z" /></svg>;
const GovIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6" /></svg>;


export default function ControversyCard() {
  return (
    <InfoSection id="controversy" title="Controversy Rating">
      <p className="lead">
        This rating tracks a company's record of ESG-related incidents, violations, and negative events that impact the company, environment, or society. It serves as a key indicator of the robustness of a company's risk management processes.
      </p>

      <div className="mt-8 grid md:grid-cols-1 gap-8">
        <InfoCard icon={<FrameworkIcon />} title="Assessment Framework">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Scoring Scale:</strong> Controversies are scored based on impact severity on a scale of <strong className="text-orange-600">None / Moderate / Serious / Severe</strong>.</li>
            <li><strong>Time Horizon:</strong> We use a three-year look-back period with dynamic, real-time tracking of new incidents.</li>
          </ul>
        </InfoCard>

        <div>
            <h3 className="font-bold text-xl text-brand-dark mb-4">Types of Controversies Tracked</h3>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
                <ControversyTypeCard 
                    icon={<EnvIcon />}
                    title="Environmental"
                    color="green"
                    items={["Pollution incidents", "Regulatory violations", "Waste management failures", "Biodiversity damage"]}
                />
                <ControversyTypeCard 
                    icon={<SocialIcon />}
                    title="Social"
                    color="blue"
                    items={["Human rights violations", "Workplace safety incidents", "Discriminatory practices", "Product safety issues"]}
                />
                <ControversyTypeCard 
                    icon={<GovIcon />}
                    title="Governance"
                    color="yellow"
                    items={["Corruption and bribery", "Financial misstatements", "Shareholder rights violations", "Executive misconduct"]}
                />
            </div>
        </div>
      </div>
    </InfoSection>
  );
}