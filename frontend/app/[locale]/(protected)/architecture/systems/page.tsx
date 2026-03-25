"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiServerStack, HiPlus } from "react-icons/hi2";
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
import { systemsApi } from "@/lib/api/architecture";
import type { System, CreateSystemRequest } from "@/types/api";
import { SystemList } from "@/components/architecture/SystemList";

export default function ArchitectureSystemsPage() {
    const [systems, setSystems] = useState<System[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSystem, setEditingSystem] = useState<System | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingSystem, setDeletingSystem] = useState<System | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({ name: "", description: "" });

    const loadSystems = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await systemsApi.getAll(page);
            setSystems(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading systems",
            );
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadSystems();
    }, [loadSystems]);

    const openCreateDialog = () => {
        setEditingSystem(null);
        setFormData({ name: "", description: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (system: System) => {
        setEditingSystem(system);
        setFormData({
            name: system.name,
            description: system.description || "",
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (system: System) => {
        setDeletingSystem(system);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateSystemRequest = {
                name: formData.name,
                description: formData.description || undefined,
            };
            if (editingSystem) {
                await systemsApi.update(editingSystem.id, data);
            } else {
                await systemsApi.create(data);
            }
            setDialogOpen(false);
            await loadSystems();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error saving system",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingSystem) return;
        try {
            setDeleting(true);
            await systemsApi.delete(deletingSystem.id);
            setDeleteDialogOpen(false);
            await loadSystems();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error deleting system",
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading && systems.length === 0) {
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
                title="Sistemas de Arquitectura"
                subtitle="Define y gestiona los sistemas de arquitectura de la organización"
                icon={HiServerStack}
                actions={
                    <Button onClick={openCreateDialog} className="gap-2">
                        <HiPlus className="h-4 w-4" />
                        Nuevo Sistema
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

            <SystemList
                systems={systems}
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
                            {editingSystem ? "Editar Sistema" : "Nuevo Sistema"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSystem
                                ? "Actualiza los datos del sistema."
                                : "Completa los campos para crear un nuevo sistema."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="system-name">
                                Nombre{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="system-name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((f) => ({
                                        ...f,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Nombre del sistema"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="system-description">
                                Descripción
                            </Label>
                            <Textarea
                                id="system-description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((f) => ({
                                        ...f,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Descripción opcional"
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={saving}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!formData.name.trim() || saving}
                        >
                            {saving
                                ? "Guardando..."
                                : editingSystem
                                  ? "Actualizar"
                                  : "Crear"}
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
                        <AlertDialogTitle>¿Eliminar sistema?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará el sistema{" "}
                            <strong>{deletingSystem?.name}</strong> de forma
                            permanente. Los componentes asociados no serán
                            eliminados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
