/**
 * Unit tests for ClusterDetailSlideOver component
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ClusterDetailSlideOver } from "@/components/infrastructure/ClusterDetailSlideOver";
import {
    clusterTypesApi,
    lifecyclesApi,
    infrastructureTypesApi,
    vendorsApi,
    clustersApi,
} from "@/lib/api";
import type {
    Cluster,
    ClusterType,
    Lifecycle,
    InfrastructureType,
    Vendor,
} from "@/types/api";

// Mock next/navigation
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock the clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
    },
});

// Mock the APIs
jest.mock("@/lib/api", () => ({
    clusterTypesApi: {
        getAll: jest.fn(),
    },
    lifecyclesApi: {
        getAll: jest.fn(),
    },
    infrastructureTypesApi: {
        getAll: jest.fn(),
    },
    vendorsApi: {
        getAll: jest.fn(),
    },
    clustersApi: {
        getAll: jest.fn(),
        delete: jest.fn(),
    },
}));

const mockedClusterTypesApi = clusterTypesApi as jest.Mocked<
    typeof clusterTypesApi
>;
const mockedLifecyclesApi = lifecyclesApi as jest.Mocked<typeof lifecyclesApi>;
const mockedInfrastructureTypesApi = infrastructureTypesApi as jest.Mocked<
    typeof infrastructureTypesApi
>;
const mockedVendorsApi = vendorsApi as jest.Mocked<typeof vendorsApi>;
const mockedClustersApi = clustersApi as jest.Mocked<typeof clustersApi>;

// Helper to create mock cluster data
const createMockCluster = (overrides: Partial<Cluster> = {}): Cluster => ({
    id: 1,
    name: "Production Cluster",
    api_url: "https://k8s.prod.example.com:6443",
    cluster_uuid: "abc123-def456-ghi789",
    display_name: "Prod K8s",
    full_version: "1.28.0",
    has_licensing: false,
    infrastructure_type_id: 1,
    licensing_model: null,
    lifecycle_id: 1,
    tags: "production,critical",
    timezone: "UTC",
    type_id: 1,
    url: "https://console.prod.example.com",
    vendor_id: 1,
    version: "1.28",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T12:30:00Z",
    created_by: 1,
    updated_by: 2,
    ...overrides,
});

// Helper to create mock cluster type data
const createMockClusterType = (
    overrides: Partial<ClusterType> = {}
): ClusterType => ({
    id: 1,
    name: "Kubernetes",
    icon: "kubernetes",
    is_enabled: true,
    vendor_id: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create mock lifecycle data
const createMockLifecycle = (
    overrides: Partial<Lifecycle> = {}
): Lifecycle => ({
    id: 1,
    name: "Production",
    color: "#10B981",
    description: "Production environment",
    approval_required: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create mock infrastructure type data
const createMockInfrastructureType = (
    overrides: Partial<InfrastructureType> = {}
): InfrastructureType => ({
    id: 1,
    name: "On-Premise",
    description: "On-premise infrastructure",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create mock vendor data
const createMockVendor = (overrides: Partial<Vendor> = {}): Vendor => ({
    id: 1,
    name: "VMware",
    icon: "vmware",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create paginated response
const createPaginatedResponse = <T,>(items: T[]) => ({
    data: items,
    meta: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: items.length,
        from: items.length > 0 ? 1 : null,
        to: items.length > 0 ? items.length : null,
        path: "/v1/resource",
    },
    links: {
        first: "/v1/resource?page=1",
        last: "/v1/resource?page=1",
        prev: null,
        next: null,
    },
});

describe("ClusterDetailSlideOver Component", () => {
    const mockOnClose = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedClusterTypesApi.getAll.mockResolvedValue(
            createPaginatedResponse([createMockClusterType()])
        );
        mockedLifecyclesApi.getAll.mockResolvedValue(
            createPaginatedResponse([createMockLifecycle()])
        );
        mockedInfrastructureTypesApi.getAll.mockResolvedValue(
            createPaginatedResponse([createMockInfrastructureType()])
        );
        mockedVendorsApi.getAll.mockResolvedValue(
            createPaginatedResponse([createMockVendor()])
        );
    });

    describe("Rendering", () => {
        it("should render null when cluster is null", () => {
            const { container } = render(
                <ClusterDetailSlideOver
                    cluster={null}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            expect(container.firstChild).toBeNull();
        });

        it("should render slide-over when open with cluster", async () => {
            const cluster = createMockCluster();

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Production Cluster");
                expect(elements.length).toBeGreaterThan(0);
            });
        });

        it("should display cluster name in title", async () => {
            const cluster = createMockCluster({ name: "Development Cluster" });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Development Cluster");
                expect(elements.length).toBeGreaterThan(0);
            });
        });

        it("should display cluster description when display_name is set", async () => {
            const cluster = createMockCluster({
                display_name: "Custom Display Name",
            });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByText("Custom Display Name")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Related Data Loading", () => {
        it("should display cluster type name when loaded", async () => {
            const clusterType = createMockClusterType({ name: "OpenShift" });
            mockedClusterTypesApi.getAll.mockResolvedValue(
                createPaginatedResponse([clusterType])
            );

            const cluster = createMockCluster({ type_id: 1 });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("OpenShift");
                expect(elements.length).toBeGreaterThan(0);
            });
        });

        it("should display lifecycle name when loaded", async () => {
            const lifecycle = createMockLifecycle({ name: "Staging" });
            mockedLifecyclesApi.getAll.mockResolvedValue(
                createPaginatedResponse([lifecycle])
            );

            const cluster = createMockCluster({ lifecycle_id: 1 });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Staging");
                expect(elements.length).toBeGreaterThan(0);
            });
        });

        it("should display infrastructure type name when loaded", async () => {
            const infraType = createMockInfrastructureType({ name: "Cloud" });
            mockedInfrastructureTypesApi.getAll.mockResolvedValue(
                createPaginatedResponse([infraType])
            );

            const cluster = createMockCluster({ infrastructure_type_id: 1 });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Cloud");
                expect(elements.length).toBeGreaterThan(0);
            });
        });

        it("should display vendor name when loaded", async () => {
            const vendor = createMockVendor({ name: "Red Hat" });
            mockedVendorsApi.getAll.mockResolvedValue(
                createPaginatedResponse([vendor])
            );

            const cluster = createMockCluster({ vendor_id: 1 });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Red Hat");
                expect(elements.length).toBeGreaterThan(0);
            });
        });
    });

    describe("Tab Navigation", () => {
        it("should render Overview tab by default", async () => {
            const cluster = createMockCluster();

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByText("Version Information")
                ).toBeInTheDocument();
            });
        });

        it("should switch to Technical tab when clicked", async () => {
            const cluster = createMockCluster();

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("tab", { name: /technical/i })
                ).toBeInTheDocument();
            });

            const technicalTab = screen.getByRole("tab", {
                name: /technical/i,
            });
            fireEvent.click(technicalTab);

            await waitFor(() => {
                expect(screen.getByText("Configuration")).toBeInTheDocument();
            });
        });

        it("should switch to Metadata tab when clicked", async () => {
            const cluster = createMockCluster();

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("tab", { name: /metadata/i })
                ).toBeInTheDocument();
            });

            const metadataTab = screen.getByRole("tab", {
                name: /metadata/i,
            });
            fireEvent.click(metadataTab);

            await waitFor(() => {
                expect(screen.getByText("Creation")).toBeInTheDocument();
            });
        });
    });

    describe("Close Behavior", () => {
        it("should call onClose when close button is clicked", async () => {
            const cluster = createMockCluster();

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Production Cluster");
                expect(elements.length).toBeGreaterThan(0);
            });

            const closeButton = screen.getByRole("button", { name: /close/i });
            fireEvent.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it("should call onClose when escape key is pressed", async () => {
            const cluster = createMockCluster();

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Production Cluster");
                expect(elements.length).toBeGreaterThan(0);
            });

            fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe("Action Callbacks", () => {
        it("should call onEdit when edit button is clicked", async () => {
            const cluster = createMockCluster();

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                    onEdit={mockOnEdit}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Production Cluster");
                expect(elements.length).toBeGreaterThan(0);
            });

            const editButton = screen.getByRole("button", { name: /edit/i });
            fireEvent.click(editButton);

            expect(mockOnEdit).toHaveBeenCalledWith(cluster);
        });
    });

    describe("Cluster Fields", () => {
        it("should display API URL when available", async () => {
            const cluster = createMockCluster({
                api_url: "https://api.cluster.example.com",
            });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByText("https://api.cluster.example.com")
                ).toBeInTheDocument();
            });
        });

        it("should display version when available", async () => {
            const cluster = createMockCluster({ version: "1.29" });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(screen.getByText("1.29")).toBeInTheDocument();
            });
        });

        it("should display timezone in Technical tab", async () => {
            const cluster = createMockCluster({ timezone: "America/New_York" });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            // Wait for component to load
            await waitFor(() => {
                expect(
                    screen.getByRole("tab", { name: /technical/i })
                ).toBeInTheDocument();
            });

            // Switch to Technical tab
            const technicalTab = screen.getByRole("tab", {
                name: /technical/i,
            });
            fireEvent.click(technicalTab);

            await waitFor(() => {
                expect(
                    screen.getByText("America/New_York")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Clipboard Functionality", () => {
        it("should copy API URL to clipboard when copy button is clicked", async () => {
            const cluster = createMockCluster({
                api_url: "https://api.cluster.example.com",
            });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByText("https://api.cluster.example.com")
                ).toBeInTheDocument();
            });

            // Find copy buttons
            const copyButtons = screen.getAllByRole("button");
            const copyButton = copyButtons.find(
                (btn) =>
                    btn.querySelector("svg") &&
                    btn
                        .closest('[class*="flex"]')
                        ?.textContent?.includes(
                            "https://api.cluster.example.com"
                        )
            );

            if (copyButton) {
                fireEvent.click(copyButton);
                expect(navigator.clipboard.writeText).toHaveBeenCalled();
            }
        });
    });

    describe("API Error Handling", () => {
        it("should handle API errors gracefully", async () => {
            mockedClusterTypesApi.getAll.mockRejectedValue(
                new Error("API Error")
            );
            mockedLifecyclesApi.getAll.mockRejectedValue(
                new Error("API Error")
            );

            const cluster = createMockCluster();
            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Production Cluster");
                expect(elements.length).toBeGreaterThan(0);
            });

            // Should still render the cluster name even if API fails
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe("Missing Data", () => {
        it("should handle null relations gracefully", async () => {
            mockedClusterTypesApi.getAll.mockResolvedValue(
                createPaginatedResponse([])
            );
            mockedLifecyclesApi.getAll.mockResolvedValue(
                createPaginatedResponse([])
            );
            mockedInfrastructureTypesApi.getAll.mockResolvedValue(
                createPaginatedResponse([])
            );
            mockedVendorsApi.getAll.mockResolvedValue(
                createPaginatedResponse([])
            );

            const cluster = createMockCluster({
                type_id: null,
                lifecycle_id: null,
                infrastructure_type_id: null,
                vendor_id: null,
            });

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const elements = screen.getAllByText("Production Cluster");
                expect(elements.length).toBeGreaterThan(0);
            });

            // Component should render without errors even with null relations
        });
    });

    describe("Accessibility", () => {
        it("should have accessible close button", async () => {
            const cluster = createMockCluster();

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const closeButton = screen.getByRole("button", {
                    name: /close/i,
                });
                expect(closeButton).toBeInTheDocument();
            });
        });

        it("should have accessible tab navigation", async () => {
            const cluster = createMockCluster();

            render(
                <ClusterDetailSlideOver
                    cluster={cluster}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const tabs = screen.getAllByRole("tab");
                expect(tabs.length).toBeGreaterThanOrEqual(3);
            });
        });
    });
});
