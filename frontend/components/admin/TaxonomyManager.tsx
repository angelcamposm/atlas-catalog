/**
 * Generic CRUD management component for taxonomy entities.
 *
 * Renders a table with inline Edit/Delete actions and a modal form
 * for Create and Update operations. All API interaction is injected
 * via the `api` prop so the component can be reused for any entity.
 *
 * @example
 * <TaxonomyManager
 *   title="API Types"
 *   api={apiTypesApi}
 *   columns={[{ key: "name", label: "Name" }]}
 *   formFields={[{ name: "name", label: "Name", type: "text", required: true }]}
 * />
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import type { PaginatedResponse } from "@/types/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TaxonomyManagerProps<T extends { id: number }> {
    /** Heading shown above the table. */
    title: string;
    /** Optional descriptive text shown below the heading. */
    description?: string;
    /**
     * API module containing the four CRUD methods used by this component.
     * Each method must match the signature described below.
     *
     * Method syntax (rather than arrow syntax) is intentional so TypeScript
     * treats the data parameters bivariantly, allowing concrete request types
     * (e.g. `CreateApiCategoryRequest`) to satisfy this interface.
     */
    api: {
        getAll: (page?: number) => Promise<PaginatedResponse<T>>;
        // eslint-disable-next-line @typescript-eslint/method-signature-style
        create(data: Partial<T>): Promise<{ data: T }>;
        // eslint-disable-next-line @typescript-eslint/method-signature-style
        update(id: number, data: Partial<T>): Promise<{ data: T }>;
        delete: (id: number) => Promise<void>;
    };
    /** Column definitions for the data table. */
    columns: Array<{ key: keyof T; label: string }>;
    /** Form fields shown inside the create / edit modal. */
    formFields: Array<{
        name: string;
        label: string;
        type: "text" | "textarea";
        required?: boolean;
    }>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TaxonomyManager<T extends { id: number }>({
    title,
    description,
    api,
    columns,
    formFields,
}: TaxonomyManagerProps<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [formValues, setFormValues] = useState<Record<string, string>>({});

    // -----------------------------------------------------------------------
    // Data loading
    // -----------------------------------------------------------------------

    const loadItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.getAll();
            setItems(response.data);
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    // -----------------------------------------------------------------------
    // Modal helpers
    // -----------------------------------------------------------------------

    function openCreate() {
        setEditingItem(null);
        setFormValues({});
        setModalOpen(true);
    }

    function openEdit(item: T) {
        setEditingItem(item);
        const initial: Record<string, string> = {};
        for (const field of formFields) {
            const value = (item as Record<string, unknown>)[field.name];
            initial[field.name] = value != null ? String(value) : "";
        }
        setFormValues(initial);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingItem(null);
        setFormValues({});
    }

    // -----------------------------------------------------------------------
    // CRUD handlers
    // -----------------------------------------------------------------------

    async function handleSave() {
        const payload = { ...formValues } as Partial<T>;
        if (editingItem) {
            await api.update(editingItem.id, payload);
        } else {
            await api.create(payload);
        }
        closeModal();
        await loadItems();
    }

    async function handleDelete(item: T) {
        await api.delete(item.id);
        await loadItems();
    }

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {description && (
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Add
                </button>
            </div>

            {/* Table */}
            {isLoading ? (
                <div
                    data-testid="taxonomy-loading"
                    className="flex items-center justify-center py-12"
                    role="status"
                    aria-label="Loading"
                >
                    <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {items.map((item) => (
                                <tr key={item.id}>
                                    {columns.map((col) => {
                                        const value = (
                                            item as Record<string, unknown>
                                        )[String(col.key)];
                                        return (
                                            <td
                                                key={String(col.key)}
                                                className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                                            >
                                                {value != null
                                                    ? String(value)
                                                    : "—"}
                                            </td>
                                        );
                                    })}
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            type="button"
                                            aria-label="Edit"
                                            onClick={() => openEdit(item)}
                                            className="mr-3 text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Delete"
                                            onClick={() => handleDelete(item)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="taxonomy-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                >
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h2
                            id="taxonomy-modal-title"
                            className="mb-4 text-lg font-semibold"
                        >
                            {editingItem ? `Edit ${title}` : `Add ${title}`}
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                            className="space-y-4"
                        >
                            {formFields.map((field) => (
                                <div key={field.name}>
                                    <label
                                        htmlFor={`taxonomy-field-${field.name}`}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {field.label}
                                        {field.required && (
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        )}
                                    </label>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            id={`taxonomy-field-${field.name}`}
                                            name={field.name}
                                            required={field.required}
                                            value={formValues[field.name] ?? ""}
                                            onChange={(e) =>
                                                setFormValues((prev) => ({
                                                    ...prev,
                                                    [field.name]:
                                                        e.target.value,
                                                }))
                                            }
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            id={`taxonomy-field-${field.name}`}
                                            name={field.name}
                                            required={field.required}
                                            value={formValues[field.name] ?? ""}
                                            onChange={(e) =>
                                                setFormValues((prev) => ({
                                                    ...prev,
                                                    [field.name]:
                                                        e.target.value,
                                                }))
                                            }
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
