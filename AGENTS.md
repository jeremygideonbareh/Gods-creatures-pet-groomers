# Project Handoff — Gods Creatures Pet Groomers

## Goal
- Track `auth.users` in Hasura metadata with proper GraphQL name/column mappings so the Nhost Dashboard Auth → Users page works, and finalize all outstanding infrastructure steps.

## Constraints & Preferences
- Nhost auto-deploy does NOT apply Hasura metadata — it says `⊘ No metadata directory` even when `metadata/` exists at repo root with `nhost.toml` pointing to it
- Hasura CLI v2.42.0 on Windows is the only reliable way to apply metadata; must run from inside `hasura/` directory to avoid long-path truncation bugs
- `auth` schema tables when auto-tracked by Hasura get `auth_` prefix in GraphQL names (e.g. `auth_users`, `auth_roles`) — the Nhost Dashboard expects un-prefixed names like `users`, `authRoles`
- `column_config` (NOT `custom_column_names`) must be used for camelCase column mappings — the old `custom_column_names` format does NOT affect `order_by` type names
- All auth table array-relationships must be renamed to camelCase (`user_roles`→`roles`, `user_providers`→`userProviders`, `user_security_keys`→`userSecurityKeys`, `refresh_tokens`→`refreshTokens`)
- Nhost Dashboard queries are discovered iteratively — each fix surfaces the next broken query pattern
- Admin JWT claims ARE configured — `cloudlyconfusing@gmail.com` has `["user","anonymous","me","admin"]` in allowed roles

## Progress

### Done
- Moved `hasura/metadata/` → `metadata/` at repo root for Nhost compatibility (Nhost still skips it)
- Created `nhost.toml` pointing to `metadata/` — Nhost ignores it (looks for `nhost/nhost.toml`)
- Tracked entire `auth` schema via Hasura Console "Track All" — 15+ tables including `auth.users`, `auth.roles`, `auth.user_providers`, etc.
- Set `custom_name: users` on `auth.users` table so GraphQL types use `users_*` prefix instead of `auth_users_*`
- Set `custom_root_fields` on auth.users: `select: users`, `select_by_pk: user`, `select_aggregate: usersAggregate`, `update_by_pk: updateUser`, `delete_by_pk: deleteUser`, `insert: insertUsers`, `insert_one: insertUser`
- Set `column_config` on auth.users with all camelCase mappings (display_name→displayName, created_at→createdAt, avatar_url→avatarUrl, default_role→defaultRole, is_anonymous→isAnonymous, last_seen→lastSeen, phone_number→phoneNumber, email_verified→emailVerified, new_email→newEmail, locale→locale, phone_number_verified→phoneNumberVerified)
- Removed `custom_column_names` (old format) in favor of `column_config` — fixes `order_by` type names
- Renamed array relationships on auth.users: `user_roles`→`roles`, `user_providers`→`userProviders`, `user_security_keys`→`userSecurityKeys`, `refresh_tokens`→`refreshTokens`
- Set `custom_name: authRoles` + `custom_root_fields` on `auth.roles` table
- Set `custom_name: authUserProviders` + `column_config` for `provider_id`→`providerId` on `auth.user_providers` table
- Removed `booking.user?.email` dead code from AdminDashboard.tsx (line 174) and removed `user` field from Booking interface
- **Changed admin gating from single email to array (`adminEmails`)** — `VITE_ADMIN_EMAIL` env var now supports comma-separated list; code uses `adminEmails.includes(email)` instead of `email === adminEmail`
- **Set `.env` to `VITE_ADMIN_EMAIL=admin@godscreatures.com,cloudlyconfusing@gmail.com`**
- **Updated `main.tsx` x-hasura-role logic** to also use `adminEmails.includes(email)`
- Deployed to Cloudflare Pages with wrangler (after fixing API token + account ID issues)
- Added `account_id` to root `wrangler.toml`
- Ran `hasura metadata apply` multiple times with admin secret `admin12345`
- Ran `hasura metadata export` after each customization to sync local files
- All changes committed and pushed to GitHub `main`
- Hard-refreshed Nhost Dashboard Auth → Users page — loads with zero errors

### In Progress
- (none)

### Blocked
- Nhost auto-deploy will NOT apply metadata automatically — all metadata changes must be applied manually via `hasura metadata apply --project hasura` from `react-app/` directory (or from inside `react-app/hasura/`)
- Admin JWT claims are already configured — admin panel should now work

