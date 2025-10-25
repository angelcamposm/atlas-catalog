"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { apisApi } from "@/lib/api/apis";
import type { Api, PaginatedApiResponse } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";

export default function ApisPage() {
    const [apis, setApis] = useState<Api[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const t = useTranslations("apis");
    const common = useTranslations("common");

    const loadApis = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: PaginatedApiResponse = await apisApi.getAll(page);
            setApis(response.data);
            setTotalPages(response.meta.last_page);
            setTotalCount(response.meta.total);
        } catch (err) {
            setError(t("errors.load"));
            console.error("Error loading APIs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadApis(currentPage);
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
                                onClick={() => void loadApis(currentPage)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {common("retry")}
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {t("title")}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {common("totalCount", { count: totalCount })}
                    </p>
                </div>

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
                                                common("n_a")}
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

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((page) => Math.max(1, page - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {common("previous")}
                        </button>
                        <span className="px-4 py-2 text-gray-900 dark:text-white">
                            {common("pageSummary", {
                                current: currentPage,
                                total: totalPages,
                            })}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(totalPages, page + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {common("next")}
                        </button>
                    </div>
                )}

                {totalCount === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            {common("noData")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
