export function IntroSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-100 rounded-xl p-10 md:p-14 shadow-sm transition-all duration-300 hover:shadow-md">
          {/* Opening lines - larger, bolder, more impactful */}
          <div className="space-y-2 mb-8 pb-8 border-b border-gray-100">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              We know that marketing a University, College or School is a complex job.
            </p>
            <p className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed">
              Rules change. Channels evolve. Budgets shrink. Expectations grow.
            </p>
          </div>

          {/* Main description - improved hierarchy and spacing */}
          <div className="space-y-6 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              At RH, we've designed a set of <span className="font-semibold text-gray-900">intelligent, easy-to-use tools</span> made just for education marketing teams. These include an <span className="font-semibold text-[#55A2C3]">Education Ad Copy Generator</span> that helps you craft strong, relevant messaging for various digital & social platforms. And a <span className="font-semibold text-[#55A2C3]">Landing Page Optimiser</span> that fine-tunes your pages for higher conversion rates.
            </p>

            {/* Subtle divider */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-[#55A2C3] to-transparent"></div>

            {/* Insight Assistant description - highlighted */}
            <p className="text-lg text-gray-700 leading-relaxed">
              At the heart of the suite is our <span className="font-bold text-[#55A2C3]">Education Insight Assistant</span>. Ask any strategic question and get instant, data-backed answers on trends, targeting, messaging. It's like having an education marketing strategist available on demand, ready to support your team's decision-making in real time.
            </p>
          </div>

          {/* Closing lines - emphasized with visual separation */}
          <div className="space-y-4 pt-8 border-t border-gray-100">
            <p className="text-base text-gray-600 leading-relaxed">
              Behind every tool is our deep understanding of the education marketing landscape and the unique needs of Universities, from years of working within this sector.
            </p>
            <div className="pt-2">
              <p className="text-xl font-bold text-[#55A2C3] tracking-tight">
                Bespoke tools, exclusively for RH Clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
