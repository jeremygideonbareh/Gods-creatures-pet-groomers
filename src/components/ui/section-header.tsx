import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

interface SectionHeaderProps {
  heading: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}

export function SectionHeader({ heading, subtitle, align = "center", light = false }: SectionHeaderProps) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"} mb-8 md:mb-12`}
      data-anime="fadeInUp"
    >
      <span
        className="inline-block w-12 h-0.5 rounded-full mb-4"
        style={{ backgroundColor: BRAND_PINK }}
      />
      <h2
        className={`font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight ${
          light ? "text-white" : "text-brand-charcoal"
        }`}
      >
        {heading}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 md:mt-4 text-base md:text-lg leading-relaxed max-w-xl ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-white/70" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
