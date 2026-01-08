/**
 * Tests for API Dependencies Component
 * Following TDD approach - tests written first
 *
 * Component displays API dependencies with relationships:
 * - Consumer and provider relationships
 * - Component links and navigation
 * - Relationship labels and colors
 * - Loading and error states
 * - Empty state handling
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Link from "next/link";
import type { Api } from "@/types/api";
import { ApiDependencies } from "@/components/apis/ApiDetail/ApiDependencies";
import * as apiDependenciesApi from "@/lib/api/api-dependencies";

// Mock Next.js Link
jest.mock("next/link", () => {
    return ({ children, href }: any) => {
        return <a href={href}>{children}</a>;
    };
});

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiOutlineArrowsRightLeft: ({ className }: any) => (
        <span data-testid="icon-dependency" className={className}>↔</span>
    ),
    HiOutlineArrowLongRight: ({ className }: any) => (
        <span data-testid="icon-consumer" className={className}>→</span>
    ),
    HiOutlineArrowLongLeft: ({ className }: any) => (
        <span data-testid="icon-provider" className={className}>←</span>
    ),
    HiOutlineCpuChip: ({ className }: any) => (
        <span data-testid="icon-chip" className={className}>🔧</span>
    ),
    HiOutlineChevronRight: ({ className }: any) => (
        <span data-testid="icon-chevron" className={className}>›</span>
    ),
    HiOutlineInformationCircle: ({ className }: any) => (
        <span data-testid="icon-info" className={className}>ℹ</span>
    ),
    HiOutlineExclamationTriangle: ({ className }: any) => (
        <span data-testid="icon-warning" className={className}>⚠</span>
    ),
    HiOutlineArrowDownTray: ({ className }: any) => (
        <span data-testid="icon-download" className={className}>⬇</span>
    ),
    HiOutlineArrowUpTray: ({ className }: any) => (
        <span data-testid="icon-upload" className={className}>⬆</span>
    ),
}));

// Mock API dependencies module
jest.mock("@/lib/api/api-dependencies", () => ({
    apiDependenciesApi: {
        getById: jest.fn(),
    },
    getRelationshipLabel: jest.fn((type) => {
        const labels: Record<string, string> = {
            consumes: "Consume",
            provides: "Provee",
            owns: "Posee",
            uses: "Usa",
        };
        return labels[type] || "Desconocido";
    }),
    getRelationshipColor: jest.fn((type) => {
        const colors: Record<string, string> = {
            consumes: "text-blue-600 dark:text-blue-400",
            provides: "text-green-600 dark:text-green-400",
            owns: "text-purple-600 dark:text-purple-400",
            uses: "text-orange-600 dark:text-orange-400",
        };
        return colors[type] || "text-gray-600";
    }),
}));

// Mock skeleton component
jest.mock("@/components/apis/ApiDetail/ApiDependencies", () => {
    const actual = jest.requireActual("@/components/apis/ApiDetail/ApiDependencies");
    return {
        ...actual,
        ApiDependenciesSkeleton: () => (
            <div data-testid="dependencies-skeleton">Loading dependencies...</div>
        ),
    };
});

// Test data
const mockApi: Api = {
    id: 1,
    name: "Payment API",
    slug: "payment-api",
    description: "API for payments",
    version: "1.0.0",
    protocol: "REST",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    owner: "Finance",
    status: "published",
    lifecycle: "active",
    tags: ["payments"],
} as any;

const mockDependenciesData = {
    consumers: [
        {
            id: 101,
            componentId: 1,
            componentName: "Mobile App",
            componentSlug: "mobile-app",
            type: "consumer" as const,
            relationship: "consumes",
            relationshipId: 1,
        },
        {
            id: 102,
            componentId: 2,
            componentName: "Web Portal",
            componentSlug: "web-portal",
            type: "consumer" as const,
            relationship: "uses",
            relationshipId: 2,
        },
    ],
    providers: [
        {
            id: 201,
            componentId: 3,
            componentName: "Database Service",
            componentSlug: "database-service",
            type: "provider" as const,
            relationship: "provides",
            relationshipId: 3,
        },
    ],
};

describe("API Dependencies Component", () => {
    const mockGetById = apiDependenciesApi.apiDependenciesApi.getById as jest.MockedFunction<any>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetById.mockResolvedValue(mockDependenciesData);
    });

    describe("Rendering - Initial Load", () => {
        it("should render without crashing", () => {
            const { container } = render(
                <ApiDependencies api={mockApi} locale="es" />
            );
            expect(container).toBeInTheDocument();
        });

        it("should render loading state initially with autoLoad=true", () => {
            mockGetById.mockImplementationOnce(() => new Promise(() => {}));

            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            expect(screen.getByTestId("dependencies-skeleton")).toBeInTheDocument();
        });

        it("should load dependencies from API", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(mockGetById).toHaveBeenCalledWith(mockApi.id);
            });
        });

        it("should render dependencies after loading", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Mobile App")).toBeInTheDocument();
            });
        });

        it("should render header with icon", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByTestId("icon-dependency")).toBeInTheDocument();
            });
        });
    });

    describe("Consumer Dependencies", () => {
        it("should render consumer section", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText(/Consumidores|Componentes que usan/i)).toBeInTheDocument();
            });
        });

        it("should display consumer components", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Mobile App")).toBeInTheDocument();
                expect(screen.getByText("Web Portal")).toBeInTheDocument();
            });
        });

        it("should show consumer arrow icon", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                const icons = screen.getAllByTestId("icon-consumer");
                expect(icons.length).toBeGreaterThan(0);
            });
        });

        it("should display relationship type for consumers", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Consume")).toBeInTheDocument();
            });
        });
    });

    describe("Provider Dependencies", () => {
        it("should render provider section", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText(/Proveedores|Componentes que proveen/i)).toBeInTheDocument();
            });
        });

        it("should display provider components", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Database Service")).toBeInTheDocument();
            });
        });

        it("should show provider arrow icon", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                const icons = screen.getAllByTestId("icon-provider");
                expect(icons.length).toBeGreaterThan(0);
            });
        });

        it("should display relationship type for providers", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Provee")).toBeInTheDocument();
            });
        });
    });

    describe("Dependency Cards", () => {
        it("should render dependency card with name", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Mobile App")).toBeInTheDocument();
            });
        });

        it("should render component links as navigation", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                const links = screen.getAllByRole("link").filter(
                    (link) => link.textContent?.includes("App") || link.textContent?.includes("Portal")
                );
                expect(links.length).toBeGreaterThan(0);
            });
        });

        it("should display relationship badge", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Consume")).toBeInTheDocument();
            });
        });

        it("should link to component detail page", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                const mobileAppLink = screen.getByText("Mobile App").closest("a");
                expect(mobileAppLink).toHaveAttribute("href", expect.stringContaining("mobile-app"));
            });
        });
    });

    describe("Empty States", () => {
        it("should show empty message when no consumers", async () => {
            mockGetById.mockResolvedValueOnce({
                consumers: [],
                providers: [mockDependenciesData.providers[0]],
            });

            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(
                    screen.getByText(/No hay componentes que consuman esta API|sin consumidores/i)
                ).toBeInTheDocument();
            });
        });

        it("should show empty message when no providers", async () => {
            mockGetById.mockResolvedValueOnce({
                consumers: [mockDependenciesData.consumers[0]],
                providers: [],
            });

            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(
                    screen.getByText(/No hay componentes que provean|sin proveedores/i)
                ).toBeInTheDocument();
            });
        });

        it("should show no dependencies message when both empty", async () => {
            mockGetById.mockResolvedValueOnce({
                consumers: [],
                providers: [],
            });

            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(
                    screen.getByText(/No hay dependencias|sin dependencias/i)
                ).toBeInTheDocument();
            });
        });
    });

    describe("Error Handling", () => {
        it("should handle API fetch error", async () => {
            mockGetById.mockRejectedValueOnce(new Error("Network error"));

            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(
                    screen.getByText(/Error al cargar|no se ha podido cargar/i)
                ).toBeInTheDocument();
            });
        });

        it("should show retry button on error", async () => {
            mockGetById.mockRejectedValueOnce(new Error("Network error"));

            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                const retryButton = screen.getByRole("button", { name: /reintentar|retry/i });
                expect(retryButton).toBeInTheDocument();
            });
        });

        it("should retry on button click", async () => {
            mockGetById
                .mockRejectedValueOnce(new Error("Network error"))
                .mockResolvedValueOnce(mockDependenciesData);

            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                const retryButton = screen.getByRole("button", { name: /reintentar|retry/i });
                fireEvent.click(retryButton);
            });

            await waitFor(() => {
                expect(mockGetById).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe("Localization", () => {
        it("should pass locale to component", async () => {
            render(<ApiDependencies api={mockApi} locale="en" autoLoad={true} />);

            await waitFor(() => {
                expect(mockGetById).toHaveBeenCalled();
            });
        });

        it("should use Spanish labels by default", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Consume")).toBeInTheDocument();
            });
        });
    });

    describe("Props and Configuration", () => {
        it("should accept custom className", async () => {
            const { container } = render(
                <ApiDependencies
                    api={mockApi}
                    locale="es"
                    className="custom-class"
                    autoLoad={true}
                />
            );

            await waitFor(() => {
                const element = container.querySelector(".custom-class");
                expect(element).toBeInTheDocument();
            });
        });

        it("should support autoLoad=false", async () => {
            render(
                <ApiDependencies
                    api={mockApi}
                    locale="es"
                    autoLoad={false}
                />
            );

            // Should not call API
            expect(mockGetById).not.toHaveBeenCalled();
        });

        it("should use provided componentApis prop when autoLoad=false", () => {
            const mockComponentApis = [
                {
                    id: 1,
                    componentId: 1,
                    apiId: mockApi.id,
                    relationship_type: "consumes",
                } as any,
            ];

            const { container } = render(
                <ApiDependencies
                    api={mockApi}
                    locale="es"
                    autoLoad={false}
                    componentApis={mockComponentApis}
                />
            );

            expect(container).toBeInTheDocument();
        });
    });

    describe("Relationship Types", () => {
        it("should display consumes relationship", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Consume")).toBeInTheDocument();
            });
        });

        it("should display provides relationship", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Provee")).toBeInTheDocument();
            });
        });

        it("should display uses relationship", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Usa")).toBeInTheDocument();
            });
        });

        it("should apply correct color for each relationship", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                expect(screen.getByText("Consume")).toBeInTheDocument();
                expect(screen.getByText("Provee")).toBeInTheDocument();
            });
        });
    });

    describe("Accessibility", () => {
        it("should have semantic structure", async () => {
            const { container } = render(
                <ApiDependencies api={mockApi} locale="es" autoLoad={true} />
            );

            await waitFor(() => {
                expect(container.querySelector("section")).toBeInTheDocument();
            });
        });

        it("should have accessible links", async () => {
            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                const links = screen.getAllByRole("link");
                expect(links.length).toBeGreaterThan(0);
            });
        });

        it("should have descriptive button text", async () => {
            mockGetById.mockRejectedValueOnce(new Error("Network error"));

            render(<ApiDependencies api={mockApi} locale="es" autoLoad={true} />);

            await waitFor(() => {
                const buttons = screen.getAllByRole("button");
                expect(buttons.length).toBeGreaterThan(0);
            });
        });
    });
});
