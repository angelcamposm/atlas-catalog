"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiCodeBracket, HiPlus, HiPencil, HiTrash, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
import { programmingLanguagesApi } from "@/lib/api";
import type {
    ProgrammingLanguage,
    CreateProgrammingLanguageRequest,
    UpdateProgrammingLanguageRequest,
} from "@/types/api";

export default function ProgrammingLanguagesPage() {
    const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<ProgrammingLanguage | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingLanguage, setDeletingLanguage] = useState<ProgrammingLanguage | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({ name: "", icon: "", url: "", is_enabled: true });

    const loadLanguages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await programmingLanguagesApi.getAll(page);
            setLanguages(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading programming languages");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadLanguages();
    }, [loadLanguages]);

    const openCreateDialog = () => {
        setEditingLanguage(null);
        setFormData({ name: "", icon: "", url: "", is_enabled: true });
        setDialogOpen(true);
    };

    const openEditDialog = (lang: ProgrammingLanguage) => {
        setEditingLanguage(lang);
        setFormData({
            name: lang.name,
            icon: lang.icon || "",
            url: lang.url || "",
            is_enabled: lang.is_enabled ?? true,
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (lang: ProgrammingLanguage) => {
        setDeletingLanguage(lang);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError(null);
            const data: CreateProgrammingLanguageRequest | UpdateProgrammingLanguageRequest = {
                name: formData.name,
                icon: formData.icon || undefined,
                url: formData.url || undefined,
                is_enabled: formData.is_enabled,
            };
            if (editingLanguage) {
                await programmingLanguagesApi.update(editingLanguage.id, data);
            } else {
                await programmingLanguagesApi.create(data as CreateProgrammingLanguageRequest);
            }
            setDialogOpen(false);
            loadLanguages();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error saving language");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingLanguage) return;
        try {
            setDeleting(true);
            await programmingLanguagesApi.delete(deletingLanguage.id);
            setDeleteDialogOpen(false);
            setDeletingLanguage(null);
            loadLanguages();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error deleting language");
        } finally {
            setDeleting(false);
        }
    };

    if (loading && languages.length === 0) {
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
                title="Programming Languages"
                subtitle="Manage the programming languages used across your organization"
                actions={
                    <Button onClick={openCreateDialog}>
                        <HiPlus className="mr-2 h-4 w-4" />
                        Add Language
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
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Language</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Icon</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">URL</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {languages.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                    <HiCodeBracket className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <p className="mt-4">No languages configured yet</p>
                                    <Button variant="outline" size="sm" onClick={openCreateDialog} className="mt-4">
                                        Add first language
                                    </Button>
                                </td>
                            </tr>
                        ) : (
                            languages.map((lang) => (
                                <tr key={lang.id} className="border-b border-border last:border-0">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <HiCodeBracket className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-medium">{lang.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{lang.icon || "—"}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {lang.url ? (
                                            <a href={lang.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                {lang.url}
                                            </a>
                                        ) : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {lang.is_enabled ? (
                                            <Badge variant="success" className="inline-flex items-center gap-1">
                                                <HiCheckCircle className="h-3 w-3" /> Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="inline-flex items-center gap-1">
                                                <HiXCircle className="h-3 w-3" /> Inactive
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                onClick={() => openEditDialog(lang)}
                                            >
                                                <HiPencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="rounded p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                                onClick={() => openDeleteDialog(lang)}
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
                        <DialogTitle>{editingLanguage ? "Edit Language" : "Add Language"}</DialogTitle>
                        <DialogDescription>
                            {editingLanguage ? "Update language details" : "Add a new programming language"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="lang-name">Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="lang-name"
                                placeholder="e.g., TypeScript, Go, Rust"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lang-icon">Icon</Label>
                            <Input
                                id="lang-icon"
                                placeholder="Icon name or URL"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lang-url">URL</Label>
                            <Input
                                id="lang-url"
                                placeholder="https://..."
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="lang-enabled"
                                checked={formData.is_enabled}
                                onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
                                className="h-4 w-4 rounded border-input"
                            />
                            <Label htmlFor="lang-enabled">Enabled</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={saving || !formData.name.trim()}>
                            {saving ? "Saving..." : editingLanguage ? "Update" : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Language</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deletingLanguage?.name}&quot;? This action cannot be undone.
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
