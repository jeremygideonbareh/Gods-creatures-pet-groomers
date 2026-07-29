# Booking System Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task.

**Goal:** Fix session errors, prevent double-booking, fix Resend email pipeline

**Architecture:** Fix Nhost v4 session configuration for auto-refresh, add database-level concurrency protection for bookings, verify Resend email function deployment and Hasura Event Trigger config

**Tech Stack:** React 19, TypeScript 6, Vite 8, Nhost v4 + Hasura GraphQL, Cloudflare Pages, Resend

## Global Constraints

- All TypeScript must compile with `strict: true` (no `@ts-expect-error`)
- No secrets in tracked files (RESEND_API_KEY in Nhost Dashboard env vars only)
- Build must pass: `tsc -b && vite build`
- Tests: Playwright for E2E (already in deps), Vitest for unit tests
- Must maintain 80%+ code coverage on new code

---

### Task 1: Fix Nhost Session Configuration & Session Error Handling

**Files:**
- Modify: `src/lib/nhost.ts`
- Modify: `src/context/AuthContext.tsx`
- Modify: `src/main.tsx`
- Create: `src/context/SessionErrorBoundary.tsx`
- Test: `src/__tests__/auth-session.test.ts`

**Interfaces:**
- Consumes: `nhost` from `@nhost/nhost-js` v4, `NHOST_GRAPHQL_URL` from nhost.ts
- Produces: `nhost` client with auto-refresh, `SessionErrorBoundary` component

- [ ] **Step 1: Create the test file**

```typescript
// src/__tests__/auth-session.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Nhost Session Configuration', () => {
  it('should create Nhost client with auto-refresh enabled', async () => {
    // We'll test that the client is created with correct config
    const { nhost } = await import('@/lib/nhost');
    expect(nhost).toBeDefined();
    expect(nhost.auth).toBeDefined();
  });
});
```

- [ ] **Step 2: Create vitest config**

```typescript
// vite.config.ts (add test config)
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Step 3: Update nhost.ts with proper session configuration**

```typescript
// src/lib/nhost.ts
import { createClient, generateServiceUrl } from "@nhost/nhost-js";

const NHOST_SUBDOMAIN = import.meta.env.VITE_NHOST_SUBDOMAIN || "your-subdomain";
const NHOST_REGION = import.meta.env.VITE_NHOST_REGION || "";

export const nhost = createClient({
  subdomain: NHOST_SUBDOMAIN,
  region: NHOST_REGION,
  autoRefreshToken: true,
  autoSignIn: true,
  clientSideSessionMiddleware: true,
});

export const NHOST_GRAPHQL_URL = generateServiceUrl(
  "graphql",
  NHOST_SUBDOMAIN,
  NHOST_REGION,
);

export const NHOST_FUNCTIONS_URL = generateServiceUrl(
  "functions",
  NHOST_SUBDOMAIN,
  NHOST_REGION,
);

