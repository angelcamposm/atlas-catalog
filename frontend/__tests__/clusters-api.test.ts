/**
 * Tests for Cluster API module
 */

import { clustersApi, clusterTypesApi } from "@/lib/api";

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

// Helper to create a complete cluster mock
const createClusterMock = (overrides = {}) => ({
    id: 1,
    name: "prod-cluster",
    display_name: "Production Cluster",
    version: "1.28.0",
    full_version: "1.28.0-eks.1",
    api_url: "https://api.prod.example.com",
    url: "https://prod.example.com",
    cluster_uuid: "550e8400-e29b-41d4-a716-446655440000",
    type_id: 1,
    lifecycle_id: 1,
    vendor_id: 1,
    infrastructure_type_id: 1,
    has_licensing: true,
    licensing_model: "openshift",
    timezone: "UTC",
    tags: "production,kubernetes", // Tags is a string in the backend
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create a complete cluster type mock
const createClusterTypeMock = (overrides = {}) => ({
    id: 1,
    name: "EKS",
    description: "Amazon Elastic Kubernetes Service",
    icon: "aws",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create paginated response
const createPaginatedResponse = <T>(data: T[], page = 1) => ({
    data,
    meta: {
        current_page: page,
        last_page: 1,
        per_page: 15,
        total: data.length,
        from: 1,
        to: data.length,
        path: "/v1/clusters",
    },
    links: {
        first: "/v1/clusters?page=1",
        last: "/v1/clusters?page=1",
        prev: null,
        next: null,
    },
});

describe("Clusters API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("clustersApi.getAll", () => {
        it("should fetch all clusters with pagination", async () => {
            const mockResponse = createPaginatedResponse([createClusterMock()]);

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await clustersApi.getAll(1);

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/clusters?page=1"
            );
            expect(result.data).toHaveLength(1);
            expect(result.data[0].name).toBe("prod-cluster");
        });
    });

    describe("clustersApi.getById", () => {
        it("should fetch a single cluster by ID", async () => {
            const mockResponse = {
                data: createClusterMock(),
            };

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await clustersApi.getById(1);

            expect(mockedApiClient.get).toHaveBeenCalledWith("/v1/clusters/1");
            expect(result.data.name).toBe("prod-cluster");
        });
    });

    describe("clustersApi.create", () => {
        it("should create a new cluster with required fields only", async () => {
            const createData = {
                name: "new-cluster",
            };

            const mockResponse = {
                data: createClusterMock({
                    id: 2,
                    name: "new-cluster",
                    display_name: null,
                    version: null,
                    api_url: null,
                }),
            };

            mockedApiClient.post.mockResolvedValueOnce(mockResponse);

            const result = await clustersApi.create(createData);

            expect(mockedApiClient.post).toHaveBeenCalledWith(
                "/v1/clusters",
                createData
            );
            expect(result.data.id).toBe(2);
            expect(result.data.name).toBe("new-cluster");
        });

        it("should create a new cluster with all optional fields", async () => {
            const createData = {
                name: "full-cluster",
                display_name: "Full Production Cluster",
                version: "1.28.0",
                api_url: "https://api.prod.example.com",
                url: "https://prod.example.com",
                type_id: 1,
                lifecycle_id: 2,
                infrastructure_type_id: 3,
                vendor_id: 4,
                has_licensing: true,
                licensing_model: "openshift",
                timezone: "UTC",
                cluster_uuid: "550e8400-e29b-41d4-a716-446655440000",
            };

            const mockResponse = {
                data: createClusterMock({
                    id: 3,
                    ...createData,
                }),
            };

            mockedApiClient.post.mockResolvedValueOnce(mockResponse);

            const result = await clustersApi.create(createData);

            expect(mockedApiClient.post).toHaveBeenCalledWith(
                "/v1/clusters",
                createData
            );
            expect(result.data.name).toBe("full-cluster");
            expect(result.data.has_licensing).toBe(true);
            expect(result.data.licensing_model).toBe("openshift");
        });

        it("should handle API errors during creation", async () => {
            const createData = {
                name: "duplicate-cluster",
            };

            mockedApiClient.post.mockRejectedValueOnce(
                new Error("Cluster name already exists")
            );

            await expect(clustersApi.create(createData)).rejects.toThrow(
                "Cluster name already exists"
            );
        });
    });

    describe("clustersApi.update", () => {
        it("should update an existing cluster", async () => {
            const updateData = {
                display_name: "Updated Cluster Name",
                version: "1.29.0",
            };

            const mockResponse = {
                data: createClusterMock({
                    display_name: "Updated Cluster Name",
                    version: "1.29.0",
                    updated_at: "2024-01-02T00:00:00Z",
                }),
            };

            mockedApiClient.put.mockResolvedValueOnce(mockResponse);

            const result = await clustersApi.update(1, updateData);

            expect(mockedApiClient.put).toHaveBeenCalledWith(
                "/v1/clusters/1",
                updateData
            );
            expect(result.data.display_name).toBe("Updated Cluster Name");
            expect(result.data.version).toBe("1.29.0");
        });
    });

    describe("clustersApi.delete", () => {
        it("should delete a cluster", async () => {
            mockedApiClient.delete.mockResolvedValueOnce(undefined);

            await clustersApi.delete(1);

            expect(mockedApiClient.delete).toHaveBeenCalledWith(
                "/v1/clusters/1"
            );
        });
    });
});

describe("Cluster Types API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("clusterTypesApi.getAll", () => {
        it("should fetch all cluster types", async () => {
            const mockResponse = {
                data: [
                    createClusterTypeMock({
                        id: 1,
                        name: "EKS",
                        description: "Amazon Elastic Kubernetes Service",
                        icon: "aws",
                    }),
                    createClusterTypeMock({
                        id: 2,
                        name: "GKE",
                        description: "Google Kubernetes Engine",
                        icon: "gcp",
                    }),
                ],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 15,
                    total: 2,
                    from: 1,
                    to: 2,
                    path: "/v1/clusters/types",
                },
                links: {
                    first: "/v1/clusters/types?page=1",
                    last: "/v1/clusters/types?page=1",
                    prev: null,
                    next: null,
                },
            };

            mockedApiClient.get.mockResolvedValueOnce(mockResponse);

            const result = await clusterTypesApi.getAll(1);

            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/v1/clusters/types?page=1"
            );
            expect(result.data).toHaveLength(2);
            expect(result.data[0].name).toBe("EKS");
            expect(result.data[1].name).toBe("GKE");
        });
    });

    describe("clusterTypesApi.create", () => {
        it("should create a new cluster type", async () => {
            const createData = {
                name: "AKS",
                description: "Azure Kubernetes Service",
                icon: "azure",
            };

            const mockResponse = {
                data: createClusterTypeMock({
                    id: 3,
                    name: "AKS",
                    description: "Azure Kubernetes Service",
                    icon: "azure",
                }),
            };

            mockedApiClient.post.mockResolvedValueOnce(mockResponse);

            const result = await clusterTypesApi.create(createData);

            expect(mockedApiClient.post).toHaveBeenCalledWith(
                "/v1/clusters/types",
                createData
            );
            expect(result.data.name).toBe("AKS");
        });
    });
});
