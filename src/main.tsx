import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ApolloProvider } from "@apollo/client/react";
import { nhost, NHOST_GRAPHQL_URL, isSessionValid } from "@/lib/nhost";
import { raiseSessionExpiry } from "@/lib/session-expiry-signal";
import SessionExpiryGate from "@/components/SessionExpiryGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SessionErrorBoundary } from "@/components/SessionErrorBoundary";
import { isAdmin } from "@/config/site-content";
import "./index.css";
import App from "./App.tsx";

const httpLink = createHttpLink({ uri: NHOST_GRAPHQL_URL });

const authLink = setContext(async (_, { headers }) => {
  const session = nhost.getUserSession();
  let token = session?.accessToken;
  let hadExpiredSession = false;

  // Expired access token is NOT a dead session — refresh it instead of signing out.
  if (session?.accessToken && !isSessionValid()) {
    hadExpiredSession = true;
    try {
      const refreshed = await nhost.refreshSession(0); // 0 = force refresh now
      token = refreshed?.accessToken ?? session.accessToken;
    } catch (err) {
      console.error("[auth] session refresh failed", err);
      token = undefined;
    }
  }

  // Refresh genuinely failed: raise the signal so SessionExpiryGate throws and the
  // SessionErrorBoundary shows its full-screen "Session Expired" UI. NO signOut,
  // NO auto-redirect (user-approved behavior).
  if (hadExpiredSession && !token) {
    raiseSessionExpiry();
    return { headers: { ...headers } };
  }

  const email = session?.user?.email ?? null;
  const role = isAdmin(email) ? "admin" : "user";
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}`, "x-hasura-role": role } : {}),
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach((err) =>
      console.error("[GraphQL error]:", err.message, err.locations, err.path)
    );
  } else {
    console.error("[Network error]:", error);
  }
});

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

function handleSessionExpired() {
  nhost.auth.signOut({ all: true }).catch(console.error);
  window.location.href = "/";
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");
createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <SessionErrorBoundary onSessionExpired={handleSessionExpired}>
        <SessionExpiryGate />
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </SessionErrorBoundary>
    </ErrorBoundary>
  </StrictMode>,
);
