import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

const CARD_ICONS = ["🩺", "🧴", "🕐", "✨"];

export function WhyChooseUsSection() {
  const { content } = useSiteContent();
  const { whyChooseUs, pageBackgrounds } = content;

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center" id="why-choose-us">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${pageBackgrounds.whyChooseUs})` }}
      />
      <div className="absolute inset-0 overlay-gradient" />

      {/* Decorative corner accents */}
      <div
        className="absolute top-8 left-8 w-16 h-16 opacity-20"
        style={{
          borderTop: `2px solid ${BRAND_PINK}`,
          borderLeft: `2px solid ${BRAND_PINK}`,
        }}
      />
      <div
        className="absolute top-8 right-8 w-16 h-16 opacity-20"
        style={{
          borderTop: `2px solid ${BRAND_PINK}`,
          borderRight: `2px solid ${BRAND_PINK}`,
        }}
      />
      <div
        className="absolute bottom-8 left-8 w-16 h-16 opacity-20"
        style={{
          borderBottom: `2px solid ${BRAND_PINK}`,
          borderLeft: `2px solid ${BRAND_PINK}`,
        }}
      />
      <div
        className="absolute bottom-8 right-8 w-16 h-16 opacity-20"
        style={{
          borderBottom: `2px solid ${BRAND_PINK}`,
          borderRight: `2px solid ${BRAND_PINK}`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-8 py-16 md:py-24">
        <SectionHeaderEnhanced
          heading={whyChooseUs.heading}
          subtitle="What sets us apart — decades of expertise, genuine passion, and the finest products for your beloved pet."
          align="center"
          light
          badge="Why Choose Us"
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {whyChooseUs.cards.map((card, i) => (
              <div
                key={i}
                data-anime={i % 2 === 0 ? "fadeInLeft" : "fadeInRight"}
                data-anime-delay={i * 120}
                className="group"
              >
                <div
                  className="relative h-full rounded-2xl overflow-hidden border border-white/10 p-6 md:p-8 transition-all duration-500 hover:translate-y-[-4px]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(400px circle at 50% 50%, ${BRAND_PINK}15, transparent)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex items-start gap-4 md:gap-5">
                    {/* Icon container */}
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-5deg]"
                      style={{ backgroundColor: `${BRAND_PINK}25` }}
                    >
                      <span className="drop-shadow-lg">{CARD_ICONS[i]}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-white/65 text-sm md:text-base leading-relaxed">
                        {card.description}
                      </p>

                      {/* Animated underline on hover */}
                      <div
                        className="mt-3 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500"
                        style={{ backgroundColor: BRAND_PINK }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-[20%] right-[20%] h-[1px] opacity-40"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />
    </div>
  );
}

export default WhyChooseUsSection;
