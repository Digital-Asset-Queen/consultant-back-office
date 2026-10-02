import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useActor } from "../../hooks/useActor";

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: () => Promise<void>;
  logout: () => void;
  principal: string | null;
  actorError: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { identity, login, clear, isInitializing } = useInternetIdentity();
  const { actor, error: actorError } = useActor();
  const queryClient = useQueryClient();
  const [seedInitialized, setSeedInitialized] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleLogin = useCallback(async () => {
    try {
      await login();
    } catch (e) {
      console.error("Internet Identity login failed:", e);
      throw e;
    }
  }, [login]);

  useEffect(() => {
    if (isAuthenticated && actor && !seedInitialized) {
      setSeedInitialized(true);
      actor
        .initializeSeedData()
        .then(() => {
          queryClient.invalidateQueries();
        })
        .catch((err: unknown) => {
          console.error("Seed data initialization failed:", err);
        });
    }
  }, [isAuthenticated, actor, seedInitialized, queryClient]);

  const value: AuthContextValue = {
    isAuthenticated,
    isInitializing,
    login: handleLogin,
    logout: clear,
    principal: identity?.getPrincipal().toString() ?? null,
    actorError: actorError ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
