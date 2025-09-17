"use client";

import { useState, useEffect, useMemo } from 'react';
import { getCompanyData, CompanyDataRow, PortfolioCompany } from '@/lib/excel-data';

// ... (other component imports)
import GreenRatingGauge from "@/components/product/GreenRatingGauge";
import RatingLegend from "@/components/product/RatingLegend";
import FundsComparisonTable from "@/components/product/FundsComparisonTable";
import CustomListComponent from "@/components/product/CustomListComponent";
import SummaryScorecard from "@/components/product/SummaryScorecard";
import Subscribe from "@/components/Subscribe";

export default function ProductAPage() {
  const [allCompanyData, setAllCompanyData] = useState<CompanyDataRow[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioCompany[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getCompanyData();
      setAllCompanyData(data);
    }
    loadData();
  }, []);

  const { portfolioEsgScore, totalAum } = useMemo(() => {
    // ... (calculation logic remains the same)
    if (portfolio.length === 0) {
      return { portfolioEsgScore: 0, totalAum: 0 };
    }
    const totalWeightedScore = portfolio.reduce((acc, company) => acc + (company.esgScore * (company.aum / 100)), 0);
    const totalAum = portfolio.reduce((acc, company) => acc + company.aum, 0);
    const finalScore = Math.round(totalWeightedScore);
    return { portfolioEsgScore: finalScore, totalAum: Math.round(totalAum) };
  }, [portfolio]);

  // Function to remove a company from the portfolio
  const handleRemoveFromPortfolio = (isinToRemove: string) => {
    setPortfolio(portfolio.filter(p => p.isin !== isinToRemove));
  };

  return (
    <div className="bg-brand-bg-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-brand-dark mb-8">Green Rating</h1>
        
        {/* The old "Select Fund" dropdown is now removed from here */}

        <div className="space-y-8">
          <GreenRatingGauge score={portfolioEsgScore} />
          <RatingLegend />
          
         
          
          {/* The new advanced custom list creator */}
          <CustomListComponent 
            allCompanyData={allCompanyData}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
          />
           {/* The new dynamic comparison table */}
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