// app/(whatever-your-route-is)/ProductAPage.tsx
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
  | { name: string; type: "Funds" | "Sectors" | "Companies" }
  | null;

export default function ProductAPage() {
  const [allCompanyData, setAllCompanyData] = useState<CompanyDataRow[]>([]);
  const [allFundData, setAllFundData] = useState<FundDataRow[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  // Lists
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<FundDataRow[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]); // ⬅️ NEW

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
      return { score: fund?.score ?? 0, rating: fund?.grade ?? "X", name: fund?.fundName ?? "" };
    }
    if (selectedItem.type === "Companies") {
      const company = allCompanyData.find((c) => c.companyName === selectedItem.name);
      return { score: company?.esgScore ?? 0, rating: company?.grade ?? "X", name: company?.companyName ?? "" };
    }
    if (selectedItem.type === "Sectors") {
      const list = allCompanyData.filter((c) => c.sector === selectedItem.name);
      if (list.length === 0) return { score: 0, rating: "N/A", name: `${selectedItem.name} (Sector)` };
      const total = list.reduce((acc, c) => acc + (c.esgScore || 0), 0);
      const avg = Math.round(total / list.length);
      let sectorGrade = "D";
      if (avg > 75) sectorGrade = "A+";
      else if (avg >= 70) sectorGrade = "A";
      else if (avg >= 65) sectorGrade = "B+";
      else if (avg >= 60) sectorGrade = "B";
      else if (avg >= 55) sectorGrade = "C+";
      else if (avg >= 50) sectorGrade = "C";
      return { score: avg, rating: sectorGrade, name: `${selectedItem.name} (Sector Average)` };
    }
    return { score: 0, rating: "X", name: "Select an item" };
  }, [selectedItem, allFundData, allCompanyData]);

  const handleSelection = (value: string, type: "Funds" | "Companies" | "Sectors") => {
    setSelectedItem({ name: value, type });
  };

  // COMPANY add/remove
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

  // FUND add/remove
  const handleAddFundToList = (fund: FundDataRow) => {
    setSelectedFunds((prev) =>
      prev.some((f) => f.fundName === fund.fundName) ? prev : [...prev, fund]
    );
  };
  const handleRemoveFundFromList = (fundName: string) => {
    setSelectedFunds((prev) => prev.filter((f) => f.fundName !== fundName));
  };

  // SECTOR add/remove ⬅️ NEW
  const handleAddSectorToList = (sectorName: string) => {
    const clean = sectorName.trim();
    if (!clean) return;
    setSelectedSectors((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
  };
  const handleRemoveSectorFromList = (sectorName: string) => {
    setSelectedSectors((prev) => prev.filter((s) => s !== sectorName));
  };

  // Sticky title bar content + add button (outside cards; sticks for the whole info section)
  const StickyContextBar = () => {
    if (!selectedItem?.name) return null;

    let title = selectedItem.name;
    let subtitle: string | null = null;
    let addBtn: React.ReactNode = null;

    if (selectedItem.type === "Funds") {
      const fund = allFundData.find((f) => f.fundName === selectedItem.name);
      if (!fund) return null;
      title = fund.fundName;
      addBtn = (
        <button
          onClick={() => handleAddFundToList(fund)}
          className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
        >
          Add to List
        </button>
      );
    } else if (selectedItem.type === "Companies") {
      const company = allCompanyData.find((c) => c.companyName === selectedItem.name);
      if (!company) return null;
      title = company.companyName;
      subtitle = company.sector || null;
      addBtn = (
        <button
          onClick={() => handleAddCompanyToList(company)}
          className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
        >
          Add to List
        </button>
      );
    } else if (selectedItem.type === "Sectors") {
      title = `${selectedItem.name} Sector`;
      addBtn = (
        <button
          onClick={() => handleAddSectorToList(selectedItem.name)}
          className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
        >
          Add to List
        </button>
      );
    }

    return (
      <div
        className="
          py-4
          sticky top-20 z-30
          bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70
          rounded-t-lg
        "
      >
        <div className="flex items-center justify-between gap-1 px-6">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-brand-dark truncate">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0 truncate">{subtitle}</p>
            )}
          </div>
          {addBtn}
        </div>
      </div>
    );
  };

  // Section body (cards)
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
            onAddSector={handleAddSectorToList} // ⬅️ pass through so the inner Add also works
            stickyTopOffsetPx={80}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="bg-brand-bg-light space-y-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <TabbedSearch
            fundOptions={fundOptions}
            companyOptions={companyOptions}
            sectorOptions={sectorOptions}
            onSelect={handleSelection}
          />

          {/* Info Section wrapper: the sticky bar will persist until this section ends */}
          {selectedItem ? (
            <section className="relative">
              <StickyContextBar />

              {/* Details card */}
              {renderSelectionCard()}

              {/* Analysis card */}
              <AnalysisCard selectedItem={selectedItem} allCompanyData={allCompanyData} />

              {/* Comparison lists inside the same section so sticky persists */}
              {selectedItem.type === "Funds" && selectedFunds.length > 0 && (
                <FundsComparisonTable
                  mode="funds"
                  funds={selectedFunds}
                  onRemoveFund={handleRemoveFundFromList}
                />
              )}

              {selectedItem.type === "Sectors" && selectedSectors.length > 0 && (
                <FundsComparisonTable
                  mode="sectors"                               // ⬅️ NEW
                  sectors={selectedSectors}                   // ⬅️ NEW
                  allCompanyData={allCompanyData}             // ⬅️ NEW
                  onRemoveSector={handleRemoveSectorFromList} // ⬅️ NEW
                />
              )}

              {selectedItem.type === "Companies" && portfolioCompanies.length > 0 && (
                <FundsComparisonTable
                  mode="companies"
                  companies={portfolioCompanies}
                  onRemoveCompany={handleRemoveCompanyFromList}
                />
              )}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
