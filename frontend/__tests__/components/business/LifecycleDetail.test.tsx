import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocks
jest.mock("next/navigation", () => ({
    useParams: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock("@/lib/api/lifecycles", () => ({
    lifecyclesApi: {
        getById: jest.fn(),
        getComponents: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock("react-icons/hi2", () => ({
    HiOutlineCircleStack: () => <span data-testid="icon-lifecycle">○</span>,
    HiOutlinePencil: () => <span data-testid="icon-edit">✏</span>,
    HiOutlineTrash: () => <span data-testid="icon-trash">🗑</span>,
    HiOutlineTag: () => <span data-testid="icon-tag">🏷</span>,
    HiOutlineCalendar: () => <span data-testid="icon-calendar">📅</span>,
    HiOutlineUser: () => <span data-testid="icon-user">👤</span>,
    HiOutlineCube: () => <span data-testid="icon-cube">⬛</span>,
    HiOutlineCheckCircle: () => <span data-testid="icon-check">✓</span>,
}));

jest.mock("@/components/ui/LoadingSpinner", () => ({
    LoadingSpinner: ({ size }: { size?: string }) => (
        <div data-testid="loading-spinner" data-size={size}>
            Loading...
        </div>
    ),
}));

jest.mock("@/components/layout/PageHeader", () => ({
    PageHeader: ({
        title,
        subtitle,
        actions,
    }: {
        title: string;
        subtitle?: string;
        icon?: unknown;
        actions?: React.ReactNode;
    }) => (
        <div data-testid="page-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
            {actions && <div data-testid="header-actions">{actions}</div>}
        </div>
    ),
}));

jest.mock("@/components/ui/alert-dialog", () => ({
    AlertDialog: ({
        open,
        children,
    }: {
        open: boolean;
        onOpenChange: (v: boolean) => void;
        children: React.ReactNode;
    }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="alert-dialog-content">{children}</div>
    ),
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
        <h2 data-testid="alert-dialog-title">{children}</h2>
    ),
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
        <p data-testid="alert-dialog-description">{children}</p>
    ),
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
        <button data-testid="alert-dialog-cancel">{children}</button>
    ),
    AlertDialogAction: ({
        children,
        onClick,
        disabled,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
        disabled?: boolean;
        className?: string;
    }) => (
        <button
            data-testid="alert-dialog-action"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    ),
}));

jest.mock("next/link", () => {
    const MockLink = ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>;
    MockLink.displayName = "MockLink";
    return MockLink;
});

import { useParams, useRouter } from "next/navigation";
import { lifecyclesApi } from "@/lib/api/lifecycles";
import LifecycleDetailPage from "@/app/[locale]/(protected)/lifecycles/[id]/page";

const mockPush = jest.fn();

const mockLifecycle = {
    id: 1,
    name: "Active Development",
    color: "blue",
    description: "Componentes en desarrollo activo",
    approval_required: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-03-20T15:00:00Z",
    created_by: "admin",
    updated_by: "dev",
};

const mockComponents = [
    {
        id: 1,
        name: "payment-service",
        slug: "payment-service",
        display_name: "Payment Service",
        description: "Servicio de pagos",
    },
    {
        id: 2,
        name: "auth-service",
        slug: "auth-service",
        display_name: null,
        description: null,
    },
];

beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "1", locale: "es" });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
});

