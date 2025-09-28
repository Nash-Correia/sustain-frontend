import React from 'react';
import { CompanyDataRow } from '@/lib/excel-data';

// This component displays the details for a single selected company.
// It takes the full company data object as a prop.
interface CompanyInfoCardProps {
  company: CompanyDataRow;
}

// A small helper component for displaying a single score item.
const ScoreItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-center p-4 bg-gray-50 rounded-lg border">
    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</p>
    <p className="text-3xl font-bold text-brand-dark mt-1">{value}</p>
  </div>
);

export default function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-brand-dark mb-2">{company.companyName}</h3>
      <p className="text-md text-gray-600 mb-6">Sector: {company.sector}</p>
      
      {/* Grid to display all the individual scores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ScoreItem label="E-Score" value={company.e_score} />
        <ScoreItem label="S-Score" value={company.s_score} />
        <ScoreItem label="G-Score" value={company.g_score} />
        <ScoreItem label="Positive" value={company.positive} />
        <ScoreItem label="Negative" value={company.negative} />
        <ScoreItem label="Controversy" value={company.controversy} />
      </div>
    </div>
  );
}

