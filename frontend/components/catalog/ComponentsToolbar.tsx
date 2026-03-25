"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    HiPlus,
    HiMagnifyingGlass,
    HiFunnel,
    HiXMark,
    HiArrowDownTray,
    HiChevronDown,
    HiOutlineDocumentText,
    HiOutlineTableCells,
} from "react-icons/hi2";
import type { Component, ComponentType, Lifecycle } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ComponentFilters {
    search: string;
    typeId: number | null;
    lifecycleId: number | null;
    tierId: number | null;
    operationalStatusId: number | null;
    criticalityId: number | null;
    isStateless: boolean | null;
}

export interface ComponentsToolbarProps {
    /** Current locale */
    locale: string;
    /** Current filters */
    filters: ComponentFilters;
    /** Filter change callback */
    onFiltersChange: (filters: ComponentFilters) => void;
    /** Total components count */
    totalCount?: number;
    /** Filtered components count */
    filteredCount?: number;
    /** Available component types for filter */
    componentTypes?: ComponentType[];
    /** Available lifecycles for filter */
    lifecycles?: Lifecycle[];
    /** Available tiers for filter */
    tiers?: { id: number; name: string }[];
    /** Available operational statuses for filter */
    operationalStatuses?: { id: number; name: string }[];
    /** Available criticalities for filter */
    criticalities?: { id: number; name: string }[];
    /** Show create button */
    showCreate?: boolean;
    /** Show export button */
    showExport?: boolean;
    /** Components data for export */
    components?: Component[];
    /** Additional className */
    className?: string;
}

// ============================================================================
// Default Filters
// ============================================================================

export const defaultComponentFilters: ComponentFilters = {
    search: "",
    typeId: null,
    lifecycleId: null,
    tierId: null,
    operationalStatusId: null,
    criticalityId: null,
    isStateless: null,
};

// ============================================================================
// Filter Badge
// ============================================================================

function FilterBadge({
    label,
    onRemove,
}: {
    label: string;
    onRemove: () => void;
}) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
            {label}
            <button
                onClick={onRemove}
                className="hover:bg-primary/20 rounded-full p-0.5"
            >
                <HiXMark className="h-3 w-3" />
            </button>
        </span>
    );
}

// ============================================================================
// Export Functions
// ============================================================================

function componentsToJSON(components: Component[]): string {
    return JSON.stringify(components, null, 2);
}

