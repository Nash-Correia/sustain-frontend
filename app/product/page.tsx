import type { Metadata } from 'next'
import { baseMetadata } from '@/lib/seo'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export const metadata: Metadata = baseMetadata({
  title: 'Products — IiAS Sustain',
  description: 'Explore our ESG research and stewardship products.',
  path: '/product',
})

// Enhanced icon with subtle background elements.
const ComparisonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-24 w-24 text-teal-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Background Elements */}
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.05" />
    <path d="M20 12a8 8 0 0 1-8 8" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    
    {/* Main Icon */}
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);


// Enhanced icon with a subtle background grid.
const ReportIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 text-teal-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* Background Elements */}
        <path d="M4 8h16M8 4v16" stroke="currentColor" opacity="0.07" strokeWidth="1" />
        
        {/* Main Icon */}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);


export default function ProductHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex items-end justify-between">
        <h1 className="text-3xl font-semibold text-brand-800">Our Products</h1>
        <Link href={ROUTES.home} className="text-sm text-brand-700 hover:underline">Back to Home</Link>
      </header>
      <p className="mt-3 text-gray-600 max-w-2xl">Choose a product to learn about features, methodology alignment, and workflows.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <ProductCard
          title="ESG Rating Comparison"
          href={ROUTES.productA}
          icon={<ComparisonIcon />}
        >
          An interactive tool to compare the Environmental, Social, and Governance (ESG) performance of companies, mutual funds, and sectors. Build custom lists for detailed, side-by-side analysis.
        </ProductCard>
        <ProductCard
          title="Company ESG Ratings"
          href={ROUTES.productB}
          icon={<ReportIcon />}
        >
          Access our comprehensive ESG ratings for Indian companies. Filter and sort by company, sector, or rating to gain insights into corporate sustainability and download reports.
        </ProductCard>
      </div>
    </div>
  )
}