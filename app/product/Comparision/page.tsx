"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getCompanyData,
  getFundData,
  CompanyDataRow,
  FundDataRow,
  PortfolioCompany,
} from "@/lib/excel-data";
import TabbedSearch from "@/components/product/TabbedSearch";
import FundsComparisonTable from "@/components/product/FundsComparisonTable";
import FundDetails from "@/components/product/FundDetails";
import SectorDetails from "@/components/product/SectorDetails";
import CompanyDetails from "@/components/product/CompanyDetails";
import AnalysisCard from "@/components/product/AnalysisCard";

type SelectedItem =
  | {
      name: string;
      type: "Funds" | "Sectors" | "Companies";
    }
  | null;

export default function ProductAPage() {
  const [allCompanyData, setAllCompanyData] = useState<CompanyDataRow[]>([]);
  const [allFundData, setAllFundData] = useState<FundDataRow[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  // Independent selections (control when tables & summaries show)
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<FundDataRow[]>([]);

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
    const companies = allCompanyData.map((c) => c.companyName).filter(Boolean);
    const funds = allFundData.map((f) => f.fundName).filter(Boolean);
    const sectors = [...new Set(allCompanyData.map((c) => c.sector).filter(Boolean))];
    return { companyOptions: companies, fundOptions: funds, sectorOptions: sectors };
  }, [allCompanyData, allFundData]);

  const gaugeData = useMemo(() => {
    if (!selectedItem || !selectedItem.name?.trim()) {
      return { score: 0, rating: "X", name: "Select an item" };
    }
    if (selectedItem.type === "Funds") {
      const fund = allFundData.find((f) => f.fundName === selectedItem.name);
      return {
        score: fund?.score ?? 0,
        rating: fund?.grade ?? "X",
        name: fund?.fundName ?? "",
      };
    }
    if (selectedItem.type === "Companies") {
      const company = allCompanyData.find((c) => c.companyName === selectedItem.name);
      return {
        score: company?.esgScore ?? 0,
        rating: company?.grade ?? "X",
        name: company?.companyName ?? "",
      };
    }
    if (selectedItem.type === "Sectors") {
      const companiesInSector = allCompanyData.filter((c) => c.sector === selectedItem.name);
      if (companiesInSector.length === 0) {
        return { score: 0, rating: "N/A", name: `${selectedItem.name} (Sector)` };
      }
      const totalScore = companiesInSector.reduce((acc, c) => acc + (c.esgScore || 0), 0);
      const avgScore = Math.round(totalScore / companiesInSector.length);

      let sectorGrade = "D";
      if (avgScore > 75) sectorGrade = "A+";
      else if (avgScore >= 70) sectorGrade = "A";
      else if (avgScore >= 65) sectorGrade = "B+";
      else if (avgScore >= 60) sectorGrade = "B";
      else if (avgScore >= 55) sectorGrade = "C+";
      else if (avgScore >= 50) sectorGrade = "C";

      return {
        score: avgScore,
        rating: sectorGrade,
        name: `${selectedItem.name} (Sector Average)`,
      };
    }
    return { score: 0, rating: "X", name: "Select an item" };
  }, [selectedItem, allFundData, allCompanyData]);

  // Called by TabbedSearch on select or tab switch
  const handleSelection = (value: string, type: "Funds" | "Companies" | "Sectors") => {
    setSelectedItem({ name: value, type });
  };

  // COMPANY “Add to List”
  const handleAddCompanyToList = (company: CompanyDataRow) => {
    const item: PortfolioCompany = {
      companyName: company.companyName,
      isin: company.isin,
      aum: 0,
      esgScore: company.esgScore,
    };
    setPortfolioCompanies((prev) =>
      prev.some((p) => p.isin === item.isin) ? prev : [...prev, item]
    );
  };
  const handleRemoveCompanyFromList = (isin: string) => {
    setPortfolioCompanies((prev) => prev.filter((p) => p.isin !== isin));
  };

  // FUND “Add to List”
  const handleAddFundToList = (fund: FundDataRow) => {
    setSelectedFunds((prev) =>
      prev.some((f) => f.fundName === fund.fundName) ? prev : [...prev, fund]
    );
  };
  const handleRemoveFundFromList = (fundName: string) => {
    setSelectedFunds((prev) => prev.filter((f) => f.fundName !== fundName));
  };

  const renderSelectionCard = () => {
    if (!selectedItem || !selectedItem.name?.trim()) return null;

    switch (selectedItem.type) {
      case "Funds": {
        const fund = allFundData.find((f) => f.fundName === selectedItem.name);
        if (!fund) return null;
        return (
          <FundDetails
            fund={fund}
            allCompanyData={allCompanyData}
            handleAddFundToList={handleAddFundToList}
          />
        );
      }
      case "Companies": {
        const company = allCompanyData.find((c) => c.companyName === selectedItem.name);
        if (!company) return null;
        return (
          <CompanyDetails
            company={company}
            handleAddToPortfolio={handleAddCompanyToList}
            gaugeData={gaugeData}
          />
        );
      }
      case "Sectors": {
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
            <AnalysisCard selectedItem={selectedItem} allCompanyData={allCompanyData} />
          )}

          {/* SHOW funds table + summary only when on Funds tab and there are items */}
          {selectedItem?.type === "Funds" && selectedFunds.length > 0 && (
            <FundsComparisonTable
              mode="funds"
              funds={selectedFunds}
              onRemoveFund={handleRemoveFundFromList}
            />
          )}

          {/* SHOW companies table + summary only when on Companies tab and there are items */}
          {selectedItem?.type === "Companies" && portfolioCompanies.length > 0 && (
            <FundsComparisonTable
              mode="companies"
              companies={portfolioCompanies}
              onRemoveCompany={handleRemoveCompanyFromList}
            />
          )}
        </div>
      </div>
    </div>
  );
}
