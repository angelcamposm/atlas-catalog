"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiSquares2X2, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { entitiesApi, entityAttributesApi } from "@/lib/api/architecture";
import type { Entity, EntityAttribute, Component } from "@/types/api";
import { EntityDetail } from "@/components/architecture/EntityDetail";

export default function EntityDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const locale = (params?.locale as string) ?? "es";

    const [entity, setEntity] = useState<Entity | null>(null);
    const [attributes, setAttributes] = useState<EntityAttribute[]>([]);
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadEntity = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const response = await entitiesApi.getById(Number(id));
            setEntity(response.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading entity",
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    const loadAttributes = useCallback(async () => {
        if (!id) return;
        try {
            const response = await entityAttributesApi.getAll(Number(id));
            setAttributes(response.data);
        } catch {
            // Graceful degradation — attributes not critical
            setAttributes([]);
        }
    }, [id]);

    const loadComponents = useCallback(async () => {
        if (!id) return;
        try {
            const response = await entitiesApi.getEntityComponents(Number(id));
            setComponents(response.data);
        } catch {
            // Graceful degradation — components not critical
            setComponents([]);
        }
    }, [id]);

    useEffect(() => {
        loadEntity();
        loadAttributes();
        loadComponents();
    }, [loadEntity, loadAttributes, loadComponents]);

    const handleDelete = async () => {
        if (!entity) return;
        try {
            setDeleting(true);
            await entitiesApi.delete(entity.id);
            router.push(`/${locale}/architecture/entities`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error deleting entity",
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

    if (error || !entity) {
        return (
            <div className="space-y-4 p-6">
                <p className="text-sm text-destructive">
                    {error ?? "Entidad no encontrada"}
                </p>
                <Button
                    variant="outline"
                    onClick={() =>
                        router.push(`/${locale}/architecture/entities`)
                    }
                >
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title={entity.name}
                subtitle={
                    entity.description ??
                    "Detalle de la entidad de arquitectura"
                }
                icon={HiSquares2X2}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                                router.push(
                                    `/${locale}/architecture/entities?edit=${entity.id}`,
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

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <EntityDetail
                entity={entity}
                attributes={attributes}
                components={components}
                locale={locale}
                onAttributeChange={loadAttributes}
            />

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar entidad?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente la entidad{" "}
                            <strong>{entity.name}</strong> y todos sus
                            atributos. No se puede deshacer.
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
