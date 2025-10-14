import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to RH AI Assistant</h1>
        <p className="text-xl text-muted-foreground">
          Your intelligent companion for higher education advertising
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Ad Copy Generator</CardTitle>
            </div>
            <CardDescription>
              Generate compliant, on-brand ad copy for 12+ advertising channels with automatic
              character limit enforcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/copy">
              <Button className="w-full">Generate Copy</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Asset Specifications</CardTitle>
            </div>
            <CardDescription>
              Query creative asset requirements (dimensions, formats, file sizes) for any
              advertising channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/assets">
              <Button className="w-full" variant="outline">
                View Specs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Features</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>12 Channels:</strong> Facebook, Instagram, LinkedIn, TikTok, Snapchat, X,
              Reddit, YouTube, Google Search, Display, Performance Max, and Demand Gen
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>Smart Limits:</strong> Automatic character counting and over-limit warnings
              with shortened alternatives
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>Context-Aware:</strong> Optional landing page scraping to inform copy
              generation
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              <strong>Configurable:</strong> All limits and specs maintained in version-controlled
              YAML files
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
