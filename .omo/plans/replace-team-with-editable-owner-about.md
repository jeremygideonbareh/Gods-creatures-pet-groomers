# Plan — Replace Team section with editable Owner About section

## TL;DR (For humans)
Remove the two vet profiles (Team vets: Dr. Kakoty, Dr. Warjri) from the Gods Creatures homepage entirely, and replace that section with an **editable owner profile block** — owner photo (with a styled placeholder until one is uploaded) + name + role + free-form About Me bio text — all editable from the admin panel (the old "Team" admin tab becomes "About"; the existing Nhost-storage image uploader is reused for the photo). The navbar's "Team" item becomes **"About"**, and the pre-existing "About" nav item (which pointed at Why Choose Us) is relabeled **"Why Us"** so the nav never shows two identical "About" labels.

## Scope
### Explicitly in scope
- Data layer: replace `TeamMember`/`TeamContent` types with a single `AboutContent { heading, subtitle, ownerName, ownerRole, ownerBio, ownerImage }` in `src/lib/content-service.ts`.
- Defaults: remove the `teamMembers` array (both vet profiles) from `src/config/site-content.ts`; export `about` default (empty image → placeholder behavior).
- Context: update `src/context/SiteContentContext.tsx` — `DEFAULTS` + `SECTION_KEY_MAP` use the renamed `about` field; DB section key string stays `"team"` (same repurposed `site_content` row, per interview decision 5 — no orphan data).
- Section component `src/components/sections/TeamSection.tsx` → renamed file `AboutSection.tsx` rendering one owner block (photo or placeholder, name, role, bio paragraphs split on `\n\n`), keeping the section `id="team"` (scroll-spy compatibility) and the existing editorial style / brand background (`#f5f0e8`).
- Nav `src/components/ui/animated-scroll.tsx`: NAV_ITEMS — `{ id: "team", label: "Team" }` → `{ id: "team", label: "About" }`; `{ id: "why-choose-us", label: "About" }` → `{ id: "why-choose-us", label: "Why Us" }`; render/import `<AboutSection />` in place of `<TeamSection />`.
- Admin `src/components/sections/ContentEditor.tsx`: relabel tab "Team" → "About"; replace `teamForm` with `aboutForm { heading, subtitle, ownerName, ownerRole, ownerBio, ownerImage }`; photo input via the existing `<ImageDropzone>` (Nhost storage bucket `cms-images`, same as hero/blog images); remove the `TeamMemberEditor` component block and the "Add member" button.
- DB hygiene: clear any stale `site_content` row for `section='team'` via Hasura GraphQL (guarded SELECT → DELETE → SELECT), so old "Our Recommended Vets" content cannot leak through the defaults-merge.
- Build verification: `npm run build` (tsc + vite) passes; live browser QA of placeholder, admin upload flow, and nav labels.

### Explicitly out of scope
- No changes to any other section (Hero, Why Choose Us, Gallery, Services, Reviews, Blog, Store, Footer, Contact).
- No new auth/schema/migration surface; no component-library additions; no new admin tab (tab is repurposed, not added).
- No changes to deployment pipeline, Nhost dashboard config, or the `cms-images` storage bucket.

## Verification strategy
Verification class 2 (adversarial question formulation applied per change; **verification is sound-falsifying** — each step below tries to *break* the previous claim):

- **Type-safety gate:** `npm run build` executes `tsc -b && vite build`. The `team`→`about` rename is caught by the compiler across `content-service.ts`, `site-content.ts`, `SiteContentContext.tsx`, `AboutSection.tsx`, `animated-scroll.tsx`, `ContentEditor.tsx`. Any missed rename → build failure → fix, not bypass.
- **Static grep checks (all must return no matches after refactor):**
  - `TeamMember` (interface gone; bare `teamMembers` gone) — pattern `TeamMember|teamMembers`
  - Vet names/headline must not exist anywhere in `src/` — patterns `Kakoty|Warjri|Recommended Vets`
  - Nav collision gone: exactly one `label: "About"` and one `label: "Why Us"` in `animated-scroll.tsx`
  - `TeamSection` gone — pattern `TeamSection` should yield no source references (file renamed)
- **Falsification of "placeholder renders":** with `ownerImage: ""` in defaults, homepage About block must render the styled placeholder box — no broken `<img>` tag, no crash. Tested live via browser.
- **Falsification of "admin save works end-to-end":** admin → About tab → upload a real test photo through ImageDropzone → Save → revisit homepage → photo + name + role + bio (line breaks rendered as paragraphs) appear. Also verify a whitespace-only bio and empty name do not crash the render.
- **Falsification of "stale DB row can't leak":** after DB hygiene step, `SELECT content FROM site_content WHERE section='team'` returns no row (or `{}`); homepage shows the *new* default heading ("Meet the Owner" default), never the old "Our Recommended Vets" text.
- **Regression guard:** Home, Gallery, Services, Reviews, Blog, Store nav items still scroll to their sections; Why Choose Us still renders under its new "Why Us" label.

Verification happens at: variant live-deploy (Cloudflare Pages, `main`) with the browser; plus the local build gate before commit.

## Execution strategy
Execute in the order defined below (bottom-up: types → defaults → context → section → nav → admin → DB → build → QA). Deviating from this order risks cascading rename rework; the compiler enforces most of it, the live QA enforces the rest.

### Worktree
No worktree required. This project uses a direct-to-`main` solo deploy workflow (Cloudflare Pages auto-deploy; commit history is linear on `main`), and the change is single-atomic-scope. Commit once, atomically, on `main`.

