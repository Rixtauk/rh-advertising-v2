import { FullScreenHero } from '@/components/home/FullScreenHero';
import { IntroSection } from '@/components/home/IntroSection';
import { AlternatingSection } from '@/components/home/AlternatingSection';
import { ContactForm } from '@/components/home/ContactForm';

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Main content */}
      <main className="relative">
        {/* Full screen hero */}
        <FullScreenHero />

        {/* Intro Section */}
        <IntroSection />

        {/* Education Ad Copy Generator - Text Left, Image Right */}
        <AlternatingSection
          title="Education Ad Copy Generator"
          description="Create engaging, on-brand copy for digital and social campaigns in seconds. With smart limits, context-aware edits, and on-brand messaging."
          benefits={[
            'Generate compliant ad copy in seconds',
            '14+ advertising channels supported',
            'Built-in Title IV compliance checks',
            'Brand guidelines integration',
            'Multiple variations with A/B testing suggestions',
          ]}
          image="/ad-copy-generator.jpeg"
          imageAlt="Copy Generator Interface"
          ctaText="Start Generating Copy"
          ctaHref="/copy"
          badge="Most Popular"
          reverse={false}
        />

        {/* University Landing Page Optimiser - Text Right, Image Left */}
        <AlternatingSection
          title="University Landing Page Optimiser"
          description="Scan your page and see what's working. Plus quick fixes to boost engagement and conversions."
          benefits={[
            'AI-powered conversion analysis',
            'Actionable recommendations',
            'Higher education best practices',
            'Mobile and desktop insights',
            'Competitor benchmarking',
          ]}
          image="/univerity-landing-page-optimiser.jpeg"
          imageAlt="Landing Page Optimiser Dashboard"
          ctaText="Analyse Your Page"
          ctaHref="/optimise"
          reverse={true}
          backgroundColor="#f8f9fa"
        />

        {/* Creative Asset Spec Query Tool - Text Left, Image Right */}
        <AlternatingSection
          title="Creative Asset Spec Query Tool"
          description="Get instant specs for any channel, sizes, formats and requirements at your fingertips."
          benefits={[
            '14+ platform specifications',
            'Always up-to-date requirements',
            'Dimensions, file sizes, character limits',
            'Export to PDF or share with team',
            'Platform-specific best practices',
          ]}
          image="/asset-spec-query-tool.jpeg"
          imageAlt="Asset Specifications Interface"
          ctaText="View All Specs"
          ctaHref="/assets"
          badge="New"
          reverse={false}
        />

        {/* Education Insight Assistant - Text Right, Image Left */}
        <AlternatingSection
          title="Education Insight Assistant"
          description="Ask strategic questions and get instant answers. Powered by real data, market trends and student insight."
          benefits={[
            'Real-time market intelligence',
            'Student demographic insights',
            'Competitor analysis and benchmarking',
            'Trend forecasting and predictions',
            'Data-backed strategic recommendations',
          ]}
          image="/education-insight-assistant.jpeg"
          imageAlt="Education Insight Assistant Interface"
          ctaText="Try It Now"
          ctaHref="/insights"
          badge="New"
          reverse={true}
          backgroundColor="#f8f9fa"
        />

        {/* Contact Form section */}
        <ContactForm />
      </main>
    </div>
  );
}
