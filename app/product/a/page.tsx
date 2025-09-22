"use client";

import { useState, useEffect, useMemo } from 'react';
import { getCompanyData, getFundData, CompanyDataRow, FundDataRow, PortfolioCompany } from '../../../lib/excel-data';

// Import all the necessary components
import GreenRatingGauge from "../../../components/product/GreenRatingGauge";
import RatingLegend from "../../../components/product/RatingLegend";
import FundsComparisonTable from "../../../components/product/FundsComparisonTable";
import CustomListComponent from "../../../components/product/CustomListComponent";
import SummaryScorecard from "../../../components/product/SummaryScorecard";
import Subscribe from "../../../components/Subscribe";
import TabbedSearch from '../../../components/product/TabbedSearch';

export default function ProductAPage() {
  const [allCompanyData, setAllCompanyData] = useState<CompanyDataRow[]>([]);
  const [allFundData, setAllFundData] = useState<FundDataRow[]>([]);
  
  const [selectedItem, setSelectedItem] = useState<{name: string, type: 'Funds' | 'Companies' | 'Sectors'} | null>(null);

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


  const handleSelection = (value: string, type: 'Funds' | 'Companies' | 'Sectors') => {
      setSelectedItem({ name: value, type });
  };
  
  const { score, rating, name } = useMemo(() => {
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


  const { portfolioEsgScore, totalAum } = useMemo(() => {
    if (portfolio.length === 0) {
      return { portfolioEsgScore: 0, totalAum: 0 };
    }
    const totalWeightedScore = portfolio.reduce((acc, company) => acc + (company.esgScore * (company.aum / 100)), 0);
    const totalAumValue = portfolio.reduce((acc, company) => acc + company.aum, 0);
    
    // Avoid division by zero and ensure the logic is correct for weighted average
    const finalScore = totalAumValue > 0 ? totalWeightedScore : 0;

    return { portfolioEsgScore: Math.round(finalScore), totalAum: Math.round(totalAumValue) };
  }, [portfolio]);

  const handleRemoveFromPortfolio = (isinToRemove: string) => {
    setPortfolio(portfolio.filter(p => p.isin !== isinToRemove));
  };

  const showCustomListBuilder = selectedItem?.type === 'Companies' || selectedItem?.type === 'Sectors';
  const customListCompanies = useMemo(() => {
      if (!selectedItem || selectedItem.type === 'Companies') {
          return allCompanyData;
      }
      if (selectedItem.type === 'Sectors') {
          return allCompanyData.filter(c => c.sector === selectedItem.name);
      }
      return allCompanyData;
  }, [selectedItem, allCompanyData]);


  return (
    <div className="bg-brand-bg-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-brand-dark mb-8">Green Rating</h1>
        
        <div className="space-y-8">
          <TabbedSearch 
            fundOptions={fundOptions}
            companyOptions={companyOptions}
            sectorOptions={sectorOptions}
            onSelect={handleSelection}
          />

          <GreenRatingGauge 
            score={score}
            rating={rating}
            fundName={name}
          />
          <RatingLegend />
          
          
            <>
              <CustomListComponent 
                allCompanyData={customListCompanies}
                portfolio={portfolio}
                setPortfolio={setPortfolio}
              />
              <FundsComparisonTable portfolio={portfolio} onRemove={handleRemoveFromPortfolio} />
              <SummaryScorecard 
                esgScore={portfolioEsgScore} 
                aumCovered={totalAum} 
              />
            </>
        </div>
      </div>
      <Subscribe />
    </div>
  );
}

