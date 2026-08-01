# Authentication System — Gods Creatures Pet Groomers

## Overview
Nhost v4 SDK (@nhost/nhost-js) for email/password authentication with JWT-based sessions. No deprecated React packages.

## Nhost Client Setup (src/lib/nhost.ts)
- createClient() with subdomain + region from env vars
- Exports: nhost, NHOST_GRAPHQL_URL, NHOST_FUNCTIONS_URL, isSessionValid()
- isSessionValid() decodes JWT base64 payload and checks exp claim

## AuthContext (src/context/AuthContext.tsx)
- Reads initial session via nhost.getUserSession()
- Validates token freshness via isSessionValid()
- Subscribes to session changes via nhost.sessionStorage.onChange()
- Exposes: { user: { id, email, displayName } | null, loading: boolean, sessionError: boolean }

## Auth Flows

### Sign In
1. User clicks "Sign In" in UserMenu
2. AuthModal opens in "signin" mode
3. User enters email + password
4. Calls nhost.auth.signInEmailPassword({ email, password })
5. On success: session stored, AuthContext updates, checks pet count
6. If 0 pets: AddPetModal opens
7. If booking intent was pending: BookingModal opens

### Sign Up
1. AuthModal in "signup" mode
2. User enters email + password + optional pet details
3. Calls nhost.auth.signUpEmailPassword({ email, password })
4. If pet name provided: calls CREATE_PET mutation
5. Shows success banner, switches to sign-in mode (email verification may be required)

### Password Reset
1. "Forgot password?" link in sign-in mode
2. AuthModal switches to "reset" mode
3. User enters email
4. Calls nhost.auth.sendPasswordResetEmail({ email })

### Sign Out
1. User clicks "Sign Out" in UserMenu dropdown
2. Calls nhost.auth.signOut({})
3. Navigates to /

## Admin Authorization

### isAdmin() Helper (src/config/site-content.ts)
```typescript
const raw = import.meta.env.VITE_ADMIN_EMAIL ?? "cloudlyconfusing@gmail.com";
const adminEmailList = raw.split(",").map((s: string) => s.trim().toLowerCase());
export const adminEmails = [...new Set([...adminEmailList, "cloudlyconfusing@gmail.com"])];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails.includes(email.toLowerCase());
}
```
- Case-insensitive, null-safe
- cloudlyconfusing@gmail.com always included as hardcoded fallback
- VITE_ADMIN_EMAIL supports comma-separated list

### Where Admin is Checked
1. main.tsx — Apollo auth link: sets x-hasura-role to 'admin' or 'user'
2. animated-scroll.tsx — Admin Panel button visibility
3. AdminDashboard.tsx — Access denied page for non-admins

## Apollo Auth Link (src/main.tsx)
- setContext runs before every GraphQL request
- Reads nhost.getUserSession() for JWT token
- Validates session via isSessionValid() — clears headers if expired
- Attaches Authorization: Bearer <token>
- Attaches x-hasura-role: admin|user based on isAdmin(email)

## Session Error Handling
- SessionErrorBoundary catches JWT/auth errors
- Shows "Session Expired" UI with Sign In Again button
- ErrorLink logs all GraphQL/network errors to console
- handleSessionExpired() clears auth session and redirects to /

## Error Code Mapping
Maps Nhost auth error codes to friendly messages:
- unverified-user → "Please verify your email..."
- invalid-email-password → "Invalid email or password"
- signup-disabled → "Sign up is currently disabled"
- user-already-exists → "An account with this email already exists"

## JWT Claims
- Nhost JWT includes x-hasura-allowed-roles and x-hasura-default-role
- Admin user needs 'admin' in allowed roles for Hasura to accept x-hasura-role: admin header
- Developer has roles: ["user", "anonymous", "me", "admin"]

## Known Issues
- Nhost doesn't automatically assign 'admin' role — needs manual config in Nhost Dashboard
- Admin role permissions were removed from Hasura metadata to prevent inconsistency errors
- Currently admin access is frontend-gated via isAdmin() + x-hasura-role header
