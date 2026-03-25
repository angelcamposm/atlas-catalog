"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    HiOutlineSquares2X2,
    HiOutlinePlus,
    HiOutlineChevronRight,
    HiOutlineBuildingOffice2,
} from "react-icons/hi2";
import { businessDomainsApi } from "@/lib/api/business";
import type { BusinessDomain } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import DomainDetailSlideOver from "@/components/business/DomainDetailSlideOver";

export default function BusinessDomainsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";

    const [domains, setDomains] = useState<BusinessDomain[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [slideOpen, setSlideOpen] = useState(false);
    const [selectedDomainId, setSelectedDomainId] = useState<
        number | undefined
    >(undefined);

    const loadDomains = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await businessDomainsApi.getAll();
            setDomains(response.data);
        } catch (err) {
            setError("Error al cargar los dominios de negocio");
            console.error("Error loading business domains:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDomains();
    }, [loadDomains]);

    // Organizar dominios por jerarquía (padres e hijos)
    const rootDomains = domains.filter((d) => !d.parent_id);
    const childDomains = (parentId: number) =>
        domains.filter((d) => d.parent_id === parentId);

    const getDomainColor = (index: number) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-cyan-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-amber-500",
        ];
        return colors[index % colors.length];
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
                <Button onClick={loadDomains} variant="outline">
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Business Domains"
                subtitle="Dominios de negocio y áreas funcionales de la organización"
                actions={
                    <Button className="gap-2">
                        <HiOutlinePlus className="h-4 w-4" />
                        Nuevo Dominio
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-3">
                                <HiOutlineSquares2X2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {domains.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Total Dominios
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/10 p-3">
                                <HiOutlineBuildingOffice2 className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {rootDomains.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Dominios Raíz
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Domains Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rootDomains.map((domain, index) => {
                    const children = childDomains(domain.id);
                    return (
                        <Card
                            key={domain.id}
                            className="group cursor-pointer transition-all hover:shadow-md"
                            onClick={() => {
                                setSelectedDomainId(domain.id);
                                setSlideOpen(true);
                            }}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-lg text-white",
                                                getDomainColor(index)
                                            )}
                                        >
                                            <HiOutlineSquares2X2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">
                                                {domain.display_name ||
                                                    domain.name}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                {domain.name}
                                            </p>
                                        </div>
                                    </div>
                                    {children.length > 0 && (
                                        <Badge variant="secondary">
                                            {children.length} sub
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {domain.description || "Sin descripción"}
                                </p>
                                {children.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {children.slice(0, 3).map((child) => (
                                            <Badge
                                                key={child.id}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {child.name}
                                            </Badge>
                                        ))}
                                        {children.length > 3 && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                +{children.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {domains.length === 0 && (
                <Card className="py-12">
                    <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                        <HiOutlineSquares2X2 className="h-12 w-12 text-muted-foreground/50" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                No hay dominios de negocio
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Define los dominios de negocio de tu
                                organización
                            </p>
                        </div>
                        <Button className="gap-2">
                            <HiOutlinePlus className="h-4 w-4" />
                            Crear Dominio
                        </Button>
                    </CardContent>
                </Card>
            )}

            <DomainDetailSlideOver
                open={slideOpen}
                onClose={() => setSlideOpen(false)}
                domainId={selectedDomainId}
                locale={locale}
            />
        </div>
    );
}
