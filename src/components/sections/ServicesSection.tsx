import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import BounceCardsFeatures from "@/components/ui/bounce-card-features";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;
const BRAND_CREAM = designTokens.brandCream;

export function ServicesSection({
  onBookClick,
}: {
  onBookClick?: () => void;
}) {
  const { content } = useSiteContent();
  const services = content.services;

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center py-16 md:py-24 px-4 overflow-hidden"
      style={{ backgroundColor: BRAND_CREAM }}
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />

      {/* Background decorative elements */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.03] pointer-events-none"
        style={{ backgroundColor: BRAND_PINK }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-[0.03] pointer-events-none"
        style={{ backgroundColor: BRAND_PINK }}
      />

      <SectionHeaderEnhanced
        heading={services.heading}
        subtitle={services.subtitle}
        align="center"
        badge="Services"
      />

      <div className="w-full max-w-7xl mx-auto mt-2 md:mt-6" data-anime="fadeInUp">
        <BounceCardsFeatures onBookClick={onBookClick} />
      </div>

      {/* Decorative bottom border */}
      <div
        className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />
    </div>
  );
}

export default ServicesSection;
