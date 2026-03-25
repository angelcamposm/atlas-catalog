"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    HiOutlineBuildingOffice,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineTag,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineLink,
    HiOutlineCube,
    HiOutlineSquares2X2,
} from "react-icons/hi2";
import { businessDomainsApi } from "@/lib/api/business-domains";
import type { BusinessDomain, Component, Entity } from "@/types/api";
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

type Tab = "overview" | "components" | "entities";

const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "Resumen" },
    { id: "components", label: "Componentes" },
    { id: "entities", label: "Entidades" },
];

export default function BusinessDomainDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const domainId = params?.id as string;

    const [domain, setDomain] = useState<BusinessDomain | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadDomain = useCallback(async () => {
        if (!domainId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await businessDomainsApi.getById(
                Number(domainId),
            );
            setDomain(response.data);
        } catch (err) {
            setError("Error al cargar el dominio");
            console.error("Error loading domain:", err);
        } finally {
            setLoading(false);
        }
    }, [domainId]);

    const loadComponents = useCallback(async () => {
        if (!domainId) return;
        try {
            const response = await businessDomainsApi.getComponents(
                Number(domainId),
            );
            setComponents(response.data);
        } catch {
            setComponents([]);
        }
    }, [domainId]);

    const loadEntities = useCallback(async () => {
        if (!domainId) return;
        try {
            const response = await businessDomainsApi.getDomainEntities(
                Number(domainId),
            );
            setEntities(response.data);
        } catch {
            setEntities([]);
        }
    }, [domainId]);

    useEffect(() => {
        loadDomain();
        loadComponents();
        loadEntities();
    }, [loadDomain, loadComponents, loadEntities]);

    const handleDelete = async () => {
        if (!domain) return;
        try {
            setDeleting(true);
            await businessDomainsApi.delete(domain.id);
            router.push(`/${locale}/business/domains`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al eliminar",
            );
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

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
        return colors[name.length % colors.length];
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
            <PageHeader
                title={domain.name}
                subtitle={
                    domain.description ?? "Detalle del dominio de negocio"
                }
                icon={HiOutlineBuildingOffice}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                                router.push(
                                    `/${locale}/business/domains?edit=${domain.id}`,
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
                                getDomainColor(domain.name),
                            )}
                        >
                            <HiOutlineBuildingOffice className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold">
                                    {domain.name}
                                </h2>
                                {domain.parent_id && (
                                    <Badge variant="secondary">
                                        Subdominio
                                    </Badge>
                                )}
                            </div>
                            {domain.description && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {domain.description}
                                </p>
                            )}
                            <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                                <span>
                                    {components.length} componentes
                                </span>
                                <span>
                                    {entities.length} entidades
                                </span>
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
                                Jerarquía
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Dominio Padre
                                </p>
                                {domain.parent_id ? (
                                    <Link
                                        href={`/${locale}/business/domains/${domain.parent_id}`}
                                        className="flex items-center gap-1 text-primary hover:underline"
                                    >
                                        <HiOutlineLink className="h-4 w-4" />
                                        Ver dominio padre (ID:{" "}
                                        {domain.parent_id})
                                    </Link>
                                ) : (
                                    <p>Dominio raíz</p>
                                )}
                            </div>
                            {domain.display_name && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Display Name
                                    </p>
                                    <p>{domain.display_name}</p>
                                </div>
                            )}
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
                                    <p>{formatDate(domain.created_at)}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground">
                                        Creado por
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <HiOutlineUser className="h-4 w-4" />
                                        {domain.created_by ?? "Sistema"}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground">
                                        Actualizado
                                    </p>
                                    <p>{formatDate(domain.updated_at)}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground">
                                        Actualizado por
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <HiOutlineUser className="h-4 w-4" />
                                        {domain.updated_by ?? "Sistema"}
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
                                No hay componentes asociados a este dominio.
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
                                                {comp.display_name ??
                                                    comp.name}
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

            {activeTab === "entities" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <HiOutlineSquares2X2 className="h-4 w-4" />
                            Entidades ({entities.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {entities.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No hay entidades asociadas a este dominio.
                            </p>
                        ) : (
                            <div className="divide-y">
                                {entities.map((entity) => (
                                    <div
                                        key={entity.id}
                                        className="flex items-center justify-between py-3"
                                    >
                                        <div>
                                            <Link
                                                href={`/${locale}/architecture/entities/${entity.id}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {entity.name}
                                            </Link>
                                            {entity.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {entity.description}
                                                </p>
                                            )}
                                        </div>
                                        <Badge
                                            variant={
                                                entity.is_enabled
                                                    ? "success"
                                                    : "secondary"
                                            }
                                        >
                                            {entity.is_enabled
                                                ? "Activo"
                                                : "Inactivo"}
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
                            ¿Eliminar dominio?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente el dominio{" "}
                            <strong>{domain.name}</strong>. No se puede
                            deshacer.
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

