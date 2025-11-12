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

  // Round to nearest 10 for segment filling
  const roundedScore = Math.round(clampedScore / 10) * 10;

  // Determine color based on score zones
  const getSegmentColor = (segmentStart: number): string => {
    if (segmentStart >= 70) return "#22c55e"; // Green
    if (segmentStart >= 50) return "#f59e0b"; // Amber
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
      textSize: "text-5xl",
      gradeSize: "text-lg",
      svgSize: 300,
      strokeWidth: 20,
    },
    md: {
      textSize: "text-7xl",
      gradeSize: "text-2xl",
      svgSize: 400,
      strokeWidth: 28,
    },
    lg: {
      textSize: "text-8xl",
      gradeSize: "text-3xl",
      svgSize: 500,
      strokeWidth: 36,
    },
  };

  const config = sizeConfig[size];

  // SVG arc parameters
  const centerX = config.svgSize / 2;
  const centerY = config.svgSize / 2;
  const radius = (config.svgSize / 2) - (config.strokeWidth / 2) - 10;

  // Create 10 segments (0-10, 10-20, ..., 90-100)
  const segments = [];
  for (let i = 0; i < 10; i++) {
    const segmentStart = i * 10;
    const segmentEnd = (i + 1) * 10;
    const isFilled = segmentEnd <= roundedScore;

    // Calculate arc path for this segment
    // Segments go from 180° (left) to 0° (right) in a semicircle
    // Each segment is 18° (180° / 10 segments)
    const startAngle = 180 - (i * 18); // Degrees
    const endAngle = 180 - ((i + 1) * 18); // Degrees

    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate arc endpoints
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY - radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY - radius * Math.sin(endRad);

    // Create arc path
    const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;

    segments.push({
      path: arcPath,
      color: getSegmentColor(segmentStart),
      isFilled,
      segmentStart,
    });
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Windshield Gauge */}
      <div className={cn(
        "flex flex-col items-center gap-4 w-full max-w-3xl rounded-3xl border-2 p-8 transition-all duration-300",
        getBackgroundColor(clampedScore),
        getBorderColor(clampedScore),
        "shadow-lg"
      )}>
        {/* SVG Windshield Gauge */}
        <div className="relative" style={{ width: config.svgSize, height: config.svgSize / 2 + 80 }}>
          <svg
            width={config.svgSize}
            height={config.svgSize / 2 + 20}
            viewBox={`0 0 ${config.svgSize} ${config.svgSize / 2 + 20}`}
            className="overflow-visible"
          >
            {/* Background arc (unfilled segments) */}
            {segments.map((segment, i) => (
              <path
                key={`bg-${i}`}
                d={segment.path}
                stroke="#e5e7eb"
                strokeWidth={config.strokeWidth}
                fill="none"
                strokeLinecap="round"
              />
            ))}

            {/* Filled segments */}
            {segments.map((segment, i) => (
              <path
                key={`fill-${i}`}
                d={segment.path}
                stroke={segment.isFilled ? segment.color : "transparent"}
                strokeWidth={config.strokeWidth}
                fill="none"
                strokeLinecap="round"
                className="transition-all duration-700"
                style={{
                  transitionDelay: `${i * 50}ms`,
                }}
              />
            ))}

            {/* Score labels at 0, 50, 100 */}
            <text
              x={centerX - radius}
              y={centerY + 15}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-500"
            >
              0
            </text>
            <text
              x={centerX}
              y={centerY - radius + 5}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-500"
            >
              50
            </text>
            <text
              x={centerX + radius}
              y={centerY + 15}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-500"
            >
              100
            </text>
          </svg>

          {/* Center Score Display */}
          <div className="absolute inset-x-0" style={{ top: config.svgSize / 2 - 20 }}>
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-3">
                <div className={cn(
                  config.textSize,
                  "font-bold tabular-nums",
                  getTextColor(clampedScore)
                )}>
                  {clampedScore}
                </div>
                <div className="flex flex-col">
                  <span className="text-xl text-gray-500">/100</span>
                </div>
              </div>
              <span className={cn(
                config.gradeSize,
                "font-semibold text-gray-700 mt-1"
              )}>
                Grade {grade}
              </span>
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
