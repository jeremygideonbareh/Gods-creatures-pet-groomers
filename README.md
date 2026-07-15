# Gods Creatures Pet Groomers

Luxury pet grooming website — single-page scrollable React app deployed to **Cloudflare Pages**.

## Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (build tool)
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **motion** (formerly Framer Motion) — animations
- **lucide-react** — icons
- **Nhost** — Auth + Hasura GraphQL backend
- **Razorpay** — Booking fee payments
- **Cloudflare Pages** — Frontend hosting
- **GitHub Actions** — CI/CD deployment

## Project Structure

```
├── public/
│   ├── herosectionvideo.mp4     # Hero background video
│   ├── hero-poster.jpg          # Static poster for video
│   └── review-image*.png        # Review gallery images
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── animated-scroll.tsx   # Main scrollable layout
│   │   │   ├── feature-carousel.tsx  # Services carousel
│   │   │   ├── image-auto-slider.tsx # Review image slider
│   │   │   ├── booking-modal.tsx     # Booking form with Razorpay
│   │   │   ├── AuthModal.tsx         # Sign In / Sign Up
│   │   │   ├── AddPetModal.tsx       # Post-login pet creation
│   │   │   ├── UserMenu.tsx          # User dropdown menu
│   │   │   └── ImageDropzone.tsx     # CMS image uploader
│   │   ├── sections/            # Page section components
│   │   └── ErrorBoundary.tsx
│   ├── config/site-content.ts   # Content + design tokens + admin emails
│   ├── context/                 # AuthContext, SiteContentContext
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # nhost, graphql, utils, content-service
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── functions/                   # Nhost Serverless Functions
│   ├── create-razorpay-order.ts
│   ├── verify-razorpay-payment.ts
│   ├── razorpay-webhook.ts
│   ├── send-booking-receipt.ts
│   └── package.json
├── .github/workflows/deploy.yml # GitHub Actions → Cloudflare Pages
├── wrangler.toml                # Cloudflare Pages config
├── index.html
├── vite.config.ts
└── package.json
```

## Pages (5 sections, scrollable)

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero | Video background + overlay + "Book Appointment" CTA |
| 2 | Why Choose Us | 4 vet-backed value props |
| 3 | Our Signature Services | FeatureCarousel (bath, haircut, dental, pawdicure) |
| 4 | Happy Clients | Testimonials + ImageAutoSlider review gallery |
| 5 | Book Now | Location info + "Book a Session" CTA |

## Running Locally

```bash
cd react-app
npm install
npm run dev       # Vite dev server with HMR (http://localhost:5173)
npm run build     # tsc + vite build → dist/
npm run preview   # Serve built dist/ locally
```

## Deployment

### Automatic (recommended)
Push to `main` → GitHub Actions runs `.github/workflows/deploy.yml` → builds → deploys to Cloudflare Pages.

**Required GitHub Secrets (set in repo Settings → Secrets and variables → Actions):**
| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages write permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `VITE_NHOST_SUBDOMAIN` | Nhost project subdomain |
| `VITE_NHOST_REGION` | Nhost project region |
| `VITE_ADMIN_EMAIL` | Comma-separated admin emails |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key ID |

### Manual (via wrangler CLI)
```bash
npm run build
npx wrangler pages deploy dist --project-name=gods-creatures-pet-groomers
```

### Production URL
```
https://gods-creatures-pet-groomers.pages.dev
```

## Environment Variables

See `docs/env-vars.md` for the full reference. Key locations:

| Variable | Where Set | Purpose |
|----------|-----------|---------|
| `VITE_RAZORPAY_KEY_ID` | `.env` + Cloudflare Dashboard | Frontend Razorpay Checkout |
| `VITE_NHOST_SUBDOMAIN` | `.env` + Cloudflare Dashboard | Nhost backend connection |
| `VITE_NHOST_REGION` | `.env` + Cloudflare Dashboard | Nhost region |
| `VITE_ADMIN_EMAIL` | `.env` + Cloudflare Dashboard | Admin access control |
| `RAZORPAY_KEY_SECRET` | Nhost Dashboard | Server-side payment API |
| `RAZORPAY_WEBHOOK_SECRET` | Nhost Dashboard + Razorpay | Webhook signature verification |
| `RESEND_API_KEY` | Nhost Dashboard | Email receipts |
| `HASURA_GRAPHQL_ADMIN_SECRET` | Nhost Dashboard | Hasura admin access |

## Backend

- **Nhost** manages authentication and Hasura GraphQL
- Serverless functions in `functions/` are deployed to Nhost
- Razorpay payment flow: frontend → Nhost function → Razorpay API → webhook → booking confirmation

## Known Quirks

- All asset paths use `import.meta.env.BASE_URL` to work with the deployment path
- The services carousel (`idx === 3`) has a dedicated full-screen branch
- Some review images use `.jpeg` extension, others `.png` — intentional
- Nhost auto-deploy does NOT apply Hasura metadata — must be applied manually via `hasura metadata apply`
