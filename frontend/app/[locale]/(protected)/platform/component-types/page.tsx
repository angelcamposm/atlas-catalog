"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiCube, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { componentTypesApi } from "@/lib/api/platform";
import type { Component, PaginatedResponse } from "@/types/api";

export default function ComponentTypesPage() {
    const router = useRouter();
    const [componentTypes, setComponentTypes] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadComponentTypes = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: PaginatedResponse<Component> =
                await componentTypesApi.getAll(page);
            setComponentTypes(response.data);
            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError("Failed to load component types");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadComponentTypes(currentPage);
    }, [currentPage, loadComponentTypes]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this component type?")) {
            return;
        }

        try {
            await componentTypesApi.delete(id);
            await loadComponentTypes(currentPage);
        } catch (err) {
            console.error("Failed to delete component type:", err);
            alert("Failed to delete component type");
        }
    };

    if (loading && componentTypes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <HiCube className="h-8 w-8 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Component Types
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage platform component type definitions
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() =>
                        router.push("/platform/component-types/create")
                    }
                    className="flex items-center gap-2"
                >
                    <HiPlus className="h-5 w-5" />
                    Create Component Type
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <Card className="p-6 border-destructive">
                    <div className="flex items-center gap-2 text-destructive">
                        <p>{error}</p>
                    </div>
                </Card>
            )}

            {/* Component Types Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {componentTypes.map((componentType) => (
                    <Card
                        key={componentType.id}
                        className="p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {componentType.name}
                                    </h3>
                                    {componentType.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {componentType.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t">
                                <div>
                                    ID:{" "}
                                    <span className="font-mono">
                                        {componentType.id}
                                    </span>
                                </div>
                                <div>
                                    Created:{" "}
                                    {new Date(
                                        componentType.created_at
                                    ).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.push(
                                            `/platform/component-types/${componentType.id}/edit`
                                        )
                                    }
                                    className="flex-1 flex items-center gap-2"
                                >
                                    <HiPencil className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleDelete(componentType.id)
                                    }
                                    className="text-destructive hover:text-destructive hover:border-destructive"
                                >
                                    <HiTrash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {!loading && componentTypes.length === 0 && (
                <Card className="p-12 text-center">
                    <HiCube className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No component types found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Get started by creating your first component type
                        definition.
                    </p>
                    <Button
                        onClick={() =>
                            router.push("/platform/component-types/create")
                        }
                        className="flex items-center gap-2 mx-auto"
                    >
                        <HiPlus className="h-5 w-5" />
                        Create Component Type
                    </Button>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
