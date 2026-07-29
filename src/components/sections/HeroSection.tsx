import { useEffect, useRef, type RefObject } from "react";
import { animate, stagger, createTimeline } from "animejs";
import { useSiteContent } from "@/context/SiteContentContext";
import { designTokens } from "@/config/site-content";

const BASE = import.meta.env.BASE_URL;
const BRAND_PINK = designTokens.brandPink;
const BRAND_CHARCOAL = designTokens.brandCharcoal;

interface HeroSectionProps {
  onBookClick: () => void;
  heroVideoRef: RefObject<HTMLVideoElement | null>;
}

export function HeroSection({ onBookClick, heroVideoRef }: HeroSectionProps) {
  const { content } = useSiteContent();
  const hero = content.hero;
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation sequence using anime.js v4 timeline
    const tl = createTimeline();

    if (overlayRef.current) {
      tl.add(overlayRef.current, {
        opacity: [0, 1],
        duration: 1200,
        easing: "easeOutExpo",
      });
    }

    const heroLines = textRef.current?.querySelectorAll(".hero-line");
    if (heroLines && heroLines.length > 0) {
      tl.add(heroLines, {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 900,
        delay: stagger(180, { from: "first" }),
        easing: "easeOutExpo",
      }, "-=800");
    }

    tl.add(".hero-cta", {
      opacity: [0, 1],
      scale: [0.92, 1],
      duration: 700,
      easing: "easeOutExpo",
    }, "-=500");

    if (scrollIndicatorRef.current) {
      tl.add(scrollIndicatorRef.current, {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600,
        easing: "easeOutExpo",
      }, "-=300");
    }

    // Floating paw print particles
    if (particlesRef.current) {
      const paws = particlesRef.current.querySelectorAll(".paw-particle");
      paws.forEach((paw, i) => {
        animate(paw, {
          translateY: [
            Math.random() * 20 - 10,
            Math.random() * -80 - 20,
          ],
          translateX: [
            Math.random() * 20 - 10,
            Math.random() * 40 - 20,
          ],
          opacity: [0.3, 0],
          scale: [0.8, 1.2],
          duration: 4000 + Math.random() * 3000,
          delay: i * 800,
          loop: true,
          easing: "easeOutCubic",
        });
      });
    }

    return () => {
      // Cleanup is handled by anime.js scope if used
    };
  }, []);

  const handleLearnMore = () => {
    const nextSection = document.getElementById("why-choose-us");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-charcoal">
      {/* Video Background */}
      <video
        ref={heroVideoRef}
        className="absolute inset-0 w-full h-full object-cover scale-105"
        src={`${BASE}${hero.video}`}
        poster={`${BASE}${hero.poster}`}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Gradient Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 opacity-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(28, 28, 28, 0.8) 0%,
              rgba(28, 28, 28, 0.35) 45%,
              rgba(28, 28, 28, 0.5) 100%
            )
          `,
        }}
      />

      {/* Pattern overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-80 z-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, #e8b4b5, ${BRAND_PINK}, transparent)`,
          backgroundSize: "200% 100%",
        }}
      />

      {/* Floating paw print particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
      >
        {["🐾", "🐾", "🐾", "🐾", "🐾"].map((_, i) => (
          <span
            key={i}
            className="paw-particle absolute text-white/20 text-xl"
            style={{
              left: `${20 + i * 15}%`,
              bottom: `${10 + Math.random() * 30}%`,
              fontSize: `${1.2 + Math.random() * 1.5}rem`,
            }}
          >
            🐾
          </span>
        ))}
      </div>

      {/* Content */}
      <div
        ref={textRef}
        className="relative z-20 flex flex-col items-center justify-center h-full text-white p-6 md:p-12 lg:p-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Small badge */}
          <div className="hero-line opacity-0 mb-4 md:mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium"
              style={{
                backgroundColor: `${BRAND_PINK}25`,
                color: BRAND_PINK,
                border: `1px solid ${BRAND_PINK}40`,
              }}
            >
              ✦ Premium Pet Grooming Since 2018
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-line opacity-0 font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[1.05] tracking-tight drop-shadow-2xl">
            {hero.title.split(" ").map((word, i) => (
              <span
                key={i}
                className="inline-block mr-[0.12em] hover:scale-105 transition-transform duration-300"
              >
                {word}
                {i === hero.title.split(" ").length - 1 ? "" : " "}
              </span>
            ))}
          </h1>

          {/* Decorated divider */}
          <div className="hero-line opacity-0 flex items-center justify-center gap-3 mt-6 mb-6">
            <div className="w-12 h-[1px]" style={{ backgroundColor: `${BRAND_PINK}60` }} />
            <span className="text-lg">✦</span>
            <div className="w-12 h-[1px]" style={{ backgroundColor: `${BRAND_PINK}60` }} />
          </div>

          {/* Subtitle */}
          <p className="hero-line opacity-0 text-base md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
            {hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta opacity-0 mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBookClick}
              className="group relative px-10 py-4 rounded-full font-semibold text-base md:text-lg uppercase tracking-wider transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              style={{ backgroundColor: BRAND_PINK, color: BRAND_CHARCOAL }}
            >
              <span className="relative z-10 flex items-center gap-2">
                🐾 {hero.cta}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                }}
              />
            </button>

            <button
              onClick={handleLearnMore}
              className="px-8 py-4 rounded-full font-medium text-sm md:text-base tracking-wider border border-white/25 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Learn More</span>
              <span className="group-hover:translate-y-0.5 transition-transform duration-300">↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 cursor-pointer"
        onClick={handleLearnMore}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div
              className="w-1.5 h-1.5 rounded-full animate-scroll-indicator"
              style={{ backgroundColor: BRAND_PINK }}
            />
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-[15%] right-[15%] h-[1px] opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}60, transparent)`,
        }}
      />
    </div>
  );
}

export default HeroSection;
