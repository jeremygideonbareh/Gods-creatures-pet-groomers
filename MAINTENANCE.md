# Gods Creatures Pet Groomers — Maintenance Agreement

## How Upgrades Work
- Developer pushes code changes to the GitHub `main` branch
- Cloudflare Pages auto-deploys within 1-2 minutes
- Client sees changes live — no action needed on their part

## Monitoring
- **Developer monitors:** Server errors, uptime, deployment failures, database health
- **Client monitors:** Content accuracy, booking inquiries, customer feedback
- **Tools:** Nhost Dashboard (backend), Cloudflare Dashboard (hosting)

## Billing
- Cloudflare Pages: Free tier (paid by developer)
- Nhost (Hasura/Auth/DB): Free tier (paid by developer)
- Any future custom domain: TBD

## Communication
- **Content changes:** Client emails developer with request → developer handles it
- **Bug/emergency:** Client contacts developer directly
- **Major upgrades:** Developer proposes, client approves, developer implements

## Emergency Response
- **Critical (site down):** Developer responds within 4 hours
- **Normal (bug/feature):** Developer responds within 2 business days
- **Content updates:** Client does via CMS (instant) or developer (within 1-2 business days)

## Developer Admin Access
- Developer email `cloudlyconfusing@gmail.com` is permanently hardcoded as admin in the source code
- Developer has Owner access to GitHub, Cloudflare, and Nhost
- This ensures the website can always be maintained even if passwords are lost
- Client admin: `vivecablah@gmail.com` (added via VITE_ADMIN_EMAIL)
