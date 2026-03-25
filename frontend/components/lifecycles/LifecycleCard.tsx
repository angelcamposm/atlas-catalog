"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    HiOutlineCircleStack,
    HiEllipsisVertical,
    HiPencil,
    HiTrash,
    HiLockClosed,
    HiLockOpen,
} from "react-icons/hi2";
import type { Lifecycle } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface LifecycleCardProps {
    /** Lifecycle data */
    lifecycle: Lifecycle;
    /** Locale for URLs */
    locale: string;
    /** View mode */
    viewMode?: "grid" | "list";
    /** Whether this card is currently selected */
    isSelected?: boolean;
    /** On click callback */
    onClick?: (lifecycle: Lifecycle) => void;
    /** On edit callback */
    onEdit?: (lifecycle: Lifecycle) => void;
    /** On delete callback */
    onDelete?: (lifecycle: Lifecycle) => void;
    /** Number of components using this lifecycle */
    componentsCount?: number;
    /** Additional className */
    className?: string;
}

// ============================================================================
// Predefined Colors Configuration
// ============================================================================

const predefinedColors: Record<
    string,
    { bg: string; text: string; border: string }
> = {
    blue: {
        bg: "bg-blue-500",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500",
    },
    green: {
        bg: "bg-green-500",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500",
    },
    yellow: {
        bg: "bg-yellow-500",
        text: "text-yellow-600 dark:text-yellow-400",
        border: "border-yellow-500",
    },
    orange: {
        bg: "bg-orange-500",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500",
    },
    red: {
        bg: "bg-red-500",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500",
    },
    purple: {
        bg: "bg-purple-500",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500",
    },
    pink: {
        bg: "bg-pink-500",
        text: "text-pink-600 dark:text-pink-400",
        border: "border-pink-500",
    },
    gray: {
        bg: "bg-gray-500",
        text: "text-gray-600 dark:text-gray-400",
        border: "border-gray-500",
    },
    indigo: {
        bg: "bg-indigo-500",
        text: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-500",
    },
    teal: {
        bg: "bg-teal-500",
        text: "text-teal-600 dark:text-teal-400",
        border: "border-teal-500",
    },
};

function getColorConfig(color: string | null | undefined) {
    if (!color) return predefinedColors.gray;
    const key = color.toLowerCase().replace(/\s+/g, "");
    return predefinedColors[key] || predefinedColors.gray;
}

// ============================================================================
// Actions Menu Component
// ============================================================================

function ActionsMenu({
    lifecycle,
    onEdit,
    onDelete,
}: {
    lifecycle: Lifecycle;
    onEdit?: (lifecycle: Lifecycle) => void;
    onDelete?: (lifecycle: Lifecycle) => void;
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
                <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
                    {onEdit && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEdit(lifecycle);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                            <HiPencil className="h-4 w-4" />
                            Editar
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(lifecycle);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <HiTrash className="h-4 w-4" />
                            Eliminar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Approval Badge Component
// ============================================================================

function ApprovalBadge({ required }: { required: boolean }) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                required
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            )}
        >
            {required ? (
                <>
                    <HiLockClosed className="h-3 w-3" />
                    Requiere aprobación
                </>
            ) : (
                <>
                    <HiLockOpen className="h-3 w-3" />
                    Sin aprobación
                </>
            )}
        </div>
    );
}

// ============================================================================
// Grid Card Component
// ============================================================================