### Todos
1. `src/lib/content-service.ts` — Replace `TeamMember` + `TeamContent` interfaces with `AboutContent { heading; subtitle; ownerName; ownerRole; ownerBio; ownerImage }`; update `SiteContent["team"]` → `SiteContent["about"]`; keep `SectionKey "team"`; update `SECTION_MAP` → `team: "about"`; remove member-related deep-merge logic in `mapDbToSiteContent`. Expect: clean rename, no leftover `TeamMember` refs.
2. `src/config/site-content.ts` — Delete `teamMembers` array (lines ~209-226); replace the `team` export (lines ~351-356) with `about: AboutContent` → `{ heading: "Meet the Owner", subtitle: "", ownerName: "", ownerRole: "", ownerBio: "", ownerImage: "" }`. Expect: `npm run build` still passes.
3. `src/context/SiteContentContext.tsx` — `DEFAULTS`: `team` → `about` (import `about` default); `SECTION_KEY_MAP`: `team: "team"` → `team: "about"` (verify exact current shape in file); update any `TeamContent` type references. Expect: build passes.
4. `src/components/sections/TeamSection.tsx` → rename to `AboutSection.tsx` (git mv, keep `id="team"` on the `<section>`, keep editorial `bg-[#f5f0e8]` styling). Render: heading + subtitle; then owner block — if `ownerImage` truthy → styled `<img>` (rounded, aspect-square/object-cover); else placeholder box (brand-neutral, e.g. `bg-black/5` rounded block with a centered "Owner photo coming soon" note); then ownerName (`h3`/article-style), ownerRole (muted small), ownerBio split on `/\n\s*\n/` into `<p>`s. Adapt the existing `image-gallery`/article-block layout classes already used in the old section. Expect: no references to `members`, `mapLink`, vet emoji.
5. `src/components/ui/animated-scroll.tsx` — Update imports: `<AboutSection />` replaces `<TeamSection />` (and NAV render); NAV_ITEMS: team → `{ id: "team", label: "About" }`, why-choose-us → `{ id: "why-choose-us", label: "Why Us" }`. Expect: exactly one `label: "About"` in the nav; build passes.
6. `src/components/sections/ContentEditor.tsx` — TABS: `{ key: "team", label: "Team" }` → `{ key: "team", label: "About" }`; `teamForm` → `aboutForm` with the five new fields; About tab panel renders: heading input, subtitle input, ownerName input, ownerRole input, ownerBio textarea (hint: "Use a blank line between paragraphs"), ownerImage via `<ImageDropzone label="Owner photo" value={aboutForm.ownerImage} onChange={...} />` (ImageDropzone already imported at top of file — confirm and reuse; it uploads to `cms-images`). Delete the `TeamMemberEditor` function block (lines ~1003-1033) and the "Add member" button; prune now-unused imports (verify Trash2/Plus still used elsewhere before removing). Expect: build passes; old vet fields unreachable.
7. **DB hygiene via Hasura GraphQL** — Guarded: `SELECT section, content FROM site_content WHERE section='team'` → if a row exists with content containing `members`, `DELETE FROM site_content WHERE section='team'` → re-SELECT to confirm empty. Use `curl` to `https://ukuqslqvwovrukooziwf.hasura.ap-south-1.nhost.run/v1/graphql` with header `x-hasura-admin-secret: admin12345` and a `delete_site_content(where: {section: {_eq: "team"}})` mutation. If no row exists, skip (record "no stale row"). Expect: no "Recommended Vets" text can leak.
8. **Build + static QA gate** — `npm run build` exit 0; grep checks from Verification strategy (TeamMember, Kakoty|Warjri|Recommended Vets, single About label, TeamSection).
9. **Live QA (browser)** — Deploy from `main`; verify: About section placeholder visible on homepage; nav labels correct ("About" + "Why Us", no duplicate); Why Choose Us section unaffected. Then admin login → About tab → upload a real image → save → homepage shows photo/name/role/bio with paragraph breaks. Negative tests: empty bio / whitespace-only bio do not crash; nav scroll still functional for all items.

## Final verification wave
- `npm run build` exit 0 on a clean tree (no `--no-verify`, no skipped tsc).
- All static grep checks pass (no `TeamMember`, `teamMembers`, `Kakoty`, `Warjri`, `Recommended Vets`, `TeamSection` anywhere in `src/`).
- Browser-confirmed: placeholder renders pre-upload; uploaded photo + text renders post-admin-save; nav shows exactly one "About" and one "Why Us"; no duplicate labels; other sections render and scroll.
- DB row `section='team'` confirmed empty/deleted; homepage shows "Meet the Owner" default heading.
- Evidence: build log + screenshot of About section (placeholder and post-upload states) recorded in commit summary.

## Commit strategy
Single conventional commit on `main`, per project AGENTS.md format:
`feat(about): replace Team section with editable owner About section`
Commit includes: renamed section component, nav label changes ("About" + "Why Us"), admin tab repurpose, type/default updates, and (data-only) the confirmed DB hygiene note in the PR/commit body. One atomic commit; no partial commits; push triggers Cloudflare Pages deploy which performs the live QA.

## Success criteria
1. Homepage contains **zero** references to the two vets and zero vet cards — grep-verified and browser-verified.
2. Homepage About section renders: owner photo (or styled placeholder when empty), owner name, owner role, About Me bio with paragraph breaks.
3. Admin panel "About" tab (formerly "Team") lets the owner edit all five fields end-to-end, including photo upload through the existing Nhost-storage ImageDropzone; saving updates the live homepage.
4. Navbar shows exactly one "About" (owner section) and one "Why Us" (previous About/why-choose-us section); no duplicate labels; all scroll links work.
5. `npm run build` passes (tsc strict); no dead references; no other section regressed.
6. Stale DB row cannot reintroduce "Our Recommended Vets"; a fresh reader of the homepage sees only the new owner content.