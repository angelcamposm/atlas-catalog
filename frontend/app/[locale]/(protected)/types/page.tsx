"use client";

import { useState, useEffect, useCallback } from "react";
import { Tag, Plus, Pencil, Trash2 } from "lucide-react";
import { apiTypesApi } from "@/lib/api";
import type { ApiType, PaginatedApiTypeResponse } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";

export default function TypesPage() {
    const [apiTypes, setApiTypes] = useState<ApiType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadApiTypes = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: PaginatedApiTypeResponse = await apiTypesApi.getAll(page);
            setApiTypes(response.data);
            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError("Failed to load API types");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadApiTypes(currentPage);
    }, [currentPage, loadApiTypes]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this API type?")) {
            return;
        }

        try {
            await apiTypesApi.delete(id);
            loadApiTypes(currentPage);
        } catch (err) {
            console.error("Error deleting API type:", err);
            alert("Failed to delete API type");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md">
                    <CardContent>
                        <div className="text-center py-8">
                            <p className="text-red-600 dark:text-red-400 mb-4">
                                {error}
                            </p>
                            <Button onClick={() => loadApiTypes(currentPage)}>
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Tag className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">API Types</h1>
                        <p className="text-muted-foreground">
                            Manage different types of APIs
                        </p>
                    </div>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Type
                </Button>
            </div>

            {/* API Types Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apiTypes.map((apiType) => (
                    <Card key={apiType.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{apiType.name}</span>
                                <Badge variant="secondary">ID: {apiType.id}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {apiType.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {apiType.description}
                                    </p>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <Pencil className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(apiType.id)}
                                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {apiTypes.length === 0 && (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No API types found
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by creating your first API type
                            </p>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create API Type
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm">
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
