import { motion } from "motion/react";
import { Bath, Scissors, Smile, PawPrint, ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

const iconMap: Record<string, React.ElementType> = {
  Bath,
  Scissors,
  Smile,
  PawPrint,
};

/** Per-card brand gradients (light → darker, cycling by index). */
const GRADIENTS = [
  "from-[#f0e0e0] to-[#d0999a]",
  "from-[#f0e8dc] to-[#faf3ec]",
  "from-[#f5f0e8] to-[#d0999a]",
  "from-[#e8b4b5] to-[#a87a7b]",
];

/** Index 3 gradient is darkest → white description text; others charcoal. */
const isDarkPanel = (i: number) => i % GRADIENTS.length === 3;

/** Static Tailwind classes only (JIT-safe); fall back to full-width for <2 items. */
const SPAN_CLASSES = [
  "md:col-span-4",
  "md:col-span-8",
  "md:col-span-8",
  "md:col-span-4",
];

function BounceCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 0.95, rotate: "-1deg" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`group relative min-h-[260px] overflow-hidden rounded-2xl bg-white p-6 shadow-md md:min-h-[300px] md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function CardTitle({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      className={`font-heading text-xl font-bold text-brand-charcoal md:text-2xl ${className}`}
    >
      {children}
    </h3>
  );
}

export function BounceCardsFeatures({
  onBookClick,
}: {
  onBookClick?: () => void;
}) {
  const { content } = useSiteContent();
  const items = content.services.items.map((item) => ({
    ...item,
    Icon: iconMap[item.icon] || Bath,
  }));

  return (
    <div className="w-full">
      {/* Header row — "Learn more" CTA (heading/subtitle come from SectionHeaderEnhanced above) */}
      <div className="mb-8 flex justify-end md:mb-10">
        <motion.button
          onClick={onBookClick}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-lg"
          style={{ backgroundColor: BRAND_PINK }}
        >
          Learn more <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* 12-col bouncy grid: row1 = 4/8, row2 = 8/4 (robust to ≠4 items) */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {items.map((item, i) => {
          const spanClass =
            items.length < 2
              ? "md:col-span-12"
              : SPAN_CLASSES[i % SPAN_CLASSES.length];
          const dark = isDarkPanel(i);
          return (
            <div key={item.id} className={`col-span-12 ${spanClass}`}>
              <BounceCard>
                {/* Card body: title + icon chip */}
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <CardTitle>{item.label}</CardTitle>
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${BRAND_PINK}25` }}
                  >
                    <item.Icon size={22} style={{ color: BRAND_PINK }} />
                  </div>
                </div>

                {/* Gradient reveal panel — service image + label + description */}
                <div
                  className={`absolute inset-x-0 top-32 rounded-t-2xl bg-gradient-to-br p-6 translate-y-8 transition-transform duration-500 group-hover:rotate-[2deg] group-hover:translate-y-4 ${GRADIENTS[i % GRADIENTS.length]}`}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-[120px] max-h-[120px] w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                  <span className="mt-4 inline-block rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-brand-charcoal">
                    {item.label}
                  </span>
                  <p
                    className={`mt-2 line-clamp-3 text-xs leading-relaxed md:text-sm ${
                      dark ? "text-white/90" : "text-brand-charcoal/80"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </BounceCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BounceCardsFeatures;