function componentsToCSV(components: Component[]): string {
    const headers = [
        "ID",
        "Nombre",
        "Slug",
        "Display Name",
        "Descripción",
        "Type ID",
        "Lifecycle ID",
        "Tier ID",
        "Stateless",
        "Zero Downtime",
        "Creado",
        "Actualizado",
    ];

    const rows = components.map((c) => [
        c.id,
        c.name || "",
        c.slug || "",
        c.display_name || "",
        (c.description || "").replace(/"/g, '""'),
        c.type_id || "",
        c.lifecycle_id || "",
        c.tier_id || "",
        c.is_stateless ? "Sí" : "No",
        c.has_zero_downtime_deployment ? "Sí" : "No",
        c.created_at || "",
        c.updated_at || "",
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
}

function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ============================================================================
// Main Component
// ============================================================================

export function ComponentsToolbar({
    locale,
    filters,
    onFiltersChange,
    totalCount = 0,
    filteredCount = 0,
    componentTypes = [],
    lifecycles = [],
    tiers = [],
    operationalStatuses = [],
    criticalities = [],
    showCreate = true,
    showExport = true,
    components = [],
    className,
}: ComponentsToolbarProps) {
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);

    // Close export menu on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                exportRef.current &&
                !exportRef.current.contains(event.target as Node)
            ) {
                setShowExportMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateFilter = (
        key: keyof ComponentFilters,
        value: string | number | boolean | null
    ) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFiltersChange(defaultComponentFilters);
    };

    const hasActiveFilters =
        filters.typeId !== null ||
        filters.lifecycleId !== null ||
        filters.tierId !== null ||
        filters.operationalStatusId !== null ||
        filters.criticalityId !== null ||
        filters.isStateless !== null;

    const activeFilterCount = [
        filters.typeId,
        filters.lifecycleId,
        filters.tierId,
        filters.operationalStatusId,
        filters.criticalityId,
        filters.isStateless,
    ].filter((f) => f !== null).length;

    const handleExport = (format: "json" | "csv") => {
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `components-${timestamp}`;

        if (format === "json") {
            downloadFile(
                componentsToJSON(components),
                `${filename}.json`,
                "application/json"
            );
        } else {
            downloadFile(
                componentsToCSV(components),
                `${filename}.csv`,
                "text/csv"
            );
        }

        setShowExportMenu(false);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Main toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar componentes..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    {filters.search && (
                        <button
                            onClick={() => updateFilter("search", "")}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <HiXMark className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                    )}
                </div>

                {/* Filter toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors",
                        showFilters || hasActiveFilters
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background hover:bg-muted"
                    )}
                >
                    <HiFunnel className="h-4 w-4" />
                    <span>Filtros</span>
                    {activeFilterCount > 0 && (
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Export */}
                {showExport && components.length > 0 && (
                    <div className="relative" ref={exportRef}>
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border bg-background hover:bg-muted text-sm transition-colors"
                        >
                            <HiArrowDownTray className="h-4 w-4" />
                            <span>Exportar</span>
                            <HiChevronDown className="h-4 w-4" />
                        </button>

                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover shadow-lg z-20 py-1">
                                <button
                                    onClick={() => handleExport("json")}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                >
                                    <HiOutlineDocumentText className="h-4 w-4 text-blue-500" />
                                    Exportar JSON
                                </button>
                                <button
                                    onClick={() => handleExport("csv")}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                >
                                    <HiOutlineTableCells className="h-4 w-4 text-green-500" />
                                    Exportar CSV
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Create button */}
                {showCreate && (
                    <button
                        onClick={() =>
                            router.push(`/${locale}/components/create`)
                        }
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors"
                    >
                        <HiPlus className="h-4 w-4" />
                        <span>Nuevo</span>
                    </button>
                )}
            </div>

            {/* Filter panel */}
            {showFilters && (
                <div className="p-4 rounded-lg border bg-muted/30 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {/* Type filter */}
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                Tipo
                            </label>
                            <select
                                value={filters.typeId || ""}
                                onChange={(e) =>
                                    updateFilter(
                                        "typeId",
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null
                                    )
                                }
                                className="w-full px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Todos</option>
                                {componentTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Lifecycle filter */}
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                Ciclo de Vida
                            </label>
                            <select
                                value={filters.lifecycleId || ""}
                                onChange={(e) =>
                                    updateFilter(
                                        "lifecycleId",
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null
                                    )
                                }
                                className="w-full px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Todos</option>
                                {lifecycles.map((lc) => (
                                    <option key={lc.id} value={lc.id}>
                                        {lc.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tier filter */}
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                Tier
                            </label>
                            <select
                                value={filters.tierId || ""}
                                onChange={(e) =>
                                    updateFilter(
                                        "tierId",
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null
                                    )
                                }
                                className="w-full px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Todos</option>
                                {tiers.map((tier) => (
                                    <option key={tier.id} value={tier.id}>
                                        {tier.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Operational Status filter */}
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                Estado
                            </label>
                            <select
                                value={filters.operationalStatusId || ""}
                                onChange={(e) =>
                                    updateFilter(
                                        "operationalStatusId",
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null
                                    )
                                }
                                className="w-full px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Todos</option>
                                {operationalStatuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Criticality filter */}
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                Criticidad
                            </label>
                            <select
                                value={filters.criticalityId || ""}
                                onChange={(e) =>
                                    updateFilter(
                                        "criticalityId",
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null
                                    )
                                }
                                className="w-full px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Todos</option>
                                {criticalities.map((crit) => (
                                    <option key={crit.id} value={crit.id}>
                                        {crit.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Stateless filter */}
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                Stateless
                            </label>
                            <select
                                value={
                                    filters.isStateless === null
                                        ? ""
                                        : filters.isStateless
                                        ? "true"
                                        : "false"
                                }
                                onChange={(e) =>
                                    updateFilter(
                                        "isStateless",
                                        e.target.value === ""
                                            ? null
                                            : e.target.value === "true"
                                    )
                                }
                                className="w-full px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Todos</option>
                                <option value="true">Sí</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>

                    {/* Active filters & Clear */}
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
                            <span className="text-xs text-muted-foreground">
                                Filtros activos:
                            </span>
                            {filters.typeId && (
                                <FilterBadge
                                    label={`Tipo: ${
                                        componentTypes.find(
                                            (t) => t.id === filters.typeId
                                        )?.name || filters.typeId
                                    }`}
                                    onRemove={() =>
                                        updateFilter("typeId", null)
                                    }
                                />
                            )}
                            {filters.lifecycleId && (
                                <FilterBadge
                                    label={`Ciclo: ${
                                        lifecycles.find(
                                            (l) => l.id === filters.lifecycleId
                                        )?.name || filters.lifecycleId
                                    }`}
                                    onRemove={() =>
                                        updateFilter("lifecycleId", null)
                                    }
                                />
                            )}
                            {filters.tierId && (
                                <FilterBadge
                                    label={`Tier: ${
                                        tiers.find(
                                            (t) => t.id === filters.tierId
                                        )?.name || filters.tierId
                                    }`}
                                    onRemove={() =>
                                        updateFilter("tierId", null)
                                    }
                                />
                            )}
                            {filters.operationalStatusId && (
                                <FilterBadge
                                    label={`Estado: ${
                                        operationalStatuses.find(
                                            (s) =>
                                                s.id ===
                                                filters.operationalStatusId
                                        )?.name || filters.operationalStatusId
                                    }`}
                                    onRemove={() =>
                                        updateFilter(
                                            "operationalStatusId",
                                            null
                                        )
                                    }
                                />
                            )}
                            {filters.criticalityId && (
                                <FilterBadge
                                    label={`Criticidad: ${
                                        criticalities.find(
                                            (c) =>
                                                c.id === filters.criticalityId
                                        )?.name || filters.criticalityId
                                    }`}
                                    onRemove={() =>
                                        updateFilter("criticalityId", null)
                                    }
                                />
                            )}
                            {filters.isStateless !== null && (
                                <FilterBadge
                                    label={`Stateless: ${
                                        filters.isStateless ? "Sí" : "No"
                                    }`}
                                    onRemove={() =>
                                        updateFilter("isStateless", null)
                                    }
                                />
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-xs text-destructive hover:underline"
                            >
                                Limpiar todos
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Results count */}
            {(filters.search || hasActiveFilters) && (
                <div className="text-sm text-muted-foreground">
                    Mostrando{" "}
                    <span className="font-medium text-foreground">
                        {filteredCount}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium text-foreground">
                        {totalCount}
                    </span>{" "}
                    componentes
                </div>
            )}
        </div>
    );
}

export default ComponentsToolbar;
