"use client";

import { useState } from "react";
import {
    HiOutlineInformationCircle,
    HiOutlineBookOpen,
    HiOutlineCog6Tooth,
    HiOutlineTag,
    HiOutlineUserGroup,
    HiOutlineChevronRight,
    HiOutlineClipboardDocument,
    HiOutlineCheckCircle,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { Api, ApiType, ApiStatus, Lifecycle, Group } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ApiOverviewProps {
    api: Api;
    apiType?: ApiType | null;
    apiStatus?: ApiStatus | null;
    lifecycle?: Lifecycle | null;
    owner?: Group | null;
    className?: string;
}

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
    copyable?: boolean;
}

interface InfoSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

// ============================================================================
// InfoRow Component
// ============================================================================

function InfoRow({ label, value, copyable }: InfoRowProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (typeof value === "string") {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex items-start justify-between py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900 dark:text-white font-medium text-right">
                    {value || "—"}
                </span>
                {copyable && typeof value === "string" && value && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title={copied ? "¡Copiado!" : "Copiar"}
                    >
                        {copied ? (
                            <HiOutlineCheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <HiOutlineClipboardDocument className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// InfoSection Component
// ============================================================================

function InfoSection({
    icon: Icon,
    title,
    children,
    defaultOpen = true,
    className,
}: InfoSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
                className
            )}
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        {title}
                    </span>
                </div>
                <HiOutlineChevronRight
                    className={cn(
                        "w-5 h-5 text-gray-400 transition-transform",
                        isOpen && "rotate-90"
                    )}
                />
            </button>

            {isOpen && <div className="px-4 pb-4">{children}</div>}
        </div>
    );
}

// ============================================================================
// Main ApiOverview Component
// ============================================================================

export function ApiOverview({
    api,
    apiType,
    apiStatus,
    lifecycle,
    owner,
    className,
}: ApiOverviewProps) {
    return (
        <div className={cn("space-y-4", className)}>
            {/* Description */}
            {api.description && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white mb-3">
                        <HiOutlineBookOpen className="w-5 h-5 text-gray-400" />
                        Descripción
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {api.description}
                    </p>
                </div>
            )}

            {/* Basic Info */}
            <InfoSection icon={HiOutlineInformationCircle} title="Información Básica">
                <div className="space-y-0">
                    <InfoRow label="Nombre" value={api.name} copyable />
                    {api.display_name && (
                        <InfoRow label="Nombre para mostrar" value={api.display_name} />
                    )}
                    <InfoRow label="Versión" value={api.version} copyable />
                    <InfoRow label="Protocolo" value={api.protocol?.toUpperCase()} />
                    <InfoRow label="URL" value={api.url} copyable />
                </div>
            </InfoSection>

            {/* Classification */}
            <InfoSection icon={HiOutlineTag} title="Clasificación">
                <div className="space-y-0">
                    <InfoRow label="Tipo de API" value={apiType?.name} />
                    <InfoRow label="Estado" value={apiStatus?.name} />
                    <InfoRow
                        label="Ciclo de Vida"
                        value={
                            lifecycle ? (
                                <span
                                    className="inline-flex items-center gap-1.5"
                                    style={{ color: lifecycle.color || undefined }}
                                >
                                    {lifecycle.color && (
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: lifecycle.color }}
                                        />
                                    )}
                                    {lifecycle.name}
                                </span>
                            ) : null
                        }
                    />
                    {api.category_id && (
                        <InfoRow label="Categoría ID" value={String(api.category_id)} />
                    )}
                </div>
            </InfoSection>

            {/* Ownership */}
            <InfoSection icon={HiOutlineUserGroup} title="Propiedad">
                <div className="space-y-0">
                    <InfoRow
                        label="Propietario"
                        value={
                            owner ? (
                                <span className="flex items-center gap-2">
                                    {owner.icon && (
                                        <span className="text-lg">{owner.icon}</span>
                                    )}
                                    {owner.name}
                                </span>
                            ) : null
                        }
                    />
                    {owner?.email && (
                        <InfoRow label="Email del equipo" value={owner.email} copyable />
                    )}
                    <InfoRow
                        label="Creado por"
                        value={api.created_by ? `Usuario #${api.created_by}` : null}
                    />
                    <InfoRow
                        label="Actualizado por"
                        value={api.updated_by ? `Usuario #${api.updated_by}` : null}
                    />
                </div>
            </InfoSection>

            {/* Technical Details */}
            <InfoSection icon={HiOutlineCog6Tooth} title="Detalles Técnicos">
                <div className="space-y-0">
                    <InfoRow label="ID" value={String(api.id)} copyable />
                    <InfoRow
                        label="Método de Autenticación ID"
                        value={
                            api.authentication_method_id
                                ? String(api.authentication_method_id)
                                : null
                        }
                    />
                    <InfoRow
                        label="Política de Acceso ID"
                        value={
                            api.access_policy_id ? String(api.access_policy_id) : null
                        }
                    />
                    <InfoRow
                        label="Fecha de Lanzamiento"
                        value={
                            api.released_at
                                ? new Date(api.released_at).toLocaleDateString()
                                : null
                        }
                    />
                    <InfoRow
                        label="Fecha de Deprecación"
                        value={
                            api.deprecated_at
                                ? new Date(api.deprecated_at).toLocaleDateString()
                                : null
                        }
                    />
                    {api.deprecation_reason && (
                        <InfoRow label="Motivo de Deprecación" value={api.deprecation_reason} />
                    )}
                </div>
            </InfoSection>

            {/* Timestamps */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                        Creada el{" "}
                        {new Date(api.created_at).toLocaleString("es-ES", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </span>
                    <span>
                        Última actualización:{" "}
                        {new Date(api.updated_at).toLocaleString("es-ES", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// ApiOverview Skeleton
// ============================================================================

export function ApiOverviewSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Description skeleton */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
            </div>

            {/* Info sections skeleton */}
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((j) => (
                            <div key={j} className="flex justify-between">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
