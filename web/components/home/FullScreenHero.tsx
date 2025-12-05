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
        {/* Enhanced Gradient Overlay - Darker at bottom for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/75" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline - No glass card, just pure typography */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight mb-12 sm:mb-16 animate-fade-in"
        >
          Smarter Marketing for Education.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#55A2C3] to-blue-300">
            Powered by AI.
          </span>
        </h1>

        {/* Trust Indicators - Refined styling with better spacing */}
        <div
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center gap-2 sm:gap-2.5 backdrop-blur-md bg-white/5 border border-white/10 px-3 py-2 sm:px-5 sm:py-3 rounded-full hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 ease-out group">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 group-hover:rotate-12 transition-transform duration-300"
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
            <span className="font-semibold text-white/90 text-xs sm:text-sm md:text-base">Insight Driven</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 backdrop-blur-md bg-white/5 border border-white/10 px-3 py-2 sm:px-5 sm:py-3 rounded-full hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 ease-out group">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-semibold text-white/90 text-xs sm:text-sm md:text-base">Trusted by Universities</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 backdrop-blur-md bg-white/5 border border-white/10 px-3 py-2 sm:px-5 sm:py-3 rounded-full hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 ease-out group">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:rotate-180 transition-transform duration-500"
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
            <span className="font-semibold text-white/90 text-xs sm:text-sm md:text-base">AI-Powered</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Smoother animation and refined styling */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 cursor-pointer group"
        aria-label="Scroll to content"
      >
        <div className="flex flex-col items-center gap-3 text-white/60 hover:text-white transition-all duration-500">
          <span className="text-sm font-semibold tracking-wide hidden sm:block group-hover:translate-y-0.5 transition-transform duration-300">
            Scroll to explore
          </span>
          <div className="relative">
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-[#55A2C3] animate-ping-slow" />
            <svg
              className="w-8 h-8 group-hover:translate-y-1 transition-all duration-300 relative z-10 animate-float"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </button>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.15);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
