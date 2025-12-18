"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    HiOutlineArrowsRightLeft,
    HiOutlineArrowLongRight,
    HiOutlineArrowLongLeft,
    HiOutlineCpuChip,
    HiOutlineChevronRight,
    HiOutlineInformationCircle,
    HiOutlineExclamationTriangle,
    HiOutlineArrowDownTray,
    HiOutlineArrowUpTray,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { Api, Component, ComponentApi } from "@/types/api";
import {
    apiDependenciesApi,
    getRelationshipLabel,
    getRelationshipColor,
} from "@/lib/api/api-dependencies";
import type { ApiDependencies as ApiDependenciesData, ApiRelation } from "@/lib/api/api-dependencies";

// ============================================================================
// Types
// ============================================================================

export interface ApiDependenciesProps {
    api: Api;
    /** @deprecated Use auto-loading from API instead */
    componentApis?: ComponentApi[];
    /** @deprecated Use auto-loading from API instead */
    components?: Component[];
    locale: string;
    className?: string;
    /** 
     * When true, fetches dependencies from the API endpoint.
     * When false, uses provided componentApis/components props.
     * @default true
     */
    autoLoad?: boolean;
}

export interface DependencyRelation {
    id: number;
    componentId: number;
    componentName: string;
    componentSlug: string;
    type: "consumer" | "provider";
    relationship?: string;
    relationshipId?: number;
}

// ============================================================================
// Dependency Card Component
// ============================================================================

interface DependencyCardProps {
    dependency: DependencyRelation;
    locale: string;
}

function DependencyCard({ dependency, locale }: DependencyCardProps) {
    const IconComponent =
        dependency.type === "consumer"
            ? HiOutlineArrowLongRight
            : HiOutlineArrowLongLeft;

    // Usar la información de relación específica si está disponible
    const relationshipType = dependency.relationship;
    const relationshipLabel = relationshipType
        ? getRelationshipLabel(relationshipType)
        : dependency.type === "consumer"
          ? "Consume"
          : "Provee";
    const relationshipColor = relationshipType
        ? getRelationshipColor(relationshipType)
        : dependency.type === "consumer"
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
          : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";

    // Descripción según el tipo de relación
    const getDescription = () => {
        if (relationshipType) {
            switch (relationshipType) {
                case "consumer":
                    return "Este componente consume esta API";
                case "provider":
                    return "Este componente provee esta API";
                case "owner":
                    return "Este componente es dueño de esta API";
                case "subscriber":
                    return "Este componente está suscrito a esta API";
                case "maintainer":
                    return "Este componente mantiene esta API";
                default:
                    return `Relación: ${relationshipType}`;
            }
        }
        return dependency.type === "consumer"
            ? "Este componente consume esta API"
            : "Esta API es provista por este componente";
    };

    return (
        <Link
            href={`/${locale}/components/${
                dependency.componentSlug || dependency.componentId
            }`}
            className={cn(
                "group flex items-center gap-4 p-4",
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg",
                "hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all"
            )}
        >
            {/* Icon */}
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
                <HiOutlineCpuChip className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {dependency.componentName}
                    </span>
                    <span
                        className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded-full shrink-0",
                            relationshipColor
                        )}
                    >
                        {relationshipLabel}
                    </span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <IconComponent className="w-4 h-4" />
                    <span>{getDescription()}</span>
                </div>
            </div>

            {/* Arrow */}
            <HiOutlineChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors shrink-0" />
        </Link>
    );
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyDependencies() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <HiOutlineArrowsRightLeft className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Sin dependencias
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Esta API no tiene componentes asociados como consumidores o
                proveedores. Las relaciones se establecen cuando los componentes
                se vinculan con APIs.
            </p>
        </div>
    );
}

// ============================================================================
// Main ApiDependencies Component
// ============================================================================

