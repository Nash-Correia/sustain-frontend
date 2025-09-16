import ProductHero from "@/components/product/ProductHero";
import RatingsClient from "@/components/product/RatingsClient";
import { RatingRow } from "@/components/product/RatingTable";

export default function ProductBPage() {
  const data: RatingRow[] = [
    { company: "Chennai Petroleum Corporation Limited", sector: "Oil, Gas & Consumable Fuels", rating: "C+", year: 2024, reportUrl: "#" },
    { company: "Colgate Palmolive (India) Limited", sector: "Fast Moving Consumer Goods", rating: "A+", year: 2024, reportUrl: "#" },
    { company: "Dr. Reddy's Laboratories Limited", sector: "Healthcare", rating: "A+", year: 2024, reportUrl: "#" },
    { company: "Infosys Limited", sector: "Information Technology", rating: "A+", year: 2024, reportUrl: "#" },
    { company: "Jio Financial Services Limited", sector: "Financial Services", rating: "B", year: 2024, reportUrl: "#" },
    { company: "Lloyds Metals And Energy Limited", sector: "Metals & Mining", rating: "C", year: 2024, reportUrl: "#" },
    { company: "Pidilite Industries Limited", sector: "Chemicals", rating: "B+", year: 2024, reportUrl: "#" },
    { company: "Railtel Corporation Of India Limited", sector: "Telecommunication", rating: "D", year: 2024, reportUrl: "#" },
    { company: "Sun TV Network Limited", sector: "Media, Entertainment & Publication", rating: "C+", year: 2024, reportUrl: "#" },
    { company: "ZF Commercial Vehicle Control Systems India Limited", sector: "Automobile and Auto Components", rating: "A", year: 2024, reportUrl: "#" },
    // (Optionally add some 2023 rows to see the year filter working)
    // { company: "Infosys Limited", sector: "Information Technology", rating: "A", year: 2023, reportUrl: "#" },
  ];

  return (
    <>
      <ProductHero heading="Product B" sub="Stewardship and voting workflows with governance insights." />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <RatingsClient initial={data} />
      </section>
    </>
  );
}
