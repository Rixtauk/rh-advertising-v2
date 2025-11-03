export function TrustSection() {
  const testimonials = [
    {
      quote:
        "This platform has transformed how we create advertising campaigns. What used to take days now takes hours, and we're confident every piece of copy is compliant.",
      author: 'Sarah Mitchell',
      role: 'Director of Marketing',
      institution: 'State University',
      gradient: 'from-[#667eea] to-[#764ba2]',
    },
    {
      quote:
        "The asset specs tool alone has saved us countless hours. Having all the technical requirements for every platform in one place is invaluable.",
      author: 'Michael Chen',
      role: 'Digital Marketing Manager',
      institution: 'Private College',
      gradient: 'from-[#f093fb] to-[#f5576c]',
    },
    {
      quote:
        "The landing page optimiser gave us actionable insights we could implement immediately. Our conversion rates improved by 35% in the first month.",
      author: 'Jessica Rodriguez',
      role: 'VP of Enrollment Marketing',
      institution: 'Regional University',
      gradient: 'from-[#4facfe] to-[#00f2fe]',
    },
  ];

  const partners = [
    { name: 'Higher Ed Partner 1', width: '140px' },
    { name: 'Higher Ed Partner 2', width: '120px' },
    { name: 'Higher Ed Partner 3', width: '160px' },
    { name: 'Higher Ed Partner 4', width: '130px' },
    { name: 'Higher Ed Partner 5', width: '150px' },
  ];

  return (
    <section className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#667eea] to-[#00f2fe] bg-clip-text text-transparent">
              Loved by Marketing Teams
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what higher education marketing professionals are saying about our platform.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-full rounded-2xl p-[1px] overflow-hidden transition-all duration-300 hover:scale-105">
                {/* Gradient border */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-40 group-hover:opacity-70 transition-opacity`}
                />

                {/* Card content */}
                <div className="relative h-full rounded-2xl p-8 backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col">
                  {/* Quote icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center mb-6`}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Quote */}
                  <p className="text-foreground leading-relaxed mb-6 flex-grow">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="border-t border-[var(--glass-border)] pt-6">
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div
                      className={`text-sm font-medium bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}
                    >
                      {testimonial.institution}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partner logos section */}
        <div className="relative">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Trusted by Leading Institutions
            </p>
          </div>

          {/* Partner logos container */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#4facfe] opacity-60">
            <div className="rounded-2xl px-12 py-10 backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <div className="flex flex-wrap justify-center items-center gap-12">
                {partners.map((partner, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    style={{ width: partner.width }}
                  >
                    {/* Placeholder for partner logos */}
                    <div className="w-full h-12 rounded-lg backdrop-blur-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        {partner.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-foreground">Title IV Compliant</span>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-foreground">SOC 2 Certified</span>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <span className="text-sm font-medium text-foreground">FERPA Compliant</span>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm font-medium text-foreground">99.9% Uptime SLA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
