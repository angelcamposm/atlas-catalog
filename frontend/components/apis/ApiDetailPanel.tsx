"use client";

/**
 * ApiDetailPanel - Panel content for API details (used with SlidePanelControlled)
 *
 * This component displays API details in a push-panel format.
 * It's designed to be used with SlidePanelControlled which pushes content aside
 * rather than overlaying it.
 */

import { useState, useCallback } from "react";
import { Api } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CodeBlock } from "@/components/ui/code-block";
import {
    HiOutlineArrowTopRightOnSquare,
    HiOutlineArrowTrendingUp,
    HiOutlineChartBar,
    HiOutlineCheck,
    HiOutlineClipboard,
    HiOutlineCodeBracket,
    HiOutlineCube,
    HiOutlineDocumentText,
    HiOutlineExclamationTriangle,
    HiOutlineEye,
    HiOutlineGlobeAlt,
    HiOutlineLink,
    HiOutlinePencil,
    HiOutlineServerStack,
    HiOutlineTableCells,
    HiOutlineUsers,
    HiOutlineXMark,
} from "react-icons/hi2";

// ============================================================================
// Props
// ============================================================================

export interface ApiDetailPanelProps {
    api: Api | null;
    onClose?: () => void;
    onEdit?: (api: Api) => void;
    onViewFull?: (api: Api) => void;
}

// ============================================================================
// Helper Components
// ============================================================================

function StatusBadge({ statusId }: { statusId: number | null | undefined }) {
    const statusMap: Record<
        number,
        {
            label: string;
            variant: "primary" | "secondary" | "success" | "warning" | "danger";
        }
    > = {
        1: { label: "Draft", variant: "secondary" },
        2: { label: "Published", variant: "success" },
        3: { label: "Deprecated", variant: "warning" },
        4: { label: "Retired", variant: "danger" },
        5: { label: "Blocked", variant: "danger" },
    };

    const status = statusId ? statusMap[statusId] : null;
    if (!status) return <span className="text-muted-foreground">—</span>;

    return <Badge variant={status.variant}>{status.label}</Badge>;
}

function ProtocolBadge({ protocol }: { protocol: string | null | undefined }) {
    if (!protocol) return <span className="text-muted-foreground">—</span>;

    const colorMap: Record<string, string> = {
        rest: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        graphql:
            "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
        grpc: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        soap: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        websocket:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        webhook:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };

    const color =
        colorMap[protocol.toLowerCase()] ||
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}
        >
            {protocol.toUpperCase()}
        </span>
    );
}

function TypeBadge({ typeId }: { typeId: number | null | undefined }) {
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
            {typeId ? typeMap[typeId] || `Type ${typeId}` : "—"}
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

// Maps
const accessPolicyMap: Record<number, string> = {
    1: "Public API",
    2: "Internal API",
    3: "Partner API",
    4: "Composite API",
};

const authMethodMap: Record<number, string> = {
    1: "API Key",
    2: "OAuth 2.0",
    3: "OpenID Connect (OIDC)",
    4: "JWT Bearer Token",
};

const typeMap: Record<number, string> = {
    1: "REST",
    2: "GraphQL",
    3: "gRPC",
    4: "SOAP",
    5: "WebSockets",
    6: "Webhooks",
};

// ============================================================================
// Section Components
// ============================================================================

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {title}
            </h4>
            {children}
        </div>
    );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className="text-sm text-foreground">{value}</div>
        </div>
    );
}

// ============================================================================
// Tab Components
// ============================================================================

