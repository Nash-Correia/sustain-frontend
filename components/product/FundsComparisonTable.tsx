// components/product/FundsComparisonTable.tsx
import { FundDataRow, PortfolioCompany } from "@/lib/excel-data";
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

type ComparisonProps = CompanyModeProps | FundModeProps;

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
  const isFunds = props.mode === "funds";
  const gaugePosition: "top" | "bottom" = props.gaugePosition ?? "top";

  // ---- Derived summary (for gauge + KPIs) ----
  let title = isFunds ? "Selected Funds" : "Selected Companies";
  let esgScore = 0;
  let aumCovered = 0;
  let rating = "D";
  let gaugeName = isFunds ? "Average Fund Rating" : "Average Company Rating";

  if (isFunds) {
    // FUNDS MODE — weighted by each fund's % (falls back to simple average if missing)
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
    aumCovered = Math.min(100, totalW);
    rating = computeGrade(esgScore);
  } else {
    // COMPANIES MODE — EQUAL AUM DISTRIBUTION (no input for AUM)
    const companies = props.companies;
    const n = companies.length;

    esgScore =
      n > 0
        ? companies.reduce((a, c) => a + (c.esgScore || 0), 0) / n
        : 0;

    // Equal distribution: if any companies, total AUM covered is 100%
    aumCovered = n > 0 ? 100 : 0;
    rating = computeGrade(esgScore);
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
                {isFunds ? (
                  <>
                    <th className="p-3 font-semibold text-gray-700">Fund Name</th>
                    <th className="p-3 font-semibold text-gray-700">Score</th>
                    <th className="p-3 font-semibold text-gray-700">Grade</th>
                    <th className="p-3 font-semibold text-gray-700">Percent</th>
                    <th className="p-3 font-semibold text-gray-700">Action</th>
                  </>
                ) : (
                  <>
                    <th className="p-3 font-semibold text-gray-700">Company Name</th>
                    <th className="p-3 font-semibold text-gray-700">ISIN</th>
                    <th className="p-3 font-semibold text-gray-700">AUM Covered (%)</th>
                    <th className="p-3 font-semibold text-gray-700">ESG Score</th>
                    <th className="p-3 font-semibold text-gray-700">Action</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {isFunds
                ? props.funds.map((f) => (
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
                  ))
                : (() => {
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary (Gauge + KPIs) */}
      <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8 mt-6">
        <h4 className="text-xl font-bold text-brand-dark mb-4">Summary</h4>

        {/* Gauge at TOP */}
        {gaugePosition === "top" && GaugeBlock}

        {/* KPIs side-by-side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-600 font-medium">ESG Composite Score</p>
            <p className="text-3xl font-bold text-indigo-800">
              {formatNumber(esgScore)}
            </p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
            <p className="text-sm text-teal-600 font-medium">AUM Covered</p>
            <p className="text-3xl font-bold text-teal-800">
              {formatNumber(aumCovered)}%
            </p>
          </div>
        </div>

        {/* Gauge at BOTTOM */}
        {gaugePosition === "bottom" && GaugeBlock}
      </div>
    </>
  );
}
