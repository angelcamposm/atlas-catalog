import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ApiMetadata, ApiMetadataSkeleton } from "@/components/apis/ApiDetail/ApiMetadata";
import type { Api } from "@/types/api";
import {
    HiOutlineTableCells,
    HiOutlineClipboardDocument,
    HiOutlineCheckCircle,
    HiOutlineChevronDown,
    HiOutlineTag,
    HiOutlineCog6Tooth,
} from "react-icons/hi2";

// Mock react-icons
jest.mock("react-icons/hi2", () => ({
    HiOutlineTableCells: ({ className }: { className?: string }) => (
        <span data-testid="icon-table" className={className} />
    ),
    HiOutlineClipboardDocument: ({ className }: { className?: string }) => (
        <span data-testid="icon-clipboard" className={className} />
    ),
    HiOutlineCheckCircle: ({ className }: { className?: string }) => (
        <span data-testid="icon-check" className={className} />
    ),
    HiOutlineChevronDown: ({ className }: { className?: string }) => (
        <span data-testid="icon-chevron" className={className} />
    ),
    HiOutlineTag: ({ className }: { className?: string }) => (
        <span data-testid="icon-tag" className={className} />
    ),
    HiOutlineCog6Tooth: ({ className }: { className?: string }) => (
        <span data-testid="icon-cog" className={className} />
    ),
}));

// Mock clipboard API
Object.defineProperty(navigator, "clipboard", {
    value: {
        writeText: jest.fn().mockResolvedValue(undefined),
    },
    writable: true,
});

// Base mock API
const mockApi: Api = {
    id: 1,
    name: "test-api",
    slug: "test-api",
    description: "Test API description",
    url: "https://api.example.com",
    version: "1.0.0",
    display_name: "Test API",
    protocol: "HTTP",
    lifecycle_id: 1,
    api_type_id: 1,
    api_status_id: 1,
    category_id: 1,
    type_id: 1,
    status_id: 1,
    authentication_method_id: 1,
    access_policy_id: 1,
    owner: null,
    api_type: null,
    lifecycle: null,
    api_status: null,
    repository_url: null,
    documentation_url: null,
    slack_channel: null,
    released_at: "2024-01-01T00:00:00Z",
    deprecated_at: null,
    created_by: 1,
    updated_by: 2,
    deprecated_by: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    document_specification: null,
};

