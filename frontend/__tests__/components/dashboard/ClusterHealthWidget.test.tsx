import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ClusterHealthWidget } from "@/components/dashboard/widgets/ClusterHealthWidget";

jest.mock("@/lib/api", () => ({
    clustersApi: {
        getAll: jest.fn(),
    },
}));

jest.mock("react-icons/hi2", () => ({
    HiOutlineServerStack: () => <span data-testid="icon-server">server</span>,
}));

const { clustersApi } = jest.requireMock("@/lib/api");

const createMockCluster = (overrides = {}) => ({
    id: 1,
    name: "prod-cluster",
    api_url: null,
    cluster_uuid: null,
    display_name: null,
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
    ...overrides,
});

describe("ClusterHealthWidget", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Loading state", () => {
        it("renders loading skeleton initially", () => {
            clustersApi.getAll.mockReturnValue(new Promise(() => {}));
            render(<ClusterHealthWidget />);
            expect(
                document.querySelector(".animate-pulse") ||
                    screen.queryByTestId("skeleton")
            ).toBeTruthy();
        });
    });

    describe("Loaded state", () => {
        it("shows cluster count", async () => {
            clustersApi.getAll.mockResolvedValue({
                data: [
                    createMockCluster({ id: 1, name: "prod" }),
                    createMockCluster({ id: 2, name: "staging" }),
                ],
                meta: { total: 2, current_page: 1, last_page: 1, per_page: 100, from: 1, to: 2 },
            });
            render(<ClusterHealthWidget />);
            await waitFor(() => {
                expect(screen.getByText("2")).toBeInTheDocument();
            });
        });

        it("shows widget title", async () => {
            clustersApi.getAll.mockResolvedValue({
                data: [createMockCluster()],
                meta: { total: 1, current_page: 1, last_page: 1, per_page: 100, from: 1, to: 1 },
            });
            render(<ClusterHealthWidget />);
            await waitFor(() => {
                expect(screen.getByText("Clusters")).toBeInTheDocument();
            });
        });

        it("handles empty data", async () => {
            clustersApi.getAll.mockResolvedValue({
                data: [],
                meta: { total: 0, current_page: 1, last_page: 1, per_page: 100, from: 0, to: 0 },
            });
            render(<ClusterHealthWidget />);
            await waitFor(() => {
                expect(screen.getByText("0")).toBeInTheDocument();
            });
        });
    });

    describe("Error state", () => {
        it("handles API error gracefully", async () => {
            clustersApi.getAll.mockRejectedValue(new Error("Network error"));
            render(<ClusterHealthWidget />);
            await waitFor(() => {
                expect(screen.queryByText(/Network error/i)).not.toBeInTheDocument();
            });
        });
    });
});
