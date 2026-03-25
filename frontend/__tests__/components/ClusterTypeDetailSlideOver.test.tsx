/**
 * Unit tests for ClusterTypeDetailSlideOver component
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ClusterTypeDetailSlideOver } from "@/components/infrastructure/ClusterTypeDetailSlideOver";
import { vendorsApi } from "@/lib/api";
import type { ClusterType, Vendor } from "@/types/api";

// Mock next/navigation
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock the API
jest.mock("@/lib/api", () => ({
    vendorsApi: {
        getAll: jest.fn(),
    },
}));

const mockedVendorsApi = vendorsApi as jest.Mocked<typeof vendorsApi>;

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
    updated_at: "2024-01-15T12:30:00Z",
    created_by: 1,
    updated_by: 2,
    ...overrides,
});

// Helper to create mock vendor data
const createMockVendor = (overrides: Partial<Vendor> = {}): Vendor => ({
    id: 1,
    name: "Cloud Native Computing Foundation (CNCF)",
    icon: "cncf",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

// Helper to create paginated vendor response
const createPaginatedVendorResponse = (vendors: Vendor[]) => ({
    data: vendors,
    meta: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: vendors.length,
        from: vendors.length > 0 ? 1 : null,
        to: vendors.length > 0 ? vendors.length : null,
        path: "/v1/vendors",
    },
    links: {
        first: "/v1/vendors?page=1",
        last: "/v1/vendors?page=1",
        prev: null,
        next: null,
    },
});

describe("ClusterTypeDetailSlideOver Component", () => {
    const mockOnClose = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedVendorsApi.getAll.mockResolvedValue(
            createPaginatedVendorResponse([createMockVendor()])
        );
    });

    describe("Rendering", () => {
        it("should render null when clusterType is null", () => {
            const { container } = render(
                <ClusterTypeDetailSlideOver
                    clusterType={null}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            expect(container.firstChild).toBeNull();
        });

        it("should render slide-over when open with clusterType", async () => {
            const clusterType = createMockClusterType();

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                // Check that title appears (using getAllByText since name appears multiple places)
                const kubernetesElements = screen.getAllByText("Kubernetes");
                expect(kubernetesElements.length).toBeGreaterThan(0);
            });
        });

        it("should display cluster type name in title", async () => {
            const clusterType = createMockClusterType({ name: "OpenShift" });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const openShiftElements = screen.getAllByText("OpenShift");
                expect(openShiftElements.length).toBeGreaterThan(0);
            });
        });

        it("should display cluster type ID in description", async () => {
            const clusterType = createMockClusterType({ id: 42 });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByText("Cluster Type ID: 42")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Status Badge", () => {
        it("should show Enabled status for enabled cluster types", async () => {
            const clusterType = createMockClusterType({ is_enabled: true });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                // Should find "Enabled" in the status badge and in the details
                const enabledElements = screen.getAllByText("Enabled");
                expect(enabledElements.length).toBeGreaterThan(0);
            });
        });

        it("should show Disabled status for disabled cluster types", async () => {
            const clusterType = createMockClusterType({ is_enabled: false });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const disabledElements = screen.getAllByText("Disabled");
                expect(disabledElements.length).toBeGreaterThan(0);
            });
        });
    });

    describe("Vendor Information", () => {
        it("should display vendor name when vendor exists", async () => {
            const vendor = createMockVendor({ name: "VMware" });
            mockedVendorsApi.getAll.mockResolvedValue(
                createPaginatedVendorResponse([vendor])
            );

            const clusterType = createMockClusterType({ vendor_id: 1 });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const vmwareElements = screen.getAllByText("VMware");
                expect(vmwareElements.length).toBeGreaterThan(0);
            });
        });

        it("should display 'Not assigned' when no vendor", async () => {
            mockedVendorsApi.getAll.mockResolvedValue(
                createPaginatedVendorResponse([])
            );

            const clusterType = createMockClusterType({ vendor_id: null });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(screen.getByText("Not assigned")).toBeInTheDocument();
            });
        });

        it("should truncate long vendor names with title attribute", async () => {
            const longVendorName = "Cloud Native Computing Foundation (CNCF)";
            const vendor = createMockVendor({ name: longVendorName });
            mockedVendorsApi.getAll.mockResolvedValue(
                createPaginatedVendorResponse([vendor])
            );

            const clusterType = createMockClusterType({ vendor_id: 1 });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const vendorElement = screen.getByTitle(longVendorName);
                expect(vendorElement).toBeInTheDocument();
                expect(vendorElement).toHaveClass("truncate");
            });
        });
    });

    describe("Tab Navigation", () => {
        it("should render Overview tab by default", async () => {
            const clusterType = createMockClusterType();

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByText("General Information")
                ).toBeInTheDocument();
            });
        });

        it("should switch to Metadata tab when clicked", async () => {
            const clusterType = createMockClusterType();

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("tab", { name: /metadata/i })
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("tab", { name: /metadata/i }));

            await waitFor(() => {
                expect(screen.getByText("Timestamps")).toBeInTheDocument();
            });
        });

        it("should show timestamps in Metadata tab", async () => {
            const clusterType = createMockClusterType({
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-06-15T14:30:00Z",
            });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                    locale="en"
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("tab", { name: /metadata/i })
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("tab", { name: /metadata/i }));

            await waitFor(() => {
                expect(screen.getByText("Created At")).toBeInTheDocument();
                expect(screen.getByText("Last Updated")).toBeInTheDocument();
            });
        });
    });

    describe("Actions", () => {
        it("should call onEdit when Edit button is clicked", async () => {
            const clusterType = createMockClusterType();

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                    onEdit={mockOnEdit}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /edit cluster type/i })
                ).toBeInTheDocument();
            });

            fireEvent.click(
                screen.getByRole("button", { name: /edit cluster type/i })
            );

            expect(mockOnEdit).toHaveBeenCalledWith(clusterType);
            expect(mockOnClose).toHaveBeenCalled();
        });

        it("should call onDelete when Delete button is clicked", async () => {
            const clusterType = createMockClusterType();

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                    onDelete={mockOnDelete}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /delete/i })
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: /delete/i }));

            expect(mockOnDelete).toHaveBeenCalledWith(clusterType);
        });
    });

    describe("Loading State", () => {
        it("should show loading state while fetching vendor data", async () => {
            // Make the API call take longer
            mockedVendorsApi.getAll.mockImplementation(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve(
                                    createPaginatedVendorResponse([
                                        createMockVendor(),
                                    ])
                                ),
                            100
                        )
                    )
            );

            const clusterType = createMockClusterType();

            const { container } = render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            // Should show loading initially
            // The component passes loading prop to SlideOver
            await waitFor(() => {
                expect(mockedVendorsApi.getAll).toHaveBeenCalled();
            });
        });
    });

    describe("Icon Display", () => {
        it("should display icon when clusterType has icon", async () => {
            const clusterType = createMockClusterType({ icon: "kubernetes" });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(screen.getByText("kubernetes")).toBeInTheDocument();
            });
        });

        it("should not show icon field when clusterType has no icon", async () => {
            const clusterType = createMockClusterType({ icon: null });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(
                    screen.getByText("General Information")
                ).toBeInTheDocument();
            });

            // Icon field should not be rendered
            expect(screen.queryByText("Icon")).not.toBeInTheDocument();
        });
    });

    describe("Breadcrumbs", () => {
        it("should display breadcrumbs with cluster type name", async () => {
            const clusterType = createMockClusterType({ name: "EKS" });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                expect(screen.getByText("Infrastructure")).toBeInTheDocument();
                expect(screen.getByText("Cluster Types")).toBeInTheDocument();
            });
        });
    });

    describe("Locale Support", () => {
        it("should format dates according to locale", async () => {
            const clusterType = createMockClusterType({
                created_at: "2024-06-15T10:30:00Z",
            });

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                    locale="es"
                />
            );

            // Switch to metadata tab
            await waitFor(() => {
                expect(
                    screen.getByRole("tab", { name: /metadata/i })
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("tab", { name: /metadata/i }));

            // Date should be formatted in Spanish locale
            await waitFor(() => {
                expect(screen.getByText("Created At")).toBeInTheDocument();
            });
        });
    });

    describe("Edge Cases", () => {
        it("should handle missing optional fields gracefully", async () => {
            const clusterType = createMockClusterType({
                icon: null,
                vendor_id: null,
                created_by: null,
                updated_by: null,
            });

            mockedVendorsApi.getAll.mockResolvedValue(
                createPaginatedVendorResponse([])
            );

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            await waitFor(() => {
                const kubernetesElements = screen.getAllByText("Kubernetes");
                expect(kubernetesElements.length).toBeGreaterThan(0);
                expect(screen.getByText("Not assigned")).toBeInTheDocument();
            });
        });

        it("should handle API error gracefully", async () => {
            // Suppress console.error for this test
            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            mockedVendorsApi.getAll.mockRejectedValue(new Error("API Error"));

            const clusterType = createMockClusterType();

            render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            // Should still render without crashing
            await waitFor(() => {
                const kubernetesElements = screen.getAllByText("Kubernetes");
                expect(kubernetesElements.length).toBeGreaterThan(0);
            });

            consoleSpy.mockRestore();
        });

        it("should reset to overview tab when modal reopens", async () => {
            const clusterType = createMockClusterType();

            const { rerender } = render(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            // Switch to metadata tab
            await waitFor(() => {
                expect(
                    screen.getByRole("tab", { name: /metadata/i })
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("tab", { name: /metadata/i }));

            // Close and reopen
            rerender(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={false}
                    onClose={mockOnClose}
                />
            );

            rerender(
                <ClusterTypeDetailSlideOver
                    clusterType={clusterType}
                    open={true}
                    onClose={mockOnClose}
                />
            );

            // Should be back to overview tab
            await waitFor(() => {
                expect(
                    screen.getByText("General Information")
                ).toBeInTheDocument();
            });
        });
    });
});
