import MethodologyDiagram from './MethodologyDiagram'; // We'll keep using the diagram component

export default function MethodologyHero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Changed from a grid to a flex column layout */}
      <div className="flex flex-col items-center text-center gap-8">
        
        {/* Text content now at the top */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-semibold text-teal-900">Our Methodology</h1>
          <p className="mt-3 text-gray-600 text-lg">
            Transparent, evidence‑based scoring aligned to governance and ESG materiality for Indian markets.
          </p>
        </div>
        
        {/* Diagram is now below the text */}
        <div className="w-full max-w-5xl">
          <MethodologyDiagram />
        </div>

      </div>
    </section>
  );
}