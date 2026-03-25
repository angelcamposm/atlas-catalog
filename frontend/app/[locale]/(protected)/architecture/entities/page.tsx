"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiSquares2X2, HiPlus } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { entitiesApi } from "@/lib/api/architecture";
import type { Entity, CreateEntityRequest } from "@/types/api";
import { EntityList } from "@/components/architecture/EntityList";

export default function ArchitectureEntitiesPage() {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingEntity, setDeletingEntity] = useState<Entity | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_enabled: true,
    });

    const loadEntities = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await entitiesApi.getAll(page);
            setEntities(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading entities",
            );
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadEntities();
    }, [loadEntities]);

    const openCreateDialog = () => {
        setEditingEntity(null);
        setFormData({ name: "", description: "", is_enabled: true });
        setDialogOpen(true);
    };

    const openEditDialog = (entity: Entity) => {
        setEditingEntity(entity);
        setFormData({
            name: entity.name,
            description: entity.description || "",
            is_enabled: entity.is_enabled,
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (entity: Entity) => {
        setDeletingEntity(entity);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateEntityRequest = {
                name: formData.name,
                description: formData.description || undefined,
                is_enabled: formData.is_enabled,
            };
            if (editingEntity) {
                await entitiesApi.update(editingEntity.id, data);
            } else {
                await entitiesApi.create(data);
            }
            setDialogOpen(false);
            await loadEntities();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error saving entity",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingEntity) return;
        try {
            setDeleting(true);
            await entitiesApi.delete(deletingEntity.id);
            setDeleteDialogOpen(false);
            await loadEntities();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error deleting entity",
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading && entities.length === 0) {
        return (
            <div className="space-y-6 p-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="mt-2 h-4 w-96" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title="Entidades de Arquitectura"
                subtitle="Define y gestiona las entidades del modelo de datos de la organización"
                icon={HiSquares2X2}
                actions={
                    <Button onClick={openCreateDialog} className="gap-2">
                        <HiPlus className="h-4 w-4" />
                        Nueva Entidad
                    </Button>
                }
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setError(null)}
                        className="mt-2"
                    >
                        Cerrar
                    </Button>
                </div>
            )}

            <EntityList
                entities={entities}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
            />

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingEntity ? "Editar Entidad" : "Nueva Entidad"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingEntity
                                ? "Actualiza los datos de la entidad."
                                : "Completa los campos para crear una nueva entidad."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="entity-name">
                                Nombre{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="entity-name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((f) => ({
                                        ...f,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Nombre de la entidad"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="entity-description">
                                Descripción
                            </Label>
                            <Textarea
                                id="entity-description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((f) => ({
                                        ...f,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Descripción opcional de la entidad"
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="entity-enabled"
                                type="checkbox"
                                className="h-4 w-4 rounded border-input"
                                checked={formData.is_enabled}
                                onChange={(e) =>
                                    setFormData((f) => ({
                                        ...f,
                                        is_enabled: e.target.checked,
                                    }))
                                }
                            />
                            <Label htmlFor="entity-enabled">
                                Entidad activa
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={saving || !formData.name.trim()}
                        >
                            {saving ? "Guardando…" : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar entidad?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente la entidad{" "}
                            <strong>{deletingEntity?.name}</strong> y todos sus
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
