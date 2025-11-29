/**
 * Unit tests for Infrastructure Dashboard/Overview page
 */

import { clustersApi, nodesApi } from "@/lib/api/infrastructure";

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
    name: "test-cluster",
    display_name: "Test Cluster",
    api_url: "https://api.test.cluster.com",
    cluster_uuid: "123e4567-e89b-12d3-a456-426614174000",
    full_version: "1.28.0",
    has_licensing: false,
    infrastructure_type_id: 1,
    licensing_model: null,
    lifecycle_id: 1,
    tags: null,
    timezone: "UTC",
    type_id: 1,
    url: "https://test.cluster.com",
    vendor_id: 1,
    version: "1.28",
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

describe("Infrastructure Dashboard API Integration", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Dashboard Data Loading", () => {
        it("should fetch clusters and nodes in parallel", async () => {
            const clusterResponse = createPaginatedResponse([
                createClusterMock({ id: 1, name: "cluster-1" }),
                createClusterMock({ id: 2, name: "cluster-2" }),
            ]);

            const nodeResponse = createPaginatedResponse(
                [
                    createNodeMock({ id: 1, name: "node-1" }),
                    createNodeMock({ id: 2, name: "node-2" }),
                    createNodeMock({ id: 3, name: "node-3" }),
                ],
                1,
                "/v1/nodes"
            );

            mockedApiClient.get
                .mockResolvedValueOnce(clusterResponse)
                .mockResolvedValueOnce(nodeResponse);

            // Simulate parallel loading like the dashboard does
            const [clustersResult, nodesResult] = await Promise.all([
                clustersApi.getAll(1),
                nodesApi.getAll(1),
            ]);

            expect(clustersResult.data).toHaveLength(2);
            expect(nodesResult.data).toHaveLength(3);
        });

        it("should handle empty clusters response", async () => {
            const clusterResponse = createPaginatedResponse([]);

            mockedApiClient.get.mockResolvedValueOnce(clusterResponse);

            const result = await clustersApi.getAll(1);

            expect(result.data).toHaveLength(0);
            expect(result.meta.total).toBe(0);
        });

        it("should handle empty nodes response", async () => {
            const nodeResponse = createPaginatedResponse([], 1, "/v1/nodes");

            mockedApiClient.get.mockResolvedValueOnce(nodeResponse);

            const result = await nodesApi.getAll(1);

            expect(result.data).toHaveLength(0);
            expect(result.meta.total).toBe(0);
        });

        it("should correctly calculate stats from response", async () => {
            const clusters = [
                createClusterMock({ id: 1, name: "cluster-1" }),
                createClusterMock({ id: 2, name: "cluster-2" }),
                createClusterMock({ id: 3, name: "cluster-3" }),
            ];

            const nodes = [
                createNodeMock({ id: 1, name: "node-1" }),
                createNodeMock({ id: 2, name: "node-2" }),
                createNodeMock({ id: 3, name: "node-3" }),
                createNodeMock({ id: 4, name: "node-4" }),
            ];

            const clusterResponse = createPaginatedResponse(clusters);
            const nodeResponse = createPaginatedResponse(nodes, 1, "/v1/nodes");

            mockedApiClient.get
                .mockResolvedValueOnce(clusterResponse)
                .mockResolvedValueOnce(nodeResponse);

            const [clustersResult, nodesResult] = await Promise.all([
                clustersApi.getAll(1),
                nodesApi.getAll(1),
            ]);

            // Calculate stats like the dashboard does
            const stats = {
                totalClusters: clustersResult.data.length,
                activeClusters: clustersResult.data.length,
                totalNodes: nodesResult.data.length,
                activeNodes: nodesResult.data.length,
            };

            expect(stats.totalClusters).toBe(3);
            expect(stats.totalNodes).toBe(4);
        });
    });

    describe("Error Handling", () => {
        it("should handle API error for clusters", async () => {
            mockedApiClient.get.mockRejectedValueOnce(
                new Error("Cluster API Error")
            );

            await expect(clustersApi.getAll(1)).rejects.toThrow(
                "Cluster API Error"
            );
        });

        it("should handle API error for nodes", async () => {
            mockedApiClient.get.mockRejectedValueOnce(
                new Error("Node API Error")
            );

            await expect(nodesApi.getAll(1)).rejects.toThrow("Node API Error");
        });

        it("should handle partial failure in parallel loading", async () => {
            const clusterResponse = createPaginatedResponse([
                createClusterMock({ id: 1, name: "cluster-1" }),
            ]);

            mockedApiClient.get
                .mockResolvedValueOnce(clusterResponse)
                .mockRejectedValueOnce(new Error("Node API Error"));

            try {
                await Promise.all([clustersApi.getAll(1), nodesApi.getAll(1)]);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toBe("Node API Error");
            }
        });
    });

    describe("Cluster Data Validation", () => {
        it("should validate cluster with all fields", async () => {
            const cluster = createClusterMock({
                id: 1,
                name: "full-cluster",
                display_name: "Full Test Cluster",
                api_url: "https://api.test.com",
                version: "1.28.0",
                has_licensing: true,
                licensing_model: "openshift",
            });

            const response = createPaginatedResponse([cluster]);
            mockedApiClient.get.mockResolvedValueOnce(response);

            const result = await clustersApi.getAll(1);

            expect(result.data[0].name).toBe("full-cluster");
            expect(result.data[0].display_name).toBe("Full Test Cluster");
            expect(result.data[0].api_url).toBe("https://api.test.com");
            expect(result.data[0].version).toBe("1.28.0");
            expect(result.data[0].has_licensing).toBe(true);
        });

        it("should validate cluster with minimal fields", async () => {
            const cluster = {
                id: 1,
                name: "minimal-cluster",
                display_name: null,
                api_url: null,
                cluster_uuid: null,
                full_version: null,
                has_licensing: null,
                infrastructure_type_id: null,
                licensing_model: null,
                lifecycle_id: null,
                tags: null,
                timezone: null,
                type_id: null,
                url: null,
                vendor_id: null,
                version: null,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                created_by: null,
                updated_by: null,
            };

            const response = createPaginatedResponse([cluster]);
            mockedApiClient.get.mockResolvedValueOnce(response);

            const result = await clustersApi.getAll(1);

            expect(result.data[0].name).toBe("minimal-cluster");
            expect(result.data[0].display_name).toBeNull();
        });
    });

    describe("Node Data Validation", () => {
        it("should validate node with all fields", async () => {
            const node = createNodeMock({
                id: 1,
                name: "full-node",
                cpu_count: 16,
                memory_bytes: 68719476736,
                os: "Linux",
                os_version: "Ubuntu 24.04",
                is_virtual: false,
            });

            const response = createPaginatedResponse([node], 1, "/v1/nodes");
            mockedApiClient.get.mockResolvedValueOnce(response);

            const result = await nodesApi.getAll(1);

            expect(result.data[0].name).toBe("full-node");
            expect(result.data[0].cpu_count).toBe(16);
            expect(result.data[0].memory_bytes).toBe(68719476736);
            expect(result.data[0].is_virtual).toBe(false);
        });
    });

    describe("Pagination Support", () => {
        it("should correctly parse pagination metadata for clusters", async () => {
            const response = {
                data: [createClusterMock()],
                meta: {
                    current_page: 2,
                    last_page: 5,
                    per_page: 15,
                    total: 75,
                    from: 16,
                    to: 30,
                    path: "/v1/clusters",
                },
                links: {
                    first: "/v1/clusters?page=1",
                    last: "/v1/clusters?page=5",
                    prev: "/v1/clusters?page=1",
                    next: "/v1/clusters?page=3",
                },
            };

            mockedApiClient.get.mockResolvedValueOnce(response);

            const result = await clustersApi.getAll(2);

            expect(result.meta.current_page).toBe(2);
            expect(result.meta.last_page).toBe(5);
            expect(result.meta.total).toBe(75);
            expect(result.links.prev).toBe("/v1/clusters?page=1");
            expect(result.links.next).toBe("/v1/clusters?page=3");
        });

        it("should correctly parse pagination metadata for nodes", async () => {
            const response = {
                data: [createNodeMock()],
                meta: {
                    current_page: 1,
                    last_page: 3,
                    per_page: 15,
                    total: 45,
                    from: 1,
                    to: 15,
                    path: "/v1/nodes",
                },
                links: {
                    first: "/v1/nodes?page=1",
                    last: "/v1/nodes?page=3",
                    prev: null,
                    next: "/v1/nodes?page=2",
                },
            };

            mockedApiClient.get.mockResolvedValueOnce(response);

            const result = await nodesApi.getAll(1);

            expect(result.meta.current_page).toBe(1);
            expect(result.meta.last_page).toBe(3);
            expect(result.meta.total).toBe(45);
        });
    });
});
