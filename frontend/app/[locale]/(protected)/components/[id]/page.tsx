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
import { lifecyclesApi } from "@/lib/api/lifecycles";
import type { Component, ComponentType, Lifecycle, Platform } from "@/types/api";
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
import {
    ComponentDetailHeader,
    InformationSection,
    OtherDetailsSection,
    BusinessSupportSection,
    LifecycleTimeline,
    DeploymentsSection,
    DependenciesSection,
} from "@/components/catalog/component-detail";
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
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
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
    component: Component;
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
    // Mock lifecycle phases based on actual lifecycle data
    const lifecyclePhases: LifecyclePhase[] = [
        { id: 1, name: "Plan", date: "2027-01-11", color: "#3b82f6" },
        { id: 2, name: "Phase In", date: "2027-05-30", color: "#8b5cf6" },
        { id: 3, name: "Active", date: "2027-09-03", color: "#22c55e" },
        { id: 4, name: "Phase Out", date: "2029-04-20", color: "#f59e0b" },
        { id: 5, name: "End of Life", date: "2029-10-31", color: "#ef4444" },
    ];

    // Mock deployments - in real app, this would come from API
    const mockDeployments: Deployment[] = [
        {
            id: 1,
            environment: { id: 1, name: "DLT", label: "Development" },
            release_id: 1,
            version: "1.1.8",
            deployed_at: "2026-01-07T10:00:00Z",
            deployed_by: 1,
        },
        {
            id: 2,
            environment: { id: 2, name: "INT", label: "Integration" },
            release_id: 2,
            version: "1.1.8",
            deployed_at: "2026-01-06T15:00:00Z",
            deployed_by: 1,
        },
        {
            id: 3,
            environment: { id: 3, name: "UAT", label: "UAT" },
            release_id: 3,
            version: "1.1.8",
            deployed_at: "2026-01-05T09:00:00Z",
            deployed_by: 1,
        },
        {
            id: 4,
            environment: { id: 4, name: "TTA", label: "TTA" },
            release_id: 4,
            version: "1.1.8",
            deployed_at: "2026-01-04T09:00:00Z",
            deployed_by: 1,
        },
        {
            id: 5,
            environment: { id: 5, name: "PRD", label: "Production" },
            release_id: 5,
            version: "1.1.8",
            deployed_at: "2026-01-03T09:00:00Z",
            deployed_by: 1,
        },
    ];

    // Mock dependencies - in real app, this would come from API
    const mockProvides: Dependency[] = [
        { id: 1, name: "User Authentication API", type: "api" },
        { id: 2, name: "OAuth2 Provider", type: "api" },
    ];

    const mockConsumes: Dependency[] = [
        { id: 3, name: "database-service", type: "component" },
        { id: 4, name: "cache-service", type: "component" },
    ];

    const mockImports: Dependency[] = [
        { id: 5, name: "logging-library", type: "library" },
    ];

    const mockRequiredBy: Dependency[] = [
        { id: 6, name: "api-gateway", type: "component" },
        { id: 7, name: "web-frontend", type: "component" },
    ];

    // Calculate completion percentages (mock - would be calculated from actual data)
    const infoPercentage = component.description ? 100 : 50;
    const detailsPercentage = componentType ? 80 : 40;
    const businessPercentage = component.domain_id ? 60 : 20;

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
                owner={owner}
                percentage={detailsPercentage}
                defaultExpanded
            />

            <BusinessSupportSection
                component={component}
                businessDomain={
                    component.domain_id
                        ? {
                              id: component.domain_id,
                              name: "Corporate / Human Resources",
                              display_name: "Human Resources",
                              description: null,
                              parent_id: null,
                              created_at: "",
                              updated_at: "",
                          }
                        : undefined
                }
                businessCriticality={
                    component.criticality_id
                        ? { id: component.criticality_id, name: "Tier 2 - Mission Critical" }
                        : undefined
                }
                businessTIM="BU-1"
                functionalTIM="FT-1"
                percentage={businessPercentage}
                defaultExpanded
            />

            <LifecycleTimeline
                phases={lifecyclePhases}
                currentPhaseId={lifecycle?.id || 3}
                defaultExpanded
            />

            <DeploymentsSection
                deployments={mockDeployments}
                applicationName={component.name}
                defaultExpanded
            />

            <DependenciesSection
                provides={mockProvides}
                consumes={mockConsumes}
                imports={mockImports}
                requiredBy={mockRequiredBy}
                defaultExpanded
            />
        </div>
    );
}

