"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    HiOutlineCircleStack,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineCube,
    HiOutlineCheckCircle,
} from "react-icons/hi2";
import { lifecyclesApi } from "@/lib/api/lifecycles";
import type { Lifecycle, Component } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Tab = "overview" | "components";

const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "Resumen" },
    { id: "components", label: "Componentes" },
];

/** Map lifecycle color name to a Tailwind class */
const colorClassMap: Record<string, string> = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    red: "bg-red-500",
    gray: "bg-gray-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
    cyan: "bg-cyan-500",
    teal: "bg-teal-500",
    pink: "bg-pink-500",
};

function getColorClass(color: string | null | undefined) {
    if (!color) return "bg-gray-500";
    return colorClassMap[color.toLowerCase()] ?? "bg-gray-500";
}

export default function LifecycleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const lifecycleId = params?.id as string;

    const [lifecycle, setLifecycle] = useState<Lifecycle | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadLifecycle = useCallback(async () => {
        if (!lifecycleId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await lifecyclesApi.getById(Number(lifecycleId));
            setLifecycle(response.data);
        } catch (err) {
            setError("Error al cargar el ciclo de vida");
            console.error("Error loading lifecycle:", err);
        } finally {
            setLoading(false);
        }
    }, [lifecycleId]);

    const loadComponents = useCallback(async () => {
        if (!lifecycleId) return;
        try {
            const response = await lifecyclesApi.getComponents(
                Number(lifecycleId),
            );
            setComponents(response.data);
        } catch {
            setComponents([]);
        }
    }, [lifecycleId]);

    useEffect(() => {
        loadLifecycle();
        loadComponents();
    }, [loadLifecycle, loadComponents]);

    const handleDelete = async () => {
        if (!lifecycle) return;
        try {
            setDeleting(true);
            await lifecyclesApi.delete(lifecycle.id);
            router.push(`/${locale}/lifecycles`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al eliminar");
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
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

    if (error || !lifecycle) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive">
                    {error || "Ciclo de vida no encontrado"}
                </p>
                <Button
                    onClick={() => router.push(`/${locale}/lifecycles`)}
                    variant="outline"
                >
                    Volver a Ciclos de Vida
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title={lifecycle.name}
                subtitle={lifecycle.description ?? "Detalle del ciclo de vida"}
                icon={HiOutlineCircleStack}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                                router.push(
                                    `/${locale}/lifecycles?edit=${lifecycle.id}`,
                                )
                            }
                        >
                            <HiOutlinePencil className="h-4 w-4" />
                            Editar
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <HiOutlineTrash className="h-4 w-4" />
                            Eliminar
                        </Button>
                    </div>
                }
            />

            {/* Header Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        <div
                            className={cn(
                                "flex h-16 w-16 items-center justify-center rounded-xl text-white",
                                getColorClass(lifecycle.color),
                            )}
                        >
                            <HiOutlineCircleStack className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold">
                                    {lifecycle.name}
                                </h2>
                                {lifecycle.approval_required && (
                                    <Badge variant="warning">
                                        Requiere aprobación
                                    </Badge>
                                )}
                            </div>
                            {lifecycle.description && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {lifecycle.description}
                                </p>
                            )}
                            <div className="mt-3 text-sm text-muted-foreground">
                                <span>{components.length} componentes</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="border-b">
                <nav className="-mb-px flex gap-6">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "border-b-2 pb-3 text-sm font-medium transition-colors",
                                activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <HiOutlineTag className="h-4 w-4" />
                                Propiedades
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Color
                                </p>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "h-4 w-4 rounded-full",
                                            getColorClass(lifecycle.color),
                                        )}
                                    />
                                    <span className="capitalize">
                                        {lifecycle.color ?? "Sin color"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Requiere Aprobación
                                </p>
                                <div className="flex items-center gap-1">
                                    <HiOutlineCheckCircle className="h-4 w-4" />
                                    <span>
                                        {lifecycle.approval_required
                                            ? "Sí"
                                            : "No"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <HiOutlineCalendar className="h-4 w-4" />
                                Auditoría
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-muted-foreground">
                                        Creado
                                    </p>
                                    <p>{formatDate(lifecycle.created_at)}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground">
                                        Creado por
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <HiOutlineUser className="h-4 w-4" />
                                        {lifecycle.created_by ?? "Sistema"}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground">
                                        Actualizado
                                    </p>
                                    <p>{formatDate(lifecycle.updated_at)}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground">
                                        Actualizado por
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <HiOutlineUser className="h-4 w-4" />
                                        {lifecycle.updated_by ?? "Sistema"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "components" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <HiOutlineCube className="h-4 w-4" />
                            Componentes ({components.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {components.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No hay componentes en este ciclo de vida.
                            </p>
                        ) : (
                            <div className="divide-y">
                                {components.map((comp) => (
                                    <div
                                        key={comp.id}
                                        className="flex items-center justify-between py-3"
                                    >
                                        <div>
                                            <Link
                                                href={`/${locale}/catalog/components/${comp.slug}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {comp.display_name ?? comp.name}
                                            </Link>
                                            {comp.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {comp.description}
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant="outline">
                                            {comp.slug}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Eliminar ciclo de vida?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El ciclo de vida
                            &quot;{lifecycle.name}&quot; será eliminado
                            permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? "Eliminando…" : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
