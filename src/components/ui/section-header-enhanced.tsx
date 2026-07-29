import { designTokens } from "@/config/site-content";

interface SectionHeaderEnhancedProps {
  heading: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  badge?: string;
}

const BRAND_PINK = designTokens.brandPink;

export function SectionHeaderEnhanced({
  heading,
  subtitle,
  align = "center",
  light = false,
  badge,
}: SectionHeaderEnhancedProps) {
  const textColor = light ? "text-white" : "text-brand-charcoal";
  const subTextColor = light ? "text-white/70" : "text-muted-foreground";

  return (
    <div
      className={`max-w-3xl mb-10 md:mb-14 ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
      data-anime="fadeInUp"
    >
      {badge && (
        <span
          className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium mb-4"
          style={{
            backgroundColor: `${BRAND_PINK}20`,
            color: BRAND_PINK,
            border: `1px solid ${BRAND_PINK}30`,
          }}
        >
          {badge}
        </span>
      )}
      <h2
        className={`font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight ${textColor}`}
      >
        {heading.split(" ").map((word, i) => (
          <span key={i}>
            {i === heading.split(" ").length - 1 ? (
              <span
                className="inline-block"
                style={{ color: i === 0 ? BRAND_PINK : undefined }}
              >
                {word}
              </span>
            ) : (
              <span>{word} </span>
            )}
          </span>
        ))}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 md:mt-5 text-sm md:text-lg leading-relaxed max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          } ${subTextColor}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
