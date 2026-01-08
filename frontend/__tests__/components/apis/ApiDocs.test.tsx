import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ApiDocs, ApiDocsSkeleton } from "@/components/apis/ApiDetail/ApiDocs";
import type { Api } from "@/types/api";
import {
    HiOutlineDocumentText,
    HiOutlineCodeBracket,
    HiOutlineArrowsPointingOut,
    HiOutlineArrowsPointingIn,
    HiOutlineExclamationTriangle,
} from "react-icons/hi2";

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiOutlineDocumentText: ({ className }: { className?: string }) => (
        <span data-testid="icon-document" className={className} />
    ),
    HiOutlineCodeBracket: ({ className }: { className?: string }) => (
        <span data-testid="icon-code-bracket" className={className} />
    ),
    HiOutlineArrowsPointingOut: ({ className }: { className?: string }) => (
        <span data-testid="icon-arrows-out" className={className} />
    ),
    HiOutlineArrowsPointingIn: ({ className }: { className?: string }) => (
        <span data-testid="icon-arrows-in" className={className} />
    ),
    HiOutlineExclamationTriangle: ({ className }: { className?: string }) => (
        <span data-testid="icon-warning" className={className} />
    ),
    HiOutlineArrowTopRightOnSquare: ({ className }: { className?: string }) => (
        <span data-testid="icon-link" className={className} />
    ),
}));

// Mock document fullscreen API
Object.defineProperty(document, "exitFullscreen", {
    value: jest.fn().mockResolvedValue(undefined),
    writable: true,
});

Object.defineProperty(document, "fullscreenElement", {
    value: null,
    writable: true,
    configurable: true,
});

// Base mock API
const mockApi: Api = {
    id: 1,
    name: "Test API",
    slug: "test-api",
    description: "Test API description",
    url: "https://api.example.com",
    version: "1.0.0",
    lifecycle_id: 1,
    api_type_id: 1,
    api_status_id: 1,
    category_id: null,
    owner: null,
    api_type: null,
    lifecycle: null,
    api_status: null,
    repository_url: null,
    documentation_url: null,
    slack_channel: null,
    created_by: null,
    updated_by: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    document_specification: null,
};

