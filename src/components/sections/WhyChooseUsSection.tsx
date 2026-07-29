import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/section-header";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

export function WhyChooseUsSection() {
  const { content } = useSiteContent();
  const { whyChooseUs, pageBackgrounds } = content;

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${pageBackgrounds.whyChooseUs})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(28,28,28,0.85) 0%, rgba(28,28,28,0.6) 50%, rgba(28,28,28,0.7) 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-8 py-16 md:py-24">
        <SectionHeader
          heading={whyChooseUs.heading}
          subtitle="What sets us apart — decades of expertise, genuine passion, and the finest products for your beloved pet."
          align="center"
          light
        />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {whyChooseUs.cards.map((card, i) => (
              <div
                key={i}
                data-anime={i < 2 ? "fadeInLeft" : "fadeInRight"}
                data-anime-delay={i * 150}
                className={`relative ${i === 0 ? "md:col-span-1" : ""} ${
                  i === whyChooseUs.cards.length - 1 ? "md:col-span-2 md:max-w-[50%] md:mx-auto" : ""
                }`}
              >
                <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 p-5 md:p-6"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}
                >
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      background: `radial-gradient(300px circle at ${i * 30 + 20}% ${i * 20 + 30}%, ${BRAND_PINK}, transparent)`,
                    }}
                  />
                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: `${BRAND_PINK}30` }}
                    >
                      <span>{card.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg md:text-xl font-bold text-white mb-1.5">
                        {card.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUsSection;
