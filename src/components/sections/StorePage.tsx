import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animate, stagger } from "animejs";
import { animate as motionAnimate, useInView } from "motion/react";
import { ArrowLeft, Phone, ShoppingBag } from "lucide-react";
import { designTokens } from "@/config/site-content";
import { storeProducts, STORE_PHONE, type StoreCategory } from "@/config/store-products";

const BRAND_PINK = designTokens.brandPink;

const CATEGORY_META: Record<StoreCategory, { title: string; emoji: string; blurb: string }> = {
  clothes: {
    title: "Clothes",
    emoji: "🧥",
    blurb: "Coats and apparel to keep your pet warm, dry, and stylish.",
  },
  products: {
    title: "Wellness & Medicines",
    emoji: "🧴",
    blurb: "Grooming and wellness essentials, vet-recommended.",
  },
};

const CATEGORY_ORDER: StoreCategory[] = ["clothes", "products"];

const PAGE_STATS = [
  { count: 4, suffix: "+", label: "Curated essentials" },
  { count: 100, suffix: "%", label: "Pet-safe" },
  { count: 24, suffix: "h", label: "Pickup turnaround" },
];

export function StorePage() {
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

  // Kinetic loading — skeleton shimmer on page mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

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

  // Animated card entrance after skeleton swap
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".store-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(cards, {
              opacity: [0, 1],
              translateY: [32, 0],
              delay: stagger(90),
              easing: "cubicBezier(0.16, 1, 0.3, 1)",
              duration: 650,
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
    <div className="min-h-screen" style={{ backgroundColor: BRAND_PINK }}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/30">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center">
              <ShoppingBag size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Pet Store</h1>
              <p className="text-white/60 text-sm mt-0.5">
                Display-only catalog — call to order, we'll have it ready.
              </p>
            </div>
          </div>

          {/* Animated stats */}
          <div ref={statsRef} className="grid grid-cols-3 gap-3 mb-8">
            {PAGE_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/15 rounded-2xl p-3 md:p-4 border border-white/20 text-center"
              >
                <p className="text-white font-heading font-bold text-xl md:text-2xl">
                  <span data-count={stat.count}>0</span>
                  {stat.suffix}
                </p>
                <p className="text-white/60 text-[10px] md:text-xs mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Catalog */}
          {loading ? (
            <div className="space-y-8">
              {CATEGORY_ORDER.map((cat) => (
                <div key={cat}>
                  <div className="h-5 w-40 rounded-full bg-white/25 mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="shimmer rounded-2xl bg-white/20 aspect-[4/3] border border-white/20"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div ref={gridRef} className="space-y-10">
              {CATEGORY_ORDER.map((cat) => (
                <section key={cat}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="text-xl">{CATEGORY_META[cat].emoji}</span>
                    <div>
                      <h2 className="text-white font-heading font-bold text-lg md:text-xl">
                        {CATEGORY_META[cat].title}
                      </h2>
                      <p className="text-white/60 text-xs">{CATEGORY_META[cat].blurb}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {storeProducts
                      .filter((p) => p.category === cat)
                      .map((product) => (
                        <div
                          key={product.id}
                          className="store-card opacity-0 group bg-white/15 rounded-2xl overflow-hidden border border-white/20 hover:bg-white/25 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="aspect-[4/3] flex items-center justify-center text-6xl md:text-7xl bg-gradient-to-br from-white/20 to-transparent transition-transform duration-700 group-hover:scale-105">
                            {product.image}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-white font-semibold text-sm">
                                {product.name}
                              </h3>
                              {product.badge && (
                                <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/20 text-white/80 text-[10px] uppercase tracking-wider">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <p className="text-white font-bold text-lg">₹{product.price}</p>
                              <a
                                href={`tel:${STORE_PHONE}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white font-semibold text-xs transition-transform hover:scale-105"
                                style={{ color: BRAND_PINK }}
                              >
                                <Phone size={12} /> Call to order
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StorePage;
