"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiPlus } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { metricsApi } from "@/lib/api";
import { MetricList } from "@/components/operations/MetricList";
import type {
    Metric,
    CreateMetricRequest,
    UpdateMetricRequest,
} from "@/types/api";

export default function MetricsPage() {
    const params = useParams();
    const locale = (params.locale as string) || "en";
    const router = useRouter();

    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingMetric, setDeletingMetric] = useState<Metric | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        value: "",
        unit: "",
        metric_definition_id: "",
        component_id: "",
    });

    const loadMetrics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await metricsApi.getAll();
            setMetrics(response.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading metrics",
            );
            console.error("Error loading metrics:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);

    const openCreateDialog = () => {
        setEditingMetric(null);
        setFormData({
            name: "",
            value: "",
            unit: "",
            metric_definition_id: "",
            component_id: "",
        });
        setDialogOpen(true);
    };

    const openEditDialog = (id: number) => {
        const metric = metrics.find((m) => m.id === id);
        if (!metric) return;
        setEditingMetric(metric);
        setFormData({
            name: metric.name,
            value: String(metric.value),
            unit: metric.unit ?? "",
            metric_definition_id: String(metric.metric_definition_id),
            component_id: metric.component_id
                ? String(metric.component_id)
                : "",
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (id: number) => {
        const metric = metrics.find((m) => m.id === id);
        if (metric) {
            setDeletingMetric(metric);
            setDeleteDialogOpen(true);
        }
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);

            const isFormValid =
                formData.name.trim() &&
                formData.value !== "" &&
                !isNaN(Number(formData.value)) &&
                formData.metric_definition_id !== "" &&
                !isNaN(Number(formData.metric_definition_id));

            if (!isFormValid) return;

            const data: CreateMetricRequest | UpdateMetricRequest = {
                name: formData.name.trim(),
                value: Number(formData.value),
                metric_definition_id: Number(formData.metric_definition_id),
                unit: formData.unit.trim() || undefined,
                component_id: formData.component_id
                    ? Number(formData.component_id)
                    : undefined,
            };

            if (editingMetric) {
                const response = await metricsApi.update(
                    editingMetric.id,
                    data as UpdateMetricRequest,
                );
                setMetrics((prev) =>
                    prev.map((m) =>
                        m.id === editingMetric.id ? response.data : m,
                    ),
                );
            } else {
                const response = await metricsApi.create(
                    data as CreateMetricRequest,
                );
                setMetrics((prev) => [...prev, response.data]);
            }
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
        if (!deletingMetric) return;
        try {
            setDeleting(true);
            await metricsApi.delete(deletingMetric.id);
            setMetrics((prev) =>
                prev.filter((m) => m.id !== deletingMetric.id),
            );
            setDeleteDialogOpen(false);
            setDeletingMetric(null);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error deleting metric",
            );
            console.error("Error deleting metric:", err);
        } finally {
            setDeleting(false);
        }
    };

    const isFormValid =
        formData.name.trim() !== "" &&
        formData.value !== "" &&
        !isNaN(Number(formData.value)) &&
        formData.metric_definition_id !== "" &&
        !isNaN(Number(formData.metric_definition_id));

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Metrics"
                subtitle="Track operational metrics across your services"
                actions={
                    <button
                        onClick={openCreateDialog}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <HiPlus className="h-4 w-4" />
                        Add Metric
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
                <MetricList
                    metrics={metrics}
                    onView={(id) =>
                        router.push(`/${locale}/operations/metrics/${id}`)
                    }
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                />
            )}

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingMetric ? "Editar Métrica" : "Nueva Métrica"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMetric
                                ? "Modifica los datos de la métrica."
                                : "Registra una nueva métrica operacional."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="e.g. CPU Usage, Response Time"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="value">Valor *</Label>
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
                                    placeholder="e.g. 42.5"
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
                                    placeholder="e.g. ms, %, MB"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="metric_definition_id">
                                    Definition ID *
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
                                    placeholder="e.g. 1"
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
                                    placeholder="Opcional"
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
                        <Button
                            onClick={handleSubmit}
                            disabled={!isFormValid || saving}
                        >
                            {saving
                                ? "Guardando..."
                                : editingMetric
                                  ? "Guardar"
                                  : "Crear"}
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
                            <strong>{deletingMetric?.name}</strong>.
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
