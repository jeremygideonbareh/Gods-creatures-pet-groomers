import { useEffect, useRef, useCallback } from "react";
import anime from "animejs";

/**
 * Custom hook to trigger anime.js animations when elements enter the viewport.
 * Use with a ref on a parent container and data-anime attributes on children.
 */
export function useAnimeScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const animateElement = useCallback((el: HTMLElement) => {
    const type = el.dataset.anime || "fadeInUp";
    const delay = parseInt(el.dataset.animeDelay || "0", 10);
    const duration = parseInt(el.dataset.animeDuration || "800", 10);

    const presets: Record<string, anime.AnimeParams> = {
      fadeInUp: {
        opacity: [0, 1],
        translateY: [60, 0],
        easing: "easeOutCubic",
        duration,
        delay,
      },
      fadeInLeft: {
        opacity: [0, 1],
        translateX: [-60, 0],
        easing: "easeOutCubic",
        duration,
        delay,
      },
      fadeInRight: {
        opacity: [0, 1],
        translateX: [60, 0],
        easing: "easeOutCubic",
        duration,
        delay,
      },
      scaleIn: {
        opacity: [0, 1],
        scale: [0.8, 1],
        easing: "easeOutBack",
        duration,
        delay,
      },
      slideUp: {
        opacity: [0, 1],
        translateY: [80, 0],
        easing: "easeOutExpo",
        duration: duration + 200,
        delay,
      },
    };

    anime({
      targets: el,
      ...presets[type] || presets.fadeInUp,
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateElement(entry.target as HTMLElement);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = containerRef.current.querySelectorAll("[data-anime]");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [animateElement]);

  return containerRef;
}
