"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    HiOutlineTag,
    HiEllipsisVertical,
    HiPencil,
    HiTrash,
    HiOutlineSquare3Stack3D,
} from "react-icons/hi2";
import type { ApiType } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ApiTypeCardProps {
    /** API Type data */
    apiType: ApiType;
    /** Locale for URLs */
    locale: string;
    /** View mode */
    viewMode?: "grid" | "list";
    /** Whether this card is currently selected */
    isSelected?: boolean;
    /** On click callback */
    onClick?: (apiType: ApiType) => void;
    /** On edit callback */
    onEdit?: (apiType: ApiType) => void;
    /** On delete callback */
    onDelete?: (apiType: ApiType) => void;
    /** Number of APIs using this type */
    apisCount?: number;
    /** Additional className */
    className?: string;
}

// ============================================================================
// Type Icons Configuration
// ============================================================================

const typeIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    rest: {
        icon: <HiOutlineTag className="h-5 w-5" />,
        color: "bg-blue-500",
    },
    graphql: {
        icon: <HiOutlineTag className="h-5 w-5" />,
        color: "bg-pink-500",
    },
    grpc: {
        icon: <HiOutlineTag className="h-5 w-5" />,
        color: "bg-orange-500",
    },
    soap: {
        icon: <HiOutlineTag className="h-5 w-5" />,
        color: "bg-gray-500",
    },
    websocket: {
        icon: <HiOutlineTag className="h-5 w-5" />,
        color: "bg-purple-500",
    },
    webhook: {
        icon: <HiOutlineTag className="h-5 w-5" />,
        color: "bg-green-500",
    },
    default: {
        icon: <HiOutlineTag className="h-5 w-5" />,
        color: "bg-primary-500",
    },
};

function getTypeConfig(name: string) {
    const key = name.toLowerCase().replace(/\s+/g, "");
    return typeIcons[key] || typeIcons.default;
}

// ============================================================================
// Actions Menu Component
// ============================================================================

function ActionsMenu({
    apiType,
    onEdit,
    onDelete,
}: {
    apiType: ApiType;
    onEdit?: (apiType: ApiType) => void;
    onDelete?: (apiType: ApiType) => void;
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
                                onEdit(apiType);
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
                                onDelete(apiType);
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
// Grid Card Component
// ============================================================================

function GridCard({
    apiType,
    isSelected,
    onClick,
    onEdit,
    onDelete,
    apisCount = 0,
    className,
}: Omit<ApiTypeCardProps, "locale" | "viewMode">) {
    const config = getTypeConfig(apiType.name);

    return (
        <div
            onClick={() => onClick?.(apiType)}
            className={cn(
                "group relative flex flex-col p-4 rounded-xl border bg-card transition-all duration-200",
                "hover:shadow-md hover:border-primary/30",
                onClick && "cursor-pointer",
                isSelected && "ring-2 ring-primary border-primary shadow-md",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
                {/* Icon */}
                <div
                    className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-lg text-white",
                        config.color
                    )}
                >
                    {config.icon}
                </div>

                {/* Actions */}
                <ActionsMenu
                    apiType={apiType}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>

            {/* Name */}
            <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                {apiType.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                {apiType.description || "Sin descripción"}
            </p>

            {/* Footer - APIs count */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                <HiOutlineSquare3Stack3D className="h-4 w-4" />
                <span>{apisCount} APIs</span>
            </div>
        </div>
    );
}

// ============================================================================
// List Card Component
// ============================================================================

function ListCard({
    apiType,
    isSelected,
    onClick,
    onEdit,
    onDelete,
    apisCount = 0,
    className,
}: Omit<ApiTypeCardProps, "locale" | "viewMode">) {
    const config = getTypeConfig(apiType.name);

    return (
        <div
            onClick={() => onClick?.(apiType)}
            className={cn(
                "group flex items-center gap-4 p-4 rounded-xl border bg-card transition-all duration-200",
                "hover:shadow-md hover:border-primary/30",
                onClick && "cursor-pointer",
                isSelected && "ring-2 ring-primary border-primary shadow-md",
                className
            )}
        >
            {/* Icon */}
            <div
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg text-white shrink-0",
                    config.color
                )}
            >
                {config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                    {apiType.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                    {apiType.description || "Sin descripción"}
                </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <HiOutlineSquare3Stack3D className="h-4 w-4" />
                <span>{apisCount} APIs</span>
            </div>

            {/* Actions */}
            <ActionsMenu
                apiType={apiType}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export function ApiTypeCard({
    apiType,
    locale,
    viewMode = "grid",
    isSelected,
    onClick,
    onEdit,
    onDelete,
    apisCount,
    className,
}: ApiTypeCardProps) {
    const CardComponent = viewMode === "grid" ? GridCard : ListCard;

    return (
        <CardComponent
            apiType={apiType}
            isSelected={isSelected}
            onClick={onClick}
            onEdit={onEdit}
            onDelete={onDelete}
            apisCount={apisCount}
            className={className}
        />
    );
}

// ============================================================================
// Skeleton Component
// ============================================================================

export function ApiTypeCardSkeleton({
    viewMode = "grid",
}: {
    viewMode?: "grid" | "list";
}) {
    if (viewMode === "list") {
        return (
            <div className="flex items-center gap-4 p-4 rounded-xl border bg-card animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-48 bg-muted rounded" />
                </div>
                <div className="h-4 w-16 bg-muted rounded" />
            </div>
        );
    }

    return (
        <div className="flex flex-col p-4 rounded-xl border bg-card animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="w-6 h-6 rounded bg-muted" />
            </div>
            <div className="h-5 w-24 bg-muted rounded mb-2" />
            <div className="space-y-2 mb-3 flex-1">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
            </div>
            <div className="pt-2 border-t border-border">
                <div className="h-3 w-16 bg-muted rounded" />
            </div>
        </div>
    );
}
