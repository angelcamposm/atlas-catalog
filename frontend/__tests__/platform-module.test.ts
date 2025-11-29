/**
 * Tests for Platform module (Platforms and Component Types)
 */

import { platformsApi, componentTypesApi, platformApi } from "@/lib/api";

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

// Helper to create platform mock data
const createPlatformMock = (overrides = {}) => ({
    id: 1,
    name: "aws-platform",
    description: "Amazon Web Services cloud platform",
    icon: "aws",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create component type mock data
const createComponentTypeMock = (overrides = {}) => ({
    id: 1,
    name: "database",
    description: "Database component type",
    icon: "database",
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
    path: string = "/v1/platforms"
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

describe("Platform Module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Platforms API", () => {
        describe("platformsApi.getAll", () => {
            it("should fetch all platforms with pagination", async () => {
                const mockResponse = createPaginatedResponse([
                    createPlatformMock(),
                    createPlatformMock({
                        id: 2,
                        name: "azure-platform",
                        display_name: "Azure Platform",
                    }),
                    createPlatformMock({
                        id: 3,
                        name: "gcp-platform",
                        display_name: "Google Cloud Platform",
                    }),
                ]);

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await platformsApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/platforms?page=1"
                );
                expect(result.data).toHaveLength(3);
                expect(result.data[0].name).toBe("aws-platform");
                expect(result.data[1].name).toBe("azure-platform");
            });

            it("should handle pagination parameters", async () => {
                const mockResponse = createPaginatedResponse(
                    [createPlatformMock()],
                    3
                );

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await platformsApi.getAll(3);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/platforms?page=3"
                );
                expect(result.meta.current_page).toBe(3);
            });

            it("should handle empty results", async () => {
                const mockResponse = createPaginatedResponse([]);

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await platformsApi.getAll(1);

                expect(result.data).toHaveLength(0);
            });
        });

        describe("platformsApi.getById", () => {
            it("should fetch a single platform by ID", async () => {
                const mockResponse = {
                    data: createPlatformMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await platformsApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/platforms/1"
                );
                expect(result.data.name).toBe("aws-platform");
                expect(result.data.description).toBe(
                    "Amazon Web Services cloud platform"
                );
            });

            it("should handle platform with all fields", async () => {
                const mockResponse = {
                    data: createPlatformMock({
                        icon: "custom-icon",
                        description: "Full featured platform",
                    }),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await platformsApi.getById(1);

                expect(result.data.icon).toBe("custom-icon");
                expect(result.data.description).toBe("Full featured platform");
            });
        });

        describe("platformsApi.create", () => {
            it("should create a new platform with required fields", async () => {
                const createData = {
                    name: "new-platform",
                };

                const mockResponse = {
                    data: createPlatformMock({
                        id: 4,
                        name: "new-platform",
                        description: null,
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await platformsApi.create(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/platforms",
                    createData
                );
                expect(result.data.name).toBe("new-platform");
            });

            it("should create a platform with all optional fields", async () => {
                const createData = {
                    name: "complete-platform",
                    description: "A fully configured platform",
                    icon: "custom-icon",
                };

                const mockResponse = {
                    data: createPlatformMock(createData),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await platformsApi.create(createData);

                expect(result.data.description).toBe(
                    "A fully configured platform"
                );
                expect(result.data.icon).toBe("custom-icon");
            });

            it("should handle creation errors", async () => {
                mockedApiClient.post.mockRejectedValueOnce(
                    new Error("Platform name already exists")
                );

                await expect(
                    platformsApi.create({ name: "duplicate" })
                ).rejects.toThrow("Platform name already exists");
            });
        });

        describe("platformsApi.update", () => {
            it("should update an existing platform", async () => {
                const updateData = {
                    icon: "updated-icon",
                    description: "Updated description",
                };

                const mockResponse = {
                    data: createPlatformMock({
                        icon: "updated-icon",
                        description: "Updated description",
                        updated_at: "2024-01-02T00:00:00Z",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await platformsApi.update(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/platforms/1",
                    updateData
                );
                expect(result.data.description).toBe("Updated description");
            });
        });

        describe("platformsApi.delete", () => {
            it("should delete a platform", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await platformsApi.delete(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/platforms/1"
                );
            });

            it("should handle deletion errors", async () => {
                mockedApiClient.delete.mockRejectedValueOnce(
                    new Error(
                        "Cannot delete platform with associated resources"
                    )
                );

                await expect(platformsApi.delete(1)).rejects.toThrow(
                    "Cannot delete platform with associated resources"
                );
            });
        });
    });

    describe("Component Types API", () => {
        describe("componentTypesApi.getAll", () => {
            it("should fetch all component types", async () => {
                const mockResponse = createPaginatedResponse(
                    [
                        createComponentTypeMock(),
                        createComponentTypeMock({
                            id: 2,
                            name: "cache",
                            description: "Cache component",
                        }),
                        createComponentTypeMock({
                            id: 3,
                            name: "queue",
                            description: "Message Queue",
                        }),
                    ],
                    1,
                    "/v1/component-types"
                );

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await componentTypesApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/component-types?page=1"
                );
                expect(result.data).toHaveLength(3);
            });
        });

        describe("componentTypesApi.getById", () => {
            it("should fetch a single component type by ID", async () => {
                const mockResponse = {
                    data: createComponentTypeMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await componentTypesApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/component-types/1"
                );
                expect(result.data.name).toBe("database");
            });
        });

        describe("componentTypesApi.create", () => {
            it("should create a new component type", async () => {
                const createData = {
                    name: "storage",
                    description: "File and object storage",
                    icon: "folder",
                };

                const mockResponse = {
                    data: createComponentTypeMock({
                        id: 4,
                        ...createData,
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await componentTypesApi.create(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/component-types",
                    createData
                );
                expect(result.data.name).toBe("storage");
            });
        });

        describe("componentTypesApi.update", () => {
            it("should update an existing component type", async () => {
                const updateData = {
                    icon: "new-icon",
                };

                const mockResponse = {
                    data: createComponentTypeMock({
                        icon: "new-icon",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await componentTypesApi.update(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/component-types/1",
                    updateData
                );
                expect(result.data.icon).toBe("new-icon");
            });
        });

        describe("componentTypesApi.delete", () => {
            it("should delete a component type", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await componentTypesApi.delete(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/component-types/1"
                );
            });
        });
    });

    describe("Consolidated Platform API", () => {
        it("should export platforms API", () => {
            expect(platformApi.platforms).toBe(platformsApi);
        });

        it("should export componentTypes API", () => {
            expect(platformApi.componentTypes).toBe(componentTypesApi);
        });

        it("should have all expected methods on platforms", () => {
            expect(platformApi.platforms.getAll).toBeDefined();
            expect(platformApi.platforms.getById).toBeDefined();
            expect(platformApi.platforms.create).toBeDefined();
            expect(platformApi.platforms.update).toBeDefined();
            expect(platformApi.platforms.delete).toBeDefined();
        });

        it("should have all expected methods on componentTypes", () => {
            expect(platformApi.componentTypes.getAll).toBeDefined();
            expect(platformApi.componentTypes.getById).toBeDefined();
            expect(platformApi.componentTypes.create).toBeDefined();
            expect(platformApi.componentTypes.update).toBeDefined();
            expect(platformApi.componentTypes.delete).toBeDefined();
        });
    });
});
