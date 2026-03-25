import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CapabilityList } from "@/components/business/CapabilityList";
import type { BusinessCapability } from "@/types/api";

function createMockCapability(
    overrides: Partial<BusinessCapability> = {},
): BusinessCapability {
    return {
        id: 1,
        name: "Customer Management",
        description: "Manages customer lifecycle",
        parent_id: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
        ...overrides,
    };
}

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("CapabilityList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of capabilities", () => {
            const capabilities = [
                createMockCapability({ id: 1, name: "Customer Management" }),
                createMockCapability({ id: 2, name: "Order Processing" }),
            ];
            render(
                <CapabilityList
                    capabilities={capabilities}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText("Customer Management")).toBeInTheDocument();
            expect(screen.getByText("Order Processing")).toBeInTheDocument();
        });

        it("should render the description when provided", () => {
            const capabilities = [
                createMockCapability({
                    description: "Manages customer lifecycle",
                }),
            ];
            render(
                <CapabilityList
                    capabilities={capabilities}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(
                screen.getByText("Manages customer lifecycle"),
            ).toBeInTheDocument();
        });

        it("should show parent indicator when parent_id is set", () => {
            const capabilities = [
                createMockCapability({ id: 2, parent_id: 1 }),
            ];
            render(
                <CapabilityList
                    capabilities={capabilities}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(
                screen.getByTestId("child-capability-2"),
            ).toBeInTheDocument();
        });

        it("should show empty state when no capabilities", () => {
            render(
                <CapabilityList
                    capabilities={[]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText(/no hay capacidades/i)).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onEdit when edit button is clicked", () => {
            const capability = createMockCapability({
                id: 42,
                name: "Analytics",
            });
            render(
                <CapabilityList
                    capabilities={[capability]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /editar/i }));
            expect(mockOnEdit).toHaveBeenCalledWith(capability);
        });

        it("should call onDelete when delete button is clicked", () => {
            const capability = createMockCapability({
                id: 42,
                name: "Analytics",
            });
            render(
                <CapabilityList
                    capabilities={[capability]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /eliminar/i }));
            expect(mockOnDelete).toHaveBeenCalledWith(capability);
        });
    });
});
