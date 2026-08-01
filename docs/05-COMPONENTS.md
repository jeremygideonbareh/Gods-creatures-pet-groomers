# Components Reference — Gods Creatures Pet Groomers

## Component Tree

The React application follows this hierarchical structure:

- **App.tsx** → `BrowserRouter` → `SiteContentProvider` → `AuthProvider` → `Routes`
  - **ScrollAdventure** (`animated-scroll.tsx`) → `Navbar`, `ScrollProgress`, `HeroSection`, `SocialProofBar`, `WhyChooseUsSection`, `ServicesSection`, `GallerySection`, `ReviewsSection`, `TeamSection`, `ProcessSection`, `FAQSection`, `BlogSection`, `StoreSection`, `BookingSection`, `EnhancedFooter`, `UserMenu`, `AuthModal`, `BookingModal`, `AddPetModal`
  - **ProfilePage**
  - **AdminDashboard** → `ContentEditor`
  - **StorePage**

---

## UI Components (`src/components/ui/`)

### 1. ScrollAdventure (`animated-scroll.tsx`)
- **File name and size:** `animated-scroll.tsx` (~12KB)
- **Purpose:** Main landing page layout that stitches together all sections and controls global modals and auth flows.
- **Props interface:** None (Root level component)
- **Key state:** `bookingOpen`, `authOpen`, `showPetForm`, `scrolled`, `activeSection`
- **User interactions:** Scroll spying, triggering modals.
- **Animation patterns:** Smooth scrolling to sections, fade-in animations on scroll.
- **Dependencies:** `framer-motion`, various UI and Section components.

### 2. BookingModal (`booking-modal.tsx`)
- **File name and size:** `booking-modal.tsx` (~37KB, largest component)
- **Purpose:** 2-step booking flow with integrated payment. Handles pet size detection and pricing calculation.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `isOpen` | `boolean` | Controls visibility of the modal |
  | `onClose` | `() => void` | Callback to close the modal |
- **Key state:** `step`, `selectedService`, `petDetails`, `paymentStatus`
- **User interactions:** Multi-step form navigation, payment submission.
- **Animation patterns:** Slide up/fade-in modal transitions.
- **Dependencies:** Cashfree payment SDK, `react-hook-form`.

### 3. FeatureCarousel (`feature-carousel.tsx`)
- **File name and size:** `feature-carousel.tsx` (~6KB)
- **Purpose:** 3D card carousel for displaying services.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `features` | `Feature[]` | Array of feature objects to display |
- **Key state:** `currentIndex`, `isHovered`
- **User interactions:** Hover to pause, keyboard arrows to navigate.
- **Animation patterns:** 3D rotational carousel (auto-play 4s loop).
- **Dependencies:** `framer-motion`.

### 4. ImageAutoSlider (`image-auto-slider.tsx`)
- **File name and size:** `image-auto-slider.tsx` (~4KB)
- **Purpose:** Infinite marquee displaying review photos.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `images` | `string[]` | Array of image URLs |
- **Key state:** None
- **User interactions:** None (passive display)
- **Animation patterns:** CSS-based infinite marquee (25s loop).
- **Dependencies:** None.

### 5. AuthModal (`AuthModal.tsx`)
- **File name and size:** `AuthModal.tsx` (~10KB)
- **Purpose:** Handles Sign in, Sign up, and Password reset flows, including optional pet registration during signup.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `isOpen` | `boolean` | Controls visibility |
  | `onClose` | `() => void` | Closes modal |
  | `onAuthSuccess` | `() => void` | Callback upon successful authentication |
- **Key state:** `authMode` (login, signup, reset), `formData`
- **User interactions:** Form submission, toggling modes.
- **Animation patterns:** Fade in/out.
- **Dependencies:** Authentication Provider/SDK.

### 6. AddPetModal (`AddPetModal.tsx`)
- **File name and size:** `AddPetModal.tsx` (~8KB)
- **Purpose:** Post-login pet creation modal.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `isOpen` | `boolean` | Controls visibility |
  | `onClose` | `() => void` | Closes modal |
- **Key state:** `petData`, `isSubmitting`
- **User interactions:** Form entry and submission.
- **Animation patterns:** Standard modal fade.
- **Dependencies:** GraphQL mutation hooks.

### 7. UserMenu (`UserMenu.tsx`)
- **File name and size:** `UserMenu.tsx` (~5KB)
- **Purpose:** Top-right auth menu displaying a Sign In button or a user dropdown (profile/signout).
- **Props interface:** None (Relies on context)
- **Key state:** `dropdownOpen`
- **User interactions:** Click to toggle dropdown, navigation clicks.
- **Animation patterns:** Dropdown fade and slide down.
- **Dependencies:** `AuthProvider`.

### 8. ImageDropzone (`ImageDropzone.tsx`)
- **File name and size:** `ImageDropzone.tsx` (~7KB)
- **Purpose:** Drag-and-drop image upload to Nhost storage.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `value` | `string` | Current image URL |
  | `onChange` | `(url: string) => void`| Callback with new URL |
  | `label` | `string` | Dropzone text label |
- **Key state:** `isDragging`, `uploadProgress`
- **User interactions:** Drag, drop, click to browse.
- **Animation patterns:** Border highlight on drag over.
- **Dependencies:** Nhost storage SDK, `react-dropzone`.

