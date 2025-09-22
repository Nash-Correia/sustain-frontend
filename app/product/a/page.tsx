"use client";

// Import necessary hooks and types from React and your project files.
import { useState, useEffect, useMemo } from 'react';
// CORRECTED: Using path aliases for robust imports.
import { getCompanyData, getFundData, CompanyDataRow, FundDataRow } from '@/lib/excel-data';

// Import existing and new components.
import GreenRatingGauge from "@/components/product/GreenRatingGauge";
import RatingLegend from "@/components/product/RatingLegend";
import Subscribe from "@/components/Subscribe";
import TabbedSearch from '@/components/product/TabbedSearch';
import DetailedInfoTable from '@/components/product/DetailedInfoTable';
import CompanyInfoCard from '@/components/product/CompanyInfoCard';
import FundSectorAnalysis from '@/components/product/FundSectorAnalysis';

// Define a type for the selected item to keep track of both the name and the category.
type SelectedItem = {
  name: string;
  type: 'Funds' | 'Companies' | 'Sectors';
} | null;

export default function ProductAPage() {
  // STATE MANAGEMENT
  const [allCompanyData, setAllCompanyData] = useState<CompanyDataRow[]>([]);
  const [allFundData, setAllFundData] = useState<FundDataRow[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  // DATA FETCHING
  useEffect(() => {
    async function loadData() {
      const companyData = await getCompanyData();
      const fundData = await getFundData();
      setAllCompanyData(companyData);
      setAllFundData(fundData);
    }
    loadData();
  }, []);

  // DATA MEMOIZATION AND DERIVATION
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

  // HANDLER FUNCTIONS
  const handleSelection = (value: string, type: 'Funds' | 'Companies' | 'Sectors') => {
      setSelectedItem({ name: value, type });
  };
  
  // RENDER LOGIC
  const renderDetailedContent = () => {
    if (!selectedItem) {
      return <div className="p-8 text-center text-gray-500 rounded-large border border-dashed">Please select an item to see details.</div>;
    }

    // A helper function to perform analysis on a list of companies.
    const analyzeCompanies = (companies: CompanyDataRow[]) => {
        if (companies.length === 0) {
            return { bestInSector: [], overallBest: 'N/A', averageScore: 0, highestScore: 0, lowestScore: 0 };
        }

        // Group companies by sector
        const groupedBySector: { [key: string]: CompanyDataRow[] } = {};
        companies.forEach(company => {
            if (!groupedBySector[company.sector]) {
                groupedBySector[company.sector] = [];
            }
            groupedBySector[company.sector].push(company);
        });

        // Find the best company in each sector
        const bestInSector = Object.entries(groupedBySector).map(([sector, sectorCompanies]) => {
            const bestCompany = sectorCompanies.reduce((best, current) => current.esgScore > best.esgScore ? current : best);
            return { sector, company: bestCompany.companyName };
        });

        // Find overall best company and calculate scores
        const scores = companies.map(c => c.esgScore);
        const overallBest = companies.reduce((best, current) => current.esgScore > best.esgScore ? current : best);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);

        return {
            bestInSector,
            overallBest: overallBest.companyName,
            averageScore: Math.round(totalScore / companies.length),
            highestScore: Math.max(...scores),
            lowestScore: Math.min(...scores),
        };
    };

    switch (selectedItem.type) {
      // CASE 1: A FUND IS SELECTED
      case 'Funds': {
        // NOTE: The current data structure does not link funds to specific companies.
        // Using a random subset of 15 companies as a placeholder for demonstration.
        // In a real application, you would fetch the holdings for the selected fund.
        const companiesInFund: CompanyDataRow[] = allCompanyData.slice(5, 20); // Placeholder data
        const analysisData = analyzeCompanies(companiesInFund);

        return (
          <div className="space-y-8">
            <DetailedInfoTable title={`Companies in ${selectedItem.name}`} companies={companiesInFund} />
            <FundSectorAnalysis title="Fund Analysis" data={analysisData} />
          </div>
        );
      }

      // CASE 2: A COMPANY IS SELECTED
      case 'Companies': {
        const companyData = allCompanyData.find(c => c.companyName === selectedItem.name);
        return companyData ? <CompanyInfoCard company={companyData} /> : null;
      }

      // CASE 3: A SECTOR IS SELECTED
      case 'Sectors': {
        const companiesInSector = allCompanyData.filter(c => c.sector === selectedItem.name);
        const analysisData = analyzeCompanies(companiesInSector);
        // Best in sector is not relevant when viewing a single sector
        analysisData.bestInSector = []; 

        return (
          <div className="space-y-8">
            <DetailedInfoTable title={`Companies in ${selectedItem.name} Sector`} companies={companiesInSector} />
            <FundSectorAnalysis title="Sector Analysis" data={analysisData} />
          </div>
        );
      }

      default:
        return null;
    }
  };

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
            score={gaugeData.score}
            rating={gaugeData.rating}
            fundName={gaugeData.name}
          />
          <RatingLegend />
          
          {renderDetailedContent()}
        </div>
      </div>
      <Subscribe />
    </div>
  );
}

