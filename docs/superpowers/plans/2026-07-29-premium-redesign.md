# Premium Awwwards-Inspired Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use dispatching-parallel-agents + subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete redesign of Gods Creatures Pet Groomers website with Awwwards-inspired layout, anime.js scroll animations, 21st.dev animated components, new content sections, mobile optimization — while keeping booking modal, paywall, auth system, and all backend integration intact.

**Architecture:** SPA (React 19 + Vite 8) with free-scroll layout replacing snap-scroll. Each section is a full-viewport or content-driven component with IntersectionObserver-scrubbed anime.js reveals. Navigation transitions from transparent to solid on scroll. All modals (Auth, Booking, AddPet) remain untouched.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS 4, anime.js v4, motion (Framer Motion), Apollo Client (GraphQL), Nhost (auth/backend), 21st.dev components, lucide-react icons

## Global Constraints

- **NEVER modify:** `booking-modal.tsx`, `AuthModal.tsx`, `AddPetModal.tsx`, `main.tsx`, `App.tsx` (routing), `lib/nhost.ts`, `lib/graphql.ts`, `lib/utils.ts`, `lib/content-service.ts`, `context/AuthContext.tsx`, `context/SiteContentContext.tsx`, `hooks/useBookingConflict.ts`
- **Colour scheme MUST stay:** brandPink: #d0999a, darkPink: #c48a8b, brandCream: #faf3ec, brandCharcoal: #1c1c1c, brandIvory: #f5f0e8
- **All GraphQL queries/mutations remain unchanged**
- **All payment logic (Razorpay, Cashfree) remains unchanged**
- **All auth flows (Nhost) remain unchanged**
- **All existing section components keep their IDs** for navigation anchor linking
- **Mobile-first responsive:** test every section at 375px, 768px, 1024px, 1440px
- **Reduced motion respected:** `@media (prefers-reduced-motion: reduce)` disables all animations
- **No hardcoded secrets** — use env vars via `import.meta.env`

---

## File Structure

### Modified Files:
- `src/index.css` — Enhanced theme tokens, new animations, scrollbar, progress bar
- `src/hooks/use-anime-scroll.ts` — Enhanced with parallax, stagger, scroll-linked effects
- `src/components/ui/animated-scroll.tsx` — New layout orchestrator (replaces snap-scroll with free-scroll)
- `src/components/ui/section-header-enhanced.tsx` — Enhanced header with scroll animations
- `src/components/ui/social-proof-bar.tsx` — Redesigned with animated counters
- `src/components/ui/footer-enhanced.tsx` — Enhanced footer with newsletter signup
- `src/components/ui/feature-carousel.tsx` — Enhanced with 21st.dev styling
- `src/components/ui/image-auto-slider.tsx` — Enhanced with 21st.dev marquee
- `src/components/sections/HeroSection.tsx` — Complete redesign
- `src/components/sections/WhyChooseUsSection.tsx` — Redesign layout
- `src/components/sections/ServicesSection.tsx` — Redesign layout
- `src/components/sections/ReviewsSection.tsx` — Redesign layout
- `src/components/sections/BookingSection.tsx` — Redesign layout
- `src/components/sections/GallerySection.tsx` — Enhanced with 21st.dev components
- `src/config/site-content.ts` — Add new content (team, process, FAQ, blog)

### New Files:
- `src/components/sections/TeamSection.tsx` — Meet the team
- `src/components/sections/ProcessSection.tsx` — How it works (3-step process)
- `src/components/sections/FAQSection.tsx` — FAQ accordion
- `src/components/sections/BlogSection.tsx` — Tips & articles preview
- `src/components/ui/scroll-progress.tsx` — Extracted scroll progress bar
- `src/components/ui/navbar.tsx` — Extracted navigation component
- `src/components/ui/team-card.tsx` — Team member card
- `src/hooks/use-scroll-progress.ts` — Scroll progress hook
- `src/hooks/use-active-section.ts` — Active section tracking hook

### Unmodified (frozen):
- `src/components/ui/booking-modal.tsx`
- `src/components/ui/AuthModal.tsx`
- `src/components/ui/AddPetModal.tsx`
- `src/components/ui/UserMenu.tsx`
- `src/main.tsx`
- `src/App.tsx`
- `src/context/AuthContext.tsx`
- `src/context/SiteContentContext.tsx`
- `src/lib/*`
- `src/hooks/useBookingConflict.ts`
- `src/components/ErrorBoundary.tsx`
- `src/components/SessionErrorBoundary.tsx`

