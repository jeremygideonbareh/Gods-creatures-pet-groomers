import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { nhost, isSessionValid } from "@/lib/nhost";

interface AuthState {
  user: { id: string; email: string; displayName: string | null } | null;
  loading: boolean;
  sessionError: string | null;
}

/**
 * Intentional-sign-out marker. Set by the Sign Out buttons (UserMenu, navbar)
 * BEFORE calling nhost.auth.signOut so the sessionStorage.onChange null branch
 * knows the null session was user-initiated and must NOT show the
 * "Session expired" message. Never exported directly — only the setters are.
 */
let intentionalSignOut = false;

export function setSignOutIntentional() {
  intentionalSignOut = true;
}

export function resetSignOutIntentional() {
  intentionalSignOut = false;
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
        const wasIntentional = intentionalSignOut;
        resetSignOutIntentional();
        setState({
          user: null,
          loading: false,
          sessionError: wasIntentional ? null : "Session expired. Please sign in again.",
        });
      }
    });

    const initialSession = nhost.getUserSession();
    if (initialSession?.user) {
      if (!isSessionValid()) {
        // Refresh-first: an expired access token is NOT a dead session. Try to
        // rotate it before declaring "Session expired".
        (async () => {
          try {
            await nhost.refreshSession(0);
            const refreshed = nhost.getUserSession();
            if (refreshed?.user) {
              setState({
                user: {
                  id: refreshed.user.id,
                  email: refreshed.user.email ?? "",
                  displayName: refreshed.user.displayName ?? null,
                },
                loading: false,
                sessionError: null,
              });
              return;
            }
          } catch {
            // fall through to expired state below
          }
          setState({
            user: null,
            loading: false,
            sessionError: "Session expired. Please sign in again.",
          });
        })();
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

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
