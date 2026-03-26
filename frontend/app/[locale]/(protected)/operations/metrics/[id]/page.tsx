"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
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
import { metricsApi } from "@/lib/api";
import { MetricDetail } from "@/components/operations/MetricDetail";
import type { Metric, UpdateMetricRequest } from "@/types/api";

export default function MetricDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();

    const [metric, setMetric] = useState<Metric | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        value: "",
        unit: "",
        metric_definition_id: "",
        component_id: "",
    });

    const loadMetric = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await metricsApi.getById(parseInt(id));
            setMetric(response.data);
        } catch (err) {
            console.error("Error loading metric:", err);
            setError("Error al cargar la métrica");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadMetric();
    }, [loadMetric]);

    const openEditDialog = (metricId: number) => {
        const m = metric;
        if (!m || m.id !== metricId) return;
        setFormData({
            name: m.name,
            value: String(m.value),
            unit: m.unit ?? "",
            metric_definition_id: String(m.metric_definition_id),
            component_id: m.component_id ? String(m.component_id) : "",
        });
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!metric) return;
        try {
            setSaving(true);
            setError(null);

            const data: UpdateMetricRequest = {
                name: formData.name.trim() || undefined,
                value:
                    formData.value !== "" ? Number(formData.value) : undefined,
                metric_definition_id:
                    formData.metric_definition_id !== ""
                        ? Number(formData.metric_definition_id)
                        : undefined,
                unit: formData.unit.trim() || undefined,
                component_id: formData.component_id
                    ? Number(formData.component_id)
                    : undefined,
            };

            const response = await metricsApi.update(metric.id, data);
            setMetric(response.data);
            setDialogOpen(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error saving metric",
            );
            console.error("Error saving metric:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!metric) return;
        try {
            setDeleting(true);
            await metricsApi.delete(metric.id);
            setDeleteDialogOpen(false);
            router.push(`/${locale}/operations/metrics`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error deleting metric",
            );
            console.error("Error deleting metric:", err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                    <p className="text-gray-500 text-sm">Cargando...</p>
                </div>
            </div>
        );
    }

    if (error || !metric) {
        return (
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/operations/metrics`}>
                        <button className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            <HiArrowLeft className="w-4 h-4" />
                            Volver
                        </button>
                    </Link>
                </div>
                <p className="text-red-600">
                    {error ?? "Métrica no encontrada"}
                </p>
                <button
                    onClick={loadMetric}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link
                    href={`/${locale}/operations/metrics`}
                    className="inline-flex items-center gap-1 hover:text-gray-900"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    Metrics
                </Link>
                <span>/</span>
                <span className="text-gray-900">{metric.name}</span>
            </div>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Detail */}
            <MetricDetail
                metric={metric}
                onEdit={openEditDialog}
                onDelete={() => setDeleteDialogOpen(true)}
            />

            {/* Back button */}
            <div className="flex gap-3">
                <button
                    onClick={() => router.push(`/${locale}/operations/metrics`)}
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Volver a la lista
                </button>
            </div>

            {/* Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Métrica</DialogTitle>
                        <DialogDescription>
                            Modifica los datos de la métrica.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="value">Valor</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            value: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="unit">Unidad</Label>
                                <Input
                                    id="unit"
                                    value={formData.unit}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            unit: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="metric_definition_id">
                                    Definition ID
                                </Label>
                                <Input
                                    id="metric_definition_id"
                                    type="number"
                                    value={formData.metric_definition_id}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            metric_definition_id:
                                                e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="component_id">
                                    Component ID
                                </Label>
                                <Input
                                    id="component_id"
                                    type="number"
                                    value={formData.component_id}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            component_id: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={saving}>
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
                        <AlertDialogTitle>¿Eliminar métrica?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente la métrica{" "}
                            <strong>{metric.name}</strong>.
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
