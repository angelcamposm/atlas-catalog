import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EntityAttributeTable } from "@/components/architecture/EntityAttributeTable";
import type { EntityAttribute } from "@/types/api";

jest.mock("@/lib/api/architecture", () => ({
    entityAttributesApi: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

import { entityAttributesApi } from "@/lib/api/architecture";

const mockCreate = entityAttributesApi.create as jest.Mock;
const mockUpdate = entityAttributesApi.update as jest.Mock;
const mockDelete = entityAttributesApi.delete as jest.Mock;

const mockAttributes: EntityAttribute[] = [
    {
        id: 1,
        entity_id: 10,
        name: "email",
        type: "string",
        is_required: true,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
    },
    {
        id: 2,
        entity_id: 10,
        name: "age",
        type: null,
        is_required: false,
        created_at: "2025-01-02T00:00:00Z",
        updated_at: "2025-01-02T00:00:00Z",
        created_by: null,
        updated_by: null,
    },
];

const mockOnRefresh = jest.fn();

describe("EntityAttributeTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render existing attributes", () => {
            render(
                <EntityAttributeTable
                    entityId={10}
                    attributes={mockAttributes}
                    onRefresh={mockOnRefresh}
                />,
            );

            expect(screen.getByText("email")).toBeInTheDocument();
            expect(screen.getByText("age")).toBeInTheDocument();
        });

        it("should display attribute type and required flag", () => {
            render(
                <EntityAttributeTable
                    entityId={10}
                    attributes={mockAttributes}
                    onRefresh={mockOnRefresh}
                />,
            );

            expect(screen.getByText("string")).toBeInTheDocument();
            // is_required: true → "Sí"
            expect(screen.getByText("Sí")).toBeInTheDocument();
        });

        it("should show empty state when no attributes", () => {
            render(
                <EntityAttributeTable
                    entityId={10}
                    attributes={[]}
                    onRefresh={mockOnRefresh}
                />,
            );

            expect(screen.getByText(/no tiene atributos/i)).toBeInTheDocument();
        });
    });

    describe("Create Attribute", () => {
        it("should open dialog when clicking 'Añadir atributo'", () => {
            render(
                <EntityAttributeTable
                    entityId={10}
                    attributes={[]}
                    onRefresh={mockOnRefresh}
                />,
            );

            fireEvent.click(screen.getByText("Añadir atributo"));
            expect(screen.getByText("Nuevo atributo")).toBeInTheDocument();
        });

        it("should call create API and onRefresh after saving", async () => {
            mockCreate.mockResolvedValue({
                data: {
                    id: 3,
                    entity_id: 10,
                    name: "phone",
                    type: "string",
                    is_required: false,
                },
            });

            render(
                <EntityAttributeTable
                    entityId={10}
                    attributes={[]}
                    onRefresh={mockOnRefresh}
                />,
            );

            fireEvent.click(screen.getByText("Añadir atributo"));
            fireEvent.change(screen.getByLabelText(/nombre/i), {
                target: { value: "phone" },
            });
            fireEvent.click(screen.getByText("Guardar"));

            await waitFor(() => {
                expect(mockCreate).toHaveBeenCalledWith(10, {
                    name: "phone",
                    type: undefined,
                    is_required: false,
                });
                expect(mockOnRefresh).toHaveBeenCalled();
            });
        });
    });

    describe("Edit Attribute", () => {
        it("should open edit dialog with existing values", () => {
            render(
                <EntityAttributeTable
                    entityId={10}
                    attributes={mockAttributes}
                    onRefresh={mockOnRefresh}
                />,
            );

            const editButtons = screen.getAllByLabelText("Editar atributo");
            fireEvent.click(editButtons[0]);

            expect(screen.getByText("Editar atributo")).toBeInTheDocument();
            expect(screen.getByDisplayValue("email")).toBeInTheDocument();
        });

        it("should call update API on save", async () => {
            mockUpdate.mockResolvedValue({ data: { id: 1 } });

            render(
                <EntityAttributeTable
                    entityId={10}
                    attributes={mockAttributes}
                    onRefresh={mockOnRefresh}
                />,
            );

            const editButtons = screen.getAllByLabelText("Editar atributo");
            fireEvent.click(editButtons[0]);

            fireEvent.change(screen.getByDisplayValue("email"), {
                target: { value: "email_address" },
            });
            fireEvent.click(screen.getByText("Guardar"));

            await waitFor(() => {
                expect(mockUpdate).toHaveBeenCalledWith(
                    1,
                    expect.objectContaining({ name: "email_address" }),
                );
                expect(mockOnRefresh).toHaveBeenCalled();
            });
        });
    });

    describe("Delete Attribute", () => {
        it("should call delete API and onRefresh after confirmation", async () => {
            mockDelete.mockResolvedValue(undefined);

            render(
                <EntityAttributeTable
                    entityId={10}
                    attributes={mockAttributes}
                    onRefresh={mockOnRefresh}
                />,
            );

            const deleteButtons = screen.getAllByLabelText("Eliminar atributo");
            fireEvent.click(deleteButtons[0]);

            // Confirmation dialog should appear
            expect(
                screen.getByText(/¿Eliminar atributo\?/i),
            ).toBeInTheDocument();
            // "email" appears both in dialog description and in the table rows
            expect(screen.getAllByText(/email/).length).toBeGreaterThan(0);

            fireEvent.click(screen.getByText("Eliminar"));

            await waitFor(() => {
                expect(mockDelete).toHaveBeenCalledWith(1);
                expect(mockOnRefresh).toHaveBeenCalled();
            });
        });
    });
});
