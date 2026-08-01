# File Structure — Gods Creatures Pet Groomers

This is a detailed FILE STRUCTURE document for the Gods Creatures Pet Groomers React app, providing comprehensive documentation of every file and directory in the project. The project lives at `react-app/` (which is the GitHub repo root).

## Complete File Tree

```text
react-app/ (GitHub repo root)
├── .env                              # Nhost credentials + admin email (gitignored)
├── .env.example                      # Template with all VITE_ env vars
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions: build check on push to main
├── .gitignore                        # Git exclusions (.env, node_modules, dist, hasura/config.yaml)
├── AGENTS.md                         # AI agent instructions and project context
├── CLIENT-GUIDE.md                   # Client-facing website usage guide
├── HANDOFF.md                        # Complete 1883-line development history and architecture guide
├── MAINTENANCE.md                    # Maintenance agreement and communication protocol
├── README.md                         # Project README with tech stack, structure, deployment
├── components.json                   # shadcn/ui component config
├── functions/                        # Nhost Serverless Functions (deployed to Nhost)
│   ├── cashfree-webhook.ts           # Cashfree payment webhook handler
│   ├── confirm-booking.ts            # Server-side payment verification + booking confirmation
│   ├── create-booking-order.ts       # Main booking + Cashfree order creation
│   ├── create-cashfree-order.ts      # Legacy standalone Cashfree order creation
│   ├── create-manual-booking.ts      # Manual UPI/GPay booking fallback
│   ├── create-razorpay-order.ts      # Legacy Razorpay order creation
│   ├── get-booked-slots.ts           # Fetch booked time slots for a date
│   ├── razorpay-webhook.ts           # Razorpay payment webhook handler
│   ├── send-booking-receipt.ts       # HTML email receipt via Resend API
│   ├── verify-cashfree-payment.ts    # Deprecated Cashfree signature verification
│   ├── verify-razorpay-payment.ts    # Razorpay checkout signature verification
│   ├── package.json                  # Functions dependencies (razorpay, resend)
│   └── package-lock.json
├── hasura/                           # Hasura CLI metadata project
│   ├── config.yaml                   # CLI config (gitignored, admin secret from env)
│   ├── config.yaml.example           # Template for fresh clones
│   ├── README.md                     # Hasura setup guide
│   ├── migrations/                   # DB migrations (if any)
│   └── seeds/                        # DB seeds (if any)
├── index.html                        # Vite entry HTML with CSP meta tag
├── metadata/                         # Hasura v3 metadata YAML
│   ├── actions.yaml                  # Empty (no custom actions)
│   ├── databases/
│   │   ├── databases.yaml            # Database connection config
│   │   └── default/
│   │       └── tables/               # Per-table metadata YAML files
│   └── version.yaml                  # Metadata version: 3
├── nhost-functions/                  # Duplicate of functions/ for Nhost compatibility
├── nhost-setup.sql                   # Complete DB schema, RLS, indexes, seeds
├── nhost.toml                        # Nhost project config
├── package.json                      # Dependencies and scripts
├── package-lock.json
├── public/                           # Static assets
│   ├── _headers                      # Cloudflare headers
│   ├── hero-poster.jpg               # Hero video poster image
│   ├── herosectionvideo.mp4          # Hero background video
│   ├── review-image1.png             # Review gallery images
│   ├── review-image2.png
│   ├── review-image3.png
│   └── reviewimage5.jpeg
├── scripts/                          # Utility scripts
│   ├── capture-screenshots.mjs       # Playwright screenshot capture
│   └── test-email-function.mjs       # Test email receipt function
├── src/                              # Application source code
│   ├── App.tsx                       # Root: BrowserRouter + Routes + Providers
│   ├── main.tsx                      # Entry: ApolloClient + ErrorBoundary
│   ├── index.css                     # Tailwind CSS 4 + theme tokens
│   ├── __tests__/
│   │   ├── double-booking.test.ts    # 6 tests for booking conflict logic
│   │   └── session-error.test.ts     # 5 tests for JWT session validation
│   ├── assets/                       # Static imports
│   ├── components/
│   │   ├── ui/                       # Reusable UI components (15 files)
│   │   │   ├── AddPetModal.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── ImageDropzone.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   ├── animated-scroll.tsx
│   │   │   ├── booking-modal.tsx
│   │   │   ├── bounce-card-features.tsx
│   │   │   ├── feature-carousel.tsx
│   │   │   ├── footer-enhanced.tsx
│   │   │   ├── image-auto-slider.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── scroll-progress.tsx
│   │   │   ├── section-header.tsx
│   │   │   ├── section-header-enhanced.tsx
│   │   │   └── social-proof-bar.tsx
│   │   ├── sections/                 # Page section components (15 files)
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── BlogSection.tsx
│   │   │   ├── BookingSection.tsx
│   │   │   ├── ContentEditor.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProcessSection.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── StorePage.tsx
│   │   │   ├── StoreSection.tsx
│   │   │   ├── TeamSection.tsx
│   │   │   └── WhyChooseUsSection.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── SessionErrorBoundary.tsx
│   ├── config/
│   │   ├── site-content.ts           # All defaults, tokens, admin emails, pricing
│   │   └── store-products.ts         # STORE_PHONE constant
│   ├── context/
│   │   ├── AuthContext.tsx            # Auth state provider
│   │   └── SiteContentContext.tsx     # CMS content provider
│   ├── hooks/
│   │   ├── use-active-section.ts      # Viewport section detection
│   │   ├── use-anime-scroll.ts        # Scroll-triggered animations
│   │   ├── use-scroll-progress.ts     # Page scroll percentage
│   │   ├── use-snap-scroll.ts         # Deprecated snap-scroll hook
│   │   └── useBookingConflict.ts      # Booking conflict checker
│   └── lib/
│       ├── content-service.ts         # CMS types, mapping, upsert mutation
│       ├── graphql.ts                 # Centralized GraphQL queries/mutations
│       ├── nhost.ts                   # Nhost client + URL exports + session validator
│       └── utils.ts                   # cn() Tailwind merge helper
├── tsconfig.json
├── tsconfig.app.json                 # strict: true
├── tsconfig.node.json
├── vite.config.ts                    # Vite config with path alias, Tailwind plugin
├── vitest.config.ts                  # Vitest test runner config
└── wrangler.toml                     # Cloudflare Pages config
```

