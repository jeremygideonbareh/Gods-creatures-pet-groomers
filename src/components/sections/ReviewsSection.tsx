import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/section-header";
import ImageAutoSlider from "@/components/ui/image-auto-slider";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;
const BRAND_CREAM = designTokens.brandCream;

export function ReviewsSection() {
  const { content } = useSiteContent();
  const { reviews, pageBackgrounds } = content;

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Split layout */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left: Image collage */}
        <div className="relative w-full md:w-1/2 min-h-[40vh] md:min-h-screen overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${pageBackgrounds.reviews})` }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(28,28,28,0.6), rgba(28,28,28,0.3))` }} />

          {/* Floating review images */}
          <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
            <ImageAutoSlider />
          </div>
        </div>

        {/* Right: Testimonials */}
        <div
          className="relative w-full md:w-1/2 min-h-[60vh] md:min-h-screen flex items-center"
          style={{ backgroundColor: BRAND_CREAM }}
        >
          <div className="w-full px-6 md:px-10 py-12 md:py-16">
            <SectionHeader
              heading={reviews.heading}
              subtitle="Real words from real pet parents."
              align="left"
            />

            <div className="space-y-4 mt-6" data-anime="fadeInUp">
              {reviews.testimonials.map((t, i) => (
                <div
                  key={i}
                  data-anime="fadeInRight"
                  data-anime-delay={i * 200}
                  className="relative rounded-2xl p-5 md:p-6 border border-brand-pink/20"
                  style={{
                    backgroundColor: `${BRAND_PINK}10`,
                    borderLeft: `3px solid ${BRAND_PINK}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: BRAND_PINK }}
                    >
                      {t.emoji}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-brand-charcoal text-sm">
                        {t.author}
                      </p>
                      <p className="text-muted-foreground text-xs">{t.tag}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    &ldquo;{t.textLong}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewsSection;
