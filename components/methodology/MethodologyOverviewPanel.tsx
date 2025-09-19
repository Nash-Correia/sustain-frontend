import React from 'react';
import { clsx } from '@/lib/utils';

interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MethodologyOverviewPanel({ isOpen, onClose }: PanelProps) {
  return (
    <div
      className={clsx(
        "fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Panel Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-brand-dark">Methodology Summary</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close panel"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Panel Content (restructured to prevent scrolling) */}
      <div className="p-6 overflow-y-auto h-[calc(100%-65px)]">
        <div className="prose max-w-none">
          <h3>Overview</h3>
          <p>
            The IiAS ESG rating methodology evaluates the top 500 companies by market capitalization in India. This comprehensive assessment focuses on sustainability-related disclosures and practices across Environmental, Social, and Governance dimensions.
          </p>

          {/* Use the detailed flowchart image */}
          <div className="my-6">
            <img 
              src="images/OverviewDiagramMethodology.png" 
              alt="Detailed ESG Methodology Flowchart" 
              className="w-full rounded-lg border shadow-sm" 
            />
          </div>

          <h3>Conclusion</h3>
          <p>
            The IiAS ESG methodology provides a comprehensive, structured approach to evaluating corporate sustainability performance. Its strength lies in its sector-specific approach, recognition of transition efforts (Parivartan), and dynamic controversy tracking, providing a nuanced assessment that supports informed decision-making.
          </p>
        </div>
      </div>
    </div>
  );
}