## Directory and File Descriptions

### Root Configuration & Project Files
- **`.env` / `.env.example`**: Secure environment variables (like Nhost secrets or admin emails) and a template file defining required variables.
- **`.github/workflows/deploy.yml`**: GitHub Actions workflows for running build verification checks whenever code is pushed to the main branch.
- **`.gitignore`**: Defines folders and files that should not be tracked by git, such as `node_modules/`, `dist/`, and local credentials.
- **`components.json`**: Configuration options for the shadcn/ui component library used within the React application.
- **`index.html`**: The main Vite entry point containing the basic HTML shell and Content Security Policy (CSP) configurations.
- **`nhost.toml`**: Project-wide configuration detailing deployment specifications for the Nhost platform.
- **`nhost-setup.sql`**: A complete SQL dump encompassing the database schema, Row Level Security (RLS) policies, indexes, and initial seed data.
- **`package.json` / `package-lock.json`**: NPM configuration specifying dependencies, versions, and executable project scripts.
- **`tsconfig.*.json`**: TypeScript configurations (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`) ensuring robust types and strict error checking.
- **`vite.config.ts`**: Settings for the Vite build bundler, managing path aliases and integrating the Tailwind CSS plugin.
- **`vitest.config.ts`**: Configuration file for the Vitest test runner.
- **`wrangler.toml`**: Essential configuration parameters for deploying static assets onto Cloudflare Pages.

### Documentation Files
- **`AGENTS.md`**: Provides vital instructions and contextual information specifically intended for AI agents working on the codebase.
- **`CLIENT-GUIDE.md`**: The client-facing guide explaining how to navigate, utilize, and modify their website.
- **`HANDOFF.md`**: A comprehensive architectural document detailing the complete development history, technical decisions, and structure.
- **`MAINTENANCE.md`**: Outlines the maintenance agreements, responsibilities, and ongoing communication protocol.
- **`README.md`**: The foundational project setup file outlining the tech stack, installation instructions, and deployment workflow.

### Serverless Functions (`functions/` & `nhost-functions/`)
Contains Node.js based serverless functions designed to be executed via Nhost. `nhost-functions/` is a compatibility duplicate of `functions/`.
- **`cashfree-webhook.ts` / `razorpay-webhook.ts`**: Handles incoming webhooks from payment gateways to update payment statuses securely.
- **`confirm-booking.ts`**: The endpoint responsible for verifying successful payments and persisting confirmed bookings on the server.
- **`create-booking-order.ts`**: Core booking mechanism that generates Cashfree orders alongside new reservation entries.
- **`create-manual-booking.ts`**: Alternative endpoint catering to manual UPI or Google Pay bookings.
- **`get-booked-slots.ts`**: Utility function serving the frontend to retrieve currently booked time slots for validation.
- **`send-booking-receipt.ts`**: Dispatches HTML formatted email receipts to customers utilizing the Resend API.

### Hasura Meta-Configuration (`hasura/` & `metadata/`)
- **`hasura/`**: Contains the Hasura CLI configurations, database migrations, and seed scripts. Notably includes `config.yaml` (gitignored).
- **`metadata/`**: Holds exported YAML representations of the Hasura v3 metadata, defining databases, table relationships, and API permissions.

### Static Assets (`public/`)
- **`_headers`**: Defines Cloudflare static response headers primarily employed for optimizing caching and bolstering security.
- **Media Files (e.g. `hero-poster.jpg`, `herosectionvideo.mp4`)**: Unprocessed static imagery and videos used directly by the website UI, bypassing Webpack/Vite processing.

### Developer Scripts (`scripts/`)
- **`capture-screenshots.mjs`**: Utility leveraging Playwright to automatically take and store website screenshots.
- **`test-email-function.mjs`**: Simple test script validating the behavior of the `send-booking-receipt.ts` serverless function.

### React Application Code (`src/`)
Contains the entirety of the frontend application source code.
- **`App.tsx` & `main.tsx`**: The main entry points. Initializes the React application, establishes the Apollo GraphQL client, renders Error Boundaries, and sets up routing.
- **`index.css`**: The central stylesheet providing Tailwind CSS 4 directives and core theming tokens.

#### Unit Tests (`src/__tests__/`)
- **`double-booking.test.ts`**: Rigorous testing suite guaranteeing the logic that restricts overlapping booking slots.
- **`session-error.test.ts`**: Tests validating frontend behaviors related to JWT session validation and error handling.

#### Components (`src/components/`)
- **`ui/`**: A library of small, highly reusable interface pieces, heavily leveraging shadcn (e.g. `AuthModal.tsx`, `navbar.tsx`, `animated-scroll.tsx`).
- **`sections/`**: Container modules representing substantial chunks of pages, unifying data fetching and presentation (e.g. `HeroSection.tsx`, `AdminDashboard.tsx`, `BookingSection.tsx`).
- **`ErrorBoundary.tsx` / `SessionErrorBoundary.tsx`**: Component wrappers that defensively catch internal UI errors or authentication session drops to prevent total app crashes.

#### Context & Configuration (`src/config/` & `src/context/`)
- **`config/site-content.ts`**: A robust configuration file acting as a fallback source of truth for all default marketing copy, tokens, and pricing parameters.
- **`context/AuthContext.tsx`**: The React Provider managing the logged-in user state across the system.
- **`context/SiteContentContext.tsx`**: A CMS provider context feeding dynamically fetched content deep into the component tree.

#### Hooks (`src/hooks/`)
- **`useBookingConflict.ts`**: Extracts complex date and time comparisons utilized in detecting scheduling conflicts.
- **`use-scroll-progress.ts` / `use-anime-scroll.ts`**: Utilities computing scrolling metrics for firing visually appealing CSS and element animations.

#### Core Libraries (`src/lib/`)
- **`content-service.ts`**: Bridges Hasura and the frontend application for upserting and retrieving mutable text content.
- **`graphql.ts`**: A centralized repository declaring standardized GraphQL operations (queries and mutations).
- **`nhost.ts`**: Instantiates and exports the shared Nhost client instance and user session validators.
- **`utils.ts`**: Exports shared helper functions, primarily `cn()`, utilized extensively to merge complex Tailwind utility strings.