### 9. Navbar (`navbar.tsx`)
- **File name and size:** `navbar.tsx` (~8KB)
- **Purpose:** Sticky header with active section highlighting and a mobile drawer menu.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `activeSection` | `string` | ID of the currently visible section |
- **Key state:** `isMobileMenuOpen`
- **User interactions:** Navigation link clicks, mobile menu toggle.
- **Animation patterns:** Slide-in for mobile drawer, background blur on scroll.
- **Dependencies:** `UserMenu`.

### 10. EnhancedFooter (`footer-enhanced.tsx`)
- **File name and size:** `footer-enhanced.tsx` (~6KB)
- **Purpose:** Full site footer with navigation links, contact info, and social icons.
- **Props interface:** None
- **Key state:** None
- **User interactions:** Link clicks.
- **Animation patterns:** Hover effects on links and icons.
- **Dependencies:** None.

### 11. BounceCardsFeatures (`bounce-card-features.tsx`)
- **File name and size:** `bounce-card-features.tsx` (~9KB)
- **Purpose:** Displays service cards with bouncy hover animations.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `features` | `FeatureData[]`| Data for the cards |
- **Key state:** `hoveredCardId`
- **User interactions:** Mouse hover.
- **Animation patterns:** Bouncy scaling on hover.
- **Dependencies:** `framer-motion`.

### 12. ScrollProgress (`scroll-progress.tsx`)
- **File name and size:** `scroll-progress.tsx` (~2KB)
- **Purpose:** Top progress bar indicating scroll depth.
- **Props interface:** None
- **Key state:** `scrollPercentage`
- **User interactions:** None
- **Animation patterns:** Width expansion based on scroll percentage.
- **Dependencies:** Framer Motion `useScroll`.

### 13. SectionHeader (`section-header.tsx`)
- **File name and size:** `section-header.tsx` (~3KB)
- **Purpose:** Standard, reusable header for landing page sections.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `title` | `string` | Section title |
  | `subtitle` | `string` | Optional subtitle |
- **Key state:** None
- **User interactions:** None
- **Animation patterns:** Fade-in on scroll into view.
- **Dependencies:** `framer-motion`.

### 14. SectionHeaderEnhanced (`section-header-enhanced.tsx`)
- **File name and size:** `section-header-enhanced.tsx` (~4KB)
- **Purpose:** Enhanced section header with badge, word coloring, and stylized layout.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `badge` | `string` | Top badge text |
  | `title` | `string` | Main title |
  | `highlightWords`| `string[]` | Words to colorize in title |
- **Key state:** None
- **User interactions:** None
- **Animation patterns:** Staggered text fade-up.
- **Dependencies:** `framer-motion`.

### 15. SocialProofBar (`social-proof-bar.tsx`)
- **File name and size:** `social-proof-bar.tsx` (~5KB)
- **Purpose:** Animated stat counters displaying trust metrics.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `stats` | `StatData[]` | Array of statistics to display |
- **Key state:** `hasViewed`
- **User interactions:** None
- **Animation patterns:** Number counting animation when scrolled into view.
- **Dependencies:** `framer-motion`, `react-countup`.

---

## Section Components (`src/components/sections/`)

### 1. HeroSection
- **Purpose:** Main hero with video background, particle animations, and primary CTA buttons.
- **Props interface:** `onBookClick: () => void`, `heroVideoRef: RefObject<HTMLVideoElement>`

### 2. WhyChooseUsSection
- **Purpose:** Displays philosophy cards, stat counters, and a secondary CTA banner.
- **Props interface:** `onBookClick: () => void`

### 3. ServicesSection
- **Purpose:** Wrapper section for the `BounceCardsFeatures` displaying grooming services.
- **Props interface:** `onBookClick: () => void`

### 4. ReviewsSection
- **Purpose:** Split layout showing a photo collage and user testimonials.
- **Props interface:** None

### 5. BookingSection
- **Purpose:** Shows location info, map, and a large booking CTA card.
- **Props interface:** `onBookClick: () => void`

### 6. AdminDashboard
- **Purpose:** Admin-gated view for managing bookings and switching to content editing.
- **Props interface:** None

### 7. ContentEditor
- **Purpose:** 15-tab CMS editor that manages all dynamic site content.
- **Props interface:** None

### 8. ProfilePage
- **Purpose:** Dashboard for users to perform CRUD operations on their pets.
- **Props interface:** None

### 9. StorePage
- **Purpose:** Full product catalog displaying grooming supplies for sale.
- **Props interface:** None

### 10. StoreSection
- **Purpose:** Home page store teaser, displaying featured products.
- **Props interface:** None

### 11. BlogSection
- **Purpose:** Displays recent blog post cards.
- **Props interface:** None

### 12. FAQSection
- **Purpose:** Accordion-style Frequently Asked Questions.
- **Props interface:** None

### 13. GallerySection
- **Purpose:** Dual-row marquee gallery of grooming results.
- **Props interface:** None

### 14. ProcessSection
- **Purpose:** Timeline/Step-by-step display of the grooming process.
- **Props interface:** None

### 15. TeamSection
- **Purpose:** Staff profiles with avatars and bios.
- **Props interface:** None

---

## Error Boundaries

### 1. ErrorBoundary (`ErrorBoundary.tsx`)
- **Purpose:** Top-level error catcher. Catches unhandled React rendering errors and displays a fallback UI with a retry mechanism.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `children` | `ReactNode` | Wrapped components |

### 2. SessionErrorBoundary (`SessionErrorBoundary.tsx`)
- **Purpose:** Specific handler for JWT/authentication errors, showing a sign-in recovery UI when sessions expire or fail.
- **Props interface:**
  | Prop | Type | Description |
  |------|------|-------------|
  | `children` | `ReactNode` | Wrapped authenticated components |
