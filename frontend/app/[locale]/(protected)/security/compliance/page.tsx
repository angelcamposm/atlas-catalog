"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { complianceStandardsApi } from "@/lib/api";
import { ComplianceStandardList } from "@/components/compliance/ComplianceStandardList";
import type {
    ComplianceStandard,
    CreateComplianceStandardRequest,
    UpdateComplianceStandardRequest,
} from "@/types/api";

export default function CompliancePage() {
    const params = useParams();
    const locale = (params.locale as string) || "en";
    const router = useRouter();

    const [standards, setStandards] = useState<ComplianceStandard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingStandard, setEditingStandard] = useState<ComplianceStandard | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingStandard, setDeletingStandard] = useState<ComplianceStandard | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        display_name: "",
        description: "",
        country_code: "",
        focus_area: "",
        industry: "",
        url: "",
    });

    const loadStandards = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await complianceStandardsApi.getAll();
            setStandards(response.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading compliance standards",
            );
            console.error("Error loading compliance standards:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStandards();
    }, [loadStandards]);

    const openCreateDialog = () => {
        setEditingStandard(null);
        setFormData({
            name: "",
            display_name: "",
            description: "",
            country_code: "",
            focus_area: "",
            industry: "",
            url: "",
        });
        setDialogOpen(true);
    };

    const openEditDialog = (standard: ComplianceStandard) => {
        setEditingStandard(standard);
        setFormData({
            name: standard.name,
            display_name: standard.display_name ?? "",
            description: standard.description ?? "",
            country_code: standard.country_code ?? "",
            focus_area: standard.focus_area ?? "",
            industry: standard.industry ?? "",
            url: standard.url ?? "",
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (standard: ComplianceStandard) => {
        setDeletingStandard(standard);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateComplianceStandardRequest | UpdateComplianceStandardRequest = {
                name: formData.name,
                display_name: formData.display_name || undefined,
                description: formData.description || undefined,
                country_code: formData.country_code || undefined,
                focus_area: formData.focus_area || undefined,
                industry: formData.industry || undefined,
                url: formData.url || undefined,
            };
            if (editingStandard) {
                const response = await complianceStandardsApi.update(
                    editingStandard.id,
                    data as UpdateComplianceStandardRequest,
                );
                setStandards((prev) =>
                    prev.map((s) => (s.id === editingStandard.id ? response.data : s)),
                );
            } else {
                const response = await complianceStandardsApi.create(
                    data as CreateComplianceStandardRequest,
                );
                setStandards((prev) => [...prev, response.data]);
            }
            setDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error saving standard");
            console.error("Error saving compliance standard:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingStandard) return;
        try {
            setDeleting(true);
            await complianceStandardsApi.delete(deletingStandard.id);
            setStandards((prev) => prev.filter((s) => s.id !== deletingStandard.id));
            setDeleteDialogOpen(false);
            setDeletingStandard(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error deleting standard");
            console.error("Error deleting compliance standard:", err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Compliance Standards"
                subtitle="Track compliance requirements across your services"
                actions={
                    <button
                        onClick={openCreateDialog}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <HiPlus className="h-4 w-4" />
                        Add Standard
                    </button>
                }
            />

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : (
                <ComplianceStandardList
                    standards={standards}
                    onView={(id) => router.push(`/${locale}/security/compliance/${id}`)}
                    onEdit={openEditDialog}
                    onDelete={(id) => {
                        const standard = standards.find((s) => s.id === id);
                        if (standard) openDeleteDialog(standard);
                    }}
                />
            )}

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingStandard ? "Editar Estándar" : "Nuevo Estándar"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingStandard
                                ? "Modifica los datos del estándar de compliance."
                                : "Crea un nuevo estándar de compliance."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, name: e.target.value }))
                                }
                                placeholder="e.g. SOC2, GDPR"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="display_name">Nombre descriptivo</Label>
                            <Input
                                id="display_name"
                                value={formData.display_name}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, display_name: e.target.value }))
                                }
                                placeholder="e.g. SOC 2 Type II"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, description: e.target.value }))
                                }
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="country_code">País/Región</Label>
                                <Input
                                    id="country_code"
                                    value={formData.country_code}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, country_code: e.target.value }))
                                    }
                                    placeholder="e.g. US, EU"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="focus_area">Área</Label>
                                <Input
                                    id="focus_area"
                                    value={formData.focus_area}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, focus_area: e.target.value }))
                                    }
                                    placeholder="e.g. Security"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="industry">Industria</Label>
                            <Input
                                id="industry"
                                value={formData.industry}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, industry: e.target.value }))
                                }
                                placeholder="e.g. Finance"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                value={formData.url}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, url: e.target.value }))
                                }
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={!formData.name.trim() || saving}>
                            {saving ? "Guardando..." : editingStandard ? "Guardar" : "Crear"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar estándar?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente el estándar{" "}
                            <strong>{deletingStandard?.name}</strong> y todos sus requerimientos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
