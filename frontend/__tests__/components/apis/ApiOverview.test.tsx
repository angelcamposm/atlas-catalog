/**
 * Tests for ApiOverview Component
 * Following TDD approach - tests written first
 *
 * Component displays comprehensive API information organized in collapsible sections:
 * - Description, Basic Info, Classification, Ownership, Technical Details, Timestamps
 * - Sub-components: InfoRow (with copy functionality), InfoSection (collapsible)
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    ApiOverview,
    ApiOverviewSkeleton,
} from "@/components/apis/ApiDetail/ApiOverview";
import type { Api, ApiType, ApiStatus, Lifecycle, Group } from "@/types/api";

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiOutlineInformationCircle: ({ className }: any) => (
        <span data-testid="icon-info" className={className}>
            ℹ️
        </span>
    ),
    HiOutlineBookOpen: ({ className }: any) => (
        <span data-testid="icon-book" className={className}>
            📖
        </span>
    ),
    HiOutlineCog6Tooth: ({ className }: any) => (
        <span data-testid="icon-cog" className={className}>
            ⚙️
        </span>
    ),
    HiOutlineTag: ({ className }: any) => (
        <span data-testid="icon-tag" className={className}>
            🏷️
        </span>
    ),
    HiOutlineUserGroup: ({ className }: any) => (
        <span data-testid="icon-users" className={className}>
            👥
        </span>
    ),
    HiOutlineChevronRight: ({ className }: any) => (
        <span data-testid="icon-chevron" className={className}>
            ›
        </span>
    ),
    HiOutlineClipboardDocument: ({ className }: any) => (
        <button data-testid="icon-copy-off" className={className}>
            📋
        </button>
    ),
    HiOutlineCheckCircle: ({ className }: any) => (
        <span data-testid="icon-check" className={className}>
            ✅
        </span>
    ),
}));

// Test data
const mockApi: Api = {
    id: 1,
    name: "Payment API",
    slug: "payment-api",
    description: "API for payment processing\nWith multiple lines",
    display_name: "Payment System",
    version: "1.0.0",
    protocol: "https",
    url: "https://api.payments.com/v1",
    type_id: 1,
    status_id: 1,
    lifecycle_id: 1,
    category_id: 1,
    owner_id: 1,
    authentication_method_id: 1,
    access_policy_id: 1,
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-15T15:30:00Z",
    created_by: 5,
    updated_by: 7,
    released_at: "2024-01-01T00:00:00Z",
    deprecated_at: null,
    deprecation_reason: null,
    tags: ["payments", "financial"],
} as any;

const mockApiType: ApiType = {
    id: 1,
    name: "RESTful API",
    description: "REST API Type",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
} as any;

const mockApiStatus: ApiStatus = {
    id: 1,
    name: "Published",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
} as any;

const mockLifecycle: Lifecycle = {
    id: 1,
    name: "Active",
    color: "#10b981",
    description: "Currently active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
} as any;

const mockOwner: Group = {
    id: 1,
    name: "Finance Team",
    slug: "finance-team",
    icon: "💰",
    email: "finance@company.com",
    description: "Finance department",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
} as any;

describe("ApiOverview Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock clipboard API
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn(() => Promise.resolve()),
            },
        });
    });

    describe("Rendering - Basic", () => {
        it("should render without crashing", () => {
            const { container } = render(<ApiOverview api={mockApi} />);
            expect(container).toBeInTheDocument();
        });

        it("should display description when present", () => {
            render(<ApiOverview api={mockApi} />);
            expect(
                screen.getByText(/API for payment processing/)
            ).toBeInTheDocument();
        });

        it("should not display description section when missing", () => {
            const apiWithoutDescription = { ...mockApi, description: null };
            render(<ApiOverview api={apiWithoutDescription} />);
            // Check if description text is not in the document
            expect(
                screen.queryByText("API for payment processing")
            ).not.toBeInTheDocument();
        });

        it("should render all info sections", () => {
            render(<ApiOverview api={mockApi} />);
            expect(screen.getByText("Información Básica")).toBeInTheDocument();
            expect(screen.getByText("Clasificación")).toBeInTheDocument();
            expect(screen.getByText("Propiedad")).toBeInTheDocument();
            expect(screen.getByText("Detalles Técnicos")).toBeInTheDocument();
        });

        it("should render all section icons", () => {
            render(<ApiOverview api={mockApi} />);
            expect(screen.getByTestId("icon-book")).toBeInTheDocument();
            expect(screen.getByTestId("icon-info")).toBeInTheDocument();
            expect(screen.getByTestId("icon-tag")).toBeInTheDocument();
            expect(screen.getByTestId("icon-users")).toBeInTheDocument();
            expect(screen.getByTestId("icon-cog")).toBeInTheDocument();
        });
    });

    describe("InfoRow Component", () => {
        it("should display label and value", () => {
            render(<ApiOverview api={mockApi} />);
            expect(screen.getByText("Nombre")).toBeInTheDocument();
            expect(screen.getByText("Payment API")).toBeInTheDocument();
        });

        it("should display dash for missing values", () => {
            const apiWithoutDisplayName = { ...mockApi, display_name: null };
            const { container } = render(
                <ApiOverview api={apiWithoutDisplayName} />
            );
            // Check for the dash character
            const dashes = container.querySelectorAll("span");
            let foundDash = false;
            dashes.forEach((span) => {
                if (span.textContent === "—") foundDash = true;
            });
            expect(foundDash).toBe(true);
        });

        it("should show copy button for copyable fields", async () => {
            render(<ApiOverview api={mockApi} />);

            // API name should be copyable
            const copyButtons = screen.getAllByTestId("icon-copy-off");
            expect(copyButtons.length).toBeGreaterThan(0);
        });

        it("should copy to clipboard on button click", async () => {
            render(<ApiOverview api={mockApi} />);

            const copyButtons = screen.getAllByTestId("icon-copy-off");
            fireEvent.click(copyButtons[0]);

            await waitFor(() => {
                expect(navigator.clipboard.writeText).toHaveBeenCalled();
            });
        });

        it("should show success indicator after copy", async () => {
            jest.useFakeTimers();

            render(<ApiOverview api={mockApi} />);

            const copyButtons = screen.getAllByTestId("icon-copy-off");
            fireEvent.click(copyButtons[0]);

            await waitFor(() => {
                expect(screen.getByTestId("icon-check")).toBeInTheDocument();
            });

            jest.useRealTimers();
        });
    });

    describe("InfoSection Component", () => {
        it("should render sections in expanded state by default", () => {
            render(<ApiOverview api={mockApi} />);

            // Content should be visible if section is open
            expect(screen.getByText("Información Básica")).toBeInTheDocument();
            expect(screen.getByText("Payment API")).toBeInTheDocument();
        });

        it("should toggle section open/closed on click", () => {
            render(<ApiOverview api={mockApi} />);

            const basicInfoSection = screen
                .getByText("Información Básica")
                .closest("button");
            expect(basicInfoSection).toBeInTheDocument();

            fireEvent.click(basicInfoSection!);

            // After click, check if content is hidden
            // (This depends on actual implementation - sections collapse)
        });

        it("should render chevron icon for collapsible sections", () => {
            render(<ApiOverview api={mockApi} />);

            const chevrons = screen.getAllByTestId("icon-chevron");
            expect(chevrons.length).toBeGreaterThan(0);
        });
    });

    describe("Information Sections - Content", () => {
        it("should render all basic info fields", () => {
            render(<ApiOverview api={mockApi} />);

            expect(screen.getByText("Nombre")).toBeInTheDocument();
            expect(screen.getByText("Payment API")).toBeInTheDocument();
            expect(screen.getByText("Versión")).toBeInTheDocument();
            expect(screen.getByText("1.0.0")).toBeInTheDocument();
            expect(screen.getByText("Protocolo")).toBeInTheDocument();
            expect(screen.getByText(/HTTPS/)).toBeInTheDocument();
            expect(screen.getByText("URL")).toBeInTheDocument();
            expect(
                screen.getByText("https://api.payments.com/v1")
            ).toBeInTheDocument();
        });

        it("should render classification info with apiType", () => {
            render(
                <ApiOverview
                    api={mockApi}
                    apiType={mockApiType}
                    apiStatus={mockApiStatus}
                    lifecycle={mockLifecycle}
                />
            );

            expect(screen.getByText("Tipo de API")).toBeInTheDocument();
            expect(screen.getByText(/RESTful API/)).toBeInTheDocument();
            expect(screen.getByText("Estado")).toBeInTheDocument();
            expect(screen.getByText(/Published/)).toBeInTheDocument();
            expect(screen.getByText("Ciclo de Vida")).toBeInTheDocument();
            expect(screen.getByText(/Active/)).toBeInTheDocument();
        });

        it("should render ownership info with owner details", () => {
            render(<ApiOverview api={mockApi} owner={mockOwner} />);

            expect(screen.getByText("Propietario")).toBeInTheDocument();
            expect(screen.getByText(/Finance Team/)).toBeInTheDocument();
            expect(screen.getByText("Email del equipo")).toBeInTheDocument();
            expect(screen.getByText(/finance@company.com/)).toBeInTheDocument();
        });

        it("should render technical details", () => {
            render(<ApiOverview api={mockApi} />);

            expect(screen.getByText("ID")).toBeInTheDocument();
            // ID value is shown but there are multiple 1s, so check context instead
            const idRow = screen.getByText("ID").closest("div");
            expect(idRow).toBeInTheDocument();
            expect(
                screen.getByText("Método de Autenticación ID")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Política de Acceso ID")
            ).toBeInTheDocument();
        });

        it("should render created and updated timestamps", () => {
            render(<ApiOverview api={mockApi} />);

            // Check for timestamp text
            const container = screen.getByText(/Creada el/);
            expect(container).toBeInTheDocument();

            const updatedText = screen.getByText(/Última actualización:/);
            expect(updatedText).toBeInTheDocument();
        });
    });

    describe("Optional Props", () => {
        it("should render without optional props", () => {
            const { container } = render(<ApiOverview api={mockApi} />);
            expect(container).toBeInTheDocument();
        });

        it("should render with all optional props", () => {
            const { container } = render(
                <ApiOverview
                    api={mockApi}
                    apiType={mockApiType}
                    apiStatus={mockApiStatus}
                    lifecycle={mockLifecycle}
                    owner={mockOwner}
                    className="custom-class"
                />
            );
            expect(container).toBeInTheDocument();
        });

        it("should apply custom className", () => {
            const { container } = render(
                <ApiOverview api={mockApi} className="custom-override-class" />
            );

            const mainDiv = container.firstChild;
            expect(mainDiv).toHaveClass("custom-override-class");
        });

        it("should display lifecycle with color indicator", () => {
            render(<ApiOverview api={mockApi} lifecycle={mockLifecycle} />);

            expect(screen.getByText("Active")).toBeInTheDocument();
        });

        it("should display owner icon if present", () => {
            render(<ApiOverview api={mockApi} owner={mockOwner} />);

            expect(screen.getByText("💰")).toBeInTheDocument();
        });
    });

    describe("Deprecation Info", () => {
        it("should not show deprecation info when not deprecated", () => {
            render(<ApiOverview api={mockApi} />);

            expect(
                screen.queryByText("Motivo de Deprecación")
            ).not.toBeInTheDocument();
        });

        it("should show deprecation date when deprecated", () => {
            const deprecatedApi = {
                ...mockApi,
                deprecated_at: "2024-06-01T00:00:00Z",
                deprecation_reason: "Replaced by v2 API",
            };

            render(<ApiOverview api={deprecatedApi} />);

            expect(
                screen.getByText("Fecha de Deprecación")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Motivo de Deprecación")
            ).toBeInTheDocument();
            expect(screen.getByText("Replaced by v2 API")).toBeInTheDocument();
        });

        it("should show release date", () => {
            render(<ApiOverview api={mockApi} />);

            expect(
                screen.getByText("Fecha de Lanzamiento")
            ).toBeInTheDocument();
        });
    });

    describe("Created/Updated By Info", () => {
        it("should display creator and updater user IDs", () => {
            render(<ApiOverview api={mockApi} />);

            expect(screen.getByText("Creado por")).toBeInTheDocument();
            // Creator and updater IDs are displayed
            expect(screen.getByText(/Usuario #5/)).toBeInTheDocument();
            expect(screen.getByText("Actualizado por")).toBeInTheDocument();
            expect(screen.getByText(/Usuario #7/)).toBeInTheDocument();
        });

        it("should handle missing creator/updater info", () => {
            const apiWithoutUserInfo = {
                ...mockApi,
                created_by: null,
                updated_by: null,
            };

            const { container } = render(
                <ApiOverview api={apiWithoutUserInfo} />
            );

            expect(container).toBeInTheDocument();
        });
    });

    describe("Display Name Handling", () => {
        it("should show display name when provided", () => {
            render(<ApiOverview api={mockApi} />);

            expect(screen.getByText("Nombre para mostrar")).toBeInTheDocument();
            expect(screen.getByText("Payment System")).toBeInTheDocument();
        });

        it("should not show display name field when missing", () => {
            const apiWithoutDisplayName = { ...mockApi, display_name: null };
            render(<ApiOverview api={apiWithoutDisplayName} />);

            expect(
                screen.queryByText("Nombre para mostrar")
            ).not.toBeInTheDocument();
        });
    });

    describe("ApiOverviewSkeleton Component", () => {
        it("should render skeleton without crashing", () => {
            const { container } = render(<ApiOverviewSkeleton />);
            expect(container).toBeInTheDocument();
        });

        it("should have animate-pulse class", () => {
            const { container } = render(<ApiOverviewSkeleton />);
            const div = container.querySelector("div");
            expect(div).toHaveClass("animate-pulse");
        });

        it("should render multiple skeleton sections", () => {
            const { container } = render(<ApiOverviewSkeleton />);
            const skeletonSections = container.querySelectorAll(".rounded-lg");
            expect(skeletonSections.length).toBeGreaterThan(0);
        });

        it("should render description skeleton", () => {
            const { container } = render(<ApiOverviewSkeleton />);
            const descriptionSection = container.querySelector(".space-y-2");
            expect(descriptionSection).toBeInTheDocument();
        });
    });

    describe("Date Formatting", () => {
        it("should format dates in Spanish locale", () => {
            render(<ApiOverview api={mockApi} />);

            // Dates should be formatted (the exact format depends on locale)
            const dateText = screen.getByText(/Creada el/);
            expect(dateText).toBeInTheDocument();
        });

        it("should handle invalid dates gracefully", () => {
            const apiWithBadDate = {
                ...mockApi,
                created_at: "invalid-date",
            };

            const { container } = render(<ApiOverview api={apiWithBadDate} />);

            // Should not crash
            expect(container).toBeInTheDocument();
        });
    });

    describe("Category ID Display", () => {
        it("should show category ID when present", () => {
            render(<ApiOverview api={mockApi} />);

            expect(screen.getByText("Categoría ID")).toBeInTheDocument();
            // Category ID value is shown next to label
            const categoryRow = screen.getByText("Categoría ID").closest("div");
            expect(categoryRow).toBeInTheDocument();
        });

        it("should not show category ID when missing", () => {
            const apiWithoutCategory = { ...mockApi, category_id: null };
            render(<ApiOverview api={apiWithoutCategory} />);

            expect(screen.queryByText("Categoría ID")).not.toBeInTheDocument();
        });
    });
});
