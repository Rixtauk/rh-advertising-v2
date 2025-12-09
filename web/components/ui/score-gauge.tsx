"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number; // 0-100
  grade: string; // A-F
}

export function ScoreGauge({ score, grade }: ScoreGaugeProps) {
  // Clamp score to 0-100
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine colours and status based on score zones
  const getScoreConfig = (score: number) => {
    if (score >= 70) {
      return {
        barColor: "bg-green-500",
        textColor: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        badgeColor: "bg-green-100 text-green-700",
        status: "Good",
      };
    }
    if (score >= 50) {
      return {
        barColor: "bg-amber-500",
        textColor: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        badgeColor: "bg-amber-100 text-amber-700",
        status: "Fair",
      };
    }
    return {
      barColor: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      badgeColor: "bg-red-100 text-red-700",
      status: "Poor",
    };
  };

  const config = getScoreConfig(clampedScore);

  return (
    <div
      className={cn(
        "w-full rounded-xl border-2 p-6 transition-all duration-300",
        config.bgColor,
        config.borderColor
      )}
    >
      {/* Top row: Score and Grade */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-5xl font-bold tabular-nums",
              config.textColor
            )}
          >
            {clampedScore}
          </span>
          <span className="text-xl text-gray-400 font-medium">/100</span>
        </div>
        <div
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-semibold",
            config.badgeColor
          )}
        >
          Grade {grade}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            config.barColor
          )}
          style={{ width: `${clampedScore}%` }}
        />
      </div>

      {/* Status label */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            config.barColor
          )}
        />
        <span className={cn("text-sm font-medium", config.textColor)}>
          {config.status}
        </span>
      </div>
    </div>
  );
}
