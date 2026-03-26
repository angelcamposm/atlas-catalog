import { render, screen, fireEvent } from "@testing-library/react";
import { RequirementTable } from "@/components/compliance/RequirementTable";
import type { ComplianceRequirement } from "@/types/api";

jest.mock("react-icons/hi2", () => ({
    HiOutlineDocumentText: () => <span data-testid="icon-document" />,
    HiOutlinePencilSquare: () => <span data-testid="icon-edit" />,
    HiOutlineTrash: () => <span data-testid="icon-trash" />,
    HiOutlinePlus: () => <span data-testid="icon-plus" />,
}));

const createMockRequirement = (
    overrides: Partial<ComplianceRequirement> = {},
): ComplianceRequirement => ({
    id: 1,
    compliance_standard_id: 10,
    name: "Access Control",
    description: "Control access to systems",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: null,
    updated_by: null,
    ...overrides,
});

describe("RequirementTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of requirements", () => {
            const requirements = [
                createMockRequirement({ id: 1, name: "Access Control" }),
                createMockRequirement({ id: 2, name: "Encryption at Rest" }),
            ];
            render(<RequirementTable requirements={requirements} />);
            expect(screen.getByText("Access Control")).toBeInTheDocument();
            expect(screen.getByText("Encryption at Rest")).toBeInTheDocument();
        });

        it("should display the description when provided", () => {
            const requirements = [
                createMockRequirement({
                    description: "Control access to systems",
                }),
            ];
            render(<RequirementTable requirements={requirements} />);
            expect(
                screen.getByText("Control access to systems"),
            ).toBeInTheDocument();
        });

        it("should show a dash when description is null", () => {
            const requirements = [createMockRequirement({ description: null })];
            render(<RequirementTable requirements={requirements} />);
            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should show empty state when no requirements exist", () => {
            render(<RequirementTable requirements={[]} />);
            expect(
                screen.getByText(
                    "No hay requerimientos registrados para este estándar",
                ),
            ).toBeInTheDocument();
        });

        it("should render edit and delete buttons for each requirement", () => {
            const requirements = [
                createMockRequirement({ id: 1 }),
                createMockRequirement({ id: 2, name: "Logging" }),
            ];
            render(<RequirementTable requirements={requirements} />);
            expect(screen.getAllByTestId("icon-edit")).toHaveLength(2);
            expect(screen.getAllByTestId("icon-trash")).toHaveLength(2);
        });

        it("should render an Add button", () => {
            render(<RequirementTable requirements={[]} />);
            expect(screen.getByTestId("icon-plus")).toBeInTheDocument();
        });
    });

    describe("Callbacks", () => {
        it("should call onAdd when Add button is clicked", () => {
            const onAdd = jest.fn();
            render(<RequirementTable requirements={[]} onAdd={onAdd} />);
            fireEvent.click(screen.getByTestId("icon-plus").closest("button")!);
            expect(onAdd).toHaveBeenCalledTimes(1);
        });

        it("should call onEdit with the requirement when edit button is clicked", () => {
            const onEdit = jest.fn();
            const requirement = createMockRequirement({
                id: 3,
                name: "Audit Logs",
            });
            render(
                <RequirementTable
                    requirements={[requirement]}
                    onEdit={onEdit}
                />,
            );
            fireEvent.click(screen.getByTestId("icon-edit").closest("button")!);
            expect(onEdit).toHaveBeenCalledWith(requirement);
        });

        it("should call onDelete with the requirement id when delete button is clicked", () => {
            const onDelete = jest.fn();
            const requirement = createMockRequirement({ id: 7 });
            render(
                <RequirementTable
                    requirements={[requirement]}
                    onDelete={onDelete}
                />,
            );
            fireEvent.click(
                screen.getByTestId("icon-trash").closest("button")!,
            );
            expect(onDelete).toHaveBeenCalledWith(7);
        });

        it("should not throw when callbacks are not provided", () => {
            const requirements = [createMockRequirement()];
            expect(() => {
                render(<RequirementTable requirements={requirements} />);
                fireEvent.click(
                    screen.getByTestId("icon-edit").closest("button")!,
                );
                fireEvent.click(
                    screen.getByTestId("icon-trash").closest("button")!,
                );
                fireEvent.click(
                    screen.getByTestId("icon-plus").closest("button")!,
                );
            }).not.toThrow();
        });
    });

    describe("Empty state icon", () => {
        it("should render document icon in empty state", () => {
            render(<RequirementTable requirements={[]} />);
            expect(screen.getByTestId("icon-document")).toBeInTheDocument();
        });
    });
});
