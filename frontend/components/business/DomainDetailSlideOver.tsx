"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    HiOutlineSquares2X2,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineFolder,
} from "react-icons/hi2";
import { businessDomainsApi } from "@/lib/api/business";
import type { BusinessDomain } from "@/types/api";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    open: boolean;
    onClose: () => void;
    domainId?: number;
    locale?: string;
}

export function DomainDetailSlideOver({
    open,
    onClose,
    domainId,
    locale = "es",
}: Props) {
    const router = useRouter();
    const [domain, setDomain] = useState<BusinessDomain | null>(null);
    const [loading, setLoading] = useState(false);
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [domainId]);

    useEffect(() => {
        if (open) loadDomain();
    }, [open, loadDomain]);

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDomainColor = (name: string) => {
        const colors: Record<string, string> = {
            Sales: "bg-green-500",
            Orders: "bg-blue-500",
            Customers: "bg-purple-500",
            Products: "bg-orange-500",
            Content: "bg-pink-500",
            Billing: "bg-yellow-500",
            Inventory: "bg-cyan-500",
            Marketing: "bg-red-500",
            default: "bg-gray-500",
        };
        const key = Object.keys(colors).find((k) =>
            name.toLowerCase().includes(k.toLowerCase())
        );
        return colors[key || "default"];
    };

    return (
        <SlideOver
            open={open}
            onClose={onClose}
            title={domain ? domain.display_name || domain.name : "Dominio"}
            mode="push"
            showOverlay={false}
            side="right"
            size="lg"
            icon={<HiOutlineSquares2X2 className="h-6 w-6 text-primary" />}
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
                                `/${locale}/business/domains/${domainId}`
                            );
                        }}
                    >
                        Abrir en pantalla completa
                    </Button>
                </div>
            }
        >
            {domain ? (
                <div className="space-y-6">
                    {/* Header Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex h-16 w-16 items-center justify-center rounded-xl text-white ${getDomainColor(
                                        domain.name
                                    )}`}
                                >
                                    <span className="text-2xl font-bold">
                                        {(
                                            domain.display_name || domain.name
                                        ).charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold">
                                            {domain.display_name || domain.name}
                                        </h2>
                                        {domain.parent_id && (
                                            <Badge variant="secondary">
                                                Subdominio
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground font-mono">
                                        @{domain.name}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    {domain.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Descripción
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {domain.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Hierarchy */}
                    {domain.parent_id && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <HiOutlineFolder className="h-5 w-5" />
                                    Jerarquía
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Dominio Padre
                                    </p>
                                    <p className="font-mono">
                                        ID: {domain.parent_id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                                    <p className="font-mono">{domain.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Creado
                                    </p>
                                    <p>{formatDate(domain.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Actualizado
                                    </p>
                                    <p>{formatDate(domain.updated_at)}</p>
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

export default DomainDetailSlideOver;
