export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-brand-surface rounded-large p-8 sm:p-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-brand-dark">
          India’s Leading Corporate Governance & Proxy Advisory Firm
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          Providing independent opinions, research, and data on corporate governance issues to help investors make value-creating decisions and translate them into portfolio performance.
        </p>
        <div className="mt-10 flex justify-center flex-wrap gap-4">
          <a
            href="#"
            className="rounded-md bg-brand-green-light px-6 py-3 text-white text-lg font-semibold shadow-sm hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light"
          >
            Explore our Products
          </a>
          <a
            href="#"
            className="rounded-md border border-gray-400 bg-white px-6 py-3 text-gray-800 text-lg font-semibold shadow-sm hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}