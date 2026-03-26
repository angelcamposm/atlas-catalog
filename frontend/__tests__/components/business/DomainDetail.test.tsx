/**
 * Tests for Business Domain Detail Page
 *
 * Page component with tabbed interface:
 * - Resumen: domain hierarchy and audit info
 * - Componentes: list of associated components
 * - Entidades: list of associated entities
 * - Delete with AlertDialog
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useParams, useRouter } from "next/navigation";
import BusinessDomainDetailPage from "@/app/[locale]/(protected)/business/domains/[id]/page";
import type { BusinessDomain, Component, Entity } from "@/types/api";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
    useParams: jest.fn(),
    useRouter: jest.fn(),
}));

// Mock business domains API
jest.mock("@/lib/api/business-domains", () => ({
    businessDomainsApi: {
        getById: jest.fn(),
        getComponents: jest.fn(),
        getDomainEntities: jest.fn(),
        delete: jest.fn(),
    },
}));

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiOutlineBuildingOffice: () => <span data-testid="icon-building">🏢</span>,
    HiOutlinePencil: () => <span>✏️</span>,
    HiOutlineTrash: () => <span>🗑️</span>,
    HiOutlineTag: () => <span>🏷️</span>,
    HiOutlineCalendar: () => <span>📅</span>,
    HiOutlineUser: () => <span>👤</span>,
    HiOutlineLink: () => <span>🔗</span>,
    HiOutlineCube: () => <span>📦</span>,
    HiOutlineSquares2X2: () => <span>⊞</span>,
}));

// Mock LoadingSpinner
jest.mock("@/components/ui/LoadingSpinner", () => ({
    LoadingSpinner: ({ size }: { size?: string }) => (
        <div data-testid="loading-spinner" data-size={size}>
            Loading...
        </div>
    ),
}));

// Mock PageHeader
jest.mock("@/components/layout/PageHeader", () => ({
    PageHeader: ({
        title,
        subtitle,
        actions,
    }: {
        title: string;
        subtitle?: string;
        actions?: React.ReactNode;
    }) => (
        <div data-testid="page-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
            {actions}
        </div>
    ),
}));

// Mock alert dialog
jest.mock("@/components/ui/alert-dialog", () => ({
    AlertDialog: ({ children, open }: any) =>
        open ? <div data-testid="alert-dialog">{children}</div> : null,
    AlertDialogTrigger: ({ children }: any) => <>{children}</>,
    AlertDialogContent: ({ children }: any) => (
        <div data-testid="alert-dialog-content">{children}</div>
    ),
    AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
    AlertDialogTitle: ({ children }: any) => <h2>{children}</h2>,
    AlertDialogDescription: ({ children }: any) => <p>{children}</p>,
    AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
    AlertDialogCancel: ({ children, ...props }: any) => (
        <button data-testid="dialog-cancel" {...props}>
            {children}
        </button>
    ),
    AlertDialogAction: ({ children, onClick, disabled }: any) => (
        <button
            data-testid="dialog-confirm"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    ),
}));

// ─── Test data ────────────────────────────────────────────────────────────────

const mockDomain: BusinessDomain = {
    id: 1,
    name: "Payments",
    display_name: "Payments Domain",
    description: "Handles all payment processing",
    parent_id: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-06-01T00:00:00Z",
    created_by: 1,
    updated_by: null,
};

const mockComponents: Component[] = [
    {
        id: 10,
        name: "PaymentService",
        display_name: "Payment Service",
        slug: "payment-service",
        description: "Processes payments",
        has_zero_downtime_deployment: true,
        is_stateless: false,
        criticality_id: null,
        discovery_source: null,
        domain_id: 1,
        lifecycle_id: null,
        operational_status_id: null,
        owner_id: null,
        platform_id: null,
        status_id: null,
        tags: null,
        tier_id: null,
        type_id: null,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
    },
];

const mockEntities: Entity[] = [
    {
        id: 5,
        name: "Transaction",
        description: "A financial transaction",
        is_enabled: true,
        domain_id: 1,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
    },
    {
        id: 6,
        name: "Invoice",
        description: null,
        is_enabled: false,
        domain_id: 1,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockPush = jest.fn();

function setupMocks() {
    (useParams as jest.Mock).mockReturnValue({ id: "1", locale: "es" });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
}

function importBusinessDomainsApi() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("@/lib/api/business-domains").businessDomainsApi;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("BusinessDomainDetailPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setupMocks();
    });

    describe("Loading state", () => {
        it("should show loading spinner while fetching domain", () => {
            const api = importBusinessDomainsApi();
            api.getById.mockReturnValue(new Promise(() => {})); // never resolves
            api.getComponents.mockResolvedValue({ data: [] });
            api.getDomainEntities.mockResolvedValue({ data: [] });

            render(<BusinessDomainDetailPage />);

            expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        });
    });

    describe("Error state", () => {
        it("should show error message when domain fails to load", async () => {
            const api = importBusinessDomainsApi();
            api.getById.mockRejectedValue(new Error("Not found"));
            api.getComponents.mockResolvedValue({ data: [] });
            api.getDomainEntities.mockResolvedValue({ data: [] });

            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(
                    screen.getByText(/error al cargar el dominio/i),
                ).toBeInTheDocument();
            });
        });

        it("should show 'Volver' button on error", async () => {
            const api = importBusinessDomainsApi();
            api.getById.mockRejectedValue(new Error("Not found"));
            api.getComponents.mockResolvedValue({ data: [] });
            api.getDomainEntities.mockResolvedValue({ data: [] });

            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(
                    screen.getByText(/volver a dominios/i),
                ).toBeInTheDocument();
            });
        });
    });

    describe("Success state - domain info", () => {
        beforeEach(() => {
            const api = importBusinessDomainsApi();
            api.getById.mockResolvedValue({ data: mockDomain });
            api.getComponents.mockResolvedValue({ data: mockComponents });
            api.getDomainEntities.mockResolvedValue({ data: mockEntities });
        });

        it("should render domain name in page header", async () => {
            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("page-header")).toBeInTheDocument();
            });

            // Domain name appears in both PageHeader and the summary card
            expect(screen.getAllByText("Payments").length).toBeGreaterThan(0);
        });

        it("should show component and entity counts", async () => {
            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText(/1 componentes/i)).toBeInTheDocument();
                expect(screen.getByText(/2 entidades/i)).toBeInTheDocument();
            });
        });

        it("should render all three tabs", async () => {
            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Resumen")).toBeInTheDocument();
                expect(screen.getByText("Componentes")).toBeInTheDocument();
                expect(screen.getByText("Entidades")).toBeInTheDocument();
            });
        });

        it("should show Resumen tab by default", async () => {
            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Jerarquía")).toBeInTheDocument();
                expect(screen.getByText("Auditoría")).toBeInTheDocument();
            });
        });

        it("should show 'Dominio raíz' when parent_id is null", async () => {
            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Dominio raíz")).toBeInTheDocument();
            });
        });

        it("should show parent domain link when parent_id is set", async () => {
            const api = importBusinessDomainsApi();
            api.getById.mockResolvedValue({
                data: { ...mockDomain, parent_id: 99 },
            });

            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(
                    screen.getByText(/ver dominio padre/i),
                ).toBeInTheDocument();
            });
        });
    });

    describe("Tabs navigation", () => {
        beforeEach(() => {
            const api = importBusinessDomainsApi();
            api.getById.mockResolvedValue({ data: mockDomain });
            api.getComponents.mockResolvedValue({ data: mockComponents });
            api.getDomainEntities.mockResolvedValue({ data: mockEntities });
        });

        it("should show components when Componentes tab is clicked", async () => {
            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Componentes")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Componentes"));

            await waitFor(() => {
                expect(screen.getByText("Payment Service")).toBeInTheDocument();
            });
        });

        it("should show entities when Entidades tab is clicked", async () => {
            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Entidades")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Entidades"));

            await waitFor(() => {
                expect(screen.getByText("Transaction")).toBeInTheDocument();
                expect(screen.getByText("Invoice")).toBeInTheDocument();
            });
        });

        it("should show correct entity status badges", async () => {
            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Entidades")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Entidades"));

            await waitFor(() => {
                expect(screen.getByText("Activo")).toBeInTheDocument();
                expect(screen.getByText("Inactivo")).toBeInTheDocument();
            });
        });

        it("should show empty message when no components", async () => {
            const api = importBusinessDomainsApi();
            api.getComponents.mockResolvedValue({ data: [] });

            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Componentes")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Componentes"));

            await waitFor(() => {
                expect(
                    screen.getByText(
                        /no hay componentes asociados a este dominio/i,
                    ),
                ).toBeInTheDocument();
            });
        });

        it("should show empty message when no entities", async () => {
            const api = importBusinessDomainsApi();
            api.getDomainEntities.mockResolvedValue({ data: [] });

            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Entidades")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Entidades"));

            await waitFor(() => {
                expect(
                    screen.getByText(
                        /no hay entidades asociadas a este dominio/i,
                    ),
                ).toBeInTheDocument();
            });
        });
    });

    describe("Delete functionality", () => {
        beforeEach(() => {
            const api = importBusinessDomainsApi();
            api.getById.mockResolvedValue({ data: mockDomain });
            api.getComponents.mockResolvedValue({ data: mockComponents });
            api.getDomainEntities.mockResolvedValue({ data: mockEntities });
        });

        it("should open delete dialog when Eliminar is clicked", async () => {
            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText(/eliminar/i)).toBeInTheDocument();
            });

            // Get the Eliminar button in the header actions (not in dialog)
            const deleteButtons = screen.getAllByText(/eliminar/i);
            fireEvent.click(deleteButtons[0]);

            await waitFor(() => {
                expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
            });
        });

        it("should call delete API and redirect on confirm", async () => {
            const api = importBusinessDomainsApi();
            api.delete.mockResolvedValue({});

            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(screen.getByText(/eliminar/i)).toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByText(/eliminar/i);
            fireEvent.click(deleteButtons[0]);

            await waitFor(() => {
                expect(
                    screen.getByTestId("dialog-confirm"),
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId("dialog-confirm"));

            await waitFor(() => {
                expect(api.delete).toHaveBeenCalledWith(mockDomain.id);
                expect(mockPush).toHaveBeenCalledWith(
                    expect.stringContaining("/business/domains"),
                );
            });
        });
    });

    describe("API calls", () => {
        it("should call getById with domain id from params", async () => {
            const api = importBusinessDomainsApi();
            api.getById.mockResolvedValue({ data: mockDomain });
            api.getComponents.mockResolvedValue({ data: [] });
            api.getDomainEntities.mockResolvedValue({ data: [] });

            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(api.getById).toHaveBeenCalledWith(1);
            });
        });

        it("should call getComponents and getDomainEntities with domain id", async () => {
            const api = importBusinessDomainsApi();
            api.getById.mockResolvedValue({ data: mockDomain });
            api.getComponents.mockResolvedValue({ data: [] });
            api.getDomainEntities.mockResolvedValue({ data: [] });

            render(<BusinessDomainDetailPage />);

            await waitFor(() => {
                expect(api.getComponents).toHaveBeenCalledWith(1);
                expect(api.getDomainEntities).toHaveBeenCalledWith(1);
            });
        });
    });
});
