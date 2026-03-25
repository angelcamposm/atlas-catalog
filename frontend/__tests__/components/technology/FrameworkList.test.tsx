import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FrameworkList } from "@/components/technology/FrameworkList";
import type { Framework } from "@/types/api";

function createMockFramework(overrides: Partial<Framework> = {}): Framework {
    return {
        id: 1,
        language_id: 2,
        name: "React",
        description: "A JavaScript library",
        icon: null,
        is_enabled: true,
        url: "https://reactjs.org",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
        ...overrides,
    };
}

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("FrameworkList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of frameworks", () => {
            const frameworks = [
                createMockFramework({ id: 1, name: "React" }),
                createMockFramework({ id: 2, name: "Vue" }),
            ];
            render(
                <FrameworkList
                    frameworks={frameworks}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText("React")).toBeInTheDocument();
            expect(screen.getByText("Vue")).toBeInTheDocument();
        });

        it("should render the description when provided", () => {
            const frameworks = [
                createMockFramework({ description: "A JavaScript library" }),
            ];
            render(
                <FrameworkList
                    frameworks={frameworks}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(
                screen.getByText("A JavaScript library"),
            ).toBeInTheDocument();
        });

        it("should show enabled badge when is_enabled is true", () => {
            const frameworks = [createMockFramework({ is_enabled: true })];
            render(
                <FrameworkList
                    frameworks={frameworks}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText("Activo")).toBeInTheDocument();
        });

        it("should show empty state when no frameworks", () => {
            render(
                <FrameworkList
                    frameworks={[]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText(/no hay frameworks/i)).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onEdit when edit button is clicked", () => {
            const framework = createMockFramework({ id: 42, name: "Angular" });
            render(
                <FrameworkList
                    frameworks={[framework]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /editar/i }));
            expect(mockOnEdit).toHaveBeenCalledWith(framework);
        });

        it("should call onDelete when delete button is clicked", () => {
            const framework = createMockFramework({ id: 42, name: "Angular" });
            render(
                <FrameworkList
                    frameworks={[framework]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /eliminar/i }));
            expect(mockOnDelete).toHaveBeenCalledWith(framework);
        });
    });
});
