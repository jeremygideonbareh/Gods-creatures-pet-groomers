import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

const stats = [
  { value: 500, suffix: "+", label: "Pets Groomed" },
  { value: 8, suffix: "+", label: "Years Experience" },
  { value: 98, suffix: "%", label: "Happy Clients" },
  { value: 4.4, suffix: "★", label: "Avg. Rating" },
];

export function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const counters = ref.current.querySelectorAll(".stat-value");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetValue = parseFloat(el.getAttribute("data-target") || "0");

            // Use anime.js v4 - animate a plain object
            const obj = { value: 0 };
            const anim = animate(obj, {
              value: [0, targetValue],
              easing: "easeOutQuad",
              duration: 2200,
              // @ts-expect-error - v4 update callback
              update: () => {
                const formatted =
                  targetValue % 1 === 0
                    ? Math.round(obj.value)
                    : obj.value.toFixed(1);
                el.textContent = String(formatted);
              },
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full py-10 md:py-12 px-4 overflow-hidden"
      style={{ backgroundColor: BRAND_PINK }}
    >
      {/* Decorative pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center group"
              data-anime="scaleIn"
            >
              <div className="text-3xl md:text-5xl font-heading font-bold text-white mb-1">
                <span
                  className="stat-value inline-block tabular-nums"
                  data-target={stat.value}
                >
                  0
                </span>
                <span className="text-white/90">{stat.suffix}</span>
              </div>
              <p className="text-white/70 text-xs md:text-sm font-medium tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
