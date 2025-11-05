import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

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
      className="py-12 md:py-20"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${
            reverse ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Content Column */}
          <div className={`${reverse ? "md:order-2" : "md:order-1"}`}>
            {badge && (
              <div className="inline-block mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-[#55A2C3] to-[#4A8FA9] text-white">
                  {badge}
                </span>
              </div>
            )}

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {title}
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {description}
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-base md:text-lg">{benefit}</span>
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
                className="inline-block px-8 py-3 bg-[#55A2C3] text-white font-semibold rounded-lg hover:bg-[#4A8FA9] transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {ctaText}
              </Link>
            )}
          </div>

          {/* Image Column */}
          <div className={`${reverse ? "md:order-1" : "md:order-2"}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
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
