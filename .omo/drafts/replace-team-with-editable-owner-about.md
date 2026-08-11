# Draft — Replace Team vets section with editable Owner About section

**Plan slug:** `replace-team-with-editable-owner-about`
**Project:** Gods Creatures Pet Groomers — `react-app/` (Nhost + Hasura + Cloudflare Pages)
**Created:** 2026-08-09

## Routing record
- `intent: CLEAR` (user explicitly asked to be interviewed → OVERRIDE: route CLEAR, interview run, adopt-default filter OFF)
- `review_required: false` (no review modifier requested)
- Classify: **Standard** (multi-file refactor of an existing frontend section + admin editor, no new module/auth/migration surface)

## Interview (5 forks — user answered all)
1. Replacement scope → **Owner photo + About Me only** (vets removed entirely from site)
2. Nav item → **Rename to "About"** ⚠️ collision discovered post-answer (see open fork below)
3. Owner photo → **Placeholder until user adds it**
4. Photo input in admin → **File upload to Nhost storage** (ImageDropzone already exists + wired into ContentEditor — reusable, uploads to bucket `cms-images`)
5. Admin tab → **Repurpose the "Team" tab into "About"** (same DB section key `team`, same saved row — swap form fields, no orphan data)

## Open fork — RESOLVED (user: "keep it as about")
The navbar already had an "About" item pointing at the `why-choose-us` section (`animated-scroll.tsx` line 34). User chose **"keep it as about"** → owner section nav becomes **"About"**, and to prevent duplicate labels the old About/why-choose-us nav item is relabeled **"Why Us"** (line 34 → `{ id: "why-choose-us", label: "Why Us" }`).

## Grounding facts (verified)
| Fact | Path |
|---|---|
| Team section component | `src/components/sections/TeamSection.tsx` — editorial article blocks, `id="team"`, bg `#f5f0e8`, renders `content.team.members` |
| Team rendered + nav item | `src/components/ui/animated-scroll.tsx` line 160 `<TeamSection/>`; NAV_ITEMS line 38 `{ id: "team", label: "Team" }` |
| Types | `src/lib/content-service.ts:156-169` — `TeamMember { name, role, bio, emoji, image, mapLink }`, `TeamContent { heading, subtitle, members[] }`; `SiteContent["team"]` line 254; `SectionKey "team"` line 273; `SECTION_MAP team→"team"` line 291 |
| Defaults | `src/config/site-content.ts:209-226` `teamMembers` (2 vets), `:351-356` `team` export ("Our Recommended Vets") |
| Context | `src/context/SiteContentContext.tsx` — `DEFAULTS.team` (line 40), `SECTION_KEY_MAP team→"team"` (line 119), `updateSection` merge (line 90-96) |
| Admin editor | `src/components/sections/ContentEditor.tsx` — TABS line 46 `{ key: "team", label: "Team" }`; `teamForm` line 101; team tab render 564-592; `TeamMemberEditor` 1003-1033 |
| Image upload | `src/components/ui/ImageDropzone.tsx` — Nhost storage upload to bucket `cms-images`, already used in ContentEditor (hero/why/services/reviews/gallery/blog/store) |
| Build/QA | `package.json` — `build: tsc -b && vite build` (type-checked, catches renamed-field breakage); no lint script; vitest/playwright devDeps present |
| DB content key | `site_content` table, section column; `UPSERT_SITE_CONTENT` maintains `site_content_section_key` — key `team` row kept (decision 5) |
| Hasura endpoint / admin secret | `https://ukuqslqvwovrukooziwf.hasura.ap-south-1.nhost.run` / `admin12345` (AGENTS.md) — usable for DB-row hygiene via curl |

## Decisions (locked from interview)
- D1 — Vets (Dr. Kakoty, Dr. Warjri) removed entirely: `teamMembers` default array gone, no mapLink.
- D2 — New shape = About content: `{ heading, subtitle, ownerName, ownerRole, ownerBio, ownerImage }`; DB section key stays `"team"` (same saved row, per decision 5). Internal field/key naming: keep `SectionKey "team"`; rename the SiteContent field + components to `about` (tsc-guarded).
- D3 — Owner photo: `ownerImage` default `""` → section renders styled placeholder box; uploaded via `ImageDropzone` (existing Nhost storage path) in admin.
- D4 — Admin tab relabeled "Team" → "About" with new fields; `TeamMemberEditor` + Add Member removed.
- D5 — Nav label set per open fork (pending user pick; recommendation "Owner").
- D6 — DB hygiene: clear old `team` row content (guarded GraphQL delete via Hasura admin) so stale "Our Recommended Vets" heading can't leak from merged row; verified by SELECT before/after.

## Approach summary (for brief)
Multi-file frontend refactor: (1) replace `TeamContent`/member types with `AboutContent` owner shape in `content-service.ts`; (2) replace `teamMembers`+`team` defaults with owner defaults (empty image → placeholder); (3) rename `TeamSection.tsx` → `AboutSection.tsx` rendering one owner block (photo-or-placeholder + name + role + bio paragraphs, `\n\n` split); (4) rewire `animated-scroll.tsx` import/render + nav label; (5) repurpose admin "Team" tab → "About" (heading/subtitle/ownerName/ownerRole/ownerBio/ImageDropzone photo); (6) clear stale DB row via Hasura GraphQL; (7) build + live browser QA (placeholder visible; admin upload+save → photo and text live; no vets anywhere).

## Status
`status: done` — approved by user ("keep it as about" nav decision + approval gate passed); final plan written to `.omo/plans/replace-team-with-editable-owner-about.md`
`review: final verification performed in-session` (Momus subagent unavailable — billing block; all load-bearing claims re-verified via grep at file level: nav collision lines 34/38, ImageDropzone import line 4 + 10 uses, TeamContent/TeamMember/vet names confined to the 3 planned files)