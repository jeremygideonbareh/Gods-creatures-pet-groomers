# Swap deploy.yml: VITE_RAZORPAY_KEY_ID → VITE_CASHFREE_MODE

**Plan ID:** `swap-razorpay-key-for-cashfree-mode`
**Created:** 2026-08-09
**Project:** Gods Creatures Pet Groomers — `react-app/` (Nhost + Cloudflare Pages)
**Repo:** `gods creatures website/react-app`
**Approval:** Requested directly by user ("go ahead and make the code-side fixes right now"). Implementation starts when user runs `/start-work` (planner mode restricts edits to `.omo/*.md`).

---

## 1. Objective

Make the CI build pass with the Cashfree payment switch, exactly as the user requested:

1. **`deploy.yml`: add `VITE_CASHFREE_MODE` secret** — the build step's `env:` block must wire `VITE_CASHFREE_MODE: ${{ secrets.VITE_CASHFREE_MODE }}`.
2. **`deploy.yml`: remove the dead Razorpay variable** — drop `VITE_RAZORPAY_KEY_ID: ${{ secrets.VITE_RAZORPAY_KEY_ID }}` (no `VITE_RAZORPAY` reference remains in `src/`; the checkout UI now uses Cashfree).

Everything else (Nhost Dashboard env vars, GitHub repo secrets, Cashfree account / KYC steps) is **manual, handled by the user** — out of scope here.

## 2. Grounding facts (verified this session)

| Fact | Evidence |
|---|---|
| Live code reads `VITE_CASHFREE_MODE` | `src/components/payment/CheckoutGate.tsx:76` → `window.Cashfree({ mode: import.meta.env.VITE_CASHFREE_MODE \|\| "sandbox" })` |
| No `VITE_RAZORPAY` usage left in frontend | grep of `src/` for `VITE_RAZORPAY` → 0 matches |
| `deploy.yml` currently wires only the dead Razorpay var | `.github/workflows/deploy.yml:32` → `VITE_RAZORPAY_KEY_ID: ${{ secrets.VITE_RAZORPAY_KEY_ID }}` (lines 28–32 are the env block) |
| `.env` already has `VITE_CASHFREE_MODE=sandbox` (line 5) and dead `VITE_RAZORPAY_KEY_ID` (line 4) | `.env` (gitignored) — optionally clean line 4 while here |
| `.env.example` still documents `# Razorpay` block (lines 9–10) | optional cleanup: remove dead Razorpay section, keep Cashfree (lines 12–14) |
| Nhost backend functions still reference Razorpay SDK | `functions/create-razorpay-order.ts`, `verify-razorpay-payment.ts`, `razorpay-webhook.ts`, `functions/package.json` (`razorpay@^2.9.4`) — **NOT in scope** (user only asked for deploy.yml code-side fix; backend payment functions are a separate workstream) |

## 3. Decisions

- **D1 — Scope = deploy.yml only** (as the user requested). No backend function changes, no Nhost metadata changes, no secret creation.
- **D2 — Single replace** in `deploy.yml`: `VITE_RAZORPAY_KEY_ID` line → `VITE_CASHFREE_MODE` line. Keep other 3 env lines untouched.
- **D3 — Optional non-blocking tidy-ups** (do only if user wants; not part of D1): remove dead `VITE_RAZORPAY_KEY_ID` from `.env` line 4; remove `# Razorpay` block from `.env.example`.

## 4. Execution step (single)

- [x] **1.** `.github/workflows/deploy.yml` — in the Build step `env:` block, replace:
  ```yaml
  VITE_RAZORPAY_KEY_ID: ${{ secrets.VITE_RAZORPAY_KEY_ID }}
  ```
  with:
  ```yaml
  VITE_CASHFREE_MODE: ${{ secrets.VITE_CASHFREE_MODE }}
  ```
  Verify the final env block reads:
  ```yaml
  env:
    VITE_NHOST_SUBDOMAIN: ${{ secrets.VITE_NHOST_SUBDOMAIN }}
    VITE_NHOST_REGION: ${{ secrets.VITE_NHOST_REGION }}
    VITE_ADMIN_EMAIL: ${{ secrets.VITE_ADMIN_EMAIL }}
    VITE_CASHFREE_MODE: ${{ secrets.VITE_CASHFREE_MODE }}
  ```

## 5. Acceptance criteria

- `.github/workflows/deploy.yml` contains `VITE_CASHFREE_MODE: ${{ secrets.VITE_CASHFREE_MODE }}` and **no** `RAZORPAY` token anywhere.
- YAML is valid (indentation matches sibling lines).
- No frontend file references `VITE_RAZORPAY_KEY_ID` anymore.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| GitHub Actions build fails because `VITE_CASHFREE_MODE` secret absent in repo secrets | Out of executor scope — user sets the GitHub repo secret (same name) manually before/with this PR; build gracefully falls back to "sandbox" default only if var missing via `\|\| "sandbox"`. |
| Backend Cashfree functions expect other secrets not yet set | Manual Nhost Dashboard step (user's list). Not touched here. |
| YAML breakage | Minimal 1-line swap, verified by reading after edit. |

## 7. User's manual checklist (reminder — NOT executed here)

- [ ] Nhost Dashboard → Environment Variables: set `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_API_URL` (and pick `sandbox`/`production` to match `VITE_CASHFREE_MODE`) — confirm the function names expected by `functions/*cashfree*` files.
- [ ] GitHub repo → Settings → Secrets and variables → Actions: add `VITE_CASHFREE_MODE` (+ any CashVirt backend secrets the deploy step may need).
- [ ] Handheld Cashfree account/KYC steps manually once approval comes through.

## 8. TODO checklist (executor ticks)

- [x] 1. Edit `deploy.yml` env block (swap Razorpay → CashSI)
- [x] 2. Re-read file to confirm valid YAML, no RAZORPAY tokens
- [x] 3. Report done (optional: suggest `.env`/`.env.example` cleanup)