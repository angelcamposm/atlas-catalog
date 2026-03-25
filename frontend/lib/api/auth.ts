/**
 * Authentication API module
 *
 * Handles login, register, me (current user), and logout requests
 * against the Laravel Sanctum/JWT backend.
 */

import { apiClient } from "@/lib/api-client";

// Request / Response types -------------------------------------------------

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthUser {
    id: number;
    name: string | null;
    email: string | null;
    role: string | null;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

interface AuthResponseEnvelope {
    data: AuthResponse;
}

export interface MeResponse {
    data: AuthUser;
}

// API module ---------------------------------------------------------------

/**
 * Auth API — maps to /v1/auth/* backend routes
 */
export const authApi = {
    /**
     * Login with email and password.
     * Returns a Bearer token and the authenticated user.
     */
    login: (data: LoginRequest): Promise<AuthResponse> =>
        apiClient
            .post<AuthResponseEnvelope>("/v1/auth/login", data)
            .then((res) => res.data),

    /**
     * Register a new user.
     * Returns a Bearer token and the newly created user.
     */
    register: (data: RegisterRequest): Promise<AuthResponse> =>
        apiClient.post<AuthResponse>("/v1/auth/register", data),

    /**
     * Fetch the currently authenticated user.
     * Requires a valid Bearer token to be set in the api-client headers.
     */
    me: (): Promise<MeResponse> => apiClient.get<MeResponse>("/v1/auth/me"),

    /**
     * Logout and invalidate the current token on the backend.
     */
    logout: (): Promise<void> => apiClient.post<void>("/v1/auth/logout", {}),
};
