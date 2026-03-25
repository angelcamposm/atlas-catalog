import { render, screen, fireEvent } from "@testing-library/react";
import { EntityList } from "@/components/architecture/EntityList";
import type { Entity } from "@/types/api";

const mockEntities: Entity[] = [
    {
        id: 1,
        name: "Customer",
        description: "Represents a customer in the system",
        is_enabled: true,
        domain_id: null,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
    },
    {
        id: 2,
        name: "Product",
        description: null,
        is_enabled: false,
        domain_id: 3,
        created_at: "2025-01-02T00:00:00Z",
        updated_at: "2025-01-02T00:00:00Z",
        created_by: null,
        updated_by: null,
    },
];

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("EntityList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of entities", () => {
            render(
                <EntityList
                    entities={mockEntities}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(screen.getByText("Customer")).toBeInTheDocument();
            expect(screen.getByText("Product")).toBeInTheDocument();
        });

        it("should display entity description when available", () => {
            render(
                <EntityList
                    entities={mockEntities}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(
                screen.getByText("Represents a customer in the system"),
            ).toBeInTheDocument();
        });

        it("should show empty state when no entities", () => {
            render(
                <EntityList
                    entities={[]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(screen.getByText(/no hay entidades/i)).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onEdit with the entity when edit button is clicked", () => {
            render(
                <EntityList
                    entities={mockEntities}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            const editButtons = screen.getAllByLabelText("Editar");
            fireEvent.click(editButtons[0]);

            expect(mockOnEdit).toHaveBeenCalledWith(mockEntities[0]);
        });

        it("should call onDelete with the entity when delete button is clicked", () => {
            render(
                <EntityList
                    entities={mockEntities}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            const deleteButtons = screen.getAllByLabelText("Eliminar");
            fireEvent.click(deleteButtons[0]);

            expect(mockOnDelete).toHaveBeenCalledWith(mockEntities[0]);
        });
    });
});
