import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

interface AlternatingSectionProps {
  title: string;
  description: string;
  benefits: string[];
  image: string;
  imageAlt: string;
  ctaText: string;
  ctaHref?: string;
  reverse: boolean;
  badge?: string;
  backgroundColor?: string;
  disabled?: boolean;
}

export function AlternatingSection({
  title,
  description,
  benefits,
  image,
  imageAlt,
  ctaText,
  ctaHref,
  reverse,
  badge,
  backgroundColor = "transparent",
  disabled = false,
}: AlternatingSectionProps) {
  return (
    <section
      className="py-16 md:py-28"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`grid md:grid-cols-2 gap-16 md:gap-20 items-center ${
            reverse ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Content Column */}
          <div className={`${reverse ? "md:order-2" : "md:order-1"}`}>
            {badge && (
              <div className="inline-block mb-6">
                <span className="text-xs font-semibold px-4 py-2 rounded-full bg-white text-[#55A2C3] border border-[#55A2C3]/20 shadow-sm">
                  {badge}
                </span>
              </div>
            )}

            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {title}
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              {description}
            </p>

            <ul className="space-y-5 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4 group transition-all duration-200 hover:translate-x-1">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#55A2C3]/10 flex items-center justify-center mt-0.5 ring-1 ring-[#55A2C3]/20 group-hover:bg-[#55A2C3]/15 group-hover:ring-[#55A2C3]/30 transition-all duration-200">
                    <Check className="w-4 h-4 text-[#55A2C3]" strokeWidth={2.5} />
                  </div>
                  <span className="text-base md:text-lg leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>

            {disabled ? (
              <button
                disabled
                className="inline-block px-8 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed opacity-60 shadow-md"
              >
                {ctaText}
              </button>
            ) : (
              <Link
                href={ctaHref!}
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#55A2C3] text-white font-semibold rounded-lg hover:bg-[#4A8FA9] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
              >
                {ctaText}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* Image Column */}
          <div className={`${reverse ? "md:order-1" : "md:order-2"}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]">
              <Image
                src={image}
                alt={imageAlt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
