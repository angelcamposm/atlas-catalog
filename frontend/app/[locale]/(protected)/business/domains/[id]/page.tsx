"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineSquares2X2,
    HiOutlineArrowLeft,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineBuildingOffice,
    HiOutlineLink,
} from "react-icons/hi2";
import { businessDomainsApi } from "@/lib/api/business-domains";
import type { BusinessDomain } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function BusinessDomainDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const domainId = params?.id as string;

    const [domain, setDomain] = useState<BusinessDomain | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDomain = useCallback(async () => {
        if (!domainId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await businessDomainsApi.getById(Number(domainId));
            setDomain(response.data);
        } catch (err) {
            setError("Error al cargar el dominio");
            console.error("Error loading domain:", err);
        } finally {
            setLoading(false);
        }
    }, [domainId]);

    useEffect(() => {
        loadDomain();
    }, [loadDomain]);

    const getDomainColor = (name: string) => {
        const colors = [
            "bg-blue-500",
            "bg-purple-500",
            "bg-green-500",
            "bg-orange-500",
            "bg-pink-500",
            "bg-cyan-500",
            "bg-indigo-500",
            "bg-teal-500",
        ];
        const index = name.length % colors.length;
        return colors[index];
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

    if (error || !domain) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive">
                    {error || "Dominio no encontrado"}
                </p>
                <Button
                    onClick={() => router.push(`/${locale}/business/domains`)}
                    variant="outline"
                >
                    Volver a Dominios
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
                        href={`/${locale}/business/domains`}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Dominios
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{domain.name}</span>
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
                                getDomainColor(domain.name)
                            )}
                        >
                            <HiOutlineBuildingOffice className="h-10 w-10" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">
                                    {domain.name}
                                </h1>
                                {domain.parent_id && (
                                    <Badge variant="secondary">
                                        Subdominio
                                    </Badge>
                                )}
                            </div>
                            {domain.description && (
                                <p className="mt-3 text-muted-foreground">
                                    {domain.description}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Hierarchy Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineSquares2X2 className="h-5 w-5" />
                            Jerarquía
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Dominio Padre
                            </p>
                            {domain.parent_id ? (
                                <Link
                                    href={`/${locale}/business/domains/${domain.parent_id}`}
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    <HiOutlineLink className="h-4 w-4" />
                                    Ver dominio padre (ID: {domain.parent_id})
                                </Link>
                            ) : (
                                <p className="text-foreground">Dominio raíz</p>
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
                                <p className="font-mono">{domain.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Display Name
                                </p>
                                <p className="font-mono">
                                    {domain.display_name || "N/A"}
                                </p>
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
                                <p>{formatDate(domain.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Creado por
                                </p>
                                <p className="flex items-center gap-1">
                                    <HiOutlineUser className="h-4 w-4" />
                                    {domain.created_by || "Sistema"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado
                                </p>
                                <p>{formatDate(domain.updated_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado por
                                </p>
                                <p className="flex items-center gap-1">
                                    <HiOutlineUser className="h-4 w-4" />
                                    {domain.updated_by || "Sistema"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
