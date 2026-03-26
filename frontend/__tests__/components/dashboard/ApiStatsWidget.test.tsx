import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ApiStatsWidget } from "@/components/dashboard/widgets/ApiStatsWidget";

jest.mock("@/lib/api", () => ({
    apisApi: {
        getAll: jest.fn(),
    },
}));

jest.mock("react-icons/hi2", () => ({
    HiOutlineGlobeAlt: () => <span data-testid="icon-globe">globe</span>,
}));

const { apisApi } = jest.requireMock("@/lib/api");

const createMockApi = (overrides = {}) => ({
    id: 1,
    name: "Test API",
    display_name: null,
    description: null,
    url: null,
    version: null,
    protocol: null,
    document_specification: null,
    released_at: null,
    deprecated_at: null,
    deprecation_reason: null,
    access_policy_id: null,
    authentication_method_id: null,
    category_id: null,
    status_id: null,
    type_id: null,
    deprecated_by: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("ApiStatsWidget", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Loading state", () => {
        it("renders loading skeleton initially", () => {
            apisApi.getAll.mockReturnValue(new Promise(() => {}));
            render(<ApiStatsWidget />);
            expect(
                document.querySelector(".animate-pulse") ||
                    screen.queryByTestId("skeleton"),
            ).toBeTruthy();
        });
    });

    describe("Loaded state", () => {
        it("shows total API count", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [createMockApi({ id: 1 }), createMockApi({ id: 2 })],
                meta: {
                    total: 2,
                    current_page: 1,
                    last_page: 1,
                    per_page: 100,
                    from: 1,
                    to: 2,
                },
            });
            render(<ApiStatsWidget />);
            await waitFor(() => {
                expect(screen.getByText("2")).toBeInTheDocument();
            });
        });

        it("shows widget title", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [createMockApi()],
                meta: {
                    total: 1,
                    current_page: 1,
                    last_page: 1,
                    per_page: 100,
                    from: 1,
                    to: 1,
                },
            });
            render(<ApiStatsWidget />);
            await waitFor(() => {
                expect(screen.getByText("APIs")).toBeInTheDocument();
            });
        });

        it("handles empty data", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [],
                meta: {
                    total: 0,
                    current_page: 1,
                    last_page: 1,
                    per_page: 100,
                    from: 0,
                    to: 0,
                },
            });
            render(<ApiStatsWidget />);
            await waitFor(() => {
                expect(screen.getByText("0")).toBeInTheDocument();
            });
        });
    });

    describe("Error state", () => {
        it("handles API error gracefully", async () => {
            apisApi.getAll.mockRejectedValue(new Error("Network error"));
            render(<ApiStatsWidget />);
            // Should not throw, just fail silently or show error
            await waitFor(() => {
                expect(
                    screen.queryByText(/Network error/i),
                ).not.toBeInTheDocument();
            });
        });
    });
});
