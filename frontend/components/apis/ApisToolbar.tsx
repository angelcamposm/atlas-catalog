"use client";

import { useState } from "react";
import Link from "next/link";
import {
    HiOutlineFunnel,
    HiOutlineArrowsUpDown,
    HiOutlineSquares2X2,
    HiOutlineListBullet,
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
    HiOutlinePlus,
    HiOutlineArrowPath,
    HiOutlineArrowDownTray,
    HiOutlineDocumentText,
    HiOutlineTableCells,
} from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Api } from "@/types/api";
import { exportApis, type ExportFormat } from "@/lib/utils/export-apis";

// ============================================================================
// Types
// ============================================================================

export type ViewMode = "grid" | "list";
export type SortField = "name" | "created_at" | "updated_at" | "version";
export type SortOrder = "asc" | "desc";

interface ApisToolbarProps {
    // Locale for links
    locale: string;
    // Search
    searchQuery: string;
    onSearchChange: (query: string) => void;
    // View
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    // Sort
    sortField: SortField;
    sortOrder: SortOrder;
    onSortChange: (field: SortField, order: SortOrder) => void;
    // Filters
    activeFiltersCount: number;
    onToggleFilters: () => void;
    // Stats
    filteredCount: number;
    totalCount: number;
    // Actions
    onRefresh?: () => void;
    isLoading?: boolean;
    // Export
    apis?: Api[];
}

// ============================================================================
// Sort Options
// ============================================================================

const sortOptions: Array<{ field: SortField; label: string }> = [
    { field: "name", label: "Nombre" },
    { field: "created_at", label: "Fecha creación" },
    { field: "updated_at", label: "Última actualización" },
    { field: "version", label: "Versión" },
];

// ============================================================================
// Component
// ============================================================================

export function ApisToolbar({
    locale,
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
    sortField,
    sortOrder,
    onSortChange,
    activeFiltersCount,
    onToggleFilters,
    filteredCount,
    totalCount,
    onRefresh,
    isLoading,
    apis,
}: ApisToolbarProps) {
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);

    const handleSortSelect = (field: SortField) => {
        if (field === sortField) {
            // Toggle order if same field
            onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
        } else {
            onSortChange(field, "asc");
        }
        setShowSortDropdown(false);
    };

    const handleExport = (format: ExportFormat) => {
        if (apis && apis.length > 0) {
            exportApis(apis, format);
        }
        setShowExportDropdown(false);
    };

    const currentSortLabel =
        sortOptions.find((o) => o.field === sortField)?.label || "Ordenar";

    return (
        <div className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 gap-4">
            {/* Left side - Search + Stats */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Quick Search */}
                <div className="relative flex-1 max-w-xs">
                    <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar APIs..."
                        className={cn(
                            "w-full h-8 pl-9 pr-8 rounded-md text-sm",
                            "bg-muted/50 border border-transparent",
                            "focus:bg-background focus:border-border focus:outline-none focus:ring-1 focus:ring-primary/20",
                            "placeholder:text-muted-foreground/60"
                        )}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted"
                        >
                            <HiOutlineXMark className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* Results count */}
                <span className="text-sm text-muted-foreground whitespace-nowrap hidden md:block">
                    {filteredCount === totalCount
                        ? `${totalCount} APIs`
                        : `${filteredCount} de ${totalCount}`}
                </span>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-1">
                {/* Refresh */}
                {onRefresh && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isLoading}
                        title="Actualizar"
                    >
                        <HiOutlineArrowPath
                            className={cn(
                                "h-4 w-4",
                                isLoading && "animate-spin"
                            )}
                        />
                    </Button>
                )}

                {/* Filter Toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleFilters}
                    className={cn(
                        "relative",
                        activeFiltersCount > 0 && "text-primary"
                    )}
                >
                    <HiOutlineFunnel className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Filtros</span>
                    {activeFiltersCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>

                {/* Sort Dropdown */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                    >
                        <HiOutlineArrowsUpDown className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">
                            {currentSortLabel}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                            {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                    </Button>

                    {showSortDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowSortDropdown(false)}
                            />
                            <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-md border border-border bg-popover shadow-md">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.field}
                                        onClick={() =>
                                            handleSortSelect(option.field)
                                        }
                                        className={cn(
                                            "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between",
                                            sortField === option.field &&
                                                "bg-muted/50 font-medium"
                                        )}
                                    >
                                        {option.label}
                                        {sortField === option.field && (
                                            <span className="text-muted-foreground">
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

                {/* Separator */}
                <div className="h-5 w-px bg-border mx-1" />

                {/* View Toggle */}
                <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5">
                    <button
                        onClick={() => onViewModeChange("grid")}
                        className={cn(
                            "p-1.5 rounded transition-colors",
                            viewMode === "grid"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Vista cuadrícula"
                    >
                        <HiOutlineSquares2X2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange("list")}
                        className={cn(
                            "p-1.5 rounded transition-colors",
                            viewMode === "list"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Vista lista"
                    >
                        <HiOutlineListBullet className="h-4 w-4" />
                    </button>
                </div>

                {/* Export Button */}
                {apis && apis.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setShowExportDropdown(!showExportDropdown)}
                            onBlur={() =>
                                setTimeout(() => setShowExportDropdown(false), 150)
                            }
                            className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors",
                                "border border-border text-foreground hover:bg-muted"
                            )}
                            title="Exportar APIs"
                        >
                            <HiOutlineArrowDownTray className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar</span>
                        </button>

                        {/* Export Dropdown */}
                        {showExportDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowExportDropdown(false)}
                                />
                                <div className="absolute right-0 mt-1 w-40 bg-popover border border-border rounded-md shadow-lg z-50 py-1">
                                    <button
                                        onClick={() => handleExport("json")}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                    >
                                        <HiOutlineDocumentText className="h-4 w-4" />
                                        Exportar JSON
                                    </button>
                                    <button
                                        onClick={() => handleExport("csv")}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                    >
                                        <HiOutlineTableCells className="h-4 w-4" />
                                        Exportar CSV
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Separator */}
                <div className="h-5 w-px bg-border mx-1" />

                {/* Create API Button */}
                <Link
                    href={`/${locale}/apis/new`}
                    className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                >
                    <HiOutlinePlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Nueva API</span>
                </Link>
            </div>
        </div>
    );
}
