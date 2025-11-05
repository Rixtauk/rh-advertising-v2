'use client';

import Link from 'next/link';
import Image from 'next/image';

export function FullScreenHero() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Next.js Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
          alt="University campus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in"
        >
          Smarter marketing for education. Powered by AI.
        </h1>

        {/* Subheading */}
        <div
          className="text-lg md:text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed space-y-4 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <p>
            We know that marketing a university, college or school is a complex job. Rules change. Channels evolve. Budgets shrink. Expectations grow. You need speed, accuracy, and creativity—all at once.
          </p>
          <p>
            We've designed a set of intelligent, easy-to-use tools that help you generate high-performing copy, audit landing pages, and access channel specs in seconds—not hours.
          </p>
          <p>
            At the heart of the suite is our Education Insight Assistant. Ask any strategic question and get instant, data-backed answers on trends, targeting, messaging, and more.
          </p>
          <p>
            Behind every tool is our deep understanding of the education marketing landscape and the unique needs of recruiters. We built this for you.
          </p>
        </div>

        {/* CTA Button */}
        <div
          className="flex justify-center mb-16 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <Link
            href="/copy"
            className="group relative px-8 py-4 rounded-full font-semibold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: '#55A2C3' }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <span className="relative flex items-center gap-2 text-lg">
              Start Creating
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div
          className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/80 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Compliance-First</span>
          </div>

          <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-medium">Trusted by Universities</span>
          </div>

          <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <svg
              className="w-5 h-5 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 7H7v6h6V7z" />
              <path
                fillRule="evenodd"
                d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">AI-Powered</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer group"
        aria-label="Scroll to content"
      >
        <div className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors">
          <span className="text-sm font-medium hidden sm:block">Scroll to explore</span>
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </button>
    </section>
  );
}
