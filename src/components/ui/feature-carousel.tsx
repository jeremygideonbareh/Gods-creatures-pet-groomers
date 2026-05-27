"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bath, Scissors, Smile, PawPrint, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    id: "luxury-bath",
    label: "Luxury bath & blow-dry",
    icon: Bath,
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=900&auto=format&fit=crop&q=60",
    description: "Soft pastel shampoos, deep conditioning, and fluffy finishes. High premium imported products for extra care.",
  },
  {
    id: "stylish-haircut",
    label: "Stylish haircut",
    icon: Scissors,
    image:
      "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=900&auto=format&fit=crop&q=60",
    description: "Precision styling by experienced groomers who understand every breed's unique beauty — using professional-grade tools for a flawless finish.",
  },
  {
    id: "dental-hygiene",
    label: "Dental hygiene",
    icon: Smile,
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&auto=format&fit=crop&q=60",
    description: "Professional dental care backed by years of veterinary expertise for a sparkling healthy smile.",
  },
  {
    id: "pawdicure",
    label: "Pawdicure & nail art",
    icon: PawPrint,
    image:
      "https://images.unsplash.com/photo-1544568100-847a948585b9?w=900&auto=format&fit=crop&q=60",
    description: "Gentle paw care with imported balms and creative pet-safe colours, handled with expert precision and care.",
  },
];

const AUTO_PLAY_INTERVAL = 3000;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const BRAND_PINK = "#d0999a";

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setStep((s) => s - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setStep((s) => s + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:p-8">
      <div className="relative overflow-hidden rounded-none md:rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row min-h-[300px] lg:aspect-video border border-border/40">
        <div
          className="w-full lg:w-[40%] min-h-[180px] md:min-h-[350px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-6 md:px-16 lg:pl-16"
          style={{ backgroundColor: BRAND_PINK }}
        >
          <div
            className="absolute inset-x-0 top-0 h-8 md:h-20 lg:h-16 bg-gradient-to-b z-40"
            style={{
              background: `linear-gradient(to bottom, ${BRAND_PINK}, ${BRAND_PINK}80, transparent)`,
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-8 md:h-20 lg:h-16 bg-gradient-to-t z-40"
            style={{
              background: `linear-gradient(to top, ${BRAND_PINK}, ${BRAND_PINK}80, transparent)`,
            }}
          />
          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(FEATURES.length / 2),
                FEATURES.length / 2,
                distance
              );

              return (
                <motion.div
                  key={feature.id}
                  style={{
                    height: ITEM_HEIGHT,
                    width: "fit-content",
                  }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-3 md:gap-4 px-4 md:px-10 lg:px-8 py-2 md:py-5 lg:py-4 rounded-full transition-all duration-700 text-left group border",
                      isActive
                        ? "bg-white z-10"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                    )}
                    style={isActive ? { color: BRAND_PINK, borderColor: "white" } : {}}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500",
                      )}
                      style={isActive ? { color: BRAND_PINK } : { color: "rgba(255,255,255,0.4)" }}
                    >
                      <feature.icon size={16} strokeWidth={2} />
                    </div>

                    <span className="font-normal text-[11px] md:text-[15px] tracking-tight whitespace-nowrap uppercase">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-[220px] md:min-h-[450px] lg:h-full relative bg-secondary/30 flex items-center justify-center py-4 md:py-16 lg:py-12 px-4 md:px-8 lg:px-8 overflow-hidden border-t lg:border-t-0 lg:border-l border-border/20">
          <div className="relative w-full max-w-[280px] md:max-w-[360px] aspect-[4/5] md:aspect-[3/4] flex items-center justify-center">
            {FEATURES.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-2xl md:rounded-[2.8rem] overflow-hidden border-2 md:border-8 border-background bg-background origin-center"
                >
                  <img
                    src={feature.image}
                    alt={feature.label}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive
                        ? "grayscale-0 blur-0"
                        : "grayscale blur-[2px] brightness-75"
                    )}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-4 md:p-10 pt-12 md:pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div
                          className="text-white px-4 py-1.5 rounded-full text-[11px] font-normal uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border border-white/30"
                          style={{ backgroundColor: BRAND_PINK }}
                        >
                          {index + 1} • {feature.label}
                        </div>
                        <p className="text-white font-normal text-sm md:text-2xl leading-tight drop-shadow-md tracking-tight">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Nav arrows */}
                  <div className="absolute z-30 flex items-center justify-between px-2 md:px-3 inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white transition-colors"
                      style={{ color: BRAND_PINK }}
                      aria-label="Previous service"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setStep((s) => s + 1)}
                      className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white transition-colors"
                      style={{ color: BRAND_PINK }}
                      aria-label="Next service"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div
                    className={cn(
                      "absolute top-4 md:top-8 left-4 md:left-8 flex items-center gap-2 md:gap-3 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div
                      className="w-2 h-2 rounded-full shadow-[0_0_10px_white]"
                      style={{ backgroundColor: BRAND_PINK }}
                    />
                    <span className="text-white/80 text-[10px] font-normal uppercase tracking-[0.3em] font-mono">
                      Featured Service
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
