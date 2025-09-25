// app/layout.tsx
import "./globals.css";
import { inter } from "./fonts";
import Header from "@/components/nav/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import BackToTopButton from "@/components/ui/BackToTopButton";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "IiAS Sustain",
  description: "Evidence-based Governance & ESG",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white text-gray-900">
        {/* ✅ AuthProvider (inside Providers) now wraps Header, Main, Footer */}
        <Providers>
          <Header />
          <main id="main" role="main" className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <BackToTopButton />
        </Providers>
      </body>
    </html>
  );
}
