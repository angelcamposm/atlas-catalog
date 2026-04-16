/**
 * Component Detail Page (lean rewrite — Phase 1).
 *
 * Loads a single component via `useResourceDetail` and renders the shared
 * catalog sub-components. No next-intl. No motion. No tabs for now (kept
 * out of scope until a dedicated Phase 1 iteration covers APIs/Resources/
 * Releases/Audit tabs with their own tests).
 */

"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { componentsApi } from "@/lib/api/components";
import type { ComponentWithRelations } from "@/lib/api/components";
import { useResourceDetail } from "@/hooks/use-resource";
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
} from "@/components/catalog/component-detail";

// Default lifecycle phases rendered when the component has no lifecycle data.
const LIFECYCLE_PHASES: LifecyclePhase[] = [
    { id: 1, name: "Plan", color: "#3b82f6" },
    { id: 2, name: "Phase In", color: "#8b5cf6" },
    { id: 3, name: "Active", color: "#22c55e" },
    { id: 4, name: "Phase Out", color: "#f59e0b" },
    { id: 5, name: "End of Life", color: "#ef4444" },
];

function computeProfileCompletion(component: ComponentWithRelations): number {
    return (
        (component.description ? 20 : 0) +
        (component.type_id ? 15 : 0) +
        (component.lifecycle_id ? 15 : 0) +
        (component.domain_id ? 15 : 0) +
        (component.platform_id ? 15 : 0) +
        (component.owner_id ? 20 : 0)
    );
}

function LoadingState() {
    return (
        <div
            role="status"
            aria-label="Cargando componente"
            className="min-h-[300px] flex items-center justify-center"
        >
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    );
}

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

export default function ComponentDetailPage() {
    const params = useParams();
    const locale = (params?.locale as string) || "es";
    const idParam = (params?.id as string) || "";

    // One-arg fetcher for useResourceDetail; includes the relations needed by
    // the detail sections in a single request.
    const fetcher = useCallback(
        (slug: string) =>
            componentsApi.getBySlug(slug, [
                "domain",
                "platform",
                "owner",
                "tier",
                "status",
                "apis",
            ]),
        [],
    );

    const {
        data: component,
        loading,
        error,
    } = useResourceDetail(fetcher, idParam || null);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message="No se pudo cargar el componente." />;
    if (!component) {
        return <ErrorState message="El componente solicitado no existe." />;
    }

    const owner: Owner | undefined = component.owner
        ? {
              id: component.owner.id,
              name: component.owner.name,
              email: null,
              avatar: null,
          }
        : undefined;

    const profileCompletion = computeProfileCompletion(component);
    const infoPercentage = component.description ? 100 : 50;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <ComponentDetailHeader
                component={component}
                owner={owner}
                componentType={undefined}
                lifecycle={undefined}
                profileCompletion={profileCompletion}
                locale={locale}
            />

            <div className="space-y-4 p-4 sm:p-6">
                <InformationSection
                    component={component}
                    percentage={infoPercentage}
                    defaultExpanded
                />

                <OtherDetailsSection
                    component={component}
                    componentType={undefined}
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
                    owner={owner}
                    percentage={0}
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
                            ? { id: component.tier.id, name: component.tier.name }
                            : undefined
                    }
                    percentage={0}
                    defaultExpanded
                />

                <LifecycleTimeline
                    phases={LIFECYCLE_PHASES}
                    currentPhaseId={component.lifecycle?.id}
                    defaultExpanded
                />

                <DeploymentsSection deployments={[]} defaultExpanded />

                <DependenciesSection dependencies={[]} defaultExpanded />
            </div>
        </div>
    );
}
