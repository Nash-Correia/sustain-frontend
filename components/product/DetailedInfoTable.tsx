import React, { useMemo } from 'react';
import { CompanyDataRow } from '@/lib/excel-data';

interface DetailedInfoTableProps {
  title: string;
  companies: CompanyDataRow[];
}

const numericColumns: (keyof CompanyDataRow)[] = ['e_score', 's_score', 'g_score', 'positive', 'controversy'];

export default function DetailedInfoTable({ title, companies }: DetailedInfoTableProps) {
  
  const minMaxValues = useMemo(() => {
    if (companies.length === 0) return {};

    const stats: { [key: string]: { min: number; max: number } } = {};

    numericColumns.forEach(column => {
      const values = companies.map(c => Number(c[column])).filter(v => !isNaN(v));
      if(values.length === 0) return;
      
      stats[column] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    return stats;
  }, [companies]);

  const getCellClass = (column: keyof CompanyDataRow, value: number | string) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return '';
    
    const stats = minMaxValues[column as string];
    if (!stats || companies.length <= 1) return '';
    
    if (numericValue === stats.max) return 'bg-green-100 text-green-800 font-bold';
    if (numericValue === stats.min) return 'bg-red-100 text-red-800 font-bold';
    
    return '';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-brand-dark mb-6">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Company Name</th>
              <th className="p-3 font-semibold text-gray-700 text-center">E-Score</th>
              <th className="p-3 font-semibold text-gray-700 text-center">S-Score</th>
              <th className="p-3 font-semibold text-gray-700 text-center">G-Score</th>
              <th className="p-3 font-semibold text-gray-700 text-center">Screen</th>
              <th className="p-3 font-semibold text-gray-700 text-center">Controversy</th>
              <th className="p-3 font-semibold text-gray-700">Sector</th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
                companies.map((company, index) => (
                <tr key={index} className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800">{company.companyName}</td>
                    {numericColumns.map(col => (
                        <td key={col} className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass(col, company[col])}`}>
                            {company[col]}
                        </td>
                    ))}
                    <td className="p-3 text-gray-600">{company.sector}</td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                        No companies to display.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

