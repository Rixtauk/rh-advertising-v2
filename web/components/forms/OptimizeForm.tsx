"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OptimizeFormProps {
  onSubmit: (data: { url: string; objective: string }) => Promise<void>;
  isLoading: boolean;
}

const OBJECTIVES = [
  "Open Day Registration",
  "Pre-Clearing Enquiry Form",
  "Application",
  "Recruitment Page",
] as const;

export function OptimizeForm({ onSubmit, isLoading }: OptimizeFormProps) {
  const [url, setUrl] = useState("");
  const [objective, setObjective] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !objective) return;

    await onSubmit({ url, objective });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Landing Page</CardTitle>
        <CardDescription>
          Get a comprehensive analysis of your university landing page with actionable
          recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">Landing Page URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.ac.uk/open-day"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Enter the full URL of the landing page you want to analyze
            </p>
          </div>

          {/* Objective Select */}
          <div className="space-y-2">
            <Label htmlFor="objective">Page Objective</Label>
            <Select value={objective} onValueChange={setObjective} disabled={isLoading}>
              <SelectTrigger id="objective">
                <SelectValue placeholder="Select page objective..." />
              </SelectTrigger>
              <SelectContent>
                {OBJECTIVES.map((obj) => (
                  <SelectItem key={obj} value={obj}>
                    {obj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              What is the primary goal of this landing page?
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading || !url || !objective} className="w-full">
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Analyzing...
              </>
            ) : (
              "Analyze Page"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