export function ApiDependencies({
    api,
    componentApis = [],
    components = [],
    locale,
    className,
    autoLoad = true,
}: ApiDependenciesProps) {
    const [filter, setFilter] = useState<"all" | "consumer" | "provider">(
        "all"
    );
    const [apiData, setApiData] = useState<ApiDependenciesData | null>(null);
    const [loading, setLoading] = useState(autoLoad);

    // Auto-load dependencies from API
    const loadDependencies = useCallback(async () => {
        if (!autoLoad) return;
        
        try {
            setLoading(true);
            const data = await apiDependenciesApi.getDependencies(api.id);
            setApiData(data);
        } catch (error) {
            console.error("Error loading API dependencies:", error);
        } finally {
            setLoading(false);
        }
    }, [api.id, autoLoad]);

    useEffect(() => {
        if (autoLoad) {
            loadDependencies();
        }
    }, [loadDependencies, autoLoad]);

    // Transform API data to dependencies format
    const transformApiRelation = (
        relation: ApiRelation,
        type: "consumer" | "provider"
    ): DependencyRelation => ({
        id: relation.id,
        componentId: relation.component.id,
        componentName: relation.component.display_name || relation.component.name,
        componentSlug: relation.component.slug || String(relation.component.id),
        type,
        relationship: relation.relationship,
    });

    // Get dependencies from API data or from props
    const dependencies: DependencyRelation[] = autoLoad && apiData
        ? [
            ...apiData.consumers.map((r) => transformApiRelation(r, "consumer")),
            ...apiData.providers.map((r) => transformApiRelation(r, "provider")),
          ]
        : componentApis
            .filter((ca) => ca.api_id === api.id && ca.component_id)
            .map((ca) => {
                const component = components.find((c) => c.id === ca.component_id);
                return {
                    id: ca.id,
                    componentId: ca.component_id!,
                    componentName:
                        component?.name ||
                        component?.display_name ||
                        `Componente #${ca.component_id}`,
                    componentSlug: component?.slug || String(ca.component_id),
                    type: "consumer" as const,
                    relationshipId: ca.relationship_id ?? undefined,
                };
            });

    const filteredDependencies =
        filter === "all"
            ? dependencies
            : dependencies.filter((d) => d.type === filter);

    const consumerCount = dependencies.filter(
        (d) => d.type === "consumer"
    ).length;
    const providerCount = dependencies.filter(
        (d) => d.type === "provider"
    ).length;

    // Show loading skeleton
    if (loading) {
        return <ApiDependenciesSkeleton />;
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2">
                        <HiOutlineArrowDownTray className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                            Consumidores
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-200 mt-1">
                        {consumerCount}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                        Componentes que usan esta API
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                        <HiOutlineArrowUpTray className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            Proveedores
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
                        {providerCount}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                        Componentes que exponen esta API
                    </p>
                </div>
            </div>

            {/* Banner if no real data */}
            {autoLoad && dependencies.length === 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <HiOutlineExclamationTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            Funcionalidad en desarrollo
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                            La visualización de dependencias estará disponible próximamente.
                            Esta sección mostrará los componentes que consumen o proveen esta API.
                        </p>
                    </div>
                </div>
            )}

            {/* Header with filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <HiOutlineArrowsRightLeft className="w-5 h-5 text-gray-400" />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                        Dependencias y Relaciones
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {dependencies.length}
                    </span>
                </div>

                {dependencies.length > 0 && (
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setFilter("all")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                filter === "all"
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            Todos ({dependencies.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter("consumer")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                filter === "consumer"
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            Consumidores ({consumerCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter("provider")}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                filter === "provider"
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            Proveedores ({providerCount})
                        </button>
                    </div>
                )}
            </div>

            {/* Info box */}
            {dependencies.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <HiOutlineInformationCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p>
                            <strong className="text-gray-900 dark:text-white">
                                Consumidores:
                            </strong>{" "}
                            Componentes que utilizan esta API.
                        </p>
                        <p className="mt-1">
                            <strong className="text-gray-900 dark:text-white">
                                Proveedores:
                            </strong>{" "}
                            Componentes que exponen o implementan esta API.
                        </p>
                    </div>
                </div>
            )}

            {/* Dependencies list */}
            {dependencies.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <EmptyDependencies />
                </div>
            ) : filteredDependencies.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay dependencias del tipo seleccionado.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredDependencies.map((dependency) => (
                        <DependencyCard
                            key={dependency.id}
                            dependency={dependency}
                            locale={locale}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// ApiDependencies Skeleton
// ============================================================================

export function ApiDependenciesSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-8" />
                </div>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-64" />
            </div>

            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                        </div>
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
