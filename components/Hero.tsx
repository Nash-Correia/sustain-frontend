export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight text-teal-900">
            Evidence‑based Governance & ESG for Indian Markets
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Ratings, stewardship advisory, and research designed to improve long‑term value creation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#contact" className="rounded-2xl bg-teal-800 px-5 py-3 text-white text-sm font-medium hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600">Talk to us</a>
            <a href="#insights" className="rounded-2xl border border-teal-800 px-5 py-3 text-teal-800 text-sm font-medium hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600">Explore insights</a>
          </div>
        </div>
        <div className="rounded-3xl border border-gray-200 p-6">
          <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 grid place-items-center">
            <span className="text-sm text-teal-900/70">Hero Illustration / KPI panel</span>
          </div>
        </div>
      </div>
    </section>
  );
}

