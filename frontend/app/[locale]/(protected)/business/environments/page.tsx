"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    HiOutlineServerStack,
    HiOutlinePlus,
    HiOutlineCheckCircle,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
} from "react-icons/hi2";
import { environmentsApi } from "@/lib/api/business";
import type { Environment } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import EnvironmentDetailSlideOver from "@/components/business/EnvironmentDetailSlideOver";

export default function EnvironmentsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";

    const [environments, setEnvironments] = useState<Environment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [slideOpen, setSlideOpen] = useState(false);
    const [selectedEnvId, setSelectedEnvId] = useState<number | undefined>(
        undefined
    );

    const loadEnvironments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await environmentsApi.getAll();
            setEnvironments(response.data);
        } catch (err) {
            setError("Error al cargar los ambientes");
            console.error("Error loading environments:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEnvironments();
    }, [loadEnvironments]);

    const getEnvColor = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("prod")) return "bg-red-500";
        if (lowerName.includes("staging") || lowerName.includes("pre"))
            return "bg-yellow-500";
        if (lowerName.includes("dev")) return "bg-green-500";
        if (lowerName.includes("test") || lowerName.includes("qa"))
            return "bg-blue-500";
        if (lowerName.includes("local")) return "bg-gray-500";
        return "bg-purple-500";
    };

    const getEnvBadgeColor = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("prod")) return "destructive";
        if (lowerName.includes("staging") || lowerName.includes("pre"))
            return "warning";
        return "secondary";
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive">{error}</p>
                <Button onClick={loadEnvironments} variant="outline">
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Environments"
                subtitle="Ambientes de despliegue y configuración"
                actions={
                    <Button className="gap-2">
                        <HiOutlinePlus className="h-4 w-4" />
                        Nuevo Ambiente
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-3">
                                <HiOutlineServerStack className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {environments.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Total Ambientes
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-500/10 p-3">
                                <HiOutlineShieldCheck className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {
                                        environments.filter(
                                            (e) => e.approval_required
                                        ).length
                                    }
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Requieren Aprobación
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Environments Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {environments.map((env) => (
                    <Card
                        key={env.id}
                        className="group cursor-pointer transition-all hover:shadow-md"
                        onClick={() => {
                            setSelectedEnvId(env.id);
                            setSlideOpen(true);
                        }}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-lg text-white",
                                            getEnvColor(env.name)
                                        )}
                                    >
                                        <HiOutlineServerStack className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">
                                            {env.label || env.name}
                                        </CardTitle>
                                        {env.prefix && (
                                            <p className="text-xs text-muted-foreground">
                                                Prefix: {env.prefix}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {env.approval_required && (
                                        <Badge
                                            variant="warning"
                                            className="text-xs"
                                        >
                                            <HiOutlineShieldCheck className="mr-1 h-3 w-3" />
                                            Approval
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                {env.description || "Sin descripción"}
                            </p>
                            {env.url && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                    <HiOutlineGlobeAlt className="h-4 w-4" />
                                    <span className="truncate">{env.url}</span>
                                </div>
                            )}
                            <div className="mt-3 flex gap-2">
                                {env.display_in_matrix && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
                                        Matrix
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {environments.length === 0 && (
                <Card className="py-12">
                    <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                        <HiOutlineServerStack className="h-12 w-12 text-muted-foreground/50" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                No hay ambientes
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Define los ambientes de despliegue de tu
                                organización
                            </p>
                        </div>
                        <Button className="gap-2">
                            <HiOutlinePlus className="h-4 w-4" />
                            Crear Ambiente
                        </Button>
                    </CardContent>
                </Card>
            )}

            <EnvironmentDetailSlideOver
                open={slideOpen}
                onClose={() => setSlideOpen(false)}
                envId={selectedEnvId}
                locale={locale}
            />
        </div>
    );
}
