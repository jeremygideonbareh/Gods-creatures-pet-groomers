import { useState, useRef, useEffect } from "react";
import { animate, stagger } from "animejs";
import { ChevronDown } from "lucide-react";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";
import { useSiteContent } from "@/context/SiteContentContext";

const BRAND_PINK = designTokens.brandPink;

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { content } = useSiteContent();
  const items = content.faq.items;

  useEffect(() => {
    if (!headerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll(".faq-item");
            animate(items, {
              opacity: [0, 1],
              translateY: [30, 0],
              delay: stagger(80),
              easing: "cubicBezier(0.16, 1, 0.3, 1)",
              duration: 600,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
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
          heading={content.faq.heading}
          subtitle={content.faq.subtitle}
          align="center"
          badge="FAQ"
        />
      </div>

      <div ref={headerRef} className="max-w-3xl mx-auto px-4 md:px-8 mt-4 md:mt-6">
        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="faq-item opacity-0"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 p-4 md:p-5 rounded-xl text-left transition-all duration-300 hover:shadow-md"
                  style={{
                    backgroundColor: isOpen ? `${BRAND_PINK}10` : "white",
                    border: `1px solid ${isOpen ? BRAND_PINK : "rgba(0,0,0,0.06)"}`,
                  }}
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-brand-charcoal text-sm md:text-base leading-snug flex-1">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 transition-transform duration-300"
                    style={{
                      color: BRAND_PINK,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? "300px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div
                    className="p-4 md:p-5 pt-0 md:pt-0 mt-1"
                    style={{ borderLeft: `2px solid ${BRAND_PINK}20`, marginLeft: "1rem" }}
                  >
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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

export default FAQSection;
