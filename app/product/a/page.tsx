"use client";

// Import necessary hooks and types from React and your project files.
import { useState, useEffect, useMemo } from 'react';
// CORRECTED: Using path aliases for robust imports.
import { getCompanyData, getFundData, CompanyDataRow, FundDataRow, PortfolioCompany } from '@/lib/excel-data';

// Import existing and new components.
import GreenRatingGauge from "@/components/product/GreenRatingGauge";
import Subscribe from "@/components/Subscribe";
import TabbedSearch from '@/components/product/TabbedSearch';
import DetailedInfoTable from '@/components/product/DetailedInfoTable';
import CompanyInfoCard from '@/components/product/CompanyInfoCard';
import FundSectorAnalysis from '@/components/product/FundSectorAnalysis';
import FundsComparisonTable from '@/components/product/FundsComparisonTable';

// Define a type for the selected item to keep track of both the name and the category.
type SelectedItem = {
  name: string;
  type: 'Funds' | 'Sectors'|'Companies'  ;
} | null;

export default function ProductAPage() {
  // STATE MANAGEMENT
  const [allCompanyData, setAllCompanyData] = useState<CompanyDataRow[]>([]);
  const [allFundData, setAllFundData] = useState<FundDataRow[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [portfolio, setPortfolio] = useState<PortfolioCompany[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleAddToPortfolio = (company: CompanyDataRow) => {
    const portfolioItem: PortfolioCompany = {
      companyName: company.companyName,
      isin: company.companyName, // Using company name as placeholder for ISIN
      aum: 0, // Placeholder number instead of string
      esgScore: company.esgScore
    };
    
    // Check if already exists
    const exists = portfolio.some(item => item.companyName === company.companyName);
    if (!exists) {
      setPortfolio(prev => [...prev, portfolioItem]);
    }
  };

  const handleRemoveFromPortfolio = (isin: string) => {
    setPortfolio(prev => prev.filter(item => item.isin !== isin));
  };

  // Helper function to format numbers to 2 decimal places
  const formatNumber = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Helper function to calculate column statistics and determine cell styling
  const getColumnStats = (data: any[], columns: string[]) => {
    const stats: { [key: string]: { min: number; max: number; avg: number } } = {};
    
    columns.forEach(column => {
      const values = data.map(item => Number(item[column])).filter(v => !isNaN(v));
      if (values.length > 0) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        stats[column] = { min, max, avg };
      }
    });
    
    return stats;
  };

  // Helper function to get cell styling based on value
  const getCellClass = (column: string, value: number | string, stats: any) => {
    const numValue = Number(value);
    if (isNaN(numValue) || !stats[column]) return '';
    
    const { min, max, avg } = stats[column];
    const tolerance = 0.01; // Small tolerance for floating point comparison
    
    if (Math.abs(numValue - max) < tolerance) return 'bg-green-100 text-green-800 font-bold border border-green-300';
    if (Math.abs(numValue - min) < tolerance) return 'bg-red-100 text-red-800 font-bold border border-red-300';
    if (Math.abs(numValue - avg) < tolerance) return 'bg-blue-100 text-blue-800 font-semibold border border-blue-300';
    
    return '';
  };

  // Reset pagination when selection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedItem]);
  
  // RENDER SELECTION CARD - appears after selection with pagination
  const renderSelectionCard = () => {
    if (!selectedItem) return null;

    // Pagination helper component
    const PaginationControls = ({ totalItems, currentPage, onPageChange }: {
      totalItems: number;
      currentPage: number;
      onPageChange: (page: number) => void;
    }) => {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      
      if (totalPages <= 1) return null;

      return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === i + 1
                    ? 'bg-brand-action text-white'
                    : 'border hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      );
    };

    switch (selectedItem.type) {
      case 'Funds': {
        const fund = allFundData.find(f => f.fundName === selectedItem.name);
        if (!fund) return null;
        
        // Get paginated companies for this fund
        const companiesInFund = allCompanyData.slice(5, 20); // Placeholder data
        const totalCompanies = companiesInFund.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedCompanies = companiesInFund.slice(startIndex, startIndex + itemsPerPage);
        
        // Calculate statistics for the current page
        const numericColumns = ['esgScore', 'screen', 'controversy_screen'];
        const pageStats = getColumnStats(paginatedCompanies, numericColumns);
        
        // Fill remaining rows with empty placeholders to maintain table height
        const emptyRowsNeeded = itemsPerPage - paginatedCompanies.length;
        const emptyRows = Array(Math.max(0, emptyRowsNeeded)).fill(null);
        
        return (
          <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-brand-dark">{fund.fundName}</h3>
                <p className="text-sm text-gray-600 mt-1">Fund • {totalCompanies} Companies</p>
              </div>
            </div>

            {/* Fund Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">ESG Score</p>
                <p className="text-3xl font-bold text-blue-800">{formatNumber(fund.score)}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">Grade</p>
                <p className="text-3xl font-bold text-green-800">{fund.grade}</p>
              </div>
            </div>

            {/* Holdings Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-gray-600">Highest</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                    <span className="text-gray-600">Average</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-gray-600">Lowest</span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-700">Company</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Sector</th>
                      <th className="text-center p-3 font-semibold text-gray-700">ESG Score</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Screen</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Controversy</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCompanies.map((company, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-800">{company.companyName}</td>
                        <td className="p-3 text-left text-gray-600">{company.sector}</td>
                        <td className={`p-3 text-center font-semibold transition-colors duration-300 rounded-md ${getCellClass('esgScore', company.esgScore, pageStats)}`}>
                          {formatNumber(company.esgScore)}
                        </td>
                        <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('screen', company.screen, pageStats)}`}>
                          {formatNumber(company.screen)}
                        </td>
                        <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('controversy_screen', company.controversy_screen, pageStats)}`}>
                          {formatNumber(company.controversy_screen)}
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                            {company.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Empty rows to maintain consistent table height */}
                    {emptyRows.map((_, index) => (
                      <tr key={`empty-${index}`} className="border-b border-gray-100">
                        <td className="p-3" style={{ height: '53px' }}>&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <PaginationControls 
                totalItems={totalCompanies}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        );
      }

      case 'Companies': {
        const company = allCompanyData.find(c => c.companyName === selectedItem.name);
        if (!company) return null;
        
        return (
          <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-brand-dark">{company.companyName}</h3>
                <p className="text-sm text-gray-600 mt-1">Company • {company.sector} Sector</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  Grade {company.grade}
                </span>
                <button 
                  onClick={() => handleAddToPortfolio(company)}
                  className="px-4 py-2 bg-brand-action text-white rounded-lg text-sm font-medium hover:bg-brand-action/90 transition-colors"
                >
                  Add to List
                </button>
              </div>
            </div>

            {/* Company ESG Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">Environmental</p>
                <p className="text-3xl font-bold text-green-800">{formatNumber(company.e_score)}</p>
                <p className="text-xs text-green-600 mt-1">E-Score</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Social</p>
                <p className="text-3xl font-bold text-blue-800">{formatNumber(company.s_score)}</p>
                <p className="text-xs text-blue-600 mt-1">S-Score</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600 font-medium">Governance</p>
                <p className="text-3xl font-bold text-purple-800">{formatNumber(company.g_score)}</p>
                <p className="text-xs text-purple-600 mt-1">G-Score</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-600 font-medium">Screen Score</p>
                <p className="text-3xl font-bold text-orange-800">{formatNumber(company.screen)}</p>
                <p className="text-xs text-orange-600 mt-1">Screening</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 font-medium">Controversy</p>
                <p className="text-3xl font-bold text-red-800">{formatNumber(company.controversy_screen)}</p>
                <p className="text-xs text-red-600 mt-1">Risk Level</p>
              </div>
            </div>

            {/* Company Overview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">ESG Summary</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Overall ESG Score:</span>
                  <span className="ml-2 font-bold text-brand-action">{formatNumber(company.esgScore)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Industry Position:</span>
                  <span className="ml-2 font-semibold text-gray-800">{company.grade} Grade</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'Sectors': {
        const companiesInSector = allCompanyData.filter(c => c.sector === selectedItem.name);
        const totalCompanies = companiesInSector.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedCompanies = companiesInSector.slice(startIndex, startIndex + itemsPerPage);
        
        // Calculate statistics for all numeric columns in the current page
        const numericColumns = ['esgScore', 'e_score', 's_score', 'g_score', 'screen', 'controversy_screen'];
        const pageStats = getColumnStats(paginatedCompanies, numericColumns);
        
        // Fill remaining rows with empty placeholders to maintain table height
        const emptyRowsNeeded = itemsPerPage - paginatedCompanies.length;
        const emptyRows = Array(Math.max(0, emptyRowsNeeded)).fill(null);
        
        const totalScore = companiesInSector.reduce((acc, c) => acc + (c.esgScore || 0), 0);
        const avgScore = totalScore / companiesInSector.length;
        
        let sectorGrade = 'D';
        if (avgScore > 75) sectorGrade = 'A+';
        else if (avgScore >= 70) sectorGrade = 'A';
        else if (avgScore >= 65) sectorGrade = 'B+';
        else if (avgScore >= 60) sectorGrade = 'B';
        else if (avgScore >= 55) sectorGrade = 'C+';
        else if (avgScore >= 50) sectorGrade = 'C';
        
        return (
          <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-brand-dark">{selectedItem.name} Sector</h3>
                <p className="text-sm text-gray-600 mt-1">Sector Analysis • {totalCompanies} companies</p>
              </div>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                Avg Grade {sectorGrade}
              </span>
            </div>

            {/* Sector Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-600 font-medium">Total Companies</p>
                <p className="text-3xl font-bold text-indigo-800">{totalCompanies}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                <p className="text-sm text-teal-600 font-medium">Average ESG Score</p>
                <p className="text-3xl font-bold text-teal-800">{formatNumber(avgScore)}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
                <p className="text-sm text-cyan-600 font-medium">Sector Grade</p>
                <p className="text-3xl font-bold text-cyan-800">{sectorGrade}</p>
              </div>
            </div>

            {/* Companies Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Companies in Sector</h4>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-gray-600">Highest</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                    <span className="text-gray-600">Average</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-gray-600">Lowest</span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-700">Company</th>
                      <th className="text-center p-3 font-semibold text-gray-700">ESG Score</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Grade</th>
                      <th className="text-center p-3 font-semibold text-gray-700">E-Score</th>
                      <th className="text-center p-3 font-semibold text-gray-700">S-Score</th>
                      <th className="text-center p-3 font-semibold text-gray-700">G-Score</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Screen</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Controversy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCompanies.map((company, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-800">{company.companyName}</td>
                        <td className={`p-3 text-center font-semibold transition-colors duration-300 rounded-md ${getCellClass('esgScore', company.esgScore, pageStats)}`}>
                          {formatNumber(company.esgScore)}
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                            {company.grade}
                          </span>
                        </td>
                        <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('e_score', company.e_score, pageStats)}`}>
                          {formatNumber(company.e_score)}
                        </td>
                        <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('s_score', company.s_score, pageStats)}`}>
                          {formatNumber(company.s_score)}
                        </td>
                        <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('g_score', company.g_score, pageStats)}`}>
                          {formatNumber(company.g_score)}
                        </td>
                        <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('screen', company.screen, pageStats)}`}>
                          {formatNumber(company.screen)}
                        </td>
                        <td className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass('controversy_screen', company.controversy_screen, pageStats)}`}>
                          {formatNumber(company.controversy_screen)}
                        </td>
                      </tr>
                    ))}
                    {/* Empty rows to maintain consistent table height */}
                    {emptyRows.map((_, index) => (
                      <tr key={`empty-${index}`} className="border-b border-gray-100">
                        <td className="p-3" style={{ height: '53px' }}>&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                        <td className="p-3">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <PaginationControls 
                totalItems={totalCompanies}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // RENDER ANALYSIS CARD - improved version of FundSectorAnalysis
  const renderAnalysisCard = () => {
    if (!selectedItem) return null;

    // Enhanced StatCard component with better formatting
    const StatCard = ({ label, value, trend, description }: { 
      label: string; 
      value: string | number; 
      trend?: 'up' | 'down' | 'neutral';
      description?: string;
    }) => (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-3xl font-bold text-brand-action">{typeof value === 'number' ? formatNumber(value) : value}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        {trend && (
          <div className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
            {trend === 'up' ? '↗ Above Average' : trend === 'down' ? '↘ Below Average' : '→ Average'}
          </div>
        )}
      </div>
    );

    const analyzeData = (companies: CompanyDataRow[]) => {
      if (companies.length === 0) {
        return { 
          bestCompany: 'N/A', 
          worstCompany: 'N/A',
          averageScore: 0, 
          highestScore: 0, 
          lowestScore: 0,
          totalCompanies: 0,
          sectorBreakdown: {},
          riskAnalysis: { high: 0, medium: 0, low: 0 },
          screeningCompliance: 0
        };
      }

      const scores = companies.map(c => c.esgScore);
      const controversyScores = companies.map(c => c.controversy_screen || 0);
      const screenScores = companies.map(c => c.screen || 0);
      
      const bestCompany = companies.reduce((best, current) => 
        current.esgScore > best.esgScore ? current : best
      );
      
      const worstCompany = companies.reduce((worst, current) => 
        current.esgScore < worst.esgScore ? current : worst
      );

      // Sector breakdown
      const sectorBreakdown: { [key: string]: { count: number; avgScore: number } } = {};
      companies.forEach(company => {
        if (!sectorBreakdown[company.sector]) {
          sectorBreakdown[company.sector] = { count: 0, avgScore: 0 };
        }
        sectorBreakdown[company.sector].count++;
      });

      // Calculate average scores per sector
      Object.keys(sectorBreakdown).forEach(sector => {
        const sectorCompanies = companies.filter(c => c.sector === sector);
        const avgScore = sectorCompanies.reduce((sum, c) => sum + c.esgScore, 0) / sectorCompanies.length;
        sectorBreakdown[sector].avgScore = avgScore;
      });

      // Risk analysis based on controversy scores
      const riskAnalysis = {
        high: controversyScores.filter(score => score > 70).length,
        medium: controversyScores.filter(score => score >= 40 && score <= 70).length,
        low: controversyScores.filter(score => score < 40).length
      };

      // Screening compliance
      const passedScreening = screenScores.filter(score => score > 60).length;
      const screeningCompliance = (passedScreening / companies.length) * 100;

      return {
        bestCompany: bestCompany.companyName,
        worstCompany: worstCompany.companyName,
        averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        totalCompanies: companies.length,
        sectorBreakdown,
        riskAnalysis,
        screeningCompliance
      };
    };

    let analysisData;
    let companies: CompanyDataRow[] = [];
    let cardTitle = '';

    switch (selectedItem.type) {
      case 'Funds':
        companies = allCompanyData.slice(5, 20); // Placeholder for fund holdings
        analysisData = analyzeData(companies);
        cardTitle = `${selectedItem.name} - Fund Analysis`;
        break;
      case 'Companies':
        // For individual companies, show sector analysis
        const company = allCompanyData.find(c => c.companyName === selectedItem.name);
        if (company) {
          companies = allCompanyData.filter(c => c.sector === company.sector && c.companyName !== company.companyName);
          analysisData = analyzeData(companies);
          cardTitle = `${company.sector} Sector - Peer Analysis`;
        }
        break;
      case 'Sectors':
        companies = allCompanyData.filter(c => c.sector === selectedItem.name);
        analysisData = analyzeData(companies);
        cardTitle = `${selectedItem.name} Sector - Analysis`;
        break;
    }

    if (!analysisData || analysisData.totalCompanies === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-brand-dark mb-4">Analysis</h3>
          <p className="text-gray-500 text-center py-8">No data available for analysis.</p>
        </div>
      );
    }

    const sectorEntries = Object.entries(analysisData.sectorBreakdown)
      .sort((a, b) => b[1].avgScore - a[1].avgScore)
      .slice(0, 5); // Show top 5 sectors

    return (
      <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-brand-dark mb-6">{cardTitle}</h3>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Total Companies" 
            value={analysisData.totalCompanies}
            description="In analysis"
          />
          <StatCard 
            label="Average ESG" 
            value={analysisData.averageScore}
            description="Composite score"
          />
          <StatCard 
            label="Best Performer" 
            value={analysisData.highestScore}
            trend="up"
            description="Highest ESG score"
          />
          <StatCard 
            label="Screening Pass Rate" 
            value={`${formatNumber(analysisData.screeningCompliance)}%`}
            description="Compliance rate"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Top & Bottom Performers */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Performance Leaders</h4>
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">🏆 Top Performer</span>
                    <span className="text-lg font-bold text-green-800">{formatNumber(analysisData.highestScore)}</span>
                  </div>
                  <p className="text-green-900 font-semibold mt-1">{analysisData.bestCompany}</p>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-700">⚠️ Needs Improvement</span>
                    <span className="text-lg font-bold text-red-800">{formatNumber(analysisData.lowestScore)}</span>
                  </div>
                  <p className="text-red-900 font-semibold mt-1">{analysisData.worstCompany}</p>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Sector Performance (if applicable) */}
            {sectorEntries.length > 1 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">Sector Performance</h4>
                <div className="space-y-2">
                  {sectorEntries.map(([sector, data], index) => (
                    <div key={sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-800">{sector}</span>
                        <span className="text-xs text-gray-500 ml-2">({data.count} companies)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">{formatNumber(data.avgScore)}</span>
                        {index === 0 && <span className="text-xs text-green-600 ml-1">👑</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // RENDER DETAILED CONTENT - existing logic but simplified
  const renderDetailedContent = () => {
    if (!selectedItem) {
      return <div className="p-8 text-center text-gray-500 rounded-large border border-dashed">Please select an item to see detailed analysis.</div>;
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
      case 'Funds': {
        const companiesInFund: CompanyDataRow[] = allCompanyData.slice(5, 20);
        const analysisData = analyzeCompanies(companiesInFund);

        return (
          <div className="space-y-8">
            <DetailedInfoTable title={`Companies in ${selectedItem.name}`} companies={companiesInFund} />
            <FundSectorAnalysis title="Fund Analysis" data={analysisData} />
          </div>
        );
      }

      case 'Companies': {
        const companyData = allCompanyData.find(c => c.companyName === selectedItem.name);
        return companyData ? <CompanyInfoCard company={companyData} /> : null;
      }

      case 'Sectors': {
        const companiesInSector = allCompanyData.filter(c => c.sector === selectedItem.name);
        const analysisData = analyzeCompanies(companiesInSector);
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
        
        {/* 1. GREEN RATING - Top Center */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-dark">Green Rating</h1>
        </div>
        
        <div className="space-y-8">
          {/* 2. TABBED SEARCH */}
          <TabbedSearch 
            fundOptions={fundOptions}
            companyOptions={companyOptions}
            sectorOptions={sectorOptions}
            onSelect={handleSelection}
          />

          {/* 3. SELECTION CARD - appears after selection */}
          {renderSelectionCard()}

          {/* 3.5. FUND/SECTOR ANALYSIS - appears under selection card */}
          {selectedItem && renderAnalysisCard()}

          {/* 4. GAUGE AND RATING LEGEND */}
          <div className="grid lg:grid-cols-2 gap-8">
            <GreenRatingGauge 
              score={gaugeData.score}
              rating={gaugeData.rating}
              fundName={gaugeData.name}
            />
            <div className="flex items-center">
            </div>
          </div>
          
          {/* 5. DETAILED INFO TABLE */}
          

          {/* 6. CUSTOM LIST COMPONENT */}
          <FundsComparisonTable 
            portfolio={portfolio}
            onRemove={handleRemoveFromPortfolio}
          />
        </div>
      </div>
      <Subscribe />
    </div>
  );
}