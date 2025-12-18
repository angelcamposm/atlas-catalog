"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
    ComponentCard,
    ComponentCardSkeleton,
} from "./ComponentCard";
import { EmptyState } from "@/components/ui/empty-state";
import {
    HiSquares2X2,
    HiListBullet,
    HiArrowsUpDown,
    HiChevronDown,
} from "react-icons/hi2";
import type { Component, ComponentType } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export type ViewMode = "grid" | "list";
export type SortField = "name" | "created_at" | "updated_at" | "slug";
export type SortOrder = "asc" | "desc";

export interface ComponentListProps {
    /** List of components to display */
    components: Component[];
    /** Locale for URLs */
    locale: string;
    /** Loading state */
    loading?: boolean;
    /** Initial view mode */
    defaultViewMode?: ViewMode;
    /** Show view toggle */
    showViewToggle?: boolean;
    /** Show sort controls */
    showSort?: boolean;
    /** Grid columns */
    columns?: 2 | 3 | 4;
    /** Empty state message */
    emptyMessage?: string;
    /** Empty state description */
    emptyDescription?: string;
    /** Search query for highlighting */
    searchQuery?: string;
    /** On edit callback */
    onEdit?: (component: Component) => void;
    /** On delete callback */
    onDelete?: (component: Component) => void;
    /** On duplicate callback */
    onDuplicate?: (component: Component) => void;
    /** On component click callback */
    onClick?: (component: Component) => void;
    /** Selected component ID */
    selectedId?: number;
    /** Additional className */
    className?: string;
    /** Component types for display */
    componentTypes?: ComponentType[];
    /** Lifecycles for display */
    lifecycles?: { id: number; name: string }[];
    /** Tiers for display */
    tiers?: { id: number; name: string }[];
    /** Operational statuses for display */
    operationalStatuses?: { id: number; name: string }[];
}

// ============================================================================
// Sort Options
// ============================================================================

const sortOptions: { value: SortField; label: string }[] = [
    { value: "name", label: "Nombre" },
    { value: "created_at", label: "Fecha de creación" },
    { value: "updated_at", label: "Última actualización" },
    { value: "slug", label: "Slug" },
];

function sortComponents(
    components: Component[],
    field: SortField,
    order: SortOrder
): Component[] {
    return [...components].sort((a, b) => {
        let comparison = 0;

        switch (field) {
            case "name":
                comparison = (a.name || "").localeCompare(b.name || "");
                break;
            case "created_at":
                comparison =
                    new Date(a.created_at || 0).getTime() -
                    new Date(b.created_at || 0).getTime();
                break;
            case "updated_at":
                comparison =
                    new Date(a.updated_at || 0).getTime() -
                    new Date(b.updated_at || 0).getTime();
                break;
            case "slug":
                comparison = (a.slug || "").localeCompare(b.slug || "");
                break;
        }

        return order === "asc" ? comparison : -comparison;
    });
}

// ============================================================================
// Components
// ============================================================================

/** View mode toggle */
export function ViewToggle({
    viewMode,
    onChange,
}: {
    viewMode: ViewMode;
    onChange: (mode: ViewMode) => void;
}) {
    return (
        <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
            <button
                onClick={() => onChange("grid")}
                className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "grid"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
                title="Vista cuadrícula"
            >
                <HiSquares2X2 className="h-4 w-4" />
            </button>
            <button
                onClick={() => onChange("list")}
                className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
                title="Vista lista"
            >
                <HiListBullet className="h-4 w-4" />
            </button>
        </div>
    );
}

/** Sort dropdown */
export function SortDropdown({
    sortField,
    sortOrder,
    onChange,
}: {
    sortField: SortField;
    sortOrder: SortOrder;
    onChange: (field: SortField, order: SortOrder) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (field: SortField) => {
        if (field === sortField) {
            onChange(field, sortOrder === "asc" ? "desc" : "asc");
        } else {
            onChange(field, "asc");
        }
        setIsOpen(false);
    };

    const currentLabel =
        sortOptions.find((o) => o.value === sortField)?.label || "Ordenar";

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-background hover:bg-muted transition-colors"
            >
                <HiArrowsUpDown className="h-4 w-4 text-muted-foreground" />
                <span>{currentLabel}</span>
                <span className="text-muted-foreground">
                    {sortOrder === "asc" ? "↑" : "↓"}
                </span>
                <HiChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover shadow-lg z-20 py-1">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={cn(
                                    "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between",
                                    sortField === option.value &&
                                        "bg-muted/50 font-medium"
                                )}
                            >
                                {option.label}
                                {sortField === option.value && (
                                    <span className="text-muted-foreground">
                                        {sortOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export function ComponentList({
    components,
    locale,
    loading = false,
    defaultViewMode = "grid",
    showViewToggle = true,
    showSort = true,
    columns = 3,
    emptyMessage = "No se encontraron componentes",
    emptyDescription = "No hay componentes que coincidan con los filtros seleccionados.",
    searchQuery = "",
    onEdit,
    onDelete,
    onDuplicate,
    onClick,
    selectedId,
    className,
    componentTypes,
    lifecycles,
    tiers,
    operationalStatuses,
}: ComponentListProps) {
    const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const sortedComponents = useMemo(
        () => sortComponents(components, sortField, sortOrder),
        [components, sortField, sortOrder]
    );

    const handleSortChange = (field: SortField, order: SortOrder) => {
        setSortField(field);
        setSortOrder(order);
    };

    const gridCols = {
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    // Loading state
    if (loading) {
        return (
            <div className={className}>
                {(showViewToggle || showSort) && (
                    <div className="flex items-center justify-end gap-2 mb-4">
                        {showSort && (
                            <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
                        )}
                        {showViewToggle && (
                            <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
                        )}
                    </div>
                )}
                <div
                    className={cn(
                        viewMode === "grid"
                            ? `grid gap-4 ${gridCols[columns]}`
                            : "flex flex-col gap-3"
                    )}
                >
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ComponentCardSkeleton key={i} viewMode={viewMode} />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (sortedComponents.length === 0) {
        return (
            <div className={className}>
                <EmptyState
                    title={emptyMessage}
                    description={emptyDescription}
                    icon="component"
                />
            </div>
        );
    }

    return (
        <div className={className}>
            {/* Controls */}
            {(showViewToggle || showSort) && (
                <div className="flex items-center justify-end gap-2 mb-4">
                    {showSort && (
                        <SortDropdown
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onChange={handleSortChange}
                        />
                    )}
                    {showViewToggle && (
                        <ViewToggle
                            viewMode={viewMode}
                            onChange={setViewMode}
                        />
                    )}
                </div>
            )}

            {/* Grid/List */}
            <div
                className={cn(
                    viewMode === "grid"
                        ? `grid gap-4 ${gridCols[columns]}`
                        : "flex flex-col gap-3"
                )}
            >
                {sortedComponents.map((component) => (
                    <ComponentCard
                        key={component.id}
                        component={component}
                        locale={locale}
                        viewMode={viewMode}
                        searchQuery={searchQuery}
                        isSelected={selectedId === component.id}
                        onClick={onClick}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                        componentTypes={componentTypes}
                        lifecycles={lifecycles}
                        tiers={tiers}
                        operationalStatuses={operationalStatuses}
                    />
                ))}
            </div>
        </div>
    );
}

export default ComponentList;
