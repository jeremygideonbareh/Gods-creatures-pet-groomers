# Gods Creatures Pet Groomers

Luxury pet grooming website — single-page scrollable React app deployed to GitHub Pages.

## Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (build tool, base: `/Gods-creatures-pet-groomers/`)
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **motion** (formerly Framer Motion) — animations
- **lucide-react** — icons
- GitHub Actions → GitHub Pages (deploy)

## Project Structure

```
react-app/
├── public/
│   ├── herosectionvideo.mp4     # Hero background video (328KB, 640×360, loop)
│   ├── hero-poster.jpg          # Static poster shown while video loads
│   └── review-image*.png        # Review gallery images (4 files)
├── src/
│   ├── components/ui/
│   │   ├── animated-scroll.tsx   # MAIN: full-page scroll, all 5 pages, video, overlays
│   │   ├── feature-carousel.tsx  # Services carousel (4 services, auto-play)
│   │   ├── image-auto-slider.tsx # Infinite auto-scroll review images
│   │   └── booking-modal.tsx     # Booking form modal (2-step: info → form)
│   ├── lib/utils.ts             # cn() helper (clsx + tailwind-merge)
│   ├── App.tsx                  # Root → renders <ScrollAdventure />
│   └── main.tsx                 # Entry point
├── index.html
├── vite.config.ts
├── package.json
└── .github/workflows/deploy.yml
```

## Pages (5 total, snap-scroll)

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero | Video background + overlay + "Book Appointment" CTA |
| 2 | Why Choose Us | 4 vet-backed value props |
| 3 | Our Signature Services | FeatureCarousel (bath, haircut, dental, pawdicure) |
| 4 | Happy Clients | Testimonials + ImageAutoSlider review gallery |
| 5 | Book Now | Location info + "Book a Session" CTA |

## Key Behaviors

- **Scroll**: wheel, touch swipe (≥50px delta), arrow keys — all snap to the nearest full page (1s CSS transition)
- **Video**: `autoPlay` + `muted` + `playsInline`. Paused when navigating away from page 1, resumed via `play()` in gesture handlers (not a useEffect) to satisfy mobile autoplay policies
- **Inner scroll**: pages with `overflow-y-auto` (services, reviews) let the inner content scroll first; page nav only triggers when the inner scrollable hits its boundary
- **Overlays**: all `bg-black/*` overlays use `pointer-events-none` so buttons remain clickable
- **Mobile layout**: `flex-col` stacks panels vertically (30% / 70% split by default)

## Running Locally

```bash
cd react-app
npm install
npm run dev       # Vite dev server with HMR
npm run build     # tsc + vite build → dist/
npm run preview   # Serve built dist/ locally
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml` which builds and deploys to GitHub Pages:

```
https://jeremygideonbareh.github.io/Gods-creatures-pet-groomers/
```

The `base` in `vite.config.ts` must match the repo name.

## Known Quirks

- All asset paths use `import.meta.env.BASE_URL` to work with the GitHub Pages sub-path
- The services carousel (`idx === 3`) has a dedicated full-screen branch; the `idx === 3` branch inside the right-panel else clause is dead code
- Some review images use `.jpeg` extension, others `.png` — this is intentional
