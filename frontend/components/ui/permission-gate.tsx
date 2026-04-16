"use client";

/**
 * <PermissionGate> — conditionally render UI based on auth state.
 *
 * Delegates the "is the user allowed?" decision to a caller-supplied
 * predicate so the component stays decoupled from how permissions
 * are modelled (roles, scoped capabilities, policies, ...).
 *
 * @example
 *   <PermissionGate allow={(u) => u?.role === "admin"}>
 *     <DangerButton />
 *   </PermissionGate>
 */

import React from "react";
import { useAuthContext } from "@/lib/auth-context";
import type { AuthUser } from "@/lib/api/auth";

export interface PermissionGateProps {
    /** Predicate evaluated against the current user. */
    allow: (user: AuthUser | null) => boolean;
    /** Content shown when the predicate returns true. */
    children: React.ReactNode;
    /** Content shown when access is denied. Defaults to nothing. */
    fallback?: React.ReactNode;
    /** Optional placeholder while auth state is still loading. */
    loadingFallback?: React.ReactNode;
}

export function PermissionGate({
    allow,
    children,
    fallback = null,
    loadingFallback = null,
}: PermissionGateProps) {
    const { user, loading } = useAuthContext();

    if (loading) return <>{loadingFallback}</>;
    if (!user || !allow(user)) return <>{fallback}</>;
    return <>{children}</>;
}
