/**
 * Tests for ApisByLifecycleChart
 *
 * The chart fetches APIs and groups them into three lifecycle buckets
 * derived from `released_at` and `deprecated_at`:
 *   - Deprecated: `deprecated_at` is set
 *   - Active:     `released_at` is set and `deprecated_at` is null
 *   - Pre-release: neither is set
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ApisByLifecycleChart } from "@/components/dashboard/widgets/ApisByLifecycleChart";

jest.mock("@/lib/api", () => ({
    apisApi: { getAll: jest.fn() },
}));

// Recharts is heavy and noisy in jsdom; replace with simple test doubles
// that expose the data shape so we can assert on it.
jest.mock("recharts", () => {
    const React = require("react");
    return {
        __esModule: true,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
            React.createElement(
                "div",
                { "data-testid": "chart-wrapper" },
                children,
            ),
        PieChart: ({ children }: { children: React.ReactNode }) =>
            React.createElement(
                "div",
                { "data-testid": "pie-chart" },
                children,
            ),
        Pie: ({ data }: { data: Array<{ name: string; value: number }> }) =>
            React.createElement(
                "ul",
                { "data-testid": "pie-data" },
                data.map((d) =>
                    React.createElement(
                        "li",
                        { key: d.name, "data-testid": `slice-${d.name}` },
                        `${d.name}: ${d.value}`,
                    ),
                ),
            ),
        Cell: () => null,
        Tooltip: () => null,
        Legend: () => null,
    };
});

const { apisApi } = jest.requireMock("@/lib/api");

const baseMeta = {
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 100,
    from: null,
    to: null,
    path: "/v1/catalog/apis",
};

const baseLinks = {
    first: "",
    last: "",
    prev: null,
    next: null,
};

const mkApi = (overrides: Record<string, unknown> = {}) => ({
    id: 1,
    name: "api",
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
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("ApisByLifecycleChart", () => {
    describe("Loading state", () => {
        it("renders a skeleton while data is loading", () => {
            apisApi.getAll.mockReturnValue(new Promise(() => {}));
            const { container } = render(<ApisByLifecycleChart />);
            expect(
                container.querySelector(".animate-pulse"),
            ).toBeInTheDocument();
        });
    });

    describe("Loaded state", () => {
        it("renders the widget title", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [],
                meta: baseMeta,
                links: baseLinks,
            });
            render(<ApisByLifecycleChart />);
            await waitFor(() =>
                expect(
                    screen.getByText("APIs by Lifecycle"),
                ).toBeInTheDocument(),
            );
        });

        it("requests the maximum page size", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [],
                meta: baseMeta,
                links: baseLinks,
            });
            render(<ApisByLifecycleChart />);
            await waitFor(() =>
                expect(apisApi.getAll).toHaveBeenCalledWith({ per_page: 100 }),
            );
        });

        it("buckets APIs into Active, Deprecated and Pre-release", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [
                    mkApi({
                        id: 1,
                        released_at: "2024-01-01T00:00:00Z",
                        deprecated_at: null,
                    }),
                    mkApi({
                        id: 2,
                        released_at: "2024-01-01T00:00:00Z",
                        deprecated_at: null,
                    }),
                    mkApi({
                        id: 3,
                        released_at: "2023-01-01T00:00:00Z",
                        deprecated_at: "2025-01-01T00:00:00Z",
                    }),
                    mkApi({
                        id: 4,
                        released_at: null,
                        deprecated_at: null,
                    }),
                ],
                meta: { ...baseMeta, total: 4 },
                links: baseLinks,
            });

            render(<ApisByLifecycleChart />);

            await waitFor(() =>
                expect(screen.getByTestId("slice-Active")).toHaveTextContent(
                    "Active: 2",
                ),
            );
            expect(screen.getByTestId("slice-Deprecated")).toHaveTextContent(
                "Deprecated: 1",
            );
            expect(screen.getByTestId("slice-Pre-release")).toHaveTextContent(
                "Pre-release: 1",
            );
        });
    });

    describe("Empty state", () => {
        it("shows an empty message when there are no APIs", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [],
                meta: baseMeta,
                links: baseLinks,
            });
            render(<ApisByLifecycleChart />);
            await waitFor(() =>
                expect(
                    screen.getByText(/no apis to display/i),
                ).toBeInTheDocument(),
            );
        });
    });

    describe("Error handling", () => {
        it("shows an error message when the fetch fails", async () => {
            apisApi.getAll.mockRejectedValue(new Error("boom"));
            render(<ApisByLifecycleChart />);
            await waitFor(() =>
                expect(
                    screen.getByText(/failed to load apis/i),
                ).toBeInTheDocument(),
            );
        });
    });
});
