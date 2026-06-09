import { ChevronUp, ChevronDown } from "lucide-react";
import BookingModal from "@/components/ui/booking-modal";
import UserMenu from "@/components/ui/UserMenu";
import { useSnapScroll } from "@/hooks/use-snap-scroll";
import { designTokens } from "@/config/site-content";
import HeroSection from "@/components/sections/HeroSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import BookingSection from "@/components/sections/BookingSection";

const NUM_PAGES = 5;
const BRAND_PINK = designTokens.brandPink;

export default function ScrollAdventure() {
  const {
    currentPage,
    bookingOpen,
    setBookingOpen,
    heroVideoRef,
    goToPage,
  } = useSnapScroll(NUM_PAGES);

  const pages = [1, 2, 3, 4, 5];

  return (
    <div className="relative overflow-hidden h-screen bg-black select-none">
      <style>{`
        @keyframes liquidFlow {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
        .liquid-glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.28) 75%, rgba(255,255,255,0.08) 100%);
          background-size: 400% 400%;
          animation: liquidFlow 6s ease infinite;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 4px 24px rgba(255,255,255,0.08);
        }
        .liquid-glass:hover {
          border-color: rgba(255,255,255,0.5);
          box-shadow: 0 4px 32px rgba(255,255,255,0.15);
        }
      `}</style>

      <div className="absolute top-4 right-4 z-50">
        <UserMenu />
      </div>

      {pages.map((idx) => {
        const isActive = currentPage === idx;
        const transY = isActive
          ? "translateY(0)"
          : idx < currentPage
          ? "translateY(-100%)"
          : "translateY(100%)";

        const section = (() => {
          switch (idx) {
            case 1:
              return (
                <HeroSection
                  setBookingOpen={setBookingOpen}
                  heroVideoRef={heroVideoRef}
                />
              );
            case 2:
              return <WhyChooseUsSection />;
            case 3:
              return <ServicesSection />;
            case 4:
              return <ReviewsSection />;
            case 5:
              return (
                <BookingSection setBookingOpen={setBookingOpen} />
              );
            default:
              return null;
          }
        })();

        return (
          <div
            key={idx}
            className="absolute inset-0 transition-transform duration-[1000ms]"
            style={{ transform: transY }}
          >
            {section}
          </div>
        );
      })}

      <div className="absolute bottom-6 right-6 z-50 flex gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
            aria-label="Previous page"
          >
            <ChevronUp size={20} />
          </button>
        )}
        {currentPage < NUM_PAGES && (
          <button
            onClick={() => goToPage(currentPage + 1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
            aria-label="Next page"
          >
            <ChevronDown size={20} />
          </button>
        )}
      </div>

      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5">
        {pages.map((idx) => {
          const isActive = currentPage === idx;
          return (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive ? "scale-150" : "opacity-40 hover:opacity-70"
              }`}
              style={{
                backgroundColor: isActive ? BRAND_PINK : "white",
              }}
              aria-label={`Go to page ${idx}`}
            />
          );
        })}
      </div>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
