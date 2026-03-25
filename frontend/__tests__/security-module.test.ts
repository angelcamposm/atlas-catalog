/**
 * Tests for Security module (Service Accounts, Service Account Tokens)
 */

import { serviceAccountsApi } from "@/lib/api/service-accounts";
import { serviceAccountTokensApi } from "@/lib/api/security";

// Mock the api-client
jest.mock("@/lib/api-client", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        buildQuery: jest.fn((params: Record<string, unknown>) => {
            const query = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    query.append(key, String(value));
                }
            });
            const queryString = query.toString();
            return queryString ? `?${queryString}` : "";
        }),
    },
}));

import { apiClient } from "@/lib/api-client";

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Helper to create service account mock data
const createServiceAccountMock = (overrides = {}) => ({
    id: 1,
    name: "ci-cd-service-account",
    namespace: "production",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create service account token mock data
const createServiceAccountTokenMock = (overrides = {}) => ({
    id: 1,
    service_account_id: 1,
    token: "sak_xxxxxxxxxxxxx",
    expires_at: "2025-01-01T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper for paginated response
const createPaginatedResponse = <T>(
    data: T[],
    page = 1,
    path: string = "/v1/security/service-accounts"
) => ({
    data,
    meta: {
        current_page: page,
        last_page: Math.ceil(data.length / 15) || 1,
        per_page: 15,
        total: data.length,
        from: data.length > 0 ? 1 : null,
        to: data.length > 0 ? data.length : null,
        path,
    },
    links: {
        first: `${path}?page=1`,
        last: `${path}?page=1`,
        prev: null,
        next: null,
    },
});

describe("Security Module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Service Accounts API", () => {
        describe("serviceAccountsApi.getAll", () => {
            it("should fetch all service accounts with pagination", async () => {
                const mockResponse = createPaginatedResponse([
                    createServiceAccountMock(),
                    createServiceAccountMock({
                        id: 2,
                        name: "monitoring-service-account",
                        display_name: "Monitoring Service Account",
                    }),
                ]);

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountsApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/security/service-accounts?page=1"
                );
                expect(result.data).toHaveLength(2);
                expect(result.data[0].name).toBe("ci-cd-service-account");
            });

            it("should handle custom page numbers", async () => {
                const mockResponse = createPaginatedResponse(
                    [createServiceAccountMock()],
                    3
                );

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountsApi.getAll(3);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/security/service-accounts?page=3"
                );
                expect(result.meta.current_page).toBe(3);
            });

            it("should handle empty results", async () => {
                const mockResponse = createPaginatedResponse([]);

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountsApi.getAll(1);

                expect(result.data).toHaveLength(0);
            });
        });

        describe("serviceAccountsApi.getById", () => {
            it("should fetch a single service account by ID", async () => {
                const mockResponse = {
                    data: createServiceAccountMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountsApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/security/service-accounts/1"
                );
                expect(result.data.name).toBe("ci-cd-service-account");
                expect(result.data.namespace).toBe("production");
            });

            it("should fetch service account with null namespace", async () => {
                const mockResponse = {
                    data: createServiceAccountMock({
                        namespace: null,
                    }),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountsApi.getById(1);

                expect(result.data.namespace).toBeNull();
            });
        });

        describe("serviceAccountsApi.create", () => {
            it("should create a new service account", async () => {
                const createData = {
                    name: "new-service-account",
                    namespace: "default",
                };

                const mockResponse = {
                    data: createServiceAccountMock({
                        id: 3,
                        name: "new-service-account",
                        namespace: "default",
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountsApi.create(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/security/service-accounts",
                    createData
                );
                expect(result.data.name).toBe("new-service-account");
            });

            it("should handle creation errors", async () => {
                mockedApiClient.post.mockRejectedValueOnce(
                    new Error("Service account name already exists")
                );

                await expect(
                    serviceAccountsApi.create({ name: "duplicate" })
                ).rejects.toThrow("Service account name already exists");
            });
        });

        describe("serviceAccountsApi.update", () => {
            it("should update an existing service account", async () => {
                const updateData = {
                    namespace: "staging",
                };

                const mockResponse = {
                    data: createServiceAccountMock({
                        namespace: "staging",
                        updated_at: "2024-01-02T00:00:00Z",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountsApi.update(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/security/service-accounts/1",
                    updateData
                );
                expect(result.data.namespace).toBe("staging");
            });
        });

        describe("serviceAccountsApi.delete", () => {
            it("should delete a service account", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await serviceAccountsApi.delete(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/security/service-accounts/1"
                );
            });

            it("should handle deletion errors", async () => {
                mockedApiClient.delete.mockRejectedValueOnce(
                    new Error(
                        "Cannot delete service account with active tokens"
                    )
                );

                await expect(serviceAccountsApi.delete(1)).rejects.toThrow(
                    "Cannot delete service account with active tokens"
                );
            });
        });
    });

    describe("Service Account Tokens API", () => {
        describe("serviceAccountTokensApi.getAll", () => {
            it("should fetch all service account tokens", async () => {
                const mockResponse = createPaginatedResponse(
                    [
                        createServiceAccountTokenMock(),
                        createServiceAccountTokenMock({
                            id: 2,
                            token: "sak_yyyyyyyyyyyy",
                            expires_at: "2024-06-01T00:00:00Z",
                        }),
                    ],
                    1,
                    "/v1/service-account-tokens"
                );

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountTokensApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/security/service-accounts/tokens?page=1"
                );
                expect(result.data).toHaveLength(2);
            });
        });

        describe("serviceAccountTokensApi.getById", () => {
            it("should fetch a single service account token by ID", async () => {
                const mockResponse = {
                    data: createServiceAccountTokenMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountTokensApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/security/service-accounts/tokens/1"
                );
                expect(result.data.token).toBe("sak_xxxxxxxxxxxxx");
            });
        });

        describe("serviceAccountTokensApi.create", () => {
            it("should create a new service account token", async () => {
                const createData = {
                    service_account_id: 1,
                    name: "new-token",
                    token: "sak_new_token_value",
                    expires_at: "2025-12-31T23:59:59Z",
                };

                const mockResponse = {
                    data: createServiceAccountTokenMock({
                        id: 3,
                        token: "sak_new_token_value",
                        expires_at: "2025-12-31T23:59:59Z",
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountTokensApi.create(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/security/service-accounts/tokens",
                    createData
                );
                expect(result.data.token).toBe("sak_new_token_value");
            });
        });

        describe("serviceAccountTokensApi.update", () => {
            it("should update an existing service account token", async () => {
                const updateData = {
                    expires_at: "2026-01-01T00:00:00Z",
                };

                const mockResponse = {
                    data: createServiceAccountTokenMock({
                        expires_at: "2026-01-01T00:00:00Z",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await serviceAccountTokensApi.update(
                    1,
                    updateData
                );

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/security/service-accounts/tokens/1",
                    updateData
                );
            });
        });

        describe("serviceAccountTokensApi.delete", () => {
            it("should delete a service account token", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await serviceAccountTokensApi.delete(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/security/service-accounts/tokens/1"
                );
            });
        });
    });
});
