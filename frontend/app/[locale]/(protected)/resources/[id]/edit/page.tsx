"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceForm } from "@/components/resources";
import { resourcesApi } from "@/lib/api";
import type { Resource, UpdateResourceRequest } from "@/types/api";

export default function EditResourcePage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params.locale as string) || "en";
    const resourceId = params.id as string;

    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadResource = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await resourcesApi.getById(parseInt(resourceId));
            setResource(response.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading resource"
            );
            console.error("Error loading resource:", err);
        } finally {
            setLoading(false);
        }
    }, [resourceId]);

    useEffect(() => {
        if (resourceId) {
            loadResource();
        }
    }, [resourceId, loadResource]);

    const handleSubmit = async (data: UpdateResourceRequest) => {
        try {
            setSaving(true);
            setError(null);
            await resourcesApi.update(parseInt(resourceId), data);
            router.push(`/${locale}/resources/${resourceId}`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error updating resource"
            );
            console.error("Error updating resource:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push(`/${locale}/resources/${resourceId}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-96 w-full max-w-2xl" />
            </div>
        );
    }

    if (error && !resource) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
                    <h2 className="text-lg font-semibold text-destructive">
                        Error Loading Resource
                    </h2>
                    <p className="mt-2 text-sm text-destructive/80">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            {/* Back Button */}
            <Link
                href={`/${locale}/resources/${resourceId}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <HiArrowLeft className="h-4 w-4" />
                Back to Resource
            </Link>

            <PageHeader
                title="Edit Resource"
                subtitle={`Update the details of "${
                    resource?.name || "Resource"
                }"`}
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <div className="max-w-2xl">
                <ResourceForm
                    resource={resource}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={saving}
                />
            </div>
        </div>
    );
}
