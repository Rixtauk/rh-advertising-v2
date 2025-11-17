export function IntroSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 shadow-lg transition-all duration-300 hover:shadow-xl space-y-6 text-gray-800 text-lg leading-relaxed">
          {/* Opening lines */}
          <div className="space-y-1">
            <p>We know that marketing a University, College or School is a complex job.</p>
            <p>Rules change. Channels evolve. Budgets shrink. Expectations grow.</p>
          </div>

          {/* Main description */}
          <p>
            At RH, we've designed a set of intelligent, easy-to-use tools made just for education marketing teams. These include an Education Ad Copy Generator that helps you craft strong, relevant messaging for various digital & social platforms. And a Landing Page Optimiser that fine-tunes your pages for higher conversion rates.
          </p>

          {/* Insight Assistant description */}
          <p>
            At the heart of the suite is our Education Insight Assistant. Ask any strategic question and get instant, data-backed answers on trends, targeting, messaging. It's like having an education marketing strategist available on demand, ready to support your team's decision-making in real time.
          </p>

          {/* Closing lines */}
          <div className="space-y-1">
            <p>
              Behind every tool is our deep understanding of the education marketing landscape and the unique needs of Universities, from years of working within this sector.
            </p>
            <p className="font-semibold">Bespoke tools, exclusively for RH Clients.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
