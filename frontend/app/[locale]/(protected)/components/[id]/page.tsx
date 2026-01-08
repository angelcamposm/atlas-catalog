/**
 * Component Detail Page
 *
 * Displays detailed information about a component including:
 * - Header with owner info, badges, stats and profile completion
 * - Tabs: Details, APIs, Resources, Releases, Audit Log
 * - Collapsible sections: Information, Other Details, Business Support, Lifecycle, Deployments, Dependencies
 *
 * Based on wireframe design with collapsible sections and timeline visualization.
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { componentsApi, componentTypesApi } from "@/lib/api/components";
import type {
    ComponentWithRelations,
    ComponentResource,
    ComponentRelease,
    ComponentAuditEntry,
} from "@/lib/api/components";
import { lifecyclesApi } from "@/lib/api/lifecycles";
import type { ComponentType, Lifecycle, Platform } from "@/types/api";
import { cn } from "@/lib/utils";
import {
    HiOutlineViewColumns,
    HiOutlineArrowsRightLeft,
    HiOutlineTableCells,
    HiOutlineExclamationCircle,
    HiArrowTopRightOnSquare,
    HiOutlineDocumentText,
    HiOutlineClock,
    HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/loading";
import {
    ComponentDetailHeader,
    InformationSection,
    OtherDetailsSection,
    BusinessSupportSection,
    LifecycleTimeline,
    DeploymentsSection,
    DependenciesSection,
} from "@/components/catalog/component-detail";
import { EmptyState } from "@/components/ui/empty-state";
import type {
    Owner,
    LifecyclePhase,
    Deployment,
    Dependency,
} from "@/components/catalog/component-detail";

// ============================================================================
// Types
// ============================================================================

interface ComponentApiRelation {
    id: number;
    name: string;
    relationship: string;
    description?: string;
    display_name?: string;
}

// ============================================================================
// Tab Loading State Component
// ============================================================================

interface TabLoadingStateProps {
    message?: string;
}

function TabLoadingState({
    message = "Cargando información...",
}: TabLoadingStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <Spinner size="lg" variant="circle" color="primary" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {message}
            </p>
        </div>
    );
}

// ============================================================================
// Tab Configuration
// ============================================================================

const tabs = [
    {
        id: "details",
        key: "details",
        icon: HiOutlineViewColumns,
        label: "Details",
    },
    {
        id: "apis",
        key: "apis",
        icon: HiArrowTopRightOnSquare,
        label: "APIs",
    },
    {
        id: "resources",
        key: "resources",
        icon: HiOutlineDocumentText,
        label: "Resources",
    },
    {
        id: "releases",
        key: "releases",
        icon: HiOutlineClock,
        label: "Releases",
    },
    {
        id: "audit",
        key: "audit",
        icon: HiOutlineClipboardDocumentList,
        label: "Audit Log",
    },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ============================================================================
// Tab Navigation
// ============================================================================

function TabNavigation({
    activeTab,
    onTabChange,
    disabled = false,
    lastUpdate,
}: {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    disabled?: boolean;
    lastUpdate?: string;
}) {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 sm:px-6">
                <nav
                    className="-mb-px flex space-x-6 overflow-x-auto"
                    aria-label="Tabs"
                >
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => !disabled && onTabChange(tab.id)}
                                disabled={disabled}
                                className={cn(
                                    "group inline-flex items-center gap-2 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                                    isActive
                                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300",
                                    disabled && "cursor-not-allowed opacity-50"
                                )}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Last Update indicator */}
                {lastUpdate && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        Last Update ({lastUpdate})
                    </span>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// Details Tab Content (Main content with collapsible sections)
// ============================================================================

interface DetailsContentProps {
    component: ComponentWithRelations;
    componentType?: ComponentType;
    lifecycle?: Lifecycle;
    platform?: Platform;
    owner?: Owner;
}

function DetailsContent({
    component,
    componentType,
    lifecycle,
    owner,
}: DetailsContentProps) {
    // Use lifecycle phases from component relations if available, otherwise show defaults
    const lifecyclePhases: LifecyclePhase[] = [
        { id: 1, name: "Plan", color: "#3b82f6" },
        { id: 2, name: "Phase In", color: "#8b5cf6" },
        { id: 3, name: "Active", color: "#22c55e" },
        { id: 4, name: "Phase Out", color: "#f59e0b" },
        { id: 5, name: "End of Life", color: "#ef4444" },
    ];

    // Calculate completion percentages based on actual data
    const infoPercentage = component.description ? 100 : 50;
    const detailsPercentage = calculateDetailsCompletion(
        component,
        componentType
    );
    const businessPercentage = calculateBusinessCompletion(component);

    // Get owner from component relations or fallback to prop
    const componentOwner: Owner | undefined = component.owner
        ? {
              id: component.owner.id,
              name: component.owner.name,
              email: null,
              avatar: null,
          }
        : owner;

    return (
        <div className="space-y-4 p-4 sm:p-6">
            <InformationSection
                component={component}
                percentage={infoPercentage}
                defaultExpanded
            />

            <OtherDetailsSection
                component={component}
                componentType={componentType}
                platform={
                    component.platform
                        ? {
                              id: component.platform.id,
                              name: component.platform.name,
                              description: null,
                              icon: null,
                              created_at: "",
                              updated_at: "",
                          }
                        : undefined
                }
                owner={componentOwner}
                percentage={detailsPercentage}
                defaultExpanded
            />

            <BusinessSupportSection
                component={component}
                businessDomain={
                    component.domain
                        ? {
                              id: component.domain.id,
                              name: component.domain.name,
                              display_name: component.domain.name,
                              description: null,
                              parent_id: null,
                              created_at: "",
                              updated_at: "",
                          }
                        : undefined
                }
                businessCriticality={
                    component.tier
                        ? {
                              id: component.tier.id,
                              name: component.tier.name,
                          }
                        : undefined
                }
                percentage={businessPercentage}
                defaultExpanded
            />

            <LifecycleTimeline
                phases={lifecyclePhases}
                currentPhaseId={lifecycle?.id || component.lifecycle?.id}
                defaultExpanded
            />

            <DeploymentsSection
                deployments={[]}
                applicationName={component.name}
                defaultExpanded
            />

            <DependenciesSection
                provides={
                    component.apis?.map((api) => ({
                        id: api.id,
                        name: api.name,
                        type: "api",
                    })) || []
                }
                consumes={[]}
                imports={[]}
                requiredBy={[]}
                defaultExpanded
            />
        </div>
    );
}

/**
 * Calculate completion percentage for Other Details section
 */
function calculateDetailsCompletion(
    component: ComponentWithRelations,
    componentType?: ComponentType
): number {
    let score = 0;
    const total = 5; // type, platform, owner, tags, stateless

    if (componentType || component.type) score++;
    if (component.platform) score++;
    if (component.owner) score++;
    if (component.tags && Object.keys(component.tags).length > 0) score++;
    if (component.is_stateless !== undefined) score++;

    return Math.round((score / total) * 100);
}

/**
 * Calculate completion percentage for Business Support section
 */
function calculateBusinessCompletion(
    component: ComponentWithRelations
): number {
    let score = 0;
    const total = 3; // domain, tier/criticality, status

    if (component.domain) score++;
    if (component.tier || component.criticality_id) score++;
    if (component.status) score++;

    return Math.round((score / total) * 100);
}

// ============================================================================
// APIs Tab Content
// ============================================================================

function ApisContent({
    component,
    locale,
}: {
    component: ComponentWithRelations;
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
        return <TabLoadingState message="Cargando APIs del componente..." />;
    }

    if (apis.length === 0) {
        return (
            <div className="text-center py-16">
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
        <div className="p-6 space-y-4">
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

// ============================================================================
// Resources Tab Content
// ============================================================================

function ResourcesContent({
    component,
}: {
    component: ComponentWithRelations;
}) {
    const [resources, setResources] = useState<ComponentResource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadResources() {
            try {
                const response = await componentsApi.getResources(component.id);
                setResources(response.data || []);
            } catch (err) {
                console.error("Error loading component resources:", err);
            } finally {
                setLoading(false);
            }
        }
        void loadResources();
    }, [component.id]);

    if (loading) {
        return (
            <TabLoadingState message="Cargando recursos del componente..." />
        );
    }

    if (resources.length === 0) {
        return (
            <EmptyState
                type="no-data"
                title="Recursos"
                description="Documentación, enlaces y recursos del componente se mostrarán aquí."
                size="md"
                icon={<HiOutlineDocumentText className="w-full h-full" />}
            />
        );
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                    Recursos ({resources.length})
                </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-start gap-3">
                            <HiOutlineDocumentText className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {resource.name}
                                </h4>
                                {resource.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {resource.description}
                                    </p>
                                )}
                                {resource.category && (
                                    <Badge variant="secondary" className="mt-2">
                                        {resource.category}
                                    </Badge>
                                )}
                            </div>
                            {resource.url && (
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-700"
                                >
                                    <HiArrowTopRightOnSquare className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Releases Tab Content
// ============================================================================

function ReleasesContent({ component }: { component: ComponentWithRelations }) {
    const [releases, setReleases] = useState<ComponentRelease[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReleases() {
            try {
                const response = await componentsApi.getReleases(component.id);
                setReleases(response.data || []);
            } catch (err) {
                console.error("Error loading component releases:", err);
            } finally {
                setLoading(false);
            }
        }
        void loadReleases();
    }, [component.id]);

    if (loading) {
        return <TabLoadingState message="Cargando historial de releases..." />;
    }

    if (releases.length === 0) {
        return (
            <EmptyState
                type="no-data"
                title="Releases"
                description="Historial de versiones e información de releases se mostrará aquí."
                size="md"
                icon={<HiOutlineClock className="w-full h-full" />}
            />
        );
    }

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "deployed":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "rollback":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
            case "pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "failed":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
        }
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                    Releases ({releases.length})
                </h3>
            </div>
            <div className="space-y-4">
                {releases.map((release) => (
                    <div
                        key={release.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                                            v{release.version}
                                        </span>
                                        {release.is_latest && (
                                            <Badge variant="primary">
                                                Latest
                                            </Badge>
                                        )}
                                        {release.status && (
                                            <Badge
                                                variant="secondary"
                                                className={getStatusColor(
                                                    release.status
                                                )}
                                            >
                                                {release.status}
                                            </Badge>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(
                                            release.release_date
                                        ).toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                            {release.environment && (
                                <Badge variant="outline">
                                    {release.environment}
                                </Badge>
                            )}
                        </div>
                        {release.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                                {release.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Audit Log Tab Content
// ============================================================================

function AuditLogContent({ component }: { component: ComponentWithRelations }) {
    const [auditLog, setAuditLog] = useState<ComponentAuditEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAuditLog() {
            try {
                const response = await componentsApi.getAuditLog(component.id);
                setAuditLog(response.data || []);
            } catch (err) {
                console.error("Error loading component audit log:", err);
            } finally {
                setLoading(false);
            }
        }
        void loadAuditLog();
    }, [component.id]);

    if (loading) {
        return <TabLoadingState message="Cargando registro de auditoría..." />;
    }

    if (auditLog.length === 0) {
        return (
            <EmptyState
                type="no-data"
                title="Registro de Auditoría"
                description="Historial de cambios y trazabilidad se mostrará aquí."
                size="md"
                icon={
                    <HiOutlineClipboardDocumentList className="w-full h-full" />
                }
            />
        );
    }

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case "create":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "update":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "delete":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
        }
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                    Registro de Auditoría ({auditLog.length})
                </h3>
            </div>
            <div className="space-y-3">
                {auditLog.map((entry) => (
                    <div
                        key={entry.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant="secondary"
                                    className={getActionColor(entry.action)}
                                >
                                    {entry.action}
                                </Badge>
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {entry.actor}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(entry.timestamp).toLocaleString(
                                    "es-ES"
                                )}
                            </span>
                        </div>
                        {entry.field && (
                            <div className="mt-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                    Campo:{" "}
                                </span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {entry.field}
                                </span>
                                {entry.old_value && entry.new_value && (
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {" "}
                                        ({entry.old_value} → {entry.new_value})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Tab Content Router
// ============================================================================

function TabContent({
    activeTab,
    component,
    componentType,
    lifecycle,
    loading,
    locale,
}: {
    activeTab: TabId;
    component: ComponentWithRelations | null;
    componentType?: ComponentType;
    lifecycle?: Lifecycle;
    loading: boolean;
    locale: string;
}) {
    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
        );
    }

    if (!component) {
        return null;
    }

    // Get owner from component relations if available
    const componentOwner: Owner | undefined = component.owner
        ? {
              id: component.owner.id,
              name: component.owner.name,
              email: null,
              avatar: null,
          }
        : undefined;

    switch (activeTab) {
        case "details":
            return (
                <DetailsContent
                    component={component}
                    componentType={componentType}
                    lifecycle={lifecycle}
                    owner={componentOwner}
                />
            );
        case "apis":
            return <ApisContent component={component} locale={locale} />;
        case "resources":
            return <ResourcesContent component={component} />;
        case "releases":
            return <ReleasesContent component={component} />;
        case "audit":
            return <AuditLogContent component={component} />;
        default:
            return null;
    }
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
// Header Skeleton
// ============================================================================

function HeaderSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
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
    );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ComponentDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const t = useTranslations("componentDetail");

    const idParam = params?.id;
    const locale = (params?.locale as string) || "es";

    // Get initial tab from URL or default to details
    const tabParam = searchParams?.get("tab") as TabId | null;
    const initialTab = tabs.some((t) => t.id === tabParam)
        ? tabParam!
        : "details";

    const [activeTab, setActiveTab] = useState<TabId>(initialTab);
    const [component, setComponent] = useState<ComponentWithRelations | null>(
        null
    );
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
            if (tab === "details") {
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
        console.log(
            "🔵 ComponentDetailPage useEffect triggered with idParam:",
            idParam
        );
        if (!idParam) {
            setError(t("errors.invalidId"));
            setLoading(false);
            return;
        }

        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                console.log("📡 Fetching component by slug:", idParam);
                // Load component using slug (idParam is the slug from the URL)
                // Include relations for complete data
                const response = await componentsApi.getBySlug(
                    idParam as string,
                    ["domain", "platform", "owner", "tier", "status", "apis"]
                );
                console.log("✅ Component loaded:", {
                    id: response.data.id,
                    name: response.data.name,
                    slug: response.data.slug,
                });
                setComponent(response.data);

                // Load related data for dropdowns/selectors
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
                setError(t("errors.loadFailed"));
                console.error("Error loading component:", err);
            } finally {
                setLoading(false);
            }
        }

        void loadData();
    }, [idParam, t]);

    // Get owner from component relations if available
    const headerOwner: Owner | undefined = component?.owner
        ? {
              id: component.owner.id,
              name: component.owner.name,
              email: null,
              avatar: null,
          }
        : undefined;

    // Calculate profile completion
    const profileCompletion = component
        ? Math.round(
              (((component.description ? 20 : 0) +
                  (component.type_id ? 15 : 0) +
                  (component.lifecycle_id ? 15 : 0) +
                  (component.domain_id ? 15 : 0) +
                  (component.platform_id ? 15 : 0) +
                  (component.owner_id ? 20 : 0)) /
                  100) *
                  100
          )
        : 0;

    // Format last update
    const lastUpdate = component?.updated_at
        ? `${Math.floor(
              (Date.now() - new Date(component.updated_at).getTime()) /
                  (1000 * 60 * 60 * 24)
          )} days ago`
        : undefined;

    // Error state
    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            {loading ? (
                <HeaderSkeleton />
            ) : (
                component && (
                    <ComponentDetailHeader
                        component={component}
                        owner={headerOwner}
                        componentType={componentType}
                        lifecycle={lifecycle}
                        profileCompletion={profileCompletion}
                        locale={locale}
                    />
                )
            )}

            {/* Tabs */}
            <TabNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                disabled={loading}
                lastUpdate={lastUpdate}
            />

            {/* Content */}
            <TabContent
                activeTab={activeTab}
                component={component}
                componentType={componentType}
                lifecycle={lifecycle}
                loading={loading}
                locale={locale}
            />
        </div>
    );
}
