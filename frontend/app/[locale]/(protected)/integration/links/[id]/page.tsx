"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Edit,
    Trash2,
    Power,
    PowerOff,
    ArrowRight,
} from "lucide-react";
import { HiLink } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { linksApi } from "@/lib/api/integration";
import type { LinkResponse } from "@/types/api";

export default function LinkDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();
    const [link, setLink] = useState<LinkResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLink = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await linksApi.getById(parseInt(id));
            setLink(response);
        } catch (err) {
            console.error("Error loading link:", err);
            setError("Failed to load link details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadLink();
    }, [loadLink]);

    const handleDelete = async () => {
        if (
            !confirm("Are you sure you want to delete this integration link?")
        ) {
            return;
        }

        try {
            await linksApi.delete(parseInt(id));
            router.push(`/${locale}/integration/links`);
        } catch (err) {
            console.error("Error deleting link:", err);
            alert("Failed to delete link");
        }
    };

    const handleToggleStatus = async () => {
        if (!link) return;

        try {
            await linksApi.update(parseInt(id), {
                is_active: !link.data.is_active,
            });
            loadLink(); // Reload to get updated data
        } catch (err) {
            console.error("Error updating link status:", err);
            alert("Failed to update link status");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto flex min-h-[400px] items-center justify-center p-6">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                    <p className="text-muted-foreground">
                        Loading integration link...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !link) {
        return (
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/integration/links`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Link Not Found
                    </h1>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                            {error ||
                                "The requested integration link could not be found."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const linkData = link.data;

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/integration/links`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <HiLink className="h-8 w-8 text-green-600" />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {linkData.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Link ID: {linkData.id}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleStatus}
                    >
                        {linkData.is_active ? (
                            <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <Power className="mr-2 h-4 w-4" />
                                Activate
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.push(
                                `/${locale}/integration/links/${id}/edit`
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

            {/* Status and Type Badges */}
            <div className="flex gap-2">
                <Badge variant={linkData.is_active ? "success" : "secondary"}>
                    {linkData.is_active ? "Active" : "Inactive"}
                </Badge>
            </div>

            {/* Model Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Model Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Model Name
                            </label>
                            <p className="mt-1 text-base">
                                {linkData.model_name || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Model ID
                            </label>
                            <p className="mt-1 text-base">
                                {linkData.model_id || "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                            <p className="mt-1 text-base">{linkData.name}</p>
                        </div>
                        {linkData.description && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Description
                                </label>
                                <p className="mt-1 text-base">
                                    {linkData.description}
                                </p>
                            </div>
                        )}
                        {linkData.url && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    URL
                                </label>
                                <p className="mt-1 break-all font-mono text-sm">
                                    {linkData.url}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Link Type Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Link Type</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Type ID
                            </label>
                            <p className="mt-1 text-base">
                                {linkData.type_id || "N/A"}
                            </p>
                        </div>
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
                                User ID: {linkData.created_by || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Created At
                            </label>
                            <p className="mt-1 text-base">
                                {new Date(linkData.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Updated By
                            </label>
                            <p className="mt-1 text-base">
                                User ID: {linkData.updated_by || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Updated At
                            </label>
                            <p className="mt-1 text-base">
                                {new Date(linkData.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
