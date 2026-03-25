"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
    HiOutlineCommandLine,
    HiOutlinePlus,
    HiOutlineGlobeAlt,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineSquares2X2,
    HiOutlineListBullet,
} from "react-icons/hi2";
import { frameworksApi } from "@/lib/api/technology";
import type { Framework } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { getIconUrl, getColorByIndex } from "@/lib/utils/icons";
import FrameworkDetailSlideOver from "@/components/technology/FrameworkDetailSlideOver";

type ViewMode = "grid" | "list";

export default function FrameworksPage() {
    const params = useParams();
    const locale = (params?.locale as string) || "es";

    const [frameworks, setFrameworks] = useState<Framework[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [iconErrors, setIconErrors] = useState<Set<number>>(new Set());
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const [slideOpen, setSlideOpen] = useState(false);
    const [selectedFrameworkId, setSelectedFrameworkId] = useState<
        number | undefined
    >(undefined);

    const loadFrameworks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await frameworksApi.getAll();
            setFrameworks(response.data);
        } catch (err) {
            setError("Error al cargar los frameworks");
            console.error("Error loading frameworks:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFrameworks();
    }, [loadFrameworks]);

    const handleIconError = (frameworkId: number) => {
        setIconErrors((prev) => new Set(prev).add(frameworkId));
    };

    const openSlideOver = (frameworkId: number) => {
        setSelectedFrameworkId(frameworkId);
        setSlideOpen(true);
    };

    const enabledFrameworks = frameworks.filter((f) => f.is_enabled);

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
                <Button onClick={loadFrameworks} variant="outline">
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Frameworks"
                subtitle="Frameworks y librerías de desarrollo"
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
                            Nuevo Framework
                        </Button>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-3">
                                <HiOutlineCommandLine className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {frameworks.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Total Frameworks
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-500/10 p-3">
                                <HiOutlineCheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {enabledFrameworks.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Habilitados
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Frameworks Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {frameworks.map((framework, index) => (
                        <Card
                            key={framework.id}
                            className={cn(
                                "group cursor-pointer transition-all hover:shadow-md",
                                !framework.is_enabled && "opacity-60"
                            )}
                            onClick={() => openSlideOver(framework.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden",
                                                framework.icon &&
                                                    !iconErrors.has(
                                                        framework.id
                                                    )
                                                    ? "bg-white dark:bg-gray-800 border shadow-sm"
                                                    : cn(
                                                          "text-white",
                                                          getColorByIndex(index)
                                                      )
                                            )}
                                        >
                                            {framework.icon &&
                                            !iconErrors.has(framework.id) ? (
                                                <img
                                                    src={
                                                        getIconUrl(
                                                            framework.icon
                                                        ) || ""
                                                    }
                                                    alt={framework.name}
                                                    className="h-7 w-7 object-contain"
                                                    onError={() =>
                                                        handleIconError(
                                                            framework.id
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <HiOutlineCommandLine className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <CardTitle className="text-base truncate">
                                                {framework.name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "text-xs flex-shrink-0",
                                            framework.is_enabled
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                        )}
                                    >
                                        {framework.is_enabled ? (
                                            <>
                                                <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
                                                Activo
                                            </>
                                        ) : (
                                            <>
                                                <HiOutlineXCircle className="mr-1 h-3 w-3" />
                                                Inactivo
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {framework.description || "Sin descripción"}
                                </p>
                                {framework.url && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                        <HiOutlineGlobeAlt className="h-4 w-4 flex-shrink-0" />
                                        <a
                                            href={framework.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="truncate hover:text-primary hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {framework.url}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Frameworks List View */}
            {viewMode === "list" && (
                <Card>
                    <div className="divide-y">
                        {frameworks.map((framework, index) => (
                            <div
                                key={framework.id}
                                className={cn(
                                    "flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                                    !framework.is_enabled && "opacity-60"
                                )}
                                onClick={() => openSlideOver(framework.id)}
                            >
                                <div
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden flex-shrink-0",
                                        framework.icon &&
                                            !iconErrors.has(framework.id)
                                            ? "bg-white dark:bg-gray-800 border shadow-sm"
                                            : cn(
                                                  "text-white",
                                                  getColorByIndex(index)
                                              )
                                    )}
                                >
                                    {framework.icon &&
                                    !iconErrors.has(framework.id) ? (
                                        <img
                                            src={
                                                getIconUrl(framework.icon) || ""
                                            }
                                            alt={framework.name}
                                            className="h-7 w-7 object-contain"
                                            onError={() =>
                                                handleIconError(framework.id)
                                            }
                                        />
                                    ) : (
                                        <HiOutlineCommandLine className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium truncate">
                                            {framework.name}
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "text-xs flex-shrink-0",
                                                framework.is_enabled
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                            )}
                                        >
                                            {framework.is_enabled
                                                ? "Activo"
                                                : "Inactivo"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {framework.description ||
                                            "Sin descripción"}
                                    </p>
                                </div>
                                {framework.url && (
                                    <HiOutlineGlobeAlt className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {frameworks.length === 0 && (
                <Card className="py-12">
                    <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                        <HiOutlineCommandLine className="h-12 w-12 text-muted-foreground/50" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                No hay frameworks
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Agrega los frameworks utilizados en tu
                                organización
                            </p>
                        </div>
                        <Button className="gap-2">
                            <HiOutlinePlus className="h-4 w-4" />
                            Crear Framework
                        </Button>
                    </CardContent>
                </Card>
            )}

            <FrameworkDetailSlideOver
                open={slideOpen}
                onClose={() => setSlideOpen(false)}
                frameworkId={selectedFrameworkId}
                locale={locale}
            />
        </div>
    );
}
