"use client";

import { useState, useEffect, useCallback } from "react";
import { GitBranch, Plus, Pencil, Trash2 } from "lucide-react";
import { lifecyclesApi } from "@/lib/api";
import type { Lifecycle, PaginatedLifecycleResponse } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";

export default function LifecyclesPage() {
    const [lifecycles, setLifecycles] = useState<Lifecycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadLifecycles = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: PaginatedLifecycleResponse = await lifecyclesApi.getAll(page);
            setLifecycles(response.data);
            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError("Failed to load lifecycles");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLifecycles(currentPage);
    }, [currentPage, loadLifecycles]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this lifecycle?")) {
            return;
        }

        try {
            await lifecyclesApi.delete(id);
            loadLifecycles(currentPage);
        } catch (err) {
            console.error("Error deleting lifecycle:", err);
            alert("Failed to delete lifecycle");
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
                            <Button onClick={() => loadLifecycles(currentPage)}>
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
                    <GitBranch className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">API Lifecycles</h1>
                        <p className="text-muted-foreground">
                            Manage API lifecycle stages
                        </p>
                    </div>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Lifecycle
                </Button>
            </div>

            {/* Lifecycles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lifecycles.map((lifecycle) => (
                    <Card key={lifecycle.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{lifecycle.name}</span>
                                <Badge variant="secondary">ID: {lifecycle.id}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {lifecycle.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {lifecycle.description}
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
                                        onClick={() => handleDelete(lifecycle.id)}
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
            {lifecycles.length === 0 && (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No lifecycles found
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by creating your first lifecycle stage
                            </p>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Lifecycle
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
