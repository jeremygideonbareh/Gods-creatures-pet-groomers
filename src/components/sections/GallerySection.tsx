import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

const GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=60",
    alt: "Happy dog after grooming",
  },
  {
    url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&auto=format&fit=crop&q=60",
    alt: "Dog getting haircut",
  },
  {
    url: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?w=600&auto=format&fit=crop&q=60",
    alt: "Puppy in bath",
  },
  {
    url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=60",
    alt: "Dog with bow tie",
  },
  {
    url: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&auto=format&fit=crop&q=60",
    alt: "Happy puppy",
  },
  {
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=60",
    alt: "Dog smiling",
  },
  {
    url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60",
    alt: "Dog dental care",
  },
  {
    url: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop&q=60",
    alt: "Dog brush",
  },
];

export function GallerySection() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
          heading="Pet Gallery"
          subtitle="A glimpse into the love and care we pour into every grooming session."
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
          {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img: typeof GALLERY_IMAGES[0], i: number) => (
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
          {[...GALLERY_IMAGES].reverse().concat([...GALLERY_IMAGES].reverse()).map((img, i) => (
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
