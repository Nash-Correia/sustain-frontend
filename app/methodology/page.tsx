import MethodologyHero from "@/components/methodology/MethodologyHero";
import { PillarCard } from "@/components/methodology/PillarCard";
import WeightingTable from "@/components/methodology/WeightingTable";
import ScorecardOverview from "@/components/methodology/ScorecardOverview";
import ProcessSteps from "@/components/methodology/ProcessSteps";
import FAQ from "@/components/methodology/FAQ";
import GlossaryList from "@/components/methodology/GlossaryList";

export default function MethodologyPage() {
  const pillars = [
    { title: "Governance", desc: "Board, ownership, oversight, shareholder rights.", items: ["Board composition", "Independence & committees", "Disclosures"] },
    { title: "Environmental", desc: "Emissions, resource use, risk management.", items: ["GHG and energy", "Water & waste", "Targets & plans"] },
    { title: "Social", desc: "Workforce, community, product responsibility.", items: ["Health & safety", "Diversity & inclusion", "Supply chain"] },
  ];

  return (
    <>
      <MethodologyHero />

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold text-teal-900">Pillars</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <PillarCard key={p.title} title={p.title} desc={p.desc} items={p.items} />
          ))}
        </div>
      </section>

      {/* Weights */}
      <WeightingTable rows={[
        { pillar: "Governance", weight: "40%", notes: "Governance tilt" },
        { pillar: "Environmental", weight: "30%" },
        { pillar: "Social", weight: "30%" },
      ]} />

      {/* Scorecard */}
      <ScorecardOverview />

      {/* Process */}
      <ProcessSteps />

      {/* FAQ & Glossary */}
      <FAQ />
      <GlossaryList />

      {/* Resources */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl border border-gray-200 p-5">
          <h2 className="text-xl font-semibold text-teal-900">Methodology Resources</h2>
          <p className="mt-1 text-sm text-gray-600">Download a summary or request the full guide.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="#" className="rounded-2xl border border-teal-800 px-4 py-2 text-teal-800 text-sm">Download Summary (PDF)</a>
            {/* BACKEND PREP: Replace with real URL later */}
            {/* <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/methodology-summary.pdf`} className="rounded-2xl border border-teal-800 px-4 py-2 text-teal-800 text-sm">Download Summary (PDF)</a> */}
            <a href="#contact" className="rounded-2xl bg-teal-800 px-4 py-2 text-white text-sm">Request Full Guide</a>
          </div>
        </div>
      </section>
    </>
  );
}
