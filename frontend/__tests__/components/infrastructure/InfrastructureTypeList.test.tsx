/**
 * Unit tests for InfrastructureTypeList component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InfrastructureTypeList } from "@/components/infrastructure/InfrastructureTypeList";
import type { InfrastructureType } from "@/types/api";

const createMockInfrastructureType = (
    overrides: Partial<InfrastructureType> = {}
): InfrastructureType => ({
    id: 1,
    name: "On-Premise",
    description: "On-premise infrastructure",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("InfrastructureTypeList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of infrastructure types", () => {
            const types = [
                createMockInfrastructureType({ id: 1, name: "On-Premise" }),
                createMockInfrastructureType({ id: 2, name: "Cloud" }),
            ];

            render(
                <InfrastructureTypeList
                    infrastructureTypes={types}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.getByText("On-Premise")).toBeInTheDocument();
            expect(screen.getByText("Cloud")).toBeInTheDocument();
        });

        it("should render description when provided", () => {
            const types = [
                createMockInfrastructureType({
                    description: "Physical servers",
                }),
            ];

            render(
                <InfrastructureTypeList
                    infrastructureTypes={types}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.getByText("Physical servers")).toBeInTheDocument();
        });

        it("should render dash when description is missing", () => {
            const types = [
                createMockInfrastructureType({ description: null }),
            ];

            render(
                <InfrastructureTypeList
                    infrastructureTypes={types}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.getByText("—")).toBeInTheDocument();
        });

        it("should show empty state when no infrastructure types", () => {
            render(
                <InfrastructureTypeList
                    infrastructureTypes={[]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            expect(
                screen.getByText(/no infrastructure types/i)
            ).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onEdit when edit button is clicked", () => {
            const type = createMockInfrastructureType({ name: "On-Premise" });

            render(
                <InfrastructureTypeList
                    infrastructureTypes={[type]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: /edit/i }));
            expect(mockOnEdit).toHaveBeenCalledWith(type);
        });

        it("should call onDelete when delete button is clicked", () => {
            const type = createMockInfrastructureType({ name: "On-Premise" });

            render(
                <InfrastructureTypeList
                    infrastructureTypes={[type]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            fireEvent.click(screen.getByRole("button", { name: /delete/i }));
            expect(mockOnDelete).toHaveBeenCalledWith(type);
        });
    });
});
