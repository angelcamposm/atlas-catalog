/**
 * Shared testing helpers.
 *
 * `renderWithProviders` mounts a component tree with the app-level
 * providers (currently <AuthContext>) already wired, so domain
 * tests can focus on behaviour instead of boilerplate.
 */

import {
    render,
    type RenderOptions,
    type RenderResult,
} from "@testing-library/react";
import React from "react";
import { AuthContext, type AuthState } from "@/lib/auth-context";
import type { AuthUser } from "@/lib/api/auth";

export interface ProviderOptions {
    /** Override the logged-in user. `null` simulates an anonymous session. */
    user?: AuthUser | null;
    /** Force the loading flag on the auth context (default: false). */
    authLoading?: boolean;
    /** Override the login mock. */
    login?: AuthState["login"];
    /** Override the logout mock. */
    logout?: AuthState["logout"];
}

export function buildAuthState(opts: ProviderOptions = {}): AuthState {
    const user = opts.user ?? null;
    return {
        user,
        isAuthenticated: !!user,
        loading: opts.authLoading ?? false,
        login: opts.login ?? jest.fn().mockResolvedValue(undefined),
        logout: opts.logout ?? jest.fn().mockResolvedValue(undefined),
    };
}

export function renderWithProviders(
    ui: React.ReactElement,
    options: ProviderOptions & Omit<RenderOptions, "wrapper"> = {},
): RenderResult & { authState: AuthState } {
    const { user, authLoading, login, logout, ...rtlOptions } = options;
    const authState = buildAuthState({ user, authLoading, login, logout });

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );

    return {
        ...render(ui, { wrapper: Wrapper, ...rtlOptions }),
        authState,
    };
}