---

### Task 1: Install 21st.dev Components + Setup Enhanced Animations

**Files:**
- Modify: `src/index.css`
- Modify: `src/config/site-content.ts`

**Dependencies:** None

- [ ] **Step 1: Install required npm packages**

Run from `react-app/` directory:
```bash
npm install @21st-dev/react
```

(If the package doesn't exist, we'll use the 21st.dev MCP to generate copy-paste components instead.)

- [ ] **Step 2: Enhance CSS with new animation tokens**

Add to `src/index.css` before the reduced-motion section:

```css
/* ========== NEW ANIMATIONS ========== */

/* Parallax fade-scroll utility */
.parallax-slow {
  will-change: transform;
  transition: transform 0.1s linear;
}

/* Text reveal animation */
.text-reveal {
  overflow: hidden;
}
.text-reveal-inner {
  display: inline-block;
  animation: textReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: left center;
}
@keyframes textReveal {
  from {
    opacity: 0;
    transform: translateY(100%) rotateX(-20deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

/* Scale on scroll */
.scale-on-scroll {
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.scale-on-scroll.in-view {
  transform: scale(1);
  opacity: 1;
}
.scale-on-scroll:not(.in-view) {
  transform: scale(0.95);
  opacity: 0;
}

/* Section transition borders */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-brand-pink), transparent);
  opacity: 0.3;
  margin: 0 auto;
  max-width: 80%;
}

/* Blur reveal */
.blur-reveal {
  filter: blur(8px);
  transition: filter 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.blur-reveal.in-view {
  filter: blur(0);
  opacity: 1;
}
.blur-reveal:not(.in-view) {
  opacity: 0;
}

/* Stagger item base */
.stagger-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.stagger-item.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Image zoom on hover */
.img-zoom {
  overflow: hidden;
}
.img-zoom img {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
}
.img-zoom:hover img {
  transform: scale(1.08);
  filter: brightness(1.05);
}

/* Brand glow effect */
.glow-pink {
  box-shadow: 0 0 30px rgba(208, 153, 154, 0.15), 0 0 60px rgba(208, 153, 154, 0.05);
}

/* Floating paw decorative */
.paw-float {
  animation: pawFloat 6s ease-in-out infinite;
}
@keyframes pawFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
  33% { transform: translateY(-15px) rotate(5deg); opacity: 0.25; }
  66% { transform: translateY(-5px) rotate(-3deg); opacity: 0.2; }
}

/* Fixed z-index scale */
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-navbar: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}
```

- [ ] **Step 3: Add new content data to site-content.ts**

Add these new exports to `src/config/site-content.ts`:

