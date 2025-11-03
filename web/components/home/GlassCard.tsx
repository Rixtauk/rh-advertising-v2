import Link from 'next/link';
import { ReactNode } from 'react';

interface GlassCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  href: string;
}

export function GlassCard({
  icon,
  title,
  description,
  badge,
  href,
}: GlassCardProps) {
  const accentColor = '#55A2C3';

  return (
    <Link href={href} className="group block h-full">
      <div className="relative h-full rounded-2xl p-[1px] overflow-hidden transition-all duration-300 hover:scale-105">
        {/* Accent border */}
        <div
          className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: accentColor }}
        />

        {/* Card content */}
        <div className="relative h-full rounded-2xl p-8 backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          {/* Icon */}
          <div className="mb-6 text-5xl">{icon}</div>

          {/* Badge */}
          {badge && (
            <div
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: accentColor }}
            >
              {badge}
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 text-foreground">{title}</h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>

          {/* CTA */}
          <div className="flex items-center text-sm font-medium">
            <span style={{ color: accentColor }}>
              Get Started
            </span>
            <svg
              className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
