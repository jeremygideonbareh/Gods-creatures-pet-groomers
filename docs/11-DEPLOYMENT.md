# Deployment & DevOps — Gods Creatures Pet Groomers

## Deployment Architecture
The app uses two deployment targets:
1. **Cloudflare Pages** — Frontend React SPA hosting
2. **Nhost** — Backend (Auth, Hasura GraphQL, Serverless Functions, PostgreSQL, Storage)

## Cloudflare Pages (Frontend)

### Automatic Deployment
- Connected via Cloudflare Git Integration to `jeremygideonbareh/Gods-creatures-pet-groomers`
- Auto-deploys on push to `main` branch
- Build settings:
  - Build command: `npm install && npm run build`
  - Build output: `dist`
  - Root directory: (blank — uses repo root)
- Live URL: https://godscreaturespet.in

### Manual Deployment (via wrangler CLI)
```bash
npm run build
npx wrangler pages deploy dist --project-name=gods-creatures-pet-groomers
```
Requires CLOUDFLARE_API_TOKEN env var.

### Environment Variables (Cloudflare Dashboard)
Set in Pages → Settings → Environment Variables:
| Variable | Description |
|----------|-------------|
| VITE_NHOST_SUBDOMAIN | Nhost project subdomain (ukuqslqvwovrukooziwf) |
| VITE_NHOST_REGION | Nhost region (ap-south-1) |
| VITE_ADMIN_EMAIL | Comma-separated admin emails |
| VITE_RAZORPAY_KEY_ID | Razorpay public key (if using Razorpay) |
| VITE_CASHFREE_MODE | sandbox or production |

### wrangler.toml
```toml
name = "gods-creatures-pet-groomers"
pages_build_output_dir = "react-app/dist"
account_id = "6450bfe26bbac5dbfa679d5af793705d"
```

## GitHub Actions CI/CD

### .github/workflows/deploy.yml
- Triggers on: push to main, manual workflow_dispatch
- Job: build-check on ubuntu-latest
- Steps: checkout → setup Node.js 22 → npm ci → npm run build
- Injects secrets: VITE_NHOST_SUBDOMAIN, VITE_NHOST_REGION, VITE_ADMIN_EMAIL, VITE_RAZORPAY_KEY_ID
- Purpose: Validates the build passes (Cloudflare Git Integration handles actual deployment)

### Required GitHub Secrets
| Secret | Description |
|--------|-------------|
| CLOUDFLARE_API_TOKEN | Cloudflare API token with Pages write |
| CLOUDFLARE_ACCOUNT_ID | Cloudflare account ID |
| VITE_NHOST_SUBDOMAIN | Nhost subdomain |
| VITE_NHOST_REGION | Nhost region |
| VITE_ADMIN_EMAIL | Admin emails |
| VITE_RAZORPAY_KEY_ID | Razorpay key |

## Nhost (Backend)

### Functions Deployment
- Functions in `functions/` and `nhost-functions/` auto-deploy on push via Nhost Git Integration
- Function URL pattern: https://{subdomain}.functions.{region}.nhost.run/v1/{function-name}

### Nhost Dashboard Environment Variables
| Variable | Purpose |
|----------|--------|
| CASHFREE_APP_ID | Cashfree App ID |
| CASHFREE_SECRET_KEY | Cashfree Secret Key |
| CASHFREE_API_URL | sandbox or production URL |
| RAZORPAY_KEY_ID | Razorpay server key |
| RAZORPAY_KEY_SECRET | Razorpay secret |
| RAZORPAY_WEBHOOK_SECRET | Webhook signature secret |
| RESEND_API_KEY | Resend email API key |
| RESEND_FROM_EMAIL | Sender email address |
| HASURA_GRAPHQL_ADMIN_SECRET | Hasura admin secret |

## Hasura Metadata

### Applying Metadata
```bash
cd react-app/hasura
$env:HASURA_GRAPHQL_ADMIN_SECRET="admin12345"
hasura metadata apply
hasura metadata export
```
- Uses Hasura CLI v2.42.0
- Must use direct Hasura engine endpoint (hasura.ap-south-1.nhost.run, NOT graphql.ap-south-1.nhost.run)
- config.yaml is gitignored; use config.yaml.example as template
- Nhost auto-deploy does NOT apply metadata — must be done manually

## Local Development
```bash
cd react-app
npm install
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # tsc -b && vite build → dist/
npm run preview      # Serve built dist/ locally
```

### Local .env File
```
VITE_NHOST_SUBDOMAIN=ukuqslqvwovrukooziwf
VITE_NHOST_REGION=ap-south-1
VITE_ADMIN_EMAIL=admin@godscreatures.com,cloudlyconfusing@gmail.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
VITE_CASHFREE_MODE=sandbox
```

## Rollback
```bash
git revert HEAD --no-edit
git push origin main
```
Cloudflare auto-deploys the reverted commit within 2-3 minutes.

## Vite Configuration
- base: '/' (critical for Cloudflare root deployment)
- Path alias: @ → ./src
- Plugins: react(), tailwindcss()
- esbuild charset: utf8

## Security Checklist
- [ ] .env is gitignored
- [ ] hasura/config.yaml is gitignored
- [ ] No secrets in tracked files
- [ ] Cloudflare API token rotated if exposed
- [ ] CSP meta tag in index.html
- [ ] VITE_ env vars are client-side (safe to expose subdomain/region)
