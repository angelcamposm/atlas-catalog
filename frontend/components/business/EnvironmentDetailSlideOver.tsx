"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    HiOutlineCog,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineExclamationTriangle,
    HiOutlineTableCells,
    HiOutlineShieldCheck,
} from "react-icons/hi2";
import { environmentsApi } from "@/lib/api/business";
import type { Environment } from "@/types/api";
import { SlideOver } from "@/components/ui/SlideOver";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    open: boolean;
    onClose: () => void;
    envId?: number;
    locale?: string;
}

export function EnvironmentDetailSlideOver({
    open,
    onClose,
    envId,
    locale = "es",
}: Props) {
    const router = useRouter();
    const [env, setEnv] = useState<Environment | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadEnv = useCallback(async () => {
        if (!envId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await environmentsApi.getById(Number(envId));
            setEnv(response.data);
        } catch (err) {
            setError("Error al cargar el entorno");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [envId]);

    useEffect(() => {
        if (open) loadEnv();
    }, [open, loadEnv]);

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getEnvColor = (name: string) => {
        const colors: Record<string, string> = {
            production: "bg-red-500",
            prod: "bg-red-500",
            staging: "bg-orange-500",
            stg: "bg-orange-500",
            pre: "bg-amber-500",
            preproduction: "bg-amber-500",
            qa: "bg-blue-500",
            test: "bg-cyan-500",
            development: "bg-green-500",
            dev: "bg-green-500",
            sandbox: "bg-purple-500",
            local: "bg-gray-500",
        };
        const key = Object.keys(colors).find((k) =>
            name.toLowerCase().includes(k.toLowerCase())
        );
        return colors[key || "dev"] || "bg-gray-500";
    };

    return (
        <SlideOver
            open={open}
            onClose={onClose}
            title={env ? env.label || env.name : "Entorno"}
            mode="push"
            showOverlay={false}
            side="right"
            size="lg"
            icon={<HiOutlineCog className="h-6 w-6 text-primary" />}
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
                                `/${locale}/business/environments/${envId}`
                            );
                        }}
                    >
                        Abrir en pantalla completa
                    </Button>
                </div>
            }
        >
            {env ? (
                <div className="space-y-6">
                    {/* Header Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex h-16 w-16 items-center justify-center rounded-xl text-white ${getEnvColor(
                                        env.name
                                    )}`}
                                >
                                    <span className="text-lg font-bold uppercase">
                                        {env.prefix || env.name.substring(0, 3)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold">
                                        {env.label || env.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground font-mono">
                                        {env.name}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {env.name
                                            .toLowerCase()
                                            .includes("prod") && (
                                            <Badge variant="danger">
                                                <HiOutlineShieldCheck className="mr-1 h-3 w-3" />
                                                Producción
                                            </Badge>
                                        )}
                                        {env.approval_required && (
                                            <Badge variant="warning">
                                                <HiOutlineExclamationTriangle className="mr-1 h-3 w-3" />
                                                Requiere Aprobación
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    {env.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Descripción
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {env.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <HiOutlineCog className="h-5 w-5" />
                                Configuración
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Prefijo
                                    </p>
                                    <p className="font-mono uppercase">
                                        {env.prefix || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Sufijo
                                    </p>
                                    <p>{env.suffix ?? "N/A"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Mostrar en Matriz
                                    </p>
                                    {env.display_in_matrix ? (
                                        <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <HiOutlineXCircle className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Es Producción
                                    </p>
                                    {env.name.toLowerCase().includes("prod") ? (
                                        <HiOutlineCheckCircle className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <HiOutlineXCircle className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Audit Info */}
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
                                    <p className="font-mono">{env.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Creado
                                    </p>
                                    <p>{formatDate(env.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Actualizado
                                    </p>
                                    <p>{formatDate(env.updated_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Creado por
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <HiOutlineUser className="h-4 w-4" />
                                        {env.created_by || "Sistema"}
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

export default EnvironmentDetailSlideOver;
