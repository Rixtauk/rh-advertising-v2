'use client';

import Link from 'next/link';
import { FloatingOrbs } from './FloatingOrbs';

export function FinalCTA() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background orbs */}
      <FloatingOrbs />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main CTA container */}
        <div className="relative rounded-3xl p-[2px] overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#4facfe] animate-gradient" />

          {/* Glass content */}
          <div className="relative rounded-3xl p-12 md:p-16 backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-medium mb-8 animate-fade-in">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Start Creating Today
              </div>

              {/* Headline */}
              <h2
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in"
                style={{ animationDelay: '0.1s' }}
              >
                <span className="bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-clip-text text-transparent">
                  Ready to Transform
                </span>
                <br />
                <span className="text-foreground">Your Marketing Workflow?</span>
              </h2>

              {/* Description */}
              <p
                className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in"
                style={{ animationDelay: '0.2s' }}
              >
                Join hundreds of higher education marketing teams creating compliant, effective
                campaigns faster than ever before.
              </p>

              {/* CTA buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                <Link
                  href="/copy"
                  className="group relative px-10 py-5 rounded-full font-semibold text-lg text-white overflow-hidden transition-transform hover:scale-105"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#667eea] to-[#764ba2]" />

                  {/* Animated shine effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <span className="relative flex items-center gap-2">
                    Get Started Free
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

                <button
                  onClick={() => {
                    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-10 py-5 rounded-full font-semibold text-lg backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg)]/80 transition-all hover:scale-105"
                >
                  View All Tools
                </button>
              </div>

              {/* Feature highlights */}
              <div
                className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Start in under 2 minutes
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cancel anytime
                </div>
              </div>

              {/* Social proof */}
              <div
                className="mt-12 pt-12 border-t border-[var(--glass-border)] animate-fade-in"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="flex flex-wrap justify-center items-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                      500+
                    </div>
                    <div className="text-sm text-muted-foreground">Universities</div>
                  </div>
                  <div className="h-12 w-px bg-[var(--glass-border)]" />
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[#f093fb] to-[#f5576c] bg-clip-text text-transparent">
                      10K+
                    </div>
                    <div className="text-sm text-muted-foreground">Campaigns Created</div>
                  </div>
                  <div className="h-12 w-px bg-[var(--glass-border)]" />
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
                      4.9/5
                    </div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
