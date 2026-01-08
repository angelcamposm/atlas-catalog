/**
 * Component Detail Page Components
 *
 * This module exports all the section components used in the component detail page.
 * Following the wireframe design with collapsible sections:
 * - Information (Name and Description)
 * - Other Details (Category, Framework, Owner, Platform, Tags)
 * - Business Support (Domain, Criticality, TIMs)
 * - Lifecycle (Timeline with phases)
 * - Deployments (Environment matrix)
 * - Dependencies (Provides, Consumes, Imports, Required by)
 */

"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    HiOutlineInformationCircle,
    HiOutlineSquare3Stack3D,
    HiOutlineBuildingOffice,
    HiOutlineClock,
    HiOutlineServerStack,
    HiOutlineArrowsRightLeft,
    HiOutlinePencilSquare,
    HiOutlineTag,
    HiOutlineUserCircle,
    HiOutlineCube,
    HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import {
    CollapsibleSection,
    SectionField,
    SectionFieldGrid,
} from "@/components/ui/collapsible-section";
import type {
    Component,
    ComponentType,
    Lifecycle,
    Platform,
    Framework,
    BusinessDomain,
} from "@/types/api";

// ============================================================================
// Types
// ============================================================================

interface Owner {
    id: number;
    name: string | null | undefined;
    email?: string | null;
    avatar?: string | null;
}

interface BusinessCriticality {
    id: number;
    name: string;
}

interface LifecyclePhase {
    id: number;
    name: string;
    date?: string | null;
    color?: string | null;
}

interface Deployment {
    id: number;
    environment: {
        id: number;
        name: string;
        label?: string | null;
    };
    release_id: number;
    version?: string;
    deployed_at: string;
    deployed_by: number;
}

interface Dependency {
    id: number;
    name: string;
    type?: string;
    description?: string;
}

// ============================================================================
// ComponentDetailHeader
// ============================================================================

interface ComponentDetailHeaderProps {
    component: Component;
    owner?: Owner | null;
    componentType?: ComponentType | null;
    lifecycle?: Lifecycle | null;
    profileCompletion?: number;
    locale: string;
    stats?: {
        earnings?: number;
        projects?: number;
        successRate?: number;
    };
}

