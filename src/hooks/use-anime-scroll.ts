import { useEffect, useRef, useCallback } from "react";
import { animate, type AnimeParams } from "animejs";

type AnimePreset =
  | "fadeInUp"
  | "fadeInLeft"
  | "fadeInRight"
  | "scaleIn"
  | "slideUp"
  | "zoomIn"
  | "flipIn"
  // NEW PRESETS
  | "textReveal"
  | "blurIn"
  | "elasticUp";

interface AnimeScrollOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

const PRESETS: Record<AnimePreset, AnimeParams> = {
  fadeInUp: {
    opacity: [0, 1],
    translateY: [60, 0],
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
    duration: 800,
  },
  fadeInLeft: {
    opacity: [0, 1],
    translateX: [-60, 0],
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
    duration: 800,
  },
  fadeInRight: {
    opacity: [0, 1],
    translateX: [60, 0],
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
    duration: 800,
  },
  scaleIn: {
    opacity: [0, 1],
    scale: [0.85, 1],
    easing: "cubicBezier(0.34, 1.56, 0.64, 1)",
    duration: 700,
  },
  slideUp: {
    opacity: [0, 1],
    translateY: [80, 0],
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
    duration: 1000,
  },
  zoomIn: {
    opacity: [0, 1],
    scale: [0.6, 1],
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
    duration: 900,
  },
  flipIn: {
    opacity: [0, 1],
    rotateX: [90, 0],
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
    duration: 800,
  },
  // NEW PRESETS
  textReveal: {
    opacity: [0, 1],
    translateY: [100, 0],
    rotateX: [-20, 0],
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
    duration: 1200,
  },
  blurIn: {
    opacity: [0, 1],
    // @ts-expect-error - anime.js v4 supports filter keyframes
    filter: ["blur(8px)", "blur(0px)"],
    easing: "cubicBezier(0.16, 1, 0.3, 1)",
    duration: 800,
  } as AnimeParams,
  elasticUp: {
    opacity: [0, 1],
    translateY: [100, 0],
    easing: "cubicBezier(0.34, 1.56, 0.64, 1)",
    duration: 900,
  },
};

/**
 * Scroll animation hook using anime.js v4.
 * Uses IntersectionObserver to trigger anime.js animations when elements enter viewport.
 * Supports data-anime, data-anime-delay, data-anime-duration attributes on child elements.
 */
export function useAnimeScroll(options: AnimeScrollOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -60px 0px", once = true } = options;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const animateElement = useCallback((el: HTMLElement) => {
    const type = (el.dataset.anime || "fadeInUp") as AnimePreset;
    const delay = parseInt(el.dataset.animeDelay || "0", 10);
    const duration = parseInt(el.dataset.animeDuration || "800", 10);

    const preset = PRESETS[type] || PRESETS.fadeInUp;

    animate(el, {
      ...preset,
      duration: duration || preset.duration || 800,
      delay,
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateElement(entry.target as HTMLElement);
            if (once) {
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    const elements = containerRef.current.querySelectorAll("[data-anime]");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [animateElement, threshold, rootMargin, once]);

  return containerRef;
}

/**
 * Trigger a one-time anime.js animation on a mounted element.
 */
export function useAnimeOnMount(params: AnimeParams) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    animate(ref.current, {
      opacity: [0, 1],
      translateY: [30, 0],
      easing: "easeOutCubic",
      duration: 800,
      ...params,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}

// ========== NEW HOOKS ==========

/**
 * Scroll-linked parallax effect.
 * Translates the element vertically based on scroll position at given speed.
 */
export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const offset = rect.top * speed;
      ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return ref;
}

/**
 * Staggered reveal for child elements with `.stagger-item` class.
 * Uses IntersectionObserver to trigger reveals with staggered delays.
 */
export function useStaggerReveal(staggerDelay: number = 80) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll(".stagger-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => {
              setTimeout(() => {
                (item as HTMLElement).classList.add("in-view");
              }, i * staggerDelay);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [staggerDelay]);

  return ref;
}
