import type { Metadata } from 'next'
import { baseMetadata } from '@/lib/seo'
import Hero from '@/components/Hero'
import StatsGrid from '@/components/StatsGrid'
import Insights from '@/components/Insights'
import ContactForm from '@/components/ContactForm'


export const metadata: Metadata = baseMetadata({
title: 'IiAS Sustain — Governance & ESG for Indian Markets',
description: 'Evidence‑based ratings, stewardship advisory, and research.',
path: '/',
})


export default function Page(){
return (<>
<Hero />
<StatsGrid />
<Insights />
<ContactForm />
</>)
}