"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineCube,
    HiOutlineArrowLeft,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineGlobeAlt,
    HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";
import { vendorsApi } from "@/lib/api/technology";
import type { Vendor } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function VendorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const vendorId = params?.id as string;

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadVendor = useCallback(async () => {
        if (!vendorId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await vendorsApi.getById(Number(vendorId));
            setVendor(response.data);
        } catch (err) {
            setError("Error al cargar el proveedor");
            console.error("Error loading vendor:", err);
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        loadVendor();
    }, [loadVendor]);

    const getVendorColor = (name: string) => {
        const colors: Record<string, string> = {
            microsoft: "bg-blue-600",
            google: "bg-red-500",
            amazon: "bg-orange-500",
            aws: "bg-orange-500",
            meta: "bg-blue-500",
            apple: "bg-gray-800",
            oracle: "bg-red-600",
            ibm: "bg-blue-700",
            salesforce: "bg-blue-400",
            sap: "bg-blue-800",
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

    if (error || !vendor) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive">
                    {error || "Proveedor no encontrado"}
                </p>
                <Button
                    onClick={() => router.push(`/${locale}/technology/vendors`)}
                    variant="outline"
                >
                    Volver a Proveedores
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
                        href={`/${locale}/technology/vendors`}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Proveedores
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{vendor.name}</span>
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
                                getVendorColor(vendor.name)
                            )}
                        >
                            <HiOutlineCube className="h-10 w-10" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">
                                    {vendor.name}
                                </h1>
                                <Badge variant="secondary">Proveedor</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Website Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <HiOutlineGlobeAlt className="h-5 w-5" />
                            Sitio Web
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {vendor.url ? (
                            <a
                                href={vendor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline"
                            >
                                <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                                {vendor.url}
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
                                <p className="font-mono">{vendor.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nombre
                                </p>
                                <p>{vendor.name}</p>
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
                                <p>{formatDate(vendor.created_at)}</p>
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
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado
                                </p>
                                <p>{formatDate(vendor.updated_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Actualizado por
                                </p>
                                <p className="flex items-center gap-1">
                                    <HiOutlineUser className="h-4 w-4" />
                                    {vendor.updated_by || "Sistema"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
