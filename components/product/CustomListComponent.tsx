"use client";
import { useState } from 'react';
import { CompanyDataRow, PortfolioCompany } from '@/lib/excel-data';
import MultiSelect from './MultiSelect'; // We will use the existing MultiSelect component

interface CustomListProps {
  allCompanyData: CompanyDataRow[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioCompany[]>>;
  portfolio: PortfolioCompany[]; // Pass the current portfolio down for management
}

export default function CustomListComponent({ allCompanyData, setPortfolio, portfolio }: CustomListProps) {
  const [selectedIsins, setSelectedIsins] = useState<string[]>([]);
  const [manualIsin, setManualIsin] = useState('');
  const [aum, setAum] = useState('');

  const companyOptions = allCompanyData.map(c => `${c.companyName} (${c.isin})`);

  // Function to add a single company to the portfolio
  const addCompanyToPortfolio = (isin: string, aumValue: number) => {
    const company = allCompanyData.find(c => c.isin === isin);
    // Prevent adding duplicates
    const isAlreadyInPortfolio = portfolio.some(p => p.isin === isin);

    if (company && !isAlreadyInPortfolio && aumValue > 0) {
      const newPortfolioCompany: PortfolioCompany = {
        isin: company.isin,
        companyName: company.companyName,
        aum: aumValue,
        esgScore: company.esgScore,
      };
      setPortfolio(prev => [...prev, newPortfolioCompany]);
    }
  };
  
  // Handler for the main "Add" button
  const handleAdd = () => {
    const aumValue = parseFloat(aum);
    if (isNaN(aumValue)) {
      alert("Please enter a valid AUM percentage.");
      return;
    }

    // Add company from the manual ISIN input if it exists
    if (manualIsin.trim()) {
      addCompanyToPortfolio(manualIsin.trim(), aumValue);
    }

    // Add all selected companies from the multi-select dropdown
    selectedIsins.forEach(selectedOption => {
      // Extract ISIN from the option string "CompanyName (ISIN)"
      const isinMatch = selectedOption.match(/\(([^)]+)\)/);
      if (isinMatch) {
        addCompanyToPortfolio(isinMatch[1], aumValue);
      }
    });

    // Reset fields after adding
    setManualIsin('');
    setSelectedIsins([]);
    setAum('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-brand-dark mb-6">Create custom list of companies</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        
        {/* Multi-Select Dropdown */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Select Fund(s)</label>
          <MultiSelect
            options={companyOptions}
            selected={selectedIsins}
            onChange={setSelectedIsins}
            label="Select one or more funds"
          />
        </div>

        {/* ISIN Input */}
        <div className="w-full">
           <label htmlFor="manual-isin" className="text-sm font-medium">Or Enter ISIN</label>
           <input id="manual-isin" value={manualIsin} onChange={e => setManualIsin(e.target.value)} type="text" placeholder="e.g. INE009A01021" className="w-full h-12 mt-1 rounded-md border border-gray-300 bg-white px-4" />
        </div>

        {/* AUM Input */}
        <div className="w-full md:col-span-2">
          <label htmlFor="aum" className="text-sm font-medium">% AUM (for all new additions)</label>
          <input id="aum" value={aum} onChange={e => setAum(e.target.value)} type="number" placeholder="Enter AUM % for selected companies" className="w-full h-12 mt-1 rounded-md border border-gray-300 bg-white px-4" />
        </div>

        {/* Add Button */}
        <button onClick={handleAdd} className="h-12 w-full md:w-auto rounded-md bg-brand-green-light px-6 text-white font-semibold hover:bg-opacity-90 transition">
          + Add to Comparison
        </button>
      </div>
    </div>
  );
}