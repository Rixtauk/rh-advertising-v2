import { FullScreenHero } from '@/components/home/FullScreenHero';
import { AlternatingSection } from '@/components/home/AlternatingSection';
import { FeaturesBento } from '@/components/home/FeaturesBento';

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Main content */}
      <main className="relative">
        {/* Full screen hero */}
        <FullScreenHero />

        {/* Education Ad Copy Generator - Text Left, Image Right */}
        <AlternatingSection
          title="Education Ad Copy Generator"
          description="Build great ad copy in seconds. Generate, test, and refine variations for 14+ channels—all designed for education."
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
          description="Get a quality score and actionable insights for any landing page. Built to analyse and optimise for university recruitment."
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
          backgroundColor="bg-gray-50"
        />

        {/* Creative Asset Spec Query Tool - Text Left, Image Right */}
        <AlternatingSection
          title="Creative Asset Spec Query Tool"
          description="Ask for image sizes, character limits, or technical specs for any channel. Get instant, reliable answers."
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
          ctaText="Coming Soon"
          disabled={true}
          badge="Coming Soon"
          reverse={true}
          backgroundColor="bg-gray-50"
        />

        {/* Features/Benefits section */}
        <FeaturesBento />
      </main>
    </div>
  );
}
