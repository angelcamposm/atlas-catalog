"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
    HiOutlineCircleStack,
    HiOutlinePlus,
    HiOutlineArrowPath,
    HiOutlineMagnifyingGlass,
    HiOutlineSquares2X2,
    HiOutlineListBullet,
    HiOutlineArrowsUpDown,
} from "react-icons/hi2";
import { lifecyclesApi } from "@/lib/api/lifecycles";
import type { Lifecycle } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import {
    LifecycleCard,
    LifecycleCardSkeleton,
    LifecycleFormModal,
    type LifecycleFormData,
} from "@/components/lifecycles";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type ViewMode = "grid" | "list";
type SortField = "name" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";

// ============================================================================
// Example Data (fallback when backend is empty)
// ============================================================================

const exampleLifecycles: Lifecycle[] = [
    {
        id: 1,
        name: "Development",
        description: "Fase inicial de desarrollo. APIs en construcción, sujetas a cambios frecuentes. No usar en producción.",
        color: "blue",
        approval_required: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 2,
        name: "Testing",
        description: "Fase de pruebas y QA. La API está siendo probada internamente. Puede contener bugs conocidos.",
        color: "yellow",
        approval_required: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 3,
        name: "Staging",
        description: "Pre-producción. La API está casi lista para producción. Requiere aprobación para ser promovida.",
        color: "orange",
        approval_required: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 4,
        name: "Production",
        description: "En producción. API estable y disponible para consumo. Cambios requieren proceso de aprobación riguroso.",
        color: "green",
        approval_required: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 5,
        name: "Deprecated",
        description: "API obsoleta. Se recomienda migrar a una versión más reciente. Soporte limitado disponible.",
        color: "red",
        approval_required: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 6,
        name: "Retired",
        description: "API retirada. Ya no está disponible para uso. Toda la funcionalidad ha sido migrada o eliminada.",
        color: "gray",
        approval_required: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 7,
        name: "Beta",
        description: "Versión beta para usuarios seleccionados. Funcionalidad casi completa pero puede tener cambios menores.",
        color: "purple",
        approval_required: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 8,
        name: "Preview",
        description: "Vista previa de próximas características. Solo para evaluación, no para uso en producción.",
        color: "indigo",
        approval_required: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
];

// Mock component counts per lifecycle
const mockComponentCounts: Record<number, number> = {
    1: 15, // Development
    2: 8,  // Testing
    3: 4,  // Staging
    4: 32, // Production
    5: 6,  // Deprecated
    6: 3,  // Retired
    7: 2,  // Beta
    8: 5,  // Preview
};

// ============================================================================
// Sort Options
// ============================================================================

const sortOptions: Array<{ field: SortField; label: string }> = [
    { field: "name", label: "Nombre" },
    { field: "created_at", label: "Fecha creación" },
    { field: "updated_at", label: "Última actualización" },
];

// ============================================================================
// Main Page Component
// ============================================================================

export default function LifecyclesPage() {
    const params = useParams();
    const locale = (params?.locale as string) || "es";
    const common = useTranslations("common");

    // Data state
    const [lifecycles, setLifecycles] = useState<Lifecycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [useExampleData, setUseExampleData] = useState(false);

    // View state
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingLifecycle, setEditingLifecycle] = useState<Lifecycle | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load Lifecycles
    const loadLifecycles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await lifecyclesApi.getAll();

            if (response.data.length === 0) {
                // If no data from backend, use examples
                setLifecycles(exampleLifecycles);
                setUseExampleData(true);
            } else {
                setLifecycles(response.data);
                setUseExampleData(false);
            }
        } catch (err) {
            console.error("Error loading Lifecycles:", err);
            // On error, use example data
            setLifecycles(exampleLifecycles);
            setUseExampleData(true);
            setError("No se pudo conectar al backend. Mostrando datos de ejemplo.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        void loadLifecycles();
    }, [loadLifecycles]);

    // Filter and sort
    const filteredAndSortedLifecycles = useMemo(() => {
        let result = [...lifecycles];

        // Filter by search
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            result = result.filter(
                (lifecycle) =>
                    lifecycle.name.toLowerCase().includes(searchLower) ||
                    lifecycle.description?.toLowerCase().includes(searchLower)
            );
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
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
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

        return result;
    }, [lifecycles, searchQuery, sortField, sortOrder]);

    // Handlers
    const handleRefresh = useCallback(() => {
        void loadLifecycles();
    }, [loadLifecycles]);

    const handleCreate = useCallback(
        async (data: LifecycleFormData) => {
            if (useExampleData) {
                // Simulate creation with example data
                const newLifecycle: Lifecycle = {
                    id: Math.max(...lifecycles.map((l) => l.id)) + 1,
                    name: data.name,
                    description: data.description,
                    color: data.color,
                    approval_required: data.approval_required,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by: 1,
                    updated_by: 1,
                };
                setLifecycles((prev) => [...prev, newLifecycle]);
                setShowCreateModal(false);
                return;
            }

            try {
                setIsSubmitting(true);
                await lifecyclesApi.create({
                    name: data.name,
                    color: data.color,
                    description: data.description || undefined,
                    approval_required: data.approval_required,
                });
                await loadLifecycles();
                setShowCreateModal(false);
            } catch (err) {
                console.error("Error creating Lifecycle:", err);
            } finally {
                setIsSubmitting(false);
            }
        },
        [lifecycles, loadLifecycles, useExampleData]
    );

    const handleUpdate = useCallback(
        async (data: LifecycleFormData) => {
            if (!editingLifecycle) return;

            if (useExampleData) {
                // Simulate update with example data
                setLifecycles((prev) =>
                    prev.map((l) =>
                        l.id === editingLifecycle.id
                            ? {
                                  ...l,
                                  name: data.name,
                                  color: data.color,
                                  description: data.description,
                                  approval_required: data.approval_required,
                                  updated_at: new Date().toISOString(),
                              }
                            : l
                    )
                );
                setEditingLifecycle(null);
                return;
            }

            try {
                setIsSubmitting(true);
                await lifecyclesApi.update(editingLifecycle.id, {
                    name: data.name,
                    color: data.color,
                    description: data.description || undefined,
                    approval_required: data.approval_required,
                });
                await loadLifecycles();
                setEditingLifecycle(null);
            } catch (err) {
                console.error("Error updating Lifecycle:", err);
            } finally {
                setIsSubmitting(false);
            }
        },
        [editingLifecycle, loadLifecycles, useExampleData]
    );

    const handleDelete = useCallback(
        async (lifecycle: Lifecycle) => {
            if (
                !confirm(
                    `¿Estás seguro de que deseas eliminar "${lifecycle.name}"?`
                )
            ) {
                return;
            }

            if (useExampleData) {
                // Simulate deletion with example data
                setLifecycles((prev) => prev.filter((l) => l.id !== lifecycle.id));
                return;
            }

            try {
                await lifecyclesApi.delete(lifecycle.id);
                await loadLifecycles();
            } catch (err) {
                console.error("Error deleting Lifecycle:", err);
            }
        },
        [loadLifecycles, useExampleData]
    );

    const handleSortSelect = (field: SortField) => {
        if (field === sortField) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
        setShowSortDropdown(false);
    };

    const currentSortLabel =
        sortOptions.find((o) => o.field === sortField)?.label || "Ordenar";

    // Error state (full page)
    if (error && lifecycles.length === 0 && !useExampleData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <p className="text-red-600 dark:text-red-400 mb-4">
                                {error}
                            </p>
                            <Button onClick={handleRefresh}>
                                {common("retry")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Sticky Toolbar */}
            <div className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 gap-4">
                {/* Left side - Search + Stats */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Quick Search */}
                    <div className="relative flex-1 max-w-xs">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar estados..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm bg-muted/50 border-0 rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Stats */}
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {filteredAndSortedLifecycles.length} de {lifecycles.length}
                    </span>

                    {useExampleData && (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Datos de ejemplo
                        </span>
                    )}
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    {/* Refresh */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <HiOutlineArrowPath
                            className={cn(
                                "h-4 w-4",
                                loading && "animate-spin"
                            )}
                        />
                    </Button>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="gap-2"
                        >
                            <HiOutlineArrowsUpDown className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                {currentSortLabel}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {sortOrder === "asc" ? "↑" : "↓"}
                            </span>
                        </Button>

                        {showSortDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowSortDropdown(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-20 py-1">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.field}
                                            onClick={() =>
                                                handleSortSelect(option.field)
                                            }
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors",
                                                sortField === option.field &&
                                                    "bg-muted"
                                            )}
                                        >
                                            <span>{option.label}</span>
                                            {sortField === option.field && (
                                                <span className="text-xs text-muted-foreground">
                                                    {sortOrder === "asc"
                                                        ? "↑"
                                                        : "↓"}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-1.5 transition-colors",
                                viewMode === "grid"
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                            )}
                        >
                            <HiOutlineSquares2X2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "p-1.5 transition-colors",
                                viewMode === "list"
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                            )}
                        >
                            <HiOutlineListBullet className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Create Button */}
                    <Button
                        size="sm"
                        onClick={() => setShowCreateModal(true)}
                        className="gap-2"
                    >
                        <HiOutlinePlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nuevo Estado</span>
                    </Button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto space-y-6 px-6 py-4">
                    {/* Page Title */}
                    <PageHeader
                        icon={HiOutlineCircleStack}
                        title="Ciclos de Vida"
                        subtitle={
                            loading
                                ? "Cargando..."
                                : `${lifecycles.length} estados definidos`
                        }
                    />

                    {/* Info Card */}
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <HiOutlineCircleStack className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-blue-900 dark:text-blue-100">
                                Estados del Ciclo de Vida
                            </p>
                            <p className="text-blue-700 dark:text-blue-300 mt-1">
                                Los estados definen las etapas por las que pasa un componente o API durante su desarrollo.
                                Algunos estados pueden requerir aprobación antes de la transición.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div
                            className={cn(
                                viewMode === "grid"
                                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    : "space-y-3"
                            )}
                        >
                            {Array.from({ length: 8 }).map((_, i) => (
                                <LifecycleCardSkeleton key={i} viewMode={viewMode} />
                            ))}
                        </div>
                    ) : filteredAndSortedLifecycles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <HiOutlineCircleStack className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No se encontraron estados
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                                {searchQuery
                                    ? "No hay estados que coincidan con la búsqueda. Intenta con otros términos."
                                    : "Aún no hay estados de ciclo de vida definidos. Comienza creando el primero."}
                            </p>
                            {!searchQuery && (
                                <Button onClick={() => setShowCreateModal(true)}>
                                    <HiOutlinePlus className="w-5 h-5 mr-2" />
                                    Crear primer estado
                                </Button>
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
                            {filteredAndSortedLifecycles.map((lifecycle) => (
                                <LifecycleCard
                                    key={lifecycle.id}
                                    lifecycle={lifecycle}
                                    locale={locale}
                                    viewMode={viewMode}
                                    componentsCount={
                                        mockComponentCounts[lifecycle.id] || 0
                                    }
                                    onEdit={(l) => setEditingLifecycle(l)}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            <LifecycleFormModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                mode="create"
                onSubmit={handleCreate}
                isLoading={isSubmitting}
            />

            {/* Edit Modal */}
            <LifecycleFormModal
                isOpen={!!editingLifecycle}
                onClose={() => setEditingLifecycle(null)}
                mode="edit"
                initialData={editingLifecycle || undefined}
                onSubmit={handleUpdate}
                isLoading={isSubmitting}
            />
        </div>
    );
}
