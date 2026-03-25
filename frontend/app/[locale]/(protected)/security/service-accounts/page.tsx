"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiUserGroup, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";
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
import { serviceAccountsApi } from "@/lib/api";
import type {
    ServiceAccount,
    CreateServiceAccountRequest,
    UpdateServiceAccountRequest,
} from "@/types/api";

export default function ServiceAccountsPage() {
    const params = useParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const locale = (params.locale as string) || "en";

    const [accounts, setAccounts] = useState<ServiceAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<ServiceAccount | null>(null);
    const [saving, setSaving] = useState(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState<ServiceAccount | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        namespace: "",
        description: "",
    });

    const loadAccounts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await serviceAccountsApi.getAll(page);
            setAccounts(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading service accounts");
            console.error("Error loading service accounts:", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    const openCreateDialog = () => {
        setEditingAccount(null);
        setFormData({ name: "", namespace: "", description: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (account: ServiceAccount) => {
        setEditingAccount(account);
        setFormData({
            name: account.name,
            namespace: account.namespace || "",
            description: "",
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (account: ServiceAccount) => {
        setDeletingAccount(account);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateServiceAccountRequest | UpdateServiceAccountRequest = {
                name: formData.name,
                namespace: formData.namespace || undefined,
                description: formData.description || undefined,
            };
            if (editingAccount) {
                await serviceAccountsApi.update(editingAccount.id, data);
            } else {
                await serviceAccountsApi.create(data as CreateServiceAccountRequest);
            }
            setDialogOpen(false);
            loadAccounts();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error saving service account");
            console.error("Error saving service account:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingAccount) return;
        try {
            setDeleting(true);
            await serviceAccountsApi.delete(deletingAccount.id);
            setDeleteDialogOpen(false);
            setDeletingAccount(null);
            loadAccounts();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error deleting service account");
            console.error("Error deleting service account:", err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading && accounts.length === 0) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="mt-2 h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-36" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Service Accounts"
                subtitle="Manage service accounts for automation and integrations"
                actions={
                    <Button onClick={openCreateDialog}>
                        <HiPlus className="mr-2 h-4 w-4" />
                        Create Account
                    </Button>
                }
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={() => setError(null)} className="mt-2">
                        Dismiss
                    </Button>
                </div>
            )}

            <div className="rounded-lg border border-border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Namespace</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                                    <HiUserGroup className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <p className="mt-4">No service accounts yet</p>
                                    <Button variant="outline" size="sm" onClick={openCreateDialog} className="mt-4">
                                        Create your first service account
                                    </Button>
                                </td>
                            </tr>
                        ) : (
                            accounts.map((account) => (
                                <tr key={account.id} className="border-b border-border last:border-0">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <HiUserGroup className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-medium">{account.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {account.namespace || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                onClick={() => openEditDialog(account)}
                                            >
                                                <HiPencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                                onClick={() => openDeleteDialog(account)}
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
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                    <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAccount ? "Edit Service Account" : "Create Service Account"}</DialogTitle>
                        <DialogDescription>
                            {editingAccount ? "Update service account details" : "Create a new service account for automation and integrations"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="sa-name">Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="sa-name"
                                placeholder="e.g., github-actions-bot"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sa-namespace">Namespace</Label>
                            <Input
                                id="sa-namespace"
                                placeholder="e.g., ci-cd, monitoring"
                                value={formData.namespace}
                                onChange={(e) => setFormData({ ...formData, namespace: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sa-description">Description</Label>
                            <Textarea
                                id="sa-description"
                                placeholder="Optional description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={saving || !formData.name.trim()}>
                            {saving ? "Saving..." : editingAccount ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Service Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deletingAccount?.name}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
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
