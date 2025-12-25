/**
 * Tests for Integration module (Links and Link Types)
 */

import { linksApi, linkTypesApi, integrationApi } from "@/lib/api";

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

// Helper to create link mock data
const createLinkMock = (overrides = {}) => ({
    id: 1,
    type_id: 1,
    model_name: "Api",
    model_id: 1,
    name: "api-database-link",
    description: "Link between API and Database",
    url: "https://docs.example.com/integration",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create link type mock data
const createLinkTypeMock = (overrides = {}) => ({
    id: 1,
    name: "depends-on",
    description: "Dependency relationship",
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
    path: string = "/v1/links"
) => ({
    data,
    meta: {
        current_page: page,
        last_page: 1,
        per_page: 15,
        total: data.length,
        from: 1,
        to: data.length,
        path,
    },
    links: {
        first: `${path}?page=1`,
        last: `${path}?page=1`,
        prev: null,
        next: null,
    },
});

describe("Integration Module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Links API", () => {
        describe("linksApi.getAll", () => {
            it("should fetch all links with pagination", async () => {
                const mockResponse = createPaginatedResponse([
                    createLinkMock(),
                    createLinkMock({
                        id: 2,
                        name: "api-cache-link",
                        target_linkable_type: "Cache",
                    }),
                ]);

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await linksApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/catalog/links?page=1"
                );
                expect(result.data).toHaveLength(2);
                expect(result.data[0].name).toBe("api-database-link");
            });

            it("should handle empty results", async () => {
                const mockResponse = createPaginatedResponse([]);

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await linksApi.getAll(1);

                expect(result.data).toHaveLength(0);
                expect(result.meta.total).toBe(0);
            });
        });

        describe("linksApi.getById", () => {
            it("should fetch a single link by ID", async () => {
                const mockResponse = {
                    data: createLinkMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await linksApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith("/v1/catalog/links/1");
                expect(result.data.name).toBe("api-database-link");
            });

            it("should handle link with all fields populated", async () => {
                const mockResponse = {
                    data: createLinkMock({
                        description: "Complex link description",
                        metadata: { priority: "high" },
                    }),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await linksApi.getById(1);

                expect(result.data.description).toBe(
                    "Complex link description"
                );
            });
        });

        describe("linksApi.create", () => {
            it("should create a new link with required fields", async () => {
                const createData = {
                    name: "new-link",
                    url: "https://example.com/link",
                };

                const mockResponse = {
                    data: createLinkMock({
                        id: 3,
                        ...createData,
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await linksApi.create(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/catalog/links",
                    createData
                );
                expect(result.data.name).toBe("new-link");
            });

            it("should create a link with optional description", async () => {
                const createData = {
                    name: "documented-link",
                    url: "https://example.com/documented-link",
                    description: "API publishes messages to this queue",
                };

                const mockResponse = {
                    data: createLinkMock(createData),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await linksApi.create(createData);

                expect(result.data.description).toBe(
                    "API publishes messages to this queue"
                );
                expect(result.data.name).toBe("documented-link");
            });
        });

        describe("linksApi.update", () => {
            it("should update an existing link", async () => {
                const updateData = {
                    description: "Updated link description",
                };

                const mockResponse = {
                    data: createLinkMock({
                        description: "Updated link description",
                        updated_at: "2024-01-02T00:00:00Z",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await linksApi.update(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/catalog/links/1",
                    updateData
                );
                expect(result.data.description).toBe(
                    "Updated link description"
                );
            });
        });

        describe("linksApi.delete", () => {
            it("should delete a link", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await linksApi.delete(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/catalog/links/1"
                );
            });
        });
    });

    describe("Link Types API", () => {
        describe("linkTypesApi.getAll", () => {
            it("should fetch all link types", async () => {
                const mockResponse = createPaginatedResponse(
                    [
                        createLinkTypeMock(),
                        createLinkTypeMock({
                            id: 2,
                            name: "uses",
                            description: "Usage relationship",
                        }),
                    ],
                    1,
                    "/v1/links/categories"
                );

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await linkTypesApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/catalog/links/categories?page=1"
                );
                expect(result.data).toHaveLength(2);
                expect(result.data[0].name).toBe("depends-on");
            });
        });

        describe("linkTypesApi.getById", () => {
            it("should fetch a single link type by ID", async () => {
                const mockResponse = {
                    data: createLinkTypeMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await linkTypesApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/catalog/links/categories/1"
                );
                expect(result.data.name).toBe("depends-on");
            });
        });

        describe("linkTypesApi.create", () => {
            it("should create a new link type", async () => {
                const createData = {
                    name: "communicates-with",
                    description: "Communication channel",
                };

                const mockResponse = {
                    data: createLinkTypeMock({
                        id: 3,
                        ...createData,
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await linkTypesApi.create(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/catalog/links/categories",
                    createData
                );
                expect(result.data.name).toBe("communicates-with");
            });
        });

        describe("linkTypesApi.update", () => {
            it("should update an existing link type", async () => {
                const updateData = {
                    description: "Updated description",
                };

                const mockResponse = {
                    data: createLinkTypeMock({
                        description: "Updated description",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await linkTypesApi.update(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/catalog/links/categories/1",
                    updateData
                );
                expect(result.data.description).toBe("Updated description");
            });
        });

        describe("linkTypesApi.delete", () => {
            it("should delete a link type", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await linkTypesApi.delete(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/catalog/links/categories/1"
                );
            });
        });
    });

    describe("Consolidated Integration API", () => {
        it("should export links API", () => {
            expect(integrationApi.links).toBe(linksApi);
        });

        it("should export linkTypes API", () => {
            expect(integrationApi.linkTypes).toBe(linkTypesApi);
        });

        it("should have all expected methods on links", () => {
            expect(integrationApi.links.getAll).toBeDefined();
            expect(integrationApi.links.getById).toBeDefined();
            expect(integrationApi.links.create).toBeDefined();
            expect(integrationApi.links.update).toBeDefined();
            expect(integrationApi.links.delete).toBeDefined();
        });

        it("should have all expected methods on linkTypes", () => {
            expect(integrationApi.linkTypes.getAll).toBeDefined();
            expect(integrationApi.linkTypes.getById).toBeDefined();
            expect(integrationApi.linkTypes.create).toBeDefined();
            expect(integrationApi.linkTypes.update).toBeDefined();
            expect(integrationApi.linkTypes.delete).toBeDefined();
        });
    });
});
