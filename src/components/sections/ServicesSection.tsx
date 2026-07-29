import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/section-header";
import FeatureCarousel from "@/components/ui/feature-carousel";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;
const BRAND_CREAM = designTokens.brandCream;

export function ServicesSection() {
  const { content } = useSiteContent();
  const services = content.services;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-16 md:py-24 px-4"
      style={{ backgroundColor: BRAND_CREAM }}
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)` }}
      />

      <SectionHeader
        heading={services.heading}
        subtitle={services.subtitle}
        align="center"
      />

      <div className="w-full max-w-6xl mx-auto mt-4" data-anime="fadeInUp">
        <FeatureCarousel />
      </div>

      {/* Decorative bottom border */}
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)` }}
      />
    </div>
  );
}

export default ServicesSection;
