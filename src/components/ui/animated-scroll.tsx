import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";
import { Shield, LogOut } from "lucide-react";
import { nhost } from "@/lib/nhost";
import BookingModal from "@/components/ui/booking-modal";
import AuthModal from "@/components/ui/AuthModal";
import AddPetModal from "@/components/ui/AddPetModal";
import UserMenu from "@/components/ui/UserMenu";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/config/site-content";
import { useAnimeScroll } from "@/hooks/use-anime-scroll";
import HeroSection from "@/components/sections/HeroSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import BookingSection from "@/components/sections/BookingSection";
import { SocialProofBar } from "@/components/ui/social-proof-bar";

const COUNT_MY_PETS = gql`
  query CountMyPetsAfterLogin {
    pets_aggregate {
      aggregate { count }
    }
  }
`;

export default function ScrollAdventure() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const bookingIntentRef = useRef(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const scrollRef = useAnimeScroll();
  const apolloClient = useApolloClient();

  // ALL EXISTING LOGIC REMAINS IDENTICAL
  const handleAuthSuccess = async () => {
    setAuthOpen(false);
    if (bookingIntentRef.current) {
      bookingIntentRef.current = false;
      setBookingOpen(true);
      return;
    }
    try {
      const { data } = await apolloClient.query<{
        pets_aggregate: { aggregate: { count: number } };
      }>({
        query: COUNT_MY_PETS,
        fetchPolicy: "network-only",
      });
      const count = data?.pets_aggregate?.aggregate?.count ?? 0;
      if (count === 0) {
        setShowPetForm(true);
      }
    } catch (err) {
      console.error("Failed to check pet count:", err);
    }
  };

  const handleLogout = async () => {
    await nhost.auth.signOut({});
    navigate("/");
  };

  const handleBookClick = () => {
    if (user) {
      setBookingOpen(true);
    } else {
      bookingIntentRef.current = true;
      setAuthOpen(true);
    }
  };

  return (
    <div ref={scrollRef} className="bg-brand-cream select-none">

      {/* Top nav bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <UserMenu />
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-charcoal text-sm font-medium hover:bg-white/30 hover:border-red-300/50 transition-all"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        )}
      </div>

      {isAdmin(user?.email) && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-charcoal text-sm font-medium hover:bg-white/30 hover:border-white/50 transition-all"
          >
            <Shield size={16} />
            Admin Panel
          </button>
        </div>
      )}

      {/* Section 1: Hero */}
      <section id="hero">
        <HeroSection onBookClick={handleBookClick} heroVideoRef={heroVideoRef} />
      </section>

      {/* Social Proof Bar */}
      <SocialProofBar />

      {/* Section 2: Why Choose Us */}
      <section id="why-choose-us">
        <WhyChooseUsSection />
      </section>

      {/* Section 3: Services */}
      <section id="services">
        <ServicesSection />
      </section>

      {/* Section 4: Reviews */}
      <section id="reviews">
        <ReviewsSection />
      </section>

      {/* Section 5: Booking */}
      <section id="booking">
        <BookingSection onBookClick={handleBookClick} />
      </section>

      {/* Footer */}
      <footer
        className="w-full py-8 text-center"
        style={{ backgroundColor: "#1c1c1c" }}
      >
        <p className="text-white/40 text-xs">
          &copy; {new Date().getFullYear()} Gods Creatures Pet Groomers. All rights reserved.
        </p>
        <p className="text-white/30 text-[10px] mt-1">
          Malki, Nongshiliang, Shillong, Meghalaya
        </p>
      </footer>

      {/* Modals — EXACTLY AS BEFORE, unchanged */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => { setAuthOpen(false); bookingIntentRef.current = false; }}
        onAuthSuccess={handleAuthSuccess}
      />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      <AddPetModal
        isOpen={showPetForm}
        onClose={() => setShowPetForm(false)}
      />
    </div>
  );
}
