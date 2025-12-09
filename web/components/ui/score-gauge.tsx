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
  const getScoreColor = (score: number): string => {
    if (score >= 70) return "#22c55e"; // Green
    if (score >= 50) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  const getBackgroundColor = (score: number) => {
    if (score >= 70) return "bg-green-50";
    if (score >= 50) return "bg-amber-50";
    return "bg-red-50";
  };

  const getBorderColor = (score: number) => {
    if (score >= 70) return "border-green-200";
    if (score >= 50) return "border-amber-200";
    return "border-red-200";
  };

  const getTextColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      containerSize: 120,
      strokeWidth: 8,
      textSize: "text-3xl",
      gradeSize: "text-sm",
      radius: 50,
    },
    md: {
      containerSize: 160,
      strokeWidth: 10,
      textSize: "text-5xl",
      gradeSize: "text-base",
      radius: 65,
    },
    lg: {
      containerSize: 200,
      strokeWidth: 12,
      textSize: "text-6xl",
      gradeSize: "text-lg",
      radius: 82,
    },
  };

  const config = sizeConfig[size];
  const center = config.containerSize / 2;

  // Calculate circle properties
  const circumference = 2 * Math.PI * config.radius;
  const progress = (clampedScore / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Circular Progress Ring */}
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-3xl border-2 p-8 transition-all duration-300",
          getBackgroundColor(clampedScore),
          getBorderColor(clampedScore),
          "shadow-lg"
        )}
      >
        <div className="relative" style={{ width: config.containerSize, height: config.containerSize }}>
          <svg
            width={config.containerSize}
            height={config.containerSize}
            viewBox={`0 0 ${config.containerSize} ${config.containerSize}`}
            className="transform -rotate-90"
          >
            {/* Background circle (track) */}
            <circle
              cx={center}
              cy={center}
              r={config.radius}
              stroke="#e5e7eb"
              strokeWidth={config.strokeWidth}
              fill="none"
              className="opacity-30"
            />

            {/* Progress circle (animated) */}
            <circle
              cx={center}
              cy={center}
              r={config.radius}
              stroke={getScoreColor(clampedScore)}
              strokeWidth={config.strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                transformOrigin: "center",
              }}
            />
          </svg>

          {/* Center Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className={cn(
                config.textSize,
                "font-bold tabular-nums leading-none",
                getTextColor(clampedScore)
              )}
            >
              {clampedScore}
            </div>
            <div className={cn(
              config.gradeSize,
              "font-semibold text-gray-700 mt-1"
            )}>
              Grade {grade}
            </div>
          </div>
        </div>
      </div>

      {/* Legend badges */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { range: "0-40", label: "Poor", color: "red", active: clampedScore < 50 },
          { range: "50-60", label: "Fair", color: "amber", active: clampedScore >= 50 && clampedScore < 70 },
          { range: "70-100", label: "Good", color: "green", active: clampedScore >= 70 },
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
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                color === "red" && "bg-red-500",
                color === "amber" && "bg-amber-500",
                color === "green" && "bg-green-500",
                active && "animate-pulse"
              )}
            />
            <span>{range}: {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
