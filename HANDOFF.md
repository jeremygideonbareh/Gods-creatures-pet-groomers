# Gods Creatures Pet Groomers — Complete Handover & Architecture Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [File Structure](#file-structure)
4. [Architecture Diagram](#architecture-diagram)
5. [Design System](#design-system)
6. [Component Breakdown](#component-breakdown)
7. [Routing](#routing)
8. [Auth System](#auth-system)
9. [Pet Profiles (ProfilePage)](#pet-profiles-profilepage)
10. [Admin Dashboard](#admin-dashboard)
11. [Data Layer (nhost.ts)](#data-layer-nhostts)
12. [Apollo Client Setup](#apollo-client-setup)
13. [Scroll System](#scroll-system)
14. [ErrorBoundary](#errorboundary)
15. [Configuration (site-content.ts)](#configuration-site-contentts)
16. [Deployment](#deployment)
17. [Environment Variables & Secrets](#environment-variables--secrets)
18. [Migration Log](#migration-log)
19. [Known Issues & Roadmap](#known-issues--roadmap)

---

## Project Overview

A modern single-page React app for **Gods Creatures Pet Groomers**, a luxury pet grooming salon based in **Malki, Shillong**. Built as a full-viewport snap-scroll experience with video hero, animated service carousel, review slider, user authentication (Nhost), pet profile management, admin dashboard, and a 2-step booking modal wired to Nhost/Hasura GraphQL via Apollo Client.

| Field | Value |
|---|---|
| Business | Gods Creatures Pet Groomers |
| Location | Malki, Shillong |
| Hours | Mon–Sat 8am–4pm, Sunday closed |
| Tagline | *where every tail wags brighter* |
| Tech Stack | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, motion, lucide-react, **Nhost v4**, **Apollo Client v4**, **react-router-dom v7**, Cloudflare Pages |

---

## Repository Structure

The GitHub repo at `jeremygideonbareh/Gods-creatures-pet-groomers` **is the React app root** — `package.json`, `vite.config.ts`, `index.html`, `src/`, `public/` are all at the top level.

```
repo root (GitHub) =
  ├── .env                     # Nhost credentials + admin email (VITE_NHOST_SUBDOMAIN, VITE_NHOST_REGION, VITE_ADMIN_EMAIL)
  ├── wrangler.toml            # Cloudflare Pages config
  ├── index.html               # Vite entry HTML (CSP meta tag added)
  ├── package.json             # Dependencies + scripts
  ├── vite.config.ts           # Build config
  ├── tsconfig.json            # TypeScript config (references tsconfig.app.json)
  ├── tsconfig.app.json        # Strict TypeScript mode
  ├── src/                     # Application source
  │   ├── components/          # React components
  │   ├── config/              # Site content & design tokens
  │   ├── context/             # React contexts (AuthContext)
  │   ├── hooks/               # Custom hooks (useSnapScroll)
  │   ├── lib/                 # Utilities (nhost, utils)
  │   └── ...                  # App.tsx, main.tsx, index.css
  └── public/                  # Static assets (video, images)
```

**Local working copy path (for reference):**
`C:\Users\cloud\OneDrive\Desktop\Hybrid_Second_Brain\clients website\gods creatures website\`

This local folder contains extra files NOT in the repo:
- `index.html` — old static HTML site
- `images/` — images for the static site
- `new scrolling animation/` — experimental/legacy folder
- `why-choose-us.html` — standalone HTML page
- `react-app/` — this is a COPY of what's actually in the repo (the true repo root)

---

## File Structure

```
repo root/
├── .env                          # Nhost credentials + admin email (VITE_NHOST_SUBDOMAIN, VITE_NHOST_REGION, VITE_ADMIN_EMAIL)
├── wrangler.toml                 # Cloudflare Pages config (name, pages_build_output_dir)
├── public/
│   ├── herosectionvideo.mp4      # Hero background video (looping, muted)
│   ├── hero-poster.jpg           # Poster shown while video loads
│   ├── review-image1.png         # Review gallery images
│   ├── review-image2.png
│   ├── review-image3.png
│   └── reviewimage5.jpeg
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── animated-scroll.tsx   # MAIN: full-page snap scroll, all 5 pages, video, overlays
│   │   │   ├── feature-carousel.tsx  # Services carousel (4 services, auto-play, spring animations)
│   │   │   ├── image-auto-slider.tsx # Infinite auto-scroll review image slider
│   │   │   ├── booking-modal.tsx     # 2-step booking modal (info -> form -> Nhost GraphQL mutation)
│   │   │   ├── AuthModal.tsx         # Sign In / Sign Up modal (Nhost email/password auth)
│   │   │   └── UserMenu.tsx          # Top-right nav dropdown (Sign In button / user menu)
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx       # Page 1: hero video + overlay + CTA
│   │   │   ├── WhyChooseUsSection.tsx# Page 2: 4 glassmorphism cards
│   │   │   ├── ServicesSection.tsx   # Page 3: wrapper for FeatureCarousel
│   │   │   ├── ReviewsSection.tsx    # Page 4: testimonials + image slider
│   │   │   ├── BookingSection.tsx    # Page 5: location info + booking CTA
│   │   │   ├── ProfilePage.tsx       # /profile: customer pet management dashboard
│   │   │   └── AdminDashboard.tsx    # /admin: protected booking management dashboard
│   │   └── ErrorBoundary.tsx         # React error boundary with retry button
│   ├── config/
│   │   └── site-content.ts          # ALL hardcoded content + design tokens
│   ├── context/
│   │   └── AuthContext.tsx           # Auth state provider (Nhost v4 session listener)
│   ├── hooks/
│   │   └── use-snap-scroll.ts       # Extracted snap-scroll logic (wheel, touch, keyboard)
│   ├── lib/
│   │   ├── nhost.ts                 # Data layer — Nhost client + GraphQL URL export
│   │   └── utils.ts                 # cn() helper (clsx + tailwind-merge)
│   ├── App.tsx                      # Root: BrowserRouter + Routes + AuthProvider
│   ├── main.tsx                     # Entry point: ApolloProvider + ErrorBoundary + auth link
│   └── index.css                    # Tailwind CSS 4 + theme tokens (pink palette)
├── index.html                       # Vite entry with CSP meta tag
├── package.json
├── vite.config.ts                   # Path alias (@/), Tailwind plugin, base: '/'
├── tsconfig.json
└── tsconfig.app.json                # strict: true
```

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                            │
│  URL: https://gods-creatures-pet-groomers.pages.dev           │
│  Build: npm install && npm run build -> dist/                  │
│  Auto-deploys on push via Cloudflare Git Integration           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   App.tsx (BrowserRouter)                                     │
│     ├── Route "/"         -> ScrollAdventure                  │
│     ├── Route "/profile"  -> ProfilePage                      │
│     ├── Route "/admin"    -> AdminDashboard                   │
│     └── Route "*"         -> Navigate to "/"                  │
│                                                               │
│   AuthProvider (AuthContext.tsx)                               │
│     └── Listens to nhost.sessionStorage.onChange()             │
│         -> exposes { user, loading }                          │
│                                                               │
│   ScrollAdventure (animated-scroll.tsx)                       │
│     ├── <UserMenu />                    (top-right corner)    │
│     ├── Page 1: HeroSection             (video background)    │
│     ├── Page 2: WhyChooseUsSection      (4 glass cards)       │
│     ├── Page 3: ServicesSection         (FeatureCarousel)     │
│     ├── Page 4: ReviewsSection          (testimonials + imgs) │
│     ├── Page 5: BookingSection          (location + CTA)      │
│     └── BookingModal                                       │
│           └── useMutation(CREATE_BOOKING)                  │
│               -> insert_bookings_one                       │
│                                                               │
│   main.tsx (ApolloProvider + ErrorBoundary)                   │
│     └── ApolloClient                                          │
│         ├── createHttpLink(uri=NHOST_GRAPHQL_URL)             │
│         ├── setContext(authLink)                              │
│         │   └── reads nhost.getUserSession()->Authorization   │
│         └── InMemoryCache                                     │
│                                                               │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     Nhost (Hasura GraphQL)                    │
│                                                               │
│  Auth: email/password sign-in, sign-up, session management    │
│  GraphQL: bookings + pets tables via Apollo Client            │
│                                                               │
│  Tables:                                                      │
│    bookings: id, customer_name, email, phone, service,        │
│              preferred_date, notes, advance_paid,              │
│              transaction_id (UNIQUE), status, created_at,      │
│              user_id (FK), pet_id (FK)                        │
│                                                               │
│    pets: id, pet_name, species, breed, age, weight,           │
│          coat_condition, medical_history, behavioral_notes,    │
│          vet_contact, user_id (FK), created_at                 │
│                                                               │
│    users: managed by Nhost Auth (id, email, displayName, etc) │
│                                                               │
│  RLS: user_id auto-injected from JWT claims                   │
│  Admin: VITE_ADMIN_EMAIL env var (default admin@godscreatures.com)│
└──────────────────────────────────────────────────────────────┘
```

---

## Design System

### Colors
| Token | Hex | Usage |
|---|---|---|
| Brand Pink | `#d0999a` | Page backgrounds, primary UI elements |
| Dark Pink | `#c48a8b` | Hover/active states |
| White | `#FFFFFF` | Card text on hero overlays |
| Black/Transparent | `rgba(0,0,0,0.3-0.6)` | Hero overlay gradients |
| Gold accent | `#FFD6A5` | Secondary accents, highlights |

### Theme (index.css)
```css
@theme {
  --color-background: hsl(350 30% 71%);
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

### `animated-scroll.tsx` — Main Container

**Purpose:** Full-viewport snap-scroll interface with 5 pages. Renders UserMenu in top-right corner.

**Pages (now extracted into section components in `src/components/sections/`):**
| # | Section | Component | Content |
|---|---------|-----------|---------|
| 1 | Hero | HeroSection | Video + overlay + heading + "Book Appointment" CTA |
| 2 | Why Choose Us | WhyChooseUsSection | 4 glassmorphism cards |
| 3 | Services | ServicesSection | FeatureCarousel service carousel |
| 4 | Reviews | ReviewsSection | 2 review cards + ImageAutoSlider |
| 5 | Book Now | BookingSection | Location card + "Book a Session" CTA |

**UserMenu:** Absolute positioned at `top-4 right-4 z-50`, renders Sign In button or user dropdown.

**Navigation methods:** Wheel (50px delta), touch swipe (50px delta), arrow keys, dot nav, chevron buttons. 1s lockout via `scrolling.current` ref.

**Scroll logic** extracted into `src/hooks/use-snap-scroll.ts` — handles wheel events, touch events, keyboard events, inner scrollable element detection.

### `feature-carousel.tsx` — Services Carousel (287 lines)

**Purpose:** Interactive 3D carousel for 4 signature services. Auto-plays every 3s, pauses on hover. Keyboard left/right arrows, chip navigation.

**States:** Active (center, full color), adjacent (desaturated, scaled 0.85), hidden (scaled 0.7, opacity 0).

### `image-auto-slider.tsx` — Review Image Slider (51 lines)

**Purpose:** Infinite horizontal auto-scroll of review photos at 20s linear loop. Hover pauses.

### `booking-modal.tsx` — Booking Modal

**Purpose:** 2-step booking flow wired to Nhost/Hasura via Apollo Client `useMutation`.

**Steps:**
1. Info step — ₹500 booking fee disclaimer
2. Form step — name, email, phone, service select, preferred date, notes, advance payment section (UPI Reference Number)

**Pet Selector (auth-aware):** When user is logged in, a pet dropdown appears after the service selector. Fetches pets via `GetMyPetsForBooking` query. Selected `pet_id` is passed in the mutation.

**Form Fields:** All use `useRef` (not state) for performance — no re-renders on keystroke.

**Validation:**
- Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Phone: regex `/^\+?\d{7,15}$/` (if provided)
- Transaction ID: required, non-empty check

**Error Handling:**
- Duplicate UPI reference: catches `unique constraint` / `unique_transaction_id` in both `result.error` and `catch`
- Generic: fallback message
- Loading guard: Escape key and overlay click blocked during submission

**GraphQL Mutation:**
```graphql
mutation CreateBooking($customer_name: String!, $email: String!, $phone: String!,
  $service: String!, $preferred_date: String!, $notes: String!,
  $advance_paid: numeric!, $transaction_id: String!, $pet_id: Int) {
  insert_bookings_one(object: {
    customer_name: $customer_name, email: $email, phone: $phone,
    service: $service, preferred_date: $preferred_date, notes: $notes,
    advance_paid: $advance_paid, transaction_id: $transaction_id, pet_id: $pet_id
  }) { id, customer_name }
}
```

**States:** Closed, Open (info), Open (form), Submitting (spinner + disabled), Success (auto-close 1.5s), Error (form stays visible).

### `ErrorBoundary.tsx` — Error Boundary

**Purpose:** Catches React rendering errors and displays a fallback UI with the error message and a "Try Again" button. Wraps `ApolloProvider` in `main.tsx`.

---

## Routing

| Path | Component | Auth Required | Behavior |
|------|-----------|---------------|----------|
| `/` | ScrollAdventure (animated-scroll) | No | Main landing page with 5 snap-scroll sections |
| `/profile` | ProfilePage | Yes | Redirects to `/` if `!user` after auth loads |
| `/admin` | AdminDashboard | Admin email only | Redirects to `/` if `!user`; access denied if not admin |
| `*` | — | No | Catch-all redirects to `/` via `<Navigate>` |

Implemented via `react-router-dom` v7 `BrowserRouter` in `App.tsx`. AuthProvider wraps all routes.

---

## Auth System

### Architecture

Uses **Nhost v4** (`@nhost/nhost-js`) for email/password authentication. No deprecated Nhost React/Apollo packages.

### AuthContext (`src/context/AuthContext.tsx`)

- Created via `createContext` + `useContext`
- `AuthProvider` wraps all routes in `App.tsx`
- On mount:
  1. Reads initial session via `nhost.getUserSession()`
  2. Subscribes to session changes via `nhost.sessionStorage.onChange(callback)`
- Exposes `{ user: { id, email, displayName } | null, loading: boolean }`

### AuthModal (`src/components/ui/AuthModal.tsx`)

- Glassmorphism modal matching the pink design system
- Two modes: **Sign In** / **Sign Up** (toggle link at bottom)
- Fields: email, password (show/hide toggle)
- Nhost v4 API calls:
  - Sign in: `nhost.auth.signInEmailPassword({ email, password })`
  - Sign up: `nhost.auth.signUpEmailPassword({ email, password })`
- Error handling with specific messages:
  - `unverified-user`: "Email not verified yet. Check your inbox..."
  - `invalid-email-password`: "Invalid email or password."
  - `signup-disabled`: "New account registration is currently disabled."
  - `user-already-exists`: "An account with this email already exists."
- Signup with no session (email verification required): shows green success banner, switches to sign-in mode
- Scroll lock on open
- Loading state during API calls
- **Password reset flow:** "Forgot password?" link below password field in sign-in mode. Switches to reset mode with email-only form and "Send Reset Link" button. Uses `nhost.auth.sendPasswordResetEmail({ email })`. "Back to sign in" link to return.

### UserMenu (`src/components/ui/UserMenu.tsx`)

- Rendered in `animated-scroll.tsx` top-right corner
- **Not logged in:** Shows "Sign In" button -> opens AuthModal
- **Logged in:** Shows user email (truncated) + dropdown with:
  - "My Profile" -> navigates to `/profile`
  - "Sign Out" -> calls `nhost.auth.signOut({})`, navigates to `/`
- Dropdown closes on click outside (overlay div)

### Auth Link (Apollo)

In `main.tsx`, the `setContext` link reads `nhost.getUserSession()` before every GraphQL request and attaches `Authorization: Bearer <token>`. This ensures authenticated requests carry the user's JWT.

---

## Pet Profiles (ProfilePage)

### Route: `/profile`

**Purpose:** Customer-facing dashboard for managing pet profiles. Redirects to `/` if not logged in.

### Components

#### `ProfilePage.tsx`
- Fetches user's pets via `GET_MY_PETS` query (implicitly filtered by `user_id` via Hasura RLS)
- Displays pets in a 2-column grid of glassmorphism cards
- Each card shows: name, species, breed, age, weight, coat condition, medical history, behavioral notes, vet contact
- "Add Pet" button toggles the `AddPetForm`
- Loading spinner, error state, empty state with icon

#### `AddPetForm.tsx` (inline in ProfilePage)
- Fields: pet name, species (Dog/Cat select), breed, age, weight, coat condition, medical history, behavioral notes, vet contact
- All fields use `useRef` (except species which is a controlled select)
- Creates pet via `CREATE_PET` mutation
- Refetches `GET_MY_PETS` on success
- Inline error display

### GraphQL Queries

**GetMyPets:**
```graphql
query GetMyPets {
  pets(order_by: { created_at: desc }) {
    id pet_name species breed age weight
    coat_condition medical_history behavioral_notes vet_contact created_at
  }
}
```

**CreatePet:**
```graphql
mutation CreatePet($pet_name: String!, $species: String!, ...) {
  insert_pets_one(object: { pet_name: $pet_name, species: $species, ... }) { id }
}
```

---

## Admin Dashboard

### Route: `/admin`

**Purpose:** Protected admin page for viewing and confirming bookings. Only accessible to `user.email === adminEmail`.

### Admin Email Check
The admin email is read from the `VITE_ADMIN_EMAIL` environment variable:
```typescript
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL ?? "";
```
Default value in `.env`: `VITE_ADMIN_EMAIL=admin@godscreatures.com`
To change the admin, update `.env` locally and set `VITE_ADMIN_EMAIL` in the Cloudflare Pages dashboard.

### Behavior
- If user is not logged in: redirects to `/`
- If user is logged in but email doesn't match adminEmail: shows "Access Denied" page with "Back to Home" button
- If user is admin: full dashboard with all bookings

### Features
- Fetches all bookings via `GET_ALL_BOOKINGS` (ordered by `created_at` desc)
- Each booking card shows: customer name, email, phone, service, preferred date, pet details, notes, advance paid, transaction ID
- Status badges with colors: Pending (yellow), Confirmed (green), Cancelled (red)
- **Confirm button** for pending bookings:
  - Shows loading spinner while confirming (disabled, prevents double-click)
  - Calls `UPDATE_STATUS` mutation
  - Errors logged to console (not silently swallowed)
- Booking count badge in header
- Loading spinner, error state, empty state

### GraphQL Queries

**GetAllBookings:**
```graphql
query GetAllBookings {
  bookings(order_by: { created_at: desc }) {
    id customer_name email phone service preferred_date notes
    advance_paid transaction_id status created_at
    pet { pet_name species breed }
  }
}
```

**UpdateBookingStatus:**
```graphql
mutation UpdateBookingStatus($id: uuid!, $status: String!) {
  update_bookings_by_pk(pk_columns: { id: $id }, _set: { status: $status }) { id status }
}
```

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
- Uses **Nhost v4 SDK** (`@nhost/nhost-js@^4.7.2`)
- `createClient()` auto-applies `withClientSideSessionMiddleware` for automatic session refresh, token attachment, and session storage
- `NhostClient` has `auth` (AuthClient), `storage`, `graphql`, `functions`, `sessionStorage` properties
- `nhost.getUserSession()` reads from session storage
- `nhost.sessionStorage.onChange(callback)` subscribes to session changes

### Nhost v4 AuthClient Methods (used in app)
| Method | Where Used | Purpose |
|--------|-----------|---------|
| `nhost.auth.signInEmailPassword({ email, password })` | AuthModal | Sign in |
| `nhost.auth.signUpEmailPassword({ email, password })` | AuthModal | Sign up |
| `nhost.auth.sendPasswordResetEmail({ email })` | AuthModal | Password reset |
| `nhost.auth.signOut({})` | UserMenu | Sign out |

---

## Apollo Client Setup

### Location
`src/main.tsx`

### Current File Content
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { nhost, NHOST_GRAPHQL_URL } from "@/lib/nhost";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");
createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </ErrorBoundary>
  </StrictMode>,
);
```

### Provider Hierarchy
```
<StrictMode>
  <ErrorBoundary>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route "/" -> ScrollAdventure />
              <UserMenu />  (top-right)
              <BookingModal />  (uses useAuth + useMutation)
            <Route "/profile" -> ProfilePage />
              (uses useAuth + useQuery + useMutation)
            <Route "/admin" -> AdminDashboard />
              (uses useAuth + useQuery + useMutation)
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </ErrorBoundary>
</StrictMode>
```

### Auth Link Behavior
- `setContext` runs before every GraphQL request
- Reads current Nhost session via `nhost.getUserSession()`
- If `accessToken` exists, attaches `Authorization: Bearer <token>`
- Unauthenticated users can still insert bookings (Hasura permissions control anonymous access)

---

## Scroll System

### Architecture
The `animated-scroll.tsx` component manages a page index (`currentPage`) and renders all 5 pages as absolutely-positioned divs. Only the active page is at `translateY(0)`; others are above/below. Transitions use CSS `transform` with smooth easing.

### Navigation Methods
| Method | Trigger | Threshold | Lockout |
|--------|---------|-----------|---------|
| Wheel | `wheel` event | `Math.abs(deltaY) >= 50` | 1s |
| Touch | `touchstart/touchend` | `Math.abs(diff) >= 50` | 1s |
| Keyboard | `keydown` ArrowUp/Down | Any press | 1s |
| Dot nav | Click dots | Instant | 1s |
| Chevron | Click Up/Down buttons | Instant | 1s |

### Inner Scroll Detection
`getScrollableAncestor(el)` walks up the DOM tree to find elements with `overflow-y: auto/scroll` and `scrollHeight > clientHeight`. Before navigating pages, the component checks if the inner scrollable is at its boundary.

### Extracted Hook
The snap-scroll logic was extracted into `src/hooks/use-snap-scroll.ts` which handles wheel, touch, and keyboard events, and returns `{ currentPage, goTo, goUp, goDown, isAnimating }`.

---

## ErrorBoundary

### Location
`src/components/ErrorBoundary.tsx`

### Behavior
- Catches JavaScript errors in the React component tree below it
- Displays a centered error card with:
  - Error icon (AlertTriangle)
  - "Something went wrong" heading
  - Error message in a highlighted block
  - "Try Again" button that resets the error state
- Wraps `ApolloProvider` in `main.tsx` so errors in any component are caught

---

## Configuration (site-content.ts)

### Location
`src/config/site-content.ts`

### Purpose
Centralizes ALL hardcoded strings, design tokens, and configuration values. Components import from here instead of hardcoding text or values.

### Exports
- `designTokens` — brandPink, darkPink (hex values)
- `heroSection` — heading, subheadings, CTA text
- `whyChooseUs` — array of 4 card objects (icon, title, description)
- `servicesSection` — heading, 4 service objects (name, description, image path)
- `reviewsSection` — heading, 2 review objects (name, text, image)
- `bookingSection` — modal title, form labels, CTA text, fee details, UPI info, success messages

---

## Deployment

### Cloudflare Pages (Primary)

**Method: Cloudflare Git Integration (Automatic)**
- Connected via Cloudflare dashboard to `jeremygideonbareh/Gods-creatures-pet-groomers`
- Cloudflare auto-detects pushes to `main` branch and triggers a build
- Build settings configured in Cloudflare dashboard:
  - **Build command:** `npm install && npm run build`
  - **Build output directory:** `dist`
  - **Root directory:** *(blank — uses repo root)*
- **Live URL:** `https://gods-creatures-pet-groomers.pages.dev`

**Note:** The `.github/workflows/deploy.yml` (GitHub Actions) was **deleted** because it conflicted with Cloudflare's Git integration. The Git integration is the sole deployment method and handles all pushes automatically.

### wrangler.toml (at repo root)
```toml
name = "gods-creatures-pet-groomers"
pages_build_output_dir = "dist"
```

**Note:** Cloudflare Pages `wrangler.toml` does NOT support the `[build]` section with `command`. Build commands are configured exclusively in the Cloudflare dashboard.

### Vite Config Notes
```typescript
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```
- `base: '/'` is critical for Cloudflare Pages root deployment

### Environment Variables on Cloudflare
The following environment variables must be set in the Cloudflare Pages dashboard:
- `VITE_NHOST_SUBDOMAIN` — Nhost project subdomain
- `VITE_NHOST_REGION` — Nhost project region

These are Vite env vars (prefixed with `VITE_`) — they are bundled into the client-side code at build time.

### Local Development
```bash
npm install          # install all dependencies
npm run dev          # Vite dev server with HMR (http://localhost:5173)
npm run build        # tsc -b && vite build -> dist/
npm run preview      # Serve built dist/ locally for testing
```

---

## Environment Variables & Secrets

### `.env` (at repo root, NOT checked into git)
```
VITE_NHOST_SUBDOMAIN=[your-nhost-subdomain]
VITE_NHOST_REGION=[your-nhost-region]
VITE_ADMIN_EMAIL=admin@godscreatures.com
```

These are Vite env vars (prefixed with `VITE_`) — they're bundled into the client-side code at build time. The Nhost subdomain and region are safe to be public (they just point to the GraphQL endpoint). The `.env` file is listed in `.gitignore` to prevent accidental commits.

### Cloudflare Pages Environment Variables
Set in Cloudflare dashboard -> your Pages project -> Settings -> Environment variables:
- `VITE_NHOST_SUBDOMAIN`
- `VITE_NHOST_REGION`
- `VITE_ADMIN_EMAIL`

These are needed because `.env` is not deployed to Cloudflare.

---

## Migration Log

### Session Summary (June 8, 2026)

**Phase 1: Supabase -> Nhost Migration**
1. Read existing files (`main.tsx`, `App.tsx`, `supabase.ts`, `booking-modal.tsx`)
2. Installed `@nhost/nhost-js`, `@nhost/react`, `@nhost/react-apollo` (initial attempt)
3. Discovered peer dependency conflicts with React 19 — `@nhost/react` and `@nhost/react-apollo` are deprecated and incompatible
4. Uninstalled deprecated Nhost packages, kept `@nhost/nhost-js@^4.7.2`
5. Created `src/lib/nhost.ts` using `createClient()` from `@nhost/nhost-js` v4
6. Installed `@apollo/client@^4.2.2` — discovered Apollo Client v4 has different import paths than v3
7. Updated `src/main.tsx` with ApolloProvider + custom auth link using Nhost session
8. Deleted old `src/lib/supabase.ts`
9. Updated `booking-modal.tsx` with `useMutation`, loading/success/error states

**Phase 2: Transaction ID Input**
10. Replaced auto-generated `transaction_id` with real UPI Reference Number input
11. Added advance payment section with validation

**Phase 3: Error Handling**
12. Added duplicate transaction ID detection for `unique_constraint` and `unique_transaction_id`

**Phase 4: Cloudflare Pages Migration**
13. Changed `vite.config.ts` `base` from `'/Gods-creatures-pet-groomers/'` to `'/'`
14. Deleted `.github/workflows/deploy.yml` (old GitHub Pages action)
15. Created `wrangler.toml`
16. Committed and pushed to `main` -> Cloudflare Git Integration auto-deployed

### Session Summary (June 9, 2026)

**Phase 5: Code Quality Refactoring**
1. Extracted all 5 pages into separate section components (`HeroSection`, `WhyChooseUsSection`, `ServicesSection`, `ReviewsSection`, `BookingSection`)
2. Extracted snap-scroll logic into `src/hooks/use-snap-scroll.ts`
3. Created `src/config/site-content.ts` centralizing ALL hardcoded content and design tokens
4. Enabled `strict: true` in `tsconfig.app.json`
5. Created `ErrorBoundary` component wrapping `ApolloProvider`
6. Added modal accessibility (aria-live regions, focus trap with tab cycling, form labels)
7. Added CSP meta tag to `index.html`
8. Added `maxLength` to all form inputs
9. Fixed mobile scroll overflow on feature-carousel

**Phase 6: Security Fixes**
10. Redacted Cloudflare API token and Nhost credentials from HANDOFF.md (replaced with placeholders)
11. Set new Cloudflare API token via `gh secret set`

**Phase 7: Auth System + Pet Profiles + Admin Dashboard**
12. Installed `react-router-dom@^7.17.0`
13. Created `src/context/AuthContext.tsx` with Nhost v4 session listener:
    - `nhost.getUserSession()` for initial state
    - `nhost.sessionStorage.onChange()` for session changes
    - Exposes `{ user, loading }`
14. Created `src/components/ui/AuthModal.tsx`:
    - Sign In / Sign Up with email/password
    - Show/hide password toggle
    - Loading spinner during API calls
    - Error messages mapped from Nhost error codes (unverified-user, invalid-email-password, signup-disabled, user-already-exists)
    - Success message for email-verification-required signup flow
    - Scroll lock on open
15. Created `src/components/ui/UserMenu.tsx`:
    - "Sign In" button for guests -> opens AuthModal
    - User email + dropdown (My Profile, Sign Out) for logged-in users
    - Dropdown closes on click outside
16. Created `src/components/sections/ProfilePage.tsx`:
    - Pet management dashboard (fetch/create pets via GraphQL)
    - AddPetForm with all pet profile fields
    - Redirects to `/` if not authenticated
    - Loading/error/empty states
17. Created `src/components/sections/AdminDashboard.tsx`:
    - Booking management dashboard (fetch all bookings, confirm bookings)
    - Admin email check against `site-content.ts` constant
    - Status badges (Pending/Confirmed/Cancelled)
    - Confirm button with loading spinner (disabled during mutation)
    - Redirects to `/` if not authenticated, access denied if not admin
18. Updated `App.tsx` with BrowserRouter + 3 routes (/, /profile, /admin) + catch-all redirect
19. Updated `main.tsx` to remove BrowserRouter/AuthProvider from here (now in App.tsx)
20. Updated `animated-scroll.tsx` to render UserMenu in top-right corner
21. Updated `booking-modal.tsx`:
    - Pet selector dropdown when user is logged in (fetches via GetMyPetsForBooking)
    - Pet ID passed to CREATE_BOOKING mutation
    - Fixed `name` -> `pet_name` in GQL query (was returning null)
    - Removed `"use client"` directive (Vite, not Next.js)
    - Guarded overlay click and Escape key during submission
    - Uses validated `phone` variable in mutation (not raw ref)
22. Updated Nhost v4 API calls throughout (signInEmailPassword, signUpEmailPassword, signOut({}))
23. Fixed TypeScript errors: added GraphQL query result types in AdminDashboard, ProfilePage, booking-modal
24. Fixed AuthContext to use correct Nhost v4 APIs (nhost.getUserSession, sessionStorage.onChange)
25. Added 404 catch-all route in App.tsx

### Session Summary (June 9, 2026 — Session 4)

**Phase 8: Password Reset + Admin Email Env Var**
1. Moved `adminEmail` from hardcoded constant in `site-content.ts` to `VITE_ADMIN_EMAIL` environment variable
2. Added `VITE_ADMIN_EMAIL=admin@godscreatures.com` to `.env`
3. Updated `AdminDashboard.tsx` to read `import.meta.env.VITE_ADMIN_EMAIL` instead of importing `adminEmail`
4. Added password reset flow to `AuthModal.tsx`:
   - New `"reset"` mode in the `mode` state union type
   - "Forgot password?" link below the password field in sign-in mode
   - Reset mode shows email-only form with "Send Reset Link" button
   - Uses `nhost.auth.sendPasswordResetEmail({ email })` for the API call
   - "Back to sign in" link to return to normal login
   - Appropriate error and success states
5. Updated `HANDOFF.md` to reflect all changes

---

## Known Issues & Roadmap

### Current Limitations
- **FeatureCarousel height on small screens** — Fixed percentage heights may cause overflow on 320px-375px screens
- **Transaction ID persists after error** — Input retains value after submission failure
- **No email verification handling** — If Nhost project requires email verification, users see "Email not verified" on sign-in until they click the verification link (if SMTP is configured)

### Completed Features
- ✅ **Supabase -> Nhost** — Data layer migrated to `@nhost/nhost-js` v4 SDK with Apollo Client
- ✅ **GitHub Pages -> Cloudflare Pages** — Deployed via Cloudflare Git Integration
- ✅ **Booking form** — 2-step modal with UPI transaction validation, duplicate detection
- ✅ **Authentication** — Sign In / Sign Up via Nhost email/password
- ✅ **UserMenu** — Auth-aware top-right nav (Sign In / user dropdown)
- ✅ **Pet Profiles** — CRUD interface at `/profile`
- ✅ **Admin Dashboard** — Booking management at `/admin` (admin email protected)
- ✅ **Routing** — react-router-dom v7 with 3 routes + 404 fallback
- ✅ **ErrorBoundary** — Catches React rendering errors with retry
- ✅ **Sections extracted** — 5 pages moved to `src/components/sections/`
- ✅ **Config centralized** — All hardcoded text moved to `src/config/site-content.ts`
- ✅ **Snap-scroll hook** — Extracted to `src/hooks/use-snap-scroll.ts`
- ✅ **Strict TypeScript** — Enabled `strict: true`
- ✅ **Modal accessibility** — Focus trap, aria-live, form labels
- ✅ **CSP meta tag** — Content Security Policy in index.html
- ✅ **Input maxLength** — On all form inputs
- ✅ **Security** — Secrets redacted from docs, env vars excluded from git
- ✅ **Scroll lock** — On both AuthModal and BookingModal
- ✅ **Auth error codes mapped** — unverified-user, invalid-email-password, signup-disabled, user-already-exists
- ✅ **Admin confirm loading state** — Spinner on confirm button, disabled during mutation
- ✅ **Auth guards** — ProfilePage and AdminDashboard redirect if not logged in
- ✅ **Password reset** — "Forgot Password?" link in AuthModal with email-only reset flow
- ✅ **Admin email as env var** — `adminEmail` moved from `site-content.ts` to `VITE_ADMIN_EMAIL` env var

### Future Enhancements
1. **Loading/error/success animations** — Enhance with better motion animations
2. **Static HTML version** — Consolidate or remove the old static site in the parent folder
3. **Pet editing/deletion** — Currently only "Add Pet" is supported; add edit and delete
4. **Booking editing** — Allow admin to edit booking details
5. **Email notifications** — Configure SMTP in Nhost for verification emails and booking confirmations
6. **Disable "Require Verified Emails"** — Turn off in Nhost Dashboard → Settings → Sign-In Methods → Email and Password so signups work immediately

---

*Last updated: June 9, 2026 (session 4)*
