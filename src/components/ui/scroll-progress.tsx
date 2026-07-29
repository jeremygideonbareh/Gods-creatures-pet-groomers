import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[var(--z-toast)] h-[3px] pointer-events-none"
      style={{
        background: `linear-gradient(90deg, ${BRAND_PINK}, #e8b4b5, ${BRAND_PINK})`,
        width: `${progress}%`,
        transition: "width 0.1s linear",
      }}
    />
  );
}
