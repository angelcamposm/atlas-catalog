"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { HiCube } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { platformsApi } from "@/lib/api/platform";
import type { PlatformResponse } from "@/types/api";

export default function PlatformDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();
    const [platform, setPlatform] = useState<PlatformResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPlatform = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await platformsApi.getById(parseInt(id));
            setPlatform(response);
        } catch (err) {
            console.error("Error loading platform:", err);
            setError("Failed to load platform details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadPlatform();
    }, [loadPlatform]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this platform?")) {
            return;
        }

        try {
            await platformsApi.delete(parseInt(id));
            router.push(`/${locale}/platform/platforms`);
        } catch (err) {
            console.error("Error deleting platform:", err);
            alert("Failed to delete platform");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto flex min-h-[400px] items-center justify-center p-6">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                    <p className="text-muted-foreground">Loading platform...</p>
                </div>
            </div>
        );
    }

    if (error || !platform) {
        return (
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/platform/platforms`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Platform Not Found
                    </h1>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                            {error ||
                                "The requested platform could not be found."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const platformData = platform.data;

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/platform/platforms`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <HiCube className="h-8 w-8 text-purple-600" />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {platformData.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Platform ID: {platformData.id}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.push(
                                `/${locale}/platform/platforms/${id}/edit`
                            )
                        }
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Main Information */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Name
                            </label>
                            <p className="mt-1 text-base">
                                {platformData.name}
                            </p>
                        </div>
                        {platformData.description && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Description
                                </label>
                                <p className="mt-1 text-base">
                                    {platformData.description}
                                </p>
                            </div>
                        )}
                        {platformData.icon && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Icon
                                </label>
                                <p className="mt-1 text-base">
                                    {platformData.icon}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Metadata */}
            <Card>
                <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Created By
                            </label>
                            <p className="mt-1 text-base">
                                User ID: {platformData.created_by || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Created At
                            </label>
                            <p className="mt-1 text-base">
                                {new Date(
                                    platformData.created_at
                                ).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Updated By
                            </label>
                            <p className="mt-1 text-base">
                                User ID: {platformData.updated_by || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Updated At
                            </label>
                            <p className="mt-1 text-base">
                                {new Date(
                                    platformData.updated_at
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
