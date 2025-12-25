"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    HiOutlineBuildingOffice,
    HiOutlineGlobeAlt,
    HiOutlineCalendar,
    HiOutlineUser,
} from "react-icons/hi2";
import { vendorsApi } from "@/lib/api/technology";
import type { Vendor } from "@/types/api";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorIcon } from "@/components/ui/TypeIcons";
import { hasVendorIcon, getVendorBgColor } from "@/lib/icons/vendor-icons";
import { cn } from "@/lib/utils";

// Base URL for SVG icons served by backend
const ICON_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:8080";

interface Props {
    open: boolean;
    onClose: () => void;
    vendorId?: number;
    locale?: string;
}

export function VendorDetailSlideOver({
    open,
    onClose,
    vendorId,
    locale = "es",
}: Props) {
    const router = useRouter();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [iconError, setIconError] = useState(false);

    const loadVendor = useCallback(async () => {
        if (!vendorId) return;
        try {
            setLoading(true);
            setError(null);
            setIconError(false);
            const response = await vendorsApi.getById(Number(vendorId));
            setVendor(response.data);
        } catch (err) {
            setError("Error al cargar el vendor");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        if (open) loadVendor();
    }, [open, loadVendor]);

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
            title={vendor ? vendor.name : "Proveedor"}
            mode="overlay"
            showOverlay={true}
            side="right"
            size="lg"
            icon={
                vendor && hasVendorIcon(vendor.name) ? (
                    <div
                        className={cn(
                            "rounded-lg p-2",
                            getVendorBgColor(vendor.name)
                        )}
                    >
                        <VendorIcon name={vendor.name} size="lg" />
                    </div>
                ) : (
                    <div className="rounded-lg bg-primary/10 p-2">
                        <HiOutlineBuildingOffice className="h-6 w-6 text-primary" />
                    </div>
                )
            }
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
                                `/${locale}/technology/vendors/${vendorId}`
                            );
                        }}
                    >
                        Abrir en pantalla completa
                    </Button>
                </div>
            }
        >
            {vendor ? (
                <div className="space-y-6">
                    {/* Header Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div
                                    className={cn(
                                        "flex h-16 w-16 items-center justify-center rounded-xl overflow-hidden",
                                        vendor.icon && !iconError
                                            ? "bg-white dark:bg-gray-800 border shadow-sm"
                                            : hasVendorIcon(vendor.name)
                                            ? cn(
                                                  "border shadow-sm",
                                                  getVendorBgColor(vendor.name)
                                              )
                                            : "bg-gradient-to-br from-blue-500 to-blue-600"
                                    )}
                                >
                                    {vendor.icon && !iconError ? (
                                        <img
                                            src={getIconUrl(vendor.icon) || ""}
                                            alt={vendor.name}
                                            className="h-12 w-12 object-contain"
                                            onError={() => setIconError(true)}
                                        />
                                    ) : hasVendorIcon(vendor.name) ? (
                                        <VendorIcon
                                            name={vendor.name}
                                            size="xl"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">
                                            {vendor.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold">
                                        {vendor.name}
                                    </h2>
                                    {vendor.icon && (
                                        <p className="text-sm text-muted-foreground font-mono">
                                            {vendor.icon}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Website */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <HiOutlineGlobeAlt className="h-5 w-5" />
                                Sitio Web
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {vendor.url && vendor.url !== "#" ? (
                                <a
                                    href={vendor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline break-all"
                                >
                                    {vendor.url}
                                </a>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Sin sitio web configurado
                                </p>
                            )}
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
                                    <p className="font-mono">{vendor.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Creado
                                    </p>
                                    <p>{formatDate(vendor.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Actualizado
                                    </p>
                                    <p>{formatDate(vendor.updated_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Creado por
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <HiOutlineUser className="h-4 w-4" />
                                        {vendor.created_by || "Sistema"}
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

export default VendorDetailSlideOver;
