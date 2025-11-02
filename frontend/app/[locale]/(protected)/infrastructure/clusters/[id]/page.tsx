"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { HiServerStack } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clustersApi } from "@/lib/api/infrastructure";
import type { ClusterResponse } from "@/types/api";

export default function ClusterDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();
    const [cluster, setCluster] = useState<ClusterResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCluster = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await clustersApi.getById(parseInt(id));
            setCluster(response);
        } catch (err) {
            console.error("Error loading cluster:", err);
            setError("Failed to load cluster details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadCluster();
    }, [loadCluster]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this cluster?")) {
            return;
        }

        try {
            await clustersApi.delete(parseInt(id));
            router.push(`/${locale}/infrastructure/clusters`);
        } catch (err) {
            console.error("Error deleting cluster:", err);
            alert("Failed to delete cluster");
        }
    };

    /* TODO: Implement when backend supports status toggle
    const handleToggleStatus = async () => {
        if (!cluster) return;
        // Cluster model doesn't have is_active field
        console.warn("Cluster status toggle not implemented");
    };
    */

    if (loading) {
        return (
            <div className="container mx-auto flex min-h-[400px] items-center justify-center p-6">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                    <p className="text-muted-foreground">Loading cluster...</p>
                </div>
            </div>
        );
    }

    if (error || !cluster) {
        return (
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/infrastructure/clusters`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Cluster Not Found
                    </h1>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                            {error ||
                                "The requested cluster could not be found."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const clusterData = cluster.data;

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/infrastructure/clusters`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <HiServerStack className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {clusterData.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Cluster ID: {clusterData.id}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* TODO: Implement status toggle when backend supports it */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.push(
                                `/${locale}/infrastructure/clusters/${id}/edit`
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
                            <p className="mt-1 text-base">{clusterData.name}</p>
                        </div>
                        {clusterData.display_name && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Display Name
                                </label>
                                <p className="mt-1 text-base">
                                    {clusterData.display_name}
                                </p>
                            </div>
                        )}
                        {clusterData.version && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Version
                                </label>
                                <p className="mt-1 text-base">
                                    {clusterData.version}
                                </p>
                            </div>
                        )}
                        {clusterData.full_version && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Full Version
                                </label>
                                <p className="mt-1 text-base">
                                    {clusterData.full_version}
                                </p>
                            </div>
                        )}
                        {clusterData.api_url && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    API URL
                                </label>
                                <p className="mt-1 break-all font-mono text-sm">
                                    {clusterData.api_url}
                                </p>
                            </div>
                        )}
                        {clusterData.cluster_uuid && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    UUID
                                </label>
                                <p className="mt-1 font-mono text-sm">
                                    {clusterData.cluster_uuid}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Technical Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Technical Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {clusterData.type_id && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Type ID
                                </label>
                                <p className="mt-1 text-base">
                                    {clusterData.type_id}
                                </p>
                            </div>
                        )}
                        {clusterData.lifecycle_id && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Lifecycle ID
                                </label>
                                <p className="mt-1 text-base">
                                    {clusterData.lifecycle_id}
                                </p>
                            </div>
                        )}
                        {clusterData.timezone && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Timezone
                                </label>
                                <p className="mt-1 text-base">
                                    {clusterData.timezone}
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
                                User ID: {clusterData.created_by || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Created At
                            </label>
                            <p className="mt-1 text-base">
                                {new Date(
                                    clusterData.created_at
                                ).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Updated By
                            </label>
                            <p className="mt-1 text-base">
                                User ID: {clusterData.updated_by || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Updated At
                            </label>
                            <p className="mt-1 text-base">
                                {new Date(
                                    clusterData.updated_at
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Associated Resources - Placeholder for future implementation */}
            <Card>
                <CardHeader>
                    <CardTitle>Associated Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="mb-2 font-medium">Nodes</h4>
                            <p className="text-sm text-muted-foreground">
                                Node associations will be displayed here
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-2 font-medium">
                                Service Accounts
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Service account associations will be displayed
                                here
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
