"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/loading";

// Importar dinámicamente para evitar SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" label="Cargando documentación API..." showLabel />
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
                <Spinner size="lg" label="Cargando documentación API..." showLabel />
            </div>
        );
    }

    return (
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
    );
}

export default SwaggerUIWrapper;
