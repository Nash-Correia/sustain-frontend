import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function ProductHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex items-end justify-between">
        <h1 className="text-3xl font-semibold text-teal-900">Our Products</h1>
        <Link href={ROUTES.home} className="text-sm text-teal-800 hover:underline">Back to Home</Link>
      </header>

      <p className="mt-3 text-gray-600 max-w-2xl">Choose a product to learn about features, methodology alignment, and how it fits your governance or ESG workflow.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <ProductCard title="Product A" href={ROUTES.productA}>
          Brief value proposition for Product A. Ideal for research teams seeking deeper ESG signals.
        </ProductCard>
        <ProductCard title="Product B" href={ROUTES.productB}>
          Brief value proposition for Product B. Suited for stewardship and voting workflows.
        </ProductCard>
      </div>

      {/* Optional: comparison sneak peek */}
      <div className="mt-12 rounded-2xl border border-dashed border-gray-300 p-5 text-sm text-gray-500">
        A more detailed comparison is available on each product page.
      </div>
    </div>
  );
}

