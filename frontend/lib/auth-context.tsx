"use client";

/**
 * AuthContext and AuthProvider
 *
 * Manages authentication state across the application.
 * Persists the Bearer token in localStorage and restores
 * the session on page load via /v1/auth/me.
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { authApi, AuthUser, LoginRequest } from "@/lib/api/auth";

// Token storage key
export const TOKEN_KEY = "auth_token";

// Context shape -----------------------------------------------------------

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}

/**
 * Exported so tests and advanced consumers can inject their own
 * auth state via <AuthContext.Provider>. Regular app code should
 * prefer <AuthProvider> + useAuth().
 */
export const AuthContext = createContext<AuthState | undefined>(undefined);

// Provider ----------------------------------------------------------------

/**
 * Wrap your app (or protected layout) with this provider.
 */
export function AuthProvider({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [user, setUser] = useState<AuthUser | null>(null);
    // When a token is present we start in `loading=true` to avoid a brief
    // window where consumers see an "unauthenticated" state before the
    // session has been restored. Without this, route guards based on
    // `!loading && !isAuthenticated` would incorrectly redirect to the
    // login page on every page reload of an authenticated session.
    const [loading, setLoading] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(TOKEN_KEY) !== null;
    });

    // On mount: restore session if a token exists
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        authApi
            .me()
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                // Token invalid / expired — clean up
                localStorage.removeItem(TOKEN_KEY);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (data: LoginRequest) => {
        const res = await authApi.login(data);
        localStorage.setItem(TOKEN_KEY, res.token);
        setUser(res.user);
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            // Best-effort logout — clear local state regardless
        }
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={useMemo(
                () => ({
                    user,
                    isAuthenticated: !!user,
                    loading,
                    login,
                    logout,
                }),
                [user, loading, login, logout],
            )}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Internal hook getter (used by useAuth.ts) --------------------------------

export function useAuthContext(): AuthState {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return ctx;
}
