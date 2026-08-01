# Content Management System — Gods Creatures Pet Groomers

## Overview
The app has a full database-backed CMS that allows admins to edit all website content from the Admin Dashboard → Content tab. Content is stored as JSONB in the `site_content` PostgreSQL table and fetched/updated via Hasura GraphQL.

## Architecture

### Data Flow
1. On app mount, `SiteContentProvider` fetches all `site_content` rows via Apollo Client
2. DB content is deep-merged over hardcoded defaults (from `site-content.ts`) via `mapDbToSiteContent()`
3. Components read content via `useSiteContent()` hook
4. Admin edits content in `ContentEditor` → calls `updateSection()` → `UPSERT_SITE_CONTENT` mutation
5. Local state updates optimistically

### SiteContentContext (src/context/SiteContentContext.tsx)
- Provider wraps all routes in `App.tsx`
- Fetches `GET_ALL_SITE_CONTENT` with `fetchPolicy: 'network-only'` on mount
- Exposes: `{ content: SiteContent, loading: boolean, updateSection(section, data) }`
- `updateSection()` calls `UPSERT_SITE_CONTENT` mutation (insert with `on_conflict`)

### Content Types (src/lib/content-service.ts)
- **HeroContent**: `{ title, subtitle, cta, video, poster }`
- **WhyChooseUsContent**: `{ heading, cards: Array<{icon, title, description}> }`
- **ServicesContent**: `{ heading, subtitle, items: Array<{id, label, icon, image, description}> }`
- **ReviewsContent**: `{ heading, testimonials: Array<{emoji, author, tag, text, textLong}>, images: string[] }`
- **BookingContent**: `{ heading, location, hours, phone, cta, subtitle, ctaIcon, locationIcon, hoursIcon, phoneIcon, modalTitle, modalSubtitle, bookingFeeLabel, bookingFeeDetail, proceedCta, questionsCta, formTitle, formSubtitle, advancePaymentTitle, advancePaymentDetail, upiTooltip, upiPlaceholder, submitLabel, submittingLabel, successEmoji, successTitle, successMessage }`
- **PageBackgroundsContent**: `{ whyChooseUs, reviews, booking }`
- **DesignTokensContent**: color values
- **PricingMenuContent**: `{ rules, basicServices, completePackages, addOnServices, weightCategories }`
- **SocialProofContent, GalleryContent, TeamContent, ProcessContent, FaqContent, BlogContent, StoreContent, StoreCatalogContent**

### Section Keys
All 15 section keys: `hero`, `why_choose_us`, `services`, `reviews`, `booking`, `page_backgrounds`, `pricing_menu`, `social_proof`, `gallery`, `team`, `process`, `faq`, `blog`, `store`, `store_catalog`

## ContentEditor (src/components/sections/ContentEditor.tsx)
The ContentEditor is a 62KB component with 15 tabs. Document each tab:

| Tab | Section Key | Editable Fields |
|-----|-------------|------------------|
| Hero | `hero` | title, subtitle, cta, video URL, poster (ImageDropzone) |
| Why Choose Us | `why_choose_us` | heading, cards (add/delete/edit: icon, title, description) |
| Social Proof | `social_proof` | stats (label, value, suffix) |
| Services | `services` | heading, subtitle, items (add/delete: id, label, icon, image via ImageDropzone, description) |
| Gallery | `gallery` | heading, subtitle, images (add/delete via ImageDropzone) |
| Reviews | `reviews` | heading, testimonials (add/delete: emoji, author, tag, text, textLong, avatar via ImageDropzone), images (add/delete) |
| Team | `team` | heading, subtitle, members (add/delete: name, role, bio, image via ImageDropzone, location) |
| Process | `process` | heading, subtitle, steps (add/delete: icon, title, description) |
| FAQ | `faq` | heading, subtitle, items (add/delete: question, answer) |
| Blog | `blog` | heading, subtitle, posts (add/delete: title, excerpt, category, date, image, readMoreUrl) |
| Store | `store` | heading, subtitle, highlights (add/delete: emoji, label) |
| Store Catalog | `store_catalog` | categories (add/delete: name, products with title, price, badge, emoji, image) |
| Booking | `booking` | All 21+ booking text fields |
| Backgrounds | `page_backgrounds` | whyChooseUs, reviews, booking URLs via ImageDropzone |
| Pricing & Policies | `pricing_menu` | Package prices per size, add-on prices, rules text |

## ImageDropzone Integration
- Drag-and-drop image upload to Nhost Storage (`cms-images` bucket)
- Used in: Hero poster, Service images, Testimonial avatars, Review gallery, Background URLs, Team member photos, Gallery images, Blog post images
- Constructs public URL: `https://{subdomain}.storage.{region}.nhost.run/v1/files/{fileId}`

## Pricing System
**PRICING_MENU structure:**
- **Weight categories**: Small (≤10kg), Medium (10-20kg), Large (20-35kg), XL (>35kg)
- **Basic Services (3)**: Bath+Brush+Nail+Ear (sized), Haircut/Styling (sized), Nail Trim+Ear (flat ₹500)
- **Complete Packages (2)**: Full Groom (sized), Full Spa (sized)
- **Add-On Services (4)**: Teeth Cleaning (flat ₹400), Flea & Tick (flat ₹500), De-shedding (sized), Spa Massage (sized)

## Hardcoded Defaults (src/config/site-content.ts)
Fallback content objects are used when the database hasn't been populated. The `mapDbToSiteContent()` function deep-merges the JSONB data from Hasura over these defaults to ensure the frontend always has valid data to render, even if the CMS is partially empty.
