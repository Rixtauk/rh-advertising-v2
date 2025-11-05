import Link from 'next/link';

export function ToolsSection() {
  const tools = [
    {
      title: 'Education Ad Copy Generator',
      description:
        'Generate compliant ad copy for 14+ advertising platforms using AI trained specifically for higher education marketing. Create headlines, descriptions, and calls-to-action that follow Title IV regulations and your institutional brand guidelines.',
      href: '/copy',
      badge: 'Most Popular',
      gradient: 'from-[#55A2C3] to-[#8B5CF6]',
    },
    {
      title: 'University Landing Page Optimiser',
      description:
        'Get actionable insights and recommendations to improve your landing page conversion rates. Analyse page structure, messaging, CTAs, and user experience elements with AI-powered suggestions tailored for higher education audiences.',
      href: '/optimise',
      badge: null,
      gradient: 'from-[#8B5CF6] to-[#EC4899]',
    },
    {
      title: 'Creative Asset Spec Query Tool',
      description:
        'Access creative specifications for all major advertising platforms in one place. Get exact dimensions, file sizes, character limits, and best practices for Google, Meta, LinkedIn, TikTok, Snapchat, YouTube, and more.',
      href: '/assets',
      badge: 'New',
      gradient: 'from-[#EC4899] to-[#55A2C3]',
    },
    {
      title: 'Education Insight Assistant',
      description:
        'Ask strategic questions and get instant answers powered by real data, market trends and student insight. Your AI-powered research assistant for education marketing strategy and decision-making.',
      href: '#',
      badge: 'Coming Soon',
      gradient: 'from-[#55A2C3] to-[#EC4899]',
    },
  ];

  return (
    <section id="tools-section" className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#55A2C3] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              Powerful Tools for Every Campaign
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, optimise, and launch compliant advertising campaigns for
            higher education institutions.
          </p>
        </div>

        {/* Tools list */}
        <div className="space-y-6">
          {tools.map((tool, index) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group block relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-gradient-to-b ${tool.gradient}
                  opacity-60 group-hover:opacity-100 group-hover:w-1.5 transition-all duration-300`}
              />

              {/* Content card */}
              <div
                className="relative pl-8 pr-6 py-8 rounded-lg backdrop-blur-md bg-[var(--glass-bg)]
                border border-[var(--glass-border)] hover:border-opacity-80 transition-all duration-300
                hover:shadow-lg hover:shadow-[var(--glass-border)]"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-2xl font-bold text-foreground group-hover:bg-gradient-to-r group-hover:from-[#55A2C3] group-hover:to-[#8B5CF6] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {tool.title}
                  </h3>
                  {tool.badge && (
                    <span
                      className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full
                        backdrop-blur-sm bg-gradient-to-r ${tool.gradient} text-white opacity-90`}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
