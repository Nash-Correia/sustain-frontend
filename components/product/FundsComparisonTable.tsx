// components/product/FundsComparisonTable.tsx
import { FundDataRow, PortfolioCompany, CompanyDataRow } from "@/lib/excel-data";
import { formatNumber } from "./productUtils";
import GreenRatingGauge from "./GreenRatingGauge";

type CompanyModeProps = {
  mode: "companies";
  companies: PortfolioCompany[];
  onRemoveCompany: (isin: string) => void;
  gaugePosition?: "top" | "bottom";
};

type FundModeProps = {
  mode: "funds";
  funds: FundDataRow[];
  onRemoveFund: (fundName: string) => void;
  gaugePosition?: "top" | "bottom";
};

type SectorModeProps = {
  mode: "sectors";
  sectors: string[]; // selected sector names
  allCompanyData: CompanyDataRow[];
  onRemoveSector: (sectorName: string) => void;
  gaugePosition?: "top" | "bottom";
};

type ComparisonProps = CompanyModeProps | FundModeProps | SectorModeProps;

function computeGrade(score: number): string {
  if (score > 75) return "A+";
  if (score >= 70) return "A";
  if (score >= 65) return "B+";
  if (score >= 60) return "B";
  if (score >= 55) return "C+";
  if (score >= 50) return "C";
  return "D";
}

function parsePercent(pct: string | number | undefined): number {
  if (pct === undefined || pct === null) return 0;
  if (typeof pct === "number") return pct;
  const n = parseFloat(String(pct).replace("%", "").trim());
  return isNaN(n) ? 0 : n;
}

