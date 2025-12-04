"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/loading";

// Importar estilos de Swagger UI directamente
import "swagger-ui-react/swagger-ui.css";

// Importar dinámicamente para evitar SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-[400px]">
            <Spinner
                size="lg"
                label="Cargando documentación API..."
                showLabel
            />
        </div>
    ),
});

interface SwaggerUIWrapperProps {
    /** URL del archivo OpenAPI spec (yaml o json) */
    specUrl?: string;
    /** Spec como objeto (alternativa a specUrl) */
    spec?: object;
    /** Mostrar barra superior de Swagger */
    showTopBar?: boolean;
    /** Permitir probar endpoints (Try it out) */
    tryItOutEnabled?: boolean;
    /** Expandir operaciones por defecto */
    defaultModelsExpandDepth?: number;
    /** Expandir tags por defecto */
    docExpansion?: "list" | "full" | "none";
    /** Filtrar operaciones */
    filter?: boolean | string;
    /** Clase CSS adicional */
    className?: string;
}

export function SwaggerUIWrapper({
    specUrl = "/api/openapi.yml",
    spec,
    tryItOutEnabled = true,
    defaultModelsExpandDepth = 1,
    docExpansion = "list",
    filter = true,
    className = "",
}: SwaggerUIWrapperProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner
                    size="lg"
                    label="Cargando documentación API..."
                    showLabel
                />
            </div>
        );
    }

    return (
        <>
            {/* Estilos para ocultar topbar y ajustar */}
            <style jsx global>{`
                .swagger-ui .topbar {
                    display: none;
                }
                .swagger-ui .info {
                    margin: 20px 0;
                }
                .swagger-ui .scheme-container {
                    background: #f8f9fa;
                    box-shadow: none;
                    padding: 16px;
                }
                .swagger-ui .opblock {
                    border-radius: 8px;
                    margin-bottom: 12px;
                }
                .swagger-ui .opblock-tag {
                    border-bottom: 1px solid #e5e7eb;
                }
                .swagger-ui .btn {
                    border-radius: 6px;
                }
                .swagger-ui section.models {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                }
                .swagger-ui .filter-container input {
                    border-radius: 8px;
                    padding: 8px 16px;
                }
                .dark .swagger-ui .scheme-container {
                    background: #1f2937;
                }
                .dark .swagger-ui .opblock-tag {
                    border-color: #374151;
                }
                .dark .swagger-ui section.models {
                    border-color: #374151;
                }
                .dark .swagger-ui .info .title,
                .dark .swagger-ui .opblock-tag {
                    color: #f9fafb;
                }
                .dark .swagger-ui .info .description,
                .dark .swagger-ui .opblock-description-wrapper p {
                    color: #9ca3af;
                }
            `}</style>
            <div className={`swagger-ui-wrapper ${className}`}>
                <SwaggerUI
                    url={spec ? undefined : specUrl}
                    spec={spec}
                    tryItOutEnabled={tryItOutEnabled}
                    defaultModelsExpandDepth={defaultModelsExpandDepth}
                    docExpansion={docExpansion}
                    filter={filter}
                    persistAuthorization={true}
                    withCredentials={true}
                />
            </div>
        </>
    );
}

export default SwaggerUIWrapper;
