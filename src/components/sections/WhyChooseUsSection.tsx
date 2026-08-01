import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "motion/react";
import {
  Zap,
  ArrowRight,
  PawPrint,
  Calendar,
  Users,
  Star,
  Scissors,
  Smile,
  Bath,
  ShieldCheck,
  Heart,
  Sparkles,
} from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;
const BRAND_PINK_DARK = designTokens.brandPinkDark;
const BRAND_CHARCOAL = designTokens.brandCharcoal;
const BRAND_CREAM = designTokens.brandCream;
const BRAND_IVORY = designTokens.brandIvory;

/** Known lucide icon names → component. Unknown strings render as emoji text. */
const ICON_MAP: Record<string, ElementType> = {
  PawPrint,
  Calendar,
  Users,
  Star,
  Scissors,
  Smile,
  Bath,
  ShieldCheck,
  Heart,
  Sparkles,
};

function renderIcon(icon: string): ReactNode {
  const Icon = ICON_MAP[icon];
  if (Icon) return <Icon size={24} />;
  return <span className="text-2xl leading-none">{icon}</span>;
}

function ServiceItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group flex items-start gap-4 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md md:p-6"
    >
      <div
        className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${BRAND_PINK}22`, color: BRAND_PINK_DARK }}
      >
        {renderIcon(icon)}
      </div>
      <div className="min-w-0">
        <h3
          className="font-heading text-base font-bold md:text-lg"
          style={{ color: BRAND_CHARCOAL }}
        >
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function StatCounter({
  icon,
  value,
  suffix,
  label,
}: {
  icon: string;
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const spring = useSpring(0, { duration: 2, bounce: 0 });
  const display = useTransform(spring, (v) =>
    value % 1 === 0 ? Math.round(v).toString() : v.toFixed(1)
  );

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, spring, value]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: `${BRAND_PINK}22`, color: BRAND_PINK_DARK }}
      >
        {renderIcon(icon)}
      </div>
      <div
        className="mt-3 font-heading text-3xl font-bold tabular-nums md:text-4xl"
        style={{ color: BRAND_CHARCOAL }}
      >
        <motion.span>{display}</motion.span>
        <span style={{ color: BRAND_PINK }}>{suffix}</span>
      </div>
      <div
        className="mx-auto mt-2 h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-14"
        style={{ backgroundColor: BRAND_PINK }}
      />
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm">
        {label}
      </p>
    </div>
  );
}

export function WhyChooseUsSection({
  onBookClick,
}: {
  onBookClick?: () => void;
}) {
  const { content } = useSiteContent();
  const { whyChooseUs } = content;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -45]);

  const leftCards = whyChooseUs.cards.filter((_, i) => i % 2 === 0);
  const rightCards = whyChooseUs.cards.filter((_, i) => i % 2 === 1);
  const stats = whyChooseUs.stats ?? [];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-20 text-brand-charcoal md:py-28"
      style={{
        background: `linear-gradient(to bottom, ${BRAND_CREAM}, ${BRAND_IVORY})`,
      }}
    >
      {/* Decorative parallax blobs */}
      <motion.div
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${BRAND_PINK}14`, y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl"
        style={{
          backgroundColor: `${BRAND_PINK_DARK}12`,
          y: y2,
          rotate: rotate2,
        }}
      />
      {/* Floating dots */}
      <motion.div
        className="absolute right-[15%] top-[12%] h-3 w-3 rounded-full"
        style={{ backgroundColor: `${BRAND_PINK}60` }}
        animate={{ y: [0, -14, 0] }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[18%] left-[10%] h-2 w-2 rounded-full"
        style={{ backgroundColor: `${BRAND_PINK_DARK}50` }}
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{
              backgroundColor: `${BRAND_PINK}20`,
              color: BRAND_PINK_DARK,
            }}
          >
            <Zap size={12} />
            {whyChooseUs.badge ?? "OUR GROOMING PHILOSOPHY"}
          </div>
          <h2
            className="mt-5 font-heading text-3xl font-bold md:text-5xl"
            style={{ color: BRAND_CHARCOAL }}
          >
            {whyChooseUs.heading}
          </h2>
          <motion.div
            className="mt-4 h-1 w-24 rounded-full"
            style={{ backgroundColor: BRAND_PINK }}
          />
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {whyChooseUs.story ??
              "Luxury grooming by experienced professionals \u2014 only the finest for your pet."}
          </p>
        </div>

        {/* 3-col grid: value props / framed image / value props */}
        <div className="mt-14 grid grid-cols-1 items-center gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          <div className="space-y-8 md:space-y-10">
            {leftCards.map((card) => (
              <ServiceItem
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>

          {/* Center framed image — image first on mobile */}
          <div className="relative order-first mx-auto w-full max-w-[260px] md:order-none md:max-w-xs">
            <div
              className="absolute -inset-3 rounded-2xl border-4"
              style={{ borderColor: BRAND_PINK_DARK }}
            />
            <motion.img
              src={whyChooseUs.image}
              alt="Happy pet after grooming"
              whileHover={{ scale: 1.03 }}
              className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-xl"
              loading="lazy"
            />
          </div>

          <div className="space-y-8 md:space-y-10">
            {rightCards.map((card) => (
              <ServiceItem
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>

        {/* Stats row */}
        {stats.length > 0 && (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 md:gap-10">
            {stats.map((stat) => (
              <StatCounter
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        )}

        {/* CTA panel */}
        <div
          className="mt-16 rounded-3xl p-8 text-center md:mt-20 md:p-12"
          style={{ backgroundColor: BRAND_CHARCOAL }}
        >
          <h3 className="font-heading text-2xl font-bold text-white md:text-3xl">
            {whyChooseUs.ctaTitle ?? "Ready to pamper your pet?"}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
            {whyChooseUs.ctaText ??
              "Book a session and watch their tail wag brighter."}
          </p>
          <motion.button
            onClick={onBookClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-7 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-shadow duration-300 hover:shadow-lg"
            style={{ backgroundColor: BRAND_PINK }}
          >
            {whyChooseUs.ctaLabel ?? "Book a Session"}
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUsSection;
