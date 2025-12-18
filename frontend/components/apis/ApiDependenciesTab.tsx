/**
 * API Dependencies Tab Component
 *
 * Displays the components that consume or provide an API.
 * This component is prepared for when the backend implements
 * the dependency endpoints.
 *
 * TODO Backend Endpoints:
 * - GET /v1/apis/{id}/dependencies
 * - GET /v1/apis/{id}/consumers
 * - GET /v1/apis/{id}/providers
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
    HiOutlineArrowPath,
    HiOutlineArrowUpTray,
    HiOutlineArrowDownTray,
    HiOutlineCube,
    HiOutlineInformationCircle,
    HiOutlineExclamationTriangle,
    HiOutlineLink,
    HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    apiDependenciesApi,
    getRelationshipLabel,
    getRelationshipColor,
} from "@/lib/api/api-dependencies";
import type {
    ApiDependencies,
    ApiRelation,
    ApiRelationshipType,
} from "@/lib/api/api-dependencies";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ApiDependenciesTabProps {
    apiId: number;
    locale?: string;
}

// ============================================================================
// Sub-components
// ============================================================================

function RelationshipBadge({
    relationship,
}: {
    relationship: ApiRelationshipType;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                getRelationshipColor(relationship)
            )}
        >
            {getRelationshipLabel(relationship)}
        </span>
    );
}

function ComponentCard({
    relation,
    type,
    locale = "es",
}: {
    relation: ApiRelation;
    type: "consumer" | "provider";
    locale?: string;
}) {
    return (
        <div className="group flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-muted/30 transition-all">
            {/* Icon */}
            <div
                className={cn(
                    "shrink-0 rounded-lg p-2",
                    type === "consumer"
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "bg-green-100 dark:bg-green-900/30"
                )}
            >
                <HiOutlineCube
                    className={cn(
                        "h-5 w-5",
                        type === "consumer"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-green-600 dark:text-green-400"
                    )}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <Link
                        href={`/${locale}/components/${relation.component.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors truncate"
                    >
                        {relation.component.display_name ||
                            relation.component.name}
                    </Link>
                    <RelationshipBadge relationship={relation.relationship} />
                </div>

                {relation.component.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {relation.component.description}
                    </p>
                )}

                {/* Technical name */}
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {relation.component.slug || relation.component.name}
                </p>
            </div>

            {/* Action */}
            <Link
                href={`/${locale}/components/${relation.component.id}`}
                className="shrink-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                title="Ver componente"
            >
                <HiOutlineArrowTopRightOnSquare className="h-4 w-4 text-muted-foreground" />
            </Link>
        </div>
    );
}

function DependencySection({
    title,
    icon: Icon,
    relations,
    type,
    locale,
    emptyMessage,
}: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    relations: ApiRelation[];
    type: "consumer" | "provider";
    locale?: string;
    emptyMessage: string;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Icon
                    className={cn(
                        "h-5 w-5",
                        type === "consumer" ? "text-purple-500" : "text-green-500"
                    )}
                />
                <h4 className="text-sm font-semibold">{title}</h4>
                <Badge variant="secondary" className="text-xs">
                    {relations.length}
                </Badge>
            </div>

            {relations.length > 0 ? (
                <div className="space-y-2">
                    {relations.map((relation) => (
                        <ComponentCard
                            key={relation.id}
                            relation={relation}
                            type={type}
                            locale={locale}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/30 border border-dashed border-border">
                    <HiOutlineInformationCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground">
                        {emptyMessage}
                    </p>
                </div>
            )}
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            {/* Summary skeleton */}
            <div className="flex gap-4">
                <Skeleton className="h-20 flex-1 rounded-lg" />
                <Skeleton className="h-20 flex-1 rounded-lg" />
            </div>

            {/* Consumers skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
            </div>

            {/* Providers skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-16 w-full rounded-lg" />
            </div>
        </div>
    );
}

function NotImplementedBanner() {
    return (
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
    );
}

// ============================================================================
// Main Component
// ============================================================================

export function ApiDependenciesTab({ apiId, locale = "es" }: ApiDependenciesTabProps) {
    const [dependencies, setDependencies] = useState<ApiDependencies | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDependencies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiDependenciesApi.getDependencies(apiId);
            setDependencies(data);
        } catch (err) {
            setError("Error al cargar las dependencias");
            console.error("Error loading API dependencies:", err);
        } finally {
            setLoading(false);
        }
    }, [apiId]);

    useEffect(() => {
        loadDependencies();
    }, [loadDependencies]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <HiOutlineExclamationTriangle className="h-12 w-12 text-destructive/50 mb-4" />
                <p className="text-sm text-destructive">{error}</p>
            </div>
        );
    }

    // Check if we have real data or just the placeholder
    const hasRealData =
        dependencies &&
        (dependencies.consumers.length > 0 || dependencies.providers.length > 0);

    return (
        <div className="space-y-6">
            {/* Banner indicating feature is in development */}
            {!hasRealData && <NotImplementedBanner />}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2">
                        <HiOutlineArrowDownTray className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                            Consumidores
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-200 mt-1">
                        {dependencies?.total_consumers ?? 0}
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
                        {dependencies?.total_providers ?? 0}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                        Componentes que exponen esta API
                    </p>
                </div>
            </div>

            {/* Consumers Section */}
            <DependencySection
                title="Componentes Consumidores"
                icon={HiOutlineArrowDownTray}
                relations={dependencies?.consumers ?? []}
                type="consumer"
                locale={locale}
                emptyMessage="No hay componentes que consuman esta API registrados"
            />

            {/* Providers Section */}
            <DependencySection
                title="Componentes Proveedores"
                icon={HiOutlineArrowUpTray}
                relations={dependencies?.providers ?? []}
                type="provider"
                locale={locale}
                emptyMessage="No hay componentes que provean esta API registrados"
            />

            {/* Dependency Graph Placeholder */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <HiOutlineLink className="h-5 w-5 text-muted-foreground" />
                    <h4 className="text-sm font-semibold">Grafo de Dependencias</h4>
                    <Badge variant="outline" className="text-xs">
                        Próximamente
                    </Badge>
                </div>
                <div className="flex items-center justify-center p-8 rounded-lg border-2 border-dashed border-border bg-muted/10">
                    <div className="text-center">
                        <HiOutlineArrowPath className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Visualización gráfica de dependencias
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Esta característica estará disponible en una versión futura
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApiDependenciesTab;
