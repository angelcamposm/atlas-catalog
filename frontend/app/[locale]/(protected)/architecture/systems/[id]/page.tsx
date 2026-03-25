"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiServerStack,
    HiOutlineArrowLeft,
    HiOutlinePencil,
    HiOutlineTrash,
} from "react-icons/hi2";
import { systemsApi } from "@/lib/api/architecture";
import type { System, Component } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { SystemDetail } from "@/components/architecture/SystemDetail";
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

export default function SystemDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";
    const systemId = Number(params?.id);

    const [system, setSystem] = useState<System | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadData = useCallback(async () => {
        if (!systemId) return;
        try {
            setLoading(true);
            setError(null);

            const sysResponse = await systemsApi.getById(systemId);
            setSystem(sysResponse.data);

            // Load associated components (graceful degradation on error)
            try {
                const compResponse =
                    await systemsApi.getSystemComponents(systemId);
                setComponents(compResponse.data);
            } catch {
                setComponents([]);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al cargar el sistema",
            );
        } finally {
            setLoading(false);
        }
    }, [systemId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async () => {
        if (!system) return;
        try {
            setDeleting(true);
            await systemsApi.delete(system.id);
            router.push(`/${locale}/architecture/systems`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al eliminar el sistema",
            );
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="mt-2 h-4 w-96" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !system) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
                <p className="text-muted-foreground">
                    {error ?? "Sistema no encontrado"}
                </p>
                <Link href={`/${locale}/architecture/systems`}>
                    <Button variant="outline" className="gap-2">
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Volver a sistemas
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title={system.name}
                subtitle="Detalle de sistema de arquitectura"
                icon={HiServerStack}
                actions={
                    <div className="flex items-center gap-2">
                        <Link href={`/${locale}/architecture/systems`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <HiOutlineArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() =>
                                router.push(
                                    `/${locale}/architecture/systems?edit=${system.id}`,
                                )
                            }
                        >
                            <HiOutlinePencil className="h-4 w-4" />
                            Editar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <HiOutlineTrash className="h-4 w-4" />
                            Eliminar
                        </Button>
                    </div>
                }
            />

            <SystemDetail
                system={system}
                components={components}
                locale={locale}
            />

            {/* Delete confirmation */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar sistema?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente{" "}
                            <strong>{system.name}</strong>. No se puede
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
