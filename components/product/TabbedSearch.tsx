// components/product/TabbedSearch.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import SearchableSelect from "../ui/SearchableSelect";
import { clsx } from "@/lib/utils";

type Tab = "Funds" | "Companies" | "Sectors";

interface TabbedSearchProps {
  fundOptions: string[];
  companyOptions: string[];
  sectorOptions: string[];
  onSelect: (value: string, type: Tab) => void; // NOTE: pass "" to clear the card
  fundData?: { [key: string]: { grade: string } };
  companyData?: { [key: string]: { grade: string } };
  sectorData?: { [key: string]: { grade: string } };
  /** Optional: override the storage key if you render multiple TabbedSearch on a page */
  persistKey?: string;
}

const DEFAULT_STORAGE_KEY = "tabbed-search-state:v2";

const buildActiveStyles = (): React.CSSProperties & Record<string, string> => ({
  borderBottomColor: "var(--color-login-btn, #10B981)",
  color: "var(--color-login-btn, #10B981)",
  "--tw-ring-color": "var(--color-login-btn, #10B981)",
});

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "relative px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none",
      active
        ? "border-brand-action text-brand-action bg-white shadow-sm"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-200"
    )}
    style={active ? buildActiveStyles() : undefined}
  >
    {children}
    {active && (
      <span
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-sm"
        style={{ backgroundColor: "var(--color-login-btn, #10B981)" }}
      />
    )}
  </button>
);

type PersistedState = {
  activeTab: Tab;
  selections: {
    Funds: string;
    Companies: string;
    Sectors: string;
  };
};

