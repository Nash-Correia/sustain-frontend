export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-brand-surface rounded-large p-8 sm:p-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-brand-dark">
          India’s Leading ESG & Proxy Advisory Firm
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          IiAS is an advisory firm that provides capital markets with independent opinions, data, and analysis on governance and ESG, including voting recommendations and ESG ratings
        </p>
<div className="mt-10 flex justify-center flex-wrap gap-4">
          <a
            href="/product"
            className="rounded-md bg-login-btn px-6 py-3 text-white text-lg font-semibold shadow-sm hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light"
          >
            Explore our Products
          </a>
          <a
            href="/about"
            className="rounded-md border border-gray-400 bg-white px-6 py-3 text-gray-800 text-lg font-semibold shadow-sm hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}