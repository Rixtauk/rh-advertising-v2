"use client";

import { ScoreGauge } from "@/components/ui/score-gauge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Info, Lightbulb } from "lucide-react";

interface CategoryScore {
  score: number;
  max: number;
  grade: string;
  percentage: number;
}

interface Issue {
  category: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  evidence?: string;
  suggestion: string;
  impact?: string;
}

interface PageSummary {
  title?: string;
  h1?: string;
  meta_description?: string;
  cta_count: number;
  form_count: number;
  has_testimonials: boolean;
  has_rankings: boolean;
  word_count: number;
}

interface OptimizeResultsProps {
  overall_score: number;
  grade: string;
  objective: string;
  url: string;
  scores: Record<string, CategoryScore>;
  issues: Issue[];
  quick_wins: string[];
  summary: PageSummary;
  scraped_at: string;
  analysis_time_ms: number;
}

export function OptimizeResults({
  overall_score,
  grade,
  objective,
  url,
  scores,
  issues,
  quick_wins,
  summary,
  analysis_time_ms,
}: OptimizeResultsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4" />;
      case "medium":
        return <Info className="h-4 w-4" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const highIssues = issues.filter((i) => i.severity === "high");
  const mediumIssues = issues.filter((i) => i.severity === "medium");
  const lowIssues = issues.filter((i) => i.severity === "low");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Landing Page Analysis</CardTitle>
              <CardDescription className="mt-2">
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {url}
                </a>
              </CardDescription>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{objective}</Badge>
                <Badge variant="secondary">{analysis_time_ms}ms</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ScoreGauge score={overall_score} grade={grade} size="lg" />
        </CardContent>
      </Card>

      {/* Quick Wins */}
      {quick_wins.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <CardTitle>Quick Wins</CardTitle>
            </div>
            <CardDescription>High-impact improvements you can make right away</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {quick_wins.map((win, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-relaxed">
                    {win.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Category Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Detailed scoring across 6 categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(scores).map(([category, score]) => (
              <div key={category} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{category}</h3>
                  <Badge variant="outline">Grade {score.grade}</Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">{score.score}</span>
                  <span className="text-sm text-muted-foreground">/ {score.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      score.percentage >= 71
                        ? "bg-green-500"
                        : score.percentage >= 41
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${score.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{score.percentage}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Issues & Recommendations</CardTitle>
          <CardDescription>
            {highIssues.length} high priority · {mediumIssues.length} medium priority ·{" "}
            {lowIssues.length} low priority
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({issues.length})</TabsTrigger>
              <TabsTrigger value="high">High ({highIssues.length})</TabsTrigger>
              <TabsTrigger value="medium">Medium ({mediumIssues.length})</TabsTrigger>
              <TabsTrigger value="low">Low ({lowIssues.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {issues.map((issue, idx) => (
                <IssueCard key={idx} issue={issue} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} />
              ))}
            </TabsContent>

            <TabsContent value="high" className="space-y-4 mt-4">
              {highIssues.map((issue, idx) => (
                <IssueCard key={idx} issue={issue} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} />
              ))}
            </TabsContent>

            <TabsContent value="medium" className="space-y-4 mt-4">
              {mediumIssues.map((issue, idx) => (
                <IssueCard key={idx} issue={issue} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} />
              ))}
            </TabsContent>

            <TabsContent value="low" className="space-y-4 mt-4">
              {lowIssues.map((issue, idx) => (
                <IssueCard key={idx} issue={issue} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Page Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Page Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Word Count</p>
              <p className="text-2xl font-bold">{summary.word_count}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CTAs</p>
              <p className="text-2xl font-bold">{summary.cta_count}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Forms</p>
              <p className="text-2xl font-bold">{summary.form_count}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Testimonials</p>
              <p className="text-2xl font-bold">{summary.has_testimonials ? "Yes" : "No"}</p>
            </div>
          </div>
          {summary.title && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Page Title</p>
              <p className="font-medium">{summary.title}</p>
            </div>
          )}
          {summary.h1 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Main Heading (H1)</p>
              <p className="font-medium">{summary.h1}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function IssueCard({
  issue,
  getSeverityColor,
  getSeverityIcon,
}: {
  issue: Issue;
  getSeverityColor: (severity: string) => any;
  getSeverityIcon: (severity: string) => React.ReactNode;
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-start gap-2">
          {getSeverityIcon(issue.severity)}
          <div>
            <h4 className="font-semibold">{issue.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
          </div>
        </div>
        <Badge variant={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
      </div>

      {issue.evidence && (
        <div className="mt-3 p-3 bg-muted rounded text-sm">
          <p className="font-medium mb-1">Evidence:</p>
          <p className="text-muted-foreground">{issue.evidence}</p>
        </div>
      )}

      <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
        <p className="font-medium mb-1 text-blue-900">Suggestion:</p>
        <p className="text-blue-800">{issue.suggestion}</p>
      </div>

      {issue.impact && (
        <div className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium">Impact:</span> {issue.impact}
        </div>
      )}

      <div className="mt-2">
        <Badge variant="outline" className="text-xs">
          {issue.category}
        </Badge>
      </div>
    </div>
  );
}
