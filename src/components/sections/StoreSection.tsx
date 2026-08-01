import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";
import { STORE_PHONE } from "@/config/store-products";

const BRAND_PINK = designTokens.brandPink;

const TEASER_HIGHLIGHTS = [
  { emoji: "🛁", label: "Coats & Shampoos" },
  { emoji: "✨", label: "Wellness Essentials" },
  { emoji: "🎾", label: "Play & Treats" },
];

export function StoreSection() {
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
          heading="Pet Store"
          subtitle="Coats, shampoos and wellness essentials for your furry friend — call to order and we'll have it ready for pickup."
          align="center"
          badge="Store"
        />
      </div>

      {/* Compact teaser card */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 mt-8 md:mt-10">
        <div className="rounded-3xl bg-white shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {TEASER_HIGHLIGHTS.map((item) => (
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
