"use client";

import { useState, useEffect, useMemo } from 'react';
import { getCompanyData, getFundData, CompanyDataRow, FundDataRow, PortfolioCompany } from '@/lib/excel-data';
import TabbedSearch from '@/components/product/TabbedSearch';
import FundsComparisonTable from '@/components/product/FundsComparisonTable';
import FundDetails from '@/components/product/FundDetails';
import SectorDetails from '@/components/product/SectorDetails';
import CompanyDetails from '@/components/product/CompanyDetails';
import AnalysisCard from '@/components/product/AnalysisCard';

type SelectedItem = {
  name: string;
  type: 'Funds' | 'Sectors' | 'Companies';
} | null;

export default function ProductAPage() {
  const [allCompanyData, setAllCompanyData] = useState<CompanyDataRow[]>([]);
  const [allFundData, setAllFundData] = useState<FundDataRow[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [portfolio, setPortfolio] = useState<PortfolioCompany[]>([]);

  useEffect(() => {
    async function loadData() {
      const companyData = await getCompanyData();
      const fundData = await getFundData();
      setAllCompanyData(companyData);
      setAllFundData(fundData);
    }
    loadData();
  }, []);

  const { companyOptions, fundOptions, sectorOptions } = useMemo(() => {
    const companies = allCompanyData.map(c => c.companyName).filter(Boolean);
    const funds = allFundData.map(f => f.fundName).filter(Boolean);
    const sectors = [...new Set(allCompanyData.map(c => c.sector).filter(Boolean))];
    return { companyOptions: companies, fundOptions: funds, sectorOptions: sectors };
  }, [allCompanyData, allFundData]);

  const gaugeData = useMemo(() => {
    if (!selectedItem) {
      return { score: 0, rating: 'X', name: 'Select an item' };
    }
    if (selectedItem.type === 'Funds') {
      const fund = allFundData.find(f => f.fundName === selectedItem.name);
      return {
        score: fund?.score ?? 0,
        rating: fund?.grade ?? 'X',
        name: fund?.fundName ?? ''
      };
    }
    if (selectedItem.type === 'Companies') {
      const company = allCompanyData.find(c => c.companyName === selectedItem.name);
      return {
        score: company?.esgScore ?? 0,
        rating: company?.grade ?? 'X',
        name: company?.companyName ?? ''
      };
    }
    if (selectedItem.type === 'Sectors') {
      const companiesInSector = allCompanyData.filter(c => c.sector === selectedItem.name);
      if (companiesInSector.length === 0) {
        return { score: 0, rating: 'N/A', name: `${selectedItem.name} (Sector)` };
      }
      const totalScore = companiesInSector.reduce((acc, c) => acc + (c.esgScore || 0), 0);
      const avgScore = Math.round(totalScore / companiesInSector.length);

      let sectorGrade = 'D';
      if (avgScore > 75) sectorGrade = 'A+';
      else if (avgScore >= 70) sectorGrade = 'A';
      else if (avgScore >= 65) sectorGrade = 'B+';
      else if (avgScore >= 60) sectorGrade = 'B';
      else if (avgScore >= 55) sectorGrade = 'C+';
      else if (avgScore >= 50) sectorGrade = 'C';

      return {
        score: avgScore,
        rating: sectorGrade,
        name: `${selectedItem.name} (Sector Average)`
      };
    }
    return { score: 0, rating: 'X', name: 'Select an item' };
  }, [selectedItem, allFundData, allCompanyData]);

  const handleSelection = (value: string, type: 'Funds' | 'Companies' | 'Sectors') => {
    setSelectedItem({ name: value, type });
  };

  const handleAddToPortfolio = (company: CompanyDataRow) => {
    const portfolioItem: PortfolioCompany = {
      companyName: company.companyName,
      isin: company.isin,
      aum: 0,
      esgScore: company.esgScore
    };

    const exists = portfolio.some(item => item.isin === company.isin);
    if (!exists) {
      setPortfolio(prev => [...prev, portfolioItem]);
    }
  };

  const handleRemoveFromPortfolio = (isin: string) => {
    setPortfolio(prev => prev.filter(item => item.isin !== isin));
  };

  const renderSelectionCard = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case 'Funds': {
        const fund = allFundData.find(f => f.fundName === selectedItem.name);
        if (!fund) return null;
        return (
          <FundDetails
            fund={fund}
            allCompanyData={allCompanyData}
            gaugeData={gaugeData}
          />
        );
      }
      case 'Companies': {
        const company = allCompanyData.find(c => c.companyName === selectedItem.name);
        if (!company) return null;
        return (
          <CompanyDetails
            company={company}
            handleAddToPortfolio={handleAddToPortfolio}
            gaugeData={gaugeData}
          />
        );
      }
      case 'Sectors': {
        return (
          <SectorDetails
            sectorName={selectedItem.name}
            allCompanyData={allCompanyData}
            gaugeData={gaugeData}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="bg-brand-bg-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <TabbedSearch
            fundOptions={fundOptions}
            companyOptions={companyOptions}
            sectorOptions={sectorOptions}
            onSelect={handleSelection}
          />

          {renderSelectionCard()}

          {selectedItem && (
            <AnalysisCard
              selectedItem={selectedItem}
              allCompanyData={allCompanyData}
            />
          )}

          <FundsComparisonTable
            portfolio={portfolio}
            onRemove={handleRemoveFromPortfolio}
          />
        </div>
      </div>
    </div>
  );
}