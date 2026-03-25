"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiQueueList, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";
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
import { apiStatusesApi } from "@/lib/api";
import type {
    ApiStatus,
    CreateApiStatusRequest,
    UpdateApiStatusRequest,
} from "@/types/api";

export default function ApiStatusesPage() {
    const [statuses, setStatuses] = useState<ApiStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<ApiStatus | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingStatus, setDeletingStatus] = useState<ApiStatus | null>(
        null,
    );
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({ name: "", description: "" });

    const loadStatuses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiStatusesApi.getAll(page);
            setStatuses(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error loading API statuses",
            );
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadStatuses();
    }, [loadStatuses]);

    const openCreateDialog = () => {
        setEditingStatus(null);
        setFormData({ name: "", description: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (status: ApiStatus) => {
        setEditingStatus(status);
        setFormData({
            name: status.name,
            description: status.description || "",
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (status: ApiStatus) => {
        setDeletingStatus(status);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateApiStatusRequest | UpdateApiStatusRequest = {
                name: formData.name,
                description: formData.description || undefined,
            };
            if (editingStatus) {
                await apiStatusesApi.update(editingStatus.id, data);
            } else {
                await apiStatusesApi.create(data as CreateApiStatusRequest);
            }
            setDialogOpen(false);
            loadStatuses();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error saving API status",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingStatus) return;
        try {
            setDeleting(true);
            await apiStatusesApi.delete(deletingStatus.id);
            setDeleteDialogOpen(false);
            setDeletingStatus(null);
            loadStatuses();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error deleting API status",
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading && statuses.length === 0) {
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
                title="API Statuses"
                subtitle="Configure the lifecycle statuses for APIs in your catalog"
                actions={
                    <Button onClick={openCreateDialog}>
                        <HiPlus className="mr-2 h-4 w-4" />
                        Add Status
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
                        Dismiss
                    </Button>
                </div>
            )}

            <div className="rounded-lg border border-border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Description
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-12 text-center text-muted-foreground"
                                >
                                    <HiQueueList className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <p className="mt-4">
                                        No API statuses defined yet
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openCreateDialog}
                                        className="mt-4"
                                    >
                                        Add first status
                                    </Button>
                                </td>
                            </tr>
                        ) : (
                            statuses.map((status) => (
                                <tr
                                    key={status.id}
                                    className="border-b border-border last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <HiQueueList className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-medium">
                                                {status.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {status.description || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                onClick={() =>
                                                    openEditDialog(status)
                                                }
                                            >
                                                <HiPencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                                onClick={() =>
                                                    openDeleteDialog(status)
                                                }
                                            >
                                                <HiTrash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingStatus
                                ? "Edit API Status"
                                : "Add API Status"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingStatus
                                ? "Update the API status"
                                : "Define a new lifecycle status for APIs"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="as-name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="as-name"
                                placeholder="e.g., Active, Beta, Deprecated"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="as-description">Description</Label>
                            <Textarea
                                id="as-description"
                                placeholder="Optional description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
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
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={saving || !formData.name.trim()}
                        >
                            {saving
                                ? "Saving..."
                                : editingStatus
                                  ? "Update"
                                  : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete API Status</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {deletingStatus?.name}&quot;? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
