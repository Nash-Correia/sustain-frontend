"use client";

import { CompanyDataRow } from "@/lib/excel-data";
import { formatNumber, getColumnStats, getCellClass } from "./productUtils";
import DRatingTable from "./DRatingTable";

const SectorDetails = ({
  sectorName,
  allCompanyData,
  gaugeData,
}: {
  sectorName: string;
  allCompanyData: CompanyDataRow[];
  gaugeData: { score: number; rating: string; name: string };
}) => {
  const companiesInSector = allCompanyData.filter(
    (c) => c.sector === sectorName
  );
  const totalCompanies = companiesInSector.length;

  const numericColumns = [
    "esgScore",
    "e_score",
    "s_score",
    "g_score",
    "screen",
    "controversy_screen",
  ];
  const pageStats = getColumnStats(companiesInSector, numericColumns);

  const totalScore = companiesInSector.reduce(
    (acc, c) => acc + (c.esgScore || 0),
    0
  );
  const avgScore = totalScore / companiesInSector.length;

  let sectorGrade = "D";
  if (avgScore > 75) sectorGrade = "A+";
  else if (avgScore >= 70) sectorGrade = "A";
  else if (avgScore >= 65) sectorGrade = "B+";
  else if (avgScore >= 60) sectorGrade = "B";
  else if (avgScore >= 55) sectorGrade = "C+";
  else if (avgScore >= 50) sectorGrade = "C";

  return (
    <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-brand-dark">
            {sectorName} Sector
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Sector Analysis • {totalCompanies} companies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-600 font-medium">
            Total Companies
          </p>
          <p className="text-3xl font-bold text-indigo-800">{totalCompanies}</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
          <p className="text-sm text-teal-600 font-medium">
            Average ESG Score
          </p>
          <p className="text-3xl font-bold text-teal-800">
            {formatNumber(avgScore)}
          </p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
          <p className="text-sm text-cyan-600 font-medium">Sector Grade</p>
          <p className="text-3xl font-bold text-cyan-800">{sectorGrade}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Companies in Sector
          </h4>
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
        <div className="relative h-[600px] overflow-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th className="text-left p-3 font-bold text-gray-700">
                  Company
                </th>
                <th className="text-center p-3 font-bold text-gray-700">
                  E-Score
                </th>
                <th className="text-center p-3 font-bold text-gray-700">
                  S-Score
                </th>
                <th className="text-center p-3 font-bold text-gray-700">
                  G-Score
                </th>
                <th className="text-center p-3 font-bold text-gray-700">
                  Positive{" "}
                </th>
                <th className="text-center p-3 font-bold text-gray-700">
                  Negative
                </th>
                <th className="text-center p-3 font-bold text-gray-700">
                  Controversy
                </th>
                <th className="text-center p-3 font-bold text-gray-700">
                  Compsite Score
                </th>
                <th className="text-center p-3 font-bold text-gray-700">
                  ESG Score
                </th>
                <th className="text-center p-3 font-semibold text-gray-700">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {companiesInSector.map((company, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {company.companyName}
                  </td>
                  <td
                    className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass(
                      "e_score",
                      company.e_score,
                      pageStats
                    )}`}
                  >
                    {formatNumber(company.e_score)}
                  </td>
                  <td
                    className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass(
                      "s_score",
                      company.s_score,
                      pageStats
                    )}`}
                  >
                    {formatNumber(company.s_score)}
                  </td>
                  <td
                    className={`p-3 text-center transition-colors duration-300 rounded-md ${getCellClass(
                      "g_score",
                      company.g_score,
                      pageStats
                    )}`}
                  >
                    {formatNumber(company.g_score)}
                  </td>
                  <td
                    className={`p-3 text-center transition-colors duration-300 rounded-md`}
                  >
                    {company.positive}
                  </td>
                  <td
                    className={`p-3 text-center transition-colors duration-300 rounded-md`}
                  >
                    {company.negative}
                  </td>
                  <td
                    className={`p-3 text-center transition-colors duration-300 rounded-md`}
                  >
                    {company.controversy}
                  </td>
                  <td
                    className={`p-3 text-center transition-colors duration-300 rounded-md`}
                  >
                    {formatNumber(company.composite)}
                  </td>
                  <td
                    className={`p-3 text-center font-semibold transition-colors duration-300 rounded-md ${getCellClass(
                      "esgScore",
                      company.esgScore,
                      pageStats
                    )}`}
                  >
                    {formatNumber(company.esgScore)}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {company.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SectorDetails;