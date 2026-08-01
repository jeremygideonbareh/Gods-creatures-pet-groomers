# Design System — Gods Creatures Pet Groomers

## Brand Identity
- Business: Gods Creatures Pet Groomers — luxury pet grooming salon
- Tagline: "where every tail wags brighter"
- Design Aesthetic: Premium, warm, approachable luxury. Pink-toned with glassmorphism effects.

## Color Palette

### Brand Colors
| Token | CSS Variable | HSL | Hex | Usage |
|-------|-------------|-----|-----|-------|
| Brand Pink | --color-brand-pink | hsl(350, 30%, 71%) | #d0999a | Primary backgrounds, UI elements |
| Brand Cream | --color-brand-cream | | | Light accents |
| Brand Charcoal | --color-brand-charcoal | | | Dark text, CTAs |
| Brand Ivory | --color-brand-ivory | | | Light backgrounds |

### Theme Variables (index.css @theme)
| Variable | Value | Usage |
|----------|-------|-------|
| --color-background | hsl(350 30% 71%) | Page background |
| --color-primary | hsl(350 25% 60%) | Primary actions |
| --color-secondary | hsl(350 20% 80%) | Secondary elements |
| --color-accent | hsl(350 25% 75%) | Accent highlights |
| --color-muted | hsl(350 20% 80%) | Muted text |
| --color-border | hsl(350 20% 65%) | Borders |
| --radius | 0.5rem | Border radius |

### Design Tokens (src/config/site-content.ts)
- designTokens.brandPink — hex value for brand pink
- designTokens.brandCharcoal — hex value for dark charcoal

## Typography

### Fonts
| Usage | Font | Source |
|-------|------|--------|
| Headings | DM Serif Display | Google Fonts |
| Body | Inter | Google Fonts |
| Fallback | system-ui, sans-serif | |

### CSS Variables
- --font-heading: 'DM Serif Display', serif
- --font-body: 'Inter', sans-serif

### Scale
| Element | Classes |
|---------|--------|
| Hero title | text-2xl md:text-5xl uppercase font-bold |
| Page headings | text-xl md:text-3xl uppercase font-bold |
| Body text | text-sm md:text-lg |
| Small/meta | text-xs text-white/60 |

## Spacing
- Page padding: p-6 md:p-8
- Card padding: p-3 md:p-5
- Gap between elements: gap-3 md:gap-4
- Section spacing: py-16 md:py-24

## Responsive Breakpoints
| Breakpoint | Width | Key Changes |
|-----------|-------|-------------|
| Default (mobile) | <768px | Single-column, stacked layout |
| md | 768px | Side-by-side layouts, larger text |
| lg | 1024px | Larger cards, full-width features |

## Glassmorphism Pattern
Used across modals, cards, nav, admin panels:
```css
bg-white/15-20 backdrop-blur-xl rounded-3xl border border-white/20-30
```
Variations:
- Cards: bg-white/15 backdrop-blur-xl rounded-3xl border border-white/20
- Modals: bg-black/60 backdrop-blur-sm (overlay) + bg-brand-pink/90 backdrop-blur-xl (content)
- Nav: backdrop-blur-md bg-brand-pink/20
- Dropzone: border-dashed bg-white/15

## Animation System

### CSS Animations (index.css)
- marquee — infinite horizontal slide for image sliders (25s)
- shiny-text — shimmer text effect
- float — gentle vertical floating
- pulse-soft — subtle opacity pulse

### Anime.js Scroll Animations (use-anime-scroll.ts)
Presets applied via data-anime attribute:
- fadeInUp — opacity 0→1, translateY 40→0
- fadeInLeft — opacity 0→1, translateX -40→0
- fadeInRight — opacity 0→1, translateX 40→0
- scaleIn — opacity 0→1, scale 0.8→1
- slideUp — translateY 60→0
- zoomIn — scale 0.5→1
- flipIn — rotateX 90→0
- textReveal — opacity 0→1, letterSpacing
- blurIn — filter blur 10→0
- elasticUp — translateY with spring easing

### Framer Motion (motion library)
Used in: BookingModal, AuthModal, AddPetModal, FeatureCarousel, BounceCardsFeatures
- Spring transitions for modals
- Card hover/tap animations
- AnimatePresence for enter/exit

### IntersectionObserver Fade-in
- .fade-section class with opacity:0, translateY:32px
- Observer adds .visible class at threshold 0.15
- CSS transition: opacity 0.8s ease, transform 0.8s ease

## Utility Classes (index.css)
- .glass-card — glassmorphism card
- .shimmer — loading skeleton animation
- .text-gradient-pink — pink gradient text
- .overlay-gradient — dark overlay gradient
- .scroll-progress — top progress bar
- .section-spacing — consistent section padding
- .float-anim — floating animation

## Accessibility
- @media (prefers-reduced-motion: reduce) disables all animations/transitions
- Focus trap on modals (tab cycling)
- aria-live regions for dynamic content
- Form labels on all inputs
- maxLength on all form inputs
- Body scroll lock when modals are open
