"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
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
            anime({
              targets: el,
              innerHTML: [0, targetValue],
              easing: "easeOutQuad",
              duration: 2000,
              round: targetValue % 1 === 0 ? 1 : 10,
              update: (anim: anime.AnimeInstance) => {
                if (targetValue % 1 !== 0) {
                  el.textContent = (anim.animations[0].currentValue as unknown as number).toFixed(1);
                }
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
      className="w-full py-8 md:py-10 px-4"
      style={{ backgroundColor: BRAND_PINK }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center" data-anime="fadeInUp">
            <div className="text-2xl md:text-4xl font-heading font-bold text-white">
              <span className="stat-value" data-target={stat.value}>
                0
              </span>
              {stat.suffix}
            </div>
            <p className="text-white/70 text-sm mt-1 font-medium tracking-wide uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
