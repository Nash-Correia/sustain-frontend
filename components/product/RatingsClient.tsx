"use client";
import { useMemo, useState } from "react";
import RatingTable, { RatingRow } from "@/components/product/RatingTable";
import RequestReportModal from "@/components/product/RequestReportModal";

const COMPANY_OPTIONS = [
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

export default function RatingsClient({ initial, loggedIn = false }: { initial: RatingRow[]; loggedIn?: boolean }) {
  const [page, setPage] = useState(1);
  const [company, setCompany] = useState<string>("All Companies");
  const [year, setYear] = useState<number>(2024);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCompany, setModalCompany] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const byCompany = company === "All Companies" ? initial : initial.filter((r) => r.company === company);
    return byCompany.filter((r) => r.year === year);
  }, [initial, company, year]);

  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const view = filtered.slice(start, start + pageSize);

  return (
    <>
      <RatingTable
        rows={view}
        page={page}
        pages={pages}
        onPage={setPage}
        filterCompany={company}
        onFilterCompany={setCompany}
        companyOptions={["All Companies", ...COMPANY_OPTIONS]}
        filterYear={year}
        onFilterYear={setYear}
        yearOptions={[2024, 2023]}
        onRequest={(company) => { setModalCompany(company); setModalOpen(true); }}
      />

      <RequestReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultCompany={modalCompany}
        year={year}
        loggedIn={loggedIn}
        companyOptions={COMPANY_OPTIONS}
      />
    </>
  );
}
