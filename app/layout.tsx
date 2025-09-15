import './globals.css'
import { inter } from './fonts'
import Header from '@/components/nav/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'


export const metadata: Metadata = {
title: 'IiAS Sustain',
description: 'Evidence-based Governance & ESG',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en" className={inter.className}>
<body className="min-h-screen flex flex-col bg-white text-gray-900">
<Header />
<main id="main" className="flex-1 pt-16" role="main">{children}</main>
<Footer />
</body>
</html>
)
}