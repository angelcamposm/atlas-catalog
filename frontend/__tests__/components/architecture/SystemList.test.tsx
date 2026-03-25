import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SystemList } from "@/components/architecture/SystemList";
import type { System } from "@/types/api";

function createMockSystem(overrides: Partial<System> = {}): System {
    return {
        id: 1,
        name: "Core Platform",
        description: "Main platform system",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
        ...overrides,
    };
}

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("SystemList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of systems", () => {
            const systems = [
                createMockSystem({ id: 1, name: "Core Platform" }),
                createMockSystem({ id: 2, name: "Auth Service" }),
            ];
            render(
                <SystemList
                    systems={systems}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText("Core Platform")).toBeInTheDocument();
            expect(screen.getByText("Auth Service")).toBeInTheDocument();
        });

        it("should render the description when provided", () => {
            const systems = [
                createMockSystem({
                    description: "Main platform system",
                }),
            ];
            render(
                <SystemList
                    systems={systems}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(
                screen.getByText("Main platform system"),
            ).toBeInTheDocument();
        });

        it("should show empty state when no systems", () => {
            render(
                <SystemList
                    systems={[]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(
                screen.getByText(/no hay sistemas/i),
            ).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onEdit when edit button is clicked", () => {
            const system = createMockSystem({ id: 42, name: "Analytics" });
            render(
                <SystemList
                    systems={[system]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /editar/i }));
            expect(mockOnEdit).toHaveBeenCalledWith(system);
        });

        it("should call onDelete when delete button is clicked", () => {
            const system = createMockSystem({ id: 42, name: "Analytics" });
            render(
                <SystemList
                    systems={[system]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /eliminar/i }));
            expect(mockOnDelete).toHaveBeenCalledWith(system);
        });
    });
});
