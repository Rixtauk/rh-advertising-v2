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

  // Calculate rotation for the indicator
  const rotation = (clampedScore / 100) * 180;

  // Determine color based on score zones
  const getColorClasses = (score: number) => {
    if (score >= 71) return {
      primary: "text-green-600 dark:text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      glow: "shadow-green-200/50 dark:shadow-green-900/50",
      gradient: "from-green-500 to-emerald-500",
      ring: "ring-green-500/20"
    };
    if (score >= 41) return {
      primary: "text-amber-600 dark:text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      glow: "shadow-amber-200/50 dark:shadow-amber-900/50",
      gradient: "from-amber-500 to-orange-500",
      ring: "ring-amber-500/20"
    };
    return {
      primary: "text-red-600 dark:text-red-500",
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      glow: "shadow-red-200/50 dark:shadow-red-900/50",
      gradient: "from-red-500 to-rose-500",
      ring: "ring-red-500/20"
    };
  };

  const colors = getColorClasses(clampedScore);

  // Size configurations
  const sizeConfig = {
    sm: { size: 200, stroke: 16, textSize: "text-4xl", gradeSize: "text-lg", dotSize: 6 },
    md: { size: 300, stroke: 24, textSize: "text-6xl", gradeSize: "text-2xl", dotSize: 8 },
    lg: { size: 380, stroke: 28, textSize: "text-7xl", gradeSize: "text-3xl", dotSize: 10 },
  };

  const config = sizeConfig[size];
  const center = config.size / 2;
  const radius = (config.size - config.stroke) / 2.2;

  // Calculate arc paths
  const polarToCartesian = (angle: number) => {
    const radian = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian),
    };
  };

  const startPoint = polarToCartesian(0);
  const endPoint = polarToCartesian(180);
  const scorePoint = polarToCartesian(rotation);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Main gauge container with glass effect */}
      <div className={cn(
        "relative rounded-3xl border-2 p-8 backdrop-blur-sm transition-all duration-500",
        colors.bg,
        colors.border,
        colors.glow,
        "shadow-xl"
      )}>
        <div
          className="relative transition-transform duration-700 ease-out hover:scale-105"
          style={{ width: config.size, height: config.size * 0.65 }}
        >
          <svg
            viewBox={`0 0 ${config.size} ${config.size * 0.65}`}
            className="w-full h-full overflow-visible"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
          >
            <defs>
              {/* Gradient for score arc */}
              <linearGradient id={`scoreGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-red-500" stopColor="currentColor" />
                <stop offset="50%" className="text-amber-500" stopColor="currentColor" />
                <stop offset="100%" className="text-green-500" stopColor="currentColor" />
              </linearGradient>

              {/* Glow effect */}
              <filter id={`glow-${size}`}>
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Active gradient for indicator */}
              <linearGradient id={`activeGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={cn("transition-colors", colors.gradient.includes("green") ? "text-green-400" : colors.gradient.includes("amber") ? "text-amber-400" : "text-red-400")} stopColor="currentColor" />
                <stop offset="100%" className={cn("transition-colors", colors.gradient.includes("green") ? "text-green-600" : colors.gradient.includes("amber") ? "text-amber-600" : "text-red-600")} stopColor="currentColor" />
              </linearGradient>
            </defs>

            {/* Background track with subtle segments */}
            <path
              d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${endPoint.x} ${endPoint.y}`}
              fill="none"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-800 transition-colors"
              strokeWidth={config.stroke}
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* Score segments with gradient */}
            <path
              d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${endPoint.x} ${endPoint.y}`}
              fill="none"
              stroke={`url(#scoreGradient-${size})`}
              strokeWidth={config.stroke - 2}
              strokeLinecap="round"
              opacity="0.4"
              className="transition-opacity duration-500"
            />

            {/* Active score arc */}
            <path
              d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${rotation > 180 ? 1 : 0} 1 ${scorePoint.x} ${scorePoint.y}`}
              fill="none"
              stroke={`url(#activeGradient-${size})`}
              strokeWidth={config.stroke}
              strokeLinecap="round"
              filter={`url(#glow-${size})`}
              className="transition-all duration-1000 ease-out"
              style={{
                strokeDasharray: rotation === 0 ? '0 1000' : '1000',
                strokeDashoffset: 0,
              }}
            />

            {/* Indicator dot at current score */}
            <circle
              cx={scorePoint.x}
              cy={scorePoint.y}
              r={config.dotSize}
              fill="white"
              className={cn("transition-all duration-1000 ease-out", colors.ring)}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              }}
            />
            <circle
              cx={scorePoint.x}
              cy={scorePoint.y}
              r={config.dotSize - 2}
              fill={`url(#activeGradient-${size})`}
              className="transition-all duration-1000 ease-out animate-pulse"
            />

            {/* Score markers */}
            {[0, 25, 50, 75, 100].map((mark) => {
              const angle = (mark / 100) * 180;
              const point = polarToCartesian(angle);
              const isActive = mark <= clampedScore;
              return (
                <g key={mark}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={3}
                    fill="currentColor"
                    className={cn(
                      "transition-colors duration-500",
                      isActive ? colors.primary : "text-gray-400 dark:text-gray-600"
                    )}
                  />
                  <text
                    x={point.x}
                    y={point.y + (mark === 50 ? -20 : 25)}
                    fontSize={config.size * 0.045}
                    fill="currentColor"
                    textAnchor="middle"
                    className={cn(
                      "font-semibold transition-colors duration-500",
                      isActive ? colors.primary : "text-gray-500 dark:text-gray-600"
                    )}
                  >
                    {mark}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Center score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
            <div className={cn(
              config.textSize,
              "font-bold tabular-nums tracking-tight transition-all duration-700",
              colors.primary
            )}>
              {clampedScore}
            </div>
            <div className={cn(
              config.gradeSize,
              "font-semibold tracking-wide mt-1 transition-colors duration-500",
              "text-gray-700 dark:text-gray-300"
            )}>
              Grade {grade}
            </div>
          </div>
        </div>
      </div>

      {/* Modern legend with badges */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { range: "0-40", label: "Poor", color: "red" },
          { range: "41-70", label: "Fair", color: "amber" },
          { range: "71-100", label: "Good", color: "green" },
        ].map(({ range, label, color }) => (
          <div
            key={range}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-300",
              color === "red" && "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400",
              color === "amber" && "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400",
              color === "green" && "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400",
              clampedScore >= 71 && color === "green" && "ring-2 ring-green-500/30 shadow-lg scale-105",
              clampedScore >= 41 && clampedScore < 71 && color === "amber" && "ring-2 ring-amber-500/30 shadow-lg scale-105",
              clampedScore < 41 && color === "red" && "ring-2 ring-red-500/30 shadow-lg scale-105"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full",
              color === "red" && "bg-red-500",
              color === "amber" && "bg-amber-500",
              color === "green" && "bg-green-500",
              clampedScore >= 71 && color === "green" && "animate-pulse",
              clampedScore >= 41 && clampedScore < 71 && color === "amber" && "animate-pulse",
              clampedScore < 41 && color === "red" && "animate-pulse"
            )} />
            <span>{range}: {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
