"use client";

import { useState, useMemo, useEffect } from 'react';
import SearchableSelect from '../ui/SearchableSelect';
import { clsx } from '@/lib/utils';
import RatingLegend from './RatingLegend';

type Tab = 'Funds' | 'Companies' | 'Sectors';

interface TabbedSearchProps {
  fundOptions: string[];
  companyOptions: string[];
  sectorOptions: string[];
  onSelect: (value: string, type: Tab) => void;
  // You'll need to add data that includes grades for each entity
  fundData?: { [key: string]: { grade: string } };
  companyData?: { [key: string]: { grade: string } };
  sectorData?: { [key: string]: { grade: string } };
}

const TabButton = ({ active, onClick, children }: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "relative px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none ",
      active 
        ? "border-brand-action text-brand-action bg-white shadow-sm" 
        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-200"
    )}
    style={active ? {
      borderBottomColor: 'var(--color-login-btn, #10B981)',
      color: 'var(--color-login-btn, #10B981)',
      '--tw-ring-color': 'var(--color-login-btn, #10B981)'
    } as React.CSSProperties : {}}
  >
    {children}
    {active && (
      <span 
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-sm"
        style={{ backgroundColor: 'var(--color-login-btn, #10B981)' }}
      />
    )}
  </button>
);

export default function TabbedSearch({ 
  fundOptions, 
  companyOptions, 
  sectorOptions, 
  onSelect,
  fundData,
  companyData,
  sectorData
}: TabbedSearchProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Funds');
  const [selectedFund, setSelectedFund] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [searchKey, setSearchKey] = useState(0);

  const currentOptions = useMemo(() => {
    switch (activeTab) {
      case 'Funds': return fundOptions;
      case 'Companies': return companyOptions;
      case 'Sectors': return sectorOptions;
      default: return [];
    }
  }, [activeTab, fundOptions, companyOptions, sectorOptions]);

  const { selected, setter } = useMemo(() => {
    switch (activeTab) {
      case 'Funds': return { selected: selectedFund, setter: setSelectedFund };
      case 'Companies': return { selected: selectedCompany, setter: setSelectedCompany };
      case 'Sectors': return { selected: selectedSector, setter: setSelectedSector };
    }
  }, [activeTab, selectedFund, selectedCompany, selectedSector]);

  // Get the current selected entity's data
  const getCurrentEntityData = () => {
    if (!selected) return null;

    switch (activeTab) {
      case 'Funds':
        return fundData?.[selected] ? {
          name: selected,
          type: 'Fund' as const,
          grade: fundData[selected].grade
        } : null;
      case 'Companies':
        return companyData?.[selected] ? {
          name: selected,
          type: 'Company' as const,
          grade: companyData[selected].grade
        } : null;
      case 'Sectors':
        return sectorData?.[selected] ? {
          name: selected,
          type: 'Sector' as const,
          grade: sectorData[selected].grade
        } : null;
      default:
        return null;
    }
  };

  // Handle tab switching with reset
  const handleTabSwitch = (newTab: Tab) => {
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      setSearchKey(prev => prev + 1);
      
      // Clear the selected value for the new tab
      switch (newTab) {
        case 'Funds':
          setSelectedFund('');
          break;
        case 'Companies':
          setSelectedCompany('');
          break;
        case 'Sectors':
          setSelectedSector('');
          break;
      }
    }
  };
  
  const handleSelection = (value: string) => {
    setter(value);
    onSelect(value, activeTab);
  };

  // Get placeholder text based on active tab
  const getPlaceholder = () => {
    switch (activeTab) {
      case 'Funds': return 'Search for a Fund...';
      case 'Companies': return 'Search for a Company...';
      case 'Sectors': return 'Search for a Sector...';
      default: return 'Search...';
    }
  };

  const currentEntityData = getCurrentEntityData();

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">ESG Comparison</h2>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-1">
            <TabButton 
              active={activeTab === 'Funds'} 
              onClick={() => handleTabSwitch('Funds')}
            >
              Funds
            </TabButton>
            <TabButton 
              active={activeTab === 'Sectors'} 
              onClick={() => handleTabSwitch('Sectors')}
            >
              Sectors
            </TabButton>
            <TabButton 
              active={activeTab === 'Companies'} 
              onClick={() => handleTabSwitch('Companies')}
            >
              Companies
            </TabButton>

          </nav>
        </div>

        {/* Search Section */}
        <div className="space-y-4">
          {/* Tab indicator */}
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: 'var(--color-login-btn, #10B981)' }}
            />
            <span className="text-sm font-medium text-gray-700">
              Searching in {activeTab}
            </span>
          </div>

          {/* SearchableSelect with reset capability */}
          <SearchableSelect
            key={`${activeTab}-${searchKey}`}
            options={currentOptions}
            selected={selected}
            onChange={handleSelection}
            placeholder={getPlaceholder()}
          />

          {/* Optional: Show selected count */}
          {currentOptions.length > 0 && (
            <div className="text-xs text-gray-500">
              {currentOptions.length} {activeTab.toLowerCase()} available
            </div>
          )}
        </div>
      </div>

      {/* Rating Legend - Now separate and conditional */}
      {/* <RatingLegend 
        selectedGrade={currentEntityData?.grade}
        selectedEntity={currentEntityData ? {
          name: currentEntityData.name,
          type: currentEntityData.type
        } : undefined}
      /> */}
    </div>
  );
}