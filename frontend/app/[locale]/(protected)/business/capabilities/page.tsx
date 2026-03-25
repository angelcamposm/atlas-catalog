"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiBuildingOffice2, HiPlus } from "react-icons/hi2";
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
import { businessCapabilitiesApi } from "@/lib/api/architecture";
import type {
    BusinessCapability,
    CreateBusinessCapabilityRequest,
} from "@/types/api";
import { CapabilityList } from "@/components/business/CapabilityList";

export default function BusinessCapabilitiesPage() {
    const [capabilities, setCapabilities] = useState<BusinessCapability[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCapability, setEditingCapability] =
        useState<BusinessCapability | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingCapability, setDeletingCapability] =
        useState<BusinessCapability | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent_id: "",
    });

    const loadCapabilities = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await businessCapabilitiesApi.getAll(page);
            setCapabilities(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error loading business capabilities",
            );
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadCapabilities();
    }, [loadCapabilities]);

    const openCreateDialog = () => {
        setEditingCapability(null);
        setFormData({ name: "", description: "", parent_id: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (cap: BusinessCapability) => {
        setEditingCapability(cap);
        setFormData({
            name: cap.name,
            description: cap.description || "",
            parent_id: cap.parent_id ? String(cap.parent_id) : "",
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (cap: BusinessCapability) => {
        setDeletingCapability(cap);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateBusinessCapabilityRequest = {
                name: formData.name,
                description: formData.description || undefined,
                parent_id: formData.parent_id
                    ? Number(formData.parent_id)
                    : undefined,
            };
            if (editingCapability) {
                await businessCapabilitiesApi.update(
                    editingCapability.id,
                    data,
                );
            } else {
                await businessCapabilitiesApi.create(data);
            }
            setDialogOpen(false);
            await loadCapabilities();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error saving capability",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingCapability) return;
        try {
            setDeleting(true);
            await businessCapabilitiesApi.delete(deletingCapability.id);
            setDeleteDialogOpen(false);
            await loadCapabilities();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error deleting capability",
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading && capabilities.length === 0) {
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
                title="Business Capabilities"
                subtitle="Define y gestiona las capacidades de negocio de la organización"
                icon={HiBuildingOffice2}
                actions={
                    <Button onClick={openCreateDialog} className="gap-2">
                        <HiPlus className="h-4 w-4" />
                        Nueva Capacidad
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

            <CapabilityList
                capabilities={capabilities}
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
                            {editingCapability
                                ? "Editar Capacidad"
                                : "Nueva Capacidad"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCapability
                                ? "Modifica los datos de la capacidad de negocio."
                                : "Crea una nueva capacidad de negocio."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="cap-name">Nombre *</Label>
                            <Input
                                id="cap-name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((f) => ({
                                        ...f,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Nombre de la capacidad"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cap-description">Descripción</Label>
                            <Textarea
                                id="cap-description"
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
                        <div className="space-y-2">
                            <Label htmlFor="cap-parent">
                                Capacidad padre (ID)
                            </Label>
                            <Input
                                id="cap-parent"
                                type="number"
                                value={formData.parent_id}
                                onChange={(e) =>
                                    setFormData((f) => ({
                                        ...f,
                                        parent_id: e.target.value,
                                    }))
                                }
                                placeholder="Opcional — ID de la capacidad padre"
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
                            {saving ? "Guardando…" : "Guardar"}
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
                            ¿Eliminar capacidad?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente la capacidad{" "}
                            <strong>{deletingCapability?.name}</strong>. No se
                            puede deshacer.
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
