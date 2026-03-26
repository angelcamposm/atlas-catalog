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
import { Button } from "@/components/ui/Button";
import { ReleaseList } from "@/components/ci-cd/ReleaseList";
import { releasesApi } from "@/lib/api";
import type { CiRelease, CreateCiReleaseRequest } from "@/types/api";

export default function ReleasesPage() {
    const { locale } = useParams<{ locale: string }>();
    const router = useRouter();

    const [releases, setReleases] = useState<CiRelease[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CiRelease | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState<CreateCiReleaseRequest>({
        version: "",
        status: "",
        changelog: "",
    });

    const load = useCallback(() => {
        setLoading(true);
        releasesApi
            .getAll()
            .then((res) => setReleases(res.data))
            .catch(() => setError("Failed to load releases"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const openCreate = () => {
        setEditTarget(null);
        setForm({ version: "", status: "", changelog: "" });
        setDialogOpen(true);
    };

    const openEdit = (release: CiRelease) => {
        setEditTarget(release);
        setForm({
            version: release.version ?? "",
            status: release.status ?? "",
            changelog: release.changelog ?? "",
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editTarget) {
                await releasesApi.update(editTarget.id, form);
            } else {
                await releasesApi.create(form);
            }
            setDialogOpen(false);
            load();
        } catch {
            setError("Failed to save release");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await releasesApi.delete(deleteId);
            setDeleteId(null);
            load();
        } catch {
            setError("Failed to delete release");
        }
    };

    return (
        <div className="p-6">
            <PageHeader
                title="Releases"
                description="CI/CD release management"
                action={
                    <Button onClick={openCreate}>
                        <HiPlus className="h-4 w-4 mr-1" />
                        New Release
                    </Button>
                }
            />

            {loading && (
                <div className="space-y-2 mt-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="mt-4">
                    <ReleaseList
                        releases={releases}
                        onView={(id) =>
                            router.push(`/${locale}/ci-cd/releases/${id}`)
                        }
                        onEdit={openEdit}
                        onDelete={setDeleteId}
                    />
                </div>
            )}

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editTarget ? "Edit Release" : "New Release"}
                        </DialogTitle>
                        <DialogDescription>
                            {editTarget
                                ? "Update release details"
                                : "Create a new CI/CD release"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="version">Version</Label>
                            <Input
                                id="version"
                                value={form.version ?? ""}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        version: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Input
                                id="status"
                                value={form.status ?? ""}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        status: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="changelog">Changelog</Label>
                            <textarea
                                id="changelog"
                                className="w-full border rounded-md p-2 text-sm"
                                rows={4}
                                value={form.changelog ?? ""}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        changelog: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Release</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

