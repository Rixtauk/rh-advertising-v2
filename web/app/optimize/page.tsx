"use client";

import { useState } from "react";
import { OptimizeForm } from "@/components/forms/OptimizeForm";
import { OptimizeResults } from "@/components/results/OptimizeResults";
import { optimizeLandingPage } from "./actions";
import { useToast } from "@/components/ui/use-toast";

export default function OptimizePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: { url: string; objective: string }) => {
    setIsLoading(true);
    setResults(null);

    try {
      const result = await optimizeLandingPage(data);

      if (result.success && result.data) {
        setResults(result.data);
        toast({
          title: "Analysis complete!",
          description: `Score: ${result.data.overall_score}/100 (Grade ${result.data.grade})`,
        });
      } else {
        toast({
          title: "Analysis failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze landing page",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Landing Page Optimizer</h1>
        <p className="text-lg text-muted-foreground">
          Get comprehensive analysis and actionable recommendations for your university landing pages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <OptimizeForm onSubmit={handleSubmit} isLoading={isLoading} />

          {isLoading && (
            <div className="mt-6 p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-3">
                <svg
                  className="animate-spin h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <div>
                  <p className="font-medium text-blue-900">Analyzing page...</p>
                  <p className="text-sm text-blue-700">This may take 10-20 seconds</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {results ? (
            <OptimizeResults {...results} />
          ) : (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No analysis yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a landing page URL and objective to get started
                </p>
                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-gray-900 mb-2">What we analyze:</h4>
                  <ul className="text-xs text-left text-gray-600 space-y-1">
                    <li>• Copy Quality (value proposition, length, readability)</li>
                    <li>• UX/Layout (hierarchy, navigation, mobile)</li>
                    <li>• Conversion Elements (CTAs, forms, trust signals)</li>
                    <li>• Technical SEO (title, meta, alt text)</li>
                    <li>• Education-Specific (course details, requirements, dates)</li>
                    <li>• Accessibility (semantic HTML, link quality)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
