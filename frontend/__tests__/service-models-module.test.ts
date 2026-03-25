/**
 * Tests for Service Models module
 */

import { serviceModelsApi } from "@/lib/api/service-models";

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
        constructor(
            message: string,
            public status: number,
        ) {
            super(message);
        }
    },
}));

import { apiClient } from "@/lib/api-client";

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const createServiceModelMock = (overrides = {}) => ({
    id: 1,
    name: "REST",
    description: "RESTful service model",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

describe("Service Models Module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Structure", () => {
        it("should export serviceModelsApi with required methods", () => {
            expect(serviceModelsApi.getAll).toBeDefined();
            expect(serviceModelsApi.getById).toBeDefined();
            expect(serviceModelsApi.create).toBeDefined();
            expect(serviceModelsApi.update).toBeDefined();
            expect(serviceModelsApi.delete).toBeDefined();
        });
    });

    describe("serviceModelsApi.getAll", () => {
        it("should fetch all service models with pagination", async () => {
            const mockItem = createServiceModelMock();
            mockedApiClient.get.mockResolvedValueOnce({
                data: [mockItem],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 15,
                    total: 1,
                    from: 1,
                    to: 1,
                    path: "/api/v1/catalog/service-models",
                },
                links: { first: "", last: "", prev: null, next: null },
            });

            const result = await serviceModelsApi.getAll();
            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/catalog/service-models?page=1",
            );
            expect(result.data).toHaveLength(1);
            expect(result.data[0].name).toBe("REST");
        });
    });

    describe("serviceModelsApi.getById", () => {
        it("should fetch a single service model by ID", async () => {
            const mockItem = createServiceModelMock();
            mockedApiClient.get.mockResolvedValueOnce({ data: mockItem });

            const result = await serviceModelsApi.getById(1);
            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/catalog/service-models/1",
            );
            expect(result.data.name).toBe("REST");
        });
    });

    describe("serviceModelsApi.create", () => {
        it("should create a new service model", async () => {
            const newItem = { name: "gRPC", description: "gRPC service model" };
            const mockItem = createServiceModelMock({ ...newItem, id: 2 });
            mockedApiClient.post.mockResolvedValueOnce({ data: mockItem });

            const result = await serviceModelsApi.create(newItem);
            expect(mockedApiClient.post).toHaveBeenCalledWith(
                "/v1/catalog/service-models",
                newItem,
            );
            expect(result.data.name).toBe("gRPC");
        });
    });

    describe("serviceModelsApi.update", () => {
        it("should update an existing service model", async () => {
            const updates = { name: "REST v2" };
            const mockItem = createServiceModelMock({ ...updates });
            mockedApiClient.put.mockResolvedValueOnce({ data: mockItem });

            const result = await serviceModelsApi.update(1, updates);
            expect(mockedApiClient.put).toHaveBeenCalledWith(
                "/v1/catalog/service-models/1",
                updates,
            );
            expect(result.data.name).toBe("REST v2");
        });
    });

    describe("serviceModelsApi.delete", () => {
        it("should delete a service model", async () => {
            mockedApiClient.delete.mockResolvedValueOnce(undefined);

            await serviceModelsApi.delete(1);
            expect(mockedApiClient.delete).toHaveBeenCalledWith(
                "/v1/catalog/service-models/1",
            );
        });
    });
});