```typescript
// ========== NEW CONTENT SECTIONS ==========

export const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Head Groomer",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop&q=60",
    bio: "10+ years of professional grooming experience. Certified Master Groomer with a passion for creative styling.",
    emoji: "🐾",
  },
  {
    name: "Mike Chen",
    role: "Senior Groomer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
    bio: "Specializes in breed-specific cuts and gentle handling of anxious pets. Vet-backed wellness advocate.",
    emoji: "🩺",
  },
  {
    name: "Emily Rodriguez",
    role: "Pet Stylist",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
    bio: "Award-winning creative groomer. Turns every pet into a masterpiece with patience and premium products.",
    emoji: "✂️",
  },
  {
    name: "Dr. James Park",
    role: "Veterinary Consultant",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60",
    bio: "Partnership vet ensuring every grooming session meets the highest standards of pet health and safety.",
    emoji: "🩺",
  },
] as const;

export const processSteps = [
  {
    step: 1,
    title: "Book a Session",
    description: "Choose your preferred service, date, and time. Our booking system makes it easy to schedule your pet's grooming session.",
    icon: "📅",
  },
  {
    step: 2,
    title: "Drop Off Your Pet",
    description: "Bring your furry friend to our salon in Malki. We'll discuss your requirements and take notes on any special needs.",
    icon: "🚗",
  },
  {
    step: 3,
    title: "Pamper & Pick Up",
    description: "We groom with care using premium products. You'll receive a notification when your pet is ready for collection — looking their absolute best!",
    icon: "✨",
  },
] as const;

export const faqItems = [
  {
    q: "How long does a grooming session take?",
    a: "Most sessions take 1.5–3 hours depending on the service and your pet's size, breed, and temperament. Full spa packages may take longer. We'll give you an estimated time when you book.",
  },
  {
    q: "What products do you use?",
    a: "We use only premium imported shampoos, conditioners, and treatments — all vet-approved and suitable for sensitive skin. We carry hypoallergenic options too.",
  },
  {
    q: "Do I need to book in advance?",
    a: "Yes, we operate by appointment only to ensure each pet gets undivided attention. A ₹500 booking fee secures your slot and is adjusted in your final bill.",
  },
  {
    q: "What if my pet is anxious or aggressive?",
    a: "Our team is trained in low-stress handling techniques. We recommend starting with a simple bath and brush session to build trust. Let us know about any behavioral concerns when booking.",
  },
  {
    q: "Do you groom cats too?",
    a: "Absolutely! We provide gentle grooming services for both dogs and cats. Our feline guests receive extra care in a quiet, separate area to minimize stress.",
  },
  {
    q: "What is your cancellation policy?",
    a: "We request 24 hours notice for cancellations. Late cancellations may forfeit the booking fee. We understand emergencies happen — just give us a call.",
  },
] as const;

export const blogPosts = [
  {
    title: "5 Signs Your Pet Needs a Grooming Session",
    excerpt: "From excessive shedding to visible mats, learn the tell-tale signs that your furry friend is due for a professional grooming session.",
    date: "2026-06-15",
    category: "Pet Care Tips",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "The Importance of Dental Hygiene for Pets",
    excerpt: "Regular dental care isn't just about fresh breath. Discover how professional teeth cleaning can prevent serious health issues in your pet.",
    date: "2026-05-28",
    category: "Health & Wellness",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Breed-Specific Grooming: A Complete Guide",
    excerpt: "Different breeds have different grooming needs. Our guide covers everything from Poodle clips to Labradoodle maintenance.",
    date: "2026-05-10",
    category: "Grooming Guide",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&auto=format&fit=crop&q=60",
  },
] as const;
```

- [ ] **Step 4: Update designTokens with new semantic values**

Add to `designTokens` in `site-content.ts`:
```typescript
export const designTokens = {
  brandPink: "#d0999a",
  darkPink: "#c48a8b",
  brandCream: "#faf3ec",
  brandCharcoal: "#1c1c1c",
  brandIvory: "#f5f0e8",
  // NEW semantic tokens
  brandPinkLight: "#f0e0e0",
  brandPinkDark: "#a87a7b",
  brandCreamDark: "#f0e8dc",
  brandCreamLight: "#fffcf7",
  fontHeading: "'DM Serif Display', Georgia, serif",
  fontBody: "'Inter', system-ui, -apple-system, sans-serif",
  transitionDefault: "cubic-bezier(0.16, 1, 0.3, 1)",
  transitionBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;
```

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/config/site-content.ts
git commit -m "chore: add animation tokens, new content data, design tokens"
```

---

### Task 2: Create New Reusable Hooks & Components

**Files:**
- Create: `src/hooks/use-scroll-progress.ts`
- Create: `src/hooks/use-active-section.ts`
- Create: `src/components/ui/scroll-progress.tsx`
- Create: `src/components/ui/navbar.tsx`
- Modify: `src/hooks/use-anime-scroll.ts`

**Interfaces:**
- Consumes: CSS animation tokens from Task 1
- Produces: Hooks used by animated-scroll.tsx

- [ ] **Step 1: Create use-scroll-progress hook**

```typescript
// src/hooks/use-scroll-progress.ts
import { useState, useEffect } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}
```

- [ ] **Step 2: Create use-active-section hook**

```typescript
// src/hooks/use-active-section.ts
import { useState, useEffect } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] || "");

  useEffect(() => {
    const onScroll = () => {
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200) {
          setActive(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds]);

  return active;
}
```

- [ ] **Step 3: Update use-anime-scroll with enhanced presets**

Replace the presets and add new methods in `src/hooks/use-anime-scroll.ts`:

```typescript
// Enhanced presets
const PRESETS: Record<string, AnimeParams> = {
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

// Add a new method for scroll-linked parallax
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

// Add staggered reveal method
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
```

- [ ] **Step 4: Create scroll-progress component**

```typescript
// src/components/ui/scroll-progress.tsx
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[var(--z-toast)] h-[3px] pointer-events-none"
      style={{
        background: `linear-gradient(90deg, ${BRAND_PINK}, #e8b4b5, ${BRAND_PINK})`,
        width: `${progress}%`,
        transition: "width 0.1s linear",
      }}
    />
  );
}
```

- [ ] **Step 5: Extract Navbar component**

```typescript
// src/components/ui/navbar.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Menu, X, PawPrint } from "lucide-react";
import { nhost } from "@/lib/nhost";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

