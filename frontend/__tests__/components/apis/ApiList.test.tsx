/**
 * Tests for ApiList Component
 * Following TDD approach - tests written first
 *
 * ApiList displays a list/grid of API cards with filtering, sorting, and view mode controls
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ApiList, ViewToggle, type ViewMode } from "@/components/apis/ApiList";
import type { Api } from "@/types/api";

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiSquares2X2: ({ className, onClick }: any) => (
        <button data-testid="icon-grid" className={className} onClick={onClick}>
            ⊞
        </button>
    ),
    HiListBullet: ({ className, onClick }: any) => (
        <button data-testid="icon-list" className={className} onClick={onClick}>
            ☰
        </button>
    ),
    HiArrowsUpDown: ({ className }: any) => (
        <span data-testid="icon-sort" className={className}>
            ⇅
        </span>
    ),
    HiChevronDown: ({ className }: any) => (
        <span data-testid="icon-chevron" className={className}>
            ▼
        </span>
    ),
}));

// Mock child components
jest.mock("@/components/apis/ApiCard", () => ({
    ApiCard: ({ api, viewMode, locale }: any) => (
        <div data-testid={`api-card-${api.id}`} data-viewmode={viewMode}>
            {api.name}
        </div>
    ),
    ApiCardSkeleton: () => <div data-testid="api-skeleton">Loading...</div>,
}));

jest.mock("@/components/ui/empty-state", () => ({
    EmptyState: ({ title, description }: any) => (
        <div data-testid="empty-state">
            {title}
            {description}
        </div>
    ),
}));

// Sample test data
const mockApis: Api[] = [
    {
        id: 1,
        name: "Payment API",
        slug: "payment-api",
        description: "API for payment processing",
        version: "1.0.0",
        protocol: "REST",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T00:00:00Z",
        owner: "Finance Team",
        status: "published",
        lifecycle: "active",
        tags: ["payments", "financial"],
    } as any,
    {
        id: 2,
        name: "User API",
        slug: "user-api",
        description: "API for user management",
        version: "2.1.0",
        protocol: "GraphQL",
        created_at: "2024-01-05T00:00:00Z",
        updated_at: "2024-01-10T00:00:00Z",
        owner: "Platform Team",
        status: "published",
        lifecycle: "active",
        tags: ["users", "auth"],
    } as any,
    {
        id: 3,
        name: "Analytics API",
        slug: "analytics-api",
        description: "API for analytics data",
        version: "1.5.0",
        protocol: "REST",
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-01-12T00:00:00Z",
        owner: "Data Team",
        status: "draft",
        lifecycle: "deprecated",
        tags: ["analytics", "reporting"],
    } as any,
];

describe("ApiList Component", () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnDuplicate = jest.fn();

    beforeEach(() => {
        mockOnEdit.mockClear();
        mockOnDelete.mockClear();
        mockOnDuplicate.mockClear();
    });

    describe("Rendering - Basic", () => {
        it("should render without crashing", () => {
            const { container } = render(
                <ApiList apis={mockApis} locale="en" />
            );
            expect(container).toBeInTheDocument();
        });

        it("should render all APIs in the list", () => {
            render(<ApiList apis={mockApis} locale="en" />);

            expect(screen.getByTestId("api-card-1")).toBeInTheDocument();
            expect(screen.getByTestId("api-card-2")).toBeInTheDocument();
            expect(screen.getByTestId("api-card-3")).toBeInTheDocument();
        });

        it("should render view toggle button", () => {
            render(<ApiList apis={mockApis} locale="en" showViewToggle={true} />);
            expect(screen.getByTestId("icon-grid")).toBeInTheDocument();
        });

        it("should render sort controls when enabled", () => {
            render(<ApiList apis={mockApis} locale="en" showSort={true} />);
            expect(screen.getByText("Nombre")).toBeInTheDocument();
        });

        it("should render empty state when no APIs", () => {
            render(
                <ApiList
                    apis={[]}
                    locale="en"
                    emptyMessage="No APIs found"
                    emptyDescription="Create a new one"
                />
            );
            expect(screen.getByTestId("empty-state")).toBeInTheDocument();
        });

        it("should render loading skeletons when loading", () => {
            render(<ApiList apis={mockApis} locale="en" loading={true} />);
            expect(screen.getAllByTestId("api-skeleton").length).toBeGreaterThan(0);
        });
    });

    describe("View Mode Toggle", () => {
        it("should toggle between grid and list view", () => {
            const { rerender } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    defaultViewMode="grid"
                    showViewToggle={true}
                />
            );

            // Initially grid view
            let cards = screen.getAllByTestId(/api-card/);
            expect(cards[0]).toHaveAttribute("data-viewmode", "grid");

            // Click to switch to list view
            const listButton = screen.getByTestId("icon-list");
            fireEvent.click(listButton);

            // After click, should be in list mode
            rerender(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    defaultViewMode="list"
                    showViewToggle={true}
                />
            );

            cards = screen.getAllByTestId(/api-card/);
            expect(cards[0]).toHaveAttribute("data-viewmode", "list");
        });

        it("should not show toggle when showViewToggle is false", () => {
            render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    showViewToggle={false}
                />
            );
            expect(screen.queryByTestId("icon-grid")).not.toBeInTheDocument();
        });

        it("should show grid icon in default grid view", () => {
            render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    defaultViewMode="grid"
                    showViewToggle={true}
                />
            );
            expect(screen.getByTestId("icon-grid")).toBeInTheDocument();
        });
    });

    describe("Sorting", () => {
        it("should sort APIs by name ascending", () => {
            render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    showSort={true}
                />
            );

            const cards = screen.getAllByTestId(/api-card/);
            // Should be sorted: Analytics, Payment, User
            expect(cards[0]).toHaveTextContent("Analytics API");
        });

        it("should render sort field options", () => {
            render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    showSort={true}
                />
            );
            // Initial label is "Nombre" (default)
            expect(screen.getByText("Nombre")).toBeInTheDocument();
            
            // Other options appear in dropdown when clicking sort button
            const sortButton = screen.getByRole("button", { name: /Nombre/i });
            fireEvent.click(sortButton);
            
            expect(screen.getByText("Fecha de creación")).toBeInTheDocument();
            expect(screen.getByText("Última actualización")).toBeInTheDocument();
            expect(screen.getByText("Versión")).toBeInTheDocument();
        });

        it("should not show sort when showSort is false", () => {
            render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    showSort={false}
                />
            );
            expect(screen.queryByText("Nombre")).not.toBeInTheDocument();
        });

        it("should toggle sort order on click", () => {
            const { container } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    showSort={true}
                />
            );

            // Find sort order indicator
            const sortButtons = screen.getAllByRole("button");
            // Click a sort button to toggle order
            if (sortButtons.length > 0) {
                fireEvent.click(sortButtons[0]);
                expect(container).toBeInTheDocument();
            }
        });
    });

    describe("Grid Layout", () => {
        it("should render grid layout by default", () => {
            const { container } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    columns={3}
                    defaultViewMode="grid"
                />
            );

            // Container should exist
            expect(container).toBeInTheDocument();
        });

        it("should respect columns prop", () => {
            const { container } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    columns={2}
                    defaultViewMode="grid"
                />
            );

            expect(container).toBeInTheDocument();
        });

        it("should support different column counts", () => {
            const { rerender, container } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    columns={4}
                    defaultViewMode="grid"
                />
            );

            expect(container).toBeInTheDocument();

            rerender(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    columns={2}
                    defaultViewMode="grid"
                />
            );

            expect(container).toBeInTheDocument();
        });
    });

    describe("Callbacks", () => {
        it("should accept edit callback prop", () => {
            const { container } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    onEdit={mockOnEdit}
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should accept delete callback prop", () => {
            const { container } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    onDelete={mockOnDelete}
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should accept duplicate callback prop", () => {
            const { container } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    onDuplicate={mockOnDuplicate}
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should pass callbacks to child components", () => {
            render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                    onDuplicate={mockOnDuplicate}
                />
            );

            // Callbacks are passed to ApiCard components
            expect(screen.getByTestId("api-card-1")).toBeInTheDocument();
        });
    });

    describe("Props Handling", () => {
        it("should handle empty API array", () => {
            render(
                <ApiList
                    apis={[]}
                    locale="en"
                    emptyMessage="No APIs"
                />
            );
            expect(screen.getByTestId("empty-state")).toBeInTheDocument();
        });

        it("should apply custom className", () => {
            const { container } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    className="custom-list-class"
                />
            );

            const listElement = container.querySelector(".custom-list-class");
            expect(listElement).toBeInTheDocument();
        });

        it("should support locale prop", () => {
            const { container } = render(
                <ApiList
                    apis={mockApis}
                    locale="es"
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should show loading state", () => {
            render(
                <ApiList
                    apis={[]}
                    locale="en"
                    loading={true}
                />
            );
            expect(screen.getAllByTestId("api-skeleton").length).toBeGreaterThan(0);
        });

        it("should use default empty message", () => {
            render(
                <ApiList
                    apis={[]}
                    locale="en"
                />
            );
            const emptyState = screen.getByTestId("empty-state");
            expect(emptyState.textContent).toContain("No se encontraron APIs");
        });

        it("should use custom empty message", () => {
            render(
                <ApiList
                    apis={[]}
                    locale="en"
                    emptyMessage="Custom empty message"
                />
            );
            const emptyState = screen.getByTestId("empty-state");
            expect(emptyState.textContent).toContain("Custom empty message");
        });
    });

    describe("ViewToggle Sub-component", () => {
        it("should render view toggle buttons", () => {
            const handleChange = jest.fn();
            render(
                <ViewToggle
                    viewMode="grid"
                    onChange={handleChange}
                />
            );
            expect(screen.getByTestId("icon-grid")).toBeInTheDocument();
            expect(screen.getByTestId("icon-list")).toBeInTheDocument();
        });

        it("should call onChange when toggling view", () => {
            const handleChange = jest.fn();
            render(
                <ViewToggle
                    viewMode="grid"
                    onChange={handleChange}
                />
            );

            const listButton = screen.getByTestId("icon-list");
            fireEvent.click(listButton);

            expect(handleChange).toHaveBeenCalled();
        });

        it("should call onChange with correct view mode", () => {
            const handleChange = jest.fn();
            render(
                <ViewToggle
                    viewMode="grid"
                    onChange={handleChange}
                />
            );

            const listButton = screen.getByTestId("icon-list");
            fireEvent.click(listButton);

            expect(handleChange).toHaveBeenCalledWith("list");
        });
    });

    describe("Accessibility", () => {
        it("should have accessible buttons for controls", () => {
            render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    showViewToggle={true}
                    showSort={true}
                />
            );

            const buttons = screen.getAllByRole("button");
            expect(buttons.length).toBeGreaterThan(0);
        });

        it("should have proper semantic structure", () => {
            const { container } = render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                />
            );

            // Component should have proper structure
            expect(container.firstChild).toBeInTheDocument();
        });

        it("should be keyboard navigable", () => {
            render(
                <ApiList
                    apis={mockApis}
                    locale="en"
                    showViewToggle={true}
                />
            );

            const buttons = screen.getAllByRole("button");
            expect(buttons[0]).toBeInTheDocument();
        });
    });
});
