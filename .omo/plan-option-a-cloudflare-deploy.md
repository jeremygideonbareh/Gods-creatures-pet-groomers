# Plan: Switch to Cloudflare Pages Build + Deploy (Option A)

## Motivation
GitHub Actions workflow still deploys to wrong Cloudflare account (`86822...`). 
Switch to Cloudflare Pages building directly from the fork (`vivecablah-debug/...`) which uses the correct account (`bc830...`).

## Steps

### Step 1: Remove `.github/workflows/deploy.yml`
Delete the entire workflow file — Cloudflare Pages will handle both building AND deploying.
This stops the duplicate/wrong-account deploy.

### Step 2: Set Cloudflare Pages build configuration
On the Cloudflare Pages connect screen (`vivecablah-debug/Gods-creatures-pet-groomers`):
- **Framework preset**: `Vite`
- **Build output directory**: `/dist`
- **Root directory**: *(leave empty)*

### Step 3: Set environment variables in Cloudflare Pages dashboard
In Cloudflare Pages → `gods-creatures-pet-groomers` → Settings → Environment variables → **Production**:
| Variable | Value |
|----------|-------|
| `VITE_NHOST_SUBDOMAIN` | *(from GitHub secrets)* |
| `VITE_NHOST_REGION` | *(from GitHub secrets)* |
| `VITE_ADMIN_EMAIL` | *(from GitHub secrets)* |
| `VITE_RAZORPAY_KEY_ID` | *(from GitHub secrets)* |

Without these, the Vite build on Cloudflare will fail or produce incomplete output.

### Step 4: Commit & push
```bash
git rm .github/workflows/deploy.yml
git commit -m "chore: switch to Cloudflare Pages native build & deploy"
git push origin main
```

### Step 5: Verify
1. Wait for auto-sync to fork + Cloudflare build (~2-3 min)
2. Check Cloudflare Pages dashboard for build status
3. Visit https://godscreaturespet.in to confirm site loads correctly

## Risks
- Cloudflare build will fail if VITE_* env vars aren't set first (Step 3 before Step 4)
- Build output may differ slightly between GitHub Actions and Cloudflare (same Vite version)
- If vars are wrong, Cloudflare might deploy broken site — set them carefully
