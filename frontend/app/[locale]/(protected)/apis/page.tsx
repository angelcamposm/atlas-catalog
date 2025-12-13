"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineSquares2X2,
    HiOutlinePlus,
    HiOutlineArrowPath,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from "react-icons/hi2";
import { apisApi } from "@/lib/api/apis";
import { apiTypesApi } from "@/lib/api/api-types";
import { apiStatusesApi } from "@/lib/api/api-extended";
import { lifecyclesApi } from "@/lib/api/lifecycles";
import { groupsApi } from "@/lib/api/groups";
import type { Api, ApiType, ApiStatus, Lifecycle, Group } from "@/types/api";
import { Protocol } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/layout/PageHeader";
import { ApiCard, ApiCardSkeleton } from "@/components/apis/ApiCard";
import { ViewToggle, SortDropdown } from "@/components/apis/ApiList";
import {
    ApiFilters,
    type ApiFiltersState,
    defaultFilters,
} from "@/components/apis/ApiFilters";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type ViewMode = "grid" | "list";
type SortField = "name" | "created_at" | "updated_at" | "version";
type SortOrder = "asc" | "desc";

// ============================================================================
// Main Page Component
// ============================================================================

export default function ApisPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const t = useTranslations("apis");
    const common = useTranslations("common");

    // Data state
    const [apis, setApis] = useState<Api[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filter options data
    const [apiTypes, setApiTypes] = useState<ApiType[]>([]);
    const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
    const [lifecycles, setLifecycles] = useState<Lifecycle[]>([]);
    const [owners, setOwners] = useState<Group[]>([]);

    // View and filter state
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [filters, setFilters] = useState<ApiFiltersState>(defaultFilters);
    const [filtersCollapsed, setFiltersCollapsed] = useState(true);

    // Load APIs
    const loadApis = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apisApi.getAll(page);
            setApis(response.data);
            setTotalPages(response.meta.last_page);
            setTotalCount(response.meta.total);
        } catch (err) {
            setError("Error al cargar las APIs");
            console.error("Error loading APIs:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load filter options
    const loadFilterOptions = useCallback(async () => {
        try {
            const [typesRes, statusesRes, lifecyclesRes, groupsRes] =
                await Promise.all([
                    apiTypesApi.getAll(),
                    apiStatusesApi.getAll(),
                    lifecyclesApi.getAll(),
                    groupsApi.getAll(),
                ]);

            setApiTypes(typesRes.data);
            setApiStatuses(statusesRes.data);
            setLifecycles(lifecyclesRes.data);
            setOwners(groupsRes.data);
        } catch (err) {
            console.error("Error loading filter options:", err);
        }
    }, []);

    // Initial load
    useEffect(() => {
        void loadApis(currentPage);
        void loadFilterOptions();
    }, [currentPage, loadApis, loadFilterOptions]);

    // Filter and sort APIs
    const filteredAndSortedApis = useMemo(() => {
        let result = [...apis];

        // Apply filters
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (api) =>
                    api.name?.toLowerCase().includes(searchLower) ||
                    api.description?.toLowerCase().includes(searchLower) ||
                    api.display_name?.toLowerCase().includes(searchLower)
            );
        }

        if (filters.types.length > 0) {
            result = result.filter(
                (api) => api.type_id && filters.types.includes(api.type_id)
            );
        }

        if (filters.statuses.length > 0) {
            result = result.filter(
                (api) => api.status_id && filters.statuses.includes(api.status_id)
            );
        }

        if (filters.protocols.length > 0) {
            result = result.filter(
                (api) => api.protocol && filters.protocols.includes(api.protocol)
            );
        }

        if (filters.deprecated === "active") {
            result = result.filter((api) => !api.deprecated_at);
        } else if (filters.deprecated === "deprecated") {
            result = result.filter((api) => !!api.deprecated_at);
        }

        // Apply sorting
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case "name":
                    comparison = (a.name || "").localeCompare(b.name || "");
                    break;
                case "created_at":
                    comparison =
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime();
                    break;
                case "updated_at":
                    comparison =
                        new Date(a.updated_at).getTime() -
                        new Date(b.updated_at).getTime();
                    break;
                case "version":
                    comparison = (a.version || "").localeCompare(
                        b.version || "",
                        undefined,
                        { numeric: true }
                    );
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

        return result;
    }, [apis, filters, sortField, sortOrder]);

    // Handlers
    const handleRefresh = useCallback(() => {
        void loadApis(currentPage);
    }, [currentPage, loadApis]);

    const handleApiClick = useCallback(
        (api: Api) => {
            router.push(`/${locale}/apis/${api.id}`);
        },
        [locale, router]
    );

    const handleEditApi = useCallback(
        (api: Api) => {
            router.push(`/${locale}/apis/${api.id}/edit`);
        },
        [locale, router]
    );

    const handleDeleteApi = useCallback((api: Api) => {
        // TODO: Implement delete confirmation modal
        console.log("Delete API:", api.id);
    }, []);

    const handleDuplicateApi = useCallback((api: Api) => {
        // TODO: Implement duplicate functionality
        console.log("Duplicate API:", api.id);
    }, []);

    // Error state
    if (error && apis.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <p className="text-red-600 dark:text-red-400 mb-4">
                                {error}
                            </p>
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageHeader
                    icon={HiOutlineSquares2X2}
                    title={t("title")}
                    subtitle={
                        loading
                            ? "Cargando..."
                            : common("totalCount", { count: totalCount })
                    }
                />

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600",
                            "text-gray-600 dark:text-gray-300",
                            loading && "animate-spin"
                        )}
                        title="Actualizar"
                    >
                        <HiOutlineArrowPath className="w-5 h-5" />
                    </button>

                    <Link
                        href={`/${locale}/apis/create`}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                            "bg-primary-600 hover:bg-primary-700 text-white font-medium"
                        )}
                    >
                        <HiOutlinePlus className="w-5 h-5" />
                        <span className="hidden sm:inline">Nueva API</span>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <ApiFilters
                filters={filters}
                onFiltersChange={setFilters}
                apiTypes={apiTypes}
                apiStatuses={apiStatuses}
                lifecycles={lifecycles}
                owners={owners}
                collapsed={filtersCollapsed}
                onCollapsedChange={setFiltersCollapsed}
            />

            {/* View Controls */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredAndSortedApis.length} de {totalCount} APIs
                </div>

                <div className="flex items-center gap-3">
                    <SortDropdown
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSortFieldChange={setSortField}
                        onSortOrderChange={setSortOrder}
                    />
                    <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                </div>
            </div>

            {/* API Grid/List */}
            {loading ? (
                <div
                    className={cn(
                        viewMode === "grid"
                            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            : "space-y-3"
                    )}
                >
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ApiCardSkeleton key={i} viewMode={viewMode} />
                    ))}
                </div>
            ) : filteredAndSortedApis.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <HiOutlineSquares2X2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No se encontraron APIs
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                        {filters.search ||
                        filters.types.length > 0 ||
                        filters.statuses.length > 0
                            ? "No hay APIs que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda."
                            : "Aún no hay APIs registradas en el catálogo. Comienza creando tu primera API."}
                    </p>
                    {!filters.search && filters.types.length === 0 && (
                        <Link
                            href={`/${locale}/apis/create`}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <HiOutlinePlus className="w-5 h-5" />
                            Crear primera API
                        </Link>
                    )}
                </div>
            ) : (
                <div
                    className={cn(
                        viewMode === "grid"
                            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            : "space-y-3"
                    )}
                >
                    {filteredAndSortedApis.map((api) => (
                        <ApiCard
                            key={api.id}
                            api={api}
                            viewMode={viewMode}
                            locale={locale}
                            onClick={() => handleApiClick(api)}
                            onEdit={() => handleEditApi(api)}
                            onDelete={() => handleDeleteApi(api)}
                            onDuplicate={() => handleDuplicateApi(api)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() =>
                            setCurrentPage((page) => Math.max(1, page - 1))
                        }
                        disabled={currentPage === 1 || loading}
                        className={cn(
                            "flex items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                            "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600",
                            "text-gray-600 dark:text-gray-300",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        <HiOutlineChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">{common("previous")}</span>
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }).map(
                            (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        disabled={loading}
                                        className={cn(
                                            "w-10 h-10 rounded-lg transition-colors font-medium",
                                            pageNum === currentPage
                                                ? "bg-primary-600 text-white"
                                                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                                        )}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                        )}
                    </div>

                    <button
                        onClick={() =>
                            setCurrentPage((page) =>
                                Math.min(totalPages, page + 1)
                            )
                        }
                        disabled={currentPage === totalPages || loading}
                        className={cn(
                            "flex items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                            "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600",
                            "text-gray-600 dark:text-gray-300",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        <span className="hidden sm:inline">{common("next")}</span>
                        <HiOutlineChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
