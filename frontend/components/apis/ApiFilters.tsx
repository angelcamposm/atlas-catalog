"use client";

import { useState, useCallback } from "react";
import {
    HiOutlineFunnel,
    HiOutlineXMark,
    HiOutlineChevronDown,
    HiOutlineCheck,
    HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { ApiType, ApiStatus, Lifecycle, Group } from "@/types/api";
import { Protocol } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ApiFiltersState {
    search: string;
    types: number[];
    statuses: number[];
    lifecycles: number[];
    protocols: Protocol[];
    owners: number[];
    deprecated: "all" | "active" | "deprecated";
}

export interface ApiFiltersProps {
    filters: ApiFiltersState;
    onFiltersChange: (filters: ApiFiltersState) => void;
    apiTypes?: ApiType[];
    apiStatuses?: ApiStatus[];
    lifecycles?: Lifecycle[];
    owners?: Group[];
    className?: string;
    collapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    /** When true, hides the search bar and filter toggle (use when they're in a separate toolbar) */
    hideSearchBar?: boolean;
}

// Default filter state
export const defaultFilters: ApiFiltersState = {
    search: "",
    types: [],
    statuses: [],
    lifecycles: [],
    protocols: [],
    owners: [],
    deprecated: "all",
};

// ============================================================================
// Filter Badge Component
// ============================================================================

interface FilterBadgeProps {
    label: string;
    onRemove: () => void;
}

function FilterBadge({ label, onRemove }: FilterBadgeProps) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full p-0.5 transition-colors"
            >
                <HiOutlineXMark className="w-3 h-3" />
            </button>
        </span>
    );
}

// ============================================================================
// Multi-Select Dropdown Component
// ============================================================================

interface MultiSelectOption {
    id: number;
    name: string;
}

interface MultiSelectDropdownProps {
    label: string;
    options: MultiSelectOption[];
    selected: number[];
    onChange: (selected: number[]) => void;
    placeholder?: string;
}

