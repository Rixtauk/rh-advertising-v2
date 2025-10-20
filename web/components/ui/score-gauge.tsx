"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number; // 0-100
  grade: string; // A-F
  size?: "sm" | "md" | "lg";
}

export function ScoreGauge({ score, grade, size = "md" }: ScoreGaugeProps) {
  // Clamp score to 0-100
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine color based on score zones
  const getColorClasses = (score: number) => {
    if (score >= 71) return {
      primary: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      barColor: "bg-green-500",
      fillColor: "#22c55e",
    };
    if (score >= 41) return {
      primary: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      barColor: "bg-amber-500",
      fillColor: "#f59e0b",
    };
    return {
      primary: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      barColor: "bg-red-500",
      fillColor: "#ef4444",
    };
  };

  const colors = getColorClasses(clampedScore);

  // Size configurations
  const sizeConfig = {
    sm: {
      textSize: "text-5xl",
      gradeSize: "text-lg",
      barHeight: "h-8",
    },
    md: {
      textSize: "text-7xl",
      gradeSize: "text-2xl",
      barHeight: "h-12",
    },
    lg: {
      textSize: "text-8xl",
      gradeSize: "text-3xl",
      barHeight: "h-16",
    },
  };

  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Score Display */}
      <div className={cn(
        "flex flex-col items-center gap-4 w-full max-w-3xl rounded-3xl border-2 p-8 transition-all duration-300",
        colors.bg,
        colors.border,
        "shadow-lg"
      )}>
        {/* Large Score Number */}
        <div className="flex items-baseline gap-4">
          <div className={cn(
            config.textSize,
            "font-bold tabular-nums",
            colors.primary
          )}>
            {clampedScore}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl text-gray-500">/100</span>
            <span className={cn(
              config.gradeSize,
              "font-semibold text-gray-700"
            )}>
              Grade {grade}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-3">
          {/* Bar container with color zones */}
          <div className="relative w-full bg-gray-200 rounded-full overflow-hidden" style={{ height: config.barHeight.replace('h-', '') * 4 + 'px' }}>
            {/* Color zone backgrounds */}
            <div className="absolute inset-0 flex">
              <div className="w-[40%] bg-red-100" />
              <div className="w-[30%] bg-amber-100" />
              <div className="w-[30%] bg-green-100" />
            </div>

            {/* Filled progress */}
            <div
              className={cn(
                "relative h-full transition-all duration-1000 ease-out",
                colors.barColor
              )}
              style={{ width: `${clampedScore}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
            </div>

            {/* Score markers */}
            {[0, 25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className="absolute top-0 bottom-0 w-0.5 bg-white"
                style={{ left: `${mark}%` }}
              />
            ))}
          </div>

          {/* Labels below bar */}
          <div className="relative w-full">
            <div className="flex justify-between text-sm font-medium text-gray-600">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend badges */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { range: "0-40", label: "Poor", color: "red", active: clampedScore < 41 },
          { range: "41-70", label: "Fair", color: "amber", active: clampedScore >= 41 && clampedScore < 71 },
          { range: "71-100", label: "Good", color: "green", active: clampedScore >= 71 },
        ].map(({ range, label, color, active }) => (
          <div
            key={range}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-300",
              color === "red" && "bg-red-50 border-red-200 text-red-700",
              color === "amber" && "bg-amber-50 border-amber-200 text-amber-700",
              color === "green" && "bg-green-50 border-green-200 text-green-700",
              active && "ring-2 shadow-lg scale-105",
              active && color === "red" && "ring-red-500/30",
              active && color === "amber" && "ring-amber-500/30",
              active && color === "green" && "ring-green-500/30"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full",
              color === "red" && "bg-red-500",
              color === "amber" && "bg-amber-500",
              color === "green" && "bg-green-500",
              active && "animate-pulse"
            )} />
            <span>{range}: {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
