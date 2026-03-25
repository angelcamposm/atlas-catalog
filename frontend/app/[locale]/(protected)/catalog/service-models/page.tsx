"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiPlus } from "react-icons/hi2";
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
import { serviceModelsApi } from "@/lib/api/service-models";
import { ServiceModelList } from "@/components/catalog/ServiceModelList";
import type {
    ServiceModel,
    CreateServiceModelRequest,
} from "@/types/api";

export default function ServiceModelsPage() {
    const [models, setModels] = useState<ServiceModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<ServiceModel | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingModel, setDeletingModel] = useState<ServiceModel | null>(
        null,
    );
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const loadModels = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await serviceModelsApi.getAll(page);
            setModels(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error loading service models",
            );
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadModels();
    }, [loadModels]);

    const openCreateDialog = () => {
        setEditingModel(null);
        setFormData({ name: "", description: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (model: ServiceModel) => {
        setEditingModel(model);
        setFormData({
            name: model.name,
            description: model.description || "",
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (model: ServiceModel) => {
        setDeletingModel(model);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateServiceModelRequest = {
                name: formData.name,
                description: formData.description || undefined,
            };
            if (editingModel) {
                await serviceModelsApi.update(editingModel.id, data);
            } else {
                await serviceModelsApi.create(data);
            }
            setDialogOpen(false);
            loadModels();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error saving service model",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingModel) return;
        try {
            setDeleting(true);
            await serviceModelsApi.delete(deletingModel.id);
            setDeleteDialogOpen(false);
            setDeletingModel(null);
            loadModels();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error deleting service model",
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading && models.length === 0) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="mt-2 h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Modelos de Servicio"
                subtitle="Gestiona los modelos de servicio del catálogo"
                actions={
                    <Button onClick={openCreateDialog}>
                        <HiPlus className="mr-2 h-4 w-4" />
                        Agregar Modelo
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

            <ServiceModelList
                models={models}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm text-muted-foreground">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
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
                            {editingModel
                                ? "Editar Modelo de Servicio"
                                : "Nuevo Modelo de Servicio"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingModel
                                ? "Actualiza los datos del modelo de servicio."
                                : "Agrega un nuevo modelo de servicio al catálogo."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Ej: REST, gRPC, GraphQL"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Descripción opcional del modelo de servicio"
                                rows={3}
                            />
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
                            {saving ? "Guardando..." : "Guardar"}
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
                        <AlertDialogTitle>
                            ¿Eliminar modelo de servicio?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará
                            permanentemente el modelo{" "}
                            <strong>{deletingModel?.name}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
