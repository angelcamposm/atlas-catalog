/**
 * Unit tests for EnvironmentList component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EnvironmentList } from "@/components/infrastructure/EnvironmentList";
import type { Environment } from "@/types/api";

const createMockEnvironment = (
    overrides: Partial<Environment> = {},
): Environment => ({
    id: 1,
    name: "Production",
    label: "prod",
    prefix: null,
    suffix: null,
    description: "Production environment",
    approval_required: true,
    display_in_matrix: true,
    owner_id: null,
    url: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("EnvironmentList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of environments", () => {
            const environments = [
                createMockEnvironment({ id: 1, name: "Production" }),
                createMockEnvironment({ id: 2, name: "Staging" }),
            ];

            render(
                <EnvironmentList
                    environments={environments}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(screen.getByText("Production")).toBeInTheDocument();
            expect(screen.getByText("Staging")).toBeInTheDocument();
        });

        it("should render the label when provided", () => {
            const environments = [
                createMockEnvironment({ label: "prod" }),
            ];

            render(
                <EnvironmentList
                    environments={environments}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(screen.getByText("prod")).toBeInTheDocument();
        });

        it("should show approval badge when approval_required is true", () => {
            const environments = [
                createMockEnvironment({ approval_required: true }),
            ];

            render(
                <EnvironmentList
                    environments={environments}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(
                screen.getByText(/requiere aprobación/i),
            ).toBeInTheDocument();
        });

        it("should render empty state when no environments", () => {
            render(
                <EnvironmentList
                    environments={[]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(
                screen.getByText(/no hay entornos/i),
            ).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onEdit when edit button is clicked", () => {
            const env = createMockEnvironment();

            render(
                <EnvironmentList
                    environments={[env]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            const editButton = screen.getByRole("button", { name: /editar/i });
            fireEvent.click(editButton);
            expect(mockOnEdit).toHaveBeenCalledWith(env);
        });

        it("should call onDelete when delete button is clicked", () => {
            const env = createMockEnvironment();

            render(
                <EnvironmentList
                    environments={[env]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            const deleteButton = screen.getByRole("button", {
                name: /eliminar/i,
            });
            fireEvent.click(deleteButton);
            expect(mockOnDelete).toHaveBeenCalledWith(env);
        });
    });
});
