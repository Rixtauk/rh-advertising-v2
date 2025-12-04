import { InsightChat } from '@/components/chat/InsightChat';

export default function InsightsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Education Insight Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask questions about higher education marketing and get answers grounded
          in our knowledge base with cited sources.
        </p>
      </header>

      <InsightChat />
    </div>
  );
}
