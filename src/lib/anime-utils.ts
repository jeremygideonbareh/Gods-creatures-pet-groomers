/**
 * anime.js animation presets for the premium upgrade.
 * Each preset is a function that returns an anime params object.
 */
import anime from "animejs";

export const fadeInUp = (target: string | HTMLElement | NodeListOf<Element>, delay = 0) => ({
  targets: target,
  opacity: [0, 1],
  translateY: [60, 0],
  easing: "easeOutCubic",
  duration: 800,
  delay: delay,
});

export const fadeInLeft = (target: string | HTMLElement | NodeListOf<Element>, delay = 0) => ({
  targets: target,
  opacity: [0, 1],
  translateX: [-60, 0],
  easing: "easeOutCubic",
  duration: 800,
  delay: delay,
});

export const fadeInRight = (target: string | HTMLElement | NodeListOf<Element>, delay = 0) => ({
  targets: target,
  opacity: [0, 1],
  translateX: [60, 0],
  easing: "easeOutCubic",
  duration: 800,
  delay: delay,
});

export const scaleIn = (target: string | HTMLElement | NodeListOf<Element>, delay = 0) => ({
  targets: target,
  opacity: [0, 1],
  scale: [0.8, 1],
  easing: "easeOutBack",
  duration: 600,
  delay: delay,
});

export const staggerFadeUp = (target: string | HTMLElement | NodeListOf<Element>, staggerDelay = 100) => ({
  targets: target,
  opacity: [0, 1],
  translateY: [40, 0],
  easing: "easeOutCubic",
  duration: 600,
  delay: anime.stagger(staggerDelay),
});

export const counter = (target: string | HTMLElement, from: number, to: number, duration = 2000) => ({
  targets: target,
  innerHTML: [from, to],
  easing: "easeOutQuad",
  duration: duration,
  round: 1,
});

export const parallaxUp = (el: HTMLElement, scrollY: number, speed = 0.3) => {
  const offset = scrollY * speed;
  el.style.transform = `translateY(${-offset}px)`;
};
