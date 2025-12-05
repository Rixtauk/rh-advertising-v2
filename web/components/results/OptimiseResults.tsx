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

interface OptimiseResultsProps {
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

export function OptimiseResults({
  overall_score,
  grade,
  objective,
  url,
  scores,
  issues,
  quick_wins,
  summary,
  analysis_time_ms,
}: OptimiseResultsProps) {
  const formatCategoryName = (category: string) => {
    // Convert snake_case to Title Case
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <div className="flex flex-col gap-3">
            <div>
              <CardTitle className="text-lg md:text-xl">Landing Page Analysis</CardTitle>
              <CardDescription className="mt-2 break-all text-sm">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {url}
                </a>
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="text-xs">
                  {objective}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {analysis_time_ms}ms
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Score */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Overall Score</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-4 md:py-6">
          <ScoreGauge score={overall_score} grade={grade} size="lg" />
        </CardContent>
      </Card>

      {/* Quick Wins */}
      {quick_wins.length > 0 && (
        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <CardTitle className="text-lg md:text-xl">Quick Wins</CardTitle>
            </div>
            <CardDescription className="text-sm">
              High-impact improvements you can make right away
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 md:space-y-4">
              {quick_wins.map((win, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs md:text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-sm md:text-base leading-relaxed">
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
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Category Breakdown</CardTitle>
          <CardDescription className="text-sm">
            Detailed scoring across 3 core categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(scores).map(([category, score]) => (
              <div key={category} className="border rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-sm md:text-base">
                    {formatCategoryName(category)}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    Grade {score.grade}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl md:text-3xl font-bold">{score.score}</span>
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
                <p className="text-xs text-muted-foreground mt-2">{score.percentage}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Issues & Recommendations</CardTitle>
          <CardDescription className="text-sm">
            {highIssues.length} high priority · {mediumIssues.length} medium priority ·{" "}
            {lowIssues.length} low priority
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="w-full grid grid-cols-4 h-auto">
              <TabsTrigger value="all" className="text-xs md:text-sm">
                All ({issues.length})
              </TabsTrigger>
              <TabsTrigger value="high" className="text-xs md:text-sm">
                High ({highIssues.length})
              </TabsTrigger>
              <TabsTrigger value="medium" className="text-xs md:text-sm">
                Med ({mediumIssues.length})
              </TabsTrigger>
              <TabsTrigger value="low" className="text-xs md:text-sm">
                Low ({lowIssues.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 md:space-y-4 mt-4">
              {issues.map((issue, idx) => (
                <IssueCard key={idx} issue={issue} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} />
              ))}
            </TabsContent>

            <TabsContent value="high" className="space-y-3 md:space-y-4 mt-4">
              {highIssues.map((issue, idx) => (
                <IssueCard key={idx} issue={issue} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} />
              ))}
            </TabsContent>

            <TabsContent value="medium" className="space-y-3 md:space-y-4 mt-4">
              {mediumIssues.map((issue, idx) => (
                <IssueCard key={idx} issue={issue} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} />
              ))}
            </TabsContent>

            <TabsContent value="low" className="space-y-3 md:space-y-4 mt-4">
              {lowIssues.map((issue, idx) => (
                <IssueCard key={idx} issue={issue} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Page Summary */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Page Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Word Count</p>
              <p className="text-xl md:text-2xl font-bold">{summary.word_count}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground mb-1">CTAs</p>
              <p className="text-xl md:text-2xl font-bold">{summary.cta_count}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Forms</p>
              <p className="text-xl md:text-2xl font-bold">{summary.form_count}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Testimonials</p>
              <p className="text-xl md:text-2xl font-bold">
                {summary.has_testimonials ? "Yes" : "No"}
              </p>
            </div>
          </div>
          {summary.title && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Page Title</p>
              <p className="font-medium text-sm md:text-base">{summary.title}</p>
            </div>
          )}
          {summary.h1 && (
            <div className="mt-3">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Main Heading (H1)</p>
              <p className="font-medium text-sm md:text-base">{summary.h1}</p>
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
    <div className="border rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-0.5">
            {getSeverityIcon(issue.severity)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm md:text-base break-words">{issue.title}</h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              {issue.description}
            </p>
          </div>
        </div>
        <Badge variant={getSeverityColor(issue.severity)} className="text-xs flex-shrink-0">
          {issue.severity}
        </Badge>
      </div>

      {issue.evidence && (
        <div className="mt-3 p-3 bg-muted rounded-lg text-xs md:text-sm">
          <p className="font-medium mb-1">Evidence:</p>
          <p className="text-muted-foreground leading-relaxed break-words">{issue.evidence}</p>
        </div>
      )}

      <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs md:text-sm">
        <p className="font-medium mb-1 text-blue-900">Suggestion:</p>
        <p className="text-blue-800 leading-relaxed break-words">{issue.suggestion}</p>
      </div>

      {issue.impact && (
        <div className="mt-3 text-xs md:text-sm text-muted-foreground">
          <span className="font-medium">Impact:</span> {issue.impact}
        </div>
      )}

      <div className="mt-3">
        <Badge variant="outline" className="text-xs">
          {issue.category}
        </Badge>
      </div>
    </div>
  );
}