export default function FundsComparisonTable(props: ComparisonProps) {
  const gaugePosition: "top" | "bottom" = props.gaugePosition ?? "top";

  const isFunds = props.mode === "funds";
  const isCompanies = props.mode === "companies";
  const isSectors = props.mode === "sectors";

  // ---- Derived summary (for gauge + KPIs) ----
  let title = "Selected Items";
  let esgScore = 0; // will feed gauge
  let coveragePct = 0; // shown as "AUM/Companies Covered" depending on mode
  let rating = "D";
  let gaugeName = "Average Rating";

  if (isFunds) {
    title = "Selected Funds";
    gaugeName = "Average Fund Rating";

    // Weighted by each fund's percentage; fallback to simple average
    const funds = props.funds;
    const weights = funds.map((f) => parsePercent(f.percentage));
    const totalW = weights.reduce((a, b) => a + b, 0);
    const weightedSum = funds.reduce(
      (acc, f, i) => acc + (f.score || 0) * (weights[i] || 0),
      0
    );
    esgScore =
      totalW > 0
        ? weightedSum / totalW
        : funds.length > 0
        ? funds.reduce((a, f) => a + (f.score || 0), 0) / funds.length
        : 0;

    coveragePct = Math.min(100, totalW);
    rating = computeGrade(esgScore);
  } else if (isCompanies) {
    title = "Selected Companies";
    gaugeName = "Average Company Rating";

    const companies = props.companies;
    const n = companies.length;

    esgScore =
      n > 0
        ? companies.reduce((a, c) => a + (c.esgScore || 0), 0) / n
        : 0;

    // Equal split → if any companies are picked, treat as 100% coverage
    coveragePct = n > 0 ? 100 : 0;
    rating = computeGrade(esgScore);
  } else {
    // Sectors mode
    title = "Selected Sectors";
    gaugeName = "Average Sector Rating";

    const { sectors, allCompanyData } = props;

    // Per sector: average composite and count
    type SectorRow = { sectorName: string; count: number; avgComposite: number; grade: string };
    const sectorRows: SectorRow[] = sectors.map((name) => {
      const comps = allCompanyData.filter((c) => c.sector === name);
      const count = comps.length;
      const avgComposite =
        count > 0
          ? comps.reduce((s, c) => s + (c.composite ?? 0), 0) / count
          : 0;
      return {
        sectorName: name,
        count,
        avgComposite,
        grade: computeGrade(avgComposite),
      };
    });

    // Summary score: weighted average by company count
    const totalCompanies = sectorRows.reduce((s, r) => s + r.count, 0);
    const weightedSum = sectorRows.reduce(
      (s, r) => s + r.avgComposite * r.count,
      0
    );
    esgScore = totalCompanies > 0 ? weightedSum / totalCompanies : 0;
    rating = computeGrade(esgScore);

    // Coverage: how much of the total universe is covered by selected sectors
    const universe = allCompanyData.length;
    coveragePct =
      universe > 0 ? Math.min(100, (totalCompanies / universe) * 100) : 0;
  }

  // ---- Gauge block for reuse ----
  const GaugeBlock = (
    <div className={gaugePosition === "bottom" ? "mt-6" : ""}>
      <GreenRatingGauge score={esgScore} rating={rating} fundName={gaugeName} />
    </div>
  );

  return (
    <>
      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-brand-dark mb-6">{title}</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                {isFunds && (
                  <>
                    <th className="p-3 font-semibold text-gray-700">Fund Name</th>
                    <th className="p-3 font-semibold text-gray-700">Score</th>
                    <th className="p-3 font-semibold text-gray-700">Grade</th>
                    <th className="p-3 font-semibold text-gray-700">Percent</th>
                    <th className="p-3 font-semibold text-gray-700">Action</th>
                  </>
                )}

                {isCompanies && (
                  <>
                    <th className="p-3 font-semibold text-gray-700">Company Name</th>
                    <th className="p-3 font-semibold text-gray-700">ISIN</th>
                    <th className="p-3 font-semibold text-gray-700">AUM Covered (%)</th>
                    <th className="p-3 font-semibold text-gray-700">ESG Score</th>
                    <th className="p-3 font-semibold text-gray-700">Action</th>
                  </>
                )}

                {isSectors && (
                  <>
                    <th className="p-3 font-semibold text-gray-700">Sector</th>
                    <th className="p-3 font-semibold text-gray-700">Companies</th>
                    <th className="p-3 font-semibold text-gray-700">Avg ESG Composite</th>
                    <th className="p-3 font-semibold text-gray-700">Sector Grade</th>
                    <th className="p-3 font-semibold text-gray-700">Action</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {isFunds &&
                props.funds.map((f) => (
                  <tr key={f.fundName} className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800">{f.fundName}</td>
                    <td className="p-3 text-gray-600">{formatNumber(f.score)}</td>
                    <td className="p-3 text-gray-600">{f.grade}</td>
                    <td className="p-3 text-gray-600">{f.percentage}</td>
                    <td className="p-3">
                      <button
                        onClick={() => props.onRemoveFund(f.fundName)}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}

              {isCompanies &&
                (() => {
                  const companies = props.companies;
                  const n = companies.length;
                  const perCompanyAum = n > 0 ? 100 / n : 0; // equal split

                  return companies.map((item) => (
                    <tr key={item.isin} className="border-b border-gray-200">
                      <td className="p-3 font-medium text-gray-800">
                        {item.companyName}
                      </td>
                      <td className="p-3 text-gray-600">{item.isin}</td>
                      <td className="p-3 text-gray-600">
                        {formatNumber(perCompanyAum)}%
                      </td>
                      <td className="p-3 text-gray-800 font-bold">
                        {formatNumber(item.esgScore)}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => props.onRemoveCompany(item.isin)}
                          className="text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ));
                })()}

              {isSectors &&
                (() => {
                  const { sectors, allCompanyData, onRemoveSector } = props;

                  // Build per-sector rows once here
                  const rows = sectors.map((name) => {
                    const comps = allCompanyData.filter((c) => c.sector === name);
                    const count = comps.length;
                    const avgComposite =
                      count > 0
                        ? comps.reduce((s, c) => s + (c.composite ?? 0), 0) / count
                        : 0;
                    return {
                      sectorName: name,
                      count,
                      avgComposite,
                      grade: computeGrade(avgComposite),
                    };
                  });

                  return rows.map((row) => (
                    <tr key={row.sectorName} className="border-b border-gray-200">
                      <td className="p-3 font-medium text-gray-800">{row.sectorName}</td>
                      <td className="p-3 text-gray-600">{row.count}</td>
                      <td className="p-3 text-gray-800 font-bold">
                        {formatNumber(row.avgComposite)}
                      </td>
                      <td className="p-3 text-gray-600">{row.grade}</td>
                      <td className="p-3">
                        <button
                          onClick={() => onRemoveSector(row.sectorName)}
                          className="text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ));
                })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary (Gauge + KPIs) */}
      <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8 mt-6">
        <h4 className="text-xl font-bold text-brand-dark mb-4">My Portfolio</h4>

        {/* Gauge at TOP */}
        {gaugePosition === "top" && GaugeBlock}

        {/* KPIs */}
        <div className="flex flex-wrap justify-center gap-8 mb-6">
          <div className="text-center p-4 bg-brand-bg-light rounded-lg border border-green-200 w-64 h-32 flex flex-col justify-center">
            <p className="text-sm text-indigo-600 font-medium">My Portfolio ESG Score</p>
            <p className="text-3xl font-bold text-indigo-800">
              {formatNumber(esgScore)}
            </p>
          </div>

          {/* Label changes depending on mode */}
          <div className="text-center p-4 bg-brand-bg-light rounded-lg border border-green-200 w-64 h-32 flex flex-col justify-center">
            <p className="text-sm text-teal-600 font-medium">
              {isFunds ? "AUM Covered" : isCompanies ? "AUM Covered" : "Companies Covered"}
            </p>
            <p className="text-3xl font-bold text-teal-800">
              {formatNumber(coveragePct)}%
            </p>
          </div>
        </div>

        {/* Gauge at BOTTOM */}
        {gaugePosition === "bottom" && GaugeBlock}
      </div>
    </>
  );
}
