export function StatsSection() {
  const accentColor = '#55A2C3';

  const stats = [
    {
      number: '14+',
      label: 'Advertising Channels',
      description: 'Comprehensive specs for all major platforms',
    },
    {
      number: '500+',
      label: 'Universities',
      description: 'Trusted by marketing teams nationwide',
    },
    {
      number: '10K+',
      label: 'Ad Copies Generated',
      description: 'Compliant, effective messaging at scale',
    },
    {
      number: '80%',
      label: 'Time Saved',
      description: 'Average reduction in campaign creation time',
    },
  ];

  return (
    <section className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span style={{ color: accentColor }}>
              Trusted by Education Marketers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join hundreds of higher education institutions using our platform to create compliant,
            high-performing advertising campaigns.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-full rounded-2xl p-[1px] overflow-hidden transition-all duration-300 hover:scale-105">
                {/* Accent border */}
                <div
                  className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: accentColor }}
                />

                {/* Card content */}
                <div className="relative h-full rounded-2xl p-8 backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)] text-center">
                  {/* Number */}
                  <div
                    className="text-5xl md:text-6xl font-bold mb-4"
                    style={{ color: accentColor }}
                  >
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-xl font-semibold mb-3 text-foreground">{stat.label}</div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional trust indicator */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-6 rounded-2xl backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">SOC 2 Type II Certified</div>
                <div className="text-xs text-muted-foreground">Enterprise-grade security</div>
              </div>
            </div>

            <div className="h-12 w-px bg-[var(--glass-border)]" />

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">FERPA Compliant</div>
                <div className="text-xs text-muted-foreground">Student data protection</div>
              </div>
            </div>

            <div className="h-12 w-px bg-[var(--glass-border)]" />

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">99.9% Uptime</div>
                <div className="text-xs text-muted-foreground">Always available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
