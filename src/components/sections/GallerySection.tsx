import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";
import { useSiteContent } from "@/context/SiteContentContext";

const BRAND_PINK = designTokens.brandPink;

export function GallerySection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { content } = useSiteContent();
  const images = content.gallery.images;

  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll(".gallery-item");
            animate(items, {
              opacity: [0, 1],
              scale: [0.85, 1],
              translateY: [40, 0],
              // @ts-expect-error - v4 supports delay as function
              delay: (_el: Element, i: number) => i * 80,
              easing: "easeOutCubic",
              duration: 600,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="relative w-full py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: "#f5f0e8" }}
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
          heading={content.gallery.heading}
          subtitle={content.gallery.subtitle}
          align="center"
          badge="Gallery"
        />
      </div>

      {/* Marquee row 1 - left to right */}
      <div className="relative overflow-hidden py-3" ref={scrollRef}>
        <div
          className="flex gap-4 animate-marquee"
          style={{ "--duration": "35s" } as React.CSSProperties}
        >
          {[...images, ...images].map((img, i) => (
            <div
              key={i}
              className="gallery-item opacity-0 flex-shrink-0 w-40 md:w-56 aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Marquee row 2 - right to left (reverse) */}
      <div className="relative overflow-hidden py-3">
        <div
          className="flex gap-4"
          style={{
            animation: `marquee-reverse 40s linear infinite`,
          } as React.CSSProperties}
        >
          {[...images].reverse().concat([...images].reverse()).map((img, i) => (
            <div
              key={i}
              className="gallery-item opacity-0 flex-shrink-0 w-32 md:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Style for reverse marquee */}
      <style>{`
        @keyframes marquee-reverse {
          from { transform: translateX(calc(-50% - 8px)); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />
    </div>
  );
}

export default GallerySection;
