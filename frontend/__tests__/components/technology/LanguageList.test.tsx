import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageList } from "@/components/technology/LanguageList";
import type { ProgrammingLanguage } from "@/types/api";

function createMockLanguage(
    overrides: Partial<ProgrammingLanguage> = {},
): ProgrammingLanguage {
    return {
        id: 1,
        name: "TypeScript",
        icon: null,
        is_enabled: true,
        url: "https://typescriptlang.org",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_by: null,
        ...overrides,
    };
}

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("LanguageList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of languages", () => {
            const languages = [
                createMockLanguage({ id: 1, name: "TypeScript" }),
                createMockLanguage({ id: 2, name: "Python" }),
            ];
            render(
                <LanguageList
                    languages={languages}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText("TypeScript")).toBeInTheDocument();
            expect(screen.getByText("Python")).toBeInTheDocument();
        });

        it("should show enabled badge when is_enabled is true", () => {
            const languages = [createMockLanguage({ is_enabled: true })];
            render(
                <LanguageList
                    languages={languages}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText("Activo")).toBeInTheDocument();
        });

        it("should show inactive badge when is_enabled is false", () => {
            const languages = [createMockLanguage({ is_enabled: false })];
            render(
                <LanguageList
                    languages={languages}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText("Inactivo")).toBeInTheDocument();
        });

        it("should show empty state when no languages", () => {
            render(
                <LanguageList
                    languages={[]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            expect(screen.getByText(/no hay lenguajes/i)).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onEdit when edit button is clicked", () => {
            const language = createMockLanguage({ id: 7, name: "Go" });
            render(
                <LanguageList
                    languages={[language]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /editar/i }));
            expect(mockOnEdit).toHaveBeenCalledWith(language);
        });

        it("should call onDelete when delete button is clicked", () => {
            const language = createMockLanguage({ id: 7, name: "Go" });
            render(
                <LanguageList
                    languages={[language]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );
            fireEvent.click(screen.getByRole("button", { name: /eliminar/i }));
            expect(mockOnDelete).toHaveBeenCalledWith(language);
        });
    });
});
