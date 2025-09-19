"use client";

import { useState, useEffect, useMemo } from 'react';
import { getCompanyData, CompanyDataRow, PortfolioCompany } from '@/lib/excel-data';

// Import all the necessary components
import GreenRatingGauge from "@/components/product/GreenRatingGauge";
import RatingLegend from "@/components/product/RatingLegend";
import FundsComparisonTable from "@/components/product/FundsComparisonTable";
import CustomListComponent from "@/components/product/CustomListComponent";
import SummaryScorecard from "@/components/product/SummaryScorecard";
import Subscribe from "@/components/Subscribe";
import SearchableSelect from '@/components/ui/SearchableSelect';

export default function ProductAPage() {
  const [allCompanyData, setAllCompanyData] = useState<CompanyDataRow[]>([]);
  const [selectedFund, setSelectedFund] = useState<CompanyDataRow | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioCompany[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getCompanyData();
      setAllCompanyData(data);
    }
    loadData();
  }, []);

  const handleFundSelection = (companyName: string) => {
    const fund = allCompanyData.find(c => c.companyName === companyName) || null;
    setSelectedFund(fund);
  };
  
  const { portfolioEsgScore, totalAum } = useMemo(() => {
    if (portfolio.length === 0) {
      return { portfolioEsgScore: 0, totalAum: 0 };
    }
    const totalWeightedScore = portfolio.reduce((acc, company) => acc + (company.esgScore * (company.aum / 100)), 0);
    const totalAum = portfolio.reduce((acc, company) => acc + company.aum, 0);
    return { portfolioEsgScore: Math.round(totalWeightedScore), totalAum: Math.round(totalAum) };
  }, [portfolio]);

  const handleRemoveFromPortfolio = (isinToRemove: string) => {
    setPortfolio(portfolio.filter(p => p.isin !== isinToRemove));
  };

  const companyOptions = useMemo(() => allCompanyData.map(c => c.companyName), [allCompanyData]);

  return (
    <div className="bg-brand-bg-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Green Rating</h1>
        
        <div className="max-w-md mb-8">
          <label htmlFor="fund-select" className="text-sm font-medium text-gray-700">Select Fund</label>
          <SearchableSelect
            options={companyOptions}
            selected={selectedFund?.companyName || ''}
            onChange={handleFundSelection}
            placeholder="Search for a fund or company"
          />
        </div>

        <div className="space-y-8">
          <GreenRatingGauge 
            score={selectedFund?.esgScore ?? 0}
            rating={selectedFund?.esgRating ?? 'X'}
            fundName={selectedFund?.companyName ?? ''}
          />
          <RatingLegend />
          

          <CustomListComponent 
            allCompanyData={allCompanyData}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
          />
          <FundsComparisonTable portfolio={portfolio} onRemove={handleRemoveFromPortfolio} />
          <SummaryScorecard 
            esgScore={portfolioEsgScore} 
            aumCovered={totalAum} 
          />
        </div>
      </div>
      <Subscribe />
    </div>
  );
}