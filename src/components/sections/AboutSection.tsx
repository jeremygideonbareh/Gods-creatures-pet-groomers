import { useRef, useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { UserRound } from "lucide-react";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";
import { useSiteContent } from "@/context/SiteContentContext";

const BRAND_PINK = designTokens.brandPink;

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const { content } = useSiteContent();
  const about = content.about;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading || !containerRef.current) return;
    const items = containerRef.current.querySelectorAll(".article-block");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(items, {
              opacity: [0, 1],
              translateY: [30, 0],
              delay: stagger(150),
              easing: "easeOutCubic",
              duration: 800,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loading]);

  return (
    <section id="team" className="relative w-full py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "#f5f0e8" }}>
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />

      <div className="px-4 md:px-8">
        <SectionHeaderEnhanced
          heading={about.heading}
          subtitle={about.subtitle}
          align="center"
          badge="Owner"
        />
      </div>

      <div ref={containerRef} className="max-w-4xl mx-auto px-4 md:px-8 mt-12 md:mt-16">
        {loading ? (
          <div className="space-y-12 opacity-50 animate-pulse">
            <div className="h-64 bg-black/5 rounded-3xl" />
          </div>
        ) : (
          <article className="article-block opacity-0 relative bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-brand-charcoal/5">
            <div className="absolute -top-4 -left-2 md:-top-8 md:-left-6 text-8xl md:text-[140px] font-heading opacity-10 select-none pointer-events-none" style={{ color: BRAND_PINK, lineHeight: 1 }}>
              "
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-6 md:gap-10 items-start">
              <div className="shrink-0 w-full sm:w-56 md:w-64">
                {about.ownerImage ? (
                  <img
                    src={about.ownerImage}
                    alt={about.ownerName || "Owner"}
                    className="w-full aspect-square object-cover rounded-3xl border border-brand-pink/20 shadow-inner"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-3xl bg-black/5 border border-brand-charcoal/10 flex flex-col items-center justify-center gap-3 text-brand-charcoal/40">
                    <UserRound size={48} strokeWidth={1.25} />
                    <span className="text-xs md:text-sm font-medium tracking-wide">
                      Owner photo coming soon
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-heading font-bold text-2xl md:text-4xl text-brand-charcoal">
                  {about.ownerName}
                </h3>
                <p className="text-brand-pink font-semibold text-xs md:text-sm uppercase tracking-widest mt-2 mb-6">
                  {about.ownerRole}
                </p>

                <div className="text-brand-charcoal/80 text-base md:text-lg leading-relaxed space-y-5 font-light">
                  {about.ownerBio.split(/\n\s*\n/).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        )}
      </div>

      <div
        className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />
    </section>
  );
}

export default AboutSection;
