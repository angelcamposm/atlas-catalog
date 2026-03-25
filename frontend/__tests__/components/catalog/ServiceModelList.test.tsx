/**
 * Unit tests for ServiceModelList component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceModelList } from "@/components/catalog/ServiceModelList";
import type { ServiceModel } from "@/types/api";

const createMockServiceModel = (
    overrides: Partial<ServiceModel> = {},
): ServiceModel => ({
    id: 1,
    name: "REST",
    description: "RESTful service model",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    created_by: 1,
    updated_by: 1,
    ...overrides,
});

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("ServiceModelList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering", () => {
        it("should render a list of service models", () => {
            const models = [
                createMockServiceModel({ id: 1, name: "REST" }),
                createMockServiceModel({ id: 2, name: "gRPC" }),
            ];

            render(
                <ServiceModelList
                    models={models}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(screen.getByText("REST")).toBeInTheDocument();
            expect(screen.getByText("gRPC")).toBeInTheDocument();
        });

        it("should render description when provided", () => {
            const models = [
                createMockServiceModel({
                    description: "RESTful API service model",
                }),
            ];

            render(
                <ServiceModelList
                    models={models}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(
                screen.getByText("RESTful API service model"),
            ).toBeInTheDocument();
        });

        it("should render empty state when no models", () => {
            render(
                <ServiceModelList
                    models={[]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            expect(
                screen.getByText(/no hay modelos de servicio/i),
            ).toBeInTheDocument();
        });
    });

    describe("Behavior", () => {
        it("should call onEdit when edit button is clicked", () => {
            const model = createMockServiceModel();

            render(
                <ServiceModelList
                    models={[model]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            const editButton = screen.getByRole("button", { name: /editar/i });
            fireEvent.click(editButton);
            expect(mockOnEdit).toHaveBeenCalledWith(model);
        });

        it("should call onDelete when delete button is clicked", () => {
            const model = createMockServiceModel();

            render(
                <ServiceModelList
                    models={[model]}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />,
            );

            const deleteButton = screen.getByRole("button", {
                name: /eliminar/i,
            });
            fireEvent.click(deleteButton);
            expect(mockOnDelete).toHaveBeenCalledWith(model);
        });
    });
});
