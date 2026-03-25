/**
 * Unit tests for ClusterList component
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ClusterList } from "@/components/infrastructure/ClusterList";
import { clustersApi } from "@/lib/api";
import type { Cluster } from "@/types/api";

// Mock the API
jest.mock("@/lib/api", () => ({
    clustersApi: {
        getAll: jest.fn(),
        delete: jest.fn(),
    },
    clusterTypesApi: {
        getAll: jest.fn(),
    },
    vendorsApi: {
        getAll: jest.fn(),
    },
    lifecyclesApi: {
        getAll: jest.fn(),
    },
    infrastructureTypesApi: {
        getAll: jest.fn(),
    },
}));

const mockedClustersApi = clustersApi as jest.Mocked<typeof clustersApi>;

// Helper to create mock cluster data
const createMockCluster = (overrides: Partial<Cluster> = {}): Cluster => ({
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

// Helper to create paginated response
const createPaginatedResponse = (
    clusters: Cluster[],
    page = 1,
    lastPage = 1
) => ({
    data: clusters,
    meta: {
        current_page: page,
        last_page: lastPage,
        per_page: 15,
        total: clusters.length,
        from: clusters.length > 0 ? 1 : null,
        to: clusters.length > 0 ? clusters.length : null,
        path: "/v1/clusters",
    },
    links: {
        first: "/v1/clusters?page=1",
        last: `/v1/clusters?page=${lastPage}`,
        prev: null,
        next: null,
    },
});

describe("ClusterList Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mock responses for reference data APIs
        (
            require("@/lib/api").clusterTypesApi.getAll as jest.Mock
        ).mockResolvedValue({ data: [] });
        (
            require("@/lib/api").infrastructureTypesApi.getAll as jest.Mock
        ).mockResolvedValue({ data: [] });
        (require("@/lib/api").vendorsApi.getAll as jest.Mock).mockResolvedValue(
            { data: [] }
        );
        (
            require("@/lib/api").lifecyclesApi.getAll as jest.Mock
        ).mockResolvedValue({ data: [] });
    });

    describe("Loading State", () => {
        it("should show loading skeleton initially", async () => {
            mockedClustersApi.getAll.mockImplementation(
                () => new Promise(() => {}) // Never resolves to keep loading state
            );

            const { container } = render(<ClusterList />);

            // Should show skeleton loading state - the Skeleton component uses animate-pulse class
            const hasLoadingIndicator =
                container.querySelectorAll('[class*="animate-pulse"]').length >
                    0 ||
                container.querySelectorAll('[class*="Skeleton"]').length > 0;

            expect(hasLoadingIndicator).toBeTruthy();
        });
    });

    describe("Empty State", () => {
        it("should show empty state when no clusters exist", async () => {
            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse([])
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(
                    screen.getByText(/no clusters found/i)
                ).toBeInTheDocument();
            });
        });
    });

    describe("Cluster Display", () => {
        it("should display cluster list when data is loaded", async () => {
            const clusters = [
                createMockCluster({ id: 1, name: "cluster-1" }),
                createMockCluster({ id: 2, name: "cluster-2" }),
            ];

            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse(clusters)
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(screen.getByText("cluster-1")).toBeInTheDocument();
                expect(screen.getByText("cluster-2")).toBeInTheDocument();
            });
        });

        it("should display cluster display name when available", async () => {
            const clusters = [
                createMockCluster({
                    id: 1,
                    name: "cluster-1",
                    display_name: "Production Cluster",
                }),
            ];

            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse(clusters)
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(
                    screen.getByText("Production Cluster")
                ).toBeInTheDocument();
            });
        });

        it("should display cluster version when available", async () => {
            const clusters = [
                createMockCluster({
                    id: 1,
                    name: "cluster-1",
                    version: "1.28.0",
                }),
            ];

            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse(clusters)
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(screen.getByText("1.28.0")).toBeInTheDocument();
            });
        });

        it("should display API URL when available", async () => {
            const clusters = [
                createMockCluster({
                    id: 1,
                    name: "cluster-1",
                    api_url: "https://api.example.com",
                }),
            ];

            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse(clusters)
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(
                    screen.getByText("https://api.example.com")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Error Handling", () => {
        it("should show error state when API call fails", async () => {
            mockedClustersApi.getAll.mockRejectedValueOnce(
                new Error("API Error")
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(screen.getByText("Error")).toBeInTheDocument();
                expect(screen.getByText("API Error")).toBeInTheDocument();
            });
        });

        it("should have retry button on error", async () => {
            mockedClustersApi.getAll.mockRejectedValueOnce(
                new Error("API Error")
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /retry/i })
                ).toBeInTheDocument();
            });
        });

        it("should retry loading when retry button is clicked", async () => {
            mockedClustersApi.getAll
                .mockRejectedValueOnce(new Error("API Error"))
                .mockResolvedValueOnce(
                    createPaginatedResponse([
                        createMockCluster({ id: 1, name: "cluster-1" }),
                    ])
                );

            render(<ClusterList />);

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /retry/i })
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: /retry/i }));

            await waitFor(() => {
                expect(screen.getByText("cluster-1")).toBeInTheDocument();
            });

            expect(mockedClustersApi.getAll).toHaveBeenCalledTimes(2);
        });
    });

    describe("Pagination", () => {
        it("should not show pagination when only one page", async () => {
            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse(
                    [createMockCluster({ id: 1, name: "cluster-1" })],
                    1,
                    1
                )
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(screen.getByText("cluster-1")).toBeInTheDocument();
            });

            // Pagination should not be visible
            expect(
                screen.queryByRole("button", { name: /previous/i })
            ).not.toBeInTheDocument();
        });

        it("should show pagination when multiple pages exist", async () => {
            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse(
                    [createMockCluster({ id: 1, name: "cluster-1" })],
                    1,
                    3
                )
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(screen.getByText("cluster-1")).toBeInTheDocument();
            });

            // Pagination should be visible
            expect(
                screen.getByRole("button", { name: /previous/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /next/i })
            ).toBeInTheDocument();
            expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
        });

        it("should disable previous button on first page", async () => {
            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse(
                    [createMockCluster({ id: 1, name: "cluster-1" })],
                    1,
                    3
                )
            );

            render(<ClusterList />);

            await waitFor(() => {
                expect(screen.getByText("cluster-1")).toBeInTheDocument();
            });

            expect(
                screen.getByRole("button", { name: /previous/i })
            ).toBeDisabled();
        });

        it("should load next page when next button is clicked", async () => {
            mockedClustersApi.getAll
                .mockResolvedValueOnce(
                    createPaginatedResponse(
                        [createMockCluster({ id: 1, name: "cluster-1" })],
                        1,
                        3
                    )
                )
                .mockResolvedValueOnce(
                    createPaginatedResponse(
                        [createMockCluster({ id: 2, name: "cluster-2" })],
                        2,
                        3
                    )
                );

            render(<ClusterList />);

            await waitFor(() => {
                expect(screen.getByText("cluster-1")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: /next/i }));

            await waitFor(() => {
                expect(screen.getByText("cluster-2")).toBeInTheDocument();
            });

            expect(mockedClustersApi.getAll).toHaveBeenCalledWith(2);
        });
    });

    describe("Actions", () => {
        it("should show edit and delete buttons when showActions is true", async () => {
            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse([
                    createMockCluster({ id: 1, name: "cluster-1" }),
                ])
            );

            render(<ClusterList showActions={true} />);

            await waitFor(() => {
                expect(screen.getByText("cluster-1")).toBeInTheDocument();
            });

            expect(
                screen.getByRole("button", { name: /edit/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /delete/i })
            ).toBeInTheDocument();
        });

        it("should hide action buttons when showActions is false", async () => {
            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse([
                    createMockCluster({ id: 1, name: "cluster-1" }),
                ])
            );

            render(<ClusterList showActions={false} />);

            await waitFor(() => {
                expect(screen.getByText("cluster-1")).toBeInTheDocument();
            });

            expect(
                screen.queryByRole("button", { name: /edit/i })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: /delete/i })
            ).not.toBeInTheDocument();
        });
    });

    describe("Selection", () => {
        it("should call onSelectCluster when cluster card is clicked", async () => {
            const onSelectCluster = jest.fn();
            const cluster = createMockCluster({ id: 1, name: "cluster-1" });

            mockedClustersApi.getAll.mockResolvedValueOnce(
                createPaginatedResponse([cluster])
            );

            render(
                <ClusterList
                    onSelectCluster={onSelectCluster}
                    showActions={false}
                />
            );

            await waitFor(() => {
                expect(screen.getByText("cluster-1")).toBeInTheDocument();
            });

            // Click on the cluster card
            fireEvent.click(screen.getByText("cluster-1"));

            expect(onSelectCluster).toHaveBeenCalledWith(cluster);
        });
    });
});
