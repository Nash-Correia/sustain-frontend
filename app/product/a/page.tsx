import ProductHero from "@/components/product/ProductHero";
import { FeatureItem } from "@/components/product/FeatureItem";
import ComparisonTable from "@/components/product/ComparisonTable";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export default function ProductAPage() {
  return (
    <>
      <ProductHero heading="Product A" sub="Deep ESG analytics designed for research and portfolio teams." />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold text-teal-900">Key Features</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureItem title="Coverage" desc=">500 Indian companies with sector mapping" />
          <FeatureItem title="Signals" desc="Material ESG indicators with governance tilt" />
          <FeatureItem title="Exports" desc="CSV/JSON exports for downstream tooling" />
        </div>
      </section>

      <ComparisonTable rows={[
        { feature: "Coverage", a: ">500 companies", b: "" },
        { feature: "Primary use", a: "Research & screening", b: "" },
        { feature: "Delivery", a: "Web + API (planned)", b: "" },
      ]} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-teal-900">Next steps</h3>
          <p className="mt-1 text-sm text-gray-600">Contact us to see Product A in action or to request a sample extract.</p>
          <div className="mt-3 flex gap-3">
            <a href="/\#contact" className="rounded-2xl bg-teal-800 px-4 py-2 text-white text-sm">Contact</a>
            <Link href={ROUTES.product} className="text-sm text-teal-800 hover:underline">Back to Products</Link>
          </div>
        </div>
      </section>
    </>
  );
}