interface NavbarProps {
  scrolled: boolean;
  activeSection: string;
  navItems: { id: string; label: string }[];
  onNavClick: (id: string) => void;
  onBookClick: () => void;
}

export function Navbar({ scrolled, activeSection, navItems, onNavClick, onBookClick }: NavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await nhost.auth.signOut({});
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[var(--z-navbar)] transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-brand-pink/10"
          : "bg-gradient-to-b from-black/40 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavClick("hero")}
            className="flex items-center gap-2.5 group"
          >
            <div
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]"
              style={{ backgroundColor: BRAND_PINK }}
            >
              <PawPrint size={18} className="text-white" />
            </div>
            <span
              className={`font-heading text-base md:text-lg font-bold transition-colors duration-300 ${
                scrolled ? "text-brand-charcoal" : "text-white"
              }`}
            >
              Gods Creatures
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  activeSection === item.id
                    ? "text-brand-pink"
                    : scrolled
                    ? "text-brand-charcoal/70 hover:text-brand-charcoal hover:bg-black/5"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: BRAND_PINK }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Book CTA (desktop) */}
            <button
              onClick={onBookClick}
              className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${
                scrolled
                  ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/25"
                  : "bg-white/15 text-white border border-white/30 hover:bg-white/25"
              }`}
            >
              <span>Book Now</span>
              <span>🐾</span>
            </button>

            {/* Admin button */}
            {isAdmin(user?.email) && (
              <button
                onClick={() => navigate("/admin")}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  scrolled
                    ? "bg-brand-pink/10 text-brand-charcoal hover:bg-brand-pink/20 border border-brand-pink/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                }`}
              >
                <Shield size={14} />
                Admin
              </button>
            )}

            {/* Logout */}
            {user && (
              <button
                onClick={handleLogout}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  scrolled
                    ? "text-brand-charcoal/60 hover:text-red-500 hover:bg-red-50"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                aria-label="Sign Out"
              >
                <LogOut size={14} />
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${
                scrolled ? "text-brand-charcoal hover:bg-black/5" : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-brand-pink/10 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavClick(item.id); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-brand-pink/10 text-brand-pink"
                    : "text-brand-charcoal/70 hover:bg-black/5"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-brand-pink/10 pt-2 mt-2">
              <button
                onClick={() => { onBookClick(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium bg-brand-pink text-white flex items-center gap-2"
              >
                <span>🐾</span> Book Appointment
              </button>
            </div>
            {isAdmin(user?.email) && (
              <button
                onClick={() => { navigate("/admin"); setMobileOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-brand-charcoal/70 hover:bg-black/5 flex items-center gap-2"
              >
                <Shield size={14} />
                Admin Panel
              </button>
            )}
            {user && (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500/70 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/hooks/ src/components/ui/scroll-progress.tsx src/components/ui/navbar.tsx
git commit -m "feat: add reusable hooks, scroll progress, navbar component"
```

---

### Task 3: Redesign HeroSection (Awwwards Premium)

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

**Dependencies:** Task 1, Task 2

**Design inspiration:** Premium pet grooming hero with split layout — video left, content right overlay with animated text reveals, floating decorative elements, scroll indicator.

- [ ] **Step 1: Rewrite HeroSection.tsx**

```typescript
import { useEffect, useRef, type RefObject } from "react";
import { animate, stagger, createTimeline } from "animejs";
import { useSiteContent } from "@/context/SiteContentContext";
import { designTokens } from "@/config/site-content";
import { ArrowDown, Sparkles } from "lucide-react";

const BASE = import.meta.env.BASE_URL;
const BRAND_PINK = designTokens.brandPink;
const BRAND_CHARCOAL = designTokens.brandCharcoal;

interface HeroSectionProps {
  onBookClick: () => void;
  heroVideoRef: RefObject<HTMLVideoElement | null>;
}

export function HeroSection({ onBookClick, heroVideoRef }: HeroSectionProps) {
  const { content } = useSiteContent();
  const hero = content.hero;
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = createTimeline({ easing: "cubicBezier(0.16, 1, 0.3, 1)" });

    // Badge entrance
    if (badgeRef.current) {
      tl.add(badgeRef.current, {
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 600,
      });
    }

    // Overlay fade
    if (overlayRef.current) {
      tl.add(overlayRef.current, {
        opacity: [0, 1],
        duration: 1500,
      }, "-=300");
    }

    // Text reveal sequence
    const heroLines = textRef.current?.querySelectorAll(".hero-line");
    if (heroLines && heroLines.length > 0) {
      tl.add(heroLines, {
        opacity: [0, 1],
        translateY: [60, 0],
        rotateX: [-15, 0],
        duration: 1000,
        delay: stagger(200, { from: "first" }),
      }, "-=800");
    }

    // CTA buttons
    tl.add(".hero-cta", {
      opacity: [0, 1],
      scale: [0.92, 1],
      duration: 700,
    }, "-=500");

    // Scroll indicator
    if (scrollIndicatorRef.current) {
      tl.add(scrollIndicatorRef.current, {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600,
      }, "-=300");
    }

    // Floating paw particles
    if (particlesRef.current) {
      const paws = particlesRef.current.querySelectorAll(".paw-particle");
      paws.forEach((paw, i) => {
        animate(paw, {
          translateY: [0, -80 - Math.random() * 40],
          translateX: [0, (Math.random() - 0.5) * 60],
          opacity: [0.4, 0],
          scale: [0.8, 1.4],
          rotate: [0, 360],
          duration: 5000 + Math.random() * 4000,
          delay: i * 1000,
          loop: true,
          easing: "cubicBezier(0.16, 1, 0.3, 1)",
        });
      });
    }

    return () => {};
  }, []);

  const handleLearnMore = () => {
    const nextSection = document.getElementById("why-choose-us");
    if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-charcoal">
      {/* Video Background - full bleed */}
      <video
        ref={heroVideoRef}
        className="absolute inset-0 w-full h-full object-cover scale-105"
        src={`${BASE}${hero.video}`}
        poster={`${BASE}${hero.poster}`}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Multi-layer overlay for depth */}
      <div
        ref={overlayRef}
        className="absolute inset-0 opacity-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(28, 28, 28, 0.75) 0%,
              rgba(28, 28, 28, 0.2) 40%,
              rgba(28, 28, 28, 0.45) 70%,
              rgba(28, 28, 28, 0.8) 100%
            )
          `,
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, #e8b4b5, ${BRAND_PINK}, transparent)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 3s infinite",
        }}
      />

      {/* Floating paw particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
      >
        {["🐾", "🐾", "🐾", "🐾", "🐾", "🐾", "🐾"].map((_, i) => (
          <span
            key={i}
            className="paw-particle absolute text-white/20"
            style={{
              left: `${10 + i * 12}%`,
              bottom: `${5 + Math.random() * 40}%`,
              fontSize: `${1 + Math.random() * 2}rem`,
              transform: `rotate(${Math.random() * 60 - 30}deg)`,
            }}
          >
            🐾
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-white p-6 md:p-12 lg:p-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium badge */}
          <div
            ref={badgeRef}
            className="opacity-0 mb-6 md:mb-8"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium"
              style={{
                backgroundColor: `${BRAND_PINK}20`,
                color: BRAND_PINK,
                border: `1px solid ${BRAND_PINK}30`,
                backdropFilter: "blur(8px)",
              }}
            >
              <Sparkles size={12} />
              Premium Pet Grooming Since 2018
            </span>
          </div>

          {/* Main Heading with word-by-word animation */}
          <h1 className="hero-line opacity-0 font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[1.05] tracking-tight drop-shadow-2xl text-wrap-balance">
            {hero.title.split(" ").map((word, i) => (
              <span
                key={i}
                className="inline-block mr-[0.12em] hover:scale-105 transition-transform duration-300 hover:text-brand-pink"
                style={{
                  textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                }}
              >
                {word}
                {i === hero.title.split(" ").length - 1 ? "" : " "}
              </span>
            ))}
          </h1>

          {/* Decorated divider */}
          <div className="hero-line opacity-0 flex items-center justify-center gap-4 mt-6 mb-6">
            <div className="w-16 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${BRAND_PINK})` }} />
            <span className="text-brand-pink text-lg">✦</span>
            <div className="w-16 h-[1px]" style={{ background: `linear-gradient(90deg, ${BRAND_PINK}, transparent)` }} />
          </div>

          {/* Subtitle */}
          <p className="hero-line opacity-0 text-base md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
            {hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta opacity-0 mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBookClick}
              className="group relative px-10 py-4 rounded-full font-semibold text-base md:text-lg uppercase tracking-wider transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 glow-pink"
              style={{ backgroundColor: BRAND_PINK, color: BRAND_CHARCOAL }}
            >
              <span className="relative z-10 flex items-center gap-2">
                🐾 {hero.cta}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                }}
              />
            </button>

            <button
              onClick={handleLearnMore}
              className="px-8 py-4 rounded-full font-medium text-sm md:text-base tracking-wider border border-white/25 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Learn More</span>
              <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 cursor-pointer"
        onClick={handleLearnMore}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: BRAND_PINK, animation: "scroll-indicator 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: redesign hero section with premium Awwwards-inspired layout"
```

---

### Task 4: Redesign WhyChooseUsSection (Split Layout)

**Files:**
- Modify: `src/components/sections/WhyChooseUsSection.tsx`

**Dependencies:** Task 1, Task 2

- [ ] **Step 1: Rewrite WhyChooseUsSection.tsx**

```typescript
import { useRef, useEffect } from "react";
import { animate } from "animejs";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { designTokens } from "@/config/site-content";
import { CheckCircle } from "lucide-react";

const BRAND_PINK = designTokens.brandPink;
const CARD_ICONS = ["🩺", "🧴", "🕐", "✨"];

export function WhyChooseUsSection() {
  const { content } = useSiteContent();
  const { whyChooseUs, pageBackgrounds } = content;
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const items = cardsRef.current.querySelectorAll(".value-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(items, {
              opacity: [0, 1],
              translateY: [40, 0],
              delay: (_el: Element, i: number) => i * 120,
              easing: "cubicBezier(0.16, 1, 0.3, 1)",
              duration: 700,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center" id="why-choose-us">
      {/* Background with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 parallax-slow"
        style={{ backgroundImage: `url(${pageBackgrounds.whyChooseUs})` }}
      />
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg, rgba(28,28,28,0.85) 0%, rgba(28,28,28,0.35) 50%, rgba(28,28,28,0.7) 100%)`,
      }} />

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-8 py-20 md:py-28">
        <SectionHeaderEnhanced
          heading={whyChooseUs.heading}
          subtitle="What sets us apart — decades of expertise, genuine passion, and the finest products for your beloved pet."
          align="center"
          light
          badge="Why Choose Us"
        />

        <div ref={cardsRef} className="max-w-6xl mx-auto mt-4 md:mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {whyChooseUs.cards.map((card, i) => (
              <div
                key={i}
                className="value-card opacity-0 group relative rounded-2xl overflow-hidden p-6 md:p-8 transition-all duration-500 hover:translate-y-[-4px]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(500px circle at 50% 50%, ${BRAND_PINK}20, transparent)`,
                  }}
                />

                <div className="relative z-10 flex items-start gap-4 md:gap-5">
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-5deg]"
                    style={{ backgroundColor: `${BRAND_PINK}25` }}
                  >
                    <span className="drop-shadow-lg">{CARD_ICONS[i]}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-white/65 text-sm md:text-base leading-relaxed">
                      {card.description}
                    </p>
                    <div
                      className="mt-3 h-0.5 rounded-full w-0 group-hover:w-1/3 transition-all duration-500"
                      style={{ backgroundColor: BRAND_PINK }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${BRAND_PINK}60, transparent)` }}
      />
    </div>
  );
}

export default WhyChooseUsSection;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/WhyChooseUsSection.tsx
git commit -m "feat: redesign why choose us with glassmorphism cards and staggered reveals"
```

---

### Task 5: Redesign SocialProofBar + ServicesSection + GallerySection

**Files:**
- Modify: `src/components/ui/social-proof-bar.tsx`
- Modify: `src/components/sections/ServicesSection.tsx`
- Modify: `src/components/sections/GallerySection.tsx`

**Dependencies:** Task 1, Task 2

- [ ] **Step 1: Enhance SocialProofBar with premium styling**

In `social-proof-bar.tsx`, enhance the layout with divided stat cards, floating animation, and decorative elements. Keep the anime.js counter animation.

- [ ] **Step 2: Redesign ServicesSection with premium layout**

Enhance `ServicesSection.tsx` with decorative elements, larger layout, smoother transitions.

- [ ] **Step 3: Enhance GallerySection with 21st.dev-style marquee**

Add smoother marquee, gradient overlays, image captions on hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/social-proof-bar.tsx src/components/sections/ServicesSection.tsx src/components/sections/GallerySection.tsx
git commit -m "feat: redesign social proof, services, and gallery sections"
```

---

### Task 6: Redesign ReviewsSection + BookingSection + Enhanced Footer

**Files:**
- Modify: `src/components/sections/ReviewsSection.tsx`
- Modify: `src/components/sections/BookingSection.tsx`
- Modify: `src/components/ui/footer-enhanced.tsx`

**Dependencies:** Task 1, Task 2

- [ ] **Step 1: Redesign ReviewsSection**

Enhanced split layout with staggered testimonial cards, floating quote marks, image gallery with gradient masks.

- [ ] **Step 2: Redesign BookingSection**

Premium booking CTA with contact info cards, animated CTA button, background parallax.

- [ ] **Step 3: Redesign Footer**

Add newsletter signup section (frontend only), social links with hover animations, improved layout.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ReviewsSection.tsx src/components/sections/BookingSection.tsx src/components/ui/footer-enhanced.tsx
git commit -m "feat: redesign reviews, booking, and footer sections"
```

---

### Task 7: Create New Sections (Team, Process, FAQ, Blog)

**Files:**
- Create: `src/components/sections/TeamSection.tsx`
- Create: `src/components/sections/ProcessSection.tsx`
- Create: `src/components/sections/FAQSection.tsx`
- Create: `src/components/sections/BlogSection.tsx`

**Dependencies:** Task 1 (site-content.ts new data)

- [ ] **Step 1: Create TeamSection.tsx**

```typescript
import { useRef, useEffect } from "react";
import { animate } from "animejs";
import { SectionHeaderEnhanced } from "@/components/ui/section-header-enhanced";
import { teamMembers, designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

export function TeamSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".team-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(items, {
              opacity: [0, 1],
              translateY: [40, 0],
              delay: (_el: Element, i: number) => i * 100,
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
    <section id="team" className="relative w-full py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "#f5f0e8" }}>
      <div className="px-4 md:px-8">
        <SectionHeaderEnhanced
          heading="Meet Our Team"
          subtitle="Passionate professionals dedicated to your pet's happiness and well-being."
          align="center"
          badge="Team"
        />
      </div>

      <div ref={gridRef} className="max-w-6xl mx-auto px-4 md:px-8 mt-4 md:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="team-card opacity-0 group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                {/* Image container */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"
                  style={{
                    background: `linear-gradient(to top, rgba(28,28,28,0.8), transparent)`,
                  }}
                >
                  <p className="text-white text-xs leading-relaxed">{member.bio}</p>
                </div>
                {/* Info bar */}
                <div className="p-4 flex items-center gap-3">
                  <span className="text-xl">{member.emoji}</span>
                  <div>
                    <h3 className="font-heading font-bold text-brand-charcoal text-sm">{member.name}</h3>
                    <p className="text-muted-foreground text-xs">{member.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
```

- [ ] **Step 2: Create ProcessSection.tsx**

3-step process with anime.js staggered reveals and connecting line animation.

- [ ] **Step 3: Create FAQSection.tsx**

Accordion FAQ with motion AnimatePresence, click-to-expand.

- [ ] **Step 4: Create BlogSection.tsx**

Blog preview cards with image hover effects, date badge, category tag.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/TeamSection.tsx src/components/sections/ProcessSection.tsx src/components/sections/FAQSection.tsx src/components/sections/BlogSection.tsx
git commit -m "feat: add new sections - team, process, faq, blog"
```

---

### Task 8: Update Main Layout Orchestrator (animated-scroll.tsx)

**Files:**
- Modify: `src/components/ui/animated-scroll.tsx`

**Dependencies:** Tasks 3-7 (all sections complete)

- [ ] **Step 1: Rewrite animated-scroll.tsx with new sections + free-scroll**

Replace the snap-scroll layout with a free-scrolling layout. Add all new sections. Keep all modals and logic intact.

```typescript
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/config/site-content";
import { useAnimeScroll } from "@/hooks/use-anime-scroll";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Navbar } from "@/components/ui/navbar";
import { SocialProofBar } from "@/components/ui/social-proof-bar";
import { EnhancedFooter } from "@/components/ui/footer-enhanced";
import HeroSection from "@/components/sections/HeroSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import BookingSection from "@/components/sections/BookingSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { BlogSection } from "@/components/sections/BlogSection";
import BookingModal from "@/components/ui/booking-modal";
import AuthModal from "@/components/ui/AuthModal";
import AddPetModal from "@/components/ui/AddPetModal";
import UserMenu from "@/components/ui/UserMenu";

const COUNT_MY_PETS = gql`
  query CountMyPetsAfterLogin {
    pets_aggregate {
      aggregate { count }
    }
  }
`;

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "why-choose-us", label: "About" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
  { id: "booking", label: "Book" },
];

export default function ScrollAdventure() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bookingIntentRef = useRef(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const scrollRef = useAnimeScroll();
  const apolloClient = useApolloClient();

  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);

      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAuthSuccess = async () => {
    setAuthOpen(false);
    if (bookingIntentRef.current) {
      bookingIntentRef.current = false;
      setBookingOpen(true);
      return;
    }
    try {
      const { data } = await apolloClient.query<{
        pets_aggregate: { aggregate: { count: number } };
      }>({
        query: COUNT_MY_PETS,
        fetchPolicy: "network-only",
      });
      if ((data?.pets_aggregate?.aggregate?.count ?? 0) === 0) {
        setShowPetForm(true);
      }
    } catch (err) {
      console.error("Failed to check pet count:", err);
    }
  };

  const handleBookClick = () => {
    if (user) {
      setBookingOpen(true);
    } else {
      bookingIntentRef.current = true;
      setAuthOpen(true);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={scrollRef} className="bg-brand-cream select-none">
      <ScrollProgress />

      <Navbar
        scrolled={scrolled}
        activeSection={activeSection}
        navItems={NAV_ITEMS}
        onNavClick={scrollToSection}
        onBookClick={handleBookClick}
      />

      {/* Sections */}
      <section id="hero">
        <HeroSection onBookClick={handleBookClick} heroVideoRef={heroVideoRef} />
      </section>

      <section id="why-choose-us">
        <WhyChooseUsSection />
      </section>

      <SocialProofBar />

      <section id="services">
        <ServicesSection />
      </section>

      <section id="process" className="section-spacing">
        <ProcessSection />
      </section>

      <section id="gallery">
        <GallerySection />
      </section>

      <section id="team">
        <TeamSection />
      </section>

      <section id="reviews">
        <ReviewsSection />
      </section>

      <section id="faq">
        <FAQSection />
      </section>

      <section id="blog">
        <BlogSection />
      </section>

      <section id="booking">
        <BookingSection onBookClick={handleBookClick} />
      </section>

      <EnhancedFooter />

      {/* Modals - UNCHANGED */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => { setAuthOpen(false); bookingIntentRef.current = false; }}
        onAuthSuccess={handleAuthSuccess}
      />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      <AddPetModal isOpen={showPetForm} onClose={() => setShowPetForm(false)} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/animated-scroll.tsx
git commit -m "feat: update main layout with new sections and free-scroll architecture"
```

---

### Task 9: Mobile Optimization Pass

**Files:**
- All section components
- `src/index.css`

**Dependencies:** Tasks 3-8

- [ ] **Step 1: Audit and fix mobile breakpoints**
- Ensure all sections look great at 375px width
- Check font sizes don't overflow on mobile
- Verify touch targets are ≥44px
- Test nav dropdown on mobile
- Ensure booking modal is scrollable on small screens

- [ ] **Step 2: Add mobile-specific CSS utilities**

Add to `src/index.css`:
```css
/* Mobile safe area */
@supports (padding: env(safe-area-inset-bottom)) {
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Touch-friendly targets */
@media (max-width: 768px) {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ src/components/ui/ src/index.css
git commit -m "perf: mobile optimization pass with responsive fixes"
```

---

### Task 10: Build Verification & Quality Assurance

**Files:** All

**Dependencies:** All previous tasks

- [ ] **Step 1: Run build**

```bash
npm run build
```
Expected: Build succeeds with no errors. If TypeScript errors, fix them.

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 3: Verify all sections render correctly**

Check the dev server at each breakpoint:
- 375px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1440px (wide)

- [ ] **Step 4: Verify all modals still work**
- AuthModal (sign in, sign up, forgot password)
- BookingModal (step 1 info, step 2 form with payment)
- AddPetModal

- [ ] **Step 5: Verify navigation scrolls to correct sections**
- Click each nav item → smooth scroll to section
- Mobile nav → same behavior

- [ ] **Step 6: Verify anime.js scroll animations work**
- Scroll through page
- Elements animate into view
- No console errors

- [ ] **Step 7: Final commit with all changes**

```bash
git add .
git commit -m "feat: complete premium redesign with awwwards-inspired layout and animations"
```
