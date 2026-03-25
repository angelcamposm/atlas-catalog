/**
 * EntityAttributeTable — CRUD inline para los atributos de una entidad.
 *
 * Permite crear, editar y eliminar atributos directamente desde el detalle de la entidad.
 *
 * @example
 * <EntityAttributeTable
 *   entityId={entity.id}
 *   attributes={attributes}
 *   onRefresh={loadAttributes}
 * />
 */

"use client";

import { useState } from "react";
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
} from "react-icons/hi2";
import { entityAttributesApi } from "@/lib/api/architecture";
import type {
    EntityAttribute,
    CreateEntityAttributeRequest,
} from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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

interface EntityAttributeTableProps {
    /** ID de la entidad propietaria de los atributos */
    entityId: number;
    /** Lista actual de atributos */
    attributes: EntityAttribute[];
    /** Callback para recargar la lista tras un cambio */
    onRefresh: () => void;
}

const ATTRIBUTE_TYPES = [
    "string",
    "integer",
    "float",
    "boolean",
    "date",
    "datetime",
    "json",
    "uuid",
    "text",
    "enum",
];

interface AttributeFormState {
    name: string;
    type: string;
    is_required: boolean;
}

const defaultForm: AttributeFormState = {
    name: "",
    type: "",
    is_required: false,
};

export function EntityAttributeTable({
    entityId,
    attributes,
    onRefresh,
}: EntityAttributeTableProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] =
        useState<EntityAttribute | null>(null);
    const [deletingAttribute, setDeletingAttribute] =
        useState<EntityAttribute | null>(null);
    const [form, setForm] = useState<AttributeFormState>(defaultForm);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const openCreateDialog = () => {
        setEditingAttribute(null);
        setForm(defaultForm);
        setError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (attribute: EntityAttribute) => {
        setEditingAttribute(attribute);
        setForm({
            name: attribute.name,
            type: attribute.type ?? "",
            is_required: attribute.is_required,
        });
        setError(null);
        setDialogOpen(true);
    };

    const openDeleteDialog = (attribute: EntityAttribute) => {
        setDeletingAttribute(attribute);
        setDeleteDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditingAttribute(null);
        setForm(defaultForm);
        setError(null);
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            setError("El nombre es requerido");
            return;
        }
        try {
            setSaving(true);
            setError(null);
            const payload: CreateEntityAttributeRequest = {
                name: form.name.trim(),
                type: form.type || undefined,
                is_required: form.is_required,
            };
            if (editingAttribute) {
                await entityAttributesApi.update(editingAttribute.id, payload);
            } else {
                await entityAttributesApi.create(entityId, payload);
            }
            closeDialog();
            onRefresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al guardar el atributo",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingAttribute) return;
        try {
            setDeleting(true);
            await entityAttributesApi.delete(deletingAttribute.id);
            setDeleteDialogOpen(false);
            setDeletingAttribute(null);
            onRefresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al eliminar el atributo",
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                    {attributes.length} atributo
                    {attributes.length !== 1 ? "s" : ""}
                </h3>
                <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={openCreateDialog}
                >
                    <HiOutlinePlus className="h-4 w-4" />
                    Añadir atributo
                </Button>
            </div>

            {attributes.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Esta entidad no tiene atributos. Añade el primero.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Requerido
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {attributes.map((attr) => (
                                <tr key={attr.id} className="hover:bg-muted/20">
                                    <td className="px-4 py-3 font-medium">
                                        {attr.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {attr.type ?? (
                                            <span className="italic text-muted-foreground/50">
                                                Sin tipo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={
                                                attr.is_required
                                                    ? "text-foreground"
                                                    : "text-muted-foreground/50"
                                            }
                                        >
                                            {attr.is_required ? "Sí" : "No"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                aria-label="Editar atributo"
                                                onClick={() =>
                                                    openEditDialog(attr)
                                                }
                                            >
                                                <HiOutlinePencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                aria-label="Eliminar atributo"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() =>
                                                    openDeleteDialog(attr)
                                                }
                                            >
                                                <HiOutlineTrash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit dialog */}
            <Dialog open={dialogOpen} onOpenChange={closeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingAttribute
                                ? "Editar atributo"
                                : "Nuevo atributo"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {error && (
                            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {error}
                            </p>
                        )}

                        <div className="space-y-1">
                            <label
                                htmlFor="attr-name"
                                className="text-sm font-medium"
                            >
                                Nombre{" "}
                                <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="attr-name"
                                placeholder="p.ej. email, phone_number"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <label
                                htmlFor="attr-type"
                                className="text-sm font-medium"
                            >
                                Tipo
                            </label>
                            <select
                                id="attr-type"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                value={form.type}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        type: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Sin tipo</option>
                                {ATTRIBUTE_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="attr-required"
                                type="checkbox"
                                className="h-4 w-4 rounded border-input"
                                checked={form.is_required}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        is_required: e.target.checked,
                                    }))
                                }
                            />
                            <label
                                htmlFor="attr-required"
                                className="text-sm font-medium"
                            >
                                Requerido
                            </label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeDialog}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Guardando…" : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar atributo?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente el atributo{" "}
                            <strong>{deletingAttribute?.name}</strong>. No se
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