export function ComponentDetailHeader({
    component,
    owner,
    componentType,
    lifecycle,
    profileCompletion,
    locale,
    stats,
}: ComponentDetailHeaderProps) {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 py-4">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Link
                        href={`/${locale}`}
                        className="hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        Home
                    </Link>
                    <span className="mx-2">›</span>
                    <Link
                        href={`/${locale}/components`}
                        className="hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        Components
                    </Link>
                    <span className="mx-2">›</span>
                    <span className="text-gray-900 dark:text-gray-100">
                        Component Details
                    </span>
                </nav>

                {/* Title row */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        {/* Owner Avatar */}
                        {owner && (
                            <div className="shrink-0">
                                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                    {owner.avatar ? (
                                        <img
                                            src={owner.avatar}
                                            alt={owner.name || "Owner"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <HiOutlineUserCircle className="w-10 h-10 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="min-w-0">
                            {/* Component name */}
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {component.display_name || component.name}
                            </h1>

                            {/* Owner info row */}
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {owner && (
                                    <>
                                        <span className="font-medium text-primary-600 dark:text-primary-400">
                                            {owner.name}
                                        </span>
                                        {owner.email && (
                                            <>
                                                <span>•</span>
                                                <span>{owner.email}</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Stats row */}
                            {stats && (
                                <div className="flex items-center gap-6 mt-3">
                                    {stats.earnings !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                $
                                                {stats.earnings.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Earnings
                                            </span>
                                        </div>
                                    )}
                                    {stats.projects !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {stats.projects}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Projects
                                            </span>
                                        </div>
                                    )}
                                    {stats.successRate !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                %{stats.successRate}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Success Rate
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

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
                            </div>
                        </div>
                    </div>

                    {/* Right side: Actions and Profile Completion */}
                    <div className="flex flex-col items-end gap-3">
                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/${locale}/components/${component.slug}/edit`}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Follow
                            </Link>
                            <Link
                                href={`/${locale}/components/${component.slug}/edit`}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                            >
                                Hire Me
                            </Link>
                        </div>

                        {/* Profile Completion */}
                        {typeof profileCompletion === "number" && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Profile Completion
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500 rounded-full transition-all"
                                            style={{
                                                width: `${profileCompletion}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                        {profileCompletion}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// InformationSection
// ============================================================================

interface InformationSectionProps {
    component: Component;
    percentage?: number;
    defaultExpanded?: boolean;
}

export function InformationSection({
    component,
    percentage,
    defaultExpanded = false,
}: InformationSectionProps) {
    return (
        <CollapsibleSection
            title="Information"
            icon={HiOutlineInformationCircle}
            percentage={percentage}
            defaultExpanded={defaultExpanded}
        >
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Name and Description
                    </h4>
                    <SectionFieldGrid>
                        <SectionField label="Name" value={component.name} />
                        <SectionField
                            label="Description"
                            value={
                                component.description || (
                                    <span className="text-gray-400 dark:text-gray-500">
                                        —
                                    </span>
                                )
                            }
                        />
                    </SectionFieldGrid>
                </div>
            </div>
        </CollapsibleSection>
    );
}

// ============================================================================
// OtherDetailsSection
// ============================================================================

interface OtherDetailsSectionProps {
    component: Component;
    componentType?: ComponentType | null;
    platform?: Platform | null;
    framework?: Framework | null;
    owner?: Owner | null;
    percentage?: number;
    defaultExpanded?: boolean;
}

export function OtherDetailsSection({
    component,
    componentType,
    platform,
    framework,
    owner,
    percentage,
    defaultExpanded = false,
}: OtherDetailsSectionProps) {
    // Parse tags if they exist
    const tags = component.tags
        ? Object.entries(component.tags).map(
              ([key, value]) => `${key}: ${value}`
          )
        : [];

    return (
        <CollapsibleSection
            title="Other Details"
            icon={HiOutlineSquare3Stack3D}
            percentage={percentage}
            defaultExpanded={defaultExpanded}
        >
            <SectionFieldGrid>
                <SectionField
                    label="Category"
                    value={
                        componentType ? (
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                    {componentType.name}
                                </Badge>
                            </div>
                        ) : null
                    }
                />
                <SectionField
                    label="Framework"
                    value={
                        framework ? (
                            <div className="flex items-center gap-2">
                                <HiOutlineCube className="w-4 h-4 text-gray-400" />
                                <span>{framework.name}</span>
                            </div>
                        ) : null
                    }
                />
                <SectionField
                    label="Owner"
                    value={
                        owner ? (
                            <div className="flex items-center gap-2">
                                <HiOutlineUserCircle className="w-4 h-4 text-gray-400" />
                                <span className="text-primary-600 dark:text-primary-400">
                                    {owner.name}
                                </span>
                            </div>
                        ) : null
                    }
                />
                <SectionField
                    label="Platform"
                    value={
                        platform ? (
                            <div className="flex items-center gap-2">
                                <HiOutlineGlobeAlt className="w-4 h-4 text-gray-400" />
                                <Badge variant="outline">{platform.name}</Badge>
                            </div>
                        ) : null
                    }
                />
                <SectionField
                    label="Tags"
                    value={
                        tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        <HiOutlineTag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        ) : null
                    }
                />
            </SectionFieldGrid>
        </CollapsibleSection>
    );
}

// ============================================================================
// BusinessSupportSection
// ============================================================================

interface BusinessSupportSectionProps {
    component: Component;
    businessDomain?: BusinessDomain | null;
    businessCriticality?: BusinessCriticality | null;
    businessTIM?: string | null;
    functionalTIM?: string | null;
    percentage?: number;
    defaultExpanded?: boolean;
}

export function BusinessSupportSection({
    component,
    businessDomain,
    businessCriticality,
    businessTIM,
    functionalTIM,
    percentage,
    defaultExpanded = false,
}: BusinessSupportSectionProps) {
    return (
        <CollapsibleSection
            title="Business Support"
            icon={HiOutlineBuildingOffice}
            percentage={percentage}
            defaultExpanded={defaultExpanded}
        >
            <SectionFieldGrid>
                <SectionField
                    label="Business Domain"
                    value={
                        businessDomain ? (
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                    {businessDomain.display_name ||
                                        businessDomain.name}
                                </Badge>
                            </div>
                        ) : null
                    }
                />
                <SectionField
                    label="Business Criticality"
                    value={
                        businessCriticality ? (
                            <Badge
                                variant="secondary"
                                className={cn(
                                    businessCriticality.id >= 3 &&
                                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                )}
                            >
                                {businessCriticality.name}
                            </Badge>
                        ) : null
                    }
                />
                <SectionField
                    label="Business TIM"
                    value={
                        businessTIM ? (
                            <Badge variant="outline">{businessTIM}</Badge>
                        ) : null
                    }
                />
                <SectionField
                    label="Functional TIM"
                    value={
                        functionalTIM ? (
                            <Badge variant="outline">{functionalTIM}</Badge>
                        ) : null
                    }
                />
            </SectionFieldGrid>
        </CollapsibleSection>
    );
}

// ============================================================================
// LifecycleTimeline
// ============================================================================

interface LifecycleTimelineProps {
    phases: LifecyclePhase[];
    currentPhaseId?: number | null;
    percentage?: number;
    defaultExpanded?: boolean;
}

export function LifecycleTimeline({
    phases,
    currentPhaseId,
    percentage,
    defaultExpanded = false,
}: LifecycleTimelineProps) {
    const currentIndex = phases.findIndex((p) => p.id === currentPhaseId);

    return (
        <CollapsibleSection
            title="Lifecycle"
            icon={HiOutlineClock}
            percentage={percentage}
            defaultExpanded={defaultExpanded}
        >
            <div className="space-y-4">
                {/* Phase labels */}
                <div className="flex justify-between text-xs font-medium">
                    {phases.map((phase, index) => (
                        <div
                            key={phase.id}
                            className={cn(
                                "flex flex-col items-center",
                                index <= currentIndex
                                    ? "text-gray-900 dark:text-gray-100"
                                    : "text-gray-400 dark:text-gray-500"
                            )}
                        >
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1 px-2 py-1 rounded",
                                    phase.id === currentPhaseId &&
                                        "font-semibold"
                                )}
                                style={
                                    phase.id === currentPhaseId && phase.color
                                        ? {
                                              backgroundColor: `${phase.color}20`,
                                              color: phase.color,
                                          }
                                        : undefined
                                }
                            >
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            phase.color || "#9ca3af",
                                    }}
                                />
                                {phase.name}
                            </span>
                            {phase.date && (
                                <span className="mt-1 text-[10px] text-gray-500">
                                    {phase.date}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                        {phases.map((phase, index) => {
                            const isCompleted = index < currentIndex;
                            const isCurrent = index === currentIndex;
                            const width = `${100 / phases.length}%`;

                            return (
                                <div
                                    key={phase.id}
                                    className={cn(
                                        "h-full transition-colors",
                                        index < phases.length - 1 &&
                                            "border-r border-white dark:border-gray-800"
                                    )}
                                    style={{
                                        width,
                                        backgroundColor:
                                            isCompleted || isCurrent
                                                ? phase.color || "#9ca3af"
                                                : "transparent",
                                    }}
                                />
                            );
                        })}
                    </div>
                    {/* Current position indicator */}
                    {currentIndex >= 0 && (
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-900 border-2 rounded-full shadow-sm transition-all"
                            style={{
                                left: `calc(${
                                    ((currentIndex + 0.5) / phases.length) * 100
                                }% - 8px)`,
                                borderColor:
                                    phases[currentIndex]?.color || "#9ca3af",
                            }}
                        />
                    )}
                </div>

                {/* Timeline scale */}
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 px-4">
                    {[
                        "Jan 2026",
                        "Apr 2026",
                        "Jul 2026",
                        "Oct 2026",
                        "Jan 2027",
                        "Apr 2027",
                        "Jul 2027",
                        "Oct 2027",
                        "Jan 2028",
                        "Apr 2028",
                        "Jul 2028",
                    ].map((label, i) => (
                        <span key={i}>{label}</span>
                    ))}
                </div>
            </div>
        </CollapsibleSection>
    );
}

// ============================================================================
// DeploymentsSection
// ============================================================================

interface DeploymentsSectionProps {
    deployments: Deployment[];
    applicationName?: string;
    percentage?: number;
    defaultExpanded?: boolean;
}

export function DeploymentsSection({
    deployments,
    applicationName,
    percentage,
    defaultExpanded = false,
}: DeploymentsSectionProps) {
    // Group deployments by environment
    const environments = Array.from(
        new Map(
            deployments.map((d) => [d.environment.id, d.environment])
        ).values()
    );

    // Sort environments by common order
    const envOrder = ["DLT", "INT", "UAT", "TTA", "PRD"];
    environments.sort((a, b) => {
        const aIndex = envOrder.indexOf(a.name);
        const bIndex = envOrder.indexOf(b.name);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    return (
        <CollapsibleSection
            title="Deployments"
            icon={HiOutlineServerStack}
            percentage={percentage}
            defaultExpanded={defaultExpanded}
        >
            {deployments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No deployments found
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">
                                    Application Environments
                                </th>
                                {environments.map((env) => (
                                    <th
                                        key={env.id}
                                        className="text-center py-2 px-3 font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        {env.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100 dark:border-gray-700/50">
                                <td className="py-3 px-3 text-gray-700 dark:text-gray-300">
                                    {applicationName || "Application"}
                                </td>
                                {environments.map((env) => {
                                    const deployment = deployments.find(
                                        (d) => d.environment.id === env.id
                                    );
                                    return (
                                        <td
                                            key={env.id}
                                            className="text-center py-3 px-3"
                                        >
                                            {deployment?.version ? (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {deployment.version}
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </CollapsibleSection>
    );
}

// ============================================================================
// DependenciesSection
// ============================================================================

interface DependenciesSectionProps {
    provides: Dependency[];
    consumes: Dependency[];
    imports: Dependency[];
    requiredBy: Dependency[];
    percentage?: number;
    defaultExpanded?: boolean;
}

export function DependenciesSection({
    provides,
    consumes,
    imports,
    requiredBy,
    percentage,
    defaultExpanded = false,
}: DependenciesSectionProps) {
    const totalCount =
        provides.length + consumes.length + imports.length + requiredBy.length;

    const renderDependencyList = (
        title: string,
        items: Dependency[],
        emptyText: string
    ) => (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {title}
            </h4>
            {items.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {emptyText}
                </p>
            ) : (
                <div className="space-y-1">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                        >
                            <Badge variant="secondary" className="text-xs">
                                {item.type || "component"}
                            </Badge>
                            <span className="text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                                {item.name}
                            </span>
                            {item.description && (
                                <span className="text-gray-400 dark:text-gray-500 truncate">
                                    - {item.description}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <CollapsibleSection
            title="Dependencies"
            icon={HiOutlineArrowsRightLeft}
            percentage={percentage}
            defaultExpanded={defaultExpanded}
        >
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total dependencies:
                </span>
                <Badge variant="secondary">{totalCount}</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {renderDependencyList(
                    "Provides",
                    provides,
                    "What are consumers of is? No Desc"
                )}
                {renderDependencyList(
                    "Consumes",
                    consumes,
                    "What are consumers of is? No Desc"
                )}
                {renderDependencyList(
                    "Imports",
                    imports,
                    "What are IT modules or services?"
                )}
                {renderDependencyList(
                    "Required by",
                    requiredBy,
                    "What are IT modules or services?"
                )}
            </div>
        </CollapsibleSection>
    );
}

// ============================================================================
// Export all components
// ============================================================================

export {
    type Owner,
    type BusinessCriticality,
    type LifecyclePhase,
    type Deployment,
    type Dependency,
};
