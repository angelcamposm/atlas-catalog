"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineServerStack,
    HiOutlineArrowLeft,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
} from "react-icons/hi2";
import { environmentsApi } from "@/lib/api/environments";
import type { Environment } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function EnvironmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const envId = params?.id as string;

    const [environment, setEnvironment] = useState<Environment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadEnvironment = useCallback(async () => {
        if (!envId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await environmentsApi.getById(Number(envId));
            setEnvironment(response.data);
        } catch (err) {
            setError("Error al cargar el entorno");
            console.error("Error loading environment:", err);
        } finally {
            setLoading(false);
        }
    }, [envId]);

    useEffect(() => {
        loadEnvironment();
    }, [loadEnvironment]);

    const getEnvColor = (name: string) => {
        const normalizedName = name.toLowerCase();
        if (normalizedName.includes("prod")) return "bg-red-500";
        if (normalizedName.includes("stag") || normalizedName.includes("uat"))
            return "bg-yellow-500";
        if (normalizedName.includes("dev")) return "bg-green-500";
        if (normalizedName.includes("test") || normalizedName.includes("qa"))
            return "bg-blue-500";
        return "bg-gray-500";
    };

    const getEnvBadgeVariant = (
        name: string
    ): "danger" | "warning" | "success" | "secondary" => {
        const normalizedName = name.toLowerCase();
        if (normalizedName.includes("prod")) return "danger";
        if (normalizedName.includes("stag") || normalizedName.includes("uat"))
            return "warning";
        if (normalizedName.includes("dev")) return "success";
        return "secondary";
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !environment) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive">
                    {error || "Entorno no encontrado"}
                </p>
                <Button
                    onClick={() =>
                        router.push(`/${locale}/business/environments`)
                    }
                    variant="outline"
                >
                    Volver a Entornos
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Breadcrumb & Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href={`/${locale}/business/environments`}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Entornos
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{environment.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <HiOutlinePencil className="h-4 w-4" />
                        Editar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                    >
                        <HiOutlineTrash className="h-4 w-4" />
                        Eliminar
                    </Button>
                </div>
            </div>

            {/* Header Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        <div
                            className={cn(
                                "flex h-20 w-20 items-center justify-center rounded-xl text-white",
                                getEnvColor(environment.name)
                            )}
                        >
                            <HiOutlineServerStack className="h-10 w-10" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">
                                    {environment.name}
                                </h1>
                                <Badge
                                    variant={getEnvBadgeVariant(
                                        environment.name
                                    )}
                                >
                                    {environment.name.toUpperCase()}
                                </Badge>
                            </div>
                            {environment.description && (
                                <p className="mt-3 text-muted-foreground">
                                    {environment.description}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Approval Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            {environment.approval_required ? (
                                <HiOutlineCheckCircle className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <HiOutlineXCircle className="h-5 w-5 text-green-500" />
                            )}
                            Estado de Aprobación
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            {environment.approval_required ? (
                                <>
                                    <Badge variant="warning" className="gap-1">
                                        <HiOutlineCheckCircle className="h-4 w-4" />
                                        Requiere Aprobación
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Los despliegues a este entorno necesitan
                                        aprobación previa
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Badge variant="success" className="gap-1">
                                        <HiOutlineXCircle className="h-4 w-4" />
                                        Sin Aprobación
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Los despliegues pueden realizarse sin
                                        aprobación
                                    </p>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineTag className="h-5 w-5" />
                            Metadatos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    ID
                                </p>
                                <p className="font-mono">{environment.id}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Info */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineCalendar className="h-5 w-5" />
                            Información de Auditoría
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Creado
                                </p>
                                <p>{formatDate(environment.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Creado por
                                </p>
                                <p className="flex items-center gap-1">
                                    <HiOutlineUser className="h-4 w-4" />
                                    {environment.created_by || "Sistema"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado
                                </p>
                                <p>{formatDate(environment.updated_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado por
                                </p>
                                <p className="flex items-center gap-1">
                                    <HiOutlineUser className="h-4 w-4" />
                                    {environment.updated_by || "Sistema"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