describe("LifecycleDetailPage", () => {
    describe("Loading state", () => {
        it("should show loading spinner while fetching data", () => {
            (lifecyclesApi.getById as jest.Mock).mockImplementation(
                () => new Promise(() => {}),
            );
            (lifecyclesApi.getComponents as jest.Mock).mockImplementation(
                () => new Promise(() => {}),
            );

            render(<LifecycleDetailPage />);

            expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        });
    });

    describe("Error state", () => {
        it("should show error message when API call fails", async () => {
            (lifecyclesApi.getById as jest.Mock).mockRejectedValue(
                new Error("API error"),
            );
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: [],
            });

            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(
                    screen.getByText("Error al cargar el ciclo de vida"),
                ).toBeInTheDocument();
            });
        });

        it("should show back button on error", async () => {
            (lifecyclesApi.getById as jest.Mock).mockRejectedValue(
                new Error("API error"),
            );
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: [],
            });

            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(
                    screen.getByText("Volver a Ciclos de Vida"),
                ).toBeInTheDocument();
            });
        });
    });

    describe("Lifecycle info display", () => {
        beforeEach(() => {
            (lifecyclesApi.getById as jest.Mock).mockResolvedValue({
                data: mockLifecycle,
            });
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: mockComponents,
            });
        });

        it("should render lifecycle name in page header", async () => {
            render(<LifecycleDetailPage />);

            await waitFor(() => {
                const headers = screen.getAllByText("Active Development");
                expect(headers.length).toBeGreaterThan(0);
            });
        });

        it("should show approval_required badge", async () => {
            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(
                    screen.getByText("Requiere aprobación"),
                ).toBeInTheDocument();
            });
        });

        it("should show component count", async () => {
            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("2 componentes")).toBeInTheDocument();
            });
        });

        it("should show edit and delete buttons", async () => {
            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Editar")).toBeInTheDocument();
                expect(screen.getByText("Eliminar")).toBeInTheDocument();
            });
        });
    });

    describe("Tab navigation", () => {
        beforeEach(() => {
            (lifecyclesApi.getById as jest.Mock).mockResolvedValue({
                data: mockLifecycle,
            });
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: mockComponents,
            });
        });

        it("should show Resumen tab by default", async () => {
            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Resumen")).toBeInTheDocument();
            });

            // Propiedades card should be visible on overview tab
            expect(screen.getByText("Propiedades")).toBeInTheDocument();
        });

        it("should show Componentes tab", async () => {
            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Componentes")).toBeInTheDocument();
            });
        });

        it("should switch to Componentes tab on click", async () => {
            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Componentes")).toBeInTheDocument();
            });

            // Click on Componentes tab (the button, not the card title)
            const tabs = screen.getAllByText("Componentes");
            fireEvent.click(tabs[0]);

            await waitFor(() => {
                expect(screen.getByText("Payment Service")).toBeInTheDocument();
            });
        });

        it("should show properties on Resumen tab", async () => {
            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Color")).toBeInTheDocument();
            });
        });
    });

    describe("Components tab content", () => {
        it("should list components with links", async () => {
            (lifecyclesApi.getById as jest.Mock).mockResolvedValue({
                data: mockLifecycle,
            });
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: mockComponents,
            });

            render(<LifecycleDetailPage />);

            await waitFor(() => {
                fireEvent.click(screen.getAllByText("Componentes")[0]);
            });

            await waitFor(() => {
                expect(screen.getByText("Payment Service")).toBeInTheDocument();
                const link = screen.getByRole("link", {
                    name: "Payment Service",
                });
                expect(link).toHaveAttribute(
                    "href",
                    "/es/catalog/components/payment-service",
                );
            });
        });

        it("should use component name when display_name is null", async () => {
            (lifecyclesApi.getById as jest.Mock).mockResolvedValue({
                data: mockLifecycle,
            });
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: mockComponents,
            });

            render(<LifecycleDetailPage />);

            await waitFor(() => {
                fireEvent.click(screen.getAllByText("Componentes")[0]);
            });

            await waitFor(() => {
                // "auth-service" appears as link text and as slug badge
                expect(
                    screen.getAllByText("auth-service").length,
                ).toBeGreaterThan(0);
            });
        });

        it("should show empty state when no components", async () => {
            (lifecyclesApi.getById as jest.Mock).mockResolvedValue({
                data: mockLifecycle,
            });
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: [],
            });

            render(<LifecycleDetailPage />);

            await waitFor(() => {
                fireEvent.click(screen.getAllByText("Componentes")[0]);
            });

            await waitFor(() => {
                expect(
                    screen.getByText(
                        "No hay componentes en este ciclo de vida.",
                    ),
                ).toBeInTheDocument();
            });
        });
    });

    describe("Delete functionality", () => {
        beforeEach(() => {
            (lifecyclesApi.getById as jest.Mock).mockResolvedValue({
                data: mockLifecycle,
            });
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: [],
            });
        });

        it("should open delete dialog on Eliminar click", async () => {
            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Eliminar")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Eliminar"));

            await waitFor(() => {
                expect(
                    screen.getByTestId("alert-dialog-title"),
                ).toBeInTheDocument();
            });
        });

        it("should call delete API and navigate on confirm", async () => {
            (lifecyclesApi.delete as jest.Mock).mockResolvedValue({});

            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Eliminar")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Eliminar"));

            await waitFor(() => {
                expect(
                    screen.getByTestId("alert-dialog-action"),
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId("alert-dialog-action"));

            await waitFor(() => {
                expect(lifecyclesApi.delete).toHaveBeenCalledWith(1);
                expect(mockPush).toHaveBeenCalledWith("/es/lifecycles");
            });
        });
    });

    describe("API calls", () => {
        it("should call getById with the lifecycle id", async () => {
            (lifecyclesApi.getById as jest.Mock).mockResolvedValue({
                data: mockLifecycle,
            });
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: [],
            });

            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(lifecyclesApi.getById).toHaveBeenCalledWith(1);
            });
        });

        it("should call getComponents with the lifecycle id", async () => {
            (lifecyclesApi.getById as jest.Mock).mockResolvedValue({
                data: mockLifecycle,
            });
            (lifecyclesApi.getComponents as jest.Mock).mockResolvedValue({
                data: [],
            });

            render(<LifecycleDetailPage />);

            await waitFor(() => {
                expect(lifecyclesApi.getComponents).toHaveBeenCalledWith(1);
            });
        });
    });
});
