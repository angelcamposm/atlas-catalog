/**
 * Tests for API Detail Page Component
 * Following TDD approach - tests written first
 *
 * Page component for viewing API details with tabbed interface:
 * - Overview, Documentation, Dependencies, Metadata tabs
 * - Header with actions (edit, delete, duplicate)
 * - Content sections based on selected tab
 * - Error handling and loading states
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import ApiDetailPage from "@/app/[locale]/(protected)/apis/[id]/page";
import type { ApiResponse } from "@/types/api";
import * as apisApi from "@/lib/api/apis";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
    useParams: jest.fn(),
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

// Mock API client
jest.mock("@/lib/api/apis", () => ({
    apisApi: {
        getById: jest.fn(),
        delete: jest.fn(),
    },
}));

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiOutlineViewColumns: ({ className }: any) => (
        <span data-testid="icon-overview" className={className}>
            ⊞
        </span>
    ),
    HiOutlineDocumentText: ({ className }: any) => (
        <span data-testid="icon-docs" className={className}>
            📄
        </span>
    ),
    HiOutlineArrowsRightLeft: ({ className }: any) => (
        <span data-testid="icon-dependencies" className={className}>
            ↔
        </span>
    ),
    HiOutlineTableCells: ({ className }: any) => (
        <span data-testid="icon-metadata" className={className}>
            📋
        </span>
    ),
    HiOutlineExclamationCircle: ({ className }: any) => (
        <span data-testid="icon-error" className={className}>
            ⚠️
        </span>
    ),
}));

// Mock child components
jest.mock("@/components/apis", () => ({
    ApiHeader: ({ api, onEdit, onDelete, onDuplicate }: any) => (
        <div data-testid="api-header">
            <h1>{api.name}</h1>
            <button onClick={onEdit} data-testid="btn-edit">Edit</button>
            <button onClick={onDelete} data-testid="btn-delete">Delete</button>
            <button onClick={onDuplicate} data-testid="btn-duplicate">Duplicate</button>
        </div>
    ),
    ApiHeaderSkeleton: () => <div data-testid="header-skeleton">Header Loading...</div>,
    ApiOverview: ({ api }: any) => <div data-testid="tab-overview">{api.name} Overview</div>,
    ApiOverviewSkeleton: () => <div data-testid="overview-skeleton">Overview Loading...</div>,
    ApiDocs: ({ api }: any) => <div data-testid="tab-docs">{api.name} Docs</div>,
    ApiDocsSkeleton: () => <div data-testid="docs-skeleton">Docs Loading...</div>,
    ApiDependencies: ({ api }: any) => <div data-testid="tab-dependencies">{api.name} Dependencies</div>,
    ApiDependenciesSkeleton: () => <div data-testid="dependencies-skeleton">Dependencies Loading...</div>,
    ApiMetadata: ({ api }: any) => <div data-testid="tab-metadata">{api.name} Metadata</div>,
    ApiMetadataSkeleton: () => <div data-testid="metadata-skeleton">Metadata Loading...</div>,
}));

// Test data
const mockApi: ApiResponse = {
    data: {
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
};

describe("API Detail Page Component", () => {
    const mockRouter = {
        push: jest.fn(),
        replace: jest.fn(),
    };
    const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
    const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
    const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
    const mockGetById = apisApi.apisApi.getById as jest.MockedFunction<typeof apisApi.apisApi.getById>;
    const mockDelete = apisApi.apisApi.delete as jest.MockedFunction<typeof apisApi.apisApi.delete>;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockUseParams.mockReturnValue({
            id: "1",
            locale: "es",
        });
        mockUseSearchParams.mockReturnValue(new URLSearchParams());
        mockUseRouter.mockReturnValue(mockRouter as any);
        mockGetById.mockResolvedValue(mockApi);
    });

    describe("Rendering - Initial Load", () => {
        it("should render loading state initially", async () => {
            mockGetById.mockImplementationOnce(
                () => new Promise(() => {}) // Never resolves
            );

            render(<ApiDetailPage />);

            expect(screen.getByTestId("header-skeleton")).toBeInTheDocument();
        });

        it("should render header after loading", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("api-header")).toBeInTheDocument();
            });
            expect(screen.getByText("Payment API")).toBeInTheDocument();
        });

        it("should render tab navigation", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByText("Información general")).toBeInTheDocument();
                expect(screen.getByText("Documentación")).toBeInTheDocument();
                expect(screen.getByText("Dependencias")).toBeInTheDocument();
                expect(screen.getByText("Metadatos")).toBeInTheDocument();
            });
        });

        it("should render overview tab content initially", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });
        });

        it("should call API with correct ID", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(mockGetById).toHaveBeenCalledWith(1);
            });
        });
    });

    describe("Tab Navigation", () => {
        it("should switch to docs tab on click", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            const docsTab = screen.getByText("Documentación");
            fireEvent.click(docsTab);

            await waitFor(() => {
                expect(screen.getByTestId("tab-docs")).toBeInTheDocument();
            });
        });

        it("should switch to dependencies tab on click", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            const depsTab = screen.getByText("Dependencias");
            fireEvent.click(depsTab);

            await waitFor(() => {
                expect(screen.getByTestId("tab-dependencies")).toBeInTheDocument();
            });
        });

        it("should switch to metadata tab on click", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            const metaTab = screen.getByText("Metadatos");
            fireEvent.click(metaTab);

            await waitFor(() => {
                expect(screen.getByTestId("tab-metadata")).toBeInTheDocument();
            });
        });

        it("should update URL when tab changes", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            const docsTab = screen.getByText("Documentación");
            fireEvent.click(docsTab);

            await waitFor(() => {
                expect(mockRouter.replace).toHaveBeenCalled();
            });
        });

        it("should load initial tab from URL search params", async () => {
            mockUseSearchParams.mockReturnValueOnce(
                new URLSearchParams("tab=docs")
            );

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-docs")).toBeInTheDocument();
            });
        });

        it("should ignore invalid tab from URL", async () => {
            mockUseSearchParams.mockReturnValueOnce(
                new URLSearchParams("tab=invalid")
            );

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });
        });
    });

    describe("Header Actions", () => {
        it("should render edit button in header", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("btn-edit")).toBeInTheDocument();
            });
        });

        it("should call handleEdit on edit button click", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("btn-edit")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId("btn-edit"));

            expect(mockRouter.push).toHaveBeenCalledWith("/apis/1/edit");
        });

        it("should render delete button in header", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("btn-delete")).toBeInTheDocument();
            });
        });

        it("should confirm before delete", async () => {
            const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("btn-delete")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId("btn-delete"));

            expect(confirmSpy).toHaveBeenCalledWith(
                "¿Estás seguro de que quieres eliminar esta API?"
            );
            expect(mockDelete).not.toHaveBeenCalled();

            confirmSpy.mockRestore();
        });

        it("should delete API when confirmed", async () => {
            jest.spyOn(window, "confirm").mockReturnValue(true);
            mockDelete.mockResolvedValue(undefined);

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("btn-delete")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId("btn-delete"));

            await waitFor(() => {
                expect(mockDelete).toHaveBeenCalledWith(1);
            });

            expect(mockRouter.push).toHaveBeenCalledWith("/apis");
        });

        it("should render duplicate button in header", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("btn-duplicate")).toBeInTheDocument();
            });
        });

        it("should navigate to create page on duplicate", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("btn-duplicate")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByTestId("btn-duplicate"));

            expect(mockRouter.push).toHaveBeenCalledWith("/apis/new?duplicate=1");
        });
    });

    describe("Error Handling", () => {
        it("should show error state when API fetch fails", async () => {
            mockGetById.mockRejectedValue(new Error("Network error"));

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("icon-error")).toBeInTheDocument();
            });
        });

        it("should show error message for invalid ID", async () => {
            mockUseParams.mockReturnValue({
                id: "invalid",
                locale: "es",
            });

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByText(/Identificador de API no válido/i)).toBeInTheDocument();
            });
        });

        it("should show error state when API not found", async () => {
            mockGetById.mockRejectedValue(new Error("Not found"));

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("icon-error")).toBeInTheDocument();
            });
        });

        it("should show custom error message", async () => {
            mockGetById.mockRejectedValue(new Error("Custom error"));

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByText(/No se ha podido cargar esta API/i)).toBeInTheDocument();
            });
        });
    });

    describe("Loading States", () => {
        it("should show header skeleton during load", async () => {
            mockGetById.mockImplementationOnce(
                () => new Promise(() => {}) // Never resolves
            );

            const { rerender } = render(<ApiDetailPage />);

            expect(screen.getByTestId("header-skeleton")).toBeInTheDocument();

            // Cleanup
            rerender(<ApiDetailPage />);
        });

        it("should show overview skeleton when loading", async () => {
            mockGetById.mockImplementationOnce(
                () => new Promise(() => {}) // Never resolves
            );

            render(<ApiDetailPage />);

            expect(screen.getByTestId("overview-skeleton")).toBeInTheDocument();
        });

        it("should disable tabs during loading", async () => {
            mockGetById.mockImplementationOnce(
                () => new Promise(() => {}) // Never resolves
            );

            render(<ApiDetailPage />);

            const tabs = screen.getAllByRole("button").filter(
                (btn) => !btn.textContent?.includes("Edit") &&
                    !btn.textContent?.includes("Delete") &&
                    !btn.textContent?.includes("Duplicate")
            );

            tabs.forEach((tab) => {
                expect(tab).toBeDisabled();
            });
        });

        it("should show correct skeleton for selected tab during load", async () => {
            mockUseSearchParams.mockReturnValueOnce(
                new URLSearchParams("tab=docs")
            );
            mockGetById.mockImplementationOnce(
                () => new Promise(() => {}) // Never resolves
            );

            render(<ApiDetailPage />);

            expect(screen.getByTestId("docs-skeleton")).toBeInTheDocument();
        });
    });

    describe("Props and Localization", () => {
        it("should pass locale to dependencies tab", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            const depsTab = screen.getByText("Dependencias");
            fireEvent.click(depsTab);

            await waitFor(() => {
                expect(screen.getByTestId("tab-dependencies")).toBeInTheDocument();
            });
        });

        it("should handle different locales from params", async () => {
            mockUseParams.mockReturnValue({
                id: "1",
                locale: "en",
            });

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(mockGetById).toHaveBeenCalled();
            });
        });

        it("should default to Spanish locale if not provided", async () => {
            mockUseParams.mockReturnValue({
                id: "1",
                locale: undefined,
            });

            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("api-header")).toBeInTheDocument();
            });
        });
    });

    describe("Content Rendering", () => {
        it("should render overview content", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });
        });

        it("should render docs content", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Documentación"));

            await waitFor(() => {
                expect(screen.getByTestId("tab-docs")).toBeInTheDocument();
            });
        });

        it("should render dependencies content", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Dependencias"));

            await waitFor(() => {
                expect(screen.getByTestId("tab-dependencies")).toBeInTheDocument();
            });
        });

        it("should render metadata content", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText("Metadatos"));

            await waitFor(() => {
                expect(screen.getByTestId("tab-metadata")).toBeInTheDocument();
            });
        });
    });

    describe("Tab Persistence", () => {
        it("should keep tab active after content change", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            const docsTab = screen.getByText("Documentación");
            fireEvent.click(docsTab);

            await waitFor(() => {
                expect(screen.getByTestId("tab-docs")).toBeInTheDocument();
                expect(screen.queryByTestId("tab-overview")).not.toBeInTheDocument();
            });
        });

        it("should maintain tab through multiple switches", async () => {
            render(<ApiDetailPage />);

            await waitFor(() => {
                expect(screen.getByTestId("tab-overview")).toBeInTheDocument();
            });

            // Switch to docs
            fireEvent.click(screen.getByText("Documentación"));
            await waitFor(() => {
                expect(screen.getByTestId("tab-docs")).toBeInTheDocument();
            });

            // Switch to metadata
            fireEvent.click(screen.getByText("Metadatos"));
            await waitFor(() => {
                expect(screen.getByTestId("tab-metadata")).toBeInTheDocument();
            });

            // Back to docs
            fireEvent.click(screen.getByText("Documentación"));
            await waitFor(() => {
                expect(screen.getByTestId("tab-docs")).toBeInTheDocument();
            });
        });
    });
});
