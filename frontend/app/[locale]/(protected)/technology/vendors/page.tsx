"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
    HiOutlineCube,
    HiOutlinePlus,
    HiOutlineGlobeAlt,
    HiOutlineBuildingOffice,
    HiOutlineSquares2X2,
    HiOutlineListBullet,
} from "react-icons/hi2";
import { vendorsApi } from "@/lib/api/technology";
import type { Vendor } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getIconUrl, getColorByIndex } from "@/lib/utils/icons";
import VendorDetailSlideOver from "@/components/technology/VendorDetailSlideOver";

type ViewMode = "grid" | "list";

export default function VendorsPage() {
    const params = useParams();
    const locale = (params?.locale as string) || "es";

    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [iconErrors, setIconErrors] = useState<Set<number>>(new Set());
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const [slideOpen, setSlideOpen] = useState(false);
    const [selectedVendorId, setSelectedVendorId] = useState<
        number | undefined
    >(undefined);

    const loadVendors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await vendorsApi.getAll();
            setVendors(response.data);
        } catch (err) {
            setError("Error al cargar los proveedores");
            console.error("Error loading vendors:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVendors();
    }, [loadVendors]);

    const handleIconError = (vendorId: number) => {
        setIconErrors((prev) => new Set(prev).add(vendorId));
    };

    const openSlideOver = (vendorId: number) => {
        setSelectedVendorId(vendorId);
        setSlideOpen(true);
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
                <Button onClick={loadVendors} variant="outline">
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
            <PageHeader
                title="Vendors"
                subtitle="Proveedores de tecnología y servicios"
                actions={
                    <div className="flex items-center gap-2">
                        {/* View Toggle */}
                        <div className="flex items-center rounded-lg border bg-muted p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "rounded-md p-1.5 transition-colors",
                                    viewMode === "grid"
                                        ? "bg-background shadow-sm"
                                        : "hover:bg-background/50"
                                )}
                                title="Vista de tarjetas"
                            >
                                <HiOutlineSquares2X2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "rounded-md p-1.5 transition-colors",
                                    viewMode === "list"
                                        ? "bg-background shadow-sm"
                                        : "hover:bg-background/50"
                                )}
                                title="Vista de lista"
                            >
                                <HiOutlineListBullet className="h-4 w-4" />
                            </button>
                        </div>
                        <Button className="gap-2">
                            <HiOutlinePlus className="h-4 w-4" />
                            Nuevo Vendor
                        </Button>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-3">
                                <HiOutlineBuildingOffice className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {vendors.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Total Vendors
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Vendors Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {vendors.map((vendor, index) => (
                        <Card
                            key={vendor.id}
                            className="group cursor-pointer transition-all hover:shadow-md overflow-hidden"
                            onClick={() => openSlideOver(vendor.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start gap-3 overflow-hidden">
                                    <div
                                        className={cn(
                                            "flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden flex-shrink-0",
                                            vendor.icon &&
                                                !iconErrors.has(vendor.id)
                                                ? "bg-white dark:bg-gray-800 border shadow-sm"
                                                : cn(
                                                      "text-white",
                                                      getColorByIndex(index)
                                                  )
                                        )}
                                    >
                                        {vendor.icon &&
                                        !iconErrors.has(vendor.id) ? (
                                            <img
                                                src={
                                                    getIconUrl(vendor.icon) ||
                                                    ""
                                                }
                                                alt={vendor.name}
                                                className="h-8 w-8 object-contain"
                                                onError={() =>
                                                    handleIconError(vendor.id)
                                                }
                                            />
                                        ) : (
                                            <span className="text-lg font-bold">
                                                {vendor.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <CardTitle className="text-base truncate block">
                                            {vendor.name}
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="overflow-hidden">
                                {vendor.url && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground overflow-hidden">
                                        <HiOutlineGlobeAlt className="h-4 w-4 flex-shrink-0" />
                                        <a
                                            href={vendor.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="truncate block max-w-full hover:text-primary hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {vendor.url}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Vendors List View */}
            {viewMode === "list" && (
                <Card>
                    <div className="divide-y">
                        {vendors.map((vendor, index) => (
                            <div
                                key={vendor.id}
                                className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => openSlideOver(vendor.id)}
                            >
                                <div
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden flex-shrink-0",
                                        vendor.icon &&
                                            !iconErrors.has(vendor.id)
                                            ? "bg-white dark:bg-gray-800 border shadow-sm"
                                            : cn(
                                                  "text-white",
                                                  getColorByIndex(index)
                                              )
                                    )}
                                >
                                    {vendor.icon &&
                                    !iconErrors.has(vendor.id) ? (
                                        <img
                                            src={getIconUrl(vendor.icon) || ""}
                                            alt={vendor.name}
                                            className="h-7 w-7 object-contain"
                                            onError={() =>
                                                handleIconError(vendor.id)
                                            }
                                        />
                                    ) : (
                                        <span className="text-sm font-bold">
                                            {vendor.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                        {vendor.name}
                                    </p>
                                    {vendor.url && (
                                        <p className="text-sm text-muted-foreground truncate">
                                            {vendor.url}
                                        </p>
                                    )}
                                </div>
                                <HiOutlineGlobeAlt className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {vendors.length === 0 && (
                <Card className="py-12">
                    <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                        <HiOutlineCube className="h-12 w-12 text-muted-foreground/50" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                No hay proveedores
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Agrega los proveedores de tecnología de tu
                                organización
                            </p>
                        </div>
                        <Button className="gap-2">
                            <HiOutlinePlus className="h-4 w-4" />
                            Crear Vendor
                        </Button>
                    </CardContent>
                </Card>
            )}

            <VendorDetailSlideOver
                open={slideOpen}
                onClose={() => setSlideOpen(false)}
                vendorId={selectedVendorId}
                locale={locale}
            />
        </div>
    );
}