function OverviewTab({ api }: { api: Api }) {
    return (
        <div className="space-y-6">
            {/* Description */}
            {api.description && (
                <Section title="Descripción">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {api.description}
                    </p>
                </Section>
            )}

            {/* Quick Stats */}
            <Section title="Información">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Versión" value={api.version || "—"} />
                    <Field
                        label="Protocolo"
                        value={<ProtocolBadge protocol={api.protocol} />}
                    />
                    <Field
                        label="Tipo"
                        value={<TypeBadge typeId={api.type_id} />}
                    />
                    <Field
                        label="Estado"
                        value={<StatusBadge statusId={api.status_id} />}
                    />
                </div>
            </Section>

            {/* URL */}
            {api.url && (
                <Section title="Endpoint">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <HiOutlineLink className="w-4 h-4 text-muted-foreground shrink-0" />
                        <code className="text-xs font-mono text-foreground flex-1 truncate">
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
                </Section>
            )}

            {/* Deprecation Warning */}
            {api.deprecated_at && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            API Deprecada
                        </h4>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                            Deprecada el {formatDate(api.deprecated_at)}
                        </p>
                        {api.deprecation_reason && (
                            <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                                {api.deprecation_reason}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Access & Auth */}
            <Section title="Acceso y Autenticación">
                <div className="grid grid-cols-2 gap-4">
                    <Field
                        label="Política de Acceso"
                        value={
                            api.access_policy_id
                                ? accessPolicyMap[api.access_policy_id] ||
                                  `Policy ${api.access_policy_id}`
                                : "—"
                        }
                    />
                    <Field
                        label="Autenticación"
                        value={
                            api.authentication_method_id
                                ? authMethodMap[api.authentication_method_id] ||
                                  `Method ${api.authentication_method_id}`
                                : "—"
                        }
                    />
                </div>
            </Section>

            {/* Timestamps */}
            <Section title="Auditoría">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Creado" value={formatDate(api.created_at)} />
                    <Field
                        label="Actualizado"
                        value={formatDate(api.updated_at)}
                    />
                </div>
            </Section>
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
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <HiOutlineDocumentText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h4 className="text-sm font-medium text-foreground mb-1">
                    Sin documentación
                </h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                    Esta API no tiene especificación de documentación
                    configurada.
                </p>
            </div>
        );
    }

    const isYaml =
        specString.includes("openapi:") || specString.includes("swagger:");

    return (
        <div className="h-full flex flex-col">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex-shrink-0">
                Especificación
            </h4>
            <div className="flex-1 min-h-0 overflow-hidden">
                <CodeBlock
                    code={specString}
                    language={isYaml ? "yaml" : "json"}
                    maxHeight="calc(100vh - 280px)"
                    showLineNumbers
                    className="h-full"
                />
            </div>
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
        <div className="space-y-1">
            {metadata.map((item) => (
                <div
                    key={item.label}
                    className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                    <span className="text-xs text-muted-foreground">
                        {item.label}
                    </span>
                    <span className="text-xs font-medium text-foreground text-right max-w-[60%] truncate">
                        {item.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// Tab Navigation
// ============================================================================

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                ${
                    active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }
            `}
        >
            {icon}
            {label}
        </button>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export function ApiDetailPanel({
    api,
    onClose,
    onEdit,
    onViewFull,
}: ApiDetailPanelProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [prevApiId, setPrevApiId] = useState<number | null | undefined>(
        api?.id
    );

    // Reset tab when API changes
    if (api?.id !== prevApiId) {
        setPrevApiId(api?.id);
        setActiveTab("overview");
    }

    if (!api) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <HiOutlineCodeBracket className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-sm font-medium text-foreground mb-1">
                    Selecciona una API
                </h3>
                <p className="text-xs text-muted-foreground">
                    Haz clic en una API para ver sus detalles
                </p>
            </div>
        );
    }

    const typeName = api.type_id ? typeMap[api.type_id] || "API" : "API";

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                            <HiOutlineCodeBracket className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <span>APIs</span>
                                <span>›</span>
                                <span>{typeName}</span>
                            </div>
                            <h2 className="text-base font-semibold text-foreground truncate">
                                {api.display_name || api.name}
                            </h2>
                            {api.version && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    v{api.version}
                                </p>
                            )}
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <HiOutlineXMark className="w-5 h-5 text-gray-500" />
                        </button>
                    )}
                </div>

                {/* Status Badge */}
                <div className="mt-3">
                    <StatusBadge statusId={api.status_id} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex-shrink-0 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex gap-1">
                    <TabButton
                        active={activeTab === "overview"}
                        onClick={() => setActiveTab("overview")}
                        icon={<HiOutlineGlobeAlt className="w-3.5 h-3.5" />}
                        label="General"
                    />
                    <TabButton
                        active={activeTab === "docs"}
                        onClick={() => setActiveTab("docs")}
                        icon={<HiOutlineDocumentText className="w-3.5 h-3.5" />}
                        label="Docs"
                    />
                    <TabButton
                        active={activeTab === "metadata"}
                        onClick={() => setActiveTab("metadata")}
                        icon={<HiOutlineTableCells className="w-3.5 h-3.5" />}
                        label="Metadatos"
                    />
                </div>
            </div>

            {/* Content */}
            <div
                className={`flex-1 min-h-0 p-4 ${
                    activeTab === "docs" ? "flex flex-col" : "overflow-y-auto"
                }`}
            >
                {activeTab === "overview" && <OverviewTab api={api} />}
                {activeTab === "docs" && <DocsTab api={api} />}
                {activeTab === "metadata" && <MetadataTab api={api} />}
            </div>

            {/* Footer Actions */}
            {(onViewFull || onEdit) && (
                <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex gap-2">
                        {onViewFull && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewFull(api)}
                                className="flex-1 flex items-center justify-center gap-2"
                            >
                                <HiOutlineEye className="w-4 h-4" />
                                Ver completo
                            </Button>
                        )}
                        {onEdit && (
                            <Button
                                size="sm"
                                onClick={() => onEdit(api)}
                                className="flex-1 flex items-center justify-center gap-2"
                            >
                                <HiOutlinePencil className="w-4 h-4" />
                                Editar
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ApiDetailPanel;
