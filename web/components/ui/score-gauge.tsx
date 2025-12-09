"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number; // 0-100
  grade: string; // A-F
}

// Segment colours from poor (left) to good (right)
const SEGMENTS = [
  { color: "bg-red-600", range: [0, 12.5] },
  { color: "bg-orange-500", range: [12.5, 25] },
  { color: "bg-amber-500", range: [25, 37.5] },
  { color: "bg-yellow-400", range: [37.5, 50] },
  { color: "bg-lime-400", range: [50, 62.5] },
  { color: "bg-green-500", range: [62.5, 75] },
  { color: "bg-teal-500", range: [75, 87.5] },
  { color: "bg-cyan-500", range: [87.5, 100] },
];

export function ScoreGauge({ score, grade }: ScoreGaugeProps) {
  // Clamp score to 0-100
  const clampedScore = Math.max(0, Math.min(100, score));

  // Get status text and colour
  const getStatus = (score: number) => {
    if (score >= 70) return { text: "Good", color: "text-green-600" };
    if (score >= 50) return { text: "Fair", color: "text-amber-600" };
    return { text: "Poor", color: "text-red-600" };
  };

  const status = getStatus(clampedScore);

  // Calculate marker position (percentage)
  const markerPosition = clampedScore;

  return (
    <div className="w-full">
      {/* Score header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-1">
          <span className={cn("text-4xl font-bold tabular-nums", status.color)}>
            {clampedScore}
          </span>
          <span className="text-lg text-gray-400 font-medium">/100</span>
        </div>
        <div
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-semibold",
            clampedScore >= 70
              ? "bg-green-100 text-green-700"
              : clampedScore >= 50
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700"
          )}
        >
          Grade {grade}
        </div>
      </div>

      {/* Segmented bar container */}
      <div className="relative">
        {/* Bar with border */}
        <div className="relative flex rounded-full border-[3px] border-gray-800 overflow-hidden h-12">
          {SEGMENTS.map((segment, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 h-full",
                segment.color,
                // Add small gap between segments except first and last
                index > 0 && "border-l-2 border-gray-800/30"
              )}
            />
          ))}
        </div>

        {/* Position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${markerPosition}%` }}
        >
          {/* Marker line */}
          <div className="w-1.5 h-16 bg-gray-800 rounded-full shadow-lg" />
          {/* Triangle pointer on top */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-gray-800" />
        </div>
      </div>

      {/* Status label */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            clampedScore >= 70
              ? "bg-green-500"
              : clampedScore >= 50
              ? "bg-amber-500"
              : "bg-red-500"
          )}
        />
        <span className={cn("text-sm font-medium", status.color)}>
          {status.text}
        </span>
      </div>
    </div>
  );
}
