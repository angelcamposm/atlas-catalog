"use client";

import { useEffect, useRef, useState } from "react";
import {
    HiOutlineDocumentText,
    HiOutlineArrowsPointingOut,
    HiOutlineArrowsPointingIn,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineExclamationTriangle,
    HiOutlineCodeBracket,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { Api } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

export interface ApiDocsProps {
    api: Api;
    className?: string;
}

type DocFormat = "openapi" | "yaml" | "json" | "unknown";

// ============================================================================
// Helper Functions
// ============================================================================

function detectDocFormat(spec: string | Record<string, unknown> | null | undefined): DocFormat {
    if (!spec) return "unknown";

    if (typeof spec === "object") {
        if ("openapi" in spec || "swagger" in spec) return "openapi";
        return "json";
    }

    const trimmed = spec.trim();

    // Check for OpenAPI/Swagger
    if (trimmed.includes('"openapi"') || trimmed.includes('"swagger"')) {
        return "openapi";
    }

    // Check for YAML
    if (trimmed.startsWith("openapi:") || trimmed.startsWith("swagger:")) {
        return "openapi";
    }

    // Try to detect JSON
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        return "json";
    }

    // Check for YAML format
    if (
        trimmed.includes(":") &&
        !trimmed.startsWith("<") &&
        (trimmed.includes("\n  ") || trimmed.includes("\n\t"))
    ) {
        return "yaml";
    }

    return "unknown";
}

function formatJson(spec: string | Record<string, unknown>): string {
    if (typeof spec === "object") {
        return JSON.stringify(spec, null, 2);
    }

    try {
        const parsed = JSON.parse(spec);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return spec;
    }
}

// ============================================================================
// Swagger UI Placeholder Component
// ============================================================================

interface SwaggerUIPlaceholderProps {
    spec: string | Record<string, unknown>;
    format: DocFormat;
    url?: string | null;
}

function SwaggerUIPlaceholder({ spec, format, url }: SwaggerUIPlaceholderProps) {
    // Note: In a real implementation, you would integrate with swagger-ui-react
    // or redoc for proper OpenAPI rendering

    return (
        <div className="space-y-4">
            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <HiOutlineDocumentText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">
                        Especificación {format === "openapi" ? "OpenAPI" : format.toUpperCase()}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {format === "openapi"
                            ? "Esta API tiene una especificación OpenAPI/Swagger. Para una visualización interactiva completa, considera integrar swagger-ui-react o Redoc."
                            : "Se ha detectado documentación en formato " + format.toUpperCase() + "."}
                    </p>
                    {url && (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Ver API en vivo
                            <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            {/* Raw spec display */}
            <div className="relative">
                <pre className="p-4 bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg overflow-auto text-sm font-mono max-h-[600px]">
                    <code>{formatJson(spec)}</code>
                </pre>
            </div>
        </div>
    );
}

// ============================================================================
// Main ApiDocs Component
// ============================================================================

export function ApiDocs({ api, className }: ApiDocsProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const hasSpec = !!api.document_specification;
    const docFormat = detectDocFormat(api.document_specification);

    // Handle fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // No documentation available
    if (!hasSpec) {
        return (
            <div
                className={cn(
                    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8",
                    className
                )}
            >
                <div className="flex flex-col items-center justify-center text-center">
                    <HiOutlineDocumentText className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Sin documentación
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        Esta API no tiene especificación de documentación adjunta.
                        Considera añadir una especificación OpenAPI o Swagger para
                        mejorar la documentación.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
                isFullscreen && "fixed inset-0 z-50 rounded-none",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <HiOutlineCodeBracket className="w-5 h-5 text-gray-400" />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                        Documentación de la API
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase">
                        {docFormat}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={toggleFullscreen}
                    className={cn(
                        "p-2 rounded-lg transition-colors",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        "text-gray-500 dark:text-gray-400"
                    )}
                    title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                    {isFullscreen ? (
                        <HiOutlineArrowsPointingIn className="w-5 h-5" />
                    ) : (
                        <HiOutlineArrowsPointingOut className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className={cn("p-4", isFullscreen && "h-[calc(100%-60px)] overflow-auto")}>
                {docFormat === "unknown" ? (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-amber-800 dark:text-amber-200">
                                Formato no reconocido
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                No se pudo determinar el formato de la especificación.
                                Se muestra el contenido en bruto.
                            </p>
                        </div>
                    </div>
                ) : (
                    <SwaggerUIPlaceholder
                        spec={api.document_specification!}
                        format={docFormat}
                        url={api.url}
                    />
                )}
            </div>
        </div>
    );
}

// ============================================================================
// ApiDocs Skeleton
// ============================================================================

export function ApiDocsSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-pulse">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                </div>
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
            <div className="p-4">
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
                </div>
            </div>
        </div>
    );
}
