# Security — Gods Creatures Pet Groomers

## Security Architecture Overview
Multi-layered security spanning frontend, API, database, and infrastructure.

## Authentication Layer
- **Provider**: Nhost v4 (@nhost/nhost-js) — email/password authentication
- **Token**: JWT with x-hasura-allowed-roles, x-hasura-default-role claims
- **Session**: Managed by Nhost client-side middleware with auto-refresh
- **Validation**: isSessionValid() checks JWT exp claim via base64 decoding
- **Error Handling**: SessionErrorBoundary catches 401/JWT errors, shows recovery UI

## Authorization Layer

### Client-Side (Frontend)
- `isAdmin(email)` — case-insensitive, null-safe admin email check
- Admin Panel button hidden for non-admin users
- AdminDashboard shows "Access Denied" for non-admins
- ProfilePage redirects to / if not authenticated

### API Layer (Apollo Client)
- Apollo auth link attaches x-hasura-role header on every request
- Admin emails → x-hasura-role: admin
- Regular users → x-hasura-role: user
- No token → no auth headers (public queries)

### Database Layer (Hasura)
- **user role**: SELECT/INSERT own bookings and pets (filtered by user_id = X-Hasura-User-Id)
- **public role**: SELECT all site_content (unauthenticated)
- **admin role**: Built-in Hasura admin bypass (when JWT includes admin in allowed-roles)
- user_id auto-preset on INSERT via Hasura permissions

### SQL RLS Policies (Backup Layer)
- pets: insert_own, select_own, update_own (filtered by current_user_uuid())
- bookings: insert_own, select_own
- Note: RLS is currently a secondary defense; Hasura metadata permissions are primary

## Input Validation

### Frontend
| Input | Validation | Location |
|-------|-----------|----------|
| Email | /^[^\s@]+@[^\s@]+\.[^\s@]+$/ | booking-modal.tsx |
| Phone | /^\+?\d{7,15}$/ | booking-modal.tsx |
| Date | min=today, required | booking-modal.tsx |
| Package | Required selection | booking-modal.tsx |
| Transaction ID | UNIQUE constraint | Hasura |
| All inputs | maxLength attribute | All forms |
| Password | Show/hide toggle | AuthModal.tsx |

### Backend
- Nhost functions validate required fields before processing
- JWT verification on authenticated endpoints (RS256/HS256)
- Booking conflict check before insert

## Payment Security

### Webhook Verification
- **Cashfree**: HMAC-SHA256 Base64 digest of timestamp+body using CASHFREE_SECRET_KEY
- **Razorpay**: HMAC-SHA256 hex digest of body using RAZORPAY_WEBHOOK_SECRET
- Both use crypto.timingSafeEqual for constant-time comparison (prevents timing attacks)

### Razorpay Checkout Verification
- Client sends razorpay_order_id, razorpay_payment_id, razorpay_signature
- Server computes expected HMAC-SHA256 and compares

### Cashfree Confirmation
- Server-to-server verification via Cashfree API GET /orders/{id}/payments
- Does NOT rely on client-side callbacks alone

## Content Security Policy (CSP)
Meta tag in index.html:
- script-src: 'self', Cashfree SDK, Cloudflare Insights
- style-src: 'self', 'unsafe-inline' (needed for Tailwind), Google Fonts
- img-src: 'self', Unsplash, data:, blob:
- connect-src: 'self', *.nhost.run, Cashfree API
- form-action & frame-src: Cashfree payment domains

## XSS Prevention
- React's default JSX escaping for all rendered content
- HTML escaping function (escapeHtml()) in email templates
- CSP restricts inline scripts

## Secret Management
| Secret | Storage | Notes |
|--------|---------|-------|
| .env | Local, gitignored | VITE_ vars |
| hasura/config.yaml | Local, gitignored | Admin secret |
| CLOUDFLARE_API_TOKEN | GitHub Secrets | Rolled after exposure |
| RAZORPAY_KEY_SECRET | Nhost Dashboard | Server-side only |
| CASHFREE_SECRET_KEY | Nhost Dashboard | Server-side only |
| RESEND_API_KEY | Nhost Dashboard | Server-side only |
| HASURA_GRAPHQL_ADMIN_SECRET | Nhost Dashboard | admin12345 |

## Known Security Gaps
| Gap | Risk Level | Description | Mitigation |
|-----|-----------|-------------|------------|
| Admin JWT claims | Medium | Nhost doesn't auto-assign 'admin' role | isAdmin() frontend gating + x-hasura-role header |
| RLS still active | Low | Dual defense (RLS + Hasura permissions) | Consider disabling RLS to avoid conflicts |
| No rate limiting | Medium | No rate limiting on auth/booking endpoints | Cloudflare rate limiting (future) |
| CSP unsafe-inline styles | Low | Required for Tailwind CSS | Acceptable trade-off |
| Hardcoded admin email | Low | cloudlyconfusing@gmail.com in client bundle | By design — always-accessible fallback admin |
| No audit logging | Low | No tracking of who modified site_content | Future enhancement |

## Security Audit History
Session 15 conducted full security review (code-reviewer, security-reviewer, database-reviewer agents). Session 16 fixed all CRITICAL and HIGH findings:
- Fixed wrong mutation column names in AddPetModal
- Removed parseInt on UUID pet_id
- Added global Apollo ErrorLink
- Added HTML escaping in email templates
- Made nhost-setup.sql fully idempotent
- Added database indexes
- Added CHECK constraint on booking status
- Added updated_at trigger for site_content
- Fixed current_user_id() to return UUID
