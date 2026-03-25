"use client";

/**
 * AppProviders — combines all client-side providers:
 * - AuthProvider: authentication state
 * - ThemeProvider: dark/light theme
 *
 * Used in the root locale layout so providers are available on all pages.
 */

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import type { ReactNode } from "react";

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </AuthProvider>
    );
}
