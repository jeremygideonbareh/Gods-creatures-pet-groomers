import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, stagger } from "animejs";
import { motion, animate as motionAnimate, useInView } from "motion/react";
import { Phone, ArrowRight } from "lucide-react";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";
import { storeProducts, STORE_PHONE } from "@/config/store-products";

const BRAND_PINK = designTokens.brandPink;

const MARQUEE_ITEMS = [
  "🐾 100% Pet-Safe",
  "⭐ Vet-Approved Essentials",
  "🚚 Same-Day Pickup in Shillong",
  "💬 Call to Order",
];

const STORE_STATS = [
  { count: 100, suffix: "%", label: "Pet-safe" },
  { count: 4, suffix: "+", label: "Curated items" },
  { count: 24, suffix: "h", label: "Pickup turnaround" },
];

export function StoreSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

  // Kinetic loading — skeleton shimmer on section mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Scroll-reveal stagger for product cards (fires after skeleton swap)
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".store-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(cards, {
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

  // Animated counters for store stats
  useEffect(() => {
    if (!statsInView || !statsRef.current) return;
    statsRef.current.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count || "0");
      const controls = motionAnimate(0, target, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => {
          el.textContent = String(Math.round(v));
        },
      });
      return () => controls.stop();
    });
  }, [statsInView]);

  return (
    <section
      id="store"
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

      <div className="px-4 md:px-8">
        <SectionHeaderEnhanced
          heading="Pet Store"
          subtitle="Coats, shampoos and wellness essentials for your furry friend — call to order and we'll have it ready for pickup."
          align="center"
          badge="Store"
        />
      </div>

      {/* Marquee trust strip (motion, infinite) */}
      <div className="relative overflow-hidden py-3 mb-8 md:mb-12 border-y border-brand-pink/10 bg-white/60">
        <motion.div
          className="flex whitespace-nowrap gap-10 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 22 }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="text-xs font-medium uppercase tracking-wider text-brand-charcoal/70"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Product grid */}
      <div ref={gridRef} className="max-w-6xl mx-auto px-4 md:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="shimmer rounded-2xl bg-white aspect-[4/5] shadow-sm"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {storeProducts.map((product) => (
              <div key={product.id} className="store-card opacity-0 group">
                <div className="relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  {product.badge && (
                    <span
                      className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold text-white"
                      style={{ backgroundColor: BRAND_PINK }}
                    >
                      {product.badge}
                    </span>
                  )}
                  <div className="aspect-[4/3] flex items-center justify-center text-6xl md:text-7xl bg-gradient-to-br from-brand-pink/10 to-transparent transition-transform duration-700 group-hover:scale-105">
                    {product.image}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-brand-charcoal text-sm">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="font-bold text-lg" style={{ color: BRAND_PINK }}>
                        ₹{product.price}
                      </p>
                      <a
                        href={`tel:${STORE_PHONE}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white transition-all hover:scale-105"
                        style={{ backgroundColor: BRAND_PINK }}
                      >
                        <Phone size={12} /> Call to order
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Store stats — animated counters */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-3 md:gap-6 mt-10 md:mt-14 max-w-2xl mx-auto"
        >
          {STORE_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="font-heading font-bold text-2xl md:text-4xl"
                style={{ color: BRAND_PINK }}
              >
                <span data-count={stat.count}>0</span>
                {stat.suffix}
              </p>
              <p className="text-muted-foreground text-[11px] md:text-xs mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* View full catalog */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-heading font-semibold text-sm uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: BRAND_PINK, boxShadow: `0 8px 24px ${BRAND_PINK}40` }}
          >
            View Full Catalog <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div
        className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, transparent)`,
        }}
      />
    </section>
  );
}

export default StoreSection;
