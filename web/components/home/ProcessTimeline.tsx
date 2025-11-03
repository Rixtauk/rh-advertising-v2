export function ProcessTimeline() {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Tool',
      description:
        'Select from Copy Generator, Landing Page Optimiser, or Asset Specs based on your campaign needs.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
          />
        </svg>
      ),
      gradient: 'from-[#667eea] to-[#764ba2]',
    },
    {
      number: '02',
      title: 'Input Your Requirements',
      description:
        'Provide campaign details, target audience, program information, and key messaging points. Our AI understands higher education context.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      gradient: 'from-[#f093fb] to-[#f5576c]',
    },
    {
      number: '03',
      title: 'Generate & Review',
      description:
        'Get compliance-first content in seconds. Review AI-generated copy, landing page recommendations, or creative specifications.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      gradient: 'from-[#4facfe] to-[#00f2fe]',
    },
    {
      number: '04',
      title: 'Refine & Export',
      description:
        'Iterate with variations, compare versions, and export campaign-ready content. Copy to clipboard or download for your workflow.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: 'from-[#667eea] to-[#764ba2]',
    },
  ];

  return (
    <section id="process-section" className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#f093fb] to-[#f5576c] bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From concept to campaign-ready content in four simple steps. Our streamlined workflow
            gets you compliant, effective advertising faster.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line - hidden on mobile, visible on desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#4facfe] opacity-20" />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Card */}
                <div className="relative h-full rounded-2xl p-[1px] overflow-hidden transition-all duration-300 hover:scale-105">
                  {/* Gradient border */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
                  />

                  {/* Card content */}
                  <div className="relative h-full rounded-2xl p-8 backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                    {/* Step number badge */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-background to-background/80 border-2 border-[var(--glass-border)] flex items-center justify-center backdrop-blur-sm">
                      <span
                        className={`text-2xl font-bold bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent`}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 text-white`}
                    >
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Connector arrow - only between steps on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-4 z-10">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center`}
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA after timeline */}
        <div className="mt-20 text-center">
          <div className="inline-block rounded-2xl p-[1px] bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#4facfe]">
            <div className="rounded-2xl px-8 py-6 backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <p className="text-lg text-muted-foreground mb-4">
                Ready to streamline your higher education advertising?
              </p>
              <a
                href="/copy"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:scale-105 transition-transform"
              >
                Get Started Free
                <svg
                  className="w-5 h-5"
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
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
