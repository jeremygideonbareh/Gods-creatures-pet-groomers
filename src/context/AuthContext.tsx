import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { nhost } from "@/lib/nhost";

interface AuthState {
  user: { id: string; email: string; displayName: string | null } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const initialSession = nhost.getUserSession();
    if (initialSession?.user) {
      setState({
        user: {
          id: initialSession.user.id,
          email: initialSession.user.email ?? "",
          displayName: initialSession.user.displayName ?? null,
        },
        loading: false,
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
        });
      } else {
        setState({ user: null, loading: false });
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
