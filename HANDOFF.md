# Gods Creatures Pet Groomers — Complete Handover & Architecture Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [File Structure](#file-structure)
4. [Architecture Diagram](#architecture-diagram)
5. [Design System](#design-system)
6. [Component Breakdown](#component-breakdown)
7. [Data Layer (nhost.ts)](#data-layer-nhostts)
8. [Apollo Client Setup](#apollo-client-setup)
9. [Scroll System](#scroll-system)
10. [Deployment](#deployment)
11. [Environment Variables & Secrets](#environment-variables--secrets)
12. [Migration Log](#migration-log)
13. [Known Issues & Roadmap](#known-issues--roadmap)

---

## Project Overview

A modern single-page React app for **Gods Creatures Pet Groomers**, a luxury pet grooming salon based in **Malki, Shillong**. Built as a full-viewport snap-scroll experience with video hero, animated service carousel, review slider, and a 2-step booking modal wired to Nhost/Hasura GraphQL via Apollo Client.

| Field | Value |
|---|---|
| Business | Gods Creatures Pet Groomers |
| Location | Malki, Shillong |
| Hours | Mon–Sat 8am–4pm, Sunday closed |
| Tagline | *where every tail wags brighter* |
| Tech Stack | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, motion, lucide-react, **Nhost v4**, **Apollo Client v4**, Cloudflare Pages |

---

## Repository Structure

The GitHub repo at `jeremygideonbareh/Gods-creatures-pet-groomers` **is the React app root** — `package.json`, `vite.config.ts`, `index.html`, `src/`, `public/` are all at the top level. There is no nested `react-app/` directory in the repo.

```
repo root (GitHub) =
  ├── .env                     # Nhost credentials
  ├── wrangler.toml            # Cloudflare Pages config
  ├── .github/workflows/       # GitHub Actions deploy workflow
  ├── index.html               # Vite entry HTML
  ├── package.json             # Dependencies + scripts
  ├── vite.config.ts           # Build config
  ├── tsconfig.json            # TypeScript config
  ├── src/                     # Application source
  └── public/                  # Static assets (video, images)
```

**Local working copy path (for reference):**
`C:\Users\cloud\OneDrive\Desktop\Hybrid_Second_Brain\clients website\gods creatures website\`

This local folder contains extra files NOT in the repo:
- `index.html` — old static HTML site (1411 lines, full standalone pet groomer site)
- `images/` — images for the static site
- `new scrolling animation/` — experimental/legacy folder
- `why-choose-us.html` — standalone HTML page
- `react-app/` — this is a COPY of what's actually in the repo (the true repo root)

---

## File Structure

```
repo root/
├── .env                          # Nhost credentials (VITE_NHOST_SUBDOMAIN, VITE_NHOST_REGION)
├── wrangler.toml                 # Cloudflare Pages config (name, pages_build_output_dir)
├── .github/workflows/
│   └── deploy.yml                # GitHub Action: deploy to Cloudflare Pages via wrangler-action
├── public/
│   ├── herosectionvideo.mp4      # Hero background video (looping, muted)
│   ├── hero-poster.jpg           # Poster shown while video loads
│   ├── review-image1.png         # Review gallery images
│   ├── review-image2.png
│   ├── review-image3.png
│   └── reviewimage5.jpeg
├── src/
│   ├── components/ui/
│   │   ├── animated-scroll.tsx   # MAIN: full-page snap scroll, all 5 pages, video, overlays
│   │   ├── feature-carousel.tsx  # Services carousel (4 services, auto-play, spring animations)
│   │   ├── image-auto-slider.tsx # Infinite auto-scroll review image slider
│   │   └── booking-modal.tsx     # 2-step booking modal (info → form → Nhost GraphQL mutation)
│   ├── lib/
│   │   ├── nhost.ts              # Data layer — Nhost client + GraphQL URL export
│   │   └── utils.ts              # cn() helper (clsx + tailwind-merge)
│   ├── App.tsx                   # Root → renders <ScrollAdventure />
│   ├── main.tsx                  # Entry point — wraps App in ApolloProvider with Nhost auth link
│   └── index.css                 # Tailwind CSS 4 + theme tokens (pink palette)
├── index.html                    # Vite entry HTML (<script type="module" src="/src/main.tsx">)
├── package.json
├── vite.config.ts                # Path alias (@/), Tailwind plugin, base: '/'
├── tsconfig.json
└── tsconfig.app.json
```

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                        │
│  (auto-deployed from .github/workflows/deploy.yml)         │
│  URL: https://gods-creatures-pet-groomers.pages.dev        │
│  Build: npm install && npm run build → dist/               │
│                                                           │
│  Two deployment methods (both active):                    │
│  1. Cloudflare Git Integration — auto-deploys on push     │
│  2. GitHub Actions — wrangler-action as fallback          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│   ┌──────────────────────────────────────────────────┐   │
│   │              App.tsx                              │   │
│   │              ┃                                   │   │
│   │     ScrollAdventure (animated-scroll.tsx)         │   │
│   │        ├── Page 1: Hero (video)                   │   │
│   │        ├── Page 2: Why Choose Us                  │   │
│   │        ├── Page 3: Services (FeatureCarousel)     │   │
│   │        ├── Page 4: Reviews (ImageAutoSlider)      │   │
│   │        └── Page 5: Book Now (BookingModal)        │   │
│   │                                                   │   │
│   │   ┌──────────────────────────────────────────┐   │   │
│   │   │  ApolloProvider                           │   │   │
│   │   │  └── ApolloClient                        │   │   │
│   │   │      ├── createHttpLink(uri=NHOST_URL)   │   │   │
│   │   │      ├── setContext(authLink)            │   │   │
│   │   │      │   └── reads nhost.getUserSession()│   │   │
│   │   │      │        → Authorization: Bearer    │   │   │
│   │   │      └── InMemoryCache                   │   │   │
│   │   │                                           │   │   │
│   │   │  BookingModal                            │   │   │
│   │   │  └── useMutation(CREATE_BOOKING)         │   │   │
│   │   │       → insert_bookings_one              │   │   │
│   │   └──────────────────────────────────────────┘   │   │
│   └──────────────────────────────────────────────────┘   │
│                        │                                  │
└────────────────────────┼──────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                     Nhost (Hasura GraphQL)                 │
│                                                           │
│  Subdomain: [YOUR_NHOST_SUBDOMAIN]                       │
│  Region: [YOUR_NHOST_REGION]                              │
│  GraphQL URL: auto-constructed via generateServiceUrl()  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Table: bookings                                 │    │
│  │  ├── id (uuid, PK, auto-generated)               │    │
│  │  ├── customer_name (text, NOT NULL)              │    │
│  │  ├── email (text, NOT NULL)                      │    │
│  │  ├── phone (text)                                │    │
│  │  ├── service (text)                              │    │
│  │  ├── preferred_date (text)                       │    │
│  │  ├── notes (text)                                │    │
│  │  ├── advance_paid (numeric, NOT NULL)            │    │
│  │  ├── transaction_id (text, NOT NULL, UNIQUE)     │    │
│  │  └── created_at (timestamptz, default NOW())     │    │
│  │                                                   │    │
│  │  UNIQUE constraint: transaction_id               │    │
│  │  (enforced at database level — duplicate         │    │
│  │   UPI refs rejected with unique constraint       │    │
│  │   violation error)                               │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## Design System

### Colors
| Token | Hex | Usage |
|---|---|---|
| Brand Pink | `#d0999a` | Page backgrounds, primary UI elements |
| Dark Pink | `#c48a8b` | Hover/active states |
| White | `#FFFFFF` | Card text on hero overlays |
| Black/Transparent | `rgba(0,0,0,0.3–0.6)` | Hero overlay gradients |
| Gold accent | `#FFD6A5` | Secondary accents, highlights |

### Theme (index.css)
```css
@theme {
  --color-background: hsl(350 30% 71%);      /* #d0999a */
  --color-primary: hsl(350 25% 60%);
  --color-secondary: hsl(350 20% 80%);
  --color-accent: hsl(350 25% 75%);
  --color-muted: hsl(350 20% 80%);
  --color-border: hsl(350 20% 65%);
  --radius: 0.5rem;
}
```

### Fonts
| Usage | Font |
|---|---|
| Body | Quicksand (Google Font) |
| Headings | Quicksand (Google Font), uppercase |
| Fallback | Inter, system-ui, sans-serif |

### Typography Scale
- Page headings: `text-xl md:text-3xl uppercase font-bold`
- Hero title: `text-2xl md:text-5xl uppercase font-bold`
- Body text: `text-sm md:text-lg`
- Small/meta: `text-xs text-white/60`

### Spacing
- Page padding: `p-6 md:p-8`
- Card padding: `p-3 md:p-5`
- Gap between elements: `gap-3 md:gap-4`

### Responsive Breakpoints
| Breakpoint | Key Changes |
|---|---|
| Default (mobile) | Single-column, stacked 30%/70% panels |
| `md:` (768px) | Side-by-side 50/50 layout, larger text |
| `lg:` (1024px) | Larger cards, full feature carousel |

---

## Component Breakdown

### `animated-scroll.tsx` — Main Container (610 lines)

**Purpose:** Full-viewport snap-scroll interface with 5 pages.

**Pages:**
| # | Section | Content |
|---|---------|---------|
| 1 | Hero | Video background (auto-play, muted, loop) + overlay + heading "Gods Creatures Pet Groomers" + "Book Appointment" CTA |
| 2 | Why Choose Us | 4 glassmorphism cards: Vet-Backed Wellness, Luxury Spa Grooming, Years of Expertise, Luxury Imported Products |
| 3 | Our Signature Services | FeatureCarousel component renders here |
| 4 | Happy Clients | Testimonials (2 review cards) + ImageAutoSlider review gallery |
| 5 | Book Now | Location info card + "Book a Session" CTA → opens BookingModal |

**Navigation methods:**
- **Mouse wheel** — 50px delta threshold, respects inner scrollable content boundaries
- **Touch swipe** — 50px delta, detects inner scrollable elements
- **Arrow keys** — Up/Down arrows
- **Dot navigation** — Right side, click to jump to page
- **Chevron buttons** — Bottom right, Up/Down

**Key behaviors:**
- `scrolling.current` ref prevents rapid-fire navigation (1s lockout)
- Video plays on page 1, pauses when navigating away, resumes on return
- Inner scroll detection via `getScrollableAncestor()` — only navigates pages when inner content is at its scroll boundary
- `liquid-glass` CSS animation on buttons: gradient background-size 400%, 6s liquid flow loop

### `feature-carousel.tsx` — Services Carousel (287 lines)

**Purpose:** Interactive 3D carousel for the 4 signature services.

**Services:** Luxury bath & blow-dry, Stylish haircut, Dental hygiene, Pawdicure & nail art.

**States:**
- **Auto-play:** Cycles every 3 seconds (paused on hover)
- **Active card:** Full color image, description overlay, centered
- **Adjacent cards (prev/next):** Desaturated, scaled down 0.85, offset horizontally
- **Hidden cards:** Scaled 0.7, opacity 0, behind active card
- **Keyboard navigation:** Left/Right arrows
- **Chip navigation:** Click label chips in the left panel to jump to any service

**Animations (motion/spring):**
- Card transitions: `spring { stiffness: 260, damping: 25, mass: 0.8 }`
- Label chips: `spring { stiffness: 90, damping: 22, mass: 1 }`
- Description overlay: `AnimatePresence` with y-axis fade

**Edge cases:**
- `wrap()` utility handles circular index wrapping (e.g., from last back to first)
- `getCardStatus()` computes prev/active/next/hidden based on shortest circular distance
- Gradient overlays prevent label overflow at top/bottom of left panel

### `image-auto-slider.tsx` — Review Image Slider (51 lines)

**Purpose:** Infinite horizontal auto-scroll of review photos.

**Behavior:**
- Images duplicated (`[...images, ...images]`) for seamless looping
- `motion.div` animates `x: "-50%"` with `repeat: Infinity, duration: 20, ease: "linear"`
- Mask gradient fades edges to transparent
- Hover pauses via `whileHover` scale effect
- 4 images in the set, displayed as rounded cards (`w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44`)

**Image paths (public/):**
- `review-image1.png`, `review-image2.png`, `review-image3.png`, `reviewimage5.jpeg`
- Paths use `import.meta.env.BASE_URL` which resolves to `'/'` for Cloudflare Pages root deployment

### `booking-modal.tsx` — Booking Modal (342 lines)

**Purpose:** 2-step booking flow wired to Nhost/Hasura via Apollo Client `useMutation`.

**Steps:**
1. **Info step** — Shows ₹500 booking fee disclaimer, "Proceed to Schedule" button
2. **Form step** — Fields: name, email, phone, service select, preferred date, notes

**Advance Payment Section:**
- Right before the submit button, there's a dedicated "💳 Advance Payment (₹500)" section
- Contains a note explaining: "A ₹500 advance is required to secure your grooming slot. Pay via UPI and enter the reference below."
- Includes a required text input for **"UPI Reference No. / Transaction ID"**
- Styled with the same glassmorphism theme as other inputs (`bg-white/15 rounded-xl border border-white/25`)
- Wrapped in its own `div` with reduced padding to visually separate it from other fields

**GraphQL Mutation (defined with `gql` tag):**
```graphql
mutation CreateBooking($customer_name: String!, $email: String!, $phone: String!,
  $service: String!, $preferred_date: String!, $notes: String!,
  $advance_paid: numeric!, $transaction_id: String!) {
  insert_bookings_one(object: {
    customer_name: $customer_name, email: $email, phone: $phone,
    service: $service, preferred_date: $preferred_date, notes: $notes,
    advance_paid: $advance_paid, transaction_id: $transaction_id
  }) { id, customer_name }
}
```

**States:**
- **Closed:** `isOpen=false` → `AnimatePresence` removes from DOM
- **Open (info):** Scale+fade in animation, shows booking fee card with ₹500 disclaimer
- **Open (form):** Rendered form inputs with glassmorphism styling + advance payment section
- **Submitting:** Button shows "⏳ Sending..." and is disabled (`disabled:opacity-60 disabled:cursor-not-allowed`)
- **Success:** Shows a large "🎉 Woohoo!" success message for 1.5s, then auto-closes
- **Error:** Form stays visible with error message in a red banner (`bg-red-500/20 rounded-lg p-2`)

**Error Handling (5 tiers):**
| Scenario | Detection | User Message |
|---|---|---|
| Invalid email format | Regex validation before API call | "Please enter a valid email address." |
| Invalid phone format | Regex validation (if non-empty) before API call | "Please enter a valid phone number (7-15 digits)." |
| Empty transaction ID | Frontend validation before API call | "Please enter the UPI Transaction ID to confirm your ₹500 advance payment." |
| Duplicate UPI reference | `result.error.message` or `catch` contains `"unique constraint"` or `"unique_transaction_id"` | "This UPI Reference Number has already been used. Please check your details or contact support." |
| Any other error | Fallthrough in both `result.error` and `catch` | "Unable to process booking. Please try again." |

The error detection uses `.toLowerCase().includes()` on the error message string to check for both `"unique constraint"` and `"unique_transaction_id"` patterns — this works regardless of whether the error comes from Apollo's `result.error` or from a thrown exception in the `catch` block.

**Form inputs use `useRef` (not state):**
- `nameRef`, `emailRef`, `phoneRef`, `serviceRef`, `dateRef`, `notesRef`, `transactionIdRef`
- On submit, ref `.current.value` is read directly — no controlled component re-renders
- This keeps the form performant (no re-renders on keystroke) at the cost of not being able to do real-time validation

**Submit Flow (handleFormSubmit):**
1. `e.preventDefault()` — stop default form submission
2. `setErrorMessage("")` — clear any previous error
3. Extract `email` and `phone` from refs
4. Validate email against regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` — if invalid, show error and return
5. If phone is non-empty, validate against `/^\+?\d{7,15}$/` — if invalid, show error and return
6. Read `transactionIdRef.current?.value.trim()` — validate it's non-empty
7. If empty → show error, set `submitStatus="error"`, return early (never calls API)
8. `setSubmitStatus("loading")` — start loading state
9. `await createBooking({ variables: {...} })` — call Apollo mutation
10. Check `result.error` — if present, check for unique constraint or generic error
11. If no error → `setSubmitStatus("success")` → auto-close after 1.5s
12. If `catch` → same error detection logic

**Key Code Details:**
- `advance_paid` is hardcoded to `500` (numeric, matches the ₹500 booking fee)
- `transaction_id` is read from the user's real input (no longer auto-generated as `TXN-${Date.now()}`)
- Uses Apollo Client v4's `useMutation` — the mutate function returns `Promise<ApolloClient.MutateResult>` with `.error` property (not `.errors` as in AC v3)
- `ErrorLike` type only has `message`, `name`, `stack` — not `graphQLErrors` or `networkError`

**Edge cases:**
- Escape key closes modal
- Click overlay backdrop closes modal
- Closing/opening resets step to "info", clears status and error messages via `useEffect`
- Scroll locking: `document.body.style.overflow = 'hidden'` set on modal open, restored on close
- Email validated with regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) before submission
- Phone validated (if provided) for 7–15 digits (`/^\+?\d{7,15}$/`) before submission

---

## Data Layer (nhost.ts)

### Location
`src/lib/nhost.ts`

### Full File Content
```typescript
import { createClient, generateServiceUrl } from "@nhost/nhost-js";

const NHOST_SUBDOMAIN = import.meta.env.VITE_NHOST_SUBDOMAIN || "your-subdomain";
const NHOST_REGION = import.meta.env.VITE_NHOST_REGION || "";

export const nhost = createClient({
  subdomain: NHOST_SUBDOMAIN,
  region: NHOST_REGION,
});

export const NHOST_GRAPHQL_URL = generateServiceUrl(
  "graphql",
  NHOST_SUBDOMAIN,
  NHOST_REGION,
);
```

### Key Details
- Uses **Nhost v4 SDK** (`@nhost/nhost-js@^4.7.2`) — the new unified SDK
- `createClient()` is the factory function (not `new NhostClient()`)
- The v4 `NhostClient` class constructor takes 5 arguments (auth, storage, graphql, functions, sessionStorage) — this is NOT the public API. Use `createClient()` instead.
- `generateServiceUrl()` constructs the full GraphQL endpoint URL from subdomain + region
- Subdomain and region come from `.env` variables (`VITE_NHOST_SUBDOMAIN`, `VITE_NHOST_REGION`)
- Falls back to `"your-subdomain"` placeholder if env vars are not set
- This file **replaced** the old `src/lib/supabase.ts` (which had Supabase client + CRUD functions + SQL schema export)

### Current Values
- Subdomain and region stored in `.env` (`VITE_NHOST_SUBDOMAIN`, `VITE_NHOST_REGION`)
- GraphQL URL: constructed via `generateServiceUrl()` in `src/lib/nhost.ts`

### Migration from Supabase (what changed)
| Before (supabase.ts) | After (nhost.ts) |
|---|---|
| `createClient` from `@supabase/supabase-js` | `createClient` from `@nhost/nhost-js` |
| REST API via `supabase.from("bookings").insert()` | GraphQL API via Apollo Client `useMutation` |
| RLS policies (advance_paid >= 500) | Hasura permissions + DB UNIQUE constraint on transaction_id |
| Exported `createBooking`, `getBookings`, `getBooking`, `updateBooking`, `deleteBooking` | Only exports `nhost` client + `NHOST_GRAPHQL_URL` |
| Exported full SQL schema as `SQL_SCHEMA` string | No SQL export — schema managed in Nhost dashboard |
| Supabase anon key in source code | No keys in source — uses Nhost v4 SDK with env vars |

---

## Apollo Client Setup

### Location
`src/main.tsx`

### Full File Content
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { nhost, NHOST_GRAPHQL_URL } from "@/lib/nhost";
import "./index.css";
import App from "./App.tsx";

const httpLink = createHttpLink({ uri: NHOST_GRAPHQL_URL });

const authLink = setContext(async (_, { headers }) => {
  const session = nhost.getUserSession();
  const token = session?.accessToken;
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </StrictMode>,
);
```

### Provider Hierarchy
```
<StrictMode>
  <ApolloProvider client={apolloClient}>
    <App />
      <ScrollAdventure />
        ...
        <BookingModal />
          └── useMutation(CREATE_BOOKING) ← hits Nhost GraphQL endpoint
  </ApolloProvider>
</StrictMode>
```

### Apollo Client v4 Import Differences
| Import | Path (v4) | Notes |
|---|---|---|
| `ApolloProvider` | `@apollo/client/react` | Moved to `/react` subpath in v4 |
| `useMutation` | `@apollo/client/react` | Moved to `/react` subpath in v4 |
| `gql` | `@apollo/client` | Re-exported from `graphql-tag` |
| `ApolloClient` | `@apollo/client` | In core re-exports |
| `InMemoryCache` | `@apollo/client` | In core re-exports |
| `createHttpLink` | `@apollo/client` | In core re-exports |
| `setContext` | `@apollo/client/link/context` | Requires `rxjs` peer dep |

### Auth Link Behavior
- `setContext` runs before every GraphQL request
- Reads current Nhost session via `nhost.getUserSession()`
- If an `accessToken` exists, attaches it as `Authorization: Bearer <token>`
- This is how unauthenticated public users can still insert bookings (Nhost/Hasura permissions control what anonymous users can do)
- For the booking use case, public INSERT is allowed + the UNIQUE constraint on `transaction_id` prevents duplicates

### Why Not @nhost/react or @nhost/react-apollo
These packages are **deprecated** and incompatible with React 19 + `@nhost/nhost-js` v4:
- `@nhost/react@3.x` expects `@nhost/nhost-js@3.x` (has `NhostClientConstructorParams` type not present in v4)
- `@nhost/react-apollo@18.x` peer-depends on `react@^17.0.0 || ^18.0.0` (not React 19)
- `@nhost/apollo@9.x` peer-depends on `@apollo/client@^3.7.10` (not v4)
- Instead, we use vanilla `@apollo/client` v4 directly with `@nhost/nhost-js` v4

### Dependencies Added
```json
{
  "@apollo/client": "^4.2.2",
  "@nhost/nhost-js": "^4.7.2",
  "rxjs": "^7.8.2"
}
```

`rxjs` is a peer dependency of `@apollo/client`'s `setContext` link — the build will fail without it:
```
Error: [vite]: Rolldown failed to resolve import "rxjs" from
".../@apollo/client/link/context/index.js"
```

### Dependencies Removed
```json
{
  "@supabase/supabase-js": "^2.49.4"
}
```

Also fully removed: `@nhost/react`, `@nhost/react-apollo`, `@nhost/apollo` (installed briefly during migration trial, then uninstalled).

---

## Scroll System

### Architecture
The `animated-scroll.tsx` component manages a page index (`currentPage`) and renders all 5 pages as absolutely-positioned divs. Only the active page is at `translateY(0)`; others are at `translateY(-100%)` (above) or `translateY(100%)` (below). Transitions use CSS `transform` with smooth easing.

### Navigation Methods
| Method | Trigger | Threshold | Lockout |
|---|---|---|---|
| Wheel | `wheel` event | `Math.abs(deltaY) >= 50` | 1s |
| Touch | `touchstart`/`touchend` | `Math.abs(diff) >= 50` | 1s |
| Keyboard | `keydown` ArrowUp/Down | Any press | 1s |
| Dot nav | Click dots | Instant | 1s |
| Chevron | Click Up/Down buttons | Instant | 1s |

### Inner Scroll Detection
`getScrollableAncestor(el)` walks up the DOM tree to find elements with `overflow-y: auto/scroll` and `scrollHeight > clientHeight`. Before navigating pages, the component checks if the inner scrollable is at its boundary:
- Scrolling up: `scrollTop <= 0`
- Scrolling down: `scrollTop + clientHeight >= scrollHeight - 1` (the `-1` accounts for sub-pixel rounding)

### Known Scroll Issue
On page 3 (services/FeatureCarousel), the entire page is `overflow-y-auto` but the carousel is designed for consistent height. If the carousel height exceeds the viewport on small screens (320px–375px), the user may experience scroll conflicts between the page snap-scroll and inner content scrolling.

---

## Deployment

### Cloudflare Pages (Primary, Two Methods Active)

**Method 1: Cloudflare Git Integration (Automatic)**
- Connected via Cloudflare dashboard to `jeremygideonbareh/Gods-creatures-pet-groomers`
- Cloudflare auto-detects pushes to `main` branch and triggers a build
- Build settings configured in Cloudflare dashboard (these were set during initial Git integration setup):
  - **Build command:** `npm install && npm run build`
  - **Build output directory:** `dist`
  - **Root directory:** *(blank — uses repo root)*
- Cloudflare Account ID: `6450bfe26bbac5dbfa679d5af793705d`
- Cloudflare Project ID: `632c9c9f-e9d1-46e7-9294-b7a10d3b7feb`
- Deployment URL hash: `0b99e4a6`

**Method 2: GitHub Actions (`.github/workflows/deploy.yml`)**
```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=gods-creatures-pet-groomers
```
- This is a **fallback** in case the Git integration auto-deploy has issues
- Requires `CLOUDFLARE_API_TOKEN` secret in GitHub repo settings
- The Action may fail with "Could not route to /accounts//pages/projects/" if the project already has Git integration active (because the project is managed by the dashboard, not the API token)

**Important:** The Git integration method and the Action method can conflict. If Cloudflare's Git integration is active (which it is), the action may fail with a 7003 routing error because the project is owned by the Git integration, not the API token. In practice, the Git integration handles all deploys automatically — the Action is kept as a backup.

**Live URL:** `https://gods-creatures-pet-groomers.pages.dev`

### wrangler.toml (at repo root)
```toml
name = "gods-creatures-pet-groomers"
pages_build_output_dir = "dist"
```

**Note:** Cloudflare Pages `wrangler.toml` does NOT support the `[build]` section with `command`. Attempting to add it will fail validation:
```
ERROR: Configuration file for Pages projects does not support "build"
```
Build commands for Pages are configured exclusively in the Cloudflare dashboard or passed via CLI flags.

### Vite Config Notes
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',                    // Root-relative paths for Cloudflare Pages
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```
- `base: '/'` is critical — previously was `'/Gods-creatures-pet-groomers/'` for GitHub Pages sub-path deployment
- If you ever move back to GitHub Pages, this must be changed back to the repo name

### Deployment History
| Date | Event |
|---|---|
| Initial | GitHub Pages deploy via `.github/workflows/deploy.yml` |
| Migration | Changed `base` to `'/'`, deleted GitHub Pages workflow |
| Attempt 1 | Created `wrangler.toml` with `[build]` section — Cloudflare rejected it |
| Attempt 2 | Removed `[build]` section — Cloudflare accepted it but no build command |
| Attempt 3 | Used Cloudflare API to check project — found Git integration already active with correct build settings |
| Final | Site deployed successfully via Cloudflare Git integration |
| Redundant | Created GitHub Actions workflow as fallback |

### Local Development
```bash
# From repo root (where package.json lives)
npm install          # install deps (@nhost/nhost-js, @apollo/client, rxjs)
npm run dev          # Vite dev server with HMR (http://localhost:5173)
npm run build        # tsc -b && vite build → dist/
npm run preview      # Serve built dist/ locally for testing
npm run build --verbose  # Verbose build output for debugging
```

---

## Environment Variables & Secrets

### `.env` (at repo root, NOT checked into git)
```
VITE_NHOST_SUBDOMAIN=[YOUR_NHOST_SUBDOMAIN]
VITE_NHOST_REGION=[YOUR_NHOST_REGION]
```

These are Vite env vars (prefixed with `VITE_`) — they're bundled into the client-side code at build time. They are not server-side secrets. The Nhost subdomain and region are safe to be public (they just point to the GraphQL endpoint).

### GitHub Secrets
| Secret Name | Value | How to Set |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | *(set via `gh secret set`)* | Set via `gh secret set CLOUDFLARE_API_TOKEN --body "<token>" --repo jeremygideonbareh/Gods-creatures-pet-groomers` or via GitHub UI at Settings → Secrets and variables → Actions |

### Cloudflare API Token Details
[REDACTED]
- **Permissions:** Account → Cloudflare Pages → Edit, User → User Details → Read
- **Note:** The token was created without "Account → Account Settings → Read" permission, so `GET /accounts` returns an empty array. Account ID was instead extracted from the Cloudflare dashboard URL.

---

## Migration Log

### Session Summary (June 8, 2026)

**Phase 1: Supabase → Nhost Migration**
1. Read existing files (`main.tsx`, `App.tsx`, `supabase.ts`, `booking-modal.tsx`)
2. Installed `@nhost/nhost-js`, `@nhost/react`, `@nhost/react-apollo` (initial attempt)
3. Discovered peer dependency conflicts with React 19 — `@nhost/react` and `@nhost/react-apollo` are deprecated and incompatible
4. Uninstalled deprecated Nhost packages, kept `@nhost/nhost-js@^4.7.2`
5. Created `src/lib/nhost.ts` using `createClient()` from `@nhost/nhost-js` v4
6. Installed `@apollo/client@^4.2.2` — discovered Apollo Client v4 has different import paths than v3
7. Updated `src/main.tsx` with ApolloProvider + custom auth link using Nhost session
8. Deleted old `src/lib/supabase.ts`
9. Updated `booking-modal.tsx`:
   - Added `useRef` for all 7 form fields
   - Replaced `alert()` with `useMutation` from `@apollo/client/react`
   - Created `CREATE_BOOKING` GraphQL mutation with `gql` tag
   - Added loading, success, error states
   - Fixed TypeScript error: AC v4 `MutateResult` has `.error` not `.errors`

**Phase 2: Transaction ID Input**
10. Replaced auto-generated `transaction_id` with real user input
11. Added `transactionIdRef` ref
12. Added "Advance Payment (₹500)" section with UPI Reference Number input
13. Added frontend validation: empty transaction ID blocks submission
14. Updated mutation variables to pass real input value

**Phase 3: Error Handling**
15. Added duplicate transaction ID detection:
    - Checks for `"unique constraint"` or `"unique_transaction_id"` in error message
    - Shows user-friendly message for duplicates
    - Shows generic message for other errors
    - Form stays visible on error (user can correct)

**Phase 4: Cloudflare Pages Migration**
16. Changed `vite.config.ts` `base` from `'/Gods-creatures-pet-groomers/'` to `'/'`
17. Deleted `.github/workflows/deploy.yml` (old GitHub Pages action)
18. Created `wrangler.toml` with `[build]` section — first deploy attempt failed
19. Removed `[build]` section — second attempt succeeded for config validation
20. User pushed to GitHub — Cloudflare auto-deployed but served raw source files (no build)
21. Cloned GitHub repo, discovered it has a flat structure (app is at root, not nested)
22. Applied all changes to the cloned repo:
    - Copied `nhost.ts`, `main.tsx`, `booking-modal.tsx`
    - Updated `vite.config.ts`
    - Updated `package.json` with new deps
    - Created `.env` and `wrangler.toml`
23. Installed `rxjs` (build dependency for Apollo Client's context link)
24. Built and verified successfully
25. Committed and pushed to `main`
26. Created `.github/workflows/deploy.yml` for Cloudflare Pages via GitHub Actions
27. Added `CLOUDFLARE_API_TOKEN` to GitHub secrets via `gh secret set`
28. API check revealed Cloudflare project already existed with correct Git integration settings
29. Site deployed and verified working at `https://gods-creatures-pet-groomers.pages.dev`

---

## Known Issues & Roadmap

### Current Limitations
- **FeatureCarousel height on small screens** — The carousel uses fixed percentage heights within the snap-scroll page, which may cause overflow on very small screens (320px–375px).
- **No admin panel** — No admin dashboard for viewing/managing bookings. Content is hardcoded in components. Adding Nhost queries + admin page would enable content management.
- **Transaction ID persists after error** — When submission fails, the transaction ID input still shows the previously entered value, which may cause confusion if the user wants to try a different reference number.
- **GitHub Action may be redundant** — The Action workflow can fail because the Cloudflare project is managed via Git integration (dashboard). The Action is kept as a fallback but the primary deploy method is the auto Git integration.

### Completed Migrations
- ✅ **Supabase → Nhost** — Data layer migrated from `@supabase/supabase-js` to `@nhost/nhost-js` v4 SDK with Apollo Client GraphQL mutations
- ✅ **GitHub Pages → Cloudflare Pages** — Deployed via Cloudflare Pages with auto Git integration + GitHub Action fallback
- ✅ **Booking form wired to backend** — `alert()` replaced with Apollo `useMutation` to insert bookings via Hasura GraphQL
- ✅ **Real transaction ID input** — UPI Reference Number field added with frontend validation; auto-generated fake `TXN-*` IDs removed
- ✅ **Duplicate transaction ID detection** — Backend `UNIQUE` constraint on `transaction_id` is caught in both `result.error` and `catch` blocks with user-friendly error message
- ✅ **Error states** — Form stays visible on error; loading spinner + disabled button during submission; success state with auto-close
- ✅ **Vite base path** — Changed from `'/Gods-creatures-pet-groomers/'` to `'/'` for Cloudflare root deployment
- ✅ **Old dependencies removed** — `@supabase/supabase-js`, `@nhost/react`, `@nhost/react-apollo`, `@nhost/apollo` all removed
- ✅ **`src/lib/supabase.ts` deleted** — Replaced by `src/lib/nhost.ts`
- ✅ **Apollo Client v4** — Upgraded from no GraphQL client to Apollo Client v4 with correct import paths
- ✅ **Cloudflare wrangler.toml** — Created at repo root with correct Pages configuration (no `[build]` section)
- ✅ **GitHub Actions workflow** — Created for Cloudflare Pages deployment as fallback
- ✅ **Scroll lock on modal** — `document.body.style.overflow = 'hidden'` set on open, restored on close
- ✅ **Email/phone validation** — Regex validation before form submission; invalid email blocked, phone must be 7–15 digits if provided
- ✅ **`.env` added to `.gitignore`** — Prevents accidental commit of environment variables
- ✅ **Unused dep removed** — `@supabase/supabase-js` fully uninstalled

### Future Enhancements
1. **Admin dashboard** — Add admin page to view/manage bookings via Nhost/Hasura queries
2. **Loading/error/success animations** — Enhance the current states with better motion animations
3. **Static HTML version** — The folder above (`/gods creatures website/index.html`) is a separate 1411-line static site. Consider consolidating or removing it.
4. **Apollo Client v3→v4 migration guide** — If upgrading other projects, note that `useMutation`, `ApolloProvider`, and `gql` import paths changed in v4

---

*Last updated: June 8, 2026 (session 2)*
