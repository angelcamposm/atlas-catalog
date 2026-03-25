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
import { environmentsApi } from "@/lib/api/business";
import { EnvironmentList } from "@/components/infrastructure/EnvironmentList";
import type {
    Environment,
    CreateEnvironmentRequest,
} from "@/types/api";

export default function InfrastructureEnvironmentsPage() {
    const [environments, setEnvironments] = useState<Environment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEnv, setEditingEnv] = useState<Environment | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingEnv, setDeletingEnv] = useState<Environment | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        label: "",
        description: "",
        prefix: "",
        suffix: "",
        approval_required: false,
        display_in_matrix: true,
    });

    const loadEnvironments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await environmentsApi.getAll(page);
            setEnvironments(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error loading environments",
            );
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadEnvironments();
    }, [loadEnvironments]);

    const openCreateDialog = () => {
        setEditingEnv(null);
        setFormData({
            name: "",
            label: "",
            description: "",
            prefix: "",
            suffix: "",
            approval_required: false,
            display_in_matrix: true,
        });
        setDialogOpen(true);
    };

    const openEditDialog = (env: Environment) => {
        setEditingEnv(env);
        setFormData({
            name: env.name,
            label: env.label || "",
            description: env.description || "",
            prefix: env.prefix || "",
            suffix: env.suffix || "",
            approval_required: env.approval_required,
            display_in_matrix: env.display_in_matrix,
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (env: Environment) => {
        setDeletingEnv(env);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateEnvironmentRequest = {
                name: formData.name,
                label: formData.label || undefined,
                description: formData.description || undefined,
                prefix: formData.prefix || undefined,
                suffix: formData.suffix || undefined,
                approval_required: formData.approval_required,
                display_in_matrix: formData.display_in_matrix,
            };
            if (editingEnv) {
                await environmentsApi.update(editingEnv.id, data);
            } else {
                await environmentsApi.create(data);
            }
            setDialogOpen(false);
            loadEnvironments();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error saving environment",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingEnv) return;
        try {
            setDeleting(true);
            await environmentsApi.delete(deletingEnv.id);
            setDeleteDialogOpen(false);
            setDeletingEnv(null);
            loadEnvironments();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error deleting environment",
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading && environments.length === 0) {
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
                title="Entornos"
                subtitle="Gestiona los entornos de despliegue de tu infraestructura"
                actions={
                    <Button onClick={openCreateDialog}>
                        <HiPlus className="mr-2 h-4 w-4" />
                        Agregar Entorno
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

            <EnvironmentList
                environments={environments}
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
                            {editingEnv ? "Editar Entorno" : "Nuevo Entorno"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingEnv
                                ? "Actualiza los datos del entorno."
                                : "Agrega un nuevo entorno de infraestructura."}
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
                                placeholder="Ej: Production, Staging, Development"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Etiqueta</Label>
                                <Input
                                    id="label"
                                    value={formData.label}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            label: e.target.value,
                                        }))
                                    }
                                    placeholder="prod"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prefix">Prefijo</Label>
                                <Input
                                    id="prefix"
                                    value={formData.prefix}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            prefix: e.target.value,
                                        }))
                                    }
                                    placeholder="prd-"
                                />
                            </div>
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
                                placeholder="Descripción opcional del entorno"
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="approval_required"
                                checked={formData.approval_required}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        approval_required: e.target.checked,
                                    }))
                                }
                                className="h-4 w-4"
                            />
                            <Label htmlFor="approval_required">
                                Requiere aprobación para despliegues
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
                            {saving ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Eliminar entorno?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará
                            permanentemente el entorno{" "}
                            <strong>{deletingEnv?.name}</strong>.
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
