"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiStar, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";
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
import { businessTiersApi } from "@/lib/api";
import type {
    BusinessTier,
    CreateBusinessTierRequest,
    UpdateBusinessTierRequest,
} from "@/types/api";

export default function BusinessTiersPage() {
    const [tiers, setTiers] = useState<BusinessTier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTier, setEditingTier] = useState<BusinessTier | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingTier, setDeletingTier] = useState<BusinessTier | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({ name: "", code: "", description: "" });

    const loadTiers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await businessTiersApi.getAll(page);
            setTiers(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading business tiers");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadTiers();
    }, [loadTiers]);

    const openCreateDialog = () => {
        setEditingTier(null);
        setFormData({ name: "", code: "", description: "" });
        setDialogOpen(true);
    };

    const openEditDialog = (tier: BusinessTier) => {
        setEditingTier(tier);
        setFormData({
            name: tier.name,
            code: tier.code || "",
            description: tier.description || "",
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (tier: BusinessTier) => {
        setDeletingTier(tier);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateBusinessTierRequest | UpdateBusinessTierRequest = {
                name: formData.name,
                code: formData.code || undefined,
                description: formData.description || undefined,
            };
            if (editingTier) {
                await businessTiersApi.update(editingTier.id, data);
            } else {
                await businessTiersApi.create(data as CreateBusinessTierRequest);
            }
            setDialogOpen(false);
            loadTiers();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error saving business tier");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingTier) return;
        try {
            setDeleting(true);
            await businessTiersApi.delete(deletingTier.id);
            setDeleteDialogOpen(false);
            setDeletingTier(null);
            loadTiers();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error deleting business tier");
        } finally {
            setDeleting(false);
        }
    };

    if (loading && tiers.length === 0) {
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
                title="Business Tiers"
                subtitle="Define criticality levels for your services and APIs"
                actions={
                    <Button onClick={openCreateDialog}>
                        <HiPlus className="mr-2 h-4 w-4" />
                        Add Tier
                    </Button>
                }
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={() => setError(null)} className="mt-2">Dismiss</Button>
                </div>
            )}

            <div className="rounded-lg border border-border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tier</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Code</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                                    <HiStar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <p className="mt-4">No business tiers defined yet</p>
                                    <Button variant="outline" size="sm" onClick={openCreateDialog} className="mt-4">
                                        Add first tier
                                    </Button>
                                </td>
                            </tr>
                        ) : (
                            tiers.map((tier) => (
                                <tr key={tier.id} className="border-b border-border last:border-0">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <HiStar className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-medium">{tier.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {tier.code ? (
                                            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">{tier.code}</span>
                                        ) : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {tier.description || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                onClick={() => openEditDialog(tier)}
                                            >
                                                <HiPencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                                onClick={() => openDeleteDialog(tier)}
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTier ? "Edit Business Tier" : "Add Business Tier"}</DialogTitle>
                        <DialogDescription>
                            {editingTier ? "Update the business tier" : "Define a new business criticality tier"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="tier-name">Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="tier-name"
                                placeholder="e.g., Tier 1 - Critical"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tier-code">Code</Label>
                            <Input
                                id="tier-code"
                                placeholder="e.g., T1, CRITICAL"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tier-description">Description</Label>
                            <Textarea
                                id="tier-description"
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
                            {saving ? "Saving..." : editingTier ? "Update" : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Business Tier</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deletingTier?.name}&quot;? This action cannot be undone.
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
