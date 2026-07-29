import { useEffect, useRef, type RefObject } from "react";
import anime from "animejs";
import { useSiteContent } from "@/context/SiteContentContext";
import { designTokens } from "@/config/site-content";

const BASE = import.meta.env.BASE_URL;
const BRAND_PINK = designTokens.brandPink;

interface HeroSectionProps {
  onBookClick: () => void;
  heroVideoRef: RefObject<HTMLVideoElement | null>;
}

export function HeroSection({ onBookClick, heroVideoRef }: HeroSectionProps) {
  const { content } = useSiteContent();
  const hero = content.hero;
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animation sequence
    const timeline = anime.timeline({ easing: "easeOutExpo" });
    timeline
      .add({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 1000,
      })
      .add(
        {
          targets: textRef.current?.querySelectorAll(".hero-line"),
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 800,
          delay: anime.stagger(200),
        },
        "-=600"
      )
      .add(
        {
          targets: ".hero-cta",
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 600,
        },
        "-=400"
      );
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
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

      {/* Gradient Overlay — premium dark gradient rather than flat black */}
      <div
        ref={overlayRef}
        className="absolute inset-0 opacity-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(28, 28, 28, 0.75) 0%,
              rgba(28, 28, 28, 0.4) 40%,
              rgba(28, 28, 28, 0.2) 100%
            )
          `,
        }}
      />

      {/* Decorative pink line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />

      {/* Content */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center justify-center h-full text-white p-6 md:p-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Small badge */}
          <div className="hero-line opacity-0 mb-4 md:mb-6">
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-medium text-white/80">
              ✦ Premium Pet Grooming Since 2018
            </span>
          </div>

          {/* Main Heading — DM Serif Display for luxury feel */}
          <h1 className="hero-line opacity-0 font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight drop-shadow-xl">
            {hero.title.split(" ").map((word, i) => (
              <span key={i} className="inline-block mr-[0.15em]">
                {word}
                {i === hero.title.split(" ").length - 1 ? "" : " "}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="hero-line opacity-0 text-base md:text-xl lg:text-2xl text-white/80 mt-4 md:mt-6 max-w-2xl mx-auto leading-relaxed font-light">
            {hero.subtitle}
          </p>

          {/* CTA Button */}
          <div className="hero-cta opacity-0 mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBookClick}
              className="group relative px-10 py-4 rounded-full font-semibold text-base md:text-lg uppercase tracking-wider transition-all duration-300 overflow-hidden"
              style={{ backgroundColor: BRAND_PINK, color: "#1c1c1c" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                🐾 {hero.cta}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                }}
              />
            </button>

            <button
              onClick={onBookClick}
              className="px-8 py-4 rounded-full font-medium text-sm md:text-base tracking-wider border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-all duration-300"
            >
              Learn More →
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="hero-line opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-white/40 text-xs uppercase tracking-[0.2em]">
              Scroll
            </span>
            <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center p-1">
              <div
                className="w-1 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: BRAND_PINK }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
