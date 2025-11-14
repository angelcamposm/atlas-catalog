"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HiSquares2X2 } from "react-icons/hi2";
import { apisApi } from "@/lib/api/apis";
import type { Api, PaginatedApiResponse } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";

export default function ApisPage() {
    const params = useParams();
    const locale = (params?.locale as string) || "es";
    const [apis, setApis] = useState<Api[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [protocolFilter, setProtocolFilter] = useState<string | "all">("all");

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

    const filteredApis = useMemo(() => {
        return apis.filter((api) => {
            const matchesSearch = search
                ? api.name?.toLowerCase().includes(search.toLowerCase()) ||
                  api.description?.toLowerCase().includes(search.toLowerCase())
                : true;

            const matchesProtocol =
                protocolFilter === "all" || api.protocol === protocolFilter;

            return matchesSearch && matchesProtocol;
        });
    }, [apis, search, protocolFilter]);

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
        <div className="container mx-auto space-y-6 px-6 py-4">
            <PageHeader
                icon={HiSquares2X2}
                title={t("title")}
                subtitle={common("totalCount", { count: totalCount })}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card/70 px-3 py-2 text-sm">
                <div className="flex flex-1 items-center gap-2 min-w-[220px]">
                    <span className="text-xs font-medium text-muted-foreground">
                        {t("filters.searchLabel", { defaultValue: "Buscar" })}
                    </span>
                    <Input
                        placeholder={t("filters.searchPlaceholder", {
                            defaultValue: "Buscar por nombre o descripción",
                        })}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 max-w-xs text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-muted-foreground">
                        {t("filters.protocolLabel", {
                            defaultValue: "Protocolo",
                        })}
                    </span>
                    <select
                        className="h-8 rounded-md border bg-background px-2 text-xs"
                        value={protocolFilter}
                        onChange={(e) =>
                            setProtocolFilter(
                                (e.target.value ||
                                    "all") as typeof protocolFilter
                            )
                        }
                    >
                        <option value="all">
                            {common("all", { defaultValue: "Todos" })}
                        </option>
                        <option value="http">HTTP</option>
                        <option value="https">HTTPS</option>
                    </select>
                </div>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredApis.map((api) => (
                    <Card
                        key={api.id}
                        className="h-full transition hover:border-primary/50 hover:shadow-sm"
                    >
                        <Link href={`/${locale}/apis/${api.id}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold leading-snug">
                                    {api.name}
                                </CardTitle>
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

                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                        <span>ID: {api.id}</span>
                                        {api.version && (
                                            <span>v{api.version}</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Link>
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
    );
}
