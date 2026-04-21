/**
 * Tests for the APIs list page (lean version).
 *
 * Strategy: mock `useResourceList` to control data/loading state, then assert
 * on layout, DataTable rows, search wiring, navigation, and pagination.
 * Mirrors the `ComponentsPage.test.tsx` pattern.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApisPage from "@/app/[locale]/(protected)/apis/page";
import type { Api, PaginatedResponse } from "@/types/api";

// ── External dependencies ──────────────────────────────────────────────────

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
    useParams: () => ({ locale: "es" }),
    useSearchParams: () => mockSearchParams,
}));

jest.mock(
    "react-icons/hi2",
    () =>
        new Proxy(
            { HiOutlineSquares2X2: () => null },
            { get: () => () => null },
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

const mockApis: Api[] = [
    {
        id: 1,
        name: "users-api",
        display_name: "Users API",
        protocol: "REST",
        version: "1.0.0",
    } as unknown as Api,
    {
        id: 2,
        name: "orders-api",
        display_name: "Orders API",
        protocol: "GraphQL",
        version: "2.1.0",
    } as unknown as Api,
];

function makePaginatedResponse(
    data: Api[] = mockApis,
    page = 1,
    lastPage = 1,
): PaginatedResponse<Api> {
    return {
        data,
        meta: {
            current_page: page,
            last_page: lastPage,
            per_page: 15,
            total: data.length,
            from: 1,
            to: data.length,
            path: "/v1/apis",
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

describe("ApisPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSearchParams = new URLSearchParams();
    });

    describe("Layout", () => {
        it("renders the page header with title 'APIs'", () => {
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);
            expect(screen.getByTestId("page-header")).toBeInTheDocument();
            expect(screen.getByText("APIs")).toBeInTheDocument();
        });

        it("renders a search input", () => {
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);
            expect(screen.getByRole("searchbox")).toBeInTheDocument();
        });
    });

    describe("Loading state", () => {
        it("shows skeleton rows while loading", () => {
            mockUseResourceList.mockReturnValue(loadingState);
            render(<ApisPage />);
            expect(
                screen.getAllByTestId("data-table-skeleton-row").length,
            ).toBeGreaterThan(0);
        });

        it("does not show data rows while loading", () => {
            mockUseResourceList.mockReturnValue(loadingState);
            render(<ApisPage />);
            expect(screen.queryByText("Users API")).not.toBeInTheDocument();
        });
    });

    describe("Data rendering", () => {
        it("renders API display names from the hook response", () => {
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);
            expect(screen.getByText("Users API")).toBeInTheDocument();
            expect(screen.getByText("Orders API")).toBeInTheDocument();
        });

        it("shows empty state when the list is empty", () => {
            mockUseResourceList.mockReturnValue(
                idleState(makePaginatedResponse([])),
            );
            render(<ApisPage />);
            const rows = screen.queryAllByRole("row");
            expect(rows).toHaveLength(1);
        });
    });

    describe("Search", () => {
        it("passes search param to useResourceList after user types", async () => {
            const user = userEvent.setup();
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);

            const input = screen.getByRole("searchbox");
            await user.type(input, "users");

            const lastCall =
                mockUseResourceList.mock.calls[
                    mockUseResourceList.mock.calls.length - 1
                ];
            expect(lastCall[1]).toMatchObject({ search: "users" });
        });

        it("resets to page 1 when search changes", async () => {
            const user = userEvent.setup();
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);

            const input = screen.getByRole("searchbox");
            await user.type(input, "a");

            const lastCall =
                mockUseResourceList.mock.calls[
                    mockUseResourceList.mock.calls.length - 1
                ];
            expect(lastCall[1]).toMatchObject({ page: 1 });
        });
    });

    describe("Navigation", () => {
        it("navigates to API detail page when a row is clicked", async () => {
            const user = userEvent.setup();
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);

            const rows = screen.getAllByRole("row");
            await user.click(rows[1]);

            expect(mockPush).toHaveBeenCalledWith("/es/apis/1");
        });
    });

    describe("Pagination", () => {
        it("shows pagination when there are multiple pages", () => {
            mockUseResourceList.mockReturnValue(
                idleState(makePaginatedResponse(mockApis, 1, 3)),
            );
            render(<ApisPage />);
            expect(
                screen.getByRole("button", { name: /next|siguiente/i }),
            ).toBeInTheDocument();
        });

        it("does not show pagination on a single page", () => {
            mockUseResourceList.mockReturnValue(
                idleState(makePaginatedResponse(mockApis, 1, 1)),
            );
            render(<ApisPage />);
            expect(
                screen.queryByRole("button", { name: /next|siguiente/i }),
            ).not.toBeInTheDocument();
        });
    });

    describe("URL state sync", () => {
        it("initializes search from the ?search= query param", () => {
            mockSearchParams = new URLSearchParams("search=users");
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);
            const input = screen.getByRole("searchbox") as HTMLInputElement;
            expect(input.value).toBe("users");
        });

        it("initializes page from the ?page= query param", () => {
            mockSearchParams = new URLSearchParams("page=3");
            mockUseResourceList.mockReturnValue(
                idleState(makePaginatedResponse(mockApis, 3, 5)),
            );
            render(<ApisPage />);
            const firstCall = mockUseResourceList.mock.calls[0];
            expect(firstCall[1]).toMatchObject({ page: 3 });
        });

        it("passes initial search from URL into useResourceList", () => {
            mockSearchParams = new URLSearchParams("search=orders");
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);
            const firstCall = mockUseResourceList.mock.calls[0];
            expect(firstCall[1]).toMatchObject({ search: "orders" });
        });

        it("pushes search changes to the URL via router.replace", async () => {
            const user = userEvent.setup();
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);

            const input = screen.getByRole("searchbox");
            await user.type(input, "pay");

            expect(mockReplace).toHaveBeenCalled();
            const lastUrl = mockReplace.mock.calls.at(-1)?.[0] as string;
            expect(lastUrl).toMatch(/search=pay/);
            // page=1 should NOT appear in URL (it's the default)
            expect(lastUrl).not.toMatch(/page=/);
        });

        it("omits ?search= from the URL when the input is cleared", async () => {
            mockSearchParams = new URLSearchParams("search=initial");
            const user = userEvent.setup();
            mockUseResourceList.mockReturnValue(idleState());
            render(<ApisPage />);

            const input = screen.getByRole("searchbox");
            await user.clear(input);

            expect(mockReplace).toHaveBeenCalled();
            const lastUrl = mockReplace.mock.calls.at(-1)?.[0] as string;
            expect(lastUrl).not.toMatch(/search=/);
        });
    });
});
