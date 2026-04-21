/**
 * Tests for ApisByTypeChart
 *
 * The widget fetches APIs and API Types in parallel, groups APIs by
 * `type_id`, resolves each id to a human-readable type name, and renders
 * the result as a bar chart.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ApisByTypeChart } from "@/components/dashboard/widgets/ApisByTypeChart";

jest.mock("@/lib/api", () => ({
    apisApi: { getAll: jest.fn() },
    apiTypesApi: { getAll: jest.fn() },
}));

jest.mock("recharts", () => {
    const React = require("react");
    return {
        __esModule: true,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
            React.createElement("div", { "data-testid": "chart-wrapper" }, children),
        BarChart: ({
            data,
            children,
        }: {
            data: Array<{ name: string; value: number }>;
            children: React.ReactNode;
        }) =>
            React.createElement(
                "div",
                { "data-testid": "bar-chart" },
                React.createElement(
                    "ul",
                    { "data-testid": "bar-data" },
                    data.map((d) =>
                        React.createElement(
                            "li",
                            {
                                key: d.name,
                                "data-testid": `bar-${d.name}`,
                            },
                            `${d.name}: ${d.value}`,
                        ),
                    ),
                ),
                children,
            ),
        Bar: () => null,
        XAxis: () => null,
        YAxis: () => null,
        CartesianGrid: () => null,
        Tooltip: () => null,
    };
});

const { apisApi, apiTypesApi } = jest.requireMock("@/lib/api");

const baseMeta = {
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 100,
    from: null,
    to: null,
    path: "/v1",
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

const mkType = (id: number, name: string) => ({
    id,
    name,
    description: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    created_by: null,
    updated_by: null,
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("ApisByTypeChart", () => {
    describe("Loading state", () => {
        it("renders a skeleton while data is loading", () => {
            apisApi.getAll.mockReturnValue(new Promise(() => {}));
            apiTypesApi.getAll.mockReturnValue(new Promise(() => {}));
            const { container } = render(<ApisByTypeChart />);
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
            apiTypesApi.getAll.mockResolvedValue({
                data: [],
                meta: baseMeta,
                links: baseLinks,
            });
            render(<ApisByTypeChart />);
            await waitFor(() =>
                expect(screen.getByText("APIs by Type")).toBeInTheDocument(),
            );
        });

        it("groups APIs by type and resolves type names", async () => {
            apisApi.getAll.mockResolvedValue({
                data: [
                    mkApi({ id: 1, type_id: 10 }),
                    mkApi({ id: 2, type_id: 10 }),
                    mkApi({ id: 3, type_id: 20 }),
                    mkApi({ id: 4, type_id: null }),
                ],
                meta: { ...baseMeta, total: 4 },
                links: baseLinks,
            });
            apiTypesApi.getAll.mockResolvedValue({
                data: [mkType(10, "REST"), mkType(20, "GraphQL")],
                meta: baseMeta,
                links: baseLinks,
            });

            render(<ApisByTypeChart />);

            await waitFor(() =>
                expect(screen.getByTestId("bar-REST")).toHaveTextContent(
                    "REST: 2",
                ),
            );
            expect(screen.getByTestId("bar-GraphQL")).toHaveTextContent(
                "GraphQL: 1",
            );
            expect(screen.getByTestId("bar-Unknown")).toHaveTextContent(
                "Unknown: 1",
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
            apiTypesApi.getAll.mockResolvedValue({
                data: [],
                meta: baseMeta,
                links: baseLinks,
            });
            render(<ApisByTypeChart />);
            await waitFor(() =>
                expect(
                    screen.getByText(/no apis to display/i),
                ).toBeInTheDocument(),
            );
        });
    });

    describe("Error handling", () => {
        it("shows an error message when APIs fetch fails", async () => {
            apisApi.getAll.mockRejectedValue(new Error("boom"));
            apiTypesApi.getAll.mockResolvedValue({
                data: [],
                meta: baseMeta,
                links: baseLinks,
            });
            render(<ApisByTypeChart />);
            await waitFor(() =>
                expect(
                    screen.getByText(/failed to load apis/i),
                ).toBeInTheDocument(),
            );
        });
    });
});
