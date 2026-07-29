import { useRef, useEffect } from "react";
import { animate, stagger } from "animejs";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { processSteps, designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

export function ProcessSection() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepsRef.current) return;
    const items = stepsRef.current.querySelectorAll(".process-step");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate the connecting line
            if (lineRef.current) {
              animate(lineRef.current, {
                scaleY: [0, 1],
                transformOrigin: ["top center", "top center"],
                easing: "cubicBezier(0.16, 1, 0.3, 1)",
                duration: 1200,
              });
            }
            // Stagger the step cards
            animate(items, {
              opacity: [0, 1],
              translateY: [40, 0],
              delay: stagger(200),
              easing: "cubicBezier(0.16, 1, 0.3, 1)",
              duration: 700,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (stepsRef.current) observer.observe(stepsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="process"
      className="relative w-full py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "#faf3ec" }}
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />

      <div className="px-4 md:px-8">
        <SectionHeaderEnhanced
          heading="How It Works"
          subtitle="Getting your pet the grooming they deserve is as easy as one-two-three."
          align="center"
          badge="Process"
        />
      </div>

      <div ref={stepsRef} className="relative max-w-5xl mx-auto px-4 md:px-8 mt-8 md:mt-12">
        {/* Connecting line (desktop) */}
        <div
          ref={lineRef}
          className="hidden lg:block absolute top-24 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-[2px] origin-left"
          style={{
            background: `linear-gradient(90deg, ${BRAND_PINK}, ${BRAND_PINK}40, ${BRAND_PINK})`,
            transform: "scaleX(0)",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
          {processSteps.map((step) => (
            <div key={step.step} className="process-step opacity-0 relative">
              <div className="flex flex-col items-center text-center">
                {/* Step number circle */}
                <div
                  className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl mb-5 shadow-lg transition-all duration-500 hover:scale-110 hover:rotate-[-5deg]"
                  style={{ backgroundColor: BRAND_PINK }}
                >
                  <span className="text-white drop-shadow-md">{step.icon}</span>
                  {/* Step number badge */}
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2"
                    style={{
                      backgroundColor: BRAND_PINK,
                      borderColor: "#faf3ec",
                    }}
                  >
                    {step.step}
                  </div>
                </div>

                <h3 className="font-heading text-xl md:text-2xl font-bold text-brand-charcoal mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>

              {/* Arrow connector (mobile) */}
              {step.step < processSteps.length && (
                <div className="md:hidden flex justify-center my-4">
                  <div
                    className="w-[2px] h-8"
                    style={{ backgroundColor: `${BRAND_PINK}40` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />
    </section>
  );
}

export default ProcessSection;
