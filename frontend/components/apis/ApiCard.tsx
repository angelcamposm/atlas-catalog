"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Highlight } from "@/components/ui/highlight";
import {
    HiCodeBracket,
    HiGlobeAlt,
    HiCloud,
    HiServerStack,
    HiCog6Tooth,
    HiArrowTopRightOnSquare,
    HiEllipsisVertical,
    HiPencil,
    HiTrash,
    HiDocumentDuplicate,
    HiEye,
} from "react-icons/hi2";
import type { Api } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ApiCardProps {
    /** API data */
    api: Api;
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
    onClick?: (api: Api) => void;
    /** On edit callback */
    onEdit?: (api: Api) => void;
    /** On delete callback */
    onDelete?: (api: Api) => void;
    /** On duplicate callback */
    onDuplicate?: (api: Api) => void;
    /** Additional className */
    className?: string;
    apiTypes?: { id: number; name: string }[];
    apiStatuses?: { id: number; name: string }[];
    apiCategories?: { id: number; name: string }[];
    accessPolicies?: { id: number; name: string }[];
    authenticationMethods?: { id: number; name: string }[];
}

// ============================================================================
// Helpers
// ============================================================================

const protocolConfig: Record<
    string,
    { icon: React.ReactNode; color: string; label: string }
> = {
    http: {
        icon: <HiGlobeAlt className="h-4 w-4" />,
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        label: "HTTP",
    },
    https: {
        icon: <HiGlobeAlt className="h-4 w-4" />,
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        label: "HTTPS",
    },
    rest: {
        icon: <HiCodeBracket className="h-4 w-4" />,
        color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        label: "REST",
    },
    graphql: {
        icon: <HiCloud className="h-4 w-4" />,
        color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
        label: "GraphQL",
    },
    grpc: {
        icon: <HiServerStack className="h-4 w-4" />,
        color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        label: "gRPC",
    },
    soap: {
        icon: <HiCog6Tooth className="h-4 w-4" />,
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        label: "SOAP",
    },
};

function getProtocolConfig(protocol: string | null | undefined) {
    const key = protocol?.toLowerCase() || "http";
    return protocolConfig[key] || protocolConfig.http;
}

function isDeprecated(api: Api): boolean {
    return api.deprecated_at !== null && api.deprecated_at !== undefined;
}

function formatDate(date: string | Date | null | undefined): string {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// ============================================================================
// Components
// ============================================================================

/** Dropdown menu for card actions */
function ActionsMenu({
    api,
    onEdit,
    onDelete,
    onDuplicate,
}: {
    api: Api;
    onEdit?: (api: Api) => void;
    onDelete?: (api: Api) => void;
    onDuplicate?: (api: Api) => void;
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
                            onEdit?.(api);
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
                                onDuplicate(api);
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
                            onDelete?.(api);
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

/** Grid view card */
export function ApiCard({
    api,
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
    apiTypes,
    apiStatuses,
    apiCategories,
    accessPolicies,
    authenticationMethods,
}: ApiCardProps) {
    const protocolCfg = getProtocolConfig(api.protocol);
    const deprecated = isDeprecated(api);

    // Handle card click - either custom onClick or navigate to detail
    const handleCardClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick(api);
        }
    };

    // Display name for highlighting
    const displayName = api.display_name || api.name;

    if (viewMode === "list") {
        return (
            <div
                onClick={handleCardClick}
                className={cn(
                    "group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm",
                    deprecated && "opacity-70",
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
                        protocolCfg.color
                    )}
                >
                    {protocolCfg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${locale}/apis/${api.id}`}
                            className="font-semibold text-foreground hover:text-primary truncate"
                        >
                            <Highlight text={displayName} query={searchQuery} />
                        </Link>
                        {api.version && (
                            <Badge variant="secondary" className="text-xs">
                                v{api.version}
                            </Badge>
                        )}
                        {deprecated && (
                            <Badge variant="warning" className="text-xs">
                                Deprecated
                            </Badge>
                        )}
                    </div>
                    {api.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                            <Highlight
                                text={api.description}
                                query={searchQuery}
                            />
                        </p>
                    )}
                </div>

                {/* Protocol badge */}
                <Badge className={cn("shrink-0", protocolCfg.color)}>
                    {protocolCfg.label}
                </Badge>

                {/* URL */}
                {api.url && (
                    <span className="hidden lg:block text-xs text-muted-foreground truncate max-w-[200px]">
                        {api.url}
                    </span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                    <Link
                        href={`/${locale}/apis/${api.id}`}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    >
                        <HiEye className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    {api.url && (
                        <a
                            href={api.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        >
                            <HiArrowTopRightOnSquare className="h-5 w-5 text-muted-foreground" />
                        </a>
                    )}
                    {showActions && (
                        <ActionsMenu
                            api={api}
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
                deprecated && "opacity-70",
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
                        protocolCfg.color
                    )}
                >
                    {protocolCfg.icon}
                </div>
                {showActions && (
                    <ActionsMenu
                        api={api}
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
                        href={`/${locale}/apis/${api.id}`}
                        className="font-semibold text-foreground hover:text-primary line-clamp-1"
                    >
                        <Highlight text={displayName} query={searchQuery} />
                    </Link>
                    {api.version && (
                        <Badge variant="secondary" className="text-xs">
                            v{api.version}
                        </Badge>
                    )}
                </div>
                {/* Small metadata badges */}
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                    {api.type_id && apiTypes && (
                        <Badge className="text-xs">
                            {apiTypes.find((t) => t.id === api.type_id)?.name ||
                                `Type ${api.type_id}`}
                        </Badge>
                    )}
                    {api.status_id && apiStatuses && (
                        <Badge className="text-xs">
                            {apiStatuses.find((s) => s.id === api.status_id)
                                ?.name || `Status ${api.status_id}`}
                        </Badge>
                    )}
                    {api.access_policy_id && accessPolicies && (
                        <Badge className="text-xs">
                            {accessPolicies.find(
                                (p) => p.id === api.access_policy_id
                            )?.name || `Policy ${api.access_policy_id}`}
                        </Badge>
                    )}
                </div>
                {deprecated && (
                    <Badge variant="warning" className="text-xs mt-1">
                        Deprecated{" "}
                        {api.deprecated_at &&
                            `• ${formatDate(api.deprecated_at)}`}
                    </Badge>
                )}
            </div>

            {/* Description */}
            {api.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    <Highlight text={api.description} query={searchQuery} />
                </p>
            )}

            {/* Metadata */}
            <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                <Badge className={cn("text-xs", protocolCfg.color)}>
                    {protocolCfg.label}
                </Badge>
                {api.url && (
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {api.url}
                    </span>
                )}
            </div>

            {/* Footer actions */}
            <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <Link
                    href={`/${locale}/apis/${api.id}`}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Ver detalles →
                </Link>
                {api.url && (
                    <a
                        href={api.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <HiArrowTopRightOnSquare className="h-3.5 w-3.5" />
                        Abrir
                    </a>
                )}
            </div>
        </div>
    );
}

/** Skeleton loader for ApiCard */
export function ApiCardSkeleton({
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
                    <div className="h-3 w-64 rounded bg-muted" />
                </div>
                <div className="h-6 w-16 rounded bg-muted" />
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card p-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="h-6 w-6 rounded bg-muted" />
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
            <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="h-5 w-16 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
            </div>
        </div>
    );
}

export default ApiCard;
