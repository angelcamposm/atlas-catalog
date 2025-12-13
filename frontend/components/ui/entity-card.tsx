"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    HiCodeBracket,
    HiServerStack,
    HiServer,
    HiUserGroup,
    HiGlobeAlt,
    HiLink,
    HiDocumentText,
    HiCog6Tooth,
    HiCube,
    HiCircleStack,
    HiShieldCheck,
    HiBuildingOffice,
} from "react-icons/hi2";
import { Badge } from "./Badge";

// Entity types mapping to icons and colors
export type EntityType =
    | "api"
    | "service"
    | "cluster"
    | "node"
    | "team"
    | "environment"
    | "link"
    | "document"
    | "platform"
    | "resource"
    | "database"
    | "security"
    | "domain"
    | "custom";

interface EntityTypeConfig {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
}

const entityTypeConfig: Record<EntityType, EntityTypeConfig> = {
    api: {
        icon: HiCodeBracket,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        borderColor: "border-blue-200 dark:border-blue-800",
    },
    service: {
        icon: HiCube,
        color: "text-indigo-600 dark:text-indigo-400",
        bgColor: "bg-indigo-50 dark:bg-indigo-950",
        borderColor: "border-indigo-200 dark:border-indigo-800",
    },
    cluster: {
        icon: HiServerStack,
        color: "text-cyan-600 dark:text-cyan-400",
        bgColor: "bg-cyan-50 dark:bg-cyan-950",
        borderColor: "border-cyan-200 dark:border-cyan-800",
    },
    node: {
        icon: HiServer,
        color: "text-teal-600 dark:text-teal-400",
        bgColor: "bg-teal-50 dark:bg-teal-950",
        borderColor: "border-teal-200 dark:border-teal-800",
    },
    team: {
        icon: HiUserGroup,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-950",
        borderColor: "border-amber-200 dark:border-amber-800",
    },
    environment: {
        icon: HiGlobeAlt,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-950",
        borderColor: "border-green-200 dark:border-green-800",
    },
    link: {
        icon: HiLink,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-950",
        borderColor: "border-purple-200 dark:border-purple-800",
    },
    document: {
        icon: HiDocumentText,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-950",
        borderColor: "border-gray-200 dark:border-gray-800",
    },
    platform: {
        icon: HiCog6Tooth,
        color: "text-violet-600 dark:text-violet-400",
        bgColor: "bg-violet-50 dark:bg-violet-950",
        borderColor: "border-violet-200 dark:border-violet-800",
    },
    resource: {
        icon: HiCircleStack,
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-50 dark:bg-orange-950",
        borderColor: "border-orange-200 dark:border-orange-800",
    },
    database: {
        icon: HiCircleStack,
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-950",
        borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    security: {
        icon: HiShieldCheck,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-950",
        borderColor: "border-red-200 dark:border-red-800",
    },
    domain: {
        icon: HiBuildingOffice,
        color: "text-sky-600 dark:text-sky-400",
        bgColor: "bg-sky-50 dark:bg-sky-950",
        borderColor: "border-sky-200 dark:border-sky-800",
    },
    custom: {
        icon: HiCube,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-950",
        borderColor: "border-gray-200 dark:border-gray-800",
    },
};

export type EntityStatus = "active" | "deprecated" | "draft" | "retired" | "warning";

const statusConfig: Record<EntityStatus, { label: string; variant: "success" | "warning" | "danger" | "secondary" | "primary" }> = {
    active: { label: "Active", variant: "success" },
    deprecated: { label: "Deprecated", variant: "warning" },
    draft: { label: "Draft", variant: "secondary" },
    retired: { label: "Retired", variant: "danger" },
    warning: { label: "Warning", variant: "warning" },
};

export interface EntityCardProps {
    /** Entity type determines icon and color scheme */
    type: EntityType;
    /** Main title of the entity */
    title: string;
    /** Optional subtitle (e.g., version) */
    subtitle?: string;
    /** Description text */
    description?: string;
    /** Entity status */
    status?: EntityStatus;
    /** Owner information */
    owner?: {
        name: string;
        href?: string;
    };
    /** Additional metadata badges */
    tags?: Array<{
        label: string;
        variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    }>;
    /** Link to entity detail page */
    href?: string;
    /** Action buttons */
    actions?: Array<{
        label: string;
        onClick?: () => void;
        href?: string;
        variant?: "primary" | "secondary";
    }>;
    /** Custom icon component */
    customIcon?: React.ReactNode;
    /** Additional metadata items */
    metadata?: Array<{
        label: string;
        value: string | React.ReactNode;
        icon?: React.ReactNode;
    }>;
    /** Card size variant */
    size?: "sm" | "md" | "lg";
    /** Additional className */
    className?: string;
    /** Click handler for the whole card */
    onClick?: () => void;
}

export function EntityCard({
    type,
    title,
    subtitle,
    description,
    status,
    owner,
    tags = [],
    href,
    actions = [],
    customIcon,
    metadata = [],
    size = "md",
    className,
    onClick,
}: EntityCardProps) {
    const config = entityTypeConfig[type];
    const IconComponent = config.icon;

    const sizeClasses = {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
    };

    const iconSizes = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
    };

    const titleSizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    const baseClassName = cn(
        "group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
        href || onClick ? "cursor-pointer hover:shadow-md hover:border-primary/50" : "",
        config.borderColor,
        sizeClasses[size],
        className
    );

    const cardContent = (
        <>
            {/* Header */}
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                    className={cn(
                        "flex shrink-0 items-center justify-center rounded-lg",
                        config.bgColor,
                        iconSizes[size]
                    )}
                >
                    {customIcon || (
                        <IconComponent
                            className={cn("h-5 w-5", config.color)}
                        />
                    )}
                </div>

                {/* Title & Subtitle */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3
                            className={cn(
                                "font-semibold text-foreground truncate",
                                titleSizes[size]
                            )}
                        >
                            {title}
                        </h3>
                        {subtitle && (
                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {subtitle}
                            </span>
                        )}
                    </div>

                    {/* Status & Owner Row */}
                    <div className="flex items-center gap-2 mt-1">
                        {status && (
                            <Badge variant={statusConfig[status].variant}>
                                {statusConfig[status].label}
                            </Badge>
                        )}
                        {owner && (
                            <span className="text-xs text-muted-foreground">
                                {owner.href ? (
                                    <Link
                                        href={owner.href}
                                        className="hover:text-primary"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        👤 {owner.name}
                                    </Link>
                                ) : (
                                    <>👤 {owner.name}</>
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            {description && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {description}
                </p>
            )}

            {/* Metadata */}
            {metadata.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {metadata.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-1 text-xs text-muted-foreground"
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}:</span>
                            <span>{item.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {tags.map((tag, idx) => (
                        <Badge
                            key={idx}
                            variant={tag.variant || "secondary"}
                            className="text-xs"
                        >
                            {tag.label}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
                <div className="mt-4 pt-3 border-t flex items-center gap-2">
                    {actions.map((action, idx) => {
                        const ActionComponent = action.href ? Link : "button";
                        return (
                            <ActionComponent
                                key={idx}
                                href={action.href || ""}
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    action.onClick?.();
                                }}
                                className={cn(
                                    "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
                                    action.variant === "primary"
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                                )}
                            >
                                {action.label}
                            </ActionComponent>
                        );
                    })}
                </div>
            )}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={baseClassName}>
                {cardContent}
            </Link>
        );
    }

    return (
        <div
            className={baseClassName}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {cardContent}
        </div>
    );
}

// Grid layout component for entity cards
export interface EntityCardGridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}

export function EntityCardGrid({
    children,
    columns = 3,
    className,
}: EntityCardGridProps) {
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    return (
        <div className={cn("grid gap-4", gridCols[columns], className)}>
            {children}
        </div>
    );
}
