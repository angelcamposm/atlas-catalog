/**
 * Tests for RecentActivityWidget
 *
 * Verifies that the widget fetches the most recently updated APIs and
 * Components, sorts them by `updated_at` descending and renders a unified
 * timeline of activity entries.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RecentActivityWidget } from "@/components/dashboard/widgets/RecentActivityWidget";

jest.mock("@/lib/api", () => ({
    apisApi: { getAll: jest.fn() },
    componentsApi: { getAll: jest.fn() },
}));

jest.mock("react-icons/hi2", () => ({
    HiOutlineClock: () => <span data-testid="icon-clock">clock</span>,
    HiOutlineGlobeAlt: () => <span data-testid="icon-globe">globe</span>,
    HiOutlineCubeTransparent: () => <span data-testid="icon-cube">cube</span>,
}));

jest.mock("next/link", () => {
    const MockLink = ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>;
    MockLink.displayName = "MockLink";
    return { __esModule: true, default: MockLink };
});

const { apisApi, componentsApi } = jest.requireMock("@/lib/api");

const baseMeta = {
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 5,
    from: null,
    to: null,
    path: "/v1/test",
};

const mkApi = (overrides: Record<string, unknown> = {}) => ({
    id: 1,
    name: "api-1",
    display_name: "API One",
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

const mkComponent = (overrides: Record<string, unknown> = {}) => ({
    id: 1,
    name: "comp-1",
    slug: "comp-1",
    display_name: "Component One",
    description: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("RecentActivityWidget", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Loading state", () => {
        it("renders skeleton while data is loading", () => {
            apisApi.getAll.mockReturnValue(new Promise(() => {}));
            componentsApi.getAll.mockReturnValue(new Promise(() => {}));

            const { container } = render(<RecentActivityWidget />);

            expect(
                container.querySelector(".animate-pulse"),
            ).toBeInTheDocument();
        });
    });

    describe("Loaded state", () => {
        it("renders the widget title", async () => {
            apisApi.getAll.mockResolvedValue({ data: [], meta: baseMeta });
            componentsApi.getAll.mockResolvedValue({
                data: [],
                meta: baseMeta,
            });

            render(<RecentActivityWidget />);

            await waitFor(() => {
                expect(screen.getByText("Recent Activity")).toBeInTheDocument();
            });
        });

        it("requests APIs and components ordered by updated_at desc", async () => {
            apisApi.getAll.mockResolvedValue({ data: [], meta: baseMeta });
            componentsApi.getAll.mockResolvedValue({
                data: [],
                meta: baseMeta,
            });

            render(<RecentActivityWidget />);

            await waitFor(() => {
                expect(apisApi.getAll).toHaveBeenCalledWith({
                    sort_by: "updated_at",
                    sort_order: "desc",
                    per_page: 5,
                });
                expect(componentsApi.getAll).toHaveBeenCalledWith({
                    sort_by: "updated_at",
                    sort_order: "desc",
                    per_page: 5,
                });
            });
        });

        it("merges and sorts API and component entries by updated_at desc", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [
                    mkApi({
                        id: 1,
                        display_name: "Older API",
                        updated_at: "2024-01-01T00:00:00Z",
                    }),
                    mkApi({
                        id: 2,
                        display_name: "Newest API",
                        updated_at: "2024-03-15T12:00:00Z",
                    }),
                ],
                meta: baseMeta,
            });
            componentsApi.getAll.mockResolvedValue({
                data: [
                    mkComponent({
                        id: 10,
                        display_name: "Mid Component",
                        updated_at: "2024-02-10T08:00:00Z",
                    }),
                ],
                meta: baseMeta,
            });

            render(<RecentActivityWidget />);

            await waitFor(() => {
                expect(screen.getByText("Newest API")).toBeInTheDocument();
            });

            const items = screen.getAllByTestId("recent-activity-item");
            expect(items).toHaveLength(3);
            expect(items[0]).toHaveTextContent("Newest API");
            expect(items[1]).toHaveTextContent("Mid Component");
            expect(items[2]).toHaveTextContent("Older API");
        });

        it("limits the merged feed to 5 entries", async () => {
            const manyApis = Array.from({ length: 5 }, (_, i) =>
                mkApi({
                    id: i + 1,
                    display_name: `API ${i + 1}`,
                    updated_at: `2024-03-${String(i + 1).padStart(2, "0")}T00:00:00Z`,
                }),
            );
            const manyComponents = Array.from({ length: 5 }, (_, i) =>
                mkComponent({
                    id: 100 + i,
                    display_name: `Comp ${i + 1}`,
                    updated_at: `2024-02-${String(i + 1).padStart(2, "0")}T00:00:00Z`,
                }),
            );

            apisApi.getAll.mockResolvedValue({
                data: manyApis,
                meta: baseMeta,
            });
            componentsApi.getAll.mockResolvedValue({
                data: manyComponents,
                meta: baseMeta,
            });

            render(<RecentActivityWidget />);

            await waitFor(() => {
                const items = screen.getAllByTestId("recent-activity-item");
                expect(items).toHaveLength(5);
            });
        });

        it("links each entry to its detail page", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [
                    mkApi({
                        id: 42,
                        display_name: "Linked API",
                        updated_at: "2024-04-01T00:00:00Z",
                    }),
                ],
                meta: baseMeta,
            });
            componentsApi.getAll.mockResolvedValue({
                data: [
                    mkComponent({
                        id: 7,
                        slug: "linked-comp",
                        display_name: "Linked Component",
                        updated_at: "2024-03-01T00:00:00Z",
                    }),
                ],
                meta: baseMeta,
            });

            render(<RecentActivityWidget />);

            await waitFor(() => {
                expect(
                    screen.getByRole("link", { name: /linked api/i }),
                ).toHaveAttribute("href", "/apis/42");
                expect(
                    screen.getByRole("link", { name: /linked component/i }),
                ).toHaveAttribute("href", "/components/linked-comp");
            });
        });
    });

    describe("Empty state", () => {
        it("renders an empty message when no activity is found", async () => {
            apisApi.getAll.mockResolvedValue({ data: [], meta: baseMeta });
            componentsApi.getAll.mockResolvedValue({
                data: [],
                meta: baseMeta,
            });

            render(<RecentActivityWidget />);

            await waitFor(() => {
                expect(
                    screen.getByText(/no recent activity/i),
                ).toBeInTheDocument();
            });
        });
    });

    describe("Error handling", () => {
        it("renders empty state when both APIs fail", async () => {
            apisApi.getAll.mockRejectedValue(new Error("boom"));
            componentsApi.getAll.mockRejectedValue(new Error("boom"));

            render(<RecentActivityWidget />);

            await waitFor(() => {
                expect(
                    screen.getByText(/no recent activity/i),
                ).toBeInTheDocument();
            });
        });

        it("falls back gracefully when one source fails", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [
                    mkApi({
                        id: 1,
                        display_name: "Survivor API",
                        updated_at: "2024-05-01T00:00:00Z",
                    }),
                ],
                meta: baseMeta,
            });
            componentsApi.getAll.mockRejectedValue(new Error("nope"));

            render(<RecentActivityWidget />);

            await waitFor(() => {
                expect(screen.getByText("Survivor API")).toBeInTheDocument();
            });
        });
    });
});
