import { bookingSection, pageBackgrounds, designTokens } from "@/config/site-content";

interface BookingSectionProps {
  onBookClick: () => void;
}

const BRAND_PINK = designTokens.brandPink;

export function BookingSection({ onBookClick }: BookingSectionProps) {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <div className="relative w-full md:w-1/2 h-[30%] md:h-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${pageBackgrounds.booking})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative w-full md:w-1/2 h-[70%] md:h-full overflow-hidden">
        <div className="flex flex-col items-center justify-center h-full text-white px-6 md:px-8 py-6 md:py-8">
          <h2 className="text-xl md:text-3xl uppercase mb-4 md:mb-6 text-center font-bold drop-shadow-lg">
            {bookingSection.heading}
          </h2>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 w-full max-w-sm">
            <p className="text-white/90 text-sm flex items-center gap-2">
              <span>{bookingSection.locationIcon}</span> {bookingSection.location}
            </p>
            <p className="text-white/90 text-sm flex items-center gap-2 mt-2">
              <span>{bookingSection.hoursIcon}</span> {bookingSection.hours}
            </p>
            <p className="text-white/90 text-sm flex items-center gap-2 mt-2">
              <span>{bookingSection.phoneIcon}</span> {bookingSection.phone}
            </p>
          </div>
          <button
            onClick={onBookClick}
            className="mt-4 md:mt-6 px-8 md:px-10 py-3 md:py-4 rounded-full text-white font-semibold text-base md:text-lg uppercase tracking-wider transition-transform hover:scale-105"
            style={{ backgroundColor: BRAND_PINK }}
          >
            {bookingSection.ctaIcon} {bookingSection.cta}
          </button>
          <p className="text-white/60 text-xs mt-3">
            {bookingSection.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingSection;
