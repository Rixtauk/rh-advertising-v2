'use client';

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
          src="/university-hero.jpeg"
          alt="University campus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Text Content with Semi-transparent Background */}
        <div className="backdrop-blur-sm bg-gray-900/30 rounded-2xl px-6 py-8 md:px-12 md:py-10">
          {/* Main Headline */}
          <h1
            className="text-5xl md:text-7xl font-bold text-white leading-tight animate-fade-in"
          >
            Smarter Marketing for Education.
            <br />
            Powered by AI.
          </h1>
        </div>

        {/* Trust Indicators */}
        <div
          className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/80 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span className="font-medium">Insight Driven</span>
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
