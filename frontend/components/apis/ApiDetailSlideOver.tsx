"use client";

import React, { useState, useCallback } from "react";
import {
    SlideOver,
    SlideOverSection,
    SlideOverField,
    SlideOverTabs,
} from "@/components/ui/SlideOver";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/code-block";
import {
    HiOutlineGlobeAlt,
    HiOutlineDocumentText,
    HiOutlineTableCells,
    HiOutlineCodeBracket,
    HiOutlineLink,
    HiOutlineExclamationTriangle,
    HiOutlineEye,
    HiOutlinePencil,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineClipboard,
    HiOutlineCheck,
    HiOutlineArrowsRightLeft,
} from "react-icons/hi2";
import type { Api } from "@/types/api";
import { cn } from "@/lib/utils";
import { ApiDependenciesTab } from "./ApiDependenciesTab";

// ============================================================================
// Types
// ============================================================================

interface ApiDetailSlideOverProps {
    /** Whether the panel is open */
    open: boolean;
    /** Callback when panel should close */
    onClose: () => void;
    /** The API to display */
    api: Api | null;
    /** Callback when edit is clicked */
    onEdit?: (api: Api) => void;
    /** Callback when view full details is clicked */
    onViewFull?: (api: Api) => void;
    /** Size of the panel */
    size?: "md" | "lg" | "xl" | "2xl";
}

// ============================================================================
// Helper Components
// ============================================================================

function StatusBadge({ statusId }: { statusId: number | null | undefined }) {
    if (!statusId) return null;

    // Map status IDs to variants (based on seeder: 1=Draft, 2=Published, 3=Deprecated, 4=Retired, 5=Blocked)
    const statusMap: Record<
        number,
        {
            label: string;
            variant: "success" | "warning" | "danger" | "secondary";
        }
    > = {
        1: { label: "Draft", variant: "secondary" },
        2: { label: "Published", variant: "success" },
        3: { label: "Deprecated", variant: "warning" },
        4: { label: "Retired", variant: "danger" },
        5: { label: "Blocked", variant: "danger" },
    };

    const status = statusMap[statusId] || {
        label: `Status ${statusId}`,
        variant: "secondary" as const,
    };

    return <Badge variant={status.variant}>{status.label}</Badge>;
}

function ProtocolBadge({ protocol }: { protocol: string | null | undefined }) {
    if (!protocol) return null;

    const colors: Record<string, string> = {
        http: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        https: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        rest: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        graphql:
            "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
        grpc: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };

    return (
        <span
            className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                colors[protocol.toLowerCase()] || colors.http
            )}
        >
            {protocol.toUpperCase()}
        </span>
    );
}

function TypeBadge({ typeId }: { typeId: number | null | undefined }) {
    if (!typeId) return <span className="text-muted-foreground">—</span>;

    // Map type IDs to names (based on seeder: 1=REST, 2=GraphQL, 3=gRPC, etc.)
    const typeMap: Record<number, string> = {
        1: "REST",
        2: "GraphQL",
        3: "gRPC",
        4: "SOAP",
        5: "WebSockets",
        6: "Webhooks",
        7: "JSON-RPC",
        8: "XML-RPC",
        9: "Avro",
    };

    return (
        <span className="font-medium">
            {typeMap[typeId] || `Type ${typeId}`}
        </span>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [text]);

    return (
        <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Copiar"
        >
            {copied ? (
                <HiOutlineCheck className="w-4 h-4 text-green-500" />
            ) : (
                <HiOutlineClipboard className="w-4 h-4 text-gray-400" />
            )}
        </button>
    );
}

