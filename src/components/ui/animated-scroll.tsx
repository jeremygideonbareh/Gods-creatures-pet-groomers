import { useRef, useState } from "react";
import BookingModal from "@/components/ui/booking-modal";
import UserMenu from "@/components/ui/UserMenu";
import HeroSection from "@/components/sections/HeroSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import BookingSection from "@/components/sections/BookingSection";

export default function ScrollAdventure() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <div className="bg-black select-none">
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

      <div className="fixed top-4 right-4 z-50">
        <UserMenu />
      </div>

      <section id="hero">
        <HeroSection setBookingOpen={setBookingOpen} heroVideoRef={heroVideoRef} />
      </section>

      <section id="why-choose-us">
        <WhyChooseUsSection />
      </section>

      <section id="services">
        <ServicesSection />
      </section>

      <section id="reviews">
        <ReviewsSection />
      </section>

      <section id="booking">
        <BookingSection setBookingOpen={setBookingOpen} />
      </section>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
