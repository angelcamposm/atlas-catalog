"use client";

import Link from "next/link";
import {
    HiOutlineArrowLeft,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineEllipsisVertical,
    HiOutlineLink,
    HiOutlineDocumentDuplicate,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineExclamationTriangle,
    HiOutlineClock,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { Api, ApiType, ApiStatus, Lifecycle, Group } from "@/types/api";
import { Protocol } from "@/types/api";
import { useState, useRef, useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

export interface ApiHeaderProps {
    api: Api;
    apiType?: ApiType | null;
    apiStatus?: ApiStatus | null;
    lifecycle?: Lifecycle | null;
    owner?: Group | null;
    locale: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    className?: string;
}

// ============================================================================
// Protocol Badge Component
// ============================================================================

function ProtocolBadge({ protocol }: { protocol: Protocol | null | undefined }) {
    const config = {
        [Protocol.HTTP]: {
            label: "HTTP",
            className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        },
        [Protocol.HTTPS]: {
            label: "HTTPS",
            className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        },
    };

    if (!protocol) {
        return (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                Sin protocolo
            </span>
        );
    }

    const { label, className } = config[protocol] || {
        label: protocol,
        className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };

    return (
        <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", className)}>
            {label}
        </span>
    );
}

// ============================================================================
// Status Badge Component
// ============================================================================

function StatusBadge({
    status,
    lifecycle,
}: {
    status?: ApiStatus | null;
    lifecycle?: Lifecycle | null;
}) {
    return (
        <div className="flex items-center gap-2">
            {status && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {status.name}
                </span>
            )}
            {lifecycle && (
                <span
                    className="px-2.5 py-1 text-xs font-medium rounded-full"
                    style={{
                        backgroundColor: lifecycle.color
                            ? `${lifecycle.color}20`
                            : undefined,
                        color: lifecycle.color || undefined,
                    }}
                >
                    {lifecycle.name}
                </span>
            )}
        </div>
    );
}

// ============================================================================
// Actions Menu Component
// ============================================================================

interface ActionsMenuProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    apiUrl?: string | null;
}

function ActionsMenu({ onEdit, onDelete, onDuplicate, apiUrl }: ActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const actions = [
        apiUrl && {
            icon: HiOutlineArrowTopRightOnSquare,
            label: "Abrir URL",
            onClick: () => window.open(apiUrl, "_blank"),
        },
        onDuplicate && {
            icon: HiOutlineDocumentDuplicate,
            label: "Duplicar API",
            onClick: onDuplicate,
        },
        onEdit && {
            icon: HiOutlinePencilSquare,
            label: "Editar API",
            onClick: onEdit,
        },
        onDelete && {
            icon: HiOutlineTrash,
            label: "Eliminar API",
            onClick: onDelete,
            danger: true,
        },
    ].filter(Boolean) as Array<{
        icon: typeof HiOutlineTrash;
        label: string;
        onClick: () => void;
        danger?: boolean;
    }>;

    if (actions.length === 0) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-2 rounded-lg transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "text-gray-500 dark:text-gray-400"
                )}
            >
                <HiOutlineEllipsisVertical className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                action.onClick();
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 text-sm",
                                "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                                action.danger
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-700 dark:text-gray-200"
                            )}
                        >
                            <action.icon className="w-4 h-4" />
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Main ApiHeader Component
// ============================================================================

export function ApiHeader({
    api,
    apiType,
    apiStatus,
    lifecycle,
    owner,
    locale,
    onEdit,
    onDelete,
    onDuplicate,
    className,
}: ApiHeaderProps) {
    const isDeprecated = !!api.deprecated_at;
    const deprecatedDate = api.deprecated_at
        ? new Date(api.deprecated_at).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <div className={cn("space-y-4", className)}>
            {/* Deprecation Warning */}
            {isDeprecated && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200">
                            API Deprecada
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Esta API fue marcada como deprecada el {deprecatedDate}.
                            {api.deprecation_reason && (
                                <> Motivo: {api.deprecation_reason}</>
                            )}
                        </p>
                    </div>
                </div>
            )}

            {/* Header Row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                    {/* Back Button */}
                    <Link
                        href={`/${locale}/apis`}
                        className={cn(
                            "p-2 rounded-lg transition-colors shrink-0",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "text-gray-500 dark:text-gray-400"
                        )}
                        title="Volver a APIs"
                    >
                        <HiOutlineArrowLeft className="w-5 h-5" />
                    </Link>

                    {/* Title and Info */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                                {api.display_name || api.name}
                            </h1>
                            <ProtocolBadge protocol={api.protocol} />
                            {api.version && (
                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                    v{api.version}
                                </span>
                            )}
                        </div>

                        {/* Subtitle */}
                        {api.display_name && api.display_name !== api.name && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {api.name}
                            </p>
                        )}

                        {/* Meta info */}
                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                            <StatusBadge status={apiStatus} lifecycle={lifecycle} />

                            {apiType && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Tipo: <span className="font-medium">{apiType.name}</span>
                                </span>
                            )}

                            {owner && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Owner: <span className="font-medium">{owner.name}</span>
                                </span>
                            )}
                        </div>

                        {/* URL */}
                        {api.url && (
                            <div className="flex items-center gap-2 mt-3">
                                <HiOutlineLink className="w-4 h-4 text-gray-400" />
                                <a
                                    href={api.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline truncate max-w-md"
                                >
                                    {api.url}
                                </a>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                                <HiOutlineClock className="w-3.5 h-3.5" />
                                Creada:{" "}
                                {new Date(api.created_at).toLocaleDateString(locale)}
                            </span>
                            <span>
                                Actualizada:{" "}
                                {new Date(api.updated_at).toLocaleDateString(locale)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                                "bg-primary-600 hover:bg-primary-700 text-white font-medium"
                            )}
                        >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                            <span className="hidden sm:inline">Editar</span>
                        </button>
                    )}

                    <ActionsMenu
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                        apiUrl={api.url}
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// ApiHeader Skeleton
// ============================================================================

export function ApiHeaderSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
                    <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
