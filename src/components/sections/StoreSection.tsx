import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";
import { STORE_PHONE } from "@/config/store-products";
import { useSiteContent } from "@/context/SiteContentContext";

const BRAND_PINK = designTokens.brandPink;

export function StoreSection() {
  const { content } = useSiteContent();
  const highlights = content.store.highlights;

  return (
    <section
      id="store"
      className="relative w-full py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />

      <div className="px-4 md:px-8">
        <SectionHeaderEnhanced
          heading={content.store.heading}
          subtitle={content.store.subtitle}
          align="center"
          badge="Store"
        />
      </div>

      {/* Compact teaser card */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 mt-8 md:mt-10">
        <div className="rounded-3xl bg-white shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {highlights.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl md:text-3xl bg-brand-pink/10">
                    {item.emoji}
                  </div>
                  <p className="mt-2 text-[11px] md:text-xs font-medium text-brand-charcoal/80 leading-snug">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${STORE_PHONE}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: BRAND_PINK }}
              >
                <Phone size={16} /> Call to Order
              </a>
              <Link
                to="/store"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-heading font-semibold text-sm uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: BRAND_PINK, boxShadow: `0 8px 24px ${BRAND_PINK}40` }}
              >
                View Full Catalog <ArrowRight size={16} />
              </Link>
            </div>

            {/* Featured video teaser */}
            <div className="mt-8 pt-6 border-t border-brand-charcoal/10">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-brand-charcoal/50 mb-3">
                🎬 Featured Video
              </p>
              <div className="rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/se8Gi12ymSk"
                    title="Professional Pet Grooming"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
              <p className="text-center text-[11px] text-brand-charcoal/40 mt-2">
                More videos on the{" "}
                <Link to="/store" className="underline hover:text-brand-charcoal/60 transition-colors">
                  full catalog page
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div
        className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />
    </section>
  );
}

export default StoreSection;
