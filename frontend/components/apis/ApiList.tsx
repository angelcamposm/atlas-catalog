"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ApiCard, ApiCardSkeleton } from "./ApiCard";
import { EmptyState } from "@/components/ui/empty-state";
import {
    HiSquares2X2,
    HiListBullet,
    HiArrowsUpDown,
    HiChevronDown,
} from "react-icons/hi2";
import type { Api } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export type ViewMode = "grid" | "list";
export type SortField = "name" | "created_at" | "updated_at" | "version";
export type SortOrder = "asc" | "desc";

export interface ApiListProps {
    /** List of APIs to display */
    apis: Api[];
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
    /** On edit callback */
    onEdit?: (api: Api) => void;
    /** On delete callback */
    onDelete?: (api: Api) => void;
    /** On duplicate callback */
    onDuplicate?: (api: Api) => void;
    /** Additional className */
    className?: string;
}

// ============================================================================
// Sort Options
// ============================================================================

const sortOptions: { value: SortField; label: string }[] = [
    { value: "name", label: "Nombre" },
    { value: "created_at", label: "Fecha de creación" },
    { value: "updated_at", label: "Última actualización" },
    { value: "version", label: "Versión" },
];

function sortApis(apis: Api[], field: SortField, order: SortOrder): Api[] {
    return [...apis].sort((a, b) => {
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
            case "version":
                comparison = (a.version || "").localeCompare(b.version || "");
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
        <div className="flex items-center rounded-lg border bg-muted p-1">
            <button
                onClick={() => onChange("grid")}
                className={cn(
                    "flex items-center justify-center p-1.5 rounded-md transition-colors",
                    viewMode === "grid"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
                title="Vista de cuadrícula"
            >
                <HiSquares2X2 className="h-4 w-4" />
            </button>
            <button
                onClick={() => onChange("list")}
                className={cn(
                    "flex items-center justify-center p-1.5 rounded-md transition-colors",
                    viewMode === "list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
                title="Vista de lista"
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
    onSortChange,
}: {
    sortField: SortField;
    sortOrder: SortOrder;
    onSortChange: (field: SortField, order: SortOrder) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentOption = sortOptions.find((opt) => opt.value === sortField);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
                <HiArrowsUpDown className="h-4 w-4 text-muted-foreground" />
                <span>{currentOption?.label}</span>
                <HiChevronDown
                    className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border bg-popover shadow-lg py-1">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                if (sortField === option.value) {
                                    onSortChange(
                                        option.value,
                                        sortOrder === "asc" ? "desc" : "asc"
                                    );
                                } else {
                                    onSortChange(option.value, "asc");
                                }
                                setIsOpen(false);
                            }}
                            className={cn(
                                "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors",
                                sortField === option.value && "bg-muted/50"
                            )}
                        >
                            <span>{option.label}</span>
                            {sortField === option.value && (
                                <span className="text-xs text-muted-foreground">
                                    {sortOrder === "asc" ? "↑" : "↓"}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/** Main ApiList component */
export function ApiList({
    apis,
    locale,
    loading = false,
    defaultViewMode = "grid",
    showViewToggle = true,
    showSort = true,
    columns = 3,
    emptyMessage = "No se encontraron APIs",
    emptyDescription = "Intenta ajustar los filtros o crear una nueva API.",
    onEdit,
    onDelete,
    onDuplicate,
    className,
}: ApiListProps) {
    const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const sortedApis = React.useMemo(
        () => sortApis(apis, sortField, sortOrder),
        [apis, sortField, sortOrder]
    );

    const gridColsClass = {
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    // Loading skeletons
    if (loading) {
        return (
            <div className={className}>
                {(showViewToggle || showSort) && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
                        <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
                    </div>
                )}
                <div
                    className={cn(
                        viewMode === "grid"
                            ? `grid gap-4 ${gridColsClass[columns]}`
                            : "space-y-3"
                    )}
                >
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ApiCardSkeleton key={i} viewMode={viewMode} />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (sortedApis.length === 0) {
        return (
            <div className={className}>
                <EmptyState
                    type="no-data"
                    title={emptyMessage}
                    description={emptyDescription}
                    size="md"
                />
            </div>
        );
    }

    return (
        <div className={className}>
            {/* Toolbar */}
            {(showViewToggle || showSort) && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {showViewToggle && (
                            <ViewToggle
                                viewMode={viewMode}
                                onChange={setViewMode}
                            />
                        )}
                        <span className="text-sm text-muted-foreground">
                            {sortedApis.length} API
                            {sortedApis.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                    {showSort && (
                        <SortDropdown
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSortChange={(field, order) => {
                                setSortField(field);
                                setSortOrder(order);
                            }}
                        />
                    )}
                </div>
            )}

            {/* API Cards */}
            <div
                className={cn(
                    viewMode === "grid"
                        ? `grid gap-4 ${gridColsClass[columns]}`
                        : "space-y-3"
                )}
            >
                {sortedApis.map((api) => (
                    <ApiCard
                        key={api.id}
                        api={api}
                        locale={locale}
                        viewMode={viewMode}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                    />
                ))}
            </div>
        </div>
    );
}

export default ApiList;
