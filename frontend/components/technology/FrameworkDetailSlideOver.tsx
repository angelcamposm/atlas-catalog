"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    HiOutlineCommandLine,
    HiOutlineGlobeAlt,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
} from "react-icons/hi2";
import { frameworksApi } from "@/lib/api/technology";
import type { Framework } from "@/types/api";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Base URL for SVG icons served by backend
const ICON_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:8080";

interface Props {
    open: boolean;
    onClose: () => void;
    frameworkId?: number;
    locale?: string;
}

export function FrameworkDetailSlideOver({
    open,
    onClose,
    frameworkId,
    locale = "es",
}: Props) {
    const router = useRouter();
    const [framework, setFramework] = useState<Framework | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [iconError, setIconError] = useState(false);

    const loadFramework = useCallback(async () => {
        if (!frameworkId) return;
        try {
            setLoading(true);
            setError(null);
            setIconError(false);
            const response = await frameworksApi.getById(Number(frameworkId));
            setFramework(response.data);
        } catch (err) {
            setError("Error al cargar el framework");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [frameworkId]);

    useEffect(() => {
        if (open) loadFramework();
    }, [open, loadFramework]);

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getIconUrl = (icon: string | null | undefined) => {
        if (!icon) return null;
        return `${ICON_BASE_URL}/media/svg/${icon}`;
    };

    return (
        <SlideOver
            open={open}
            onClose={onClose}
            title={framework ? framework.name : "Framework"}
            mode="push"
            showOverlay={false}
            side="right"
            size="lg"
            icon={<HiOutlineCommandLine className="h-6 w-6 text-primary" />}
            loading={loading}
            footer={
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onClose()}
                    >
                        Cerrar
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            onClose();
                            router.push(
                                `/${locale}/technology/frameworks/${frameworkId}`
                            );
                        }}
                    >
                        Abrir en pantalla completa
                    </Button>
                </div>
            }
        >
            {framework ? (
                <div className="space-y-6">
                    {/* Header Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white dark:bg-gray-800 border shadow-sm overflow-hidden">
                                    {framework.icon && !iconError ? (
                                        <img
                                            src={
                                                getIconUrl(framework.icon) || ""
                                            }
                                            alt={framework.name}
                                            className="h-12 w-12 object-contain"
                                            onError={() => setIconError(true)}
                                        />
                                    ) : (
                                        <HiOutlineCommandLine className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold">
                                            {framework.name}
                                        </h2>
                                        <Badge
                                            variant={
                                                framework.is_enabled
                                                    ? "success"
                                                    : "secondary"
                                            }
                                        >
                                            {framework.is_enabled ? (
                                                <span className="flex items-center gap-1">
                                                    <HiOutlineCheckCircle className="h-3 w-3" />
                                                    Habilitado
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <HiOutlineXCircle className="h-3 w-3" />
                                                    Deshabilitado
                                                </span>
                                            )}
                                        </Badge>
                                    </div>
                                    {framework.icon && (
                                        <p className="text-sm text-muted-foreground font-mono">
                                            {framework.icon}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    {framework.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Descripción
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {framework.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Website */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <HiOutlineGlobeAlt className="h-5 w-5" />
                                Sitio Web
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {framework.url ? (
                                <a
                                    href={framework.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline break-all"
                                >
                                    {framework.url}
                                </a>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Sin sitio web configurado
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <HiOutlineCalendar className="h-5 w-5" />
                                Información de Auditoría
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        ID
                                    </p>
                                    <p className="font-mono">{framework.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Language ID
                                    </p>
                                    <p className="font-mono">
                                        {framework.language_id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Creado
                                    </p>
                                    <p>{formatDate(framework.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Actualizado
                                    </p>
                                    <p>{formatDate(framework.updated_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Creado por
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <HiOutlineUser className="h-4 w-4" />
                                        {framework.created_by || "Sistema"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : error ? (
                <p className="text-destructive">{error}</p>
            ) : null}
        </SlideOver>
    );
}

export default FrameworkDetailSlideOver;
