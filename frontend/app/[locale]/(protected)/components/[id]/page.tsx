"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { componentsApi, componentTypesApi } from "@/lib/api/components";
import { lifecyclesApi } from "@/lib/api/lifecycles";
import type { Component, ComponentType, Lifecycle } from "@/types/api";
import { cn } from "@/lib/utils";
import {
    HiOutlineViewColumns,
    HiOutlineArrowsRightLeft,
    HiOutlineTableCells,
    HiOutlineExclamationCircle,
    HiOutlineChevronLeft,
    HiOutlinePencilSquare,
    HiArrowTopRightOnSquare,
    HiOutlineCube,
    HiServerStack,
    HiCloud,
    HiCpuChip,
    HiCircleStack,
    HiCog6Tooth,
    HiBolt,
    HiShieldCheck,
} from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import { getOperationalStatusColor } from "@/lib/api/components";

// ============================================================================
// Types
// ============================================================================

type IconComponent = React.ComponentType<{ className?: string }>;

interface ComponentApiRelation {
    id: number;
    name: string;
    relationship: string;
    description?: string;
    display_name?: string;
}

// ============================================================================
// Tab Configuration
// ============================================================================

const tabs = [
    {
        id: "overview",
        key: "overview",
        icon: HiOutlineViewColumns,
    },
    {
        id: "apis",
        key: "apis",
        icon: HiArrowTopRightOnSquare,
    },
    {
        id: "dependencies",
        key: "dependencies",
        icon: HiOutlineArrowsRightLeft,
    },
    {
        id: "metadata",
        key: "metadata",
        icon: HiOutlineTableCells,
    },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ============================================================================
// Helper Components
// ============================================================================

const TYPE_ICONS: Record<number, IconComponent> = {
    1: HiServerStack, // Service
    2: HiCloud, // Application
    3: HiCpuChip, // Worker
    4: HiCircleStack, // Database
    5: HiCog6Tooth, // Infrastructure
    6: HiOutlineCube, // Library
};

function getTypeIcon(typeId: number | null | undefined): IconComponent {
    return TYPE_ICONS[typeId ?? 0] || HiOutlineCube;
}

function getTypeColor(typeId: number | null | undefined): string {
    const colors: Record<number, string> = {
        1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        2: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        3: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        4: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        5: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        6: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    };
    return (
        colors[typeId ?? 0] ||
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    );
}

// ============================================================================
// Tab Navigation
// ============================================================================

function TabNavigation({
    activeTab,
    onTabChange,
    disabled = false,
}: {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    disabled?: boolean;
}) {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav
                className="-mb-px flex space-x-4 px-4 sm:px-6 overflow-x-auto"
                aria-label="Tabs"
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const t = useTranslations("sidebar");

                    return (
                        <button
                            key={tab.id}
                            onClick={() => !disabled && onTabChange(tab.id)}
                            disabled={disabled}
                            className={cn(
                                "group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                                isActive
                                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600",
                                disabled && "cursor-not-allowed opacity-50"
                            )}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive
                                        ? "text-primary-500"
                                        : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                                )}
                            />
                            {t(tab.key as string)}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

// ============================================================================
// Component Header
// ============================================================================

function ComponentHeader({
    component,
    componentType,
    lifecycle,
    locale,
}: {
    component: Component;
    componentType?: ComponentType;
    lifecycle?: Lifecycle;
    locale: string;
}) {
    const TypeIcon = getTypeIcon(component.type_id);
    const statusColor = getOperationalStatusColor(
        component.operational_status_id
    );

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 py-4">
                {/* Back link */}
                <Link
                    href={`/${locale}/components`}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
                >
                    <HiOutlineChevronLeft className="w-4 h-4" />
                    Volver a Componentes
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left: Icon + Title */}
                    <div className="flex items-start gap-4">
                        <div
                            className={cn(
                                "shrink-0 p-3 rounded-lg",
                                getTypeColor(component.type_id)
                            )}
                        >
                            {React.createElement(TypeIcon, {
                                className: "w-8 h-8",
                            })}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {component.display_name || component.name}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {component.slug}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                {componentType && (
                                    <Badge variant="secondary">
                                        {componentType.name}
                                    </Badge>
                                )}
                                {lifecycle && (
                                    <Badge variant="outline">
                                        {lifecycle.name}
                                    </Badge>
                                )}
                                {component.operational_status_id && (
                                    <Badge className={statusColor}>
                                        Operativo
                                    </Badge>
                                )}
                                {component.is_stateless && (
                                    <Badge
                                        variant="outline"
                                        className="flex items-center gap-1"
                                    >
                                        <HiBolt className="w-3 h-3" />
                                        Stateless
                                    </Badge>
                                )}
                                {component.has_zero_downtime_deployment && (
                                    <Badge
                                        variant="outline"
                                        className="flex items-center gap-1"
                                    >
                                        <HiShieldCheck className="w-3 h-3" />
                                        Zero Downtime
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${locale}/components/${component.id}/edit`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                            Editar
                        </Link>
                    </div>
                </div>

                {/* Description */}
                {component.description && (
                    <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-3xl">
                        {component.description}
                    </p>
                )}
            </div>
        </div>
    );
}

function ComponentHeaderSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 py-4">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="flex-1">
                        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
                        <div className="flex gap-2 mt-3">
                            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Tab Content Components
// ============================================================================

function OverviewContent({ component }: { component: Component }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4">
                    Información básica
                </h3>
                <dl className="space-y-4">
                    <div>
                        <dt className="text-sm text-gray-500 dark:text-gray-400">
                            Nombre
                        </dt>
                        <dd className="text-gray-900 dark:text-gray-100 font-medium">
                            {component.name}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-gray-500 dark:text-gray-400">
                            Slug
                        </dt>
                        <dd className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">
                            {component.slug}
                        </dd>
                    </div>
                    {component.display_name && (
                        <div>
                            <dt className="text-sm text-gray-500 dark:text-gray-400">
                                Nombre para mostrar
                            </dt>
                            <dd className="text-gray-900 dark:text-gray-100">
                                {component.display_name}
                            </dd>
                        </div>
                    )}
                </dl>
            </div>

            {/* Technical Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4">
                    Detalles técnicos
                </h3>
                <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-500 dark:text-gray-400">
                            Stateless
                        </dt>
                        <dd>
                            <Badge
                                variant={
                                    component.is_stateless
                                        ? "success"
                                        : "secondary"
                                }
                            >
                                {component.is_stateless ? "Sí" : "No"}
                            </Badge>
                        </dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-500 dark:text-gray-400">
                            Zero Downtime Deployment
                        </dt>
                        <dd>
                            <Badge
                                variant={
                                    component.has_zero_downtime_deployment
                                        ? "success"
                                        : "secondary"
                                }
                            >
                                {component.has_zero_downtime_deployment
                                    ? "Sí"
                                    : "No"}
                            </Badge>
                        </dd>
                    </div>
                    {component.tier_id && (
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-500 dark:text-gray-400">
                                Tier
                            </dt>
                            <dd>
                                <Badge variant="outline">
                                    Tier {component.tier_id}
                                </Badge>
                            </dd>
                        </div>
                    )}
                </dl>
            </div>

            {/* Timestamps */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Historial</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <dt className="text-sm text-gray-500 dark:text-gray-400">
                            Creado
                        </dt>
                        <dd className="text-gray-900 dark:text-gray-100">
                            {component.created_at
                                ? new Date(
                                      component.created_at
                                  ).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "-"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-gray-500 dark:text-gray-400">
                            Actualizado
                        </dt>
                        <dd className="text-gray-900 dark:text-gray-100">
                            {component.updated_at
                                ? new Date(
                                      component.updated_at
                                  ).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "-"}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

function ApisContent({
    component,
    locale,
}: {
    component: Component;
    locale: string;
}) {
    const [apis, setApis] = useState<ComponentApiRelation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadApis() {
            try {
                const response = await componentsApi.getApis(component.id);
                setApis(response.data || []);
            } catch (err) {
                console.error("Error loading component APIs:", err);
            } finally {
                setLoading(false);
            }
        }
        void loadApis();
    }, [component.id]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (apis.length === 0) {
        return (
            <div className="text-center py-12">
                <HiArrowTopRightOnSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No hay APIs asociadas
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Este componente aún no tiene APIs vinculadas.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">APIs ({apis.length})</h3>
            </div>
            <div className="grid gap-4">
                {apis.map((api) => (
                    <Link
                        key={api.id}
                        href={`/${locale}/apis/${api.id}`}
                        className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                    {api.display_name || api.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {api.description?.substring(0, 100)}
                                    {(api.description?.length || 0) > 100
                                        ? "..."
                                        : ""}
                                </p>
                            </div>
                            <HiArrowTopRightOnSquare className="w-5 h-5 text-gray-400" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function DependenciesContent() {
    return (
        <div className="text-center py-12">
            <HiOutlineArrowsRightLeft className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Dependencias
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
                La gestión de dependencias de componentes estará disponible
                próximamente.
            </p>
        </div>
    );
}

function MetadataContent({ component }: { component: Component }) {
    const metadata = [
        { key: "ID", value: component.id },
        { key: "type_id", value: component.type_id },
        { key: "lifecycle_id", value: component.lifecycle_id },
        { key: "domain_id", value: component.domain_id },
        { key: "owner_id", value: component.owner_id },
        { key: "platform_id", value: component.platform_id },
        { key: "tier_id", value: component.tier_id },
        { key: "status_id", value: component.status_id },
        {
            key: "operational_status_id",
            value: component.operational_status_id,
        },
        { key: "criticality_id", value: component.criticality_id },
        {
            key: "is_stateless",
            value: component.is_stateless ? "true" : "false",
        },
        {
            key: "has_zero_downtime_deployment",
            value: component.has_zero_downtime_deployment ? "true" : "false",
        },
        { key: "created_at", value: component.created_at },
        { key: "updated_at", value: component.updated_at },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold">
                    Metadatos del componente
                </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {metadata.map(({ key, value }) => (
                    <div
                        key={key}
                        className="px-6 py-3 flex items-center justify-between"
                    >
                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                            {key}
                        </span>
                        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {value?.toString() || "null"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TabContentSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
    );
}

function TabContent({
    activeTab,
    component,
    loading,
    locale,
}: {
    activeTab: TabId;
    component: Component | null;
    loading: boolean;
    locale: string;
}) {
    if (loading) {
        return (
            <div className="p-4 sm:p-6">
                <TabContentSkeleton />
            </div>
        );
    }

    if (!component) {
        return null;
    }

    return (
        <div className="p-4 sm:p-6">
            {activeTab === "overview" && (
                <OverviewContent component={component} />
            )}
            {activeTab === "apis" && (
                <ApisContent component={component} locale={locale} />
            )}
            {activeTab === "dependencies" && <DependenciesContent />}
            {activeTab === "metadata" && (
                <MetadataContent component={component} />
            )}
        </div>
    );
}

// ============================================================================
// Error State
// ============================================================================

function ErrorState({ message }: { message: string }) {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <HiOutlineExclamationCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Componente no disponible
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </div>
        </div>
    );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ComponentDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const idParam = params?.id;
    const componentId =
        typeof idParam === "string" ? parseInt(idParam, 10) : NaN;
    const locale = (params?.locale as string) || "es";

    // Get initial tab from URL or default to overview
    const tabParam = searchParams?.get("tab") as TabId | null;
    const initialTab = tabs.some((t) => t.id === tabParam)
        ? tabParam!
        : "overview";

    const [activeTab, setActiveTab] = useState<TabId>(initialTab);
    const [component, setComponent] = useState<Component | null>(null);
    const [componentType, setComponentType] = useState<
        ComponentType | undefined
    >();
    const [lifecycle, setLifecycle] = useState<Lifecycle | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Handle tab change with URL update
    const handleTabChange = useCallback(
        (tab: TabId) => {
            setActiveTab(tab);
            const url = new URL(window.location.href);
            if (tab === "overview") {
                url.searchParams.delete("tab");
            } else {
                url.searchParams.set("tab", tab);
            }
            router.replace(url.pathname + url.search, { scroll: false });
        },
        [router]
    );

    // Load component data
    useEffect(() => {
        if (!Number.isFinite(componentId)) {
            setError("Identificador de componente no válido.");
            setLoading(false);
            return;
        }

        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                // Load component
                const response = await componentsApi.getById(componentId);
                setComponent(response.data);

                // Load related data
                const [typesRes, lifecyclesRes] = await Promise.all([
                    componentTypesApi.getAll(),
                    lifecyclesApi.getAll(),
                ]);

                const foundType = typesRes.data.find(
                    (t) => t.id === response.data.type_id
                );
                const foundLifecycle = lifecyclesRes.data.find(
                    (l) => l.id === response.data.lifecycle_id
                );

                setComponentType(foundType);
                setLifecycle(foundLifecycle);
            } catch (err) {
                setError(
                    "No se pudo cargar el componente. Puede que no exista o no tengas permisos."
                );
                console.error("Error loading component:", err);
            } finally {
                setLoading(false);
            }
        }

        void loadData();
    }, [componentId]);

    // Error state
    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            {loading ? (
                <ComponentHeaderSkeleton />
            ) : (
                component && (
                    <ComponentHeader
                        component={component}
                        componentType={componentType}
                        lifecycle={lifecycle}
                        locale={locale}
                    />
                )
            )}

            {/* Tabs */}
            <TabNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                disabled={loading}
            />

            {/* Content */}
            <TabContent
                activeTab={activeTab}
                component={component}
                loading={loading}
                locale={locale}
            />
        </div>
    );
}
