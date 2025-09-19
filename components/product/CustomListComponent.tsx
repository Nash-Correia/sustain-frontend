"use client";
import { useState, useMemo } from 'react';
import { CompanyDataRow, PortfolioCompany } from '@/lib/excel-data';
import SearchableSelect from '../ui/SearchableSelect';  // Import our new component

interface CustomListProps {
  allCompanyData: CompanyDataRow[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioCompany[]>>;
  portfolio: PortfolioCompany[];
}

export default function CustomListComponent({ allCompanyData, setPortfolio, portfolio }: CustomListProps) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyDataRow | null>(null);
  const [aum, setAum] = useState('');

  // Memoize company names for the dropdown to prevent re-rendering
  const companyOptions = useMemo(() => allCompanyData.map(c => c.companyName), [allCompanyData]);

  const handleSelectCompany = (companyName: string) => {
    const company = allCompanyData.find(c => c.companyName === companyName) || null;
    setSelectedCompany(company);
  };

  const handleAdd = () => {
    const aumValue = parseFloat(aum);
    if (!selectedCompany) {
      alert("Please select a company.");
      return;
    }
    if (isNaN(aumValue) || aumValue <= 0) {
      alert("Please enter a valid AUM percentage.");
      return;
    }
    const isAlreadyInPortfolio = portfolio.some(p => p.isin === selectedCompany.isin);
    if (isAlreadyInPortfolio) {
      alert(`${selectedCompany.companyName} is already in the portfolio.`);
      return;
    }

    const newPortfolioCompany: PortfolioCompany = {
      isin: selectedCompany.isin,
      companyName: selectedCompany.companyName,
      aum: aumValue,
      esgScore: selectedCompany.esgScore,
    };
    
    setPortfolio(prev => [...prev, newPortfolioCompany]);

    // Reset fields
    setSelectedCompany(null);
    setAum('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-brand-dark mb-6">Create custom list of companies</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        {/* Searchable Company Select */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Select Company</label>
          <SearchableSelect
            options={companyOptions}
            selected={selectedCompany?.companyName || ''}
            onChange={handleSelectCompany}
            placeholder="Search and select a company"
          />
        </div>

        {/* Auto-filled ISIN Input */}
        <div className="w-full">
           <label htmlFor="isin-display" className="text-sm font-medium">ISIN</label>
           <input 
             id="isin-display" 
             value={selectedCompany?.isin || ''} 
             type="text" 
             readOnly 
             placeholder="ISIN appears here"
             className="w-full h-12 mt-1 rounded-md border border-gray-300 bg-gray-100 px-4 text-gray-500" 
           />
        </div>

        {/* AUM Input */}
        <div className="w-full">
          <label htmlFor="aum" className="text-sm font-medium">% AUM</label>
          <input id="aum" value={aum} onChange={e => setAum(e.target.value)} type="number" placeholder="e.g. 5.5" className="w-full h-12 mt-1 rounded-md border border-gray-300 bg-white px-4" />
        </div>

        {/* Add Button */}
        <div className="md:col-span-4 flex justify-end">
          <button onClick={handleAdd} className="h-12 w-full sm:w-auto rounded-md bg-login-btn px-6 text-white font-semibold hover:bg-opacity-90 transition">
            + Add to Comparison
          </button>
        </div>
      </div>
    </div>
  );
}