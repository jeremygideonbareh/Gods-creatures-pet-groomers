import type { RefObject } from "react";
import { hero } from "@/config/site-content";

interface HeroSectionProps {
  setBookingOpen: (open: boolean) => void;
  heroVideoRef: RefObject<HTMLVideoElement | null>;
}

const BASE = import.meta.env.BASE_URL;

export function HeroSection({ setBookingOpen, heroVideoRef }: HeroSectionProps) {
  return (
    <div className="absolute inset-0">
      <video
        ref={heroVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={`${BASE}${hero.video}`}
        poster={`${BASE}${hero.poster}`}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-8">
        <h2 className="text-2xl md:text-5xl uppercase mb-4 text-center font-bold drop-shadow-lg max-w-2xl">
          {hero.title}
        </h2>
        <p className="text-sm md:text-xl text-center max-w-lg drop-shadow-md">
          {hero.subtitle}
        </p>
        <button
          onClick={() => setBookingOpen(true)}
          className="liquid-glass mt-6 md:mt-8 px-8 md:px-12 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg uppercase tracking-wider transition-transform hover:scale-105 text-white"
        >
          🐾 {hero.cta}
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
