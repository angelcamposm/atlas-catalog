"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { PageHeader } from "@/components/layout/PageHeader";
import { ResourceForm } from "@/components/resources";
import { resourcesApi } from "@/lib/api";
import type { CreateResourceRequest } from "@/types/api";

export default function NewResourcePage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params.locale as string) || "en";

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: CreateResourceRequest) => {
        try {
            setSaving(true);
            setError(null);
            const response = await resourcesApi.create(data);
            router.push(`/${locale}/resources/${response.data.id}`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error creating resource"
            );
            console.error("Error creating resource:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push(`/${locale}/resources`);
    };

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            {/* Back Button */}
            <Link
                href={`/${locale}/resources`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <HiArrowLeft className="h-4 w-4" />
                Back to Resources
            </Link>

            <PageHeader
                title="Create Resource"
                subtitle="Add a new infrastructure resource to the catalog"
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <div className="max-w-2xl">
                <ResourceForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={saving}
                />
            </div>
        </div>
    );
}
