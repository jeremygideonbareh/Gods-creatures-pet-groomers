import { useSiteContent } from "@/context/SiteContentContext";
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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${pageBackgrounds.booking})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(28,28,28,0.8) 0%, rgba(28,28,28,0.5) 100%)`,
        }}
      />

      {/* Decorative pink line */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)` }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Info */}
            <div data-anime="fadeInLeft">
              <span
                className="text-xs uppercase tracking-[0.25em] font-medium text-white/60"
              >
                Get in Touch
              </span>
              <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mt-3 leading-tight">
                {booking.heading}
              </h2>
              <p className="text-white/70 mt-4 text-base md:text-lg leading-relaxed max-w-md">
                {booking.subtitle}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 text-white/80">
                  <span className="text-lg mt-0.5">{booking.locationIcon}</span>
                  <div>
                    <p className="text-white font-medium text-sm">Location</p>
                    <p className="text-white/60 text-sm">{booking.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-white/80">
                  <span className="text-lg mt-0.5">{booking.hoursIcon}</span>
                  <div>
                    <p className="text-white font-medium text-sm">Hours</p>
                    <p className="text-white/60 text-sm">{booking.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-white/80">
                  <span className="text-lg mt-0.5">{booking.phoneIcon}</span>
                  <div>
                    <p className="text-white font-medium text-sm">Call Us</p>
                    <p className="text-white/60 text-sm">{booking.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: CTA Card */}
            <div data-anime="fadeInRight" data-anime-delay="200">
              <div className="relative rounded-2xl p-6 md:p-8 border border-white/20"
                style={{ backgroundColor: `${BRAND_PINK}20`, backdropFilter: "blur(20px)" }}
              >
                <div className="relative z-10 text-center">
                  <p className="text-5xl mb-4">{booking.ctaIcon}</p>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                    Ready to pamper your pet?
                  </h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    {booking.bookingFeeDetail}
                  </p>
                  <button
                    onClick={onBookClick}
                    className="group relative w-full py-4 rounded-full font-semibold text-base md:text-lg uppercase tracking-wider transition-all duration-300 overflow-hidden"
                    style={{ backgroundColor: BRAND_PINK, color: BRAND_CHARCOAL }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {booking.ctaIcon} {booking.cta}
                    </span>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
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

      {/* Bottom pink line */}
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)` }}
      />
    </div>
  );
}

export default BookingSection;
