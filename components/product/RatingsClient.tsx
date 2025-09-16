"use client";

import { useMemo, useState } from "react";
import RatingTable, { RatingRow } from "./RatingTable";

// Dummy company filter options (plus "All")
const COMPANY_OPTIONS = [
  "All Companies",
  "Chennai Petroleum Corporation Limited",
  "Colgate Palmolive (India) Limited",
  "Dr. Reddy's Laboratories Limited",
  "Infosys Limited",
  "Jio Financial Services Limited",
  "Lloyds Metals And Energy Limited",
  "Pidilite Industries Limited",
  "Railtel Corporation Of India Limited",
  "Sun TV Network Limited",
  "ZF Commercial Vehicle Control Systems India Limited",
];

export default function RatingsClient({ initial }: { initial: RatingRow[] }) {
  const [page, setPage] = useState(1);
  const [company, setCompany] = useState<string>("All Companies");
  const [year, setYear] = useState<number>(2024);

  // Filter first, then paginate
  const filtered = useMemo(() => {
    const byCompany =
      company === "All Companies"
        ? initial
        : initial.filter((r) => r.company === company);
    const byYear = byCompany.filter((r) => r.year === year);
    return byYear;
  }, [initial, company, year]);

  // Reset to page 1 when filters change
  const [lastKey, setLastKey] = useState<string>("");
  const key = `${company}-${year}`;
  if (key !== lastKey) {
    setLastKey(key);
    if (page !== 1) setPage(1);
  }

  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const view = filtered.slice(start, start + pageSize);

  return (
    <RatingTable
      rows={view}
      page={page}
      pages={pages}
      onPage={setPage}
      // pass filter state & handlers to header dropdowns
      filterCompany={company}
      onFilterCompany={setCompany}
      companyOptions={COMPANY_OPTIONS}
      filterYear={year}
      onFilterYear={setYear}
      yearOptions={[2024, 2023]}
    />
  );
}
