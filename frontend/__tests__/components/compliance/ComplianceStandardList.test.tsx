import { render, screen, fireEvent } from "@testing-library/react";
import { ComplianceStandardList } from "@/components/compliance/ComplianceStandardList";
import type { ComplianceStandard } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineShieldCheck: () => <span data-testid="icon-shield" />,
    HiOutlinePencilSquare: () => <span data-testid="icon-edit" />,
    HiOutlineTrash: () => <span data-testid="icon-trash" />,
    HiOutlineEye: () => <span data-testid="icon-eye" />,
}));

const createMockStandard = (
    overrides: Partial<ComplianceStandard> = {},
): ComplianceStandard => ({
    id: 1,
    name: "ISO 27001",
    display_name: "ISO/IEC 27001",
    description: "Information security management",
    country_code: "INT",
    focus_area: "Security",
    industry: "All",
    url: "https://iso.org",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("ComplianceStandardList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of compliance standards", () => {
            const standards = [
                createMockStandard({ id: 1, name: "ISO 27001" }),
                createMockStandard({
                    id: 2,
                    name: "SOC 2",
                    display_name: "SOC 2 Type II",
                }),
            ];
            render(<ComplianceStandardList standards={standards} />);
            expect(screen.getByText("ISO 27001")).toBeInTheDocument();
            expect(screen.getByText("SOC 2")).toBeInTheDocument();
        });

        it("should display display_name when available", () => {
            const standards = [
                createMockStandard({ display_name: "ISO/IEC 27001" }),
            ];
            render(<ComplianceStandardList standards={standards} />);
            expect(screen.getByText("ISO/IEC 27001")).toBeInTheDocument();
        });

        it("should show a dash when display_name is null", () => {
            const standards = [createMockStandard({ display_name: null })];
            render(<ComplianceStandardList standards={standards} />);
            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should display country_code of each standard", () => {
            const standards = [createMockStandard({ country_code: "US" })];
            render(<ComplianceStandardList standards={standards} />);
            expect(screen.getByText("US")).toBeInTheDocument();
        });

        it("should show empty state when no standards exist", () => {
            render(<ComplianceStandardList standards={[]} />);
            expect(
                screen.getByText("No hay estándares de compliance registrados"),
            ).toBeInTheDocument();
        });

        it("should render view, edit and delete buttons for each standard", () => {
            const standards = [
                createMockStandard({ id: 1 }),
                createMockStandard({ id: 2, name: "SOC 2" }),
            ];
            render(<ComplianceStandardList standards={standards} />);
            expect(screen.getAllByTestId("icon-eye")).toHaveLength(2);
            expect(screen.getAllByTestId("icon-edit")).toHaveLength(2);
            expect(screen.getAllByTestId("icon-trash")).toHaveLength(2);
        });
    });

    describe("Callbacks", () => {
        it("should call onView with the standard id when view button is clicked", () => {
            const onView = jest.fn();
            const standard = createMockStandard({ id: 5, name: "GDPR" });
            render(
                <ComplianceStandardList
                    standards={[standard]}
                    onView={onView}
                />,
            );
            fireEvent.click(screen.getByTestId("icon-eye").closest("button")!);
            expect(onView).toHaveBeenCalledWith(5);
        });

        it("should call onEdit with the standard when edit button is clicked", () => {
            const onEdit = jest.fn();
            const standard = createMockStandard({ id: 7, name: "HIPAA" });
            render(
                <ComplianceStandardList
                    standards={[standard]}
                    onEdit={onEdit}
                />,
            );
            fireEvent.click(screen.getByTestId("icon-edit").closest("button")!);
            expect(onEdit).toHaveBeenCalledWith(standard);
        });

        it("should call onDelete with the standard id when delete button is clicked", () => {
            const onDelete = jest.fn();
            const standard = createMockStandard({ id: 9 });
            render(
                <ComplianceStandardList
                    standards={[standard]}
                    onDelete={onDelete}
                />,
            );
            fireEvent.click(
                screen.getByTestId("icon-trash").closest("button")!,
            );
            expect(onDelete).toHaveBeenCalledWith(9);
        });

        it("should not throw when callbacks are not provided", () => {
            const standards = [createMockStandard()];
            expect(() => {
                render(<ComplianceStandardList standards={standards} />);
                fireEvent.click(
                    screen.getByTestId("icon-eye").closest("button")!,
                );
                fireEvent.click(
                    screen.getByTestId("icon-edit").closest("button")!,
                );
                fireEvent.click(
                    screen.getByTestId("icon-trash").closest("button")!,
                );
            }).not.toThrow();
        });
    });

    describe("Empty state icon", () => {
        it("should render shield icon in empty state", () => {
            render(<ComplianceStandardList standards={[]} />);
            expect(screen.getByTestId("icon-shield")).toBeInTheDocument();
        });
    });
});