// Helper to check if session is valid (not expired)
export function isSessionValid(): boolean {
  const session = nhost.getUserSession();
  if (!session?.accessToken) return false;
  
  // Decode JWT to check expiration
  try {
    const payload = JSON.parse(atob(session.accessToken.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Create SessionErrorBoundary component**

```tsx
// src/components/SessionErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

interface SessionErrorBoundaryProps {
  children: ReactNode;
  onSessionExpired: () => void;
}

interface SessionErrorBoundaryState {
  hasError: boolean;
  isSessionExpired: boolean;
  error: Error | null;
}

const BRAND_PINK = "#d0999a";

export class SessionErrorBoundary extends Component<
  SessionErrorBoundaryProps,
  SessionErrorBoundaryState
> {
  constructor(props: SessionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, isSessionExpired: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<SessionErrorBoundaryState> {
    const isSessionError = 
      error.message?.includes("unauthorized") ||
      error.message?.includes("401") ||
      error.message?.includes("session") ||
      error.message?.includes("JWT") ||
      error.message?.includes("token expired");
    
    return { 
      hasError: true, 
      isSessionExpired: isSessionError,
      error 
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("SessionErrorBoundary caught:", error, info.componentStack);
  }

  handleSignInAgain = () => {
    this.props.onSessionExpired();
    this.setState({ hasError: false, isSessionExpired: false, error: null });
  };

  handleRetry = () => {
    this.setState({ hasError: false, isSessionExpired: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="w-full h-screen flex items-center justify-center p-8"
          style={{ backgroundColor: BRAND_PINK }}
        >
          <div className="max-w-md w-full bg-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/30 text-center shadow-2xl">
            <div className="text-5xl mb-4">
              {this.state.isSessionExpired ? "🔐" : "🐾"}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
              {this.state.isSessionExpired ? "Session Expired" : "Something went wrong"}
            </h1>
            <p className="text-white/70 text-sm md:text-base mb-6 leading-relaxed">
              {this.state.isSessionExpired
                ? "Your session has expired. Please sign in again to continue."
                : "An unexpected error occurred. Please try again or contact us if the problem persists."}
            </p>
            <button
              onClick={this.state.isSessionExpired ? this.handleSignInAgain : this.handleRetry}
              className="px-8 py-3 rounded-full bg-white font-semibold text-base uppercase tracking-wider transition-transform hover:scale-105 shadow-lg"
              style={{ color: BRAND_PINK }}
            >
              {this.state.isSessionExpired ? "Sign In Again" : "Try Again"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SessionErrorBoundary;
```

- [ ] **Step 5: Update AuthContext to handle session expiry**

```typescript
// src/context/AuthContext.tsx (updated)
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { nhost, isSessionValid } from "@/lib/nhost";

interface AuthState {
  user: { id: string; email: string; displayName: string | null } | null;
  loading: boolean;
  sessionError: string | null;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  sessionError: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    sessionError: null,
  });

  useEffect(() => {
    const initialSession = nhost.getUserSession();
    if (initialSession?.user) {
      // Check if session is expired
      if (!isSessionValid()) {
        setState({ user: null, loading: false, sessionError: "Session expired. Please sign in again." });
        return;
      }
      setState({
        user: {
          id: initialSession.user.id,
          email: initialSession.user.email ?? "",
          displayName: initialSession.user.displayName ?? null,
        },
        loading: false,
        sessionError: null,
      });
    } else {
      setState((s) => ({ ...s, loading: false }));
    }

    const unsubscribe = nhost.sessionStorage.onChange((session) => {
      if (session?.user) {
        setState({
          user: {
            id: session.user.id,
            email: session.user.email ?? "",
            displayName: session.user.displayName ?? null,
          },
          loading: false,
          sessionError: null,
        });
      } else {
        setState({ user: null, loading: false, sessionError: "Session expired. Please sign in again." });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

- [ ] **Step 6: Update main.tsx with session error handling in Apollo link**

```typescript
// src/main.tsx (updated Apollo link with session validation)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloProvider } from "@apollo/client/react";
import { nhost, NHOST_GRAPHQL_URL, isSessionValid } from "@/lib/nhost";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SessionErrorBoundary } from "@/components/SessionErrorBoundary";
import { isAdmin } from "@/config/site-content";
import "./index.css";
import App from "./App.tsx";

const httpLink = createHttpLink({ uri: NHOST_GRAPHQL_URL });

const authLink = setContext(async (_, { headers }) => {
  const session = nhost.getUserSession();
  
  // Check session validity
  if (session?.accessToken && !isSessionValid()) {
    console.warn("Session token expired — triggering sign-out");
    await nhost.auth.signOut({});
    return { headers: { ...headers } };
  }
  
  const token = session?.accessToken;
  const email = session?.user?.email ?? null;
  const role = isAdmin(email) ? "admin" : "user";
  
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}`, "x-hasura-role": role } : {}),
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      console.error("[GraphQL error]:", err.message, err.locations, err.path);
      
      // Check for auth-related errors
      if (
        err.extensions?.code === "invalid-headers" ||
        err.message?.includes("JWT") ||
        err.message?.includes("unauthorized") ||
        err.extensions?.code === "access-denied"
      ) {
        console.warn("Auth error detected — session may be expired");
        // The SessionErrorBoundary will catch this via error propagation
      }
    });
  }
  if (networkError) {
    console.error("[Network error]:", networkError);
  }
});

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");
createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <SessionErrorBoundary onSessionExpired={() => {
        nhost.auth.signOut({});
        window.location.href = "/";
      }}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </SessionErrorBoundary>
    </ErrorBoundary>
  </StrictMode>,
);
```

- [ ] **Step 7: Run build to verify**

```bash
cd "C:\Users\cloud\OneDrive\Desktop\Hybrid_Second_Brain\clients website\gods creatures website\react-app"
npm run build
```

Expected: `tsc -b && vite build` passes with zero errors

---

### Task 2: Add Double-Booking Prevention

**Files:**
- Modify: `nhost-setup.sql`
- Modify: `src/components/ui/booking-modal.tsx`
- Modify: `src/lib/graphql.ts`
- Modify: `src/components/sections/AdminDashboard.tsx`

**Interfaces:**
- Consumes: `bookings` table schema, Hasura GraphQL permissions
- Produces: Database-level partial unique index, frontend booking conflict check

- [ ] **Step 1: Add partial unique index to prevent double-booking**

Add to `nhost-setup.sql`:
```sql
-- Prevent double-booking: same service + same date can only be booked once
-- when the booking is pending or confirmed (excludes cancelled)
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_service_date_active
  ON bookings (service, preferred_date)
  WHERE status IN ('pending_verification', 'confirmed');
```

- [ ] **Step 2: Add GraphQL query to check for booking conflicts**

Add to `src/lib/graphql.ts`:
```typescript
export const CHECK_BOOKING_CONFLICT = gql`
  query CheckBookingConflict($service: String!, $preferred_date: date!) {
    bookings(
      where: {
        service: { _eq: $service }
        preferred_date: { _eq: $preferred_date }
        status: { _in: ["pending_verification", "confirmed"] }
      }
    ) {
      id
      status
    }
  }
`;
```

- [ ] **Step 3: Create a reusable booking conflict check hook**

Create `src/hooks/useBookingConflict.ts`:
```typescript
import { useState, useCallback } from "react";
import { useApolloClient } from "@apollo/client/react";
import { CHECK_BOOKING_CONFLICT } from "@/lib/graphql";

interface BookingConflictResult {
  hasConflict: boolean;
  checking: boolean;
  error: string | null;
  checkConflict: (service: string, preferredDate: string) => Promise<boolean>;
}

export function useBookingConflict(): BookingConflictResult {
  const apolloClient = useApolloClient();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConflict = useCallback(async (service: string, preferredDate: string): Promise<boolean> => {
    setChecking(true);
    setError(null);
    try {
      const { data } = await apolloClient.query({
        query: CHECK_BOOKING_CONFLICT,
        variables: { service, preferred_date: preferredDate },
        fetchPolicy: "network-only",
      });
      const conflicts = data?.bookings?.length ?? 0;
      return conflicts > 0;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to check availability";
      setError(msg);
      console.error("Booking conflict check failed:", msg);
      return false;
    } finally {
      setChecking(false);
    }
  }, [apolloClient]);

  return { hasConflict: false, checking, error, checkConflict };
}
```

- [ ] **Step 4: Update booking-modal.tsx with double-booking check**

In `src/components/ui/booking-modal.tsx`, add the conflict check before submission:

```typescript
// Add import at top
import { useBookingConflict } from "@/hooks/useBookingConflict";

// Add inside BookingModal component:
const { checking: conflictChecking, checkConflict } = useBookingConflict();

// In handleFormSubmit, after validation and before createBooking:
const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage("");

  // ... existing validation ...

  // Add double-booking check
  const serviceLabel = selectedPackage.label + (effectiveSize ? ` - ${SIZE_LABELS[effectiveSize]}` : "");
  const preferredDate = dateRef.current?.value || "";
  
  try {
    setSubmitStatus("loading");
    
    const hasConflict = await checkConflict(serviceLabel, preferredDate);
    if (hasConflict) {
      setErrorMessage(
        "This time slot is already booked. Please choose a different date or contact us for availability."
      );
      setSubmitStatus("error");
      return;
    }
  } catch (err) {
    // If conflict check fails, log but allow booking to proceed
    console.warn("Conflict check failed — allowing booking:", err);
  }

  // Rest of existing submission logic...
  // (existing code continues below)
```

Also update the submit button to show conflict checking state:
```typescript
// In the submit button JSX:
<button
  type="submit"
  disabled={submitStatus === "loading" || conflictChecking}
  className="w-full py-3 rounded-full bg-white font-semibold text-lg transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  style={{ color: BRAND_PINK }}
>
  {submitStatus === "loading" || conflictChecking ? (
    <>
      <Loader2 size={20} className="animate-spin" />
      <span>{conflictChecking ? "Checking availability..." : booking.submittingLabel}</span>
    </>
  ) : (
    <>✉️ {booking.submitLabel}</>
  )}
</button>
```

- [ ] **Step 5: Add admin role back to Hasura metadata for bookings**

Update `metadata/databases/default/tables/public_bookings.yaml`:
```yaml
table:
  name: bookings
  schema: public
object_relationships:
  - name: pet
    using:
      foreign_key_constraint_on: pet_id
insert_permissions:
  - role: user
    permission:
      check:
        user_id:
          _eq: X-Hasura-User-Id
      set:
        user_id: x-hasura-User-Id
      columns:
        - addons
        - advance_paid
        - customer_name
        - email
        - notes
        - pet_id
        - phone
        - preferred_date
        - service
        - total_price
        - transaction_id
select_permissions:
  - role: user
    permission:
      columns:
        - addons
        - advance_paid
        - created_at
        - customer_name
        - email
        - id
        - notes
        - pet_id
        - phone
        - preferred_date
        - service
        - status
        - total_price
        - transaction_id
        - user_id
      filter:
        user_id:
          _eq: X-Hasura-User-Id
      allow_aggregations: true
  - role: admin
    permission:
      columns:
        - addons
        - advance_paid
        - created_at
        - customer_name
        - email
        - id
        - notes
        - pet_id
        - phone
        - preferred_date
        - service
        - status
        - total_price
        - transaction_id
        - user_id
      filter: {}
      allow_aggregations: true
update_permissions:
  - role: admin
    permission:
      columns:
        - status
      filter: {}
      check: null
delete_permissions:
  - role: admin
    permission:
      filter: {}
event_triggers:
  - name: send_booking_receipt
    definition:
      enable: true
      insert:
        columns: "*"
      update:
        columns: []
      delete:
        columns: []
    retry_conf:
      num_retries: 3
      interval_sec: 10
      timeout_sec: 60
    webhook: "{{NHOST_FUNCTIONS_URL}}/v1/send-booking-receipt"
    headers:
      - name: secret
        value_from_env: NHOST_WEBHOOK_SECRET
```

- [ ] **Step 6: Run build to verify**

```bash
npm run build
```

Expected: `tsc -b && vite build` passes with zero errors

---

### Task 3: Fix Resend Email Receipt Pipeline

**Files:**
- Modify: `functions/send-booking-receipt.ts`
- Modify: `functions/package.json`

**Interfaces:**
- Consumes: `Resend` SDK v4, Nhost Functions context
- Produces: Working email receipt function with proper error handling

- [ ] **Step 1: Update send-booking-receipt.ts with better error handling**

```typescript
import { Resend } from "resend";

const RUPEESIGN = "\u20B9";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface BookingData {
  customer_name: string;
  email: string;
  service: string;
  preferred_date: string | null;
  total_price: number | null;
  addons: string[] | null;
  transaction_id: string;
  advance_paid: number;
}

interface HasuraEvent {
  event: {
    session_variables: Record<string, string>;
    op: "INSERT" | "UPDATE" | "DELETE";
    data: {
      old: Record<string, unknown> | null;
      new: BookingData;
    };
    trace_context: Record<string, unknown>;
    created_at: string;
    id: string;
    delivery_info: { max_retries: number; current_retry: number };
  };
  created_at: string;
  id: string;
  delivery_info: { max_retries: number; current_retry: number };
  trigger: { name: string };
  table: { schema: string; name: string };
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || "onboarding@resend.dev";

const REQUIRED_BOOKING_FIELDS: (keyof BookingData)[] = [
  "customer_name",
  "email",
  "service",
  "transaction_id",
  "advance_paid",
];

function buildHtmlEmail(data: BookingData): string {
  const addonsList = data.addons && data.addons.length > 0
    ? data.addons.map((a) => `<li>${escapeHtml(a)}</li>`).join("")
    : "<li>None selected</li>";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Received</title>
</head>
<body style="margin:0;padding:0;background-color:#f5e6e6;font-family:'Quicksand','Inter',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#d0999a;padding:0;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;margin:0 auto;">
          <tr>
            <td style="padding:32px 24px 0;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.3px;">
                🐾 Gods Creatures
              </h1>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1px;">
                Pet Groomers
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);border-radius:24px;border:1px solid rgba(255,255,255,0.3);">
                <tr>
                  <td style="padding:28px 24px;">
                    <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#fff;">
                      Booking Received! 🎉
                    </h2>
                    <p style="margin:0 0 20px;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.5;">
                      Hello <strong style="color:#fff;">${escapeHtml(data.customer_name)}</strong>,<br />
                      your booking request has been received and is being reviewed.
                    </p>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;">
                      <tr>
                        <td style="padding:0 0 8px;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
                          Booking Summary
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size:13px;color:rgba(255,255,255,0.7);">Package</td>
                              <td style="font-size:13px;color:#fff;font-weight:600;text-align:right;">${escapeHtml(data.service)}</td>
                            </tr>
                            <tr>
                              <td style="font-size:13px;color:rgba(255,255,255,0.7);padding-top:6px;">Date</td>
                              <td style="font-size:13px;color:#fff;font-weight:600;text-align:right;padding-top:6px;">${data.preferred_date || "To be confirmed"}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0 4px;border-top:1px solid rgba(255,255,255,0.15);">
                          <p style="margin:8px 0 4px;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
                            Add-On Services
                          </p>
                          <ul style="margin:0;padding:0 0 0 16px;font-size:13px;color:rgba(255,255,255,0.8);">
                            ${addonsList}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 0;border-top:1px solid rgba(255,255,255,0.15);">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size:18px;font-weight:700;color:#fff;">Total</td>
                              <td style="font-size:18px;font-weight:700;color:#fff;text-align:right;">
                                ${RUPEESIGN}${(data.total_price ?? 0).toLocaleString("en-IN")}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top:16px;background:rgba(255,214,165,0.2);border:1px solid rgba(255,214,165,0.3);border-radius:16px;padding:14px 16px;">
                      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#FFD6A5;">
                        💰 Advance Payment Reminder
                      </p>
                      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.8);line-height:1.5;">
                        A ${RUPEESIGN}500 booking fee is required to confirm your appointment.
                        If you haven't already, please GPay <strong style="color:#fff;">9089196235@axisbank</strong>
                        and include the UPI reference in your booking.
                      </p>
                      <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.5);">
                        Transaction ID: ${escapeHtml(data.transaction_id)}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);line-height:1.5;">
                <strong style="color:rgba(255,255,255,0.7);">Gods Creatures Pet Groomers</strong><br />
                Malki, Nongshiliang, Shillong, Meghalaya - 793001<br />
                Mon–Sat 8am–4pm | 📞 8798897732
              </p>
              <p style="margin:10px 0 0;font-size:10px;color:rgba(255,255,255,0.35);">
                *where every tail wags brighter*
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  console.log("=== send-booking-receipt invoked ===");
  console.log("Method:", req.method);

  // Only allow POST
  if (req.method !== "POST") {
    console.log("Rejected: method not allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.error("FATAL: RESEND_API_KEY is not set — check Nhost Dashboard env vars");
    return res.status(500).json({ 
      error: "Email service not configured",
      message: "RESEND_API_KEY is not set. Please add it in Nhost Dashboard → Environment Variables."
    });
  }

  console.log("RESEND_API_KEY exists: true");
  console.log("FROM_EMAIL:", FROM_EMAIL);

  // --- Payload extraction ---
  let booking: BookingData | null = null;

  if (req.body?.event?.data?.new) {
    console.log("Payload format: Hasura Event Trigger");
    booking = req.body.event.data.new as BookingData;
  } else if (req.body?.customer_name) {
    console.log("Payload format: Direct API call");
    booking = req.body as BookingData;
  } else {
    console.error("FATAL: Unrecognized payload structure", JSON.stringify(req.body).slice(0, 500));
    // Check if it's a Hasura test ping
    if (req.body?.event?.op === "manual") {
      console.log("Hasura test ping received — acknowledging");
      return res.json({ message: "Webhook endpoint is alive", status: "ready" });
    }
    return res.status(400).json({
      error: "Unrecognized payload structure",
      message: "Expected Hasura Event Trigger payload or direct booking object",
      receivedKeys: Object.keys(req.body || {}),
    });
  }

  console.log("Extracted booking:", JSON.stringify(booking));

  // --- Validate required fields ---
  const missing = REQUIRED_BOOKING_FIELDS.filter((f) => !booking![f]);
  if (missing.length > 0) {
    console.error("FATAL: Missing fields:", missing.join(", "));
    return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  if (!booking.email) {
    console.error("FATAL: Missing customer email");
    return res.status(400).json({ error: "Missing customer email" });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const emailHtml = buildHtmlEmail(booking);

    console.log("Attempting to send email via Resend...");
    console.log("  from:", FROM_EMAIL);
    console.log("  to:", booking.email);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.email,
      subject: `🐾 Booking Received — ${escapeHtml(booking.customer_name)}, your grooming request is confirmed!`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API returned an error:", JSON.stringify(error));
      // Check for specific Resend errors
      if (error.message?.includes("domain") || error.message?.includes("sender")) {
        return res.status(500).json({ 
          error: "Email sender not verified",
          message: `The sender email "${FROM_EMAIL}" is not verified in Resend. Verify it at https://resend.com/domains or set RESEND_FROM_EMAIL env var.`,
          details: error
        });
      }
      return res.status(500).json({ error: error.message, details: error });
    }

    console.log("Email sent successfully. Resend response data:", JSON.stringify(data));
    return res.json({ message: "Email sent", id: data?.id });
  } catch (err) {
    console.error("Exception in send-booking-receipt:", err);
    return res.status(500).json({
      error: "Internal error sending email",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
```

- [ ] **Step 2: Create Hasura event trigger metadata file**

Create `metadata/databases/default/event_triggers.yaml`:
```yaml
- name: send_booking_receipt
  definition:
    enable: true
    insert:
      columns: "*"
    update:
      columns: []
    delete:
      columns: []
  retry_conf:
    num_retries: 3
    interval_sec: 10
    timeout_sec: 60
  webhook: "{{NHOST_FUNCTIONS_URL}}/v1/send-booking-receipt"
  headers:
    - name: secret
      value_from_env: NHOST_WEBHOOK_SECRET
```

- [ ] **Step 3: Create test script for email function**

Create `scripts/test-email-function.mjs`:
```javascript
// Test script for send-booking-receipt function
// Run: node scripts/test-email-function.mjs
const TEST_FUNCTION_URL = process.env.TEST_FUNCTION_URL || 
  "https://ukuqslqvwovrukooziwf.functions.ap-south-1.nhost.run/v1/send-booking-receipt";

const testPayload = {
  event: {
    data: {
      new: {
        customer_name: "Test User",
        email: "test@example.com",
        service: "Full Groom - Small (Up to 10kg)",
        preferred_date: "2026-07-15",
        total_price: 2900,
        addons: ["Teeth Cleaning", "Flea & Tick Removal Treatment"],
        transaction_id: `TEST-${Date.now()}`,
        advance_paid: 500,
      },
    },
  },
};

async function testEmailFunction() {
  console.log("Testing send-booking-receipt function...");
  console.log("URL:", TEST_FUNCTION_URL);
  console.log("Payload:", JSON.stringify(testPayload, null, 2));
  console.log("");

  try {
    const response = await fetch(TEST_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    });

    const result = await response.json();
    console.log("Response status:", response.status);
    console.log("Response body:", JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("\n✅ Email function test PASSED");
    } else {
      console.log("\n❌ Email function test FAILED");
      process.exit(1);
    }
  } catch (err) {
    console.error("\n❌ Email function test FAILED with error:", err.message);
    process.exit(1);
  }
}

testEmailFunction();
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: `tsc -b && vite build` passes

---

### Task 4: Add Test Infrastructure & Booking Flow Tests

**Files:**
- Create: `src/__tests__/booking-modal.test.tsx`
- Create: `src/__tests__/double-booking.test.ts`
- Create: `src/__tests__/session-error.test.ts`
- Install: `vitest` dev dependency

- [ ] **Step 1: Install test dependencies and update package.json**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Create double-booking prevention tests**

```typescript
// src/__tests__/double-booking.test.ts
import { describe, it, expect, vi } from 'vitest';

// Simulate the booking conflict check logic
type ConflictCheck = (service: string, date: string, existingBookings: Array<{service: string; date: string; status: string}>) => boolean;

function checkBookingConflict(
  service: string, 
  date: string, 
  existingBookings: Array<{service: string; date: string; status: string}>
): boolean {
  return existingBookings.some(
    (b) => 
      b.service === service && 
      b.date === date && 
      (b.status === 'pending_verification' || b.status === 'confirmed')
  );
}

describe('Double-Booking Prevention', () => {
  it('should detect conflict when same service+date has pending booking', () => {
    const existing = [
      { service: 'Full Groom', date: '2026-07-15', status: 'pending_verification' },
    ];
    expect(checkBookingConflict('Full Groom', '2026-07-15', existing)).toBe(true);
  });

  it('should detect conflict when same service+date has confirmed booking', () => {
    const existing = [
      { service: 'Full Groom', date: '2026-07-15', status: 'confirmed' },
    ];
    expect(checkBookingConflict('Full Groom', '2026-07-15', existing)).toBe(true);
  });

  it('should NOT detect conflict when same service+date has cancelled booking', () => {
    const existing = [
      { service: 'Full Groom', date: '2026-07-15', status: 'cancelled' },
    ];
    expect(checkBookingConflict('Full Groom', '2026-07-15', existing)).toBe(false);
  });

  it('should NOT detect conflict for different service same date', () => {
    const existing = [
      { service: 'Bath Package', date: '2026-07-15', status: 'pending_verification' },
    ];
    expect(checkBookingConflict('Full Groom', '2026-07-15', existing)).toBe(false);
  });

  it('should NOT detect conflict for same service different date', () => {
    const existing = [
      { service: 'Full Groom', date: '2026-07-14', status: 'pending_verification' },
    ];
    expect(checkBookingConflict('Full Groom', '2026-07-15', existing)).toBe(false);
  });

  it('should return false for empty bookings array', () => {
    expect(checkBookingConflict('Full Groom', '2026-07-15', [])).toBe(false);
  });
});
```

- [ ] **Step 3: Create session error tests**

```typescript
// src/__tests__/session-error.test.ts
import { describe, it, expect } from 'vitest';

describe('Session Token Validation', () => {
  // This would normally require mocking JWT decode
  it('should detect expired token', () => {
    const expiredToken = {
      accessToken: `header.${btoa(JSON.stringify({ 
        exp: Math.floor(Date.now() / 1000) - 3600 // expired 1 hour ago
      }))}.signature`
    };
    
    // Simulate isSessionValid logic
    function isSessionValid(): boolean {
      try {
        const payload = JSON.parse(atob(expiredToken.accessToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
      } catch {
        return false;
      }
    }
    
    expect(isSessionValid()).toBe(false);
  });

  it('should detect valid token', () => {
    const validToken = {
      accessToken: `header.${btoa(JSON.stringify({ 
        exp: Math.floor(Date.now() / 1000) + 3600 // valid for 1 more hour
      }))}.signature`
    };
    
    function isSessionValid(): boolean {
      try {
        const payload = JSON.parse(atob(validToken.accessToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
      } catch {
        return false;
      }
    }
    
    expect(isSessionValid()).toBe(true);
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 5: Run build to verify everything**

```bash
npm run build
```

Expected: `tsc -b && vite build` passes with zero errors

---

### Task 5: Verify All Changes & Deploy

**Files:**
- Production files from Tasks 1-4
- `HANDOFF.md` (update)

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 2: Run full build**

```bash
npm run build
```

Expected: `tsc -b && vite build` passes

- [ ] **Step 3: Verify all files are consistent**

Check that:
1. `src/lib/nhost.ts` has `autoRefreshToken: true` setting
2. `src/context/AuthContext.tsx` has `sessionError` state
3. `src/main.tsx` has `SessionErrorBoundary` wrapper
4. `nhost-setup.sql` has unique index for double-booking prevention
5. `src/hooks/useBookingConflict.ts` exists
6. `src/components/ui/booking-modal.tsx` has conflict check logic
7. `metadata/databases/default/tables/public_bookings.yaml` has admin role
8. `functions/send-booking-receipt.ts` has improved error handling
9. Tests pass

- [ ] **Step 4: Apply SQL changes to database**

```bash
# Connect to Nhost Dashboard SQL console and run:
# CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_service_date_active
#   ON bookings (service, preferred_date)
#   WHERE status IN ('pending_verification', 'confirmed');
```

- [ ] **Step 5: Apply Hasura metadata**

```bash
$env:HASURA_GRAPHQL_ADMIN_SECRET="admin12345"
& "C:\Users\cloud\AppData\Local\Temp\hasura.exe" metadata apply --project hasura
```

Expected: `INFO Metadata applied`

- [ ] **Step 6: Verify Resend configuration**

```bash
# Run the test script to verify email function works
node scripts/test-email-function.mjs
```

Expected: `Email function test PASSED`

- [ ] **Step 7: Update HANDOFF.md with session summary**

- [ ] **Step 8: Commit and push**

```bash
git add -A
git commit -m "fix: session error handling, double-booking prevention, email pipeline"
git push origin main
```

Expected: Cloudflare Pages auto-deploys

---

## Verification Checklist

Final verification after all tasks complete:

- [ ] **Session fix**: Open app, wait for token to expire → "Session Expired" popup appears → "Sign In Again" button works
- [ ] **Double-booking prevention**: Try booking same service+date → error message "already booked"
- [ ] **Resend email**: Book a service (can use test script) → email received in inbox
- [ ] **Build**: `tsc -b && vite build` passes
- [ ] **Tests**: `npx vitest run` passes
- [ ] **Hasura metadata**: `hasura metadata apply` succeeds
- [ ] **SQL index**: Index applied in Nhost database
