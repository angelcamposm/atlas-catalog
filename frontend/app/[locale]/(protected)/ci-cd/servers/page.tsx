"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiPlus } from "react-icons/hi2";
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
import { ciServersApi } from "@/lib/api";
import { ServerList } from "@/components/ci-cd/ServerList";
import type { CiServer } from "@/types/api";

export default function CIServersPage() {
    const params = useParams();
    const locale = (params.locale as string) || "en";
    const router = useRouter();

    const [servers, setServers] = useState<CiServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingServer, setEditingServer] = useState<CiServer | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingServer, setDeletingServer] = useState<CiServer | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        driver: "",
        url: "",
        is_enabled: true,
    });

    const loadServers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ciServersApi.getAll();
            setServers(response.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading CI servers",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadServers();
    }, [loadServers]);

    const openCreateDialog = () => {
        setEditingServer(null);
        setFormData({ name: "", driver: "", url: "", is_enabled: true });
        setDialogOpen(true);
    };

    const openEditDialog = (id: number) => {
        const server = servers.find((s) => s.id === id);
        if (!server) return;
        setEditingServer(server);
        setFormData({
            name: server.name,
            driver: server.driver ?? "",
            url: server.url ?? "",
            is_enabled: server.is_enabled ?? true,
        });
        setDialogOpen(true);
    };

    const openDeleteDialog = (id: number) => {
        const server = servers.find((s) => s.id === id);
        if (server) {
            setDeletingServer(server);
            setDeleteDialogOpen(true);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) return;
        try {
            setSaving(true);
            setError(null);
            const data = {
                name: formData.name.trim(),
                driver: formData.driver.trim() || undefined,
                url: formData.url.trim() || undefined,
                is_enabled: formData.is_enabled,
            };
            if (editingServer) {
                const response = await ciServersApi.update(
                    editingServer.id,
                    data,
                );
                setServers((prev) =>
                    prev.map((s) =>
                        s.id === editingServer.id ? response.data : s,
                    ),
                );
            } else {
                const response = await ciServersApi.create(data);
                setServers((prev) => [...prev, response.data]);
            }
            setDialogOpen(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error saving CI server",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingServer) return;
        try {
            setDeleting(true);
            await ciServersApi.delete(deletingServer.id);
            setServers((prev) => prev.filter((s) => s.id !== deletingServer.id));
            setDeleteDialogOpen(false);
            setDeletingServer(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error deleting CI server",
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="CI Servers"
                subtitle="Configure and monitor your continuous integration servers"
                actions={
                    <button
                        onClick={openCreateDialog}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <HiPlus className="h-4 w-4" />
                        Add Server
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
                <ServerList
                    servers={servers}
                    onView={(id) =>
                        router.push(`/${locale}/ci-cd/servers/${id}`)
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
                            {editingServer ? "Edit CI Server" : "New CI Server"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingServer
                                ? "Update the CI server configuration."
                                : "Register a new CI server."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="e.g. Jenkins Production"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="driver">Driver</Label>
                            <Input
                                id="driver"
                                value={formData.driver}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        driver: e.target.value,
                                    }))
                                }
                                placeholder="e.g. jenkins, github-actions"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                value={formData.url}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        url: e.target.value,
                                    }))
                                }
                                placeholder="https://ci.example.com"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                id="is_enabled"
                                type="checkbox"
                                checked={formData.is_enabled}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        is_enabled: e.target.checked,
                                    }))
                                }
                                className="h-4 w-4"
                            />
                            <Label htmlFor="is_enabled">Enabled</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            onClick={() => setDialogOpen(false)}
                            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving || !formData.name.trim()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {saving ? "Saving…" : editingServer ? "Update" : "Create"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete CI Server</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {deletingServer?.name}&quot;? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleting ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
