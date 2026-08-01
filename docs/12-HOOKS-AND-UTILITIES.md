# Hooks & Utilities — Gods Creatures Pet Groomers

## Custom Hooks (src/hooks/)

### useAnimeScroll (use-anime-scroll.ts)
**Purpose**: Scroll-driven animation system integrating animejs v4 with IntersectionObserver.

**Exports**:
- `useAnimeScroll(options)` — Main hook. Observes elements with `data-anime` attribute. When element enters viewport, runs corresponding anime.js preset animation. Supports `data-anime-delay` and `data-anime-duration` custom attributes.
- `useAnimeOnMount(params)` — Animates element when component mounts.
- `useParallax(speed)` — Scroll-driven vertical parallax movement.
- `useStaggerReveal(staggerDelay)` — Staggered reveal for child `.stagger-item` elements.

**Presets Dictionary**:
| Preset | Effect |
|--------|--------|
| fadeInUp | opacity 0→1, translateY 40→0 |
| fadeInLeft | opacity 0→1, translateX -40→0 |
| fadeInRight | opacity 0→1, translateX 40→0 |
| scaleIn | opacity 0→1, scale 0.8→1 |
| slideUp | translateY 60→0 |
| zoomIn | scale 0.5→1 |
| flipIn | rotateX 90→0 |
| textReveal | opacity 0→1, letterSpacing |
| blurIn | filter blur 10→0 |
| elasticUp | translateY with spring easing |

**Usage**: Add `data-anime="fadeInUp"` to any element. The hook automatically observes and animates.

### useActiveSection (use-active-section.ts)
**Purpose**: Detects the currently visible section in the viewport.
**Returns**: Active section ID string.
**Logic**: Scroll event listener, iterates backward through section IDs, checks `getBoundingClientRect().top <= 200`.

### useScrollProgress (use-scroll-progress.ts)
**Purpose**: Tracks page scroll progress as a percentage (0-100).
**Returns**: Progress number.
**Logic**: `(scrollY / (scrollHeight - innerHeight)) * 100` on passive scroll.

### useSnapScroll (use-snap-scroll.ts) — DEPRECATED
**Purpose**: Full-screen snap page navigation. Kept for reference but no longer used.
**Returns**: { currentPage, bookingOpen, setBookingOpen, heroVideoRef, navigateUp, navigateDown, goToPage }
**Features**: Wheel, touch, keyboard, inner-scroll awareness, hero video control.

### useBookingConflict (useBookingConflict.ts)
**Purpose**: Checks for booking slot conflicts before appointment submission.
**Returns**: { checking: boolean, error: string | null, checkConflict: (service, date) => Promise<boolean> }
**Logic**: Apollo Client query CHECK_BOOKING_CONFLICT with fetchPolicy: 'network-only'. Returns true if active booking exists for service+date.

## Utility Libraries (src/lib/)

### nhost.ts
**Exports**:
- `nhost` — Initialized Nhost client (createClient with subdomain + region)
- `NHOST_GRAPHQL_URL` — GraphQL endpoint URL
- `NHOST_FUNCTIONS_URL` — Serverless functions endpoint URL
- `isSessionValid()` — Parses JWT token, checks `exp` claim vs current time. Returns boolean.

### graphql.ts
**Centralized GraphQL operations**:
| Export | Type | Used In |
|--------|------|---------|
| GET_USER_PETS | Query | ProfilePage, booking-modal |
| INSERT_PET | Mutation | ProfilePage |
| GET_ADMIN_BOOKINGS | Query | AdminDashboard |
| UPDATE_BOOKING_STATUS | Mutation | AdminDashboard |
| GET_SITE_CONTENT | Query | content-service.ts |
| CHECK_BOOKING_CONFLICT | Query | useBookingConflict |
| UPDATE_BOOKING_PAYMENT_STATUS | Mutation | booking-modal |
| UPDATE_BOOKING_PAYMENT_DETAILS | Mutation | booking-modal |

**Not centralized** (inline):
- CREATE_BOOKING — in booking-modal.tsx
- UPSERT_SITE_CONTENT — in content-service.ts
- CREATE_PET — in AuthModal.tsx and AddPetModal.tsx

**Column naming convention**:
- pets: name (not pet_name), age_years (not age), weight_kg (not weight)
- bookings: pet { name breed } (no user sub-query)

### content-service.ts
**Exports**:
- TypeScript interfaces for all 16 content section types
- `SiteContent` — unified type combining all sections
- `SectionKey` — union type of all 15 section key strings
- `GET_ALL_SITE_CONTENT` — re-exported from graphql.ts
- `UPSERT_SITE_CONTENT` — insert_site_content_one with on_conflict
- `mapDbToSiteContent(rows, defaults)` — maps DB rows to typed SiteContent with deep merge

### utils.ts
**Exports**:
- `cn(...inputs: ClassValue[])` — Combines clsx (conditional class joining) with twMerge (Tailwind class conflict resolution)

## Config (src/config/)

### site-content.ts
**Key exports**:
- `adminEmails` — Array of admin emails from VITE_ADMIN_EMAIL
- `isAdmin(email)` — Case-insensitive, null-safe admin check
- `RUPEESIGN` — Unicode ₹ symbol
- `designTokens` — Brand colors (brandPink, brandCharcoal)
- `OPENING_HOURS` — Day-indexed map of business hours and booking slots
- `PRICING_MENU` — Full pricing matrix
- Default content objects: hero, whyChooseUs, services, reviews, bookingSection, pageBackgrounds, socialProof, gallery, team, process, faq, blog, store, storeCatalog

### store-products.ts
- `STORE_PHONE` — Phone number constant (8798897732)

## Context Providers (src/context/)

### AuthContext.tsx
- `AuthProvider` — Wraps children with auth state
- `useAuth()` — Returns { user, loading, sessionError }
- Listens to nhost.sessionStorage.onChange()

### SiteContentContext.tsx
- `SiteContentProvider` — Wraps children with CMS content
- `useSiteContent()` — Returns { content, loading, updateSection }
- Fetches from Hasura on mount, merges with defaults
