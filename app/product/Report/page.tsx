// app/product-b/page.tsx (or wherever your route lives)
"use client";

import { useEffect, useState } from "react";
import ProductHero from "@/components/product/ProductHero";
import RatingsClient from "@/components/product/RatingsClient";
import { RatingRow } from "@/components/product/RatingTable";
import { getCompanyData } from "@/lib/excel-data";

export default function ProductBPage() {
  const [rows, setRows] = useState<RatingRow[]>([]);

  useEffect(() => {
    (async () => {
      const companies = await getCompanyData();

      // Map real Excel data → 2024 rows
      const mapped2024: RatingRow[] = companies
        .filter((c) => !!c.companyName && !!c.grade) // ensure essential fields
        .map((c) => ({
          company: c.companyName,
          sector: c.sector || "—",
          rating: c.grade, // from Excel 'ESG Rating'
          year: 2024,
          reportUrl: "#", // TODO: wire to your report route if available
        }));

      // De-duplicate by company+year (in case Excel has dupes)
      const seen = new Set<string>();
      const deduped2024 = mapped2024.filter((r) => {
        const key = `${r.company}|${r.year}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Ensure ONE 2023 sample row for demo (prefer Infosys if present)
      const preferred =
        deduped2024.find(
          (r) => r.company.toLowerCase() === "infosys limited"
        ) || deduped2024[0];

      const rowsWith2023 =
        preferred != null
          ? [...deduped2024, { ...preferred, year: 2023 }]
          : deduped2024;

      setRows(rowsWith2023);
    })();
  }, []);

  return (
    <>
      {/* keeping your original heading/sub copy */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <RatingsClient initial={rows} />
      </section>
    </>
  );
}
