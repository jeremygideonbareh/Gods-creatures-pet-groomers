# Development History — Gods Creatures Pet Groomers

## Timeline Summary

| Session | Date | Phase | Key Deliverables |
|---------|------|-------|------------------|
| 1-4 | Jun 8, 2026 | Foundation | Supabase→Nhost migration, booking modal, error handling, Cloudflare Pages |
| 5 | Jun 9 | UX | Removed snap-scroll, added IntersectionObserver fade-in |
| 6 | Jun 9 | Auth | Booking auth flow, pet collection during signup |
| 7 | Jun 9 | CMS | SiteContentContext, ContentEditor, nhost-setup.sql |
| 8 | Jun 9 | Quality | GraphQL centralization, admin button, build verification |
| 9 | Jun 9 | Code Quality | Section extraction, strict TypeScript, ErrorBoundary, CSP, accessibility |
| 10 | Jun 10 | CMS | ImageDropzone, array management in ContentEditor |
| 11 | Jun 10 | Pricing | PRICING_MENU, booking calculator, CMS pricing tab |
| 12 | Jun 11 | Bug Fixes | Pet size selector, manual size, date picker, crash-safe arrays |
| 13 | Jun 11 | Hasura | Hasura CLI metadata project, role-based permissions |
| 14 | Jun 11 | Permissions | Metadata apply, admin role fix, Apollo auth role link |
| 15 | Jun 11 | Security | Full codebase review (3 agents), 20 issues found |
| 16 | Jun 11 | Fix | All CRITICAL/HIGH issues fixed, verified by re-review |
| 17 | Jun 11 | Multi-Admin | Auth users tracking, multi-admin email support, Cloudflare deploy |
| 18 | Jun 12 | Email | Email receipt pipeline fix, frontend trigger, TS fix |
| 19 | Jun 15 | Cleanup | Metadata inconsistency fix, isAdmin() helper |
| 20 | Jul 7 | Reliability | Session error handling, double-booking prevention, test infrastructure |
| 21 | Jul 15 | Payments | Razorpay integration, deployment pipeline fix |

## Phase Details

### Phase 1: Supabase → Nhost Migration (Session 1-4)
- Installed @nhost/nhost-js v4 (deprecated React packages incompatible with React 19)
- Created nhost.ts with createClient()
- Installed Apollo Client v4 (different import paths from v3)
- Updated main.tsx with ApolloProvider + custom auth link
- Deleted old supabase.ts
- Updated booking-modal.tsx with useMutation
- Added real UPI reference input (replacing auto-generated transaction_id)
- Added duplicate transaction detection
- Migrated from GitHub Pages to Cloudflare Pages (changed vite base to '/')

### Phase 2: Code Quality & Architecture (Session 5, 8-9)
- Removed snap-scroll, added normal scroll + IntersectionObserver fade-in
- Extracted 5 sections into separate components
- Created site-content.ts centralizing all content
- Enabled strict TypeScript
- Created ErrorBoundary
- Added CSP, modal accessibility, input maxLength
- Centralized GraphQL in graphql.ts
- Added conditional admin panel button

### Phase 3: Auth & Pet System (Session 6)
- Booking requires login (auth gate)
- Pet details during signup in AuthModal
- AddPetModal after sign-in when 0 pets

### Phase 4: CMS System (Session 7, 10)
- Created SiteContentContext with Hasura fetch + updateSection
- Created ContentEditor with 6 tabs (later expanded to 15)
- Created nhost-setup.sql with schema + RLS + seeds
- Created ImageDropzone with Nhost storage integration
- Array management (add/delete cards, services, testimonials)

### Phase 5: Pricing Overhaul (Session 11)
- Created PRICING_MENU with 5 service tiers × 4 sizes
- Auto pet size detection from weight
- Package picker + add-on checkboxes
- Live price breakdown widget
- Updated booking contact info (Malki, Shillong)

### Phase 6: Hasura Permissions (Session 13-14)
- Created hasura/ directory with CLI metadata project
- Defined user/admin/public role permissions
- Applied metadata via hasura metadata apply
- Added x-hasura-role header in Apollo auth link
- Removed user relationship from bookings (auth.users not tracked)

### Phase 7: Security Review & Fixes (Session 15-16)
- Three-agent review: code, security, database
- 6 CRITICAL, 7 HIGH, 8 MEDIUM, 6 LOW issues found
- All CRITICAL/HIGH fixed: column names, parseInt UUID, HTML escaping, indexes, constraints
- Database schema made fully idempotent

### Phase 8: Admin & Deployment (Session 17)
- Auth users GraphQL customization for Nhost Dashboard
- Multi-admin email support (comma-separated VITE_ADMIN_EMAIL)
- Cloudflare Pages deployment via wrangler CLI
- Security verification (no secrets in tracked files)

### Phase 9: Reliability (Session 18-20)
- Email receipt pipeline fixes and testing
- isAdmin() helper (case-insensitive, null-safe)
- Session error handling (JWT expiry detection)
- Double-booking prevention (frontend + backend + DB index)
- Test infrastructure (Vitest, 11 tests)

### Phase 10: Payment Integration (Session 21)
- Razorpay integration (order creation, verification, webhooks)
- Deployment pipeline fix (wrangler.toml, deploy.yml)
- README and package.json cleanup
- docs/env-vars.md and .env.example created

## Migration History
- **Supabase → Nhost**: Auth + database migrated (June 8)
- **GitHub Pages → Cloudflare Pages**: Frontend hosting migrated (June 8)
- **@nhost/react → @nhost/nhost-js**: React packages removed for v4 SDK (June 8)
- **Apollo Client v3 → v4**: Import paths updated (June 8)
- **Snap-scroll → Normal scroll**: UX improvement (June 9)
- **Single admin email → Array**: Multi-admin support (June 11)
- **SQL RLS → Hasura metadata**: Permission system upgrade (June 11)
