import { PortfolioCompany } from '@/lib/excel-data';

interface ComparisonProps {
  portfolio: PortfolioCompany[];
  onRemove: (isin: string) => void; // Function to remove a company
}

export default function FundsComparisonTable({ portfolio, onRemove }: ComparisonProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-brand-dark mb-6">Compare with other funds</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Company Name</th>
              <th className="p-3 font-semibold text-gray-700">ISIN</th>
              <th className="p-3 font-semibold text-gray-700">AUM Covered (%)</th>
              <th className="p-3 font-semibold text-gray-700">ESG Score</th>
              <th className="p-3 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Add companies above to see them here.
                </td>
              </tr>
            ) : (
              portfolio.map((item) => (
                <tr key={item.isin} className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-800">{item.companyName}</td>
                  <td className="p-3 text-gray-600">{item.isin}</td>
                  <td className="p-3 text-gray-600">{item.aum}</td>
                  <td className="p-3 text-gray-600 font-bold">{item.esgScore}</td>
                  <td className="p-3">
                    <button onClick={() => onRemove(item.isin)} className="text-red-600 hover:underline">
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}