## Key Decisions
- Tracked ALL `auth` schema tables (not just `auth.users`) by clicking "Track All" in Hasura Console — needed because Nhost Dashboard queries multiple auth tables
- Used `column_config` instead of `custom_column_names` — the old format doesn't propagate camelCase names to `order_by` types, causing `field 'createdAt' not found in type: 'users_order_by'` errors
- Renamed relationships to camelCase directly in metadata YAML rather than re-creating them — faster iteration when the Dashboard surfaces each missing relationship one at a time
- Applied metadata via Hasura API (`pg_set_table_customization`) as well as CLI export/apply — API calls are faster for single-table changes; CLI applies bulk changes
- Left `nhost.toml` at repo root even though Nhost ignores it — harmless, and might be used in future Nhost versions
- Changed admin check from email equality to array includes to support multiple admin emails without env var changes

## Next Steps
1. Test admin dashboard — login as `cloudlyconfusing@gmail.com` → `/admin` → verify all bookings load and booking status updates work
2. Test CMS — `/admin` → Content tab → edit and save site content
3. Verify public unauthenticated access — incognito window → landing page loads with site_content
4. Verify authenticated user booking flow — register test account → book grooming → verify booking appears on ProfilePage
5. If Nhost auto-deploy ever needs to apply metadata in future, either: (a) add `nhost/nhost.toml` inside an `nhost/` directory, or (b) continue using `hasura metadata apply` manually
6. Consider connecting GitHub repo in Cloudflare Pages dashboard for auto-deploys (avoids needing local API token)

## Critical Context
- Hasura engine: `https://ukuqslqvwovrukooziwf.hasura.ap-south-1.nhost.run`
- Admin secret: `admin12345` (set as `$env:HASURA_GRAPHQL_ADMIN_SECRET`)
- Hasura CLI: `%TEMP%\hasura.exe` v2.42.0 — run from `react-app/hasura/` to avoid long-path truncation bugs
- Nhost Dashboard `auth` schema tracking state: fully tracked with custom names, root fields, column configs, and camelCase relationships
- SQL RLS was disabled: `ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;` (and pets, site_content) — Hasura role permissions (`x-hasura-role` header) are the gatekeeper instead
- `cloudlyconfusing@gmail.com` has allowed roles `["user","anonymous","me","admin"]` — JWT claims are set
- There are two user accounts: `cloudlyconfusing@gmail.com` (correct, with admin defaultRole) and `clouldyconfusing@gmail.com` (typo, with user defaultRole)
- Admin button gating now uses `adminEmails.includes(email)` — supports multiple emails via comma-separated `VITE_ADMIN_EMAIL`
- All metadata customization files committed and pushed: `metadata/databases/default/tables/auth_users.yaml`, `auth_roles.yaml`, `auth_user_providers.yaml`
- Nhost's `⊘ No metadata directory` behavior persists despite correct `nhost.toml` — metadata must be applied manually

## Security Notes
- `.env` is gitignored ✅
- `hasura/config.yaml` (admin secret) is gitignored ✅
- No secrets in tracked files ✅
- Cloudflare API token was rolled after accidental exposure ✅
- RLS remains disabled — acceptable with Hasura role layer for single-tenant app, but worth revisiting if app scales

## Relevant Files
- `metadata/` (repo root): Contains all Hasura metadata including auth schema tables with customizations — moved from `hasura/metadata/`
- `nhost.toml` (repo root): Points Nhost to `metadata/` — Nhost ignores it (looks for `nhost/nhost.toml`)
- `react-app/hasura/config.yaml`: Gitignored local config with `metadata_directory: ../metadata` and endpoint pointing to direct Hasura engine
- `react-app/hasura/config.yaml.example`: Tracked template with `{{HASURA_GRAPHQL_ADMIN_SECRET}}` placeholder
- `react-app/wrangler.toml`: Cloudflare Pages config with `account_id`
- `react-app/.env`: Contains `VITE_NHOST_SUBDOMAIN`, `VITE_NHOST_REGION`, `VITE_ADMIN_EMAIL` (gitignored)
- `metadata/databases/default/tables/auth_users.yaml`: Auth.users with `custom_name: users`, `column_config` for all camelCase mappings, `custom_root_fields` (select/select_by_pk/select_aggregate/update_by_pk/delete_by_pk/insert/insert_one), renamed relationships (roles, userProviders, userSecurityKeys, refreshTokens)
- `metadata/databases/default/tables/auth_roles.yaml`: Auth.roles with `custom_name: authRoles` and matching `custom_root_fields`
- `metadata/databases/default/tables/auth_user_providers.yaml`: Auth.user_providers with `custom_name: authUserProviders` and `column_config` for `provider_id→providerId`
- `src/config/site-content.ts`: Exports `adminEmails` array (was `adminEmail` string)
- `src/main.tsx`: Apollo authLink uses `adminEmails.includes(email)` for `x-hasura-role`
- `src/components/ui/animated-scroll.tsx`: Admin button gated by `adminEmails.includes(user.email)`
- `src/components/sections/AdminDashboard.tsx`: Admin dashboard gated by `adminEmails.includes(user.email)`
