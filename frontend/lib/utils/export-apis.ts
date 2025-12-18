import type { Api } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export type ExportFormat = "json" | "csv";

export interface ExportOptions {
    /** File name without extension */
    filename?: string;
    /** Fields to include in export */
    fields?: (keyof Api)[];
    /** Whether to include metadata (timestamps, IDs) */
    includeMetadata?: boolean;
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_FILENAME = "apis-export";

const DEFAULT_FIELDS: (keyof Api)[] = [
    "id",
    "name",
    "display_name",
    "version",
    "description",
    "url",
    "protocol",
    "status_id",
    "type_id",
    "deprecated_at",
    "created_at",
    "updated_at",
];

const EXPORT_FIELDS_BASIC: (keyof Api)[] = [
    "name",
    "display_name",
    "version",
    "description",
    "url",
    "protocol",
];

// ============================================================================
// Utilities
// ============================================================================

/**
 * Escapes a value for CSV format
 */
function escapeCSVValue(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    const stringValue = String(value);

    // If the value contains comma, quote, or newline, wrap it in quotes
    if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n") ||
        stringValue.includes("\r")
    ) {
        // Escape quotes by doubling them
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

/**
 * Converts a date value to ISO string
 */
function formatDateValue(value: unknown): string {
    if (!value) return "";
    const date = new Date(value as string);
    return isNaN(date.getTime()) ? String(value) : date.toISOString();
}

// ============================================================================
// Export Functions
// ============================================================================

/**
 * Converts APIs data to JSON format
 */
export function apisToJSON(
    apis: Api[],
    options: ExportOptions = {}
): string {
    const { fields = DEFAULT_FIELDS, includeMetadata = true } = options;

    const fieldsToUse = includeMetadata ? fields : EXPORT_FIELDS_BASIC;

    const exportData = apis.map((api) => {
        const result: Record<string, unknown> = {};
        fieldsToUse.forEach((field) => {
            const value = api[field];
            // Format dates
            if (field.includes("_at") && value) {
                result[field] = formatDateValue(value);
            } else {
                result[field] = value;
            }
        });
        return result;
    });

    return JSON.stringify(exportData, null, 2);
}

/**
 * Converts APIs data to CSV format
 */
export function apisToCSV(
    apis: Api[],
    options: ExportOptions = {}
): string {
    const { fields = DEFAULT_FIELDS, includeMetadata = true } = options;

    const fieldsToUse = includeMetadata ? fields : EXPORT_FIELDS_BASIC;

    // Create header row
    const headers = fieldsToUse.map((field) => {
        // Convert snake_case to Title Case for headers
        return field
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    });

    const headerRow = headers.join(",");

    // Create data rows
    const dataRows = apis.map((api) => {
        return fieldsToUse
            .map((field) => {
                let value = api[field];

                // Format dates
                if (field.includes("_at") && value) {
                    value = formatDateValue(value);
                }

                // Convert booleans
                if (typeof value === "boolean") {
                    value = value ? "true" : "false";
                }

                return escapeCSVValue(value);
            })
            .join(",");
    });

    return [headerRow, ...dataRows].join("\n");
}

/**
 * Downloads data as a file
 */
export function downloadFile(
    content: string,
    filename: string,
    mimeType: string
): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Exports APIs data to a file in the specified format
 */
export function exportApis(
    apis: Api[],
    format: ExportFormat,
    options: ExportOptions = {}
): void {
    const { filename = DEFAULT_FILENAME, ...restOptions } = options;

    const timestamp = new Date().toISOString().split("T")[0];
    const fullFilename = `${filename}-${timestamp}`;

    if (format === "json") {
        const content = apisToJSON(apis, restOptions);
        downloadFile(content, `${fullFilename}.json`, "application/json");
    } else {
        const content = apisToCSV(apis, restOptions);
        downloadFile(content, `${fullFilename}.csv`, "text/csv");
    }
}

/**
 * Gets export statistics for display
 */
export function getExportStats(apis: Api[]): {
    totalCount: number;
    activeCount: number;
    deprecatedCount: number;
} {
    return {
        totalCount: apis.length,
        activeCount: apis.filter((api) => !api.deprecated_at).length,
        deprecatedCount: apis.filter((api) => !!api.deprecated_at).length,
    };
}

// ============================================================================
// Export with Related Data
// ============================================================================

export interface ApiWithRelations extends Api {
    type?: { name: string } | null;
    lifecycle?: { name: string } | null;
    owner?: { name: string } | null;
}

/**
 * Converts APIs with relations to a flattened export format
 */
export function apisWithRelationsToCSV(
    apis: ApiWithRelations[],
    options: ExportOptions = {}
): string {
    const baseFields = options.fields || EXPORT_FIELDS_BASIC;

    // Add relation fields
    const headers = [
        ...baseFields.map((field) =>
            field
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        ),
        "Type",
        "Lifecycle",
        "Owner",
    ];

    const headerRow = headers.join(",");

    const dataRows = apis.map((api) => {
        const baseValues = baseFields.map((field) => {
            let value = api[field];

            if (field.includes("_at") && value) {
                value = formatDateValue(value);
            }

            if (typeof value === "boolean") {
                value = value ? "true" : "false";
            }

            return escapeCSVValue(value);
        });

        // Add relation values
        const relationValues = [
            escapeCSVValue(api.type?.name || ""),
            escapeCSVValue(api.lifecycle?.name || ""),
            escapeCSVValue(api.owner?.name || ""),
        ];

        return [...baseValues, ...relationValues].join(",");
    });

    return [headerRow, ...dataRows].join("\n");
}