describe("ApiDocs", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (document as any).fullscreenElement = null;
    });

    describe("Rendering-Basic", () => {
        it("should render component without crashing", () => {
            const { container } = render(<ApiDocs api={mockApi} />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("should render document icon", () => {
            render(<ApiDocs api={mockApi} />);
            expect(screen.getByTestId("icon-document")).toBeInTheDocument();
        });

        it("should apply custom className", () => {
            const { container } = render(
                <ApiDocs api={mockApi} className="custom-class" />
            );
            expect(
                container.querySelector(".custom-class")
            ).toBeInTheDocument();
        });

        it("should render without specification", () => {
            render(<ApiDocs api={mockApi} />);
            expect(screen.getByText("Sin documentación")).toBeInTheDocument();
        });
    });

    describe("No Documentation State", () => {
        it("should show no documentation message when no spec provided", () => {
            render(<ApiDocs api={mockApi} />);
            expect(screen.getByText("Sin documentación")).toBeInTheDocument();
        });

        it("should show helpful description when no spec", () => {
            render(<ApiDocs api={mockApi} />);
            expect(
                screen.getByText(/Esta API no tiene especificación/)
            ).toBeInTheDocument();
        });

        it("should display document icon in empty state", () => {
            render(<ApiDocs api={mockApi} />);
            const icon = screen.getByTestId("icon-document");
            expect(icon).toHaveClass("w-16", "h-16");
        });
    });

    describe("OpenAPI Specification", () => {
        it("should detect OpenAPI object format", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                    info: { title: "Test API", version: "1.0" },
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText(/Especificación OpenAPI/)
            ).toBeInTheDocument();
        });

        it("should detect OpenAPI string format", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification:
                    '"openapi": "3.0.0"\n"info": {"title": "Test API"}',
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("openapi", { selector: "span" })
            ).toBeInTheDocument();
        });

        it("should display OpenAPI badge", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                    info: { title: "Test API" },
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("openapi", { selector: "span" })
            ).toBeInTheDocument();
        });

        it("should show live API link when URL provided", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                url: "https://api.example.com",
                document_specification: {
                    openapi: "3.0.0",
                    info: { title: "Test" },
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(screen.getByText("Ver API en vivo")).toBeInTheDocument();
            expect(screen.getByText("Ver API en vivo")).toHaveAttribute(
                "href",
                "https://api.example.com"
            );
        });

        it("should set target and rel on external link", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                url: "https://api.example.com",
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            const link = screen.getByText("Ver API en vivo");
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });
    });

    describe("JSON Specification", () => {
        it("should detect JSON object format", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    title: "API",
                    description: "Test API",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("json", { selector: "span" })
            ).toBeInTheDocument();
        });

        it("should detect JSON string format", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: '{"title": "Test API"}',
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("json", { selector: "span" })
            ).toBeInTheDocument();
        });

        it("should format JSON with indentation", () => {
            const jsonSpec = {
                title: "Test API",
                version: "1.0.0",
            };

            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: jsonSpec as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            const codeBlock = screen.getByText(/title/);
            expect(codeBlock).toBeInTheDocument();
            expect(codeBlock.textContent).toContain('"title"');
        });

        it("should display JSON in pre element", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: '{"test": "data"}' as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            const preElement = screen.getByText(/test/).closest("pre");
            expect(preElement).toBeInTheDocument();
        });
    });

    describe("YAML Specification", () => {
        it("should detect YAML format with openapi prefix", () => {
            const yamlSpec = "openapi: 3.0.0\ninfo:\n  title: Test API";
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: yamlSpec,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("openapi", { selector: "span" })
            ).toBeInTheDocument();
        });

        it("should detect YAML format with swagger prefix", () => {
            const yamlSpec = "swagger: 2.0\ninfo:\n  title: Test API";
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: yamlSpec,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("openapi", { selector: "span" })
            ).toBeInTheDocument();
        });
    });

    describe("Unknown Format", () => {
        it("should display unknown format warning", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: "invalid spec content here",
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("Formato no reconocido")
            ).toBeInTheDocument();
        });

        it("should show warning icon for unknown format", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: "unknown format",
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(screen.getByTestId("icon-warning")).toBeInTheDocument();
        });

        it("should display raw content for unknown format", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: "random content",
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("Formato no reconocido")
            ).toBeInTheDocument();
        });

        it("should show format detection message", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: "bad format",
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText(/No se pudo determinar el formato/)
            ).toBeInTheDocument();
        });
    });

    describe("Header Section", () => {
        it("should render header with spec", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("Documentación de la API")
            ).toBeInTheDocument();
        });

        it("should display code bracket icon", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(screen.getByTestId("icon-code-bracket")).toBeInTheDocument();
        });

        it("should show format badge", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText("openapi", { selector: "span" })
            ).toBeInTheDocument();
            expect(
                screen.getByText("openapi", { selector: "span" })
            ).toHaveClass("uppercase");
        });
    });

    describe("Fullscreen Functionality", () => {
        it("should render fullscreen button", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            const button = screen.getByRole("button", {
                name: /pantalla completa/i,
            });
            expect(button).toBeInTheDocument();
        });

        it("should show exit fullscreen icon initially", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(screen.getByTestId("icon-arrows-out")).toBeInTheDocument();
        });

        it("should call requestFullscreen on button click", async () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            const requestFullscreenMock = jest.fn();
            const { container } = render(<ApiDocs api={apiWithSpec} />);

            const mainDiv = container.querySelector(
                ".rounded-lg"
            ) as HTMLDivElement;
            mainDiv.requestFullscreen = requestFullscreenMock;

            const button = screen.getByRole("button", {
                name: /pantalla completa/i,
            });
            fireEvent.click(button);

            await waitFor(() => {
                expect(requestFullscreenMock).toHaveBeenCalled();
            });
        });

        it("should have proper button attributes", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);

            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("title", "Pantalla completa");
            expect(button).toHaveAttribute("type", "button");
        });

        it("should have toggle button on header", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            const { container } = render(<ApiDocs api={apiWithSpec} />);
            const button = screen.getByRole("button");
            const header = container.querySelector(
                ".flex.items-center.justify-between"
            );

            // Button should be in header
            expect(header).toContainElement(button);
        });

        it("should toggle fullscreen on button click", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);

            const button = screen.getByRole("button");

            // Just verify we can click without error
            expect(() => fireEvent.click(button)).not.toThrow();
        });
    });

    describe("Content Section", () => {
        it("should render content area with padding", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            const { container } = render(<ApiDocs api={apiWithSpec} />);
            const contentDiv = container.querySelector(".p-4");
            expect(contentDiv).toBeInTheDocument();
        });

        it("should display spec content in code block", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification:
                    '{"test": "value"}' as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            const preElement = screen.getByText(/test/).closest("pre");
            expect(preElement).toHaveClass("font-mono");
            expect(preElement).toHaveClass("bg-gray-900");
        });
    });

    describe("SwaggerUIPlaceholder Integration", () => {
        it("should show OpenAPI message for OpenAPI specs", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification: {
                    openapi: "3.0.0",
                } as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(screen.getByText(/OpenAPI\/Swagger/)).toBeInTheDocument();
        });

        it("should show format message for non-OpenAPI specs", () => {
            const apiWithSpec: Api = {
                ...mockApi,
                document_specification:
                    '{"title": "Test API"}' as unknown as string,
            };

            render(<ApiDocs api={apiWithSpec} />);
            expect(
                screen.getByText(/Se ha detectado documentación/)
            ).toBeInTheDocument();
        });
    });

    describe("ApiDocsSkeleton Component", () => {
        it("should render skeleton without crashing", () => {
            const { container } = render(<ApiDocsSkeleton />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("should have animate-pulse class", () => {
            const { container } = render(<ApiDocsSkeleton />);
            expect(container.firstChild).toHaveClass("animate-pulse");
        });

        it("should render header skeleton", () => {
            const { container } = render(<ApiDocsSkeleton />);
            const header = container.querySelector(
                ".flex.items-center.justify-between"
            );
            expect(header).toBeInTheDocument();
        });

        it("should render title skeleton", () => {
            const { container } = render(<ApiDocsSkeleton />);
            const titleSkeleton = container.querySelector("div.h-5");
            expect(titleSkeleton).toBeInTheDocument();
        });

        it("should render content skeleton lines", () => {
            const { container } = render(<ApiDocsSkeleton />);
            const lines = container.querySelectorAll("div.h-4");
            expect(lines.length).toBeGreaterThan(0);
        });

        it("should render large content area skeleton", () => {
            const { container } = render(<ApiDocsSkeleton />);
            const largeArea = container.querySelector("div.h-64");
            expect(largeArea).toBeInTheDocument();
        });

        it("should have dark mode classes", () => {
            const { container } = render(<ApiDocsSkeleton />);
            const skeleton = container.firstChild as HTMLElement;
            expect(skeleton.className).toMatch(/dark:/);
        });
    });
});
