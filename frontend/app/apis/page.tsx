"use client";

import { useState, useEffect } from "react";
import { apisApi } from "@/lib/api/apis";
import type { Api } from "@/types/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";

export default function ApisPage() {
    const [apis, setApis] = useState<Api[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadApis = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apisApi.getAll(currentPage);
            setApis(response.data);
            setTotalPages(response.last_page || 1);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al cargar las APIs"
            );
            console.error("Error loading APIs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApis();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent>
                        <div className="text-center py-8">
                            <p className="text-red-600 dark:text-red-400 mb-4">
                                {error}
                            </p>
                            <button
                                onClick={() => loadApis()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Reintentar
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        API Catalog
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Total: {apis.length} APIs
                    </p>
                </div>

                {/* APIs Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {apis.map((api) => (
                        <Card key={api.id}>
                            <CardHeader>
                                <CardTitle>{api.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {api.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                            {api.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="primary">
                                            {api.protocol?.toUpperCase() ||
                                                "N/A"}
                                        </Badge>
                                        {api.version && (
                                            <Badge variant="secondary">
                                                v{api.version}
                                            </Badge>
                                        )}
                                    </div>

                                    {api.url && (
                                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                            {api.url}
                                        </p>
                                    )}

                                    <div className="text-xs text-gray-400 dark:text-gray-600">
                                        ID: {api.id}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 text-gray-900 dark:text-white">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </div>
                )}

                {apis.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            No hay APIs disponibles
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
