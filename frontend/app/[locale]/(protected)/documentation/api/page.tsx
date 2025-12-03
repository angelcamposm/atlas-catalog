"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/loading";
import {
    HiOutlineDocumentText,
    HiOutlineCodeBracket,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineClipboard,
    HiOutlineCheck,
} from "react-icons/hi2";

// Importar dinámicamente para evitar SSR
const SwaggerUIWrapper = dynamic(
    () => import("@/components/ui/swagger-ui").then((mod) => mod.SwaggerUIWrapper),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center min-h-[600px] bg-card rounded-lg border border-border">
                <Spinner size="xl" label="Cargando Swagger UI..." showLabel />
            </div>
        ),
    }
);

export default function ApiDocumentationPage() {
    const [copied, setCopied] = useState(false);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const copySpecUrl = () => {
        navigator.clipboard.writeText(`${window.location.origin}/api/openapi.yml`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <HiOutlineDocumentText className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    API Documentation
                                </h1>
                                <p className="text-muted-foreground">
                                    Atlas Catalog REST API v1.0.0
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Copy Spec URL */}
                            <button
                                onClick={copySpecUrl}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <HiOutlineCheck className="w-4 h-4 text-green-500" />
                                        <span>Copiado!</span>
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineClipboard className="w-4 h-4" />
                                        <span>Copiar URL Spec</span>
                                    </>
                                )}
                            </button>

                            {/* Download Spec */}
                            <a
                                href="/api/openapi.yml"
                                download="atlas-catalog-api-v1.yml"
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                            >
                                <HiOutlineCodeBracket className="w-4 h-4" />
                                <span>Descargar YAML</span>
                            </a>

                            {/* External Link to Backend */}
                            <a
                                href={`${apiBaseUrl}/api/v1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition-colors"
                            >
                                <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                                <span>API Base</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-card rounded-lg border border-border p-4">
                        <div className="text-sm text-muted-foreground">Base URL</div>
                        <code className="text-sm font-mono text-foreground">
                            {apiBaseUrl}/api/v1
                        </code>
                    </div>
                    <div className="bg-card rounded-lg border border-border p-4">
                        <div className="text-sm text-muted-foreground">Autenticación</div>
                        <code className="text-sm font-mono text-foreground">
                            Bearer Token (JWT)
                        </code>
                    </div>
                    <div className="bg-card rounded-lg border border-border p-4">
                        <div className="text-sm text-muted-foreground">Formato</div>
                        <code className="text-sm font-mono text-foreground">
                            JSON (application/json)
                        </code>
                    </div>
                </div>

                {/* Swagger UI */}
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <SwaggerUIWrapper
                        specUrl="/api/openapi.yml"
                        docExpansion="list"
                        filter={true}
                        tryItOutEnabled={true}
                        defaultModelsExpandDepth={1}
                    />
                </div>

                {/* Quick Links */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "APIs", tag: "APIs", count: "CRUD" },
                        { label: "Clusters", tag: "Clusters", count: "CRUD" },
                        { label: "Lifecycles", tag: "Lifecycles", count: "CRUD" },
                        { label: "Environments", tag: "Environments", count: "CRUD" },
                    ].map((item) => (
                        <a
                            key={item.tag}
                            href={`#operations-tag-${item.tag}`}
                            className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                        >
                            <span className="font-medium text-foreground">{item.label}</span>
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                {item.count}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
