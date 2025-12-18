"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Highlight } from "@/components/ui/highlight";
import {
    HiServerStack,
    HiCube,
    HiCloud,
    HiCpuChip,
    HiCircleStack,
    HiCog6Tooth,
    HiEllipsisVertical,
    HiPencil,
    HiTrash,
    HiDocumentDuplicate,
    HiEye,
    HiBolt,
    HiShieldCheck,
} from "react-icons/hi2";
import type { Component, ComponentType } from "@/types/api";
import {
    getComponentDisplayName,
    getOperationalStatusColor,
} from "@/lib/api/components";

// ============================================================================
// Types
// ============================================================================

export interface ComponentCardProps {
    /** Component data */
    component: Component;
    /** Locale for URLs */
    locale: string;
    /** View mode */
    viewMode?: "grid" | "list";
    /** Show actions menu */
    showActions?: boolean;
    /** Whether this card is currently selected */
    isSelected?: boolean;
    /** Search query to highlight in text */
    searchQuery?: string;
    /** On click callback - if provided, prevents default navigation */
    onClick?: (component: Component) => void;
    /** On edit callback */
    onEdit?: (component: Component) => void;
    /** On delete callback */
    onDelete?: (component: Component) => void;
    /** On duplicate callback */
    onDuplicate?: (component: Component) => void;
    /** Additional className */
    className?: string;
    /** Component types for display */
    componentTypes?: ComponentType[];
    /** Lifecycles for display */
    lifecycles?: { id: number; name: string }[];
    /** Tiers for display */
    tiers?: { id: number; name: string }[];
    /** Operational statuses for display */
    operationalStatuses?: { id: number; name: string }[];
}

// ============================================================================
// Helpers
// ============================================================================

const typeIconMap: Record<string, React.ReactNode> = {
    service: <HiServerStack className="h-4 w-4" />,
    microservice: <HiCube className="h-4 w-4" />,
    api: <HiCloud className="h-4 w-4" />,
    library: <HiCircleStack className="h-4 w-4" />,
    database: <HiCpuChip className="h-4 w-4" />,
    default: <HiCog6Tooth className="h-4 w-4" />,
};

function getTypeIcon(typeName?: string): React.ReactNode {
    if (!typeName) return typeIconMap.default;
    const key = typeName.toLowerCase();
    return typeIconMap[key] || typeIconMap.default;
}

const typeColorMap: Record<string, string> = {
    service:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    microservice:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    api: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    library:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    database:
        "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    default:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function getTypeColor(typeName?: string): string {
    if (!typeName) return typeColorMap.default;
    const key = typeName.toLowerCase();
    return typeColorMap[key] || typeColorMap.default;
}

// ============================================================================
// Actions Menu Component
// ============================================================================

function ActionsMenu({
    component,
    onEdit,
    onDelete,
    onDuplicate,
}: {
    component: Component;
    onEdit?: (component: Component) => void;
    onDelete?: (component: Component) => void;
    onDuplicate?: (component: Component) => void;
}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
                <HiEllipsisVertical className="h-5 w-5 text-muted-foreground" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-md border bg-popover shadow-lg py-1">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit?.(component);
                            setIsOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                        <HiPencil className="h-4 w-4" />
                        Editar
                    </button>
                    {onDuplicate && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDuplicate(component);
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                            <HiDocumentDuplicate className="h-4 w-4" />
                            Duplicar
                        </button>
                    )}
                    <div className="my-1 border-t" />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete?.(component);
                            setIsOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <HiTrash className="h-4 w-4" />
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Component Card
// ============================================================================

