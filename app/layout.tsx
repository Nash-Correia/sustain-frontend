import './globals.css';
import { inter } from './fonts';
import Header from '@/components/nav/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import BackToTopButton from '@/components/ui/BackToTopButton'; // <-- 1. Import the new component

export const metadata: Metadata = {
  title: 'IiAS Sustain',
  description: 'Evidence-based Governance & ESG',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head />
      <body className="flex min-h-screen flex-col bg-white text-gray-900">
        <Header />
        <main id="main" role="main" className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <BackToTopButton /> {/* <-- 2. Add the component here */}
      </body>
    </html>
  );
}