function MultiSelectDropdown({
    label,
    options,
    selected,
    onChange,
    placeholder = "Seleccionar...",
}: MultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (id: number) => {
        if (selected.includes(id)) {
            onChange(selected.filter((s) => s !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    const selectedLabels = options
        .filter((opt) => selected.includes(opt.id))
        .map((opt) => opt.name);

    return (
        <div className="relative">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm",
                    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg",
                    "hover:border-gray-300 dark:hover:border-gray-600 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                )}
            >
                <span
                    className={cn(
                        "truncate",
                        selected.length === 0 &&
                            "text-gray-400 dark:text-gray-500"
                    )}
                >
                    {selected.length === 0
                        ? placeholder
                        : selectedLabels.length <= 2
                        ? selectedLabels.join(", ")
                        : `${selectedLabels.length} seleccionados`}
                </span>
                <HiOutlineChevronDown
                    className={cn(
                        "w-4 h-4 text-gray-400 transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {options.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                Sin opciones disponibles
                            </div>
                        ) : (
                            options.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => toggleOption(option.id)}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
                                        "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                                        selected.includes(option.id) &&
                                            "bg-primary-50 dark:bg-primary-900/20"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center",
                                            selected.includes(option.id)
                                                ? "bg-primary-500 border-primary-500"
                                                : "border-gray-300 dark:border-gray-600"
                                        )}
                                    >
                                        {selected.includes(option.id) && (
                                            <HiOutlineCheck className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-200">
                                        {option.name}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// ============================================================================
// Protocol Filter Component
// ============================================================================

interface ProtocolFilterProps {
    selected: Protocol[];
    onChange: (selected: Protocol[]) => void;
}

function ProtocolFilter({ selected, onChange }: ProtocolFilterProps) {
    const protocols = [
        { value: Protocol.HTTP, label: "HTTP", color: "bg-blue-500" },
        { value: Protocol.HTTPS, label: "HTTPS", color: "bg-green-500" },
    ];

    const toggleProtocol = (protocol: Protocol) => {
        if (selected.includes(protocol)) {
            onChange(selected.filter((p) => p !== protocol));
        } else {
            onChange([...selected, protocol]);
        }
    };

    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Protocolo
            </label>
            <div className="flex flex-wrap gap-2">
                {protocols.map(({ value, label, color }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => toggleProtocol(value)}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                            selected.includes(value)
                                ? `${color} text-white`
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Deprecation Filter Component
// ============================================================================

interface DeprecationFilterProps {
    value: "all" | "active" | "deprecated";
    onChange: (value: "all" | "active" | "deprecated") => void;
}

function DeprecationFilter({ value, onChange }: DeprecationFilterProps) {
    const options = [
        { value: "all" as const, label: "Todos" },
        { value: "active" as const, label: "Activos" },
        { value: "deprecated" as const, label: "Deprecados" },
    ];

    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Estado de Deprecación
            </label>
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                            value === opt.value
                                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Main ApiFilters Component
// ============================================================================

export function ApiFilters({
    filters,
    onFiltersChange,
    apiTypes = [],
    apiStatuses = [],
    lifecycles = [],
    owners = [],
    className,
    collapsed = false,
    onCollapsedChange,
    hideSearchBar = false,
}: ApiFiltersProps) {
    // Count active filters (excluding search)
    const activeFilterCount =
        filters.types.length +
        filters.statuses.length +
        filters.lifecycles.length +
        filters.protocols.length +
        filters.owners.length +
        (filters.deprecated !== "all" ? 1 : 0);

    // Update individual filter
    const updateFilter = useCallback(
        <K extends keyof ApiFiltersState>(
            key: K,
            value: ApiFiltersState[K]
        ) => {
            onFiltersChange({ ...filters, [key]: value });
        },
        [filters, onFiltersChange]
    );

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        onFiltersChange(defaultFilters);
    }, [onFiltersChange]);

    // Get labels for active filters
    const getFilterLabels = useCallback(() => {
        const labels: { key: string; label: string; onRemove: () => void }[] =
            [];

        // Types
        filters.types.forEach((typeId) => {
            const type = apiTypes.find((t) => t.id === typeId);
            if (type) {
                labels.push({
                    key: `type-${typeId}`,
                    label: `Tipo: ${type.name}`,
                    onRemove: () =>
                        updateFilter(
                            "types",
                            filters.types.filter((t) => t !== typeId)
                        ),
                });
            }
        });

        // Statuses
        filters.statuses.forEach((statusId) => {
            const status = apiStatuses.find((s) => s.id === statusId);
            if (status) {
                labels.push({
                    key: `status-${statusId}`,
                    label: `Estado: ${status.name}`,
                    onRemove: () =>
                        updateFilter(
                            "statuses",
                            filters.statuses.filter((s) => s !== statusId)
                        ),
                });
            }
        });

        // Lifecycles
        filters.lifecycles.forEach((lifecycleId) => {
            const lifecycle = lifecycles.find((l) => l.id === lifecycleId);
            if (lifecycle) {
                labels.push({
                    key: `lifecycle-${lifecycleId}`,
                    label: `Ciclo: ${lifecycle.name}`,
                    onRemove: () =>
                        updateFilter(
                            "lifecycles",
                            filters.lifecycles.filter((l) => l !== lifecycleId)
                        ),
                });
            }
        });

        // Protocols
        filters.protocols.forEach((protocol) => {
            labels.push({
                key: `protocol-${protocol}`,
                label: `Protocolo: ${protocol.toUpperCase()}`,
                onRemove: () =>
                    updateFilter(
                        "protocols",
                        filters.protocols.filter((p) => p !== protocol)
                    ),
            });
        });

        // Owners
        filters.owners.forEach((ownerId) => {
            const owner = owners.find((o) => o.id === ownerId);
            if (owner) {
                labels.push({
                    key: `owner-${ownerId}`,
                    label: `Owner: ${owner.name}`,
                    onRemove: () =>
                        updateFilter(
                            "owners",
                            filters.owners.filter((o) => o !== ownerId)
                        ),
                });
            }
        });

        // Deprecation
        if (filters.deprecated !== "all") {
            labels.push({
                key: "deprecated",
                label:
                    filters.deprecated === "active"
                        ? "Solo activos"
                        : "Solo deprecados",
                onRemove: () => updateFilter("deprecated", "all"),
            });
        }

        return labels;
    }, [filters, apiTypes, apiStatuses, lifecycles, owners, updateFilter]);

    const filterLabels = getFilterLabels();

    return (
        <div className={cn("space-y-4", className)}>
            {/* Search and Toggle Header - Only show if not hidden by toolbar */}
            {!hideSearchBar && (
                <div className="flex items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar APIs..."
                            value={filters.search}
                            onChange={(e) =>
                                updateFilter("search", e.target.value)
                            }
                            className={cn(
                                "w-full pl-9 pr-4 py-2 text-sm",
                                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg",
                                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                                "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            )}
                        />
                        {filters.search && (
                            <button
                                type="button"
                                onClick={() => updateFilter("search", "")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <HiOutlineXMark className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        type="button"
                        onClick={() => onCollapsedChange?.(!collapsed)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                            collapsed
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                : "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        )}
                    >
                        <HiOutlineFunnel className="w-4 h-4" />
                        <span>Filtros</span>
                        {activeFilterCount > 0 && (
                            <span className="px-1.5 py-0.5 text-xs font-semibold bg-primary-500 text-white rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* Active Filter Badges */}
            {filterLabels.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {filterLabels.map((filter) => (
                        <FilterBadge
                            key={filter.key}
                            label={filter.label}
                            onRemove={filter.onRemove}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={clearAllFilters}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        Limpiar todo
                    </button>
                </div>
            )}

            {/* Filter Panel */}
            {!collapsed && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {/* API Types */}
                        <MultiSelectDropdown
                            label="Tipo de API"
                            options={apiTypes}
                            selected={filters.types}
                            onChange={(selected) =>
                                updateFilter("types", selected)
                            }
                            placeholder="Seleccionar tipos..."
                        />

                        {/* API Statuses */}
                        <MultiSelectDropdown
                            label="Estado"
                            options={apiStatuses}
                            selected={filters.statuses}
                            onChange={(selected) =>
                                updateFilter("statuses", selected)
                            }
                            placeholder="Seleccionar estados..."
                        />

                        {/* Lifecycles */}
                        <MultiSelectDropdown
                            label="Ciclo de Vida"
                            options={lifecycles}
                            selected={filters.lifecycles}
                            onChange={(selected) =>
                                updateFilter("lifecycles", selected)
                            }
                            placeholder="Seleccionar ciclos..."
                        />

                        {/* Owners */}
                        <MultiSelectDropdown
                            label="Propietario"
                            options={owners}
                            selected={filters.owners}
                            onChange={(selected) =>
                                updateFilter("owners", selected)
                            }
                            placeholder="Seleccionar propietarios..."
                        />
                    </div>

                    {/* Protocol and Deprecation Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <ProtocolFilter
                            selected={filters.protocols}
                            onChange={(selected) =>
                                updateFilter("protocols", selected)
                            }
                        />
                        <DeprecationFilter
                            value={filters.deprecated}
                            onChange={(value) =>
                                updateFilter("deprecated", value)
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Compact Filter Bar (Alternative simpler version)
// ============================================================================

export interface CompactFilterBarProps {
    search: string;
    onSearchChange: (search: string) => void;
    filterCount: number;
    onToggleFilters: () => void;
    onClearFilters?: () => void;
    className?: string;
}

export function CompactFilterBar({
    search,
    onSearchChange,
    filterCount,
    onToggleFilters,
    onClearFilters,
    className,
}: CompactFilterBarProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={cn(
                        "w-full pl-9 pr-4 py-2 text-sm",
                        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg",
                        "placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    )}
                />
            </div>

            {/* Filter Button */}
            <button
                type="button"
                onClick={onToggleFilters}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                    filterCount > 0
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                )}
            >
                <HiOutlineFunnel className="w-4 h-4" />
                {filterCount > 0 && (
                    <span className="px-1.5 py-0.5 text-xs font-semibold bg-primary-500 text-white rounded-full">
                        {filterCount}
                    </span>
                )}
            </button>

            {/* Clear Button */}
            {filterCount > 0 && onClearFilters && (
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    Limpiar
                </button>
            )}
        </div>
    );
}

// ============================================================================
// Hook for URL Sync (optional)
// ============================================================================

export function useApiFiltersWithUrl(
    initialFilters: ApiFiltersState = defaultFilters
) {
    // Parse URL params on mount only
    const getInitialFiltersFromUrl = (): ApiFiltersState => {
        if (typeof window === "undefined") return initialFilters;

        const params = new URLSearchParams(window.location.search);
        const urlFilters: Partial<ApiFiltersState> = {};

        const search = params.get("search");
        if (search) urlFilters.search = search;

        const types = params.get("types");
        if (types)
            urlFilters.types = types.split(",").map(Number).filter(Boolean);

        const statuses = params.get("statuses");
        if (statuses)
            urlFilters.statuses = statuses
                .split(",")
                .map(Number)
                .filter(Boolean);

        const lifecycles = params.get("lifecycles");
        if (lifecycles)
            urlFilters.lifecycles = lifecycles
                .split(",")
                .map(Number)
                .filter(Boolean);

        const protocols = params.get("protocols");
        if (protocols)
            urlFilters.protocols = protocols
                .split(",")
                .filter(Boolean) as Protocol[];

        const deprecated = params.get("deprecated") as
            | "all"
            | "active"
            | "deprecated";
        if (
            deprecated &&
            ["all", "active", "deprecated"].includes(deprecated)
        ) {
            urlFilters.deprecated = deprecated;
        }

        return { ...initialFilters, ...urlFilters };
    };

    const [filters, setFilters] = useState<ApiFiltersState>(
        getInitialFiltersFromUrl
    );

    return { filters, setFilters };
}
