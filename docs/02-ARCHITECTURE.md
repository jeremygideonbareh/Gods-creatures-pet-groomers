# Architecture — Gods Creatures Pet Groomers

## High-Level Architecture

The application relies on a modern, serverless stack leveraging React for the frontend and Nhost (PostgreSQL, Hasura, Functions, Storage, Auth) for the backend.

```text
+-----------------------+           +---------------------------------------+
|                       |           |                NHOST                  |
|    Cloudflare Pages   |   HTTPS   |                                       |
|                       +----------->   +------+   +--------+   +---------+ |
|   +---------------+   |           |   |      |   |        |   |         | |
|   |   React SPA   |   <-----------+   | Auth |   | Hasura |   | Storage | |
|   +-------+-------+   | GraphQL / |   |      |   |        |   |         | |
|           |           | REST      |   +--+---+   +----+---+   +----+----+ |
+-----------|-----------+           |      |            |            |      |
            |                       |      |      +-----+----+       |      |
            v                       |      |      | PostgreSQL|      |      |
      User Browser                  |      +------>          <-------+      |
                                    |             +----------+              |
                                    +---------------------------------------+
```

### Payment Flow
Payment processing utilizes Nhost serverless functions to act as intermediaries with external payment providers.

```text
+----------+      +----------------+      +---------------------+      +----------------+
| Frontend | ---> | Nhost Function | ---> | Cashfree/Razorpay   | ---> | Payment Screen |
|  (User)  |      | (/create-order)|      |        API          |      |    (User)      |
+----------+      +----------------+      +---------------------+      +-------+--------+
                                                                               |
                                                                               | Webhook
                                                                               v
+----------+                              +---------------------+      +----------------+
|  Hasura  | <--------------------------- | Nhost Function      | <--- | Cashfree/      |
|    DB    |         Update Status        | (/payment-webhook)  |      | Razorpay Webhook|
+----------+                              +---------------------+      +----------------+
```

### Email Flow
Emails (e.g., booking confirmations) are triggered by Hasura Event Triggers listening for row insertions/updates in the database.

```text
+----------------+      +-----------------------+      +----------------+      +--------------+
| Booking Insert | ---> | Hasura Event Trigger  | ---> | Nhost Function | ---> |  Resend API  |
|  (Hasura DB)   |      |   (on_booking_insert) |      | (/send-email)  |      |              |
+----------------+      +-----------------------+      +----------------+      +--------------+
```

## Provider Hierarchy

The React component tree utilizes multiple providers for context, state management, routing, and data fetching.

```jsx
<StrictMode>
  <ErrorBoundary>
    <SessionErrorBoundary>
      <ApolloProvider>
        <BrowserRouter>
          <SiteContentProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<ScrollAdventure />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AuthProvider>
          </SiteContentProvider>
        </BrowserRouter>
      </ApolloProvider>
    </SessionErrorBoundary>
  </ErrorBoundary>
</StrictMode>
```

## Routing

The client-side routing handles access control implicitly or explicitly within the components.

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/` | `ScrollAdventure` | No | Landing page with all sections |
| `/profile` | `ProfilePage` | Yes | Pet management |
| `/admin` | `AdminDashboard` | Admin only | Booking mgmt + CMS |
| `/store` | `StorePage` | No | Product catalog |
| `*` | Navigate to `/` | No | Catch-all redirect |

## Data Flow

1. **Apollo Client Integration**: The Apollo Client is configured with an authentication link chain: `ErrorLink` → `authLink` (injects JWT + `x-hasura-role`) → `httpLink`. This ensures every GraphQL request is authenticated and authorized accurately based on the current user's role.
2. **CMS Content**: The `SiteContentContext` fetches content management data on mount. It also exposes an `updateSection()` function for admin users to modify the site layout and text.
3. **Authentication State**: The `AuthContext` listens to session state changes from Nhost and syncs the current session and user data throughout the application.
4. **GraphQL Operations**: All queries and mutations are centralized in `src/lib/graphql.ts` for consistency and easier maintenance.

## Key Architectural Decisions

1. **Nhost v4 SDK**: We use the generic Nhost v4 JavaScript client SDK instead of the deprecated React packages to ensure compatibility with React 19.
2. **Apollo Client v4**: Utilizing Apollo Client with a custom `authLink` allows precise control over role-based access by injecting dynamic headers.
3. **Hasura Metadata Permissions**: Security logic is primarily enforced via Hasura's role-based metadata permissions, avoiding direct PostgreSQL RLS (Row-Level Security) complexity while maintaining robust access control.
4. **CMS JSONB Design**: The Content Management System (CMS) is backed by a `site_content` table with a `JSONB` column, enabling flexible section-based upserts.
5. **Serverless Functions**: Nhost serverless functions are specifically employed for sensitive backend logic such as payment processing and sending transactional emails.
6. **Normal Scrolling**: The UI uses normal continuous scrolling paired with an `IntersectionObserver` to trigger fade-in animations as elements enter the viewport, replacing a previous snap-scroll implementation for better UX.
7. **Admin Helper**: An `isAdmin()` helper function is implemented for case-insensitive, null-safe checks against the administrator's email.

## Security Layers

The system relies on defense-in-depth across the entire stack:
- **Nhost JWT Auth**: Issues JSON Web Tokens upon successful user login.
- **Hasura Role-Based Permissions**: Strict column and row-level rules depending on the `user`, `public`, or `admin` roles.
- **Header Injection**: Apollo auth link automatically sends the appropriate `x-hasura-role` header to elevate or restrict query execution.
- **Content Security Policy**: Implemented via a CSP `<meta>` tag in `index.html` to prevent XSS.
- **Input Validation**: Extensive client-side validation using standard HTML attributes (`maxLength`, regex `pattern`).
- **Webhook Security**: HMAC signature verification on webhook endpoints to confirm that requests legitimately originate from the payment provider.
- **Template Escaping**: HTML character escaping in email templates to prevent script injection via emails.
