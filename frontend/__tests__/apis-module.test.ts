/**
 * Tests for APIs module
 */

import { apisApi } from "@/lib/api";

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
    ApiError: class ApiError extends Error {
        constructor(message: string, public status: number) {
            super(message);
        }
    },
}));

import { apiClient } from "@/lib/api-client";

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Helper to create API mock data
const createApiMock = (overrides = {}) => ({
    id: 1,
    name: "users-api",
    display_name: "Users API",
    description: "API for managing users",
    url: "https://api.example.com/users",
    version: "1.0.0",
    protocol: "https" as const,
    document_specification: null,
    released_at: null,
    deprecated_at: null,
    deprecation_reason: null,
    access_policy_id: null,
    authentication_method_id: null,
    category_id: 1,
    status_id: 1,
    type_id: 1,
    deprecated_by: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper for paginated response
const createPaginatedResponse = <T>(data: T[], page = 1) => ({
    data,
    meta: {
        current_page: page,
        last_page: 1,
        per_page: 15,
        total: data.length,
        from: 1,
        to: data.length,
        path: "/v1/apis",
    },
    links: {
        first: "/v1/apis?page=1",
        last: "/v1/apis?page=1",
        prev: null,
        next: null,
    },
});

describe("APIs Module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("apisApi.getAll", () => {
        it("should fetch all APIs with pagination", async () => {
            const mockResponse = createPaginatedResponse([
                createApiMock(),
                createApiMock({
                    id: 2,
                    name: "orders-api",
                    display_name: "Orders API",
                }),
            ]);

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.getAll(1);

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/catalog/apis?page=1"
            );
            expect(result.data).toHaveLength(2);
            expect(result.data[0].name).toBe("users-api");
            expect(result.data[1].name).toBe("orders-api");
        });

        it("should handle different page numbers", async () => {
            const mockResponse = createPaginatedResponse([createApiMock()], 2);

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.getAll(2);

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/catalog/apis?page=2"
            );
            expect(result.meta.current_page).toBe(2);
        });
    });

    describe("apisApi.getById", () => {
        it("should fetch a single API by ID", async () => {
            const mockResponse = {
                data: createApiMock(),
            };

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.getById(1);

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/catalog/apis/1"
            );
            expect(result.data.name).toBe("users-api");
            expect(result.data.id).toBe(1);
        });

        it("should fetch API with all optional fields", async () => {
            const mockResponse = {
                data: createApiMock({
                    url: "https://api.example.com/v2",
                    version: "2.0.0",
                }),
            };

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.getById(1);

            expect(result.data.url).toBe("https://api.example.com/v2");
            expect(result.data.version).toBe("2.0.0");
        });
    });

    describe("apisApi.create", () => {
        it("should create a new API with required fields", async () => {
            const createData = {
                name: "new-api",
            };

            const mockResponse = {
                data: createApiMock({
                    id: 3,
                    name: "new-api",
                    display_name: null,
                }),
            };

            mockedApiClient.post.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.create(createData);

            expect(mockedApiClient.post).toHaveBeenCalledWith(
                "/v1/catalog/apis",
                createData
            );
            expect(result.data.name).toBe("new-api");
            expect(result.data.id).toBe(3);
        });

        it("should create a new API with all fields", async () => {
            const createData = {
                name: "complete-api",
                display_name: "Complete API",
                description: "A complete API with all fields",
                version: "2.0.0",
                api_url: "https://api.complete.com",
                type_id: 2,
                lifecycle_id: 3,
            };

            const mockResponse = {
                data: createApiMock(createData),
            };

            mockedApiClient.post.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.create(createData);

            expect(mockedApiClient.post).toHaveBeenCalledWith(
                "/v1/catalog/apis",
                createData
            );
            expect(result.data.display_name).toBe("Complete API");
            expect(result.data.version).toBe("2.0.0");
        });

        it("should handle API errors during creation", async () => {
            mockedApiClient.post.mockRejectedValueOnce(
                new Error("API name already exists")
            );

            await expect(apisApi.create({ name: "duplicate" })).rejects.toThrow(
                "API name already exists"
            );
        });
    });

    describe("apisApi.update", () => {
        it("should update an existing API", async () => {
            const updateData = {
                display_name: "Updated API Name",
                version: "2.0.0",
            };

            const mockResponse = {
                data: createApiMock({
                    display_name: "Updated API Name",
                    version: "2.0.0",
                    updated_at: "2024-01-02T00:00:00Z",
                }),
            };

            mockedApiClient.put.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.update(1, updateData);

            expect(mockedApiClient.put).toHaveBeenCalledWith(
                "/v1/catalog/apis/1",
                updateData
            );
            expect(result.data.display_name).toBe("Updated API Name");
            expect(result.data.version).toBe("2.0.0");
        });

        it("should handle partial updates", async () => {
            const updateData = {
                description: "Only updating description",
            };

            const mockResponse = {
                data: createApiMock({
                    description: "Only updating description",
                }),
            };

            mockedApiClient.put.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.update(1, updateData);

            expect(result.data.description).toBe("Only updating description");
        });
    });

    describe("apisApi.delete", () => {
        it("should delete an API", async () => {
            mockedApiClient.delete.mockResolvedValueOnce(undefined);

            await apisApi.delete(1);

            expect(mockedApiClient.delete).toHaveBeenCalledWith(
                "/v1/catalog/apis/1"
            );
        });

        it("should handle delete errors", async () => {
            mockedApiClient.delete.mockRejectedValueOnce(
                new Error("API not found")
            );

            await expect(apisApi.delete(999)).rejects.toThrow("API not found");
        });
    });
});
