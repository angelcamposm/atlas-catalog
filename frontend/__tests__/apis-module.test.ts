/**
 * Tests for the APIs API module (`lib/api/apis.ts`).
 *
 * Verifies URL composition and delegation to `apiClient`. HTTP is mocked.
 * Mirrors the lean pattern of `components-module.test.ts`.
 */

import { apisApi } from "@/lib/api/apis";

// ---------------------------------------------------------------------------
// Mock apiClient
// ---------------------------------------------------------------------------

jest.mock("@/lib/api-client", () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
    ApiError: class ApiError extends Error {
        constructor(
            message: string,
            public status: number,
        ) {
            super(message);
        }
    },
}));

import { apiClient } from "@/lib/api-client";

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPut = apiClient.put as jest.Mock;
const mockDelete = apiClient.delete as jest.Mock;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const paginatedEnvelope = {
    data: [],
    meta: {
        current_page: 1,
        from: 0,
        to: 0,
        per_page: 15,
        total: 0,
        last_page: 1,
        path: "/api/v1/catalog/apis",
    },
    links: { first: "", last: "", prev: null, next: null },
};

const singleEnvelope = {
    data: {
        id: 1,
        name: "users-api",
        display_name: "Users API",
    },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("apisApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGet.mockResolvedValue(paginatedEnvelope);
        mockPost.mockResolvedValue(singleEnvelope);
        mockPut.mockResolvedValue(singleEnvelope);
        mockDelete.mockResolvedValue(undefined);
    });

    describe("getAll", () => {
        it("requests the collection with no query when params are empty", async () => {
            await apisApi.getAll();
            expect(mockGet).toHaveBeenCalledWith("/v1/catalog/apis");
        });

        it("accepts a page number and encodes it as ?page=N", async () => {
            await apisApi.getAll({ page: 3 });
            expect(mockGet).toHaveBeenCalledWith("/v1/catalog/apis?page=3");
        });

        it("encodes search + multiple filters", async () => {
            await apisApi.getAll({
                search: "orders",
                category_id: 2,
                protocol: "https",
                page: 1,
            });
            const url = mockGet.mock.calls[0][0] as string;
            expect(url).toContain("search=orders");
            expect(url).toContain("category_id=2");
            expect(url).toContain("protocol=https");
            expect(url).toContain("page=1");
        });

        it("returns the paginated envelope from apiClient", async () => {
            mockGet.mockResolvedValueOnce({
                ...paginatedEnvelope,
                data: [{ id: 1, name: "users-api" }],
                meta: { ...paginatedEnvelope.meta, total: 1 },
            });
            const result = await apisApi.getAll();
            expect(result.data).toHaveLength(1);
            expect(result.meta.total).toBe(1);
        });
    });

    describe("getById", () => {
        it("requests /v1/catalog/apis/{id}", async () => {
            mockGet.mockResolvedValueOnce(singleEnvelope);
            await apisApi.getById(42);
            expect(mockGet).toHaveBeenCalledWith("/v1/catalog/apis/42");
        });

        it("appends ?with=... when relations are passed", async () => {
            mockGet.mockResolvedValueOnce(singleEnvelope);
            await apisApi.getById(42, ["category", "type"]);
            const url = mockGet.mock.calls[0][0] as string;
            expect(url.startsWith("/v1/catalog/apis/42?")).toBe(true);
            expect(url).toContain("with");
            expect(url).toContain("category");
            expect(url).toContain("type");
        });

        it("returns the resource envelope", async () => {
            mockGet.mockResolvedValueOnce(singleEnvelope);
            const result = await apisApi.getById(1);
            expect(result.data.name).toBe("users-api");
        });
    });

    describe("create", () => {
        it("POSTs to /v1/catalog/apis with the payload", async () => {
            mockPost.mockResolvedValueOnce(singleEnvelope);
            await apisApi.create({ name: "new-api" });
            expect(mockPost).toHaveBeenCalledWith("/v1/catalog/apis", {
                name: "new-api",
            });
        });

        it("returns the created resource", async () => {
            mockPost.mockResolvedValueOnce({
                data: { id: 9, name: "new-api" },
            });
            const result = await apisApi.create({ name: "new-api" });
            expect(result.data.id).toBe(9);
        });
    });

    describe("update", () => {
        it("PUTs to /v1/catalog/apis/{id} with the payload", async () => {
            mockPut.mockResolvedValueOnce(singleEnvelope);
            await apisApi.update(1, { display_name: "Updated" });
            expect(mockPut).toHaveBeenCalledWith("/v1/catalog/apis/1", {
                display_name: "Updated",
            });
        });
    });

    describe("delete", () => {
        it("DELETEs /v1/catalog/apis/{id}", async () => {
            await apisApi.delete(7);
            expect(mockDelete).toHaveBeenCalledWith("/v1/catalog/apis/7");
        });
    });

    describe("getComponents", () => {
        it("requests /v1/catalog/apis/{id}/components", async () => {
            mockGet.mockResolvedValueOnce(paginatedEnvelope);
            await apisApi.getComponents(42);
            expect(mockGet).toHaveBeenCalledWith(
                "/v1/catalog/apis/42/components",
            );
        });
    });
});
/**
 * Tests for APIs module
 */

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

            const result = await apisApi.getAll({ page: 1 });

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/catalog/apis?page=1",
            );
            expect(result.data).toHaveLength(2);
            expect(result.data[0].name).toBe("users-api");
            expect(result.data[1].name).toBe("orders-api");
        });

        it("should handle different page numbers", async () => {
            const mockResponse = createPaginatedResponse([createApiMock()], 2);

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.getAll({ page: 2 });

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/catalog/apis?page=2",
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
                "/v1/catalog/apis/1",
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
                createData,
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
                createData,
            );
            expect(result.data.display_name).toBe("Complete API");
            expect(result.data.version).toBe("2.0.0");
        });

        it("should handle API errors during creation", async () => {
            mockedApiClient.post.mockRejectedValueOnce(
                new Error("API name already exists"),
            );

            await expect(apisApi.create({ name: "duplicate" })).rejects.toThrow(
                "API name already exists",
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
                updateData,
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
                "/v1/catalog/apis/1",
            );
        });

        it("should handle delete errors", async () => {
            mockedApiClient.delete.mockRejectedValueOnce(
                new Error("API not found"),
            );

            await expect(apisApi.delete(999)).rejects.toThrow("API not found");
        });
    });

    describe("apisApi.getComponents", () => {
        const createComponentMock = (overrides = {}) => ({
            id: 10,
            name: "users-service",
            slug: "users-service",
            display_name: null,
            description: null,
            domain_id: null,
            platform_id: null,
            lifecycle_id: null,
            tier_id: null,
            type_id: null,
            status_id: null,
            operational_status_id: null,
            owner_id: null,
            criticality_id: null,
            has_zero_downtime_deployment: false,
            is_stateless: false,
            discovery_source: null,
            tags: null,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            created_by: 1,
            updated_by: 1,
            ...overrides,
        });

        it("should fetch components for a given API ID", async () => {
            const mockResponse = createPaginatedResponse([
                createComponentMock(),
            ]);

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.getComponents(42);

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/catalog/apis/42/components",
            );
            expect(result.data).toHaveLength(1);
            expect(result.data[0].name).toBe("users-service");
        });

        it("should return empty data when no components are associated", async () => {
            const mockResponse = {
                data: [],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 15,
                    total: 0,
                    from: null,
                    to: null,
                    path: "/v1/apis/1/components",
                },
                links: {
                    first: "/v1/apis/1/components?page=1",
                    last: "/v1/apis/1/components?page=1",
                    prev: null,
                    next: null,
                },
            };

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await apisApi.getComponents(1);

            expect(result.data).toHaveLength(0);
            expect(result.meta.total).toBe(0);
        });
    });
});
