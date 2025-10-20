import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, LineChart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to RH AI Assistant</h1>
        <p className="text-xl text-muted-foreground">
          Your intelligent companion for higher education advertising
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-12">
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Ad Copy Generator</CardTitle>
            </div>
            <CardDescription>
              Generate compliant, on-brand ad copy for 14+ advertising channels with automatic
              character limit enforcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/copy">
              <Button className="w-full">Generate Copy</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Landing Page Optimiser</CardTitle>
            </div>
            <CardDescription>
              Analyse and optimise university landing pages with actionable recommendations and scoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/optimize">
              <Button className="w-full">Analyse Page</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader className="flex-1">
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
              <Button className="w-full">View Specs</Button>
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
              <strong>14 Channels:</strong> Search, Display, Performance Max, YouTube, TikTok, Snapchat, LinkedIn, Meta (Facebook/Instagram), and Reddit
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
              <strong>Landing Page Analysis:</strong> Comprehensive scoring across 6 categories with actionable recommendations for improvement
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
