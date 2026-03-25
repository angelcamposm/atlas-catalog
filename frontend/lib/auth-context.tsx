"use client";

/**
 * AuthContext and AuthProvider
 *
 * Manages authentication state across the application.
 * Persists the Bearer token in localStorage and restores
 * the session on page load via /v1/auth/me.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi, AuthUser, LoginRequest } from "@/lib/api/auth";

// Token storage key
export const TOKEN_KEY = "auth_token";

// Context shape -----------------------------------------------------------

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Provider ----------------------------------------------------------------

/**
 * Wrap your app (or protected layout) with this provider.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // On mount: restore session if a token exists
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;

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
            value={{ user, isAuthenticated: !!user, loading, login, logout }}
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
