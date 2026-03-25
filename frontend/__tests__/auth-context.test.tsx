/**
 * Tests for AuthContext and useAuth hook
 *
 * Tests authentication state management, login, logout, and token persistence
 */

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "@/lib/auth-context";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/api/auth";

// Mock auth API
jest.mock("@/lib/api/auth", () => ({
    authApi: {
        login: jest.fn(),
        logout: jest.fn(),
        me: jest.fn(),
    },
}));

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe("useAuth", () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    describe("initial state", () => {
        it("starts with no user and not authenticated", () => {
            const { result } = renderHook(() => useAuth(), { wrapper });
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.loading).toBe(false);
        });
    });

    describe("login", () => {
        it("stores token in localStorage and sets user", async () => {
            const mockUser = { id: 1, name: "Test User", email: "test@example.com", role: "user" };
            (authApi.login as jest.Mock).mockResolvedValueOnce({ token: "test-token", user: mockUser });

            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(async () => {
                await result.current.login({ email: "test@example.com", password: "secret" });
            });

            expect(localStorage.getItem("auth_token")).toBe("test-token");
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
        });

        it("throws error on failed login", async () => {
            (authApi.login as jest.Mock).mockRejectedValueOnce(new Error("Invalid credentials"));

            const { result } = renderHook(() => useAuth(), { wrapper });

            await expect(
                act(async () => {
                    await result.current.login({ email: "bad@example.com", password: "wrong" });
                })
            ).rejects.toThrow("Invalid credentials");

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe("logout", () => {
        it("clears token from localStorage and resets user", async () => {
            // Arrange: simulate already logged in
            localStorageMock.setItem("auth_token", "existing-token");
            const mockUser = { id: 1, name: "Test User", email: "test@example.com", role: "user" };
            (authApi.me as jest.Mock).mockResolvedValueOnce({ data: mockUser });
            (authApi.logout as jest.Mock).mockResolvedValueOnce(undefined);

            const { result } = renderHook(() => useAuth(), { wrapper });

            // Wait for me() to be called on mount when token exists
            await act(async () => {
                await new Promise((r) => setTimeout(r, 0));
            });

            await act(async () => {
                await result.current.logout();
            });

            expect(localStorage.getItem("auth_token")).toBeNull();
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe("token restoration on mount", () => {
        it("restores session when token exists in localStorage", async () => {
            localStorageMock.setItem("auth_token", "saved-token");
            const mockUser = { id: 2, name: "Returning User", email: "returning@example.com", role: "admin" };
            (authApi.me as jest.Mock).mockResolvedValueOnce({ data: mockUser });

            const { result } = renderHook(() => useAuth(), { wrapper });

            // Initially loading
            expect(result.current.loading).toBe(true);

            await act(async () => {
                await new Promise((r) => setTimeout(r, 0));
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.loading).toBe(false);
        });

        it("clears token if me() fails (token expired)", async () => {
            localStorageMock.setItem("auth_token", "expired-token");
            (authApi.me as jest.Mock).mockRejectedValueOnce(new Error("Unauthorized"));

            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(async () => {
                await new Promise((r) => setTimeout(r, 0));
            });

            expect(localStorage.getItem("auth_token")).toBeNull();
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.loading).toBe(false);
        });
    });
});
