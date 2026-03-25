"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiKey, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";
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
import { authenticationMethodsApi } from "@/lib/api";
import type {
    AuthenticationMethod,
    CreateAuthenticationMethodRequest,
    UpdateAuthenticationMethodRequest,
} from "@/types/api";

export default function AuthMethodsPage() {
    const params = useParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const locale = (params.locale as string) || "en";

    const [methods, setMethods] = useState<AuthenticationMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMethod, setEditingMethod] =
        useState<AuthenticationMethod | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingMethod, setDeletingMethod] =
        useState<AuthenticationMethod | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({ name: "", description: "" });

    const loadMethods = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await authenticationMethodsApi.getAll(page);
            setMethods(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error loading authentication methods",
            );
            console.error("Error loading auth methods:", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadMethods();
    }, [loadMethods]);

    const openCreateDialog = () => {
        setEditingMethod(null);
        setFormData({ name: "", description: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (method: AuthenticationMethod) => {
        setEditingMethod(method);
        setFormData({
            name: method.name,
            description: method.description || "",
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (method: AuthenticationMethod) => {
        setDeletingMethod(method);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data:
                | CreateAuthenticationMethodRequest
                | UpdateAuthenticationMethodRequest = {
                name: formData.name,
                description: formData.description || undefined,
            };
            if (editingMethod) {
                await authenticationMethodsApi.update(editingMethod.id, data);
            } else {
                await authenticationMethodsApi.create(
                    data as CreateAuthenticationMethodRequest,
                );
            }
            setDialogOpen(false);
            loadMethods();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error saving authentication method",
            );
            console.error("Error saving auth method:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingMethod) return;
        try {
            setDeleting(true);
            await authenticationMethodsApi.delete(deletingMethod.id);
            setDeleteDialogOpen(false);
            setDeletingMethod(null);
            loadMethods();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error deleting authentication method",
            );
            console.error("Error deleting auth method:", err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading && methods.length === 0) {
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
                title="Authentication Methods"
                subtitle="Configure authentication methods available for your APIs"
                actions={
                    <Button onClick={openCreateDialog}>
                        <HiPlus className="mr-2 h-4 w-4" />
                        Add Method
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
                                Method
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
                        {methods.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-12 text-center text-muted-foreground"
                                >
                                    <HiKey className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <p className="mt-4">
                                        No authentication methods yet
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openCreateDialog}
                                        className="mt-4"
                                    >
                                        Add your first method
                                    </Button>
                                </td>
                            </tr>
                        ) : (
                            methods.map((method) => (
                                <tr
                                    key={method.id}
                                    className="border-b border-border last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <HiKey className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-medium">
                                                {method.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {method.description || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                onClick={() =>
                                                    openEditDialog(method)
                                                }
                                            >
                                                <HiPencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                                onClick={() =>
                                                    openDeleteDialog(method)
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
                            {editingMethod
                                ? "Edit Authentication Method"
                                : "Add Authentication Method"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMethod
                                ? "Update the authentication method details"
                                : "Add a new authentication method for your APIs"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="am-name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="am-name"
                                placeholder="e.g., OAuth 2.0, API Key, mTLS"
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
                            <Label htmlFor="am-description">Description</Label>
                            <Textarea
                                id="am-description"
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
                                : editingMethod
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
                        <AlertDialogTitle>
                            Delete Authentication Method
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {deletingMethod?.name}&quot;? This action cannot be
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
