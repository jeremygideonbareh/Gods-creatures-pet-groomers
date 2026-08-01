import { useRef, useEffect } from "react";
import { animate, stagger } from "animejs";
import { ArrowRight } from "lucide-react";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";
import { useSiteContent } from "@/context/SiteContentContext";

const BRAND_PINK = designTokens.brandPink;

export function BlogSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { content } = useSiteContent();
  const posts = content.blog.posts;

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".blog-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(items, {
              opacity: [0, 1],
              translateY: [40, 0],
              delay: stagger(120),
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
    <section
      id="blog"
      className="relative w-full py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />

      {/* Background decorative elements */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.03] pointer-events-none"
        style={{ backgroundColor: BRAND_PINK }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-[0.03] pointer-events-none"
        style={{ backgroundColor: BRAND_PINK }}
      />

      <div className="px-4 md:px-8">
        <SectionHeaderEnhanced
          heading={content.blog.heading}
          subtitle={content.blog.subtitle}
          align="center"
          badge="Blog"
        />
      </div>

      <div ref={gridRef} className="max-w-6xl mx-auto px-4 md:px-8 mt-4 md:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {posts.map((post) => (
            <div key={post.title} className="blog-card opacity-0 group cursor-pointer">
              <div className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Category badge */}
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider text-white shadow-lg"
                    style={{ backgroundColor: BRAND_PINK }}
                  >
                    {post.category}
                  </div>
                  {/* Date badge */}
                  <div
                    className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-medium text-white/80"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                  <h3 className="font-heading font-bold text-brand-charcoal text-sm md:text-base leading-snug mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: BRAND_PINK }}
                  >
                    <span>Read More</span>
                    <ArrowRight size={12} />
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

export default BlogSection;