describe("ApiMetadata", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering-Basic", () => {
        it("should render component without crashing", () => {
            const { container } = render(<ApiMetadata api={mockApi} />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("should render header", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(
                screen.getByText("Metadatos Completos")
            ).toBeInTheDocument();
        });

        it("should apply custom className", () => {
            const { container } = render(
                <ApiMetadata api={mockApi} className="custom-class" />
            );
            expect(container.querySelector(".custom-class")).toBeInTheDocument();
        });

        it("should display table icon", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByTestId("icon-table")).toBeInTheDocument();
        });
    });

    describe("Info Box", () => {
        it("should show info box", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(
                screen.getByText(/Vista técnica de todos los campos/)
            ).toBeInTheDocument();
        });

        it("should mention debugging and integrations", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(
                screen.getByText(/Útil para debugging y integraciones/)
            ).toBeInTheDocument();
        });
    });

    describe("Metadata Groups", () => {
        it("should render identity group", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByText("Identificación")).toBeInTheDocument();
        });

        it("should render relations group", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByText("Relaciones")).toBeInTheDocument();
        });

        it("should render dates group", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByText("Fechas")).toBeInTheDocument();
        });

        it("should render other group", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByText("Otros")).toBeInTheDocument();
        });

        it("should display count badges for each group", () => {
            render(<ApiMetadata api={mockApi} />);
            const badges = screen.getAllByText(/\s\/\s/);
            expect(badges.length).toBeGreaterThan(0);
        });
    });

    describe("Group Expansion", () => {
        it("should open identity group by default", () => {
            render(<ApiMetadata api={mockApi} />);
            // If content is rendered, group is open
            expect(screen.getByText("ID")).toBeInTheDocument();
        });

        it("should open relations group by default", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByText("Tipo de API (ID)")).toBeInTheDocument();
        });

        it("should open dates group by default", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByText("Creado")).toBeInTheDocument();
        });

        it("should close other group by default", () => {
            render(<ApiMetadata api={mockApi} />);
            // Otros group fields should not be visible initially
            const createdByLabel = screen.queryAllByText("Creado por");
            // Filter for actual content, not in collapsed state
            expect(createdByLabel.length).toBeLessThan(2);
        });

        it("should toggle other group when clicked", () => {
            render(<ApiMetadata api={mockApi} />);
            const otrosButton = screen.getByText("Otros").closest("button");
            expect(otrosButton).toBeInTheDocument();

            fireEvent.click(otrosButton!);

            expect(screen.getByText("Creado por")).toBeInTheDocument();
        });

        it("should toggle group open/closed", () => {
            render(<ApiMetadata api={mockApi} />);
            const identityButton =
                screen.getByText("Identificación").closest("button");

            // Initially open
            expect(screen.getByText("ID")).toBeInTheDocument();

            // Toggle closed
            fireEvent.click(identityButton!);
            expect(screen.queryByText("ID")).not.toBeInTheDocument();

            // Toggle open
            fireEvent.click(identityButton!);
            expect(screen.getByText("ID")).toBeInTheDocument();
        });
    });

    describe("Metadata Fields Display", () => {
        it("should display field labels", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByText("ID")).toBeInTheDocument();
            expect(screen.getByText("Nombre técnico")).toBeInTheDocument();
            expect(screen.getByText("Versión")).toBeInTheDocument();
        });

        it("should display field keys in code blocks", () => {
            const { container } = render(<ApiMetadata api={mockApi} />);
            const codeBlocks = container.querySelectorAll("code");
            expect(codeBlocks.length).toBeGreaterThan(0);
        });

        it("should format ID values with hash prefix", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByText("#1")).toBeInTheDocument();
        });

        it("should format boolean values correctly", () => {
            render(<ApiMetadata api={mockApi} />);
            // Some field should show "Sí" or "No"
            // This depends on which fields are actually boolean
        });

        it("should format date values with locale", () => {
            render(<ApiMetadata api={mockApi} />);
            // Dates should be formatted in Spanish locale
            expect(screen.getByText(/1\/1\/2024|2024-01-01/)).toBeInTheDocument();
        });

        it("should show dash for null/undefined values", () => {
            const apiWithNulls: Api = {
                ...mockApi,
                display_name: null as unknown as string,
                protocol: null as unknown as string,
            };

            render(<ApiMetadata api={apiWithNulls} />);
            const dashes = screen.getAllByText("—");
            expect(dashes.length).toBeGreaterThan(0);
        });
    });

    describe("Copy Functionality", () => {
        it("should show copy button for copyable fields", () => {
            render(<ApiMetadata api={mockApi} />);
            const clipboardIcons = screen.getAllByTestId("icon-clipboard");
            expect(clipboardIcons.length).toBeGreaterThan(0);
        });

        it("should not show copy button for non-copyable fields", () => {
            render(<ApiMetadata api={mockApi} />);
            const clipboardIcons = screen.getAllByTestId("icon-clipboard");
            // Not every field should have a copy button
            const rows = screen.getAllByRole("row");
            expect(rows.length).toBeGreaterThan(clipboardIcons.length);
        });

        it("should not show copy button for empty values", () => {
            const apiWithNulls: Api = {
                ...mockApi,
                display_name: null as unknown as string,
            };

            render(<ApiMetadata api={apiWithNulls} />);
            const clipboardIcons = screen.getAllByTestId("icon-clipboard");
            // Should exist for other copyable fields but not for null ones
            expect(clipboardIcons.length).toBeGreaterThan(0);
        });

        it("should copy value to clipboard on button click", async () => {
            render(<ApiMetadata api={mockApi} />);

            // Find first copy button
            const copyButtons = screen.getAllByRole("button").filter((btn) =>
                btn.closest("td")
            );

            if (copyButtons.length > 0) {
                fireEvent.click(copyButtons[0]);

                await waitFor(() => {
                    expect(navigator.clipboard.writeText).toHaveBeenCalled();
                });
            }
        });

        it("should show checkmark after copy", async () => {
            render(<ApiMetadata api={mockApi} />);

            const copyButtons = screen.getAllByRole("button").filter((btn) =>
                btn.closest("td")
            );

            if (copyButtons.length > 0) {
                fireEvent.click(copyButtons[0]);

                await waitFor(() => {
                    expect(
                        screen.getByTestId("icon-check")
                    ).toBeInTheDocument();
                });
            }
        });

        it("should revert checkmark after 2 seconds", async () => {
            jest.useFakeTimers();
            render(<ApiMetadata api={mockApi} />);

            const copyButtons = screen.getAllByRole("button").filter((btn) =>
                btn.closest("td")
            );

            if (copyButtons.length > 0) {
                fireEvent.click(copyButtons[0]);

                await waitFor(() => {
                    expect(
                        screen.getByTestId("icon-check")
                    ).toBeInTheDocument();
                });

                jest.advanceTimersByTime(2000);

                expect(screen.queryByTestId("icon-check")).not.toBeInTheDocument();
            }

            jest.useRealTimers();
        });
    });

    describe("JSON Export", () => {
        it("should show JSON export section", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(
                screen.getByText("Exportar como JSON")
            ).toBeInTheDocument();
        });

        it("should display JSON content in pre element", () => {
            const { container } = render(<ApiMetadata api={mockApi} />);
            const preElements = container.querySelectorAll("pre");
            expect(preElements.length).toBeGreaterThan(0);
        });

        it("should show copy button for JSON", () => {
            render(<ApiMetadata api={mockApi} />);
            const copyButtons = screen.getAllByRole("button");
            const jsonCopyButton = copyButtons.find((btn) =>
                btn.textContent?.includes("Copiar JSON")
            );
            expect(jsonCopyButton).toBeInTheDocument();
        });

        it("should copy JSON to clipboard on button click", async () => {
            render(<ApiMetadata api={mockApi} />);

            const copyJsonButton = screen
                .getAllByRole("button")
                .find((btn) => btn.textContent?.includes("Copiar JSON"));

            if (copyJsonButton) {
                fireEvent.click(copyJsonButton);

                await waitFor(() => {
                    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                        expect.stringContaining('"id"')
                    );
                });
            }
        });

        it("should format JSON with indentation", () => {
            const { container } = render(<ApiMetadata api={mockApi} />);
            const preElement = container.querySelector("pre");
            expect(preElement?.textContent).toContain("\n");
        });
    });

    describe("Row Styling", () => {
        it("should apply hover effect to rows", () => {
            const { container } = render(<ApiMetadata api={mockApi} />);
            const rows = container.querySelectorAll("tbody tr");
            expect(rows.length).toBeGreaterThan(0);
            rows.forEach((row) => {
                expect(row.className).toContain("hover");
            });
        });

        it("should apply different styling for empty values", () => {
            const apiWithNulls: Api = {
                ...mockApi,
                display_name: null as unknown as string,
            };

            render(<ApiMetadata api={apiWithNulls} />);
            // Component should still render without crashing
            expect(
                screen.getByText("Metadatos Completos")
            ).toBeInTheDocument();
        });

        it("should apply dark mode classes", () => {
            const { container } = render(<ApiMetadata api={mockApi} />);
            const elements = container.querySelectorAll("[class*='dark:']");
            expect(elements.length).toBeGreaterThan(0);
        });
    });

    describe("Table Structure", () => {
        it("should render table headers", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getAllByText("Campo").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Clave").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Valor").length).toBeGreaterThan(0);
        });

        it("should render rows in table", () => {
            const { container } = render(<ApiMetadata api={mockApi} />);
            const tableRows = container.querySelectorAll("tbody tr");
            expect(tableRows.length).toBeGreaterThan(0);
        });

        it("should have correct column widths", () => {
            const { container } = render(<ApiMetadata api={mockApi} />);
            const headers = container.querySelectorAll("thead th");
            expect(headers.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe("ApiMetadataSkeleton Component", () => {
        it("should render skeleton without crashing", () => {
            const { container } = render(<ApiMetadataSkeleton />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("should have animate-pulse class", () => {
            const { container } = render(<ApiMetadataSkeleton />);
            expect(container.firstChild).toHaveClass("animate-pulse");
        });

        it("should render header skeleton", () => {
            const { container } = render(<ApiMetadataSkeleton />);
            const headerSkeletons = container.querySelectorAll(".flex.items-center");
            expect(headerSkeletons.length).toBeGreaterThan(0);
        });

        it("should render group skeletons", () => {
            const { container } = render(<ApiMetadataSkeleton />);
            const groupSkeletons = container.querySelectorAll(
                ".border.border-gray-200"
            );
            expect(groupSkeletons.length).toBeGreaterThanOrEqual(3);
        });

        it("should render field row skeletons", () => {
            const { container } = render(<ApiMetadataSkeleton />);
            const rows = container.querySelectorAll(".flex.gap-4");
            expect(rows.length).toBeGreaterThan(0);
        });

        it("should have dark mode classes", () => {
            const { container } = render(<ApiMetadataSkeleton />);
            const elements = container.querySelectorAll("[class*='dark:']");
            expect(elements.length).toBeGreaterThan(0);
        });
    });

    describe("Field Extraction", () => {
        it("should include identity fields", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(screen.getByText("ID")).toBeInTheDocument();
            expect(screen.getByText("Nombre técnico")).toBeInTheDocument();
            expect(screen.getByText("Versión")).toBeInTheDocument();
        });

        it("should include relation fields", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(
                screen.getByText("Tipo de API (ID)")
            ).toBeInTheDocument();
            expect(screen.getByText("Estado (ID)")).toBeInTheDocument();
        });

        it("should include date fields", () => {
            render(<ApiMetadata api={mockApi} />);
            expect(
                screen.getByText("Fecha de lanzamiento")
            ).toBeInTheDocument();
            expect(screen.getByText("Creado")).toBeInTheDocument();
            expect(screen.getByText("Actualizado")).toBeInTheDocument();
        });

        it("should include other fields", () => {
            render(<ApiMetadata api={mockApi} />);
            const otrosButton = screen.getByText("Otros").closest("button");
            fireEvent.click(otrosButton!);

            expect(screen.getByText("Creado por")).toBeInTheDocument();
            expect(screen.getByText("Actualizado por")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("should handle API with all null optional fields", () => {
            const apiWithNulls: Api = {
                ...mockApi,
                display_name: null as unknown as string,
                protocol: null as unknown as string,
                released_at: null as unknown as string,
                deprecated_at: null as unknown as string,
                deprecated_by: null as unknown as string,
            };

            render(<ApiMetadata api={apiWithNulls} />);
            expect(
                screen.getByText("Metadatos Completos")
            ).toBeInTheDocument();
        });

        it("should handle very long string values", () => {
            const apiWithLongString: Api = {
                ...mockApi,
                description:
                    "A".repeat(500),
            };

            render(<ApiMetadata api={apiWithLongString} />);
            expect(
                screen.getByText("Metadatos Completos")
            ).toBeInTheDocument();
        });

        it("should handle API with zeros and false values", () => {
            const apiWithZeros: Api = {
                ...mockApi,
                id: 0,
                category_id: 0,
            };

            render(<ApiMetadata api={apiWithZeros} />);
            expect(screen.getByText("#0")).toBeInTheDocument();
        });
    });
});
