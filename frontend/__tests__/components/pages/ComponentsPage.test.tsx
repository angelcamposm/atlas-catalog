/**
 * Tests for the Components list page.
 *
 * Strategy: mock `useResourceList` to control data/loading state, then assert
 * on layout, DataTable rows, search wiring, navigation, and pagination.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentsPage from "@/app/[locale]/(protected)/components/page";
import type { Component } from "@/types/api";
import type { PaginatedResponse } from "@/types/api";

// ── External dependencies ──────────────────────────────────────────────────

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
    useParams: () => ({ locale: "es" }),
}));

jest.mock(
    "react-icons/hi2",
    () =>
        new Proxy(
            { HiOutlineCube: () => null },
            { get: (_t, name) => () => null },
        ),
);

jest.mock("@/components/layout/PageHeader", () => ({
    PageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
        <div data-testid="page-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
    ),
}));

// ── Hook mock ──────────────────────────────────────────────────────────────

const mockUseResourceList = jest.fn();

jest.mock("@/hooks/use-resource", () => ({
    useResourceList: (...args: unknown[]) => mockUseResourceList(...args),
}));

// ── Fixtures ───────────────────────────────────────────────────────────────

const mockComponents: Component[] = [
    {
        id: 1,
        name: "api-gateway",
        display_name: "API Gateway",
        slug: "api-gateway",
        type_id: 1,
    } as Component,
    {
        id: 2,
        name: "auth-service",
        display_name: "Auth Service",
        slug: "auth-service",
        type_id: 2,
    } as Component,
];

function makePaginatedResponse(
    data: Component[] = mockComponents,
    page = 1,
    lastPage = 1,
): PaginatedResponse<Component> {
    return {
        data,
        meta: {
            current_page: page,
            last_page: lastPage,
            per_page: 15,
            total: data.length,
            from: 1,
            to: data.length,
        },
        links: { first: "", last: "", prev: null, next: null },
    };
}

const idleState = (data = makePaginatedResponse()) => ({
    data,
    loading: false,
    error: null,
    refetch: jest.fn(),
});

const loadingState = {
    data: null,
    loading: true,
    error: null,
    refetch: jest.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────

describe("ComponentsPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ──────────────────────────────────────────────────────────────────────
    describe("Layout", () => {
        it("renders the page header with title 'Componentes'", () => {
            mockUseResourceList.mockReturnValue(idleState());
            render(<ComponentsPage />);
            expect(screen.getByTestId("page-header")).toBeInTheDocument();
            expect(screen.getByText("Componentes")).toBeInTheDocument();
        });

        it("renders a search input", () => {
            mockUseResourceList.mockReturnValue(idleState());
            render(<ComponentsPage />);
            expect(screen.getByRole("searchbox")).toBeInTheDocument();
        });
    });

    // ──────────────────────────────────────────────────────────────────────
    describe("Loading state", () => {
        it("shows skeleton rows while loading", () => {
            mockUseResourceList.mockReturnValue(loadingState);
            render(<ComponentsPage />);
            expect(
                screen.getAllByTestId("data-table-skeleton-row").length,
            ).toBeGreaterThan(0);
        });

        it("does not show data rows while loading", () => {
            mockUseResourceList.mockReturnValue(loadingState);
            render(<ComponentsPage />);
            expect(screen.queryByText("API Gateway")).not.toBeInTheDocument();
        });
    });

    // ──────────────────────────────────────────────────────────────────────
    describe("Data rendering", () => {
        it("renders component display names from the hook response", () => {
            mockUseResourceList.mockReturnValue(idleState());
            render(<ComponentsPage />);
            expect(screen.getByText("API Gateway")).toBeInTheDocument();
            expect(screen.getByText("Auth Service")).toBeInTheDocument();
        });

        it("renders one row per component", () => {
            mockUseResourceList.mockReturnValue(idleState());
            render(<ComponentsPage />);
            // header row + 2 data rows = 3 tr elements
            const rows = screen.getAllByRole("row");
            // at least 2 data rows (beyond the header)
            expect(rows.length).toBeGreaterThanOrEqual(3);
        });

        it("shows empty state when the list is empty", () => {
            mockUseResourceList.mockReturnValue(
                idleState(makePaginatedResponse([])),
            );
            render(<ComponentsPage />);
            // Only the header row should be present — no data rows
            const rows = screen.queryAllByRole("row");
            expect(rows).toHaveLength(1);
        });
    });

    // ──────────────────────────────────────────────────────────────────────
    describe("Search", () => {
        it("passes search param to useResourceList after user types", async () => {
            const user = userEvent.setup();
            mockUseResourceList.mockReturnValue(idleState());
            render(<ComponentsPage />);

            const input = screen.getByRole("searchbox");
            await user.type(input, "gateway");

            // The last call should include the search term
            const lastCall =
                mockUseResourceList.mock.calls[
                    mockUseResourceList.mock.calls.length - 1
                ];
            expect(lastCall[1]).toMatchObject({ search: "gateway" });
        });

        it("resets to page 1 when search changes", async () => {
            const user = userEvent.setup();
            mockUseResourceList.mockReturnValue(idleState());
            render(<ComponentsPage />);

            const input = screen.getByRole("searchbox");
            await user.type(input, "a");

            const lastCall =
                mockUseResourceList.mock.calls[
                    mockUseResourceList.mock.calls.length - 1
                ];
            expect(lastCall[1]).toMatchObject({ page: 1 });
        });
    });

    // ──────────────────────────────────────────────────────────────────────
    describe("Navigation", () => {
        it("navigates to component detail page when a row is clicked", async () => {
            const user = userEvent.setup();
            mockUseResourceList.mockReturnValue(idleState());
            render(<ComponentsPage />);

            // All <tr> elements: first is header, then data rows
            const rows = screen.getAllByRole("row");
            await user.click(rows[1]);

            expect(mockPush).toHaveBeenCalledWith("/es/components/api-gateway");
        });
    });

    // ──────────────────────────────────────────────────────────────────────
    describe("Pagination", () => {
        it("shows pagination when there are multiple pages", () => {
            mockUseResourceList.mockReturnValue(
                idleState(makePaginatedResponse(mockComponents, 1, 3)),
            );
            render(<ComponentsPage />);
            expect(
                screen.getByRole("button", { name: /next|siguiente/i }),
            ).toBeInTheDocument();
        });

        it("does not show pagination on a single page", () => {
            mockUseResourceList.mockReturnValue(
                idleState(makePaginatedResponse(mockComponents, 1, 1)),
            );
            render(<ComponentsPage />);
            expect(
                screen.queryByRole("button", { name: /next|siguiente/i }),
            ).not.toBeInTheDocument();
        });
    });
});
