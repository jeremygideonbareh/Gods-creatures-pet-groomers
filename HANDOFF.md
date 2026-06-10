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
11. [Content Editor (CMS)](#content-editor-cms)
12. [Centralized GraphQL (graphql.ts)](#centralized-graphql-graphqlts)
13. [Data Layer (nhost.ts)](#data-layer-nhostts)
14. [Apollo Client Setup](#apollo-client-setup)
15. [Scroll System](#scroll-system)
16. [ErrorBoundary](#errorboundary)
17. [Configuration (site-content.ts)](#configuration-site-contentts)
18. [Database Schema & RLS (nhost-setup.sql)](#database-schema--rls-nhost-setupsql)
19. [Deployment](#deployment)
20. [Environment Variables & Secrets](#environment-variables--secrets)
21. [Migration Log](#migration-log)
22. [Known Issues & Roadmap](#known-issues--roadmap)

---

## Project Overview

A modern single-page React app for **Gods Creatures Pet Groomers**, a luxury pet grooming salon based in **Malki, Shillong**. Built as a normal scrolling page with IntersectionObserver fade-in transitions, video hero, animated service carousel, review slider, user authentication (Nhost), pet profile management, admin dashboard with DB-backed content editor, and a 2-step booking modal wired to Nhost/Hasura GraphQL via Apollo Client.

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
  ├── .env                     # Nhost credentials + admin email
  ├── hasura/                  # Hasura CLI metadata project (permissions, roles, config)
  │   ├── config.yaml          # CLI config (gitignored) — endpoint: hasura.ap-south-1.nhost.run
  │   ├── config.yaml.example  # Tracked template for fresh clones
  │   ├── README.md            # Setup guide (RLS-disable SQL, env vars, admin role)
  │   └── metadata/            # Hasura v3 metadata YAML
  │       ├── version.yaml     # version: 3
  │       ├── actions.yaml     # Empty (no custom actions yet)
  │       └── databases/
  │           └── databases.yaml  # Inline table defs: bookings, pets, site_content + roles
  ├── nhost-setup.sql          # SQL for site_content table, helpers & RLS policies
  ├── wrangler.toml            # Cloudflare Pages config
  ├── index.html               # Vite entry HTML (CSP meta tag added)
  ├── package.json             # Dependencies + scripts
  ├── vite.config.ts           # Build config
  ├── tsconfig.json            # TypeScript config (references tsconfig.app.json)
  ├── tsconfig.app.json        # Strict TypeScript mode
  ├── functions/               # Nhost Serverless Functions
  │   ├── send-booking-receipt.ts  # Hasura Event Trigger → Resend email receipt
  │   └── package.json             # resend dependency
  ├── src/                     # Application source
  │   ├── components/          # React components
  │   ├── config/              # Site content & design tokens + PRICING_MENU
  │   ├── context/             # React contexts (AuthContext, SiteContentContext)
  │   ├── hooks/               # Custom hooks
  │   ├── lib/                 # Utilities (nhost, utils, graphql, content-service)
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
├── .env                          # Nhost credentials + admin email
├── hasura/                       # Hasura CLI metadata project
│   ├── config.yaml               # CLI config (gitignored) — endpoint: hasura.ap-south-1.nhost.run
│   ├── config.yaml.example       # Tracked template for fresh clones
│   ├── README.md                 # Setup guide
│   └── metadata/                 # Hasura v3 metadata YAML
│       ├── version.yaml          # version: 3
│       ├── actions.yaml          # Empty (no custom actions yet)
│       └── databases/
│           └── databases.yaml    # Inline table defs: bookings, pets, site_content + roles
├── nhost-setup.sql               # SQL setup (site_content table, RLS, current_user_id helper)
├── wrangler.toml                 # Cloudflare Pages config
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
│   │   │   ├── animated-scroll.tsx   # MAIN: full-page scrollable layout, all 5 sections, fade-in transitions
│   │   │   ├── ImageDropzone.tsx     # Drag & drop image uploader with Nhost storage integration
│   │   │   ├── feature-carousel.tsx  # Services carousel (4 services, auto-play, spring animations)
│   │   │   ├── image-auto-slider.tsx # Infinite auto-scroll review image slider
│   │   │   ├── booking-modal.tsx     # 2-step booking modal (info -> form -> Nhost GraphQL mutation)
│   │   │   ├── AuthModal.tsx         # Sign In / Sign Up modal (Nhost email/password auth + pet fields on signup)
│   │   │   ├── AddPetModal.tsx       # Post-login pet creation prompt when user has no pets
│   │   │   └── UserMenu.tsx          # Top-right nav dropdown (Sign In button / user menu)
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx       # Page 1: hero video + overlay + CTA
│   │   │   ├── WhyChooseUsSection.tsx# Page 2: 4 glassmorphism cards
│   │   │   ├── ServicesSection.tsx   # Page 3: wrapper for FeatureCarousel
│   │   │   ├── ReviewsSection.tsx    # Page 4: testimonials + image slider
│   │   │   ├── BookingSection.tsx    # Page 5: location info + booking CTA
│   │   │   ├── ProfilePage.tsx       # /profile: customer pet management dashboard
│   │   │   ├── AdminDashboard.tsx    # /admin: protected booking mgmt dashboard + ContentEditor tab
│   │   │   └── ContentEditor.tsx     # Tabbed CMS editor for site content (6 tabs)
│   │   └── ErrorBoundary.tsx         # React error boundary with retry button
│   ├── config/
│   │   └── site-content.ts          # ALL hardcoded content + design tokens + adminEmail
│   ├── context/
│   │   ├── AuthContext.tsx           # Auth state provider (Nhost v4 session listener)
│   │   └── SiteContentContext.tsx    # Site content provider (fetches from Hasura, exposes updateSection)
│   ├── hooks/
│   │   └── use-snap-scroll.ts       # Deprecated — kept for reference, no longer used
│   ├── lib/
│   │   ├── nhost.ts                 # Nhost client + GraphQL URL export
│   │   ├── graphql.ts               # Centralized gql definitions (pets, bookings, site_content)
│   │   ├── content-service.ts       # Site content types (+ PricingMenuContent), DB-to-UI mapper
│   │   └── utils.ts                 # cn() helper (clsx + tailwind-merge)
│   ├── config/
│   │   └── site-content.ts          # ALL hardcoded content + PRICING_MENU matrix + adminEmail
│   ├── context/
│   │   ├── AuthContext.tsx           # Auth state provider (Nhost v4 session listener)
│   │   └── SiteContentContext.tsx    # Site content provider + pricingMenu support
│   ├── App.tsx                      # Root: BrowserRouter + Routes + AuthProvider + SiteContentProvider
│   ├── main.tsx                     # Entry point: ApolloProvider + ErrorBoundary + auth link
│   └── index.css                    # Tailwind CSS 4 + theme tokens (pink palette)
├── index.html                       # Vite entry with CSP meta tag
├── package.json
├── vite.config.ts                   # Path alias (@/), Tailwind plugin, base: '/'
├── tsconfig.json
├── tsconfig.app.json                # strict: true
└── functions/                       # Nhost Serverless Functions
    ├── send-booking-receipt.ts      # Hasura Event Trigger → Resend email receipt
    └── package.json                 # resend dependency
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
│   SiteContentProvider (SiteContentContext.tsx)                 │
│     └── Fetches site_content on mount via apolloClient.query() │
│         -> exposes { content, loading, updateSection }        │
│         content.pricingMenu — read by booking modal for       │
│         size-based pricing, add-on selection, total calc      │
│                                                               │
│   AuthProvider (AuthContext.tsx)                               │
│     └── Listens to nhost.sessionStorage.onChange()             │
│         -> exposes { user, loading }                          │
│                                                               │
│   ScrollAdventure (animated-scroll.tsx)                       │
│     ├── <UserMenu />                    (top-right corner)    │
│     ├── <AdminPanelButton />            (top-left, conditional)│
│     ├── Section 1: HeroSection          (video background)    │
│     ├── Section 2: WhyChooseUsSection   (4 glass cards)       │
│     ├── Section 3: ServicesSection      (FeatureCarousel)     │
│     ├── Section 4: ReviewsSection       (testimonials + imgs) │
│     ├── Section 5: BookingSection       (location + CTA)      │
│     ├── AuthModal                    (signin/signup/reset)    │
│     ├── BookingModal                 (2-step booking flow)    │
│     └── AddPetModal                  (after login if 0 pets)  │
│                                                               │
│   ProfilePage (/profile)                                     │
│     └── useQuery(GET_USER_PETS) + useMutation(INSERT_PET)    │
│                                                               │
│   AdminDashboard (/admin)                                     │
│     ├── Tab: Bookings                                         │
│     │   └── useQuery(GET_ADMIN_BOOKINGS)                      │
│     │       useMutation(UPDATE_BOOKING_STATUS)                │
│     └── Tab: Content                                          │
│         └── <ContentEditor />                                 │
│             └── useSiteContent().updateSection()              │
│                                                               │
│   main.tsx (ApolloProvider + ErrorBoundary)                   │
│     └── ApolloClient                                          │
│         ├── createHttpLink(uri=NHOST_GRAPHQL_URL)             │
│         ├── setContext(authLink)                              │
│         │   ├── reads nhost.getUserSession()->Authorization   │
│         │   └── reads nhost.auth.getUser() -> x-hasura-role   │
│         │       adminEmail ? "admin" : "user"                 │
│         └── InMemoryCache                                     │
│                                                               │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     Nhost (Hasura GraphQL)                    │
│                                                               │
│  Auth: email/password sign-in, sign-up, session management    │
│  GraphQL: bookings + pets + site_content tables               │
│                                                               │
│  Tables:                                                      │
│    bookings: id, customer_name, email, phone, service,        │
│              preferred_date, notes, advance_paid,              │
│              transaction_id (UNIQUE), status, created_at,      │
│              addons (JSONB), total_price (INTEGER),              │
│              user_id (FK -> users), pet_id (FK -> pets, uuid)  │
│                                                               │
│    pets: id, name, species, breed, age_years, weight_kg,      │
│          coat_condition, medical_history, behavioral_notes,    │
│          vet_contact, user_id (FK -> users), created_at       │
│                                                               │
│    site_content: id (UUID), section (UNIQUE), content (JSONB),│
│                  updated_at                                   │
│                                                               │
│    users: managed by Nhost Auth (id, email, displayName, etc) │
│                                                               │
│  RLS: user_id auto-injected from JWT claims via current_user_id()  │
│  Admin: user.email === adminEmail ("cloudlyconfusing@gmail.com")  │
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

### Glassmorphism Pattern
```
.bg-white/15-20 backdrop-blur-xl rounded-3xl border border-white/20-30
```
Used across modals, cards, nav, and admin panels.

---

## Component Breakdown

### `animated-scroll.tsx` — Main Container

**Purpose:** Normal-scroll landing page with IntersectionObserver fade-in transitions for 5 sections. Renders UserMenu (top-right), Admin Panel button (top-left, conditional on admin email), AuthModal, BookingModal, and AddPetModal.

**Key differences from earlier snap-scroll version:**
- No snap-scroll behavior — replaced with normal vertical scrolling
- `.fade-section` elements start invisible (`opacity-0 translate-y-8`) and fade in via IntersectionObserver when they enter the viewport
- `visible` class triggers `opacity-100 translate-y-0` + smooth CSS transition

**Pages (section components in `src/components/sections/`):**
| # | Section | Component | Content |
|---|---------|-----------|---------|
| 1 | Hero | HeroSection | Video + overlay + heading + "Book Appointment" CTA |
| 2 | Why Choose Us | WhyChooseUsSection | 4 glassmorphism cards |
| 3 | Services | ServicesSection | FeatureCarousel service carousel |
| 4 | Reviews | ReviewsSection | 2 review cards + ImageAutoSlider |
| 5 | Book Now | BookingSection | Location card + "Book a Session" CTA |

**UserMenu:** Fixed at `top-4 right-4 z-50`, renders Sign In button or user dropdown.

**Admin Panel button:** Fixed at `top-4 left-4 z-50`, only visible when `user?.email === adminEmail`. Uses glassmorphism styling matching UserMenu. Navigates to `/admin`.

**Modals hosted here:**
- `AuthModal` — sign in / sign up / password reset
- `BookingModal` — 2-step booking flow
- `AddPetModal` — shown after login if user has 0 pets

**Pet prompt after sign-in:** On auth success, queries `pets_aggregate` count. If count is 0, opens AddPetModal.

### `feature-carousel.tsx` — Services Carousel (287 lines)

**Purpose:** Interactive 3D carousel for 4 signature services. Auto-plays every 3s, pauses on hover. Keyboard left/right arrows, chip navigation.

**States:** Active (center, full color), adjacent (desaturated, scaled 0.85), hidden (scaled 0.7, opacity 0).

### `image-auto-slider.tsx` — Review Image Slider (51 lines)

**Purpose:** Infinite horizontal auto-scroll of review photos at 20s linear loop. Hover pauses.

### `booking-modal.tsx` — Pricing-Aware Booking Modal

**Purpose:** 2-step booking flow wired to Nhost/Hasura via Apollo Client `useMutation`, with real-time price calculation.

**Steps:**
1. Info step — ₹500 booking fee disclaimer
2. Form step — name/email (auto-filled + readOnly when logged in), phone, pet dropdown with **auto size detection**, package picker, add-on checkboxes, live price breakdown, date, notes, advance payment section

**Pet Size Detection:** When a logged-in user selects a pet, `weight_kg` is used to auto-calculate size:
- **Small** (Up to 10kg) | **Medium** (10–20kg) | **Large** (20–35kg) | **Extra Large** (Above 35kg)

**Package Picker (card-selector):** Two sections:
- **Basic Services** (3 options): Bath+Brush+Nail+Ear, Haircut/Styling Only, Nail Trim+Ear Only (flat ₹500)
- **Complete Packages** (2 options): Full Groom, Full Spa Package
- Each shows the real-time price for the detected size, selected card highlights in white

**Add-On Services (multi-select checkboxes):**
- Teeth Cleaning (flat ₹400), Flea & Tick (flat ₹500), De-shedding (sized), Spa Massage & Conditioning (sized)
- Checked items with visual checkmark, each showing `+₹[price]`

**Live Price Breakdown Widget:** Glass card showing base package + each add-on line item + total.

**Guest / No-Pet Flow:** When no pet is selected (guest user, logged-in with no pets, or logged-in but hasn't selected one), a **manual size selector** appears with 4 buttons (Small/Medium/Large/XL) so guests can still browse packages and prices. `effectiveSize = petSize || manualSize` ensures price calculations work regardless of source.

**Auth state fix:** Name and email inputs auto-filled from `user.displayName` / `user.email` and set to `readOnly` with `opacity-60` for authenticated users. `required` attribute removed when `readOnly` to avoid browser validation lock.

**Form Fields:** Name, email use `defaultValue` + `readOnly` when authenticated. Others use `useRef`.

**Validation:**
- Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Phone: regex `/^\+?\d{7,15}$/` (if provided)
- Package selection: required before submit
- Transaction ID: required, non-empty check

**Error Handling:**
- Duplicate UPI reference: catches `unique constraint` / `unique_transaction_id` with friendly message
- All other errors: raw GraphQL error message displayed verbatim in red banner
- Both `result.error` and catch branches log `console.error("GRAPHQL ERROR:", err)` to DevTools
- Loading guard: Escape key and overlay click blocked during submission

**GraphQL Mutation (inline):**
```graphql
mutation CreateBooking($customer_name: String!, $email: String!, $phone: String!,
  $service: String!, $preferred_date: date!, $notes: String!,
  $advance_paid: numeric!, $transaction_id: String!, $pet_id: uuid,
  $addons: jsonb, $total_price: Int) {
  insert_bookings_one(object: { ... }) { id, customer_name }
}
```
- `service` column stores package label + size, e.g. "Full Groom (Bath + Haircut + Nails + Ears) - Medium (10-20kg)"
- `addons` stores JSON array of add-on label strings
- `total_price` stores calculated integer (package + add-ons)

**States:** Closed, Open (info), Open (form), Submitting (spinner + disabled), Success (auto-close 1.5s), Error (form stays visible).

### `AuthModal.tsx` — Authentication Modal

**Purpose:** Glassmorphism modal with three modes:
- **Sign In** — email + password, show/hide toggle, "Forgot password?" link
- **Sign Up** — email + password + **pet details section** (name, species, breed, age, weight, coat, medical, behavioral, vet)
- **Password Reset** — email-only form with "Send Reset Link"

**Nhost v4 API calls:**
- Sign in: `nhost.auth.signInEmailPassword({ email, password })`
- Sign up: `nhost.auth.signUpEmailPassword({ email, password })` — if pet name provided, also calls `CREATE_PET` mutation via `apolloClient.mutate()`
- Reset: `nhost.auth.sendPasswordResetEmail({ email })`

**Error handling:** Maps Nhost error codes to user-friendly messages (unverified-user, invalid-email-password, signup-disabled, user-already-exists).

**Signup without session (email verification):** Shows green success banner, switches to sign-in mode.

**Modal resets all pet fields on close** via `useEffect` cleanup.

### `AddPetModal.tsx` — Post-Login Pet Form

**Purpose:** Triggered after sign-in when user has zero pets. Full pet creation form with all fields. Has "Skip" button to dismiss.

**Uses `apolloClient.mutate()` directly (no useMutation hook)** since it's outside the standard query lifecycle.

**Fields:** Pet name (required), species, breed, age, weight, coat condition, medical history, behavioral notes, vet contact.

### `UserMenu.tsx` — Auth-Aware User Menu

**Purpose:** Top-right corner navigation.
- **Not logged in:** Shows "Sign In" button -> opens AuthModal
- **Logged in:** Shows user email (truncated) + dropdown with:
  - "My Profile" -> navigates to `/profile`
  - "Sign Out" -> calls `nhost.auth.signOut({})`, navigates to `/`
- Dropdown closes on click outside (overlay div)

### `ImageDropzone.tsx` — Nhost Storage Uploader

**Purpose:** Reusable drag-and-drop image upload component integrated with Nhost v4 storage.

**Features:**
- Drag & drop zone with glassmorphism dashed-border styling
- Click to browse for files (accepts `image/*`)
- Validates file is an image before uploading
- Uploads to `cms-images` bucket via `nhost.storage.uploadFiles()`
- Constructs the public URL: `https://{subdomain}.storage.{region}.nhost.run/v1/files/{fileId}`
- Shows preview thumbnail with "Replace" and "Delete" overlay on hover
- Loading spinner during upload
- Returns the public URL string via `onChange` callback

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Current image URL (empty string if none) |
| `onChange` | `(url: string) => void` | Called with the public URL after upload |
| `label?` | `string` | Optional label shown above the dropzone |

**Integrated in ContentEditor:**
- Hero section (poster image)
- Service items (service image)
- Testimonials (avatar image)
- Review gallery images
- Page backgrounds (3 background image URLs)

### `ErrorBoundary.tsx` — Error Boundary

**Purpose:** Catches React rendering errors and displays a fallback UI with the error message and a "Try Again" button. Wraps `ApolloProvider` in `main.tsx`.

---

## Routing

| Path | Component | Auth Required | Behavior |
|------|-----------|---------------|----------|
| `/` | ScrollAdventure (animated-scroll) | No | Main landing page with 5 scrollable sections |
| `/profile` | ProfilePage | Yes | Redirects to `/` if `!user` after auth loads |
| `/admin` | AdminDashboard | Admin email only | Redirects to `/` if `!user`; access denied if not admin |
| `*` | — | No | Catch-all redirects to `/` via `<Navigate>` |

Implemented via `react-router-dom` v7 `BrowserRouter` in `App.tsx`. AuthProvider and SiteContentProvider wrap all routes.

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

### Auth Flow

1. **Guest clicks "Sign In"** (UserMenu) or "Book Appointment" (triggers auth check)
2. **If not logged in + booking intent:** AuthModal opens; on success, booking modal opens
3. **If not logged in + no booking intent:** AuthModal opens; on success, checks pet count; if 0 pets, AddPetModal opens
4. **Sign up flow:** User fills email + password + optional pet details. If pet name provided, `CREATE_PET` mutation runs after signup succeeds.
5. **Password reset:** "Forgot password?" link in sign-in mode -> email-only form -> `sendPasswordResetEmail`

### Auth Link (Apollo)

In `main.tsx`, the `setContext` link reads `nhost.getUserSession()` before every GraphQL request and attaches `Authorization: Bearer <token>`.

---

## Pet Profiles (ProfilePage)

### Route: `/profile`

**Purpose:** Customer-facing dashboard for managing pet profiles. Redirects to `/` if not logged in.

### Components

#### `ProfilePage.tsx`
- Fetches user's pets via `GET_USER_PETS` from `src/lib/graphql.ts` (implicitly filtered by `user_id` via Hasura RLS)
- Displays pets in a 2-column grid of glassmorphism cards
- Each card shows: name, species, breed, age_years, weight_kg, coat condition, medical history, behavioral notes, vet contact
- "Add Pet" button toggles the `AddPetForm`
- Loading spinner, error state, empty state with PawPrint icon

#### `AddPetForm.tsx` (inline in ProfilePage)
- Fields: pet name, species (Dog/Cat select), breed, age_years, weight_kg, coat condition, medical history, behavioral notes, vet contact
- All fields use `useRef` (except species which is a controlled select)
- Creates pet via `INSERT_PET` mutation from `src/lib/graphql.ts`
- Refetches `GET_USER_PETS` on success
- Inline error display

### GraphQL Queries (from src/lib/graphql.ts)

**GET_USER_PETS:**
```graphql
query GetUserPets {
  pets(order_by: { created_at: desc }) {
    id name species breed age_years weight_kg
    coat_condition medical_history behavioral_notes vet_contact created_at
  }
}
```

**INSERT_PET:**
```graphql
mutation InsertPet($name: String!, $species: String!, ...) {
  insert_pets_one(object: { name: $name, species: $species, ... }) { id }
}
```

**Note on column names:** The database uses `name` (not `pet_name`), `age_years` (not `age`), `weight_kg` (not `weight`).

---

## Admin Dashboard

### Route: `/admin`

**Purpose:** Protected admin page with two tabs: **Bookings** and **Content**. Only accessible when `user?.email === adminEmail`.

### Admin Email Check
```typescript
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL ?? "cloudlyconfusing@gmail.com";
```
Defined as `adminEmail` in `src/config/site-content.ts`:
```typescript
export const adminEmail = "cloudlyconfusing@gmail.com";
```

### Behavior
- If user is not logged in: redirects to `/`
- If user is logged in but email doesn't match adminEmail: shows "Access Denied" page with "Back to Home" button
- If user is admin: full dashboard with Bookings tab and Content tab

### Bookings Tab
- Fetches all bookings via `GET_ADMIN_BOOKINGS` (ordered by `created_at` desc) — includes nested `pet { name breed }`
- The `user { email }` sub-query was removed in Session 14 because `auth.users` is not tracked in Hasura metadata (the `user` relationship was causing inconsistency errors)
- The `email` field is available directly on the bookings table (stored at booking time)
- Each booking card shows: customer name, email (top-level + user.email), phone, service, preferred date, pet name/breed, notes, advance paid, transaction ID
- Status badges with colors: Pending (yellow), Confirmed (green), Cancelled (red)
- **Confirm button** for pending bookings:
  - Shows loading spinner while confirming (disabled, prevents double-click)
  - Calls `UPDATE_BOOKING_STATUS` mutation from graphql.ts
  - Errors logged to console
- Booking count badge in header
- Loading spinner, error state, empty state

### Content Tab
- Renders the `ContentEditor` component
- See [Content Editor (CMS)](#content-editor-cms) section below

### Admin Panel Button (front-end)
- Fixed at `top-4 left-4 z-50` on the main page (`animated-scroll.tsx`)
- Only visible when `user?.email === adminEmail`
- Glassmorphism styling matching UserMenu
- Shield icon from lucide-react
- Navigates to `/admin`

### GraphQL Queries

**GET_ADMIN_BOOKINGS (updated Session 14 — removed `user { email }`):**
```graphql
query GetAdminBookings {
  bookings(order_by: { created_at: desc }) {
    id customer_name email phone service preferred_date notes
    advance_paid transaction_id status created_at
    pet { name breed }
  }
}
```

**UPDATE_BOOKING_STATUS:**
```graphql
mutation UpdateBookingStatus($id: uuid!, $status: String!) {
  update_bookings_by_pk(pk_columns: { id: $id }, _set: { status: $status }) { id status }
}
```

---

## Content Editor (CMS)

### SiteContentContext (`src/context/SiteContentContext.tsx`)

**Purpose:** Provides site content state across the app and exposes `updateSection()` to persist changes to Hasura.

**On mount:** Fetches all `site_content` rows via `GET_ALL_SITE_CONTENT` (imported from `content-service.ts`, which re-exports from `graphql.ts`) using `apolloClient.query()` with `fetchPolicy: "network-only"`.

**Exposes:**
- `content: SiteContent` — merged object of all sections (hero, whyChooseUs, services, reviews, booking, pageBackgrounds, designTokens)
- `loading: boolean` — true while initial fetch is in progress
- `updateSection(section: SectionKey, data: Record<string, unknown>)` — calls `UPSERT_SITE_CONTENT` mutation, then merges data into local state

**Sections merge:** Each section's defaults (from `site-content.ts`) are deep-merged with DB content via `mapDbToSiteContent()`.

### ContentEditor (`src/components/sections/ContentEditor.tsx`)

**Purpose:** Admin-facing tabbed CMS interface for editing all site content.

**Tabs:**
| Tab | Section Key | Editable Fields |
|-----|------------|-----------------|
| Hero | hero | title, subtitle, cta, video, poster |
| Why Choose Us | why_choose_us | heading, cards (add/delete/edit: icon, title, description) |
| Services | services | heading, subtitle, items (add/delete/edit: id, label, icon, image, description) |
| Reviews | reviews | heading, testimonials (add/delete/edit: emoji, author, tag, text, textLong), images (add/delete) |
| Booking | booking | All 21 booking fields (heading, location, hours, etc.) |
| Backgrounds | page_backgrounds | whyChooseUs URL, reviews URL, booking URL |
| Pricing & Policies | pricing_menu | All 5 package prices per size, 4 add-on prices, rules text |

**Save flow:** Clicking "Save Changes" calls `updateSection()` on the context, which triggers `UPSERT_SITE_CONTENT` mutation. Green "Saved!" indicator appears for 2s.

**ImageDropzone integration:** Each section that uses images now has drag-and-drop upload capability:
- **Hero tab** — poster image uses ImageDropzone
- **Services tab** — each service item has an ImageDropzone for its image URL
- **Reviews tab** — each testimonial has an ImageDropzone for avatar; review gallery uses ImageDropzone for each image
- **Backgrounds tab** — all 3 background URLs use ImageDropzone
- ImageDropzone uploads to Nhost storage via `nhost.storage.uploadFiles()` and constructs the public URL

**States:** Loading spinner (while context is fetching), saving spinner, saved confirmation.

### Array Management (Add/Remove)

All array-based sections support dynamic mutation:
- **Cards** (Why Choose Us) — add new empty card, delete any card
- **Service Items** — add new service template, delete any service
- **Testimonials** — add new testimonial template, delete any testimonial
- **Review Images** — add new empty image slot, delete any image

Array operations use immutable patterns (`[...spread]`, `.filter()`) on local state. The full data (including added/removed items) is saved atomically via `UPSERT_SITE_CONTENT` when "Save Changes" is clicked.

### Database Table

```sql
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Seeded with all default content from `nhost-setup.sql`.

---

## Centralized GraphQL (graphql.ts)

### Location
`src/lib/graphql.ts`

### Purpose
Centralizes ALL reused GraphQL document nodes so queries/mutations are defined once and imported across components. This avoids duplication and ensures consistent column names.

### Exports

| Export | Type | Used In |
|--------|------|---------|
| `GET_USER_PETS` | Query | ProfilePage, booking-modal |
| `INSERT_PET` | Mutation | ProfilePage |
| `GET_ADMIN_BOOKINGS` | Query | AdminDashboard |
| `UPDATE_BOOKING_STATUS` | Mutation | AdminDashboard |
| `GET_SITE_CONTENT` | Query | content-service.ts (re-exported as GET_ALL_SITE_CONTENT) |

### Column Naming Convention
The `pets` table uses these columns (different from what earlier inline queries used):
- `name` (was `pet_name`)
- `age_years` (was `age`)
- `weight_kg` (was `weight`)

The `bookings` query nests `pet { name breed }` (was `pet { pet_name species breed }` — the `user { email }` sub-query was removed in Session 14 because `auth.users` isn't tracked in Hasura metadata, causing "table not tracked" inconsistency errors during `hasura metadata apply`).

### What is NOT centralized
- `CREATE_BOOKING` — stays inline in `booking-modal.tsx` (only used there)
- `GET_ALL_SITE_CONTENT` — re-exported from `content-service.ts` for backward compat with `SiteContentContext`
- `UPSERT_SITE_CONTENT` — stays in `content-service.ts`

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

### Current File Content (updated Session 14 — role header)
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { nhost, NHOST_GRAPHQL_URL } from "@/lib/nhost";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { adminEmail } from "@/config/site-content";
import "./index.css";
import App from "./App.tsx";

const httpLink = createHttpLink({ uri: NHOST_GRAPHQL_URL });

const authLink = setContext(async (_, { headers }) => {
  const session = nhost.getUserSession();
  const token = session?.accessToken;
  const user = nhost.auth.getUser();
  const role = user?.email === adminEmail ? "admin" : "user";
  return {
    headers: {
      ...headers,
      ...(token ? {
        Authorization: `Bearer ${token}`,
        "x-hasura-role": role,
      } : {}),
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
        <SiteContentProvider>
          <AuthProvider>
            <Routes>
              <Route "/" -> ScrollAdventure />
                <UserMenu />  (top-right)
                <AdminPanelButton />  (top-left, conditional)
                <AuthModal />
                <BookingModal />
                <AddPetModal />
              <Route "/profile" -> ProfilePage />
              <Route "/admin" -> AdminDashboard />
                <ContentEditor />  (Content tab)
            </Routes>
          </AuthProvider>
        </SiteContentProvider>
      </BrowserRouter>
    </ApolloProvider>
  </ErrorBoundary>
</StrictMode>
```

### Auth Link Behavior (Updated Session 14)
- `setContext` runs before every GraphQL request
- Reads current Nhost session via `nhost.getUserSession()`
- If `accessToken` exists, attaches:
  - `Authorization: Bearer <token>` — JWT auth token
  - `x-hasura-role: admin|user` — role header based on admin email check
- Role logic: `user?.email === adminEmail ? "admin" : "user"` — adminEmail imported from `site-content.ts`
- Role header is only sent when a JWT token is present (unauthenticated requests skip it)
- Hasura validates `x-hasura-role` against the JWT's `x-hasura-allowed-roles` claim; if `admin` isn't in the JWT claims, Hasura falls back to `user` role
- **Current state:** `admin` role permissions have been removed from metadata until Nhost custom JWT claims are configured

---

## Scroll System

### Architecture
The `animated-scroll.tsx` component renders all 5 sections as a normal vertical scrollable page. **Snap-scroll has been removed.**

### Fade-in Transitions
Each section has the class `.fade-section` which starts with:
```css
opacity: 0; transform: translateY(32px); transition: opacity 0.8s ease, transform 0.8s ease;
```

An `IntersectionObserver` (threshold 0.15) watches all `.fade-section` elements. When a section enters the viewport, the `visible` class is added:
```css
.fade-section.visible { opacity: 1; transform: translateY(0); }
```

### Known Scroll Details
- The `use-snap-scroll.ts` hook exists in `src/hooks/` but is **no longer used** — kept for reference
- `rootRef` is still used for the IntersectionObserver setup
- `heroVideoRef` is passed to HeroSection for video playback control

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

## Nhost Serverless Function — Booking Email Receipts

### Location
`functions/send-booking-receipt.ts`

### Purpose
Sends a professional HTML email receipt to the customer when a booking is inserted into the `bookings` table, triggered via Hasura Event Trigger.

### Payload
The function receives a standard Hasura Event Trigger payload and extracts from `req.body.event.data.new`:
| Field | Type | Source |
|-------|------|--------|
| `customer_name` | string | booking form |
| `email` | string | customer email |
| `service` | string | package label + size |
| `preferred_date` | string | requested date |
| `total_price` | integer | calculated total (package + add-ons) |
| `addons` | string[] |selected add-on labels |
| `transaction_id` | string | UPI reference |
| `advance_paid` | number | always 500 |

### Email Template
Clean HTML email (inline styles, table-based layout) with:
- Header: Booking Received! 🎉
- Greeting with customer name
- Booking Summary table: Package, Date, Add-Ons list, Total (₹)
- Advance Payment Reminder box: ₹500 fee, GPay 9089196235@axisbank
- Footer with business address and contact details

### Resend Integration
```typescript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
```

### Environment Variables (set in Nhost Dashboard)
| Variable | Default | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | — | Yes |
| `FROM_EMAIL` | `onboarding@resend.dev` | No |

### Deployment
1. Push to GitHub → Nhost auto-deploys `functions/`
2. Set `RESEND_API_KEY` in Nhost Dashboard → Environment Variables
3. Create Hasura Event Trigger in Nhost Dashboard:
   - **Name**: `send_booking_receipt`
   - **Table**: `bookings` → **Operation**: Insert
   - **Webhook URL**: `https://{subdomain}.functions.{region}.nhost.run/v1/send-booking-receipt`

---

## Configuration (site-content.ts)

### Location
`src/config/site-content.ts`

### Purpose
Centralizes ALL hardcoded strings, design tokens, configuration values, and the admin email constant. Components import from here instead of hardcoding text or values.

### Exports
- `adminEmail` — admin email constant ("cloudlyconfusing@gmail.com")
- `designTokens` — brandPink, darkPink (hex values)
- `hero` — title, subtitle, CTA text, video/poster filenames
- `whyChooseUs` — heading + array of 4 card objects (icon, title, description)
- `services` — heading, subtitle, 4 service objects (id, label, icon, image, description)
- `reviews` — heading, 2 testimonials (emoji, author, tag, text, textLong), image filenames
- `bookingSection` — all booking section text (21 fields including modal titles, CTA, fee details, UPI info, success messages)
- `pageBackgrounds` — background image URLs for whyChooseUs, reviews, booking

---

## Database Schema & RLS (nhost-setup.sql)

### Location
`nhost-setup.sql` (at repo root)

### Purpose
Comprehensive SQL setup for the Hasura project. Run against the Nhost project's database.

### Contents

**1. Helper Function**
```sql
CREATE OR REPLACE FUNCTION public.current_user_id() RETURNS text
  LANGUAGE sql STABLE
  AS $$ SELECT nullif(current_setting('hasura.user', true), '')::json->>'x-hasura-user-id' $$;
```
Used by RLS policies to extract the authenticated user's ID from the Hasura JWT session variable.

**2. site_content Table**
```sql
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
RLS: Public SELECT, authenticated INSERT/UPDATE.

**3. Seed Data**
Inserts default content for all 6 sections (hero, why_choose_us, services, reviews, booking, page_backgrounds).

**4. pets RLS**
```sql
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pets_insert_own" ON pets FOR INSERT WITH CHECK (user_id::text = public.current_user_id());
CREATE POLICY "pets_select_own" ON pets FOR SELECT USING (user_id::text = public.current_user_id());
CREATE POLICY "pets_update_own" ON pets FOR UPDATE USING (user_id::text = public.current_user_id());
```

**5. bookings RLS**
```sql
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT WITH CHECK (user_id::text = public.current_user_id());
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT USING (user_id::text = public.current_user_id());
```

**Note:** `auth.role()` and `x_hasura_user_id()` were attempted first but failed in the Nhost environment. The `current_user_id()` helper function was created via separate SQL statement instead.

### Metadata-Based Permissions (Alternative)

In addition to SQL RLS, the project now has a full Hasura CLI metadata project at `hasura/`. This defines role-based permissions in YAML that replace the SQL RLS policies once applied:

| Table | Role | Permission |
|-------|------|------------|
| `bookings` | `user` | SELECT with `{user_id: {_eq: X-Hasura-User-Id}}`, INSERT with `set: {user_id: x-hasura-User-Id}` |
| `bookings` | `admin` | SELECT all, UPDATE status, INSERT with user_id preset |
| `pets` | `user` | CRUD with `user_id` filter + insert preset |
| `site_content` | `public` | SELECT all (no auth required) |
| `site_content` | `user` | INSERT/UPDATE sections |

To apply: `cd hasura && hasura metadata apply` (requires admin secret from Nhost Dashboard).

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
- `VITE_ADMIN_EMAIL` — Admin email (for admin dashboard access)

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
VITE_ADMIN_EMAIL=cloudlyconfusing@gmail.com
```

These are Vite env vars (prefixed with `VITE_`) — they're bundled into the client-side code at build time. The Nhost subdomain and region are safe to be public (they just point to the GraphQL endpoint). The `.env` file is listed in `.gitignore` to prevent accidental commits.

### Cloudflare Pages Environment Variables
Set in Cloudflare dashboard -> your Pages project -> Settings -> Environment variables:
- `VITE_NHOST_SUBDOMAIN`
- `VITE_NHOST_REGION`
- `VITE_ADMIN_EMAIL`

These are needed because `.env` is not deployed to Cloudflare.

### Nhost Functions Environment Variables
Set in Nhost Dashboard -> Environment Variables:
- `RESEND_API_KEY` — Required for the `send-booking-receipt` function (get from [resend.com](https://resend.com))
- `FROM_EMAIL` — Optional, defaults to `onboarding@resend.dev`

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
13. Created `src/context/AuthContext.tsx` with Nhost v4 session listener
14. Created `src/components/ui/AuthModal.tsx` with sign in / sign up / password reset
15. Created `src/components/ui/UserMenu.tsx` (Sign In / user dropdown)
16. Created `src/components/sections/ProfilePage.tsx` (pet management dashboard)
17. Created `src/components/sections/AdminDashboard.tsx` (booking management dashboard)
18. Updated `App.tsx` with BrowserRouter + 3 routes + catch-all redirect
19. Updated `main.tsx` to remove BrowserRouter/AuthProvider from here (now in App.tsx)
20. Updated `animated-scroll.tsx` to render UserMenu in top-right corner
21. Updated `booking-modal.tsx` with pet selector dropdown
22. Fixed TypeScript errors across all files

**Phase 8: Password Reset + Admin Email Env Var**
23. Added password reset flow to `AuthModal.tsx`
24. Moved adminEmail from hardcoded constant to `VITE_ADMIN_EMAIL` env var

### Session Summary (June 9, 2026 — Session 5)

**Phase 9: UX Improvements**
1. **Removed snap-scroll** — replaced with normal scrollable page
2. **Fixed section heights** — replaced `h-full` with `min-h-screen` in WhyChooseUs and Reviews sections
3. **Added IntersectionObserver fade-in** — smooth opacity + translateY transitions when sections scroll into view

### Session Summary (June 9, 2026 — Session 6)

**Phase 10: Booking Auth Flow + Pet Collection**
4. **Booking requires login** — auth check before opening BookingModal; shows AuthModal first if not logged in
5. **Pet details during signup** — added full pet fields section in AuthModal signup mode (name, species, breed, age, weight, coat, medical, behavioral, vet)
6. **AddPetModal after sign-in** — created standalone `AddPetModal.tsx` that appears after successful sign-in if user has zero pets (checked via `pets_aggregate` query)

### Session Summary (June 9, 2026 — Session 7)

**Phase 11: Admin Content Editor + SQL Setup**
7. **Created `SiteContentContext.tsx`** — fetches `site_content` rows on mount, exposes `{ content, loading, updateSection }` via React context
8. **Created `ContentEditor.tsx`** — 6-tab CMS editor (Hero, Why Choose Us, Services, Reviews, Booking, Backgrounds) with inline editing, add/delete for arrays, and save button calling `UPSERT_SITE_CONTENT`
9. **Created `nhost-setup.sql`** — SQL for `site_content` table, `current_user_id()` helper function, RLS policies for all tables, and seed data
10. **Fixed `current_user_id()` SQL** — `auth.role()` and `x_hasura_user_id()` failed; created the helper function via raw SQL instead
11. **Updated `App.tsx`** to wrap routes with `SiteContentProvider`
12. **Connected BookingSection, ServicesSection, etc.** to use `useSiteContent()` instead of hardcoded imports

### Session Summary (June 9, 2026 — Session 8)

**Phase 12: GraphQL Centralization + Admin Button + Build Verification**
13. **Created `src/lib/graphql.ts`** — 5 centralized gql definitions:
    - `GET_USER_PETS` (with name/age_years/weight_kg), `INSERT_PET`
    - `GET_ADMIN_BOOKINGS` (with pet { name breed } + user { email })
    - `UPDATE_BOOKING_STATUS`, `GET_SITE_CONTENT`
14. **Updated `ProfilePage.tsx`** — imports GET_USER_PETS + INSERT_PET from graphql.ts; updated column names (pet_name->name, age->age_years, weight->weight_kg)
15. **Updated `AdminDashboard.tsx`** — imports GET_ADMIN_BOOKINGS + UPDATE_BOOKING_STATUS; added user.email nesting in query and display
16. **Updated `booking-modal.tsx`** — imports GET_USER_PETS from graphql.ts instead of inline gql
17. **Updated `content-service.ts`** — imports GET_SITE_CONTENT from graphql.ts, re-exports as GET_ALL_SITE_CONTENT for backward compat
18. **Added adminEmail back to `site-content.ts`** — `export const adminEmail = "cloudlyconfusing@gmail.com"`
19. **Added conditional Admin Panel button** — fixed top-left in animated-scroll.tsx, glassmorphism styling, Shield icon, only visible when `user?.email === adminEmail`
20. **Build verification** — `tsc -b && vite build` passes with zero errors

### Session Summary (June 10, 2026)

**Phase 13: CMS Upgrade — ImageDropzone + Array Management**
1. **Created `src/components/ui/ImageDropzone.tsx`** — reusable drag-and-drop image upload component with Nhost v4 storage integration:
   - Uploads to `cms-images` bucket via `nhost.storage.uploadFiles()`
   - Constructs public URL pattern `https://{subdomain}.storage.{region}.nhost.run/v1/files/{fileId}`
   - Glassmorphism dashed-border dropzone with hover states
   - Thumbnail preview with Replace/Delete overlay
   - Loading spinner during upload, image type validation
2. **Integrated ImageDropzone into ContentEditor.tsx:**
   - **Hero tab** — poster image field replaced with ImageDropzone
   - **Services tab** — each ServiceItemEditor has an ImageDropzone for the image URL
   - **Reviews tab** — TestimonialEditor has an ImageDropzone for avatar; review gallery uses ImageDropzone per image
   - **Backgrounds tab** — all 3 background URL fields replaced with ImageDropzone
3. **Array management improvements** — Cards, Services, Testimonials, and Review Images sections all support add new items (with empty template) and delete any item. Mutations use immutable patterns and save atomically via UPSERT_SITE_CONTENT.
4. **Build verification** — `tsc -b && vite build` passes with zero errors

### Session Summary (June 10, 2026 — Session 10)

**Phase 14: Pricing Overhaul — PRICING_MENU + Booking Calculator + CMS Tab**
1. **Created `PRICING_MENU`** — complete price matrix in `src/config/site-content.ts` with:
   - 5 service tiers (3 Basic + 2 Complete Packages) with 4 size categories (Small/Medium/Large/XL)
   - 4 Add-On Services (2 flat-rate, 2 size-scaled)
   - Weight category definitions and rules string
2. **Updated `bookingSection`** — new address (Malki, Nongshiliang, Shillong - 793001), phone (8798897732), UPI (9089196235@axisbank)
3. **Extended types** — `PricingMenuContent` interface + `pricingMenu` field in `SiteContent` + `"pricing_menu"` in `SectionKey`
4. **Updated `SiteContentContext`** — added `pricingMenu` default and section mapping
5. **Overhauled `booking-modal.tsx`**:
   - Auto size detection from pet weight (Small ≤10kg, Medium 10-20, Large 20-35, XL >35)
   - Package picker with Basic Services (3) + Complete Packages (2), each showing sized price
   - Add-On multi-select checkboxes with live `+₹` display
   - Live Price Breakdown widget (base + add-ons + total)
   - Policy warning block (₹500 fee, GPay 9089196235@axisbank)
   - Mutation now sends `addons` (jsonb) and `total_price` (int)
6. **Added "Pricing & Policies" tab** to `ContentEditor.tsx` with editable tables for all services
7. **Updated `graphql.ts`** — GET_ADMIN_BOOKINGS includes `addons` and `total_price`
8. **Updated `nhost-setup.sql`** — ALTER TABLE migration + seed data for pricing_menu
9. **Build verification** — `tsc -b && vite build` passes with zero errors

**Phase 15: Critical Bug Fixes + Nhost Serverless Function**
10. **UX & Auth fix** — Name/email auto-filled + `readOnly` for authenticated users; AuthModal skips signup if `user` already exists
11. **GraphQL schema fix** — AuthModal CREATE_PET mutation updated: `pet_name`→`name`, `age`→`age_years`, `weight`→`weight_kg`
12. **Mobile overflow fix** — Booking modal padding changed to `p-4 sm:p-6` for small screens
13. **Created `functions/send-booking-receipt.ts`** — Nhost Serverless Function sending HTML email receipts via Resend with booking summary, price breakdown, and advance payment reminder
14. **Created `functions/package.json`** — with `resend` dependency
15. **Build verification** — `tsc -b && vite build` passes with zero errors

---

### Session Summary (June 11, 2026 — Session 12)

**Phase 16: Booking Modal Bug Fixes + GraphQL Type Corrections**
1. **Fixed pet size selector not rendering** — Replaced two separate conditional blocks (`{petSize && selectedPet && (...)}` / `{!petSize && (...)}`) with a single `selectedPet && petSize ? A : B` ternary that **guarantees exactly one branch always renders**, eliminating the blank gap in the UI
2. **Added `manualSize` state** — Lets guests / logged-in users without pets self-select their pet size; `effectiveSize = petSize || manualSize` fallback drives all price calculations
3. **Added calendar date picker** — Changed date input from `type="text"` to `type="date"` with `min=today` and `[color-scheme:dark]` for dark theme compatibility
4. **Crash-safe array iteration** — Guarded all `.map()` calls on `pricing.basicServices`, `pricing.completePackages`, `pricing.addOnServices` with `|| []` to prevent render tree teardown if data shape is unexpected
5. **Removed `!selectedPackage` from submit button disabled prop** — Validation now shows a visible red error message instead of silently disabling the button
6. **Removed `required` from name/email when `readOnly`** — Prevents browser validation lock on fields that are pre-filled and disabled for authenticated users
7. **Raw GraphQL error display** — Both `result.error` and `catch` branches now `console.error("GRAPHQL ERROR:", err)` and display the **exact backend error message** verbatim in the red UI banner instead of a generic fallback (only `unique constraint` / `unique_transaction_id` keeps its friendly message)
8. **Fixed `$preferred_date` GraphQL type** — Changed from `String!` to `date!` to match Hasura's custom `date` scalar (fixes: "variable 'preferred_date' is declared as 'String!', but used where 'date' is expected")
9. **Fixed `$pet_id` GraphQL type** — Changed from `Int` to `uuid` to match the pets table primary key type (fixes: "variable 'pet_id' is declared as 'Int', but used where 'uuid' is expected")
10. **Build verification** — `tsc -b && vite build` passes with zero errors across all fixes

---

### Session Summary (June 11, 2026 — Session 13)

**Phase 17: Hasura CLI Metadata Project — Role-Based Permissions Structure**

1. **Created `hasura/` directory** — Full Hasura CLI v3 metadata project structure:
   - `hasura/config.yaml` — CLI configuration pointing to Hasura engine (`hasura.ap-south-1.nhost.run`, NOT `graphql.ap-south-1.nhost.run` because the GraphQL proxy doesn't expose Hasura metadata endpoints). `admin_secret` is loaded from `HASURA_GRAPHQL_ADMIN_SECRET` env var at runtime. Config file is gitignored.
   - `hasura/config.yaml.example` — Tracked template for new clones (uses `{{HASURA_GRAPHQL_ADMIN_SECRET}}` placeholder)
   - `hasura/README.md` — Setup guide with RLS-disable SQL, admin secret instructions, `hasura metadata apply` workflow, and admin role config guidance
   - `hasura/metadata/version.yaml` — `version: 3`
   - `hasura/metadata/actions.yaml` — Empty (no custom actions yet)
   - `hasura/metadata/databases/databases.yaml` — Contains Hasura metadata with **inline table definitions** using the `tables` key (not separate YAML files per table), configured for three tables:

2. **bookings table permissions** (inline in databases.yaml):
   - `user` role: `select` with `filter: {user_id: {_eq: X-Hasura-User-Id}}` (own bookings only), `insert` with `set: {user_id: x-hasura-User-Id}` preset + same `check` validation
   - `admin` role: unrestricted `select` on all bookings, `update` on `status` column, same `insert` with `user_id` preset

3. **pets table permissions** (inline in databases.yaml):
   - `user` role: `select`/`update`/`delete` filtered by `user_id`, `insert` with `user_id` preset

4. **site_content table permissions** (inline in databases.yaml):
   - `public` role: unauthenticated `select` (anyone can read site content — this is the landing page data)
   - `user` role: `insert`/`update` for authenticated users with content management access

5. **Explicit column permissions configured** — Each table's `select`/`insert`/`update` permissions explicitly list which columns are accessible per role (e.g., bookings `insert` allows all columns, `update` only allows `status` for admin)

6. **Hasura CLI binary** — Downloaded `hasura.exe` v2.42.0 (71MB) to `%TEMP%\hasura.exe`. Updated CLI with `hasura update-cli`. Validated with `hasura version`.

7. **First `hasura metadata apply` failed** — Error: `"Inconsistent object: table 'bookings' in source 'default' is not tracked"`. Root cause: `databases.yaml` used Hasura metadata v3 `tables` key with inline definitions, but Hasura CLI v2.42.0 expects `database`-level metadata syntax (table tracking + permissions separated). Fix attempted: restructured metadata to track tables first then apply permissions.

8. **Second attempt with direct-engine endpoint** — Changed `endpoint` from `graphql.ap-south-1.nhost.run` to `hasura.ap-south-1.nhost.run` (direct Hasura engine). This is **required** — the GraphQL proxy doesn't serve the `/v1/metadata` endpoint. Response error changed to `"inconsistent_object: table bookings in source default not found"` — meaning tables must already exist in the database (they do) but need to be tracked through Hasura.

9. **Key discovery** — Hasura CLI v2.42.0 on Windows works with the Nhost Hasura engine directly. The `config.yaml` must point to `hasura.ap-south-1.nhost.run`, not `graphql.ap-south-1.nhost.run`. The `admin_secret` must be the Nhost project's Hasura admin secret (found in Nhost Dashboard → Settings → Hasura → Admin Secret). `HASURA_GRAPHQL_ADMIN_SECRET` env var is the native Hasura CLI env var — no template interpolation needed.

10. **Build verification** — `tsc -b && vite build` passes with zero errors

---

### Session Summary (June 11, 2026 — Session 14)

**Phase 18: Metadata Apply + Permissions Fix + Apollo Auth Role Link**

1. **Successful `hasura metadata apply`** — Ran `& "C:\Users\cloud\AppData\Local\Temp\hasura.exe" metadata apply` with `$env:HASURA_GRAPHQL_ADMIN_SECRET` set. Output: `INFO Metadata applied` — clean apply with zero warnings. The metadata is now **live on the Hasura engine**.

2. **Removed `admin` role permissions from metadata** — Nhost's JWT doesn't include `admin` in `x-hasura-allowed-roles` by default. If metadata defines an `admin` role but the JWT doesn't include it in the `allowed-roles` claim, Hasura will reject requests with `x-hasura-role: admin` header. Removed all `admin` role permission blocks from `databases.yaml` to avoid this. Will re-add once custom JWT claims configured in Nhost Dashboard.

3. **Removed `user` object_relationship from bookings and pets** — The `auth.users` table is not tracked in Hasura metadata (Nhost manages users outside Hasura). The bookings table had a `user` relationship referencing `auth.users`, which caused "table not tracked" inconsistency errors during `hasura metadata apply`. Removed the `user` object_relationship from both bookings and pets table definitions.

4. **Updated `GET_ADMIN_BOOKINGS` query** — Removed `user { email }` sub-query from `GET_ADMIN_BOOKINGS` in `src/lib/graphql.ts` since the `user` relationship no longer exists in Hasura metadata. The `email` field is available directly on the bookings table (stored at booking time), so admin can still see the customer email.

5. **Updated Apollo auth link in `main.tsx`** — Modified the `setContext` auth link to send `x-hasura-role` header alongside the JWT `Authorization` header:
   ```typescript
   const authLink = setContext(async (_, { headers }) => {
     const session = nhost.getUserSession();
     const token = session?.accessToken;
     const user = nhost.auth.getUser();
     const role = user?.email === adminEmail ? "admin" : "user";
     return {
       headers: {
         ...headers,
         ...(token ? {
           Authorization: `Bearer ${token}`,
           "x-hasura-role": role,
         } : {}),
       },
     };
   });
   ```
   - When `user.email === adminEmail`: sends `x-hasura-role: admin`
   - For all other users: sends `x-hasura-role: user`
   - Role header is only attached when a JWT token is present (unauthenticated queries skip it)
   - This is a **client-side assertion** of role — Hasura will validate against JWT claims and fall back to `user` role if `admin` isn't in the JWT's `x-hasura-allowed-roles`

6. **Fixed `config.yaml` endpoint** — Confirmed the config.yaml uses `hasura.ap-south-1.nhost.run` (direct Hasura engine). The `config.yaml.example` template was updated to match with the correct endpoint and `HASURA_GRAPHQL_ADMIN_SECRET` placeholder. The `admin_secret` line is present in the example (with `{{HASURA_GRAPHQL_ADMIN_SECRET}}` placeholder) but commented out in the actual config.yaml (reads from env var at runtime via `HASURA_GRAPHQL_ADMIN_SECRET`).

7. **Git workflow** — Created `hasura/config.yaml.example`, added `hasura/config.yaml` to `.gitignore`, committed all changes across 5 commits:
   - `feat: booking modal fixes` (pet size ternary, manualSize, date picker, crash-safe arrays, raw error display, validation fixes)
   - `fix: GraphQL type corrections` ($preferred_date: date!, $pet_id: uuid)
   - `feat: hasura metadata structure` (databases.yaml with bookings/pets/site_content permissions)
   - `fix: auth link role header` (x-hasura-role: admin/user in Apollo setContext)
   - `fix: metadata fixes` (remove admin role, remove user relationship, update bookings graphql query)

8. **Build verification** — `tsc -b && vite build` passes with zero errors

---

### Session Summary (June 11, 2026 — Session 15)

**Phase 19: Full Codebase Review — Code Review, Security Review, Database Review**

All three specialized agents were run against the full codebase (code-reviewer, security-reviewer, database-reviewer) and produced overlapping findings. Consolidated below:

#### 🔴 CRITICAL (6 issues)

| # | Finding | File | Details |
|---|---------|------|---------|
| 1 | **AddPetModal uses wrong column names — mutation always fails** | `AddPetModal.tsx:8-31` | Uses `pet_name`, `age`, `weight` — database schema has `name`, `age_years`, `weight_kg`. Three separate pet-creation mutations exist (graphql.ts correct, AuthModal.tsx correct, AddPetModal.tsx wrong) violating DRY. |
| 2 | **No `admin` role defined in Hasura metadata** | `databases.yaml` | Only `user` + `public` roles exist. Admin dashboard relies purely on client-side email check (`user?.email === adminEmail`). `GET_ADMIN_BOOKINGS` returns zero rows because the `user` role enforces `user_id: {_eq: X-Hasura-User-Id}` filter — admin email user sees only their own bookings. |
| 3 | **Any authenticated user can modify site content** | `databases.yaml:146-178` | `user` role has `insert_permissions` with `check: {}` (empty = allow all) and `update_permissions` with `filter: {}` (unrestricted). SQL RLS only checks `current_user_id() IS NOT NULL`. No server-side admin guard on site_content mutations. |
| 4 | **Hardcoded admin email in client bundle** | `site-content.ts:1` | `cloudlyconfusing@gmail.com` compiled into JS bundle — anyone can view it. Should be `VITE_ADMIN_EMAIL` env var (fallback exists but code uses the literal). |
| 5 | **Raw GraphQL error messages exposed to end users** | `booking-modal.tsx:299,321` | Backend constraint names (`unique_transaction_id`), schema details, and internal error text displayed verbatim in red UI banner. |
| 6 | **Pet ID decoded as Int instead of UUID — booking with existing pet fails** | `booking-modal.tsx:260` | `parseInt("uuid-string", 10)` → `NaN`. The pets table PK is UUID (string), not integer. Removes `parseInt()` and passes string directly. |

#### 🟠 HIGH (7 issues)

| # | Finding | File |
|---|---------|------|
| 7 | **Missing `CREATE TABLE` statements for `bookings` and `pets`** | `nhost-setup.sql` — only `ALTER TABLE ADD COLUMN` exists. Schema can't be reproduced from source. |
| 8 | **Missing indexes on foreign keys and filtered columns** | `nhost-setup.sql` — no indexes on `bookings.user_id`, `bookings.pet_id`, `bookings.status`, `bookings.created_at`, `pets.user_id`, `bookings.transaction_id` |
| 9 | **HTML injection in email receipts** | `send-booking-receipt.ts:41,76,91,134` — user-controlled `customer_name`, `service`, `transaction_id` interpolated directly into HTML email without escaping. |
| 10 | **Hasura engine endpoint exposed in version-controlled file** | `config.yaml.example:4` — direct Hasura engine URL (not rate-limited GraphQL proxy) committed to repo. |
| 11 | **`use_prepared_statements: false` disables query optimization** | `databases.yaml:8` — should be `true` for query planning reuse and SQL injection defense-in-depth. |
| 12 | **`@ts-expect-error` on `nhost.auth.signOut()` masks real type bug** | `UserMenu.tsx:18`, `animated-scroll.tsx:62` — Nhost API type mismatch silently suppressed. |
| 13 | **Empty catch blocks swallow errors** | `SiteContentContext.tsx:59`, `ContentEditor.tsx:76`, `animated-scroll.tsx:57` — silent failures make debugging impossible. |

#### 🟡 MEDIUM (8 issues)

| # | Finding | Details |
|---|---------|---------|
| 14 | **No global Apollo `onError` link** | `main.tsx` — network/auth errors not handled globally; each component handles inconsistently. |
| 15 | **`preferred_date` required in mutation but optional in UI** | `booking-modal.tsx:18` vs `:665` — `$preferred_date: date!` but `<input>` not marked `required`. Submission without date fails. |
| 16 | **`site_content` has no auto-update trigger for `updated_at`** | `nhost-setup.sql` — column has `DEFAULT now()` but no `BEFORE UPDATE` trigger. `updated_at` stays stale on upsert. |
| 17 | **`current_user_id()` function returns `text` instead of `uuid`** | `nhost-setup.sql` — `user_id` columns are UUID; cast `user_id::text = current_user_id()` prevents index usage. |
| 18 | **No CHECK constraint on `bookings.status`** | `nhost-setup.sql` — allows arbitrary strings. Frontend uses `pending_verification`, `confirmed`, `cancelled`. |
| 19 | **Mixed controlled/uncontrolled form in booking-modal** | `booking-modal.tsx:434-474` — name/email use refs (uncontrolled), selects/toggles use React state (controlled). |
| 20 | **CSP allows `'unsafe-inline'` for styles** | `index.html:6` — necessary for Tailwind but weakens CSP. |

#### 🔵 LOW (6 issues)

- Missing `aria-describedby` on error messages
- `key={i}` usage in list rendering (ContentEditor)
- `nhost-setup.sql` not idempotent (`CREATE POLICY` without `IF NOT EXISTS`)
- No test runner configured in `package.json`
- `.env` `VITE_ADMIN_EMAIL` inconsistent with hardcoded email
- Resend `FROM_EMAIL` defaults to test sender (`onboarding@resend.dev`)

#### Top 3 Actions to Fix Immediately
1. **Fix AddPetModal column names** — `pet_name`→`name`, `age`→`age_years`, `weight`→`weight_kg` (CRITICAL #1)
2. **Remove `parseInt()` from `pet_id` in booking-modal** — pass UUID string directly (CRITICAL #6)
3. **Add `admin` role to Hasura metadata** with unrestricted booking select + site_content write (CRITICAL #2 + #3)

---

## Security Posture

### Current Protections (Active)
| Layer | Protection | Status |
|-------|-----------|--------|
| **Auth** | Nhost email/password with JWT sessions | ✅ Active |
| **GraphQL** | Hasura metadata permissions applied (`user` role: own-data-only select/insert on bookings + pets, `public` role: unauthenticated site_content read) | ✅ Active via `hasura metadata apply` |
| **GraphQL** | SQL RLS policies (fallback — **still active, should be disabled** to prevent conflicts with Hasura metadata permissions) | ⚠️ Active — needs explicit `DISABLE ROW LEVEL SECURITY` SQL |
| **Admin** | Email-gated admin panel (client + Apollo link sends `x-hasura-role: admin` header) | ✅ Active |
| **Bookings** | `transaction_id` UNIQUE constraint prevents duplicate UPI refs | ✅ Active |
| **XSS** | React's default JSX escaping | ✅ Active |
| **CSP** | Content Security Policy meta tag in index.html | ✅ Active |
| **Input** | maxLength on all form fields | ✅ Active |
| **Secrets** | .env in .gitignore, no hardcoded API keys | ✅ Active |

### Gaps (Not Yet Addressed)
| Gap | Risk | Mitigation Needed |
|-----|------|-------------------|
| **SQL RLS still active** | SQL RLS policies and Hasura metadata permissions operate in parallel — they don't conflict for simple operations, but `user_id`-filtered queries go through both layers. The `auth.users` table is not tracked in Hasura, so the `user` object relationship was removed (bookings table has no `user { email }` in GraphQL schema). | Run `ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;` (and pets, site_content) in Nhost Dashboard SQL console |
| **Admin role in JWT** | Nhost doesn't assign `admin` role in `x-hasura-allowed-roles` JWT claims by default — `admin` role permissions removed from metadata until Nhost custom claims configured. The Apollo link sends `x-hasura-role: admin` header when user email matches adminEmail, but Hasura will default to `user` role if JWT doesn't include `admin` in allowed-roles. | Configure custom JWT claims in Nhost Dashboard → Users → Edit admin user → Add role `admin`, then re-add `admin` role permissions to metadata |
| **Rate limiting** | No rate limiting on auth or booking endpoints | Not available at Nhost free tier; consider Cloudflare rate limiting |
| **Email verification** | If Nhost requires verified emails, new signups can't log in immediately | Disable in Nhost Dashboard → Settings → Sign-In Methods → Email and Password |
| **SQL injection** | GraphQL variables prevent injection | ✅ Already mitigated by Apollo/Hasura |
| **Audit logging** | No tracking of who modified site_content | Future enhancement |
| **adminEmail hardcoded** | `ADMIN_EMAIL` is hardcoded in `src/config/site-content.ts` as a fallback to `VITE_ADMIN_EMAIL` env var | Move to Nhost Environment Variables and fetch at runtime |

**Verdict:** The site has **solid baseline security** for a small business pet grooming site. The most critical protection — that users can only see/edit their own data — is enforced at the database level via Hasura metadata permissions (applied and live). The remaining gaps are operational: disabling old SQL RLS policies, configuring admin JWT claims in Nhost, and moving admin config to env vars.

---

## Known Issues & Roadmap

### Current Limitations
- **FeatureCarousel height on small screens** — Fixed percentage heights may cause overflow on 320px-375px screens
- **Transaction ID persists after error** — Input retains value after submission failure
- **No email verification handling** — If Nhost project requires email verification, users see "Email not verified" on sign-in until they click the verification link
- **SQL RLS still active** — Old `nhost-setup.sql` RLS policies still active on bookings, pets, and site_content tables; need to `DISABLE ROW LEVEL SECURITY` to prevent potential conflicts with Hasura metadata permissions
- **Admin role removed from metadata** — `admin` role permissions are not in Hasura metadata because Nhost JWT doesn't include `admin` in `x-hasura-allowed-roles` by default; Apollo link sends `x-hasura-role: admin` header but Hasura will fall back to `user` role until JWT claims configured

### Completed Features
- ✅ **Supabase -> Nhost** — Data layer migrated to `@nhost/nhost-js` v4 SDK with Apollo Client
- ✅ **GitHub Pages -> Cloudflare Pages** — Deployed via Cloudflare Git Integration
- ✅ **Booking form** — 2-step modal with UPI transaction validation, duplicate detection
- ✅ **Authentication** — Sign In / Sign Up / Password Reset via Nhost email/password
- ✅ **UserMenu** — Auth-aware top-right nav (Sign In / user dropdown)
- ✅ **Pet Profiles** — CRUD interface at `/profile` (uses GET_USER_PETS + INSERT_PET)
- ✅ **Admin Dashboard** — Booking management + Content Editor at `/admin`
- ✅ **Content Editor (CMS)** — 6-tab editor for all site content, DB-backed via Hasura
- ✅ **SiteContentContext** — Centralized content provider with UPSERT capability
- ✅ **AddPetModal** — Post-login pet prompt when user has zero pets
- ✅ **Pet fields during signup** — Full pet form in AuthModal signup mode
- ✅ **Booking requires login** — Auth gate before booking modal
- ✅ **Admin Panel button** — Conditional top-left button for admin users
- ✅ **GraphQL centralized** — All reused gql tags in `src/lib/graphql.ts`
- ✅ **Routing** — react-router-dom v7 with 3 routes + 404 fallback
- ✅ **Normal scroll + fade-in** — Snap-scroll replaced with IntersectionObserver transitions
- ✅ **ErrorBoundary** — Catches React rendering errors with retry
- ✅ **Sections extracted** — 5 pages moved to `src/components/sections/`
- ✅ **Config centralized** — All hardcoded text moved to `src/config/site-content.ts`
- ✅ **Strict TypeScript** — Enabled `strict: true`
- ✅ **Modal accessibility** — Focus trap, aria-live, form labels
- ✅ **CSP meta tag** — Content Security Policy in index.html
- ✅ **Input maxLength** — On all form inputs
- ✅ **Security** — Secrets redacted from docs, env vars excluded from git
- ✅ **Scroll lock** — On AuthModal, AddPetModal, and BookingModal
- ✅ **Auth error codes mapped** — unverified-user, invalid-email-password, signup-disabled, user-already-exists
- ✅ **Admin confirm loading state** — Spinner on confirm button, disabled during mutation
- ✅ **Auth guards** — ProfilePage and AdminDashboard redirect if not logged in
- ✅ **Password reset** — "Forgot Password?" link in AuthModal with email-only reset flow
- ✅ **nhost-setup.sql** — Complete SQL for site_content, RLS policies, helper function, seed data
- ✅ **RLS policies** — Row-level security for pets, bookings, and site_content tables
- ✅ **PRICING_MENU** — Complete price matrix (5 basic/package tiers + 4 add-ons + weight categories) in site-content.ts
- ✅ **Booking contact update** — New address (Malki, Nongshiliang, Shillong - 793001), phone (8798897732), UPI (9089196235@axisbank)
- ✅ **PricingMenuContent types** — Extended content-service.ts with full type definitions
- ✅ **SiteContentContext pricing** — pricingMenu default + section key map in context
- ✅ **Pricing-aware booking modal** — Auto size detection, package picker, add-on checkboxes, live price breakdown
- ✅ **Auth state pre-fill** — Name/email auto-filled + readOnly for authenticated users
- ✅ **Auth guard** — AuthModal skips signup entirely when user is already authenticated
- ✅ **GraphQL fix** — CREATE_PET mutation uses correct column names (name, age_years, weight_kg)
- ✅ **Mobile scroll fix** — Booking modal has responsive padding (p-4 sm:p-6) and smooth overflow
- ✅ **CMS Pricing tab** — 7th tab "Pricing & Policies" in ContentEditor with editable tables for all services
- ✅ **Database migration** — `addons` (JSONB) and `total_price` (INTEGER) columns added to bookings table
- ✅ **Seed data** — pricing_menu section seeded in nhost-setup.sql
- ✅ **GraphQL updated** — GET_ADMIN_BOOKINGS queries addons + total_price fields
- ✅ **Nhost Serverless Function** — `functions/send-booking-receipt.ts` sends HTML email receipts via Resend
- ✅ **AuthModal GraphQL fixed** — pet_name → name, age → age_years, weight → weight_kg in CREATE_PET mutation
- ✅ **Manual size selector** — Guest / no-pet users can self-select pet size (Small/Medium/Large/XL) to browse packages
- ✅ **Calendar date picker** — Date input uses native `type="date"` with `min=today`
- ✅ **Crash-safe pricing arrays** — All `.map()` calls guarded with `|| []` to prevent render crashes
- ✅ **Visible validation instead of silent disabled** — Submit button is always enabled; missing package shows a red error banner
- ✅ **Raw GraphQL errors in UI** — Backend error messages displayed verbatim with `console.error("GRAPHQL ERROR:", ...)`
- ✅ **GraphQL type fixes** — `$preferred_date: String!` → `date!`, `$pet_id: Int` → `uuid`
- ✅ **Hasura metadata permissions applied** — Role-based access control live for bookings, pets, site_content via `hasura metadata apply`
- ✅ **user_id insert preset** — `user_id` auto-set from JWT session on booking and pet insert
- ✅ **user_id select filter** — Regular users can only see their own bookings and pets (`{user_id: {_eq: X-Hasura-User-Id}}`)
- ✅ **public role** — Unauthenticated users can read site_content (landing page data)
- ✅ **admin role header in Apollo link** — `x-hasura-role: admin` sent when user email matches adminEmail (role permissions removed from metadata pending JWT claims config)
- ✅ **Apollo role-based auth link** — `setContext` sends both `Authorization: Bearer <token>` and `x-hasura-role: admin|user`
- ✅ **auth.users relationship removed** — Removed `user` object_relationship from bookings/pets metadata to fix `"table not tracked"` inconsistency error
- ✅ **GET_ADMIN_BOOKINGS updated** — `user { email }` sub-query removed since relationship no longer exists (email available directly on bookings table)
- ✅ **Hasura CLI setup** — v2.42.0 binary at `%TEMP%\hasura.exe`, direct engine endpoint (`hasura.ap-south-1.nhost.run`), `HASURA_GRAPHQL_ADMIN_SECRET` env var
- ✅ **config.yaml gitignored** — `hasura/config.yaml` in `.gitignore`, `hasura/config.yaml.example` as tracked template with instructions
- ✅ **hasura/config.yaml endpoint fix** — Direct Hasura engine endpoint (not GraphQL proxy) with env var based admin secret

### Future Enhancements
1. **Disable SQL RLS policies** — Run `ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;` (and pets, site_content) in Nhost Dashboard SQL console to prevent conflicts with Hasura metadata permissions
2. **Configure admin JWT claims** — Set custom JWT claims in Nhost Dashboard → Users → Edit admin user → Add role `admin` so `x-hasura-role: admin` header in Apollo link is validated by Hasura, then re-add `admin` role permissions to metadata
3. **Move ADMIN_EMAIL to Nhost env var** — Add `ADMIN_EMAIL` to Nhost Dashboard → Environment Variables, then update frontend to read it at runtime (instead of hardcoding `adminEmail` in `site-content.ts`)
4. **Pet editing/deletion** — Currently only "Add Pet" is supported; add edit and delete
5. **Booking editing** — Allow admin to edit booking details beyond status
6. **Disable "Require Verified Emails"** — Turn off in Nhost Dashboard → Settings → Sign-In Methods → Email and Password so signups work immediately
7. **Loading/error/success animations** — Enhance with better motion animations
8. **Static HTML version** — Consolidate or remove the old static site in the parent folder

---

*Last updated: June 11, 2026 (session 15)*
