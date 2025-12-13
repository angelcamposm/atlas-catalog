"use client";

import { useState } from "react";
import {
    HiOutlineTableCells,
    HiOutlineClipboardDocument,
    HiOutlineCheckCircle,
    HiOutlineChevronDown,
    HiOutlineTag,
    HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { Api } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ApiMetadataProps {
    api: Api;
    className?: string;
}

interface MetadataField {
    key: string;
    label: string;
    value: string | number | boolean | null | undefined;
    type: "string" | "number" | "boolean" | "date" | "id";
    copyable?: boolean;
    group: "identity" | "relations" | "dates" | "other";
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatValue(
    value: string | number | boolean | null | undefined,
    type: MetadataField["type"]
): string {
    if (value === null || value === undefined) return "—";

    switch (type) {
        case "boolean":
            return value ? "Sí" : "No";
        case "date":
            return new Date(String(value)).toLocaleString("es-ES", {
                dateStyle: "medium",
                timeStyle: "short",
            });
        case "id":
            return `#${value}`;
        default:
            return String(value);
    }
}

function extractMetadataFields(api: Api): MetadataField[] {
    return [
        // Identity
        {
            key: "id",
            label: "ID",
            value: api.id,
            type: "id",
            copyable: true,
            group: "identity",
        },
        {
            key: "name",
            label: "Nombre técnico",
            value: api.name,
            type: "string",
            copyable: true,
            group: "identity",
        },
        {
            key: "display_name",
            label: "Nombre para mostrar",
            value: api.display_name,
            type: "string",
            group: "identity",
        },
        {
            key: "version",
            label: "Versión",
            value: api.version,
            type: "string",
            copyable: true,
            group: "identity",
        },
        {
            key: "protocol",
            label: "Protocolo",
            value: api.protocol,
            type: "string",
            group: "identity",
        },
        {
            key: "url",
            label: "URL",
            value: api.url,
            type: "string",
            copyable: true,
            group: "identity",
        },

        // Relations
        {
            key: "type_id",
            label: "Tipo de API (ID)",
            value: api.type_id,
            type: "id",
            group: "relations",
        },
        {
            key: "status_id",
            label: "Estado (ID)",
            value: api.status_id,
            type: "id",
            group: "relations",
        },
        {
            key: "category_id",
            label: "Categoría (ID)",
            value: api.category_id,
            type: "id",
            group: "relations",
        },
        {
            key: "authentication_method_id",
            label: "Método Auth (ID)",
            value: api.authentication_method_id,
            type: "id",
            group: "relations",
        },
        {
            key: "access_policy_id",
            label: "Política Acceso (ID)",
            value: api.access_policy_id,
            type: "id",
            group: "relations",
        },

        // Dates
        {
            key: "released_at",
            label: "Fecha de lanzamiento",
            value: api.released_at,
            type: "date",
            group: "dates",
        },
        {
            key: "deprecated_at",
            label: "Fecha de deprecación",
            value: api.deprecated_at,
            type: "date",
            group: "dates",
        },
        {
            key: "created_at",
            label: "Creado",
            value: api.created_at,
            type: "date",
            group: "dates",
        },
        {
            key: "updated_at",
            label: "Actualizado",
            value: api.updated_at,
            type: "date",
            group: "dates",
        },

        // Other
        {
            key: "created_by",
            label: "Creado por",
            value: api.created_by,
            type: "id",
            group: "other",
        },
        {
            key: "updated_by",
            label: "Actualizado por",
            value: api.updated_by,
            type: "id",
            group: "other",
        },
        {
            key: "deprecated_by",
            label: "Deprecado por",
            value: api.deprecated_by,
            type: "id",
            group: "other",
        },
    ];
}

// ============================================================================
// Metadata Row Component
// ============================================================================

interface MetadataRowProps {
    field: MetadataField;
}

function MetadataRow({ field }: MetadataRowProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (field.value !== null && field.value !== undefined) {
            await navigator.clipboard.writeText(String(field.value));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formattedValue = formatValue(field.value, field.type);
    const hasValue = field.value !== null && field.value !== undefined;

    return (
        <tr className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
            <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                {field.label}
            </td>
            <td className="py-3 pr-4">
                <code className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-mono">
                    {field.key}
                </code>
            </td>
            <td className="py-3">
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-sm",
                            hasValue
                                ? "text-gray-900 dark:text-white font-medium"
                                : "text-gray-400 dark:text-gray-500"
                        )}
                    >
                        {formattedValue}
                    </span>
                    {field.copyable && hasValue && (
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title={copied ? "¡Copiado!" : "Copiar valor"}
                        >
                            {copied ? (
                                <HiOutlineCheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                                <HiOutlineClipboardDocument className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ============================================================================
// Metadata Group Component
// ============================================================================

interface MetadataGroupProps {
    title: string;
    icon: React.ElementType;
    fields: MetadataField[];
    defaultOpen?: boolean;
}

function MetadataGroup({
    title,
    icon: Icon,
    fields,
    defaultOpen = true,
}: MetadataGroupProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const nonEmptyFields = fields.filter(
        (f) => f.value !== null && f.value !== undefined
    );

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
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
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                        {nonEmptyFields.length} / {fields.length}
                    </span>
                </div>
                <HiOutlineChevronDown
                    className={cn(
                        "w-5 h-5 text-gray-400 transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div className="px-4 pb-4">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-2 pr-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-1/4">
                                    Campo
                                </th>
                                <th className="py-2 pr-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-1/4">
                                    Clave
                                </th>
                                <th className="py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Valor
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field) => (
                                <MetadataRow key={field.key} field={field} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Main ApiMetadata Component
// ============================================================================

export function ApiMetadata({ api, className }: ApiMetadataProps) {
    const allFields = extractMetadataFields(api);

    const groups = {
        identity: {
            title: "Identificación",
            icon: HiOutlineTag,
            fields: allFields.filter((f) => f.group === "identity"),
        },
        relations: {
            title: "Relaciones",
            icon: HiOutlineCog6Tooth,
            fields: allFields.filter((f) => f.group === "relations"),
        },
        dates: {
            title: "Fechas",
            icon: HiOutlineTableCells,
            fields: allFields.filter((f) => f.group === "dates"),
        },
        other: {
            title: "Otros",
            icon: HiOutlineTableCells,
            fields: allFields.filter((f) => f.group === "other"),
        },
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <HiOutlineTableCells className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                    Metadatos Completos
                </h3>
            </div>

            {/* Info box */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Vista técnica de todos los campos y valores de la API tal
                    como están almacenados en el sistema. Útil para debugging y
                    integraciones.
                </p>
            </div>

            {/* Groups */}
            <div className="space-y-4">
                <MetadataGroup {...groups.identity} />
                <MetadataGroup {...groups.relations} />
                <MetadataGroup {...groups.dates} />
                <MetadataGroup {...groups.other} defaultOpen={false} />
            </div>

            {/* Raw JSON Export */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Exportar como JSON
                    </span>
                    <button
                        type="button"
                        onClick={async () => {
                            await navigator.clipboard.writeText(
                                JSON.stringify(api, null, 2)
                            );
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                    >
                        <HiOutlineClipboardDocument className="w-4 h-4" />
                        Copiar JSON
                    </button>
                </div>
                <pre className="p-3 bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg overflow-auto text-xs font-mono max-h-48">
                    {JSON.stringify(api, null, 2)}
                </pre>
            </div>
        </div>
    );
}

// ============================================================================
// ApiMetadata Skeleton
// ============================================================================

export function ApiMetadataSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40" />
            </div>

            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((j) => (
                            <div key={j} className="flex gap-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
