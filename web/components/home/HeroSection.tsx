'use client';

import Link from 'next/link';
import { FloatingOrbs } from './FloatingOrbs';

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated background orbs */}
      <FloatingOrbs />

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Main glass container */}
        <div className="backdrop-blur-md bg-[var(--glass-bg)] rounded-3xl p-12 md:p-16 border border-[var(--glass-border)] shadow-[var(--glass-shadow)] animate-scale-in">
          {/* Hero background image */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{ zIndex: -1 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920)',
                opacity: 0.15
              }}
            />
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="animate-fade-in" style={{ color: '#55A2C3' }}>
              Intelligent Advertising
            </span>
            <br />
            <span className="text-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              for Higher Education
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Generate compliant ad copy, optimise landing pages, and access creative specifications
            for 14+ advertising channels—all in one platform designed for higher education marketing
            teams.
          </p>

          {/* CTA button */}
          <div
            className="flex justify-center animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            <Link
              href="/copy"
              className="group relative px-8 py-4 rounded-full font-semibold text-white overflow-hidden transition-transform hover:scale-105"
            >
              {/* Accent background */}
              <div className="absolute inset-0" style={{ backgroundColor: '#55A2C3' }} />

              {/* Animated shine effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <span className="relative flex items-center gap-2">
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

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Compliance-First
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Trusted by Universities
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI-Powered by GPT-4
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
