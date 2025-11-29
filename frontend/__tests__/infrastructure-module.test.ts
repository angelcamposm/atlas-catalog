/**
 * Tests for Infrastructure module (Clusters, Cluster Types, Nodes, Infrastructure Types)
 */

import {
    clustersApi,
    clusterTypesApi,
    nodesApi,
} from "@/lib/api/infrastructure";
import { infrastructureTypesApi } from "@/lib/api/infrastructure-types";

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

// Helper to create cluster mock data
const createClusterMock = (overrides = {}) => ({
    id: 1,
    name: "prod-cluster-01",
    display_name: "Production Cluster 01",
    description: "Main production Kubernetes cluster",
    cluster_url: "https://cluster.example.com",
    cluster_type_id: 1,
    lifecycle_id: 2,
    has_licensing: true,
    licensing_model: "openshift",
    vendor_id: 1,
    infrastructure_type_id: 1,
    tags: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create cluster type mock data
const createClusterTypeMock = (overrides = {}) => ({
    id: 1,
    name: "kubernetes",
    display_name: "Kubernetes",
    description: "Container orchestration platform",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create node mock data
const createNodeMock = (overrides = {}) => ({
    id: 1,
    name: "node-01",
    cpu_architecture: "x86-64",
    cpu_count: 8,
    cpu_sockets: 2,
    cpu_type: "Intel Xeon",
    discovery_source: null,
    fqdn: "node-01.cluster.local",
    ip_address: "192.168.1.100",
    is_virtual: true,
    lifecycle_id: 1,
    mac_address: "00:11:22:33:44:55",
    mac_address_ipv6: null,
    memory_bytes: 17179869184,
    node_type: "V",
    operational_status_id: 1,
    os: "Linux",
    os_version: "Ubuntu 22.04",
    stm_enabled: false,
    timezone: "UTC",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create infrastructure type mock data
const createInfrastructureTypeMock = (overrides = {}) => ({
    id: 1,
    name: "cloud",
    display_name: "Cloud Infrastructure",
    description: "Cloud-based infrastructure",
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
    path: string = "/v1/clusters"
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

describe("Infrastructure Module", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Clusters API", () => {
        describe("clustersApi.getAll", () => {
            it("should fetch all clusters with pagination", async () => {
                const mockResponse = createPaginatedResponse([
                    createClusterMock(),
                    createClusterMock({
                        id: 2,
                        name: "staging-cluster-01",
                        display_name: "Staging Cluster 01",
                    }),
                ]);

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await clustersApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/clusters?page=1"
                );
                expect(result.data).toHaveLength(2);
                expect(result.data[0].name).toBe("prod-cluster-01");
            });

            it("should handle custom page numbers", async () => {
                const mockResponse = createPaginatedResponse(
                    [createClusterMock()],
                    5
                );

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await clustersApi.getAll(5);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/clusters?page=5"
                );
                expect(result.meta.current_page).toBe(5);
            });
        });

        describe("clustersApi.getById", () => {
            it("should fetch a single cluster by ID", async () => {
                const mockResponse = {
                    data: createClusterMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await clustersApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/clusters/1"
                );
                expect(result.data.name).toBe("prod-cluster-01");
                expect(result.data.has_licensing).toBe(true);
            });
        });

        describe("clustersApi.create", () => {
            it("should create a new cluster with all fields", async () => {
                const createData = {
                    name: "new-cluster",
                    display_name: "New Cluster",
                    description: "A new test cluster",
                    cluster_url: "https://new.cluster.com",
                    cluster_type_id: 1,
                    lifecycle_id: 1,
                    has_licensing: true,
                    licensing_model: "openshift",
                    vendor_id: 2,
                    infrastructure_type_id: 1,
                    tags: "production,critical",
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
                expect(result.data.name).toBe("new-cluster");
                expect(result.data.has_licensing).toBe(true);
            });

            it("should create a cluster with minimal required fields", async () => {
                const createData = {
                    name: "minimal-cluster",
                };

                const mockResponse = {
                    data: createClusterMock({
                        id: 4,
                        name: "minimal-cluster",
                        display_name: null,
                        has_licensing: false,
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await clustersApi.create(createData);

                expect(result.data.name).toBe("minimal-cluster");
            });
        });

        describe("clustersApi.update", () => {
            it("should update an existing cluster", async () => {
                const updateData = {
                    display_name: "Updated Cluster Name",
                    has_licensing: false,
                };

                const mockResponse = {
                    data: createClusterMock({
                        display_name: "Updated Cluster Name",
                        has_licensing: false,
                        updated_at: "2024-01-02T00:00:00Z",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await clustersApi.update(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/clusters/1",
                    updateData
                );
                expect(result.data.has_licensing).toBe(false);
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
        describe("clusterTypesApi.getAll", () => {
            it("should fetch all cluster types", async () => {
                const mockResponse = createPaginatedResponse(
                    [
                        createClusterTypeMock(),
                        createClusterTypeMock({
                            id: 2,
                            name: "openshift",
                            display_name: "OpenShift",
                        }),
                    ],
                    1,
                    "/v1/clusters/types"
                );

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await clusterTypesApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/clusters/types?page=1"
                );
                expect(result.data).toHaveLength(2);
            });
        });

        describe("clusterTypesApi.getById", () => {
            it("should fetch a single cluster type by ID", async () => {
                const mockResponse = {
                    data: createClusterTypeMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await clusterTypesApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/clusters/types/1"
                );
                expect(result.data.name).toBe("kubernetes");
            });
        });

        describe("clusterTypesApi.create", () => {
            it("should create a new cluster type", async () => {
                const createData = {
                    name: "swarm",
                    display_name: "Docker Swarm",
                    description: "Docker Swarm cluster",
                };

                const mockResponse = {
                    data: createClusterTypeMock({
                        id: 3,
                        ...createData,
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await clusterTypesApi.create(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/clusters/types",
                    createData
                );
                expect(result.data.name).toBe("swarm");
            });
        });

        describe("clusterTypesApi.update", () => {
            it("should update an existing cluster type", async () => {
                const updateData = {
                    description: "Updated description",
                };

                const mockResponse = {
                    data: createClusterTypeMock({
                        description: "Updated description",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await clusterTypesApi.update(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/clusters/types/1",
                    updateData
                );
            });
        });

        describe("clusterTypesApi.delete", () => {
            it("should delete a cluster type", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await clusterTypesApi.delete(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/clusters/types/1"
                );
            });
        });
    });

    describe("Nodes API", () => {
        describe("nodesApi.getAll", () => {
            it("should fetch all nodes", async () => {
                const mockResponse = createPaginatedResponse(
                    [
                        createNodeMock(),
                        createNodeMock({
                            id: 2,
                            name: "node-02",
                            ip_address: "192.168.1.102",
                        }),
                    ],
                    1,
                    "/v1/nodes"
                );

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await nodesApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/nodes?page=1"
                );
                expect(result.data).toHaveLength(2);
            });
        });

        describe("nodesApi.getById", () => {
            it("should fetch a single node by ID", async () => {
                const mockResponse = {
                    data: createNodeMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await nodesApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith("/v1/nodes/1");
                expect(result.data.name).toBe("node-01");
            });
        });

        describe("nodesApi.create", () => {
            it("should create a new node", async () => {
                const createData = {
                    name: "node-03",
                    cpu_cores: 4,
                    cpu_threads: 8,
                    os: "Linux",
                    os_version: "Ubuntu 22.04",
                    ip_address: "192.168.1.103",
                    cpu_architecture: "x86-64",
                    is_virtual: true,
                };

                const mockResponse = {
                    data: createNodeMock({
                        id: 3,
                        name: "node-03",
                        ip_address: "192.168.1.103",
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await nodesApi.create(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/nodes",
                    createData
                );
                expect(result.data.name).toBe("node-03");
            });
        });

        describe("nodesApi.update", () => {
            it("should update an existing node", async () => {
                const updateData = {
                    os_version: "Ubuntu 24.04",
                };

                const mockResponse = {
                    data: createNodeMock({
                        os_version: "Ubuntu 24.04",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await nodesApi.update(1, updateData);

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/nodes/1",
                    updateData
                );
            });
        });

        describe("nodesApi.delete", () => {
            it("should delete a node", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await nodesApi.delete(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/nodes/1"
                );
            });
        });
    });

    describe("Infrastructure Types API", () => {
        describe("infrastructureTypesApi.getAll", () => {
            it("should fetch all infrastructure types", async () => {
                const mockResponse = createPaginatedResponse(
                    [
                        createInfrastructureTypeMock(),
                        createInfrastructureTypeMock({
                            id: 2,
                            name: "on-premise",
                            display_name: "On-Premise",
                        }),
                        createInfrastructureTypeMock({
                            id: 3,
                            name: "hybrid",
                            display_name: "Hybrid",
                        }),
                    ],
                    1,
                    "/v1/infrastructure-types"
                );

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await infrastructureTypesApi.getAll(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/infrastructure-types?page=1"
                );
                expect(result.data).toHaveLength(3);
            });
        });

        describe("infrastructureTypesApi.getById", () => {
            it("should fetch a single infrastructure type by ID", async () => {
                const mockResponse = {
                    data: createInfrastructureTypeMock(),
                };

                mockedApiClient.get.mockResolvedValueOnce(mockResponse);

                const result = await infrastructureTypesApi.getById(1);

                expect(mockedApiClient.get).toHaveBeenCalledWith(
                    "/v1/infrastructure-types/1"
                );
                expect(result.data.name).toBe("cloud");
            });
        });

        describe("infrastructureTypesApi.create", () => {
            it("should create a new infrastructure type", async () => {
                const createData = {
                    name: "edge",
                    display_name: "Edge Computing",
                    description: "Edge infrastructure for IoT",
                };

                const mockResponse = {
                    data: createInfrastructureTypeMock({
                        id: 4,
                        ...createData,
                    }),
                };

                mockedApiClient.post.mockResolvedValueOnce(mockResponse);

                const result = await infrastructureTypesApi.create(createData);

                expect(mockedApiClient.post).toHaveBeenCalledWith(
                    "/v1/infrastructure-types",
                    createData
                );
                expect(result.data.name).toBe("edge");
            });
        });

        describe("infrastructureTypesApi.update", () => {
            it("should update an existing infrastructure type", async () => {
                const updateData = {
                    description: "Updated cloud description",
                };

                const mockResponse = {
                    data: createInfrastructureTypeMock({
                        description: "Updated cloud description",
                    }),
                };

                mockedApiClient.put.mockResolvedValueOnce(mockResponse);

                const result = await infrastructureTypesApi.update(
                    1,
                    updateData
                );

                expect(mockedApiClient.put).toHaveBeenCalledWith(
                    "/v1/infrastructure-types/1",
                    updateData
                );
            });
        });

        describe("infrastructureTypesApi.delete", () => {
            it("should delete an infrastructure type", async () => {
                mockedApiClient.delete.mockResolvedValueOnce(undefined);

                await infrastructureTypesApi.delete(1);

                expect(mockedApiClient.delete).toHaveBeenCalledWith(
                    "/v1/infrastructure-types/1"
                );
            });
        });
    });
});