// ============================================================================
// APIs Tab Content
// ============================================================================

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
            <div className="p-6 space-y-4">
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
                                    {(api.description?.length || 0) > 100 ? "..." : ""}
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
// Placeholder Tab Contents
// ============================================================================

function ResourcesContent() {
    return (
        <div className="text-center py-16">
            <HiOutlineDocumentText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Resources
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
                Documentation, links and resources will be displayed here.
            </p>
        </div>
    );
}

function ReleasesContent() {
    return (
        <div className="text-center py-16">
            <HiOutlineClock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Releases
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
                Release history and version information will be displayed here.
            </p>
        </div>
    );
}

function AuditLogContent() {
    return (
        <div className="text-center py-16">
            <HiOutlineClipboardDocumentList className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Audit Log
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
                Change history and audit trail will be displayed here.
            </p>
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
    component: Component | null;
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

    // Mock owner data - in real app this would come from API
    const mockOwner: Owner = {
        id: 1,
        name: "Eugenia",
        email: "eugenia@test.com",
        avatar: null,
    };

    switch (activeTab) {
        case "details":
            return (
                <DetailsContent
                    component={component}
                    componentType={componentType}
                    lifecycle={lifecycle}
                    owner={mockOwner}
                />
            );
        case "apis":
            return <ApisContent component={component} locale={locale} />;
        case "resources":
            return <ResourcesContent />;
        case "releases":
            return <ReleasesContent />;
        case "audit":
            return <AuditLogContent />;
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
    const initialTab = tabs.some((t) => t.id === tabParam) ? tabParam! : "details";

    const [activeTab, setActiveTab] = useState<TabId>(initialTab);
    const [component, setComponent] = useState<Component | null>(null);
    const [componentType, setComponentType] = useState<ComponentType | undefined>();
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
        if (!idParam) {
            setError(t("errors.invalidId"));
            setLoading(false);
            return;
        }

        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                // Load component using slug (idParam is the slug from the URL)
                const response = await componentsApi.getBySlug(idParam as string);
                setComponent(response.data);

                // Load related data
                const [typesRes, lifecyclesRes] = await Promise.all([
                    componentTypesApi.getAll(),
                    lifecyclesApi.getAll(),
                ]);

                const foundType = typesRes.data.find((t) => t.id === response.data.type_id);
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

    // Mock owner for header
    const mockOwner: Owner = {
        id: 1,
        name: "Eugenia",
        email: "eugenia@test.com",
        avatar: null,
    };

    // Calculate profile completion
    const profileCompletion = component
        ? Math.round(
              ((component.description ? 20 : 0) +
                  (component.type_id ? 15 : 0) +
                  (component.lifecycle_id ? 15 : 0) +
                  (component.domain_id ? 15 : 0) +
                  (component.platform_id ? 15 : 0) +
                  (component.owner_id ? 20 : 0)) /
                  100 *
                  100
          )
        : 0;

    // Format last update
    const lastUpdate = component?.updated_at
        ? `${Math.floor((Date.now() - new Date(component.updated_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`
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
                        owner={mockOwner}
                        componentType={componentType}
                        lifecycle={lifecycle}
                        profileCompletion={profileCompletion}
                        locale={locale}
                        stats={{
                            earnings: 4500,
                            projects: 75,
                            successRate: 60,
                        }}
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
