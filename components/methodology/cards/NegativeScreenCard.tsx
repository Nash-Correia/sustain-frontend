import React from 'react';
import InfoSection from '@/components/methodology/InfoSection';

export default function NegativeScreenCard() {
  return (
    <InfoSection id="negative" title="Negative Screen">
      <p className="lead">
        The negative screen measures the impact of a company’s products or business activities on society, with a focus on potentially harmful sectors. A tiered deflator is applied to the ESG score if a company engages in these activities.
      </p>
      
      <div className="mt-6 space-y-6">
        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2">Assessment Framework</h3>
          <p>The score is based on a classification of <strong className="text-red-700">None / Polluting / Sin</strong>. This approach acknowledges the inherent ESG challenges and risks (regulatory, reputational) in certain industries.</p>
        </div>

        <div>
          <h3 className="font-bold text-xl text-brand-dark mb-2">Negative List Categories</h3>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sectors (Indicative, not exhaustive)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-semibold text-red-800 align-top">Sin Sectors</td>
                  <td className="px-6 py-4">Alcohol, Tobacco, Gambling, Adult Entertainment</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-orange-800 align-top">Polluting Sectors</td>
                  <td className="px-6 py-4">Oil, Cement, Iron & Steel, Coal, Mining, Chemicals, Fertilizer & Pesticides, Thermal Power</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </InfoSection>
  );
}