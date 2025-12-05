import { InsightChat } from '@/components/chat/InsightChat';

export default function InsightsPage() {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 md:space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          Education Insight Assistant
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Ask questions about higher education marketing and get answers grounded
          in our knowledge base with cited sources.
        </p>
      </header>

      <InsightChat />
    </div>
  );
}
