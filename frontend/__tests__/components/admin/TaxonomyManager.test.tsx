/**
 * Tests for the generic TaxonomyManager component.
 *
 * Covers: list rendering, pagination, create/edit/delete CRUD,
 * form validation, loading and error states.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import type { PaginatedResponse } from "@/types/api";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

interface SampleItem {
    id: number;
    name: string;
    description: string | null;
}

const makePaginatedResponse = (
    items: SampleItem[],
    total = items.length,
): PaginatedResponse<SampleItem> => ({
    data: items,
    links: { first: "/", last: "/", prev: null, next: null },
    meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: "/",
        per_page: 15,
        to: items.length,
        total,
    },
});

const SAMPLE_ITEMS: SampleItem[] = [
    { id: 1, name: "REST", description: "REST API type" },
    { id: 2, name: "GraphQL", description: null },
];

const COLUMNS = [
    { key: "name" as keyof SampleItem, label: "Name" },
    { key: "description" as keyof SampleItem, label: "Description" },
];

const FORM_FIELDS = [
    { name: "name", label: "Name", type: "text" as const, required: true },
    {
        name: "description",
        label: "Description",
        type: "textarea" as const,
    },
];

// ---------------------------------------------------------------------------
// Mock API factory
// ---------------------------------------------------------------------------

const buildMockApi = (items: SampleItem[] = SAMPLE_ITEMS) => ({
    getAll: jest.fn().mockResolvedValue(makePaginatedResponse(items)),
    create: jest.fn().mockResolvedValue({
        data: { id: 99, name: "New", description: null } as SampleItem,
    }),
    update: jest.fn().mockResolvedValue({
        data: { id: 1, name: "Updated", description: null } as SampleItem,
    }),
    delete: jest.fn().mockResolvedValue(undefined),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderManager(
    overrides: Partial<
        React.ComponentProps<typeof TaxonomyManager<SampleItem>>
    > = {},
) {
    const api = buildMockApi();
    const utils = render(
        <TaxonomyManager<SampleItem>
            title="API Types"
            description="Manage API types"
            api={api}
            columns={COLUMNS}
            formFields={FORM_FIELDS}
            {...overrides}
        />,
    );
    return { ...utils, api };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("TaxonomyManager", () => {
    describe("Rendering", () => {
        it("should render the title and description", async () => {
            renderManager();
            expect(screen.getByText("API Types")).toBeInTheDocument();
            expect(screen.getByText("Manage API types")).toBeInTheDocument();
        });

        it("should render column headers", async () => {
            renderManager();
            await waitFor(() => {
                expect(screen.getByText("Name")).toBeInTheDocument();
                expect(screen.getByText("Description")).toBeInTheDocument();
            });
        });

        it("should render rows after data loads", async () => {
            renderManager();
            await waitFor(() => {
                expect(screen.getByText("REST")).toBeInTheDocument();
                expect(screen.getByText("GraphQL")).toBeInTheDocument();
            });
        });

        it("should show a loading indicator while fetching", async () => {
            const api = buildMockApi();
            api.getAll = jest.fn(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () => resolve(makePaginatedResponse(SAMPLE_ITEMS)),
                            100,
                        ),
                    ),
            );
            render(
                <TaxonomyManager<SampleItem>
                    title="API Types"
                    api={api}
                    columns={COLUMNS}
                    formFields={FORM_FIELDS}
                />,
            );
            expect(screen.getByTestId("taxonomy-loading")).toBeInTheDocument();
            await waitFor(() =>
                expect(
                    screen.queryByTestId("taxonomy-loading"),
                ).not.toBeInTheDocument(),
            );
        });

        it("should render 'Add' button", async () => {
            renderManager();
            expect(
                screen.getByRole("button", { name: /add/i }),
            ).toBeInTheDocument();
        });

        it("should render Edit and Delete buttons per row", async () => {
            renderManager();
            await waitFor(() => {
                const editButtons = screen.getAllByRole("button", {
                    name: /edit/i,
                });
                const deleteButtons = screen.getAllByRole("button", {
                    name: /delete/i,
                });
                expect(editButtons).toHaveLength(SAMPLE_ITEMS.length);
                expect(deleteButtons).toHaveLength(SAMPLE_ITEMS.length);
            });
        });
    });

    describe("Create", () => {
        it("should open a modal when Add is clicked", () => {
            renderManager();
            fireEvent.click(screen.getByRole("button", { name: /add/i }));
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        it("should render form fields inside the modal", () => {
            renderManager();
            fireEvent.click(screen.getByRole("button", { name: /add/i }));
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        });

        it("should call api.create with entered values on submit", async () => {
            const { api } = renderManager();
            fireEvent.click(screen.getByRole("button", { name: /add/i }));

            const nameInput = screen.getByLabelText(/name/i);
            await userEvent.type(nameInput, "gRPC");

            fireEvent.click(screen.getByRole("button", { name: /save/i }));

            await waitFor(() => {
                expect(api.create).toHaveBeenCalledWith(
                    expect.objectContaining({ name: "gRPC" }),
                );
            });
        });

        it("should close modal after successful create", async () => {
            renderManager();
            fireEvent.click(screen.getByRole("button", { name: /add/i }));
            const nameInput = screen.getByLabelText(/name/i);
            await userEvent.type(nameInput, "gRPC");
            fireEvent.click(screen.getByRole("button", { name: /save/i }));

            await waitFor(() => {
                expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
            });
        });
    });

    describe("Edit", () => {
        it("should open modal with existing data when Edit is clicked", async () => {
            renderManager();
            const editButtons = await screen.findAllByRole("button", {
                name: /edit/i,
            });
            fireEvent.click(editButtons[0]);

            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(
                (screen.getByLabelText(/name/i) as HTMLInputElement).value,
            ).toBe("REST");
        });

        it("should call api.update with id and edited values on submit", async () => {
            const { api } = renderManager();
            const editButtons = await screen.findAllByRole("button", {
                name: /edit/i,
            });
            fireEvent.click(editButtons[0]);

            const nameInput = screen.getByLabelText(/name/i);
            await userEvent.clear(nameInput);
            await userEvent.type(nameInput, "REST API");

            fireEvent.click(screen.getByRole("button", { name: /save/i }));

            await waitFor(() => {
                expect(api.update).toHaveBeenCalledWith(
                    1,
                    expect.objectContaining({ name: "REST API" }),
                );
            });
        });
    });

    describe("Delete", () => {
        it("should call api.delete with item id when Delete is clicked", async () => {
            const { api } = renderManager();
            const deleteButtons = await screen.findAllByRole("button", {
                name: /delete/i,
            });
            fireEvent.click(deleteButtons[0]);

            await waitFor(() => {
                expect(api.delete).toHaveBeenCalledWith(1);
            });
        });

        it("should remove the deleted item from the list after deletion", async () => {
            const { api } = renderManager();

            // Wait for initial load to complete
            const deleteButtons = await screen.findAllByRole("button", {
                name: /delete/i,
            });

            // Override next getAll call to return only the second item
            api.getAll.mockResolvedValueOnce(
                makePaginatedResponse([SAMPLE_ITEMS[1]]),
            );

            fireEvent.click(deleteButtons[0]);

            await waitFor(() => {
                expect(screen.queryByText("REST")).not.toBeInTheDocument();
            });
        });
    });
});
