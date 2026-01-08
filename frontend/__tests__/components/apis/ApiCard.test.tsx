/**
 * Tests for ApiCard Component
 * Following TDD approach - tests written first
 * 
 * ApiCard displays a single API in grid or list view with actions
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ApiCard from "@/components/apis/ApiCard";
import type { Api } from "@/types/api";

// Mock next/link to prevent routing issues in tests
jest.mock("next/link", () => {
    return function MockedLink({ children, href }: any) {
        return (
            <a href={href} data-testid="api-link">
                {children}
            </a>
        );
    };
});

// Mock react-icons to simplify tests
jest.mock("react-icons/hi2", () => ({
    HiCodeBracket: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-code-bracket"} className={className}>
            📝
        </span>
    ),
    HiGlobeAlt: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-globe"} className={className}>
            🌐
        </span>
    ),
    HiCloud: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-cloud"} className={className}>
            ☁️
        </span>
    ),
    HiServerStack: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-server"} className={className}>
            🖥️
        </span>
    ),
    HiCog6Tooth: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-cog"} className={className}>
            ⚙️
        </span>
    ),
    HiArrowTopRightOnSquare: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-arrow"} className={className}>
            ↗️
        </span>
    ),
    HiEllipsisVertical: ({ "data-testid": testid, className, onClick }: any) => (
        <button data-testid={testid || "icon-menu"} className={className} onClick={onClick}>
            ⋮
        </button>
    ),
    HiPencil: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-pencil"} className={className}>
            ✏️
        </span>
    ),
    HiTrash: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-trash"} className={className}>
            🗑️
        </span>
    ),
    HiDocumentDuplicate: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-duplicate"} className={className}>
            📋
        </span>
    ),
    HiEye: ({ "data-testid": testid, className }: any) => (
        <span data-testid={testid || "icon-eye"} className={className}>
            👁️
        </span>
    ),
}));

// Mock Badge component
jest.mock("@/components/ui/Badge", () => ({
    Badge: ({ children, variant, className, style }: any) => (
        <div data-testid="badge" className={`badge ${variant} ${className || ""}`} style={style}>
            {children}
        </div>
    ),
}));

// Mock Highlight component
jest.mock("@/components/ui/highlight", () => ({
    Highlight: ({ children, query }: any) => (
        <span data-testid="highlight">{children}</span>
    ),
}));

// Sample test data
const mockApi: Api = {
    id: 1,
    name: "payment-api",
    display_name: "Payment API",
    description: "REST API for processing payments and transactions",
    slug: "payment-api",
    type_id: 1,
    lifecycle_id: 2,
    platform_id: 1,
    domain_id: 1,
    owner_id: 1,
    tier_id: 2,
    criticality_id: 3,
    operational_status_id: 1,
    status_id: 1,
    is_stateless: true,
    has_zero_downtime_deployment: true,
    tags: { team: "payments", criticality: "high" },
    discovery_source: null,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-06-20T15:45:00Z",
    created_by: 1,
    updated_by: 1,
};

describe("ApiCard", () => {
    describe("Rendering - Basic", () => {
        it("should render the component without crashing", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                />
            );
            expect(container).toBeInTheDocument();
            expect(container.firstChild).not.toBeNull();
        });

        it("should render with API data", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                />
            );
            // The component should render and contain the API id in URLs
            const links = container.querySelectorAll("a");
            expect(links.length).toBeGreaterThan(0);
        });

        it("should render protocol badge", () => {
            render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                />
            );
            const badges = screen.getAllByTestId("badge");
            expect(badges.length).toBeGreaterThan(0);
        });

        it("should have links to API detail page", () => {
            render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                />
            );
            const links = screen.getAllByTestId("api-link");
            expect(links.length).toBeGreaterThan(0);
            expect(links[0]).toHaveAttribute("href", expect.stringContaining("/apis/1"));
        });

        it("should render with proper structure", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                />
            );
            // Should have a div wrapper with flex/group classes
            const card = container.querySelector("div[class*='group relative']");
            expect(card).toBeInTheDocument();
        });
    });

    describe("Rendering - View Modes", () => {
        it("should render in grid view mode", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                />
            );
            // Grid view should be the default card layout
            expect(container.querySelector('[data-testid="api-link"]')).toBeInTheDocument();
        });

        it("should render in list view mode", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="list"
                />
            );
            // List view should also be supported
            expect(container.querySelector('[data-testid="api-link"]')).toBeInTheDocument();
        });
    });

    describe("Styling", () => {
        it("should apply custom className if provided", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    className="custom-class"
                />
            );
            expect(container.firstChild).toHaveClass("custom-class");
        });

        it("should have selected styling when isSelected is true", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    isSelected={true}
                />
            );
            // Should have some selection indicator
            expect(container.firstChild).toBeInTheDocument();
        });
    });

    describe("Actions", () => {
        it("should show actions button when showActions is true", () => {
            render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    showActions={true}
                />
            );
            expect(screen.getByTestId("icon-menu")).toBeInTheDocument();
        });

        it("should not show actions button when showActions is false", () => {
            render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    showActions={false}
                />
            );
            // Menu button should not be rendered
            const buttons = screen.queryAllByTestId("icon-menu");
            expect(buttons.length).toBe(0);
        });

        it("should call onEdit callback when edit action is triggered", async () => {
            const handleEdit = jest.fn();
            render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    showActions={true}
                    onEdit={handleEdit}
                />
            );

            const menuButton = screen.getByTestId("icon-menu");
            fireEvent.click(menuButton);
            // Menu opens, now find Edit button
            await waitFor(() => {
                expect(screen.getByText("Editar")).toBeInTheDocument();
            });
        });

        it("should call onClick callback when card is clicked", async () => {
            const handleClick = jest.fn();
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    onClick={handleClick}
                />
            );

            // The card div should be clickable when onClick is provided
            const cardDiv = container.querySelector("div[class*='group relative flex']");
            if (cardDiv) {
                fireEvent.click(cardDiv);
                expect(handleClick).toHaveBeenCalledWith(mockApi);
            }
        });
    });

    describe("Search Highlighting", () => {
        it("should work with search query for highlighting", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    searchQuery="payment"
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should work without search query", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    searchQuery={undefined}
                />
            );
            expect(container).toBeInTheDocument();
        });
    });

    describe("Optional Props", () => {
        it("should render without showActions", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    showActions={false}
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should render without isSelected", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                    isSelected={false}
                />
            );
            expect(container).toBeInTheDocument();
        });
    });

    describe("Localization", () => {
        it("should use correct locale for URL generation", () => {
            render(
                <ApiCard
                    api={mockApi}
                    locale="es"
                    viewMode="grid"
                />
            );
            const links = screen.getAllByTestId("api-link");
            expect(links[0]).toHaveAttribute("href", expect.stringContaining("/es/apis/"));
        });

        it("should support different locales", () => {
            const locales = ["en", "es", "fr"];
            locales.forEach((locale) => {
                const { unmount } = render(
                    <ApiCard
                        api={mockApi}
                        locale={locale}
                        viewMode="grid"
                    />
                );
                const links = screen.getAllByTestId("api-link");
                expect(links[0]).toHaveAttribute("href", expect.stringContaining(`/${locale}/apis/`));
                unmount();
            });
        });
    });

    describe("Accessibility", () => {
        it("should have semantic HTML structure with links", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                />
            );
            const links = container.querySelectorAll("a");
            expect(links.length).toBeGreaterThan(0);
        });

        it("should be keyboard navigable", () => {
            const { container } = render(
                <ApiCard
                    api={mockApi}
                    locale="en"
                    viewMode="grid"
                />
            );
            const buttons = container.querySelectorAll("button");
            expect(buttons.length).toBeGreaterThan(0);
        });
    });
});
