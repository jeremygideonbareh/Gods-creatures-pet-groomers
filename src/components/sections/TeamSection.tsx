import { useRef, useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { MapPin } from "lucide-react";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";
import { useSiteContent } from "@/context/SiteContentContext";

const BRAND_PINK = designTokens.brandPink;

/** "The Boy Who Helps" -> "B", "Dr. Kakoty" -> "K" (initials of the last significant word). */
function initialsOf(name: string): string {
  const words = name
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w));
  return words.length > 0 ? words[words.length - 1][0].toUpperCase() : "?";
}

export function TeamSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const { content } = useSiteContent();
  const members = content.team.members;

  // Kinetic loading — skeleton shimmer on section mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Scroll-reveal stagger for team cards (fires after skeleton swap)
  useEffect(() => {
    if (loading || !gridRef.current) return;
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
  }, [loading]);

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
          heading={content.team.heading}
          subtitle={content.team.subtitle}
          align="center"
          badge="Team"
        />
      </div>

      <div ref={gridRef} className="max-w-6xl mx-auto px-4 md:px-8 mt-4 md:mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="shimmer rounded-2xl bg-white aspect-[3/4] shadow-sm"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {members.map((member) => (
              <div
                key={member.name}
                className="team-card opacity-0 group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  {/* Image container */}
                  <div className="aspect-[3/4] overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      /* Initials avatar fallback (empty image → no broken icon) */
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-2"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND_PINK}22, ${BRAND_PINK}08)`,
                        }}
                      >
                        <span
                          className="font-heading font-bold text-5xl md:text-6xl"
                          style={{ color: BRAND_PINK }}
                        >
                          {initialsOf(member.name)}
                        </span>
                        <span className="text-3xl">{member.emoji}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          Photo coming soon
                        </span>
                      </div>
                    )}
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
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-brand-charcoal text-sm">{member.name}</h3>
                      <p className="text-muted-foreground text-xs">{member.role}</p>
                      {member.mapLink && (
                        <a
                          href={member.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium transition-colors hover:underline"
                          style={{ color: BRAND_PINK }}
                        >
                          <MapPin size={11} /> Google his location
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