function safeLoad(key: string): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (
      parsed &&
      (parsed.activeTab === "Funds" ||
        parsed.activeTab === "Companies" ||
        parsed.activeTab === "Sectors") &&
      parsed.selections &&
      typeof parsed.selections.Funds === "string" &&
      typeof parsed.selections.Companies === "string" &&
      typeof parsed.selections.Sectors === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function safeSave(key: string, state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export default function TabbedSearch({
  fundOptions,
  companyOptions,
  sectorOptions,
  onSelect,
  fundData,
  companyData,
  sectorData,
  persistKey = DEFAULT_STORAGE_KEY,
}: TabbedSearchProps) {
  // initial state (hydrate once)
  const hydrated = useRef(false);
  const [activeTab, setActiveTab] = useState<Tab>("Funds");
  const [selectedFund, setSelectedFund] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [searchKey, setSearchKey] = useState(0);

  // Helper to clear selection & notify parent for a tab
  const notifyClear = (tab: Tab) => onSelect("", tab);

  // Validate a value against options; return value if valid, else ""
  const ensureInOptions = (value: string, options: string[]) =>
    value && options.includes(value) ? value : "";

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const saved = safeLoad(persistKey);
    if (!saved) return;

    const validFunds = ensureInOptions(saved.selections.Funds, fundOptions);
    const validCompanies = ensureInOptions(saved.selections.Companies, companyOptions);
    const validSectors = ensureInOptions(saved.selections.Sectors, sectorOptions);

    setActiveTab(saved.activeTab);
    setSelectedFund(validFunds);
    setSelectedCompany(validCompanies);
    setSelectedSector(validSectors);

    // Restore card for the active tab (or clear if none)
    if (saved.activeTab === "Funds") {
      if (validFunds) onSelect(validFunds, "Funds");
      else notifyClear("Funds");
    } else if (saved.activeTab === "Companies") {
      if (validCompanies) onSelect(validCompanies, "Companies");
      else notifyClear("Companies");
    } else if (saved.activeTab === "Sectors") {
      if (validSectors) onSelect(validSectors, "Sectors");
      else notifyClear("Sectors");
    }
  }, [persistKey, fundOptions, companyOptions, sectorOptions, onSelect]);

  // Persist changes
  useEffect(() => {
    const state: PersistedState = {
      activeTab,
      selections: {
        Funds: selectedFund,
        Companies: selectedCompany,
        Sectors: selectedSector,
      },
    };
    safeSave(persistKey, state);
  }, [persistKey, activeTab, selectedFund, selectedCompany, selectedSector]);

  // If options change and the current selection becomes invalid, clear it.
  useEffect(() => {
    // funds
    if (selectedFund && !fundOptions.includes(selectedFund)) {
      setSelectedFund("");
      if (activeTab === "Funds") notifyClear("Funds");
    }
    // companies
    if (selectedCompany && !companyOptions.includes(selectedCompany)) {
      setSelectedCompany("");
      if (activeTab === "Companies") notifyClear("Companies");
    }
    // sectors
    if (selectedSector && !sectorOptions.includes(selectedSector)) {
      setSelectedSector("");
      if (activeTab === "Sectors") notifyClear("Sectors");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundOptions, companyOptions, sectorOptions]);

  // Options by tab
  const currentOptions = useMemo(() => {
    switch (activeTab) {
      case "Funds":
        return fundOptions;
      case "Companies":
        return companyOptions;
      case "Sectors":
        return sectorOptions;
      default:
        return [];
    }
  }, [activeTab, fundOptions, companyOptions, sectorOptions]);

  // Selected + setter by tab
  const { selected, setter } = useMemo(() => {
    switch (activeTab) {
      case "Funds":
        return { selected: selectedFund, setter: setSelectedFund };
      case "Companies":
        return { selected: selectedCompany, setter: setSelectedCompany };
      case "Sectors":
        return { selected: selectedSector, setter: setSelectedSector };
    }
  }, [activeTab, selectedFund, selectedCompany, selectedSector]);

  // Switch tabs:
  // - Re-mount the select
  // - If the new tab has a saved selection, restore it (onSelect with value)
  // - If it doesn't, explicitly clear (onSelect with "")
  const handleTabSwitch = (newTab: Tab) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
    setSearchKey((k) => k + 1);

    if (newTab === "Funds") {
      selectedFund ? onSelect(selectedFund, "Funds") : notifyClear("Funds");
    } else if (newTab === "Companies") {
      selectedCompany ? onSelect(selectedCompany, "Companies") : notifyClear("Companies");
    } else if (newTab === "Sectors") {
      selectedSector ? onSelect(selectedSector, "Sectors") : notifyClear("Sectors");
    }
  };

  // Select within current tab
  const handleSelection = (value: string) => {
    setter(value);
    onSelect(value, activeTab);
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "Funds":
        return "Search for a Fund...";
      case "Companies":
        return "Search for a Company...";
      case "Sectors":
        return "Search for a Sector...";
      default:
        return "Search...";
    }
  };

  // Optional: peek the grade for the selected value of the *active* tab
  const gradePeek =
    activeTab === "Funds" && selectedFund && fundData?.[selectedFund]?.grade
      ? fundData[selectedFund].grade
      : activeTab === "Companies" && selectedCompany && companyData?.[selectedCompany]?.grade
      ? companyData[selectedCompany].grade
      : activeTab === "Sectors" && selectedSector && sectorData?.[selectedSector]?.grade
      ? sectorData[selectedSector].grade
      : undefined;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">
          ESG Rating Comparison
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-1">
            <TabButton active={activeTab === "Funds"} onClick={() => handleTabSwitch("Funds")}>
              Funds
            </TabButton>
            <TabButton active={activeTab === "Sectors"} onClick={() => handleTabSwitch("Sectors")}>
              Sectors
            </TabButton>
            <TabButton
              active={activeTab === "Companies"}
              onClick={() => handleTabSwitch("Companies")}
            >
              Companies
            </TabButton>
          </nav>
        </div>

        {/* Search */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "var(--color-login-btn, #10B981)" }}
            />
            <span className="text-sm font-medium text-gray-700">
              Searching in {activeTab}
            </span>
            {gradePeek && (
              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-brand-surface text-brand-dark border border-ui-border">
                Grade: <b>{gradePeek}</b>
              </span>
            )}
          </div>

          <SearchableSelect
            key={`${activeTab}-${searchKey}`}
            options={currentOptions}
            selected={selected} // remains per-tab; never leaks to other tabs
            onChange={handleSelection}
            placeholder={getPlaceholder()}
          />

          {currentOptions.length > 0 && (
            <div className="text-xs text-gray-500">
              {currentOptions.length} {activeTab.toLowerCase()} available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
