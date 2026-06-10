import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ApolloProvider } from "@apollo/client/react";
import { nhost, NHOST_GRAPHQL_URL } from "@/lib/nhost";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { adminEmail } from "@/config/site-content";
import "./index.css";
import App from "./App.tsx";

const httpLink = createHttpLink({ uri: NHOST_GRAPHQL_URL });

const authLink = setContext(async (_, { headers }) => {
  const session = nhost.getUserSession();
  const token = session?.accessToken;
  const email = session?.user?.email ?? null;
  const role = email === adminEmail ? "admin" : "user";
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

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");
createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </ErrorBoundary>
  </StrictMode>,
);