function GridCard({
    lifecycle,
    isSelected,
    onClick,
    onEdit,
    onDelete,
    componentsCount = 0,
    className,
}: Omit<LifecycleCardProps, "locale" | "viewMode">) {
    const colorConfig = getColorConfig(lifecycle.color);

    return (
        <div
            onClick={() => onClick?.(lifecycle)}
            className={cn(
                "group relative flex flex-col p-4 rounded-xl border bg-card transition-all duration-200",
                "hover:shadow-md hover:border-primary/30",
                onClick && "cursor-pointer",
                isSelected && "ring-2 ring-primary border-primary shadow-md",
                className
            )}
        >
            {/* Color indicator bar */}
            <div
                className={cn(
                    "absolute top-0 left-4 right-4 h-1 rounded-b-full",
                    colorConfig.bg
                )}
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3 mt-2">
                {/* Icon with color */}
                <div
                    className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-lg text-white",
                        colorConfig.bg
                    )}
                >
                    <HiOutlineCircleStack className="h-5 w-5" />
                </div>

                {/* Actions */}
                <ActionsMenu
                    lifecycle={lifecycle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>

            {/* Name */}
            <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                {lifecycle.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                {lifecycle.description || "Sin descripción"}
            </p>

            {/* Approval badge */}
            <div className="mb-3">
                <ApprovalBadge
                    required={lifecycle.approval_required ?? false}
                />
            </div>

            {/* Footer - Components count */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                <HiOutlineCircleStack className="h-4 w-4" />
                <span>{componentsCount} Componentes</span>
            </div>
        </div>
    );
}

// ============================================================================
// List Card Component
// ============================================================================

function ListCard({
    lifecycle,
    isSelected,
    onClick,
    onEdit,
    onDelete,
    componentsCount = 0,
    className,
}: Omit<LifecycleCardProps, "locale" | "viewMode">) {
    const colorConfig = getColorConfig(lifecycle.color);

    return (
        <div
            onClick={() => onClick?.(lifecycle)}
            className={cn(
                "group flex items-center gap-4 p-4 rounded-xl border bg-card transition-all duration-200",
                "hover:shadow-md hover:border-primary/30",
                onClick && "cursor-pointer",
                isSelected && "ring-2 ring-primary border-primary shadow-md",
                className
            )}
        >
            {/* Color indicator */}
            <div
                className={cn("w-1 h-12 rounded-full shrink-0", colorConfig.bg)}
            />

            {/* Icon */}
            <div
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg text-white shrink-0",
                    colorConfig.bg
                )}
            >
                <HiOutlineCircleStack className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                        {lifecycle.name}
                    </h3>
                    <ApprovalBadge
                        required={lifecycle.approval_required ?? false}
                    />
                </div>
                <p className="text-sm text-muted-foreground truncate">
                    {lifecycle.description || "Sin descripción"}
                </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <HiOutlineCircleStack className="h-4 w-4" />
                <span>{componentsCount}</span>
            </div>

            {/* Actions */}
            <ActionsMenu
                lifecycle={lifecycle}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export function LifecycleCard({
    lifecycle,
    locale,
    viewMode = "grid",
    isSelected,
    onClick,
    onEdit,
    onDelete,
    componentsCount,
    className,
}: LifecycleCardProps) {
    const CardComponent = viewMode === "grid" ? GridCard : ListCard;

    return (
        <CardComponent
            lifecycle={lifecycle}
            isSelected={isSelected}
            onClick={onClick}
            onEdit={onEdit}
            onDelete={onDelete}
            componentsCount={componentsCount}
            className={className}
        />
    );
}

// ============================================================================
// Skeleton Component
// ============================================================================

export function LifecycleCardSkeleton({
    viewMode = "grid",
}: {
    viewMode?: "grid" | "list";
}) {
    if (viewMode === "list") {
        return (
            <div className="flex items-center gap-4 p-4 rounded-xl border bg-card animate-pulse">
                <div className="w-1 h-12 rounded-full bg-muted" />
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-5 w-24 bg-muted rounded-full" />
                    </div>
                    <div className="h-3 w-48 bg-muted rounded" />
                </div>
                <div className="h-4 w-8 bg-muted rounded" />
            </div>
        );
    }

    return (
        <div className="flex flex-col p-4 rounded-xl border bg-card animate-pulse">
            <div className="h-1 w-full bg-muted rounded-b-full mb-2" />
            <div className="flex items-start justify-between mb-3 mt-2">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="w-6 h-6 rounded bg-muted" />
            </div>
            <div className="h-5 w-24 bg-muted rounded mb-2" />
            <div className="space-y-2 mb-3 flex-1">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
            </div>
            <div className="h-5 w-28 bg-muted rounded-full mb-3" />
            <div className="pt-2 border-t border-border">
                <div className="h-3 w-20 bg-muted rounded" />
            </div>
        </div>
    );
}
