import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
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
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[20s] hover:scale-110"
            style={{ backgroundImage: `url(${pageBackgrounds.reviews})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, rgba(28,28,28,0.6) 0%, rgba(28,28,28,0.3) 50%, rgba(28,28,28,0.5) 100%)`,
            }}
          />

          {/* Decorative corner */}
          <div
            className="absolute top-6 left-6 w-12 h-12 opacity-30"
            style={{
              borderTop: `2px solid ${BRAND_PINK}`,
              borderLeft: `2px solid ${BRAND_PINK}`,
            }}
          />

          {/* Floating review images */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <ImageAutoSlider />
          </div>
        </div>

        {/* Right: Testimonials */}
        <div
          className="relative w-full md:w-1/2 min-h-[60vh] md:min-h-screen flex items-center"
          style={{ backgroundColor: BRAND_CREAM }}
        >
          {/* Decorative pink circle */}
          <div
            className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-[0.04] pointer-events-none"
            style={{ backgroundColor: BRAND_PINK }}
          />

          <div className="w-full px-6 md:px-10 lg:px-14 py-12 md:py-16">
            <SectionHeaderEnhanced
              heading={reviews.heading}
              subtitle="Real words from real pet parents who trust us with their fur babies."
              align="left"
              badge="Testimonials"
            />

            <div className="space-y-4 md:space-y-5 mt-8" data-anime="fadeInUp">
              {reviews.testimonials.map((t, i) => (
                <div
                  key={i}
                  data-anime={i === 0 ? "fadeInLeft" : "fadeInRight"}
                  data-anime-delay={i * 150}
                  className="group relative rounded-2xl p-5 md:p-6 transition-all duration-300 hover:translate-x-1"
                  style={{
                    backgroundColor: `${BRAND_PINK}08`,
                    borderLeft: `3px solid ${BRAND_PINK}`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(600px circle at 50% 50%, ${BRAND_PINK}08, transparent)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Author row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md"
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
                      {/* Quote mark */}
                      <span className="ml-auto text-3xl leading-none opacity-20 select-none"
                        style={{ color: BRAND_PINK }}
                      >
                        &ldquo;
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed italic relative pl-3"
                      style={{ borderLeft: `2px solid ${BRAND_PINK}30` }}
                    >
                      &ldquo;{t.textLong}&rdquo;
                    </p>
                  </div>
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
