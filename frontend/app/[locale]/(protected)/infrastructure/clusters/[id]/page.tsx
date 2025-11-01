"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { HiServerStack } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clustersApi } from "@/lib/api/infrastructure";
import type { ClusterResponse } from "@/types/api";

export default function ClusterDetailPage({
    params,
}: {
    params: { locale: string; id: string };
}) {
    const router = useRouter();
    const [cluster, setCluster] = useState<ClusterResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCluster = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await clustersApi.getById(parseInt(params.id));
            setCluster(response);
        } catch (err) {
            console.error("Error loading cluster:", err);
            setError("Failed to load cluster details");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        loadCluster();
    }, [loadCluster]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this cluster?")) {
            return;
        }

        try {
            await clustersApi.delete(parseInt(params.id));
            router.push(`/${params.locale}/infrastructure/clusters`);
        } catch (err) {
            console.error("Error deleting cluster:", err);
            alert("Failed to delete cluster");
        }
    };

    const handleToggleStatus = async () => {
        if (!cluster) return;

        try {
            await clustersApi.update(parseInt(params.id), {
                is_active: !cluster.data.is_active,
            });
            loadCluster(); // Reload to get updated data
        } catch (err) {
            console.error("Error updating cluster status:", err);
            alert("Failed to update cluster status");
        }
    };

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
                    <Link href={`/${params.locale}/infrastructure/clusters`}>
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
                    <Link href={`/${params.locale}/infrastructure/clusters`}>
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleStatus}
                    >
                        {clusterData.is_active ? (
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
                                `/${params.locale}/infrastructure/clusters/${params.id}/edit`
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

            {/* Status Badge */}
            <div>
                <Badge
                    variant={clusterData.is_active ? "success" : "secondary"}
                >
                    {clusterData.is_active ? "Active" : "Inactive"}
                </Badge>
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
                        {clusterData.description && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Description
                                </label>
                                <p className="mt-1 text-base">
                                    {clusterData.description}
                                </p>
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Version
                            </label>
                            <p className="mt-1 text-base">
                                {clusterData.version}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Endpoint
                            </label>
                            <p className="mt-1 break-all font-mono text-sm">
                                {clusterData.endpoint}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Cluster Type Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cluster Type</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {clusterData.cluster_type ? (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Type Name
                                    </label>
                                    <p className="mt-1 text-base">
                                        {clusterData.cluster_type.name}
                                    </p>
                                </div>
                                {clusterData.cluster_type.description && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Description
                                        </label>
                                        <p className="mt-1 text-base">
                                            {
                                                clusterData.cluster_type
                                                    .description
                                            }
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Licensing Model
                                    </label>
                                    <p className="mt-1">
                                        <Badge variant="secondary">
                                            {clusterData.cluster_type.licensing_model
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </Badge>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No cluster type information available
                            </p>
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
