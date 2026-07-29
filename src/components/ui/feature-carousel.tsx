import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bath,
  Scissors,
  Smile,
  PawPrint,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { designTokens } from "@/config/site-content";
import { useSiteContent } from "@/context/SiteContentContext";

const iconMap: Record<string, React.ElementType> = {
  Bath,
  Scissors,
  Smile,
  PawPrint,
};

const AUTO_PLAY_INTERVAL = 4000;
const ITEM_HEIGHT = 60;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const BRAND_PINK = designTokens.brandPink;

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { content } = useSiteContent();
  const features = content.services.items.map((item) => ({
    ...item,
    Icon: iconMap[item.icon] || Bath,
  }));

  const currentIndex =
    ((step % features.length) + features.length) % features.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + features.length) % features.length;
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
    const len = features.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:p-6">
      <div className="relative overflow-hidden rounded-none md:rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row max-h-[calc(100dvh-85px)] lg:max-h-none lg:aspect-[16/9] border border-border/40 shadow-xl">
        {/* Left panel - service selector */}
        <div
          className="w-full lg:w-[38%] shrink-0 relative z-30 flex items-start justify-center overflow-hidden px-4 md:px-10 lg:px-14"
          style={{ backgroundColor: BRAND_PINK }}
        >
          {/* Gradient fades for scroll effect */}
          <div
            className="absolute inset-x-0 top-0 h-8 md:h-16 z-40 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${BRAND_PINK}, transparent)`,
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-8 md:h-16 z-40 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${BRAND_PINK}, transparent)`,
            }}
          />

          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20 py-2 md:py-8">
            {features.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(features.length / 2),
                features.length / 2,
                distance
              );

              return (
                <motion.div
                  key={feature.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 24,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-2 md:gap-4 px-3 md:px-8 lg:px-6 py-2 md:py-4 rounded-full transition-all duration-700 text-left group border",
                      isActive
                        ? "bg-white shadow-lg z-10"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white/90"
                    )}
                    style={
                      isActive
                        ? { color: BRAND_PINK, borderColor: "white" }
                        : {}
                    }
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500"
                      )}
                      style={
                        isActive
                          ? { color: BRAND_PINK }
                          : { color: "rgba(255,255,255,0.4)" }
                      }
                    >
                      <feature.Icon size={16} strokeWidth={2} />
                    </div>

                    <span className="font-medium text-[11px] md:text-[15px] tracking-tight whitespace-nowrap uppercase">
                      {feature.label}
                    </span>

                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full ml-1 animate-pulse-soft"
                        style={{ backgroundColor: BRAND_PINK }}
                      />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right panel - service preview */}
        <div className="flex-1 min-h-0 relative bg-secondary/20 flex items-center justify-center py-2 md:py-16 lg:py-12 px-2 md:px-8 lg:px-8 overflow-hidden border-t lg:border-t-0 lg:border-l border-border/20">
          <div className="relative w-full max-w-[180px] xs:max-w-[220px] md:max-w-[400px] aspect-[3/4] md:aspect-[3/4] flex items-center justify-center">
            {features.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : status === "prev" ? -120 : status === "next" ? 120 : 0,
                    scale: isActive ? 1 : status === "prev" || status === "next" ? 0.85 : 0.7,
                    opacity: isActive ? 1 : status === "prev" || status === "next" ? 0.4 : 0,
                    rotate: status === "prev" ? -4 : status === "next" ? 4 : 0,
                    zIndex: isActive ? 20 : status === "prev" || status === "next" ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 26,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden border-4 md:border-8 border-background bg-background origin-center shadow-2xl"
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
                        className="absolute inset-x-0 bottom-0 p-3 md:p-10 pt-10 md:pt-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div
                          className="text-white px-2 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-xs font-medium uppercase tracking-[0.2em] w-fit shadow-lg mb-2 md:mb-3 border border-white/20"
                          style={{ backgroundColor: BRAND_PINK }}
                        >
                          {index + 1} • {feature.label}
                        </div>
                        <p className="text-white font-heading font-bold text-xs md:text-2xl leading-tight drop-shadow-md tracking-tight">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation arrows */}
                  <div className="absolute z-30 flex items-center justify-between px-1 md:px-4 inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white transition-all hover:scale-110 active:scale-95"
                      style={{ color: BRAND_PINK }}
                      aria-label="Previous service"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => setStep((s) => s + 1)}
                      className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white transition-all hover:scale-110 active:scale-95"
                      style={{ color: BRAND_PINK }}
                      aria-label="Next service"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Featured badge */}
                  <div
                    className={cn(
                      "absolute top-2 md:top-8 left-2 md:left-8 flex items-center gap-1.5 md:gap-3 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div
                      className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full shadow-lg"
                      style={{ backgroundColor: BRAND_PINK }}
                    />
                    <span className="text-white/80 text-[8px] md:text-[10px] font-medium uppercase tracking-[0.25em]">
                      Featured Service
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Service dots indicator */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => handleChipClick(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === currentIndex
                    ? "w-6 h-2"
                    : "w-2 h-2 opacity-40 hover:opacity-70"
                )}
                style={{
                  backgroundColor: i === currentIndex ? BRAND_PINK : "rgba(0,0,0,0.3)",
                }}
                aria-label={`Go to service ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
