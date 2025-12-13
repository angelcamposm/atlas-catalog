"use client";

import { useState } from "react";
import Link from "next/link";
import {
    HiOutlineArrowsRightLeft,
    HiOutlineArrowLongRight,
    HiOutlineArrowLongLeft,
    HiOutlineCpuChip,
    HiOutlineChevronRight,
    HiOutlineInformationCircle,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { Api, Component, ComponentApi } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ApiDependenciesProps {
    api: Api;
    componentApis?: ComponentApi[];
    components?: Component[];
    locale: string;
    className?: string;
}

export interface DependencyRelation {
    id: number;
    componentId: number;
    componentName: string;
    componentSlug: string;
    type: "consumer" | "provider";
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

    const typeLabel = dependency.type === "consumer" ? "Consume" : "Provee";
    const typeColor =
        dependency.type === "consumer"
            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";

    return (
        <Link
            href={`/${locale}/components/${dependency.componentSlug || dependency.componentId}`}
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
                            typeColor
                        )}
                    >
                        {typeLabel}
                    </span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <IconComponent className="w-4 h-4" />
                    <span>
                        {dependency.type === "consumer"
                            ? "Este componente consume esta API"
                            : "Esta API es provista por este componente"}
                    </span>
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
}: ApiDependenciesProps) {
    const [filter, setFilter] = useState<"all" | "consumer" | "provider">("all");

    // Transform componentApis to dependencies
    const dependencies: DependencyRelation[] = componentApis
        .filter((ca) => ca.api_id === api.id && ca.component_id)
        .map((ca) => {
            const component = components.find((c) => c.id === ca.component_id);
            // Simplified: treating all relations as consumer for now
            // In a real app, you'd determine this from relationship_id
            return {
                id: ca.id,
                componentId: ca.component_id!,
                componentName: component?.name || component?.display_name || `Componente #${ca.component_id}`,
                componentSlug: component?.slug || String(ca.component_id),
                type: "consumer" as const,
                relationshipId: ca.relationship_id ?? undefined,
            };
        });

    const filteredDependencies =
        filter === "all"
            ? dependencies
            : dependencies.filter((d) => d.type === filter);

    const consumerCount = dependencies.filter((d) => d.type === "consumer").length;
    const providerCount = dependencies.filter((d) => d.type === "provider").length;

    return (
        <div className={cn("space-y-4", className)}>
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
                            <strong className="text-gray-900 dark:text-white">Consumidores:</strong>{" "}
                            Componentes que utilizan esta API.
                        </p>
                        <p className="mt-1">
                            <strong className="text-gray-900 dark:text-white">Proveedores:</strong>{" "}
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
