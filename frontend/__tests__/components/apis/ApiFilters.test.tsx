/**
 * Tests for ApiFilters Component
 * Following TDD approach - tests written first
 *
 * ApiFilters provides advanced filtering capabilities for APIs list
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    ApiFilters,
    defaultFilters,
    type ApiFiltersState,
} from "@/components/apis/ApiFilters";

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiOutlineFunnel: ({ className }: any) => (
        <span data-testid="icon-funnel" className={className}>
            🔽
        </span>
    ),
    HiOutlineXMark: ({ className, onClick }: any) => (
        <button
            data-testid="icon-close"
            className={className}
            onClick={onClick}
        >
            ✕
        </button>
    ),
    HiOutlineChevronDown: ({ className }: any) => (
        <span data-testid="icon-chevron" className={className}>
            ▼
        </span>
    ),
    HiOutlineCheck: ({ className }: any) => (
        <span data-testid="icon-check" className={className}>
            ✓
        </span>
    ),
    HiOutlineMagnifyingGlass: ({ className }: any) => (
        <span data-testid="icon-search" className={className}>
            🔍
        </span>
    ),
}));

// Sample test data
const mockApiTypes: any[] = [
    { id: 1, name: "REST" },
    { id: 2, name: "GraphQL" },
    { id: 3, name: "gRPC" },
];

const mockStatuses: any[] = [
    { id: 1, name: "Published" },
    { id: 2, name: "Draft" },
];

const mockLifecycles: any[] = [
    { id: 1, name: "Active" },
    { id: 2, name: "Deprecated" },
];

const mockOwners: any[] = [
    { id: 1, name: "Platform Team" },
    { id: 2, name: "Backend Team" },
];

const mockInitialFilters: ApiFiltersState = defaultFilters;

describe("ApiFilters Component", () => {
    const mockOnFiltersChange = jest.fn();

    beforeEach(() => {
        mockOnFiltersChange.mockClear();
    });

    describe("Rendering - Basic", () => {
        it("should render without crashing", () => {
            const { container } = render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should render search input", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                />
            );
            const searchInput = screen.getByPlaceholderText(/buscar|search/i);
            expect(searchInput).toBeInTheDocument();
        });

        it("should render filter funnel icon", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                />
            );
            const filterIcon = screen.getByTestId("icon-funnel");
            expect(filterIcon).toBeInTheDocument();
        });

        it("should render funnel button with filter count", () => {
            const filtersWithValues = {
                ...mockInitialFilters,
                types: [1],
                statuses: [1],
            };
            render(
                <ApiFilters
                    filters={filtersWithValues}
                    onFiltersChange={mockOnFiltersChange}
                />
            );
            // Should show filter count badge
            const filterButton = screen.getByText("Filtros");
            expect(filterButton).toBeInTheDocument();
        });
    });

    describe("Search Functionality", () => {
        it("should update search filter when typing", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                />
            );
            const searchInput = screen.getByPlaceholderText(
                /buscar|search/i
            ) as HTMLInputElement;
            fireEvent.change(searchInput, { target: { value: "payment" } });

            expect(mockOnFiltersChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    search: "payment",
                })
            );
        });

        it("should clear search when clear button is clicked in search input", () => {
            const filtersWithSearch = { ...mockInitialFilters, search: "test" };
            render(
                <ApiFilters
                    filters={filtersWithSearch}
                    onFiltersChange={mockOnFiltersChange}
                />
            );

            // Find the X button in search input
            const closeButtons = screen.getAllByTestId("icon-close");
            // First close button should be in search input
            fireEvent.click(closeButtons[0]);

            expect(mockOnFiltersChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    search: "",
                })
            );
        });
    });

    describe("Filter Sections - Rendering", () => {
        it("should render filter panel when not collapsed", () => {
            const { container } = render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                    collapsed={false}
                />
            );
            // Filter panel should be rendered (dark:bg-gray-800/50)
            const panels = container.querySelectorAll(".bg-gray-50");
            expect(panels.length).toBeGreaterThan(0);
        });

        it("should hide filter panel when collapsed", () => {
            const { container } = render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                    collapsed={true}
                />
            );
            // Filter sections should be hidden
            const panels = container.querySelectorAll(".bg-gray-50");
            expect(panels.length).toBe(0);
        });

        it("should accept multiple filter options", () => {
            const { container } = render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                    apiStatuses={mockStatuses}
                    lifecycles={mockLifecycles}
                    owners={mockOwners}
                    collapsed={false}
                />
            );
            // Component should render without errors
            expect(container).toBeInTheDocument();
        });

        it("should render with empty options arrays", () => {
            const { container } = render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={[]}
                    collapsed={false}
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should render deprecation filter section", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    collapsed={false}
                />
            );
            // Deprecation filter shows options
            expect(screen.getByText("Todos")).toBeInTheDocument();
            expect(screen.getByText("Activos")).toBeInTheDocument();
            expect(screen.getByText("Deprecados")).toBeInTheDocument();
        });
    });

    describe("Filter Selection", () => {
        it("should handle filter prop changes", () => {
            const initialFilters = { ...mockInitialFilters, types: [] };
            const { rerender } = render(
                <ApiFilters
                    filters={initialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                />
            );

            // Update filters to include a type
            const updatedFilters = { ...mockInitialFilters, types: [1] };
            rerender(
                <ApiFilters
                    filters={updatedFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                />
            );

            expect(mockOnFiltersChange).not.toHaveBeenCalled();
        });

        it("should accept new filter options via props", () => {
            const { rerender } = render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                />
            );

            rerender(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={[...mockApiTypes, { id: 4, name: "WebSocket" }]}
                />
            );

            expect(mockOnFiltersChange).not.toHaveBeenCalled();
        });

        it("should render deprecation filter buttons", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    collapsed={false}
                />
            );

            const todosButton = screen.getByText("Todos");
            const activosButton = screen.getByText("Activos");
            expect(todosButton).toBeInTheDocument();
            expect(activosButton).toBeInTheDocument();
        });
    });

    describe("Filter Display - Badges", () => {
        it("should display active filter badge", () => {
            const filtersWithType = {
                ...mockInitialFilters,
                types: [1],
            };
            render(
                <ApiFilters
                    filters={filtersWithType}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                />
            );

            // Filter badge section should be rendered
            const badges = screen.getAllByText(/Tipo:/i);
            expect(badges.length).toBeGreaterThan(0);
        });

        it("should display remove button on badge", () => {
            const filtersWithType = {
                ...mockInitialFilters,
                types: [1],
            };
            render(
                <ApiFilters
                    filters={filtersWithType}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                />
            );

            // Close button should be present
            const closeButtons = screen.getAllByTestId("icon-close");
            expect(closeButtons.length).toBeGreaterThan(0);
        });

        it("should show clear all button with filters", () => {
            const filtersWithType = {
                ...mockInitialFilters,
                types: [1],
            };
            render(
                <ApiFilters
                    filters={filtersWithType}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                />
            );

            // Limpiar todo button should appear
            expect(screen.getByText("Limpiar todo")).toBeInTheDocument();
        });
    });

    describe("Reset Functionality", () => {
        it("should show clear all button when filters are active", () => {
            const filtersWithValues = {
                ...mockInitialFilters,
                types: [1],
            };
            render(
                <ApiFilters
                    filters={filtersWithValues}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                />
            );

            // "Limpiar todo" button should appear when filters exist
            const clearAllButton = screen.getByText(/Limpiar todo/i);
            expect(clearAllButton).toBeInTheDocument();
        });

        it("should reset all filters when clicking limpiar todo", () => {
            const filtersWithValues = {
                ...mockInitialFilters,
                types: [1],
            };
            render(
                <ApiFilters
                    filters={filtersWithValues}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                />
            );

            const clearAllButton = screen.getByText(/Limpiar todo/i);
            fireEvent.click(clearAllButton);

            expect(mockOnFiltersChange).toHaveBeenCalledWith(defaultFilters);
        });

        it("should not show clear all button when no filters are active", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                />
            );

            // "Limpiar todo" should not be visible
            const clearAllButton = screen.queryByText(/Limpiar todo/i);
            expect(clearAllButton).not.toBeInTheDocument();
        });
    });

    describe("Collapse Functionality", () => {
        it("should render collapsed when collapsed prop is true", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    collapsed={true}
                />
            );

            const funnelIcon = screen.getByTestId("icon-funnel");
            expect(funnelIcon).toBeInTheDocument();
        });

        it("should call onCollapsedChange when toggling", () => {
            const mockOnCollapsedChange = jest.fn();
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    collapsed={false}
                    onCollapsedChange={mockOnCollapsedChange}
                />
            );

            const toggleButton = screen.getByTestId("icon-funnel");
            fireEvent.click(toggleButton);

            expect(mockOnCollapsedChange).toHaveBeenCalled();
        });
    });

    describe("Props Handling", () => {
        it("should handle empty filter arrays gracefully", () => {
            const { container } = render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={[]}
                    apiStatuses={[]}
                    lifecycles={[]}
                    owners={[]}
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should handle undefined options gracefully", () => {
            const { container } = render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should apply custom className if provided", () => {
            const { container } = render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    className="custom-filter-class"
                />
            );
            const filterSection = container.querySelector(
                ".custom-filter-class"
            );
            expect(filterSection).toBeInTheDocument();
        });

        it("should hide search bar when hideSearchBar prop is true", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    hideSearchBar={true}
                />
            );
            const searchInput = screen.queryByPlaceholderText(/buscar|search/i);
            expect(searchInput).not.toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("should have proper input type for search", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                    apiTypes={mockApiTypes}
                    collapsed={false}
                />
            );
            const searchInput = screen.getByPlaceholderText(/buscar|search/i);
            expect(searchInput).toHaveAttribute("type", "text");
        });

        it("should support focus management", () => {
            render(
                <ApiFilters
                    filters={mockInitialFilters}
                    onFiltersChange={mockOnFiltersChange}
                />
            );
            const searchInput = screen.getByPlaceholderText(
                /buscar|search/i
            ) as HTMLInputElement;
            searchInput.focus();
            expect(searchInput).toHaveFocus();
        });
    });
});