export function ComponentCard({
    component,
    locale,
    viewMode = "grid",
    showActions = true,
    isSelected = false,
    searchQuery = "",
    onClick,
    onEdit,
    onDelete,
    onDuplicate,
    className,
    componentTypes,
    lifecycles,
    tiers,
    operationalStatuses,
}: ComponentCardProps) {
    const displayName = getComponentDisplayName(component);
    const typeName = componentTypes?.find((t) => t.id === component.type_id)?.name;
    const typeIcon = getTypeIcon(typeName);
    const typeColor = getTypeColor(typeName);
    const lifecycleName = lifecycles?.find(
        (l) => l.id === component.lifecycle_id
    )?.name;
    const tierName = tiers?.find((t) => t.id === component.tier_id)?.name;
    const operationalStatusName = operationalStatuses?.find(
        (s) => s.id === component.operational_status_id
    )?.name;

    const handleCardClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick(component);
        }
    };

    if (viewMode === "list") {
        return (
            <div
                onClick={handleCardClick}
                className={cn(
                    "group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm",
                    onClick && "cursor-pointer",
                    isSelected &&
                        "ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10",
                    className
                )}
            >
                {/* Icon */}
                <div
                    className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        typeColor
                    )}
                >
                    {typeIcon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${locale}/components/${component.slug || component.id}`}
                            className="font-semibold text-foreground hover:text-primary truncate"
                        >
                            <Highlight text={displayName} query={searchQuery} />
                        </Link>
                        {tierName && (
                            <Badge variant="secondary" className="text-xs">
                                {tierName}
                            </Badge>
                        )}
                        {operationalStatusName && (
                            <Badge
                                className={cn(
                                    "text-xs",
                                    getOperationalStatusColor(
                                        component.operational_status_id
                                    )
                                )}
                            >
                                {operationalStatusName}
                            </Badge>
                        )}
                    </div>
                    {component.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                            <Highlight
                                text={component.description}
                                query={searchQuery}
                            />
                        </p>
                    )}
                </div>

                {/* Type badge */}
                {typeName && (
                    <Badge className={cn("shrink-0", typeColor)}>
                        {typeName}
                    </Badge>
                )}

                {/* Lifecycle */}
                {lifecycleName && (
                    <span className="hidden lg:block text-xs text-muted-foreground">
                        {lifecycleName}
                    </span>
                )}

                {/* Features indicators */}
                <div className="hidden md:flex items-center gap-1.5">
                    {component.is_stateless && (
                        <span
                            title="Stateless"
                            className="p-1 rounded bg-green-100 dark:bg-green-900/30"
                        >
                            <HiBolt className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        </span>
                    )}
                    {component.has_zero_downtime_deployment && (
                        <span
                            title="Zero Downtime Deployment"
                            className="p-1 rounded bg-blue-100 dark:bg-blue-900/30"
                        >
                            <HiShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                    <Link
                        href={`/${locale}/components/${component.slug || component.id}`}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    >
                        <HiEye className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    {showActions && (
                        <ActionsMenu
                            component={component}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onDuplicate={onDuplicate}
                        />
                    )}
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div
            onClick={handleCardClick}
            className={cn(
                "group relative flex flex-col rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md",
                onClick && "cursor-pointer",
                isSelected &&
                    "ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div
                    className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        typeColor
                    )}
                >
                    {typeIcon}
                </div>
                {showActions && (
                    <ActionsMenu
                        component={component}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                    />
                )}
            </div>

            {/* Title & Badges */}
            <div className="mt-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href={`/${locale}/components/${component.slug || component.id}`}
                        className="font-semibold text-foreground hover:text-primary line-clamp-1"
                    >
                        <Highlight text={displayName} query={searchQuery} />
                    </Link>
                    {tierName && (
                        <Badge variant="secondary" className="text-xs">
                            {tierName}
                        </Badge>
                    )}
                </div>
                {/* Small metadata badges */}
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                    {typeName && (
                        <Badge className={cn("text-xs", typeColor)}>
                            {typeName}
                        </Badge>
                    )}
                    {lifecycleName && (
                        <Badge variant="outline" className="text-xs">
                            {lifecycleName}
                        </Badge>
                    )}
                    {operationalStatusName && (
                        <Badge
                            className={cn(
                                "text-xs",
                                getOperationalStatusColor(
                                    component.operational_status_id
                                )
                            )}
                        >
                            {operationalStatusName}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Description */}
            {component.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    <Highlight text={component.description} query={searchQuery} />
                </p>
            )}

            {/* Features */}
            <div className="mt-3 flex items-center gap-2">
                {component.is_stateless && (
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <HiBolt className="h-3.5 w-3.5" />
                        Stateless
                    </span>
                )}
                {component.has_zero_downtime_deployment && (
                    <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                        <HiShieldCheck className="h-3.5 w-3.5" />
                        Zero Downtime
                    </span>
                )}
            </div>

            {/* Footer actions */}
            <div className="mt-auto pt-4 border-t flex items-center justify-between">
                <Link
                    href={`/${locale}/components/${component.slug || component.id}`}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Ver detalles →
                </Link>
                <span className="text-xs text-muted-foreground">
                    {component.slug}
                </span>
            </div>
        </div>
    );
}

// ============================================================================
// Skeleton Loader
// ============================================================================

export function ComponentCardSkeleton({
    viewMode = "grid",
}: {
    viewMode?: "grid" | "list";
}) {
    if (viewMode === "list") {
        return (
            <div className="flex items-center gap-4 rounded-lg border bg-card p-4 animate-pulse">
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 rounded bg-muted" />
                    <div className="h-3 w-32 rounded bg-muted" />
                </div>
                <div className="h-6 w-20 rounded bg-muted" />
            </div>
        );
    }

    return (
        <div className="flex flex-col rounded-xl border bg-card p-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="h-6 w-6 rounded bg-muted" />
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="flex gap-2">
                    <div className="h-5 w-16 rounded bg-muted" />
                    <div className="h-5 w-20 rounded bg-muted" />
                </div>
            </div>
            <div className="mt-3 space-y-1.5">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
            </div>
            <div className="mt-auto pt-4 border-t flex justify-between">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-4 w-16 rounded bg-muted" />
            </div>
        </div>
    );
}

export default ComponentCard;
