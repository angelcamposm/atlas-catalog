"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineCommandLine,
    HiOutlineArrowLeft,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineGlobeAlt,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineCodeBracket,
} from "react-icons/hi2";
import { frameworksApi } from "@/lib/api/frameworks";
import type { Framework } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function FrameworkDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const frameworkId = params?.id as string;

    const [framework, setFramework] = useState<Framework | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFramework = useCallback(async () => {
        if (!frameworkId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await frameworksApi.getById(Number(frameworkId));
            setFramework(response.data);
        } catch (err) {
            setError("Error al cargar el framework");
            console.error("Error loading framework:", err);
        } finally {
            setLoading(false);
        }
    }, [frameworkId]);

    useEffect(() => {
        loadFramework();
    }, [loadFramework]);

    const getFrameworkColor = (name: string) => {
        const colors: Record<string, string> = {
            react: "bg-cyan-500",
            angular: "bg-red-500",
            vue: "bg-green-500",
            svelte: "bg-orange-500",
            next: "bg-black",
            nuxt: "bg-green-600",
            django: "bg-green-700",
            flask: "bg-gray-600",
            spring: "bg-green-500",
            express: "bg-gray-700",
            laravel: "bg-red-600",
            rails: "bg-red-700",
            default: "bg-purple-500",
        };
        const normalizedName = name.toLowerCase();
        for (const [key, color] of Object.entries(colors)) {
            if (normalizedName.includes(key)) return color;
        }
        return colors.default;
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

    if (error || !framework) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive">
                    {error || "Framework no encontrado"}
                </p>
                <Button
                    onClick={() =>
                        router.push(`/${locale}/technology/frameworks`)
                    }
                    variant="outline"
                >
                    Volver a Frameworks
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
                        href={`/${locale}/technology/frameworks`}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Frameworks
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{framework.name}</span>
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
                                getFrameworkColor(framework.name)
                            )}
                        >
                            <HiOutlineCommandLine className="h-10 w-10" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">
                                    {framework.name}
                                </h1>
                                {framework.is_enabled ? (
                                    <Badge variant="success" className="gap-1">
                                        <HiOutlineCheckCircle className="h-3 w-3" />
                                        Habilitado
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        <HiOutlineXCircle className="h-3 w-3" />
                                        Deshabilitado
                                    </Badge>
                                )}
                            </div>
                            {framework.description && (
                                <p className="mt-3 text-muted-foreground">
                                    {framework.description}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Language Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineCodeBracket className="h-5 w-5" />
                            Lenguaje de Programación
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {framework.language_id ? (
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                    Lenguaje ID: {framework.language_id}
                                </Badge>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No hay lenguaje asociado
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Website Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineGlobeAlt className="h-5 w-5" />
                            Sitio Web
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {framework.url ? (
                            <a
                                href={framework.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline"
                            >
                                <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                                {framework.url}
                            </a>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No hay sitio web configurado
                            </p>
                        )}
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
                                <p className="font-mono">{framework.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Estado
                                </p>
                                <p>
                                    {framework.is_enabled
                                        ? "Habilitado"
                                        : "Deshabilitado"}
                                </p>
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
                                    Creado
                                </p>
                                <p className="text-sm">
                                    {formatDate(framework.created_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Creado por
                                </p>
                                <p className="flex items-center gap-1 text-sm">
                                    <HiOutlineUser className="h-3 w-3" />
                                    {framework.created_by || "Sistema"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado
                                </p>
                                <p className="text-sm">
                                    {formatDate(framework.updated_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado por
                                </p>
                                <p className="flex items-center gap-1 text-sm">
                                    <HiOutlineUser className="h-3 w-3" />
                                    {framework.updated_by || "Sistema"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
