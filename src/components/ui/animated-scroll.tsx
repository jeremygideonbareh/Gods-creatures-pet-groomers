import { useRef, useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";
import { useAuth } from "@/context/AuthContext";
import { useAnimeScroll } from "@/hooks/use-anime-scroll";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Navbar } from "@/components/ui/navbar";
import HeroSection from "@/components/sections/HeroSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { StoreSection } from "@/components/sections/StoreSection";
import BookingSection from "@/components/sections/BookingSection";
import { EnhancedFooter } from "@/components/ui/footer-enhanced";
import BookingModal from "@/components/ui/booking-modal";
import AuthModal from "@/components/ui/AuthModal";
import AddPetModal from "@/components/ui/AddPetModal";

const COUNT_MY_PETS = gql`
  query CountMyPetsAfterLogin {
    pets_aggregate {
      aggregate { count }
    }
  }
`;

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "why-choose-us", label: "Why Us" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
  { id: "team", label: "About" },
  { id: "store", label: "Store" },
  { id: "booking", label: "Book" },
];

export default function ScrollAdventure() {
  const { user } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
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

  // Scroll-aware navbar + active section tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);

      // Update active section based on scroll position
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Fixed top navigation bar */}
      <Navbar
        scrolled={scrolled}
        activeSection={activeSection}
        navItems={NAV_ITEMS}
        onNavClick={scrollToSection}
        onBookClick={handleBookClick}
      />

      {/* Spacer for fixed nav */}
      <div className="h-0" />

      {/* Section 1: Hero */}
      <section id="hero">
        <HeroSection onBookClick={handleBookClick} heroVideoRef={heroVideoRef} />
      </section>

      {/* Section 2: Why Choose Us */}
      <section id="why-choose-us">
        <WhyChooseUsSection onBookClick={handleBookClick} />
      </section>


      {/* Section 3: Services */}
      <section id="services">
        <ServicesSection onBookClick={handleBookClick} />
      </section>

      {/* Section 4: Gallery */}
      <section id="gallery">
        <GallerySection />
      </section>

      {/* Section 5: Reviews */}
      <section id="reviews">
        <ReviewsSection />
      </section>

      {/* NEW: Team Section */}
      <AboutSection />

      {/* NEW: Process Section */}
      <ProcessSection />

      {/* NEW: FAQ Section */}
      <FAQSection />

      {/* NEW: Blog Section */}
      <BlogSection />

      {/* NEW: Store Section */}
      <StoreSection />

      {/* Section 6: Booking */}
      <section id="booking">
        <BookingSection onBookClick={handleBookClick} />
      </section>

      {/* Footer */}
      <EnhancedFooter />

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
