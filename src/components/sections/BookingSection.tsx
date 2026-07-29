import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";

interface BookingSectionProps {
  onBookClick: () => void;
}

const BRAND_PINK = designTokens.brandPink;
const BRAND_CHARCOAL = designTokens.brandCharcoal;

export function BookingSection({ onBookClick }: BookingSectionProps) {
  const { content } = useSiteContent();
  const booking = content.booking;
  const pageBackgrounds = content.pageBackgrounds;

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[15s]"
        style={{ backgroundImage: `url(${pageBackgrounds.booking})` }}
      />
      <div
        className="absolute inset-0 overlay-gradient"
      />

      {/* Decorative pink line - top */}
      <div
        className="absolute top-0 left-[15%] right-[15%] h-[1px] opacity-60 z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />

      {/* Corner decorations */}
      <div
        className="absolute top-8 right-8 w-16 h-16 opacity-20 z-10"
        style={{
          borderTop: `2px solid ${BRAND_PINK}`,
          borderRight: `2px solid ${BRAND_PINK}`,
        }}
      />
      <div
        className="absolute bottom-8 left-8 w-16 h-16 opacity-20 z-10"
        style={{
          borderBottom: `2px solid ${BRAND_PINK}`,
          borderLeft: `2px solid ${BRAND_PINK}`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 items-center">
            {/* Left: Info (3 columns) */}
            <div className="lg:col-span-3" data-anime="fadeInLeft">
              <SectionHeaderEnhanced
                heading={booking.heading}
                subtitle={booking.subtitle}
                align="left"
                light
                badge="Get in Touch"
              />

              {/* Contact details */}
              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4 text-white/80 group" data-anime="fadeInUp" data-anime-delay="100">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${BRAND_PINK}30` }}
                  >
                    <span className="text-lg">{booking.locationIcon}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm uppercase tracking-wider">Location</p>
                    <p className="text-white/60 text-sm mt-0.5">{booking.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-white/80 group" data-anime="fadeInUp" data-anime-delay="200">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${BRAND_PINK}30` }}
                  >
                    <span className="text-lg">{booking.hoursIcon}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm uppercase tracking-wider">Hours</p>
                    <p className="text-white/60 text-sm mt-0.5">{booking.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-white/80 group" data-anime="fadeInUp" data-anime-delay="300">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${BRAND_PINK}30` }}
                  >
                    <span className="text-lg">{booking.phoneIcon}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm uppercase tracking-wider">Call Us</p>
                    <p className="text-white/60 text-sm mt-0.5">{booking.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: CTA Card (2 columns) */}
            <div className="lg:col-span-2" data-anime="fadeInRight" data-anime-delay="200">
              <div
                className="relative rounded-2xl p-6 md:p-8 lg:p-10 overflow-hidden border border-white/15 transition-all duration-500 hover:translate-y-[-4px]"
                style={{
                  backgroundColor: `${BRAND_PINK}18`,
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                }}
              >
                {/* Glow effect */}
                <div
                  className="absolute -inset-20 opacity-30"
                  style={{
                    background: `radial-gradient(600px circle at 50% 50%, ${BRAND_PINK}15, transparent)`,
                  }}
                />

                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5"
                    style={{ backgroundColor: `${BRAND_PINK}30` }}
                  >
                    <span>{booking.ctaIcon}</span>
                  </div>

                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                    Ready to pamper your pet?
                  </h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed max-w-xs mx-auto">
                    {booking.bookingFeeDetail}
                  </p>

                  <button
                    onClick={onBookClick}
                    className="group relative w-full py-4 rounded-full font-semibold text-base md:text-lg uppercase tracking-wider transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: BRAND_PINK, color: BRAND_CHARCOAL }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>{booking.ctaIcon}</span>
                      <span>{booking.cta}</span>
                    </span>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                      }}
                    />
                  </button>

                  <p className="text-white/50 text-xs mt-4">
                    {booking.questionsCta}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative pink line - bottom */}
      <div
        className="absolute bottom-0 left-[15%] right-[15%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />
    </div>
  );
}

export default BookingSection;
