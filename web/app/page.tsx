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

        {/* Copy Generator - Text Left, Image Right */}
        <AlternatingSection
          title="AI-Powered Copy Generator"
          description="Generate compliant ad copy for 14+ advertising platforms in seconds. Our AI is specifically trained on higher education marketing best practices and regulatory requirements."
          benefits={[
            'Generate compliant ad copy in seconds',
            '14+ advertising channels supported',
            'Built-in Title IV compliance checks',
            'Brand guidelines integration',
            'Multiple variations with A/B testing suggestions',
          ]}
          image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
          imageAlt="Copy Generator Interface"
          ctaText="Start Generating Copy"
          ctaHref="/copy"
          badge="Most Popular"
          reverse={false}
        />

        {/* Landing Page Optimiser - Text Right, Image Left */}
        <AlternatingSection
          title="Landing Page Optimiser"
          description="Get actionable insights and recommendations to improve your landing page conversion rates. Our AI analyses page structure, messaging, and user experience with best practices tailored for higher education audiences."
          benefits={[
            'AI-powered conversion analysis',
            'Actionable recommendations',
            'Higher education best practices',
            'Mobile and desktop insights',
            'Competitor benchmarking',
          ]}
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
          imageAlt="Landing Page Optimiser Dashboard"
          ctaText="Analyse Your Page"
          ctaHref="/optimise"
          reverse={true}
          backgroundColor="bg-gray-50"
        />

        {/* Asset Specs - Text Left, Image Right */}
        <AlternatingSection
          title="Creative Asset Specifications"
          description="Access up-to-date creative specifications for all major advertising platforms in one place. Never miss a deadline or submit incorrect file formats again with our comprehensive spec library."
          benefits={[
            '14+ platform specifications',
            'Always up-to-date requirements',
            'Dimensions, file sizes, character limits',
            'Export to PDF or share with team',
            'Platform-specific best practices',
          ]}
          image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
          imageAlt="Asset Specifications Interface"
          ctaText="View All Specs"
          ctaHref="/specs"
          badge="New"
          reverse={false}
        />

        {/* Features/Benefits section */}
        <FeaturesBento />
      </main>
    </div>
  );
}
