/**
 * Tests for the Auth API module
 *
 * Tests login, register, me, and logout API calls
 */

import { authApi } from "@/lib/api/auth";
import { apiClient } from "@/lib/api-client";

jest.mock("@/lib/api-client", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        buildQuery: jest.fn(() => ""),
    },
}));

const mockPost = apiClient.post as jest.Mock;
const mockGet = apiClient.get as jest.Mock;

describe("authApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        it("calls POST /v1/auth/login with credentials", async () => {
            const mockResponse = {
                token: "test-token-123",
                user: { id: 1, name: "Test User", email: "test@example.com", role: "user" },
            };
            mockPost.mockResolvedValueOnce(mockResponse);

            const result = await authApi.login({ email: "test@example.com", password: "secret" });

            expect(apiClient.post).toHaveBeenCalledWith("/v1/auth/login", {
                email: "test@example.com",
                password: "secret",
            });
            expect(result).toEqual(mockResponse);
        });

        it("propagates errors from apiClient", async () => {
            mockPost.mockRejectedValueOnce(new Error("Unauthorized"));
            await expect(
                authApi.login({ email: "bad@example.com", password: "wrong" })
            ).rejects.toThrow("Unauthorized");
        });
    });

    describe("register", () => {
        it("calls POST /v1/auth/register with user data", async () => {
            const mockResponse = {
                token: "new-token",
                user: { id: 2, name: "New User", email: "new@example.com", role: "user" },
            };
            mockPost.mockResolvedValueOnce(mockResponse);

            const result = await authApi.register({
                name: "New User",
                email: "new@example.com",
                password: "password123",
                password_confirmation: "password123",
            });

            expect(apiClient.post).toHaveBeenCalledWith("/v1/auth/register", {
                name: "New User",
                email: "new@example.com",
                password: "password123",
                password_confirmation: "password123",
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe("me", () => {
        it("calls GET /v1/auth/me and returns current user", async () => {
            const mockResponse = {
                data: { id: 1, name: "Test User", email: "test@example.com", role: "admin" },
            };
            mockGet.mockResolvedValueOnce(mockResponse);

            const result = await authApi.me();

            expect(apiClient.get).toHaveBeenCalledWith("/v1/auth/me");
            expect(result).toEqual(mockResponse);
        });
    });

    describe("logout", () => {
        it("calls POST /v1/auth/logout", async () => {
            mockPost.mockResolvedValueOnce(undefined);

            await authApi.logout();

            expect(apiClient.post).toHaveBeenCalledWith("/v1/auth/logout", {});
        });
    });
});
