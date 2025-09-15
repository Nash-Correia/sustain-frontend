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


export default function ProductHubPage(){
return (
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
<header className="flex items-end justify-between">
<h1 className="text-3xl font-semibold text-brand-800">Our Products</h1>
<Link href={ROUTES.home} className="text-sm text-brand-700 hover:underline">Back to Home</Link>
</header>
<p className="mt-3 text-gray-600 max-w-2xl">Choose a product to learn about features, methodology alignment, and workflows.</p>
<div className="mt-8 grid gap-6 sm:grid-cols-2">
<ProductCard title="Product A" href={ROUTES.productA}>Brief value proposition for Product A.</ProductCard>
<ProductCard title="Product B" href={ROUTES.productB}>Brief value proposition for Product B.</ProductCard>
</div>
</div>
)
}