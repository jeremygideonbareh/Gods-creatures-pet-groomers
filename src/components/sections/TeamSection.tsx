import { useRef, useEffect } from "react";
import { animate, stagger } from "animejs";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { teamMembers, designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

export function TeamSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".team-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(items, {
              opacity: [0, 1],
              translateY: [40, 0],
              delay: stagger(100),
              easing: "cubicBezier(0.16, 1, 0.3, 1)",
              duration: 700,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="team" className="relative w-full py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "#f5f0e8" }}>
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />

      <div className="px-4 md:px-8">
        <SectionHeaderEnhanced
          heading="Meet Our Team"
          subtitle="Passionate professionals dedicated to your pet's happiness and well-being."
          align="center"
          badge="Team"
        />
      </div>

      <div ref={gridRef} className="max-w-6xl mx-auto px-4 md:px-8 mt-4 md:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="team-card opacity-0 group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                {/* Image container */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"
                  style={{
                    background: `linear-gradient(to top, rgba(28,28,28,0.8), transparent)`,
                  }}
                >
                  <p className="text-white text-xs leading-relaxed">{member.bio}</p>
                </div>
                {/* Info bar */}
                <div className="p-4 flex items-center gap-3">
                  <span className="text-xl">{member.emoji}</span>
                  <div>
                    <h3 className="font-heading font-bold text-brand-charcoal text-sm">{member.name}</h3>
                    <p className="text-muted-foreground text-xs">{member.role}</p>
                  </div>
                </div>
              </div>
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

export default TeamSection;