function formatDate(date: string | Date | null | undefined): string {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// Access policy map (based on seeder)
const accessPolicyMap: Record<number, string> = {
    1: "Public API",
    2: "Internal API",
    3: "Partner API",
    4: "Composite API",
};

// Auth method map (based on seeder)
const authMethodMap: Record<number, string> = {
    1: "API Key",
    2: "OAuth 2.0",
    3: "OpenID Connect (OIDC)",
    4: "JWT Bearer Token",
};

// ============================================================================
// Tab Content Components
// ============================================================================

function OverviewTab({ api }: { api: Api }) {
    return (
        <div className="space-y-6">
            {/* Description */}
            {api.description && (
                <SlideOverSection title="Descripción">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {api.description}
                    </p>
                </SlideOverSection>
            )}

            {/* Quick Stats */}
            <SlideOverSection title="Información">
                <div className="grid grid-cols-2 gap-4">
                    <SlideOverField
                        label="Versión"
                        value={api.version || "—"}
                    />
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                            Protocolo
                        </span>
                        <div>
                            <ProtocolBadge protocol={api.protocol} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                            Tipo
                        </span>
                        <div>
                            <TypeBadge typeId={api.type_id} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                            Estado
                        </span>
                        <div>
                            <StatusBadge statusId={api.status_id} />
                        </div>
                    </div>
                </div>
            </SlideOverSection>

            {/* URL */}
            {api.url && (
                <SlideOverSection title="Endpoint">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <HiOutlineLink className="w-4 h-4 text-muted-foreground shrink-0" />
                        <code className="text-sm font-mono text-foreground flex-1 truncate">
                            {api.url}
                        </code>
                        <CopyButton text={api.url} />
                        <a
                            href={api.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title="Abrir en nueva pestaña"
                        >
                            <HiOutlineArrowTopRightOnSquare className="w-4 h-4 text-gray-400" />
                        </a>
                    </div>
                </SlideOverSection>
            )}

            {/* Deprecation Warning */}
            {api.deprecated_at && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            API Deprecada
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                            Deprecada el {formatDate(api.deprecated_at)}
                        </p>
                        {api.deprecation_reason && (
                            <p className="text-sm text-amber-600 dark:text-amber-500 mt-2">
                                {api.deprecation_reason}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Access & Auth */}
            <SlideOverSection title="Acceso y Autenticación">
                <div className="grid grid-cols-2 gap-4">
                    <SlideOverField
                        label="Política de Acceso"
                        value={
                            api.access_policy_id
                                ? accessPolicyMap[api.access_policy_id] ||
                                  `Policy ${api.access_policy_id}`
                                : "—"
                        }
                    />
                    <SlideOverField
                        label="Autenticación"
                        value={
                            api.authentication_method_id
                                ? authMethodMap[api.authentication_method_id] ||
                                  `Method ${api.authentication_method_id}`
                                : "—"
                        }
                    />
                </div>
            </SlideOverSection>

            {/* Timestamps */}
            <SlideOverSection title="Auditoría">
                <div className="grid grid-cols-2 gap-4">
                    <SlideOverField
                        label="Creado"
                        value={formatDate(api.created_at)}
                    />
                    <SlideOverField
                        label="Actualizado"
                        value={formatDate(api.updated_at)}
                    />
                </div>
            </SlideOverSection>
        </div>
    );
}

function DocsTab({ api }: { api: Api }) {
    const spec = api.document_specification;
    const specString =
        typeof spec === "string"
            ? spec
            : spec
            ? JSON.stringify(spec, null, 2)
            : null;
    const hasSpec = specString && specString.trim().length > 0;

    if (!hasSpec) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <HiOutlineDocumentText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h4 className="text-sm font-medium text-foreground mb-1">
                    Sin documentación
                </h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Esta API no tiene especificación de documentación
                    configurada.
                </p>
            </div>
        );
    }

    // Check if it looks like YAML/OpenAPI
    const isYaml =
        specString.includes("openapi:") || specString.includes("swagger:");

    return (
        <div className="space-y-4">
            <SlideOverSection title="Especificación">
                <CodeBlock
                    code={specString}
                    language={isYaml ? "yaml" : "json"}
                    maxHeight="400px"
                    showLineNumbers
                />
            </SlideOverSection>
        </div>
    );
}

function MetadataTab({ api }: { api: Api }) {
    const metadata = [
        { label: "ID", value: String(api.id) },
        { label: "Nombre técnico", value: api.name },
        { label: "Nombre para mostrar", value: api.display_name || "—" },
        { label: "Versión", value: api.version || "—" },
        { label: "Protocolo", value: api.protocol?.toUpperCase() || "—" },
        { label: "URL", value: api.url || "—" },
        { label: "Tipo ID", value: api.type_id ? String(api.type_id) : "—" },
        {
            label: "Estado ID",
            value: api.status_id ? String(api.status_id) : "—",
        },
        {
            label: "Política de Acceso ID",
            value: api.access_policy_id ? String(api.access_policy_id) : "—",
        },
        {
            label: "Método Auth ID",
            value: api.authentication_method_id
                ? String(api.authentication_method_id)
                : "—",
        },
        {
            label: "Categoría ID",
            value: api.category_id ? String(api.category_id) : "—",
        },
        { label: "Creado", value: formatDate(api.created_at) },
        { label: "Actualizado", value: formatDate(api.updated_at) },
        {
            label: "Creado por",
            value: api.created_by ? String(api.created_by) : "—",
        },
        {
            label: "Actualizado por",
            value: api.updated_by ? String(api.updated_by) : "—",
        },
    ];

    if (api.deprecated_at) {
        metadata.push(
            { label: "Deprecado", value: formatDate(api.deprecated_at) },
            {
                label: "Deprecado por",
                value: api.deprecated_by ? String(api.deprecated_by) : "—",
            },
            { label: "Razón deprecación", value: api.deprecation_reason || "—" }
        );
    }

    return (
        <div className="space-y-2">
            {metadata.map((item) => (
                <div
                    key={item.label}
                    className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                    <span className="text-sm text-muted-foreground">
                        {item.label}
                    </span>
                    <span className="text-sm font-medium text-foreground text-right max-w-[60%] truncate">
                        {item.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export function ApiDetailSlideOver({
    open,
    onClose,
    api,
    onEdit,
    onViewFull,
    size = "lg",
}: ApiDetailSlideOverProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [prevApiId, setPrevApiId] = useState<number | null | undefined>(
        api?.id
    );

    // Reset tab when API changes using proper pattern
    if (api?.id !== prevApiId) {
        setPrevApiId(api?.id);
        setActiveTab("overview");
    }

    if (!api) return null;

    const tabs = [
        {
            id: "overview",
            label: "General",
            icon: <HiOutlineGlobeAlt className="w-4 h-4" />,
        },
        {
            id: "docs",
            label: "Docs",
            icon: <HiOutlineDocumentText className="w-4 h-4" />,
        },
        {
            id: "dependencies",
            label: "Dependencias",
            icon: <HiOutlineArrowsRightLeft className="w-4 h-4" />,
        },
        {
            id: "metadata",
            label: "Metadatos",
            icon: <HiOutlineTableCells className="w-4 h-4" />,
        },
    ];

    // Get status info for header
    const statusInfo = api.status_id
        ? {
              1: { label: "Draft", variant: "neutral" as const },
              2: { label: "Published", variant: "success" as const },
              3: { label: "Deprecated", variant: "warning" as const },
              4: { label: "Retired", variant: "danger" as const },
              5: { label: "Blocked", variant: "danger" as const },
          }[api.status_id]
        : null;

    const footer = (
        <div className="flex gap-2">
            {onViewFull && (
                <Button
                    variant="outline"
                    onClick={() => onViewFull(api)}
                    className="flex items-center gap-2"
                >
                    <HiOutlineEye className="w-4 h-4" />
                    Ver completo
                </Button>
            )}
            {onEdit && (
                <Button
                    onClick={() => onEdit(api)}
                    className="flex items-center gap-2"
                >
                    <HiOutlinePencil className="w-4 h-4" />
                    Editar
                </Button>
            )}
        </div>
    );

    // Get type name for breadcrumbs
    const typeMap: Record<number, string> = {
        1: "REST",
        2: "GraphQL",
        3: "gRPC",
        4: "SOAP",
        5: "WebSockets",
        6: "Webhooks",
    };
    const typeName = api.type_id ? typeMap[api.type_id] || "API" : "API";

    return (
        <SlideOver
            open={open}
            onClose={onClose}
            title={api.display_name || api.name}
            description={api.version ? `v${api.version}` : undefined}
            icon={<HiOutlineCodeBracket className="w-5 h-5" />}
            size={size}
            side="right"
            footer={footer}
            status={
                statusInfo
                    ? {
                          label: statusInfo.label,
                          variant: api.deprecated_at
                              ? "warning"
                              : statusInfo.variant,
                      }
                    : undefined
            }
            breadcrumbs={[{ label: "APIs" }, { label: typeName }]}
        >
            {/* Tabs */}
            <SlideOverTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="mt-4">
                {activeTab === "overview" && <OverviewTab api={api} />}
                {activeTab === "docs" && <DocsTab api={api} />}
                {activeTab === "dependencies" && <ApiDependenciesTab apiId={api.id} />}
                {activeTab === "metadata" && <MetadataTab api={api} />}
            </div>
        </SlideOver>
    );
}

export default ApiDetailSlideOver;
