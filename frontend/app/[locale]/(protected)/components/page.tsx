"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineCube } from "react-icons/hi2";
import { componentsApi, componentTypesApi } from "@/lib/api/components";
import { lifecyclesApi } from "@/lib/api/lifecycles";
import type { Component, ComponentType, Lifecycle } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import {
    ComponentList,
    ComponentsToolbar,
    type ComponentFilters,
    defaultComponentFilters,
} from "@/components/catalog";

// ============================================================================
// Main Page Component
// ============================================================================

export default function ComponentsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const common = useTranslations("common");

    // Data state
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filter options data
    const [componentTypes, setComponentTypes] = useState<ComponentType[]>([]);
    const [lifecycles, setLifecycles] = useState<Lifecycle[]>([]);
    const [tiers, setTiers] = useState<{ id: number; name: string }[]>([]);
    const [operationalStatuses, setOperationalStatuses] = useState<
        { id: number; name: string }[]
    >([]);
    const [criticalities, setCriticalities] = useState<
        { id: number; name: string }[]
    >([]);

    // Filter state
    const [filters, setFilters] = useState<ComponentFilters>(
        defaultComponentFilters
    );

    // Load components
    const loadComponents = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await componentsApi.getAll({ page });
            setComponents(response.data);
            setTotalPages(response.meta?.last_page || 1);
            setTotalCount(response.meta?.total || response.data.length);
        } catch (err) {
            setError("Error al cargar los componentes");
            console.error("Error loading components:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load filter options
    const loadFilterOptions = useCallback(async () => {
        try {
            const [typesRes, lifecyclesRes] = await Promise.all([
                componentTypesApi.getAll(),
                lifecyclesApi.getAll(),
            ]);

            setComponentTypes(typesRes.data);
            setLifecycles(lifecyclesRes.data);

            // Static tiers (could be loaded from API if available)
            setTiers([
                { id: 1, name: "Tier 1 - Crítico" },
                { id: 2, name: "Tier 2 - Alto" },
                { id: 3, name: "Tier 3 - Medio" },
                { id: 4, name: "Tier 4 - Bajo" },
            ]);

            // Static operational statuses
            setOperationalStatuses([
                { id: 1, name: "Operativo" },
                { id: 2, name: "Degradado" },
                { id: 3, name: "En mantenimiento" },
                { id: 4, name: "Fuera de servicio" },
            ]);

            // Static criticalities
            setCriticalities([
                { id: 1, name: "Crítica" },
                { id: 2, name: "Alta" },
                { id: 3, name: "Media" },
                { id: 4, name: "Baja" },
            ]);
        } catch (err) {
            console.error("Error loading filter options:", err);
        }
    }, []);

    // Initial load
    useEffect(() => {
        void loadComponents(currentPage);
        void loadFilterOptions();
    }, [currentPage, loadComponents, loadFilterOptions]);

    // Filter and sort components
    const filteredComponents = useMemo(() => {
        let result = [...components];

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (component) =>
                    component.name?.toLowerCase().includes(searchLower) ||
                    component.description
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    component.display_name
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    component.slug?.toLowerCase().includes(searchLower)
            );
        }

        // Apply type filter
        if (filters.typeId !== null) {
            result = result.filter(
                (component) => component.type_id === filters.typeId
            );
        }

        // Apply lifecycle filter
        if (filters.lifecycleId !== null) {
            result = result.filter(
                (component) => component.lifecycle_id === filters.lifecycleId
            );
        }

        // Apply tier filter
        if (filters.tierId !== null) {
            result = result.filter(
                (component) => component.tier_id === filters.tierId
            );
        }

        // Apply operational status filter
        if (filters.operationalStatusId !== null) {
            result = result.filter(
                (component) =>
                    component.operational_status_id ===
                    filters.operationalStatusId
            );
        }

        // Apply criticality filter
        if (filters.criticalityId !== null) {
            result = result.filter(
                (component) =>
                    component.criticality_id === filters.criticalityId
            );
        }

        // Apply stateless filter
        if (filters.isStateless !== null) {
            result = result.filter(
                (component) => component.is_stateless === filters.isStateless
            );
        }

        return result;
    }, [components, filters]);

    // Handlers
    const handleRefresh = useCallback(() => {
        void loadComponents(currentPage);
    }, [currentPage, loadComponents]);

    const handleComponentClick = useCallback(
        (component: Component) => {
            router.push(`/${locale}/components/${component.id}`);
        },
        [locale, router]
    );

    const handleEditComponent = useCallback(
        (component: Component) => {
            router.push(`/${locale}/components/${component.id}/edit`);
        },
        [locale, router]
    );

    const handleDeleteComponent = useCallback((component: Component) => {
        // TODO: Implement delete confirmation modal
        console.log("Delete component:", component.id);
    }, []);

    const handleDuplicateComponent = useCallback((component: Component) => {
        // TODO: Implement duplicate functionality
        console.log("Duplicate component:", component.id);
    }, []);

    // Pagination handlers
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Error state
    if (error && components.length === 0) {
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
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Componentes"
                subtitle="Catálogo de componentes de la plataforma"
                icon={HiOutlineCube}
            />

            {/* Toolbar with filters */}
            <ComponentsToolbar
                locale={locale}
                filters={filters}
                onFiltersChange={setFilters}
                totalCount={totalCount}
                filteredCount={filteredComponents.length}
                componentTypes={componentTypes}
                lifecycles={lifecycles}
                tiers={tiers}
                operationalStatuses={operationalStatuses}
                criticalities={criticalities}
                showCreate={true}
                showExport={true}
                components={filteredComponents}
            />

            {/* Component List */}
            <ComponentList
                components={filteredComponents}
                locale={locale}
                loading={loading}
                searchQuery={filters.search}
                onClick={handleComponentClick}
                onEdit={handleEditComponent}
                onDelete={handleDeleteComponent}
                onDuplicate={handleDuplicateComponent}
                componentTypes={componentTypes}
                lifecycles={lifecycles}
                tiers={tiers}
                operationalStatuses={operationalStatuses}
                columns={3}
                showViewToggle={true}
                showSort={true}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4 border-t">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
