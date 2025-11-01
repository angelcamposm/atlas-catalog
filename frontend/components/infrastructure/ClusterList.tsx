"use client";

import { useState, useEffect, useCallback } from "react";
import { Server, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { clustersApi } from "@/lib/api";
import type { Cluster } from "@/types/api";
import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ClusterListProps {
    onSelectCluster?: (cluster: Cluster) => void;
    showActions?: boolean;
}

export function ClusterList({
    onSelectCluster,
    showActions = true,
}: ClusterListProps) {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadClusters = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await clustersApi.getAll(page);
            setClusters(response.data);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading clusters"
            );
            console.error("Error loading clusters:", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadClusters();
    }, [loadClusters]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this cluster?")) return;

        try {
            await clustersApi.delete(id);
            loadClusters(); // Reload the list
        } catch (err) {
            console.error("Error deleting cluster:", err);
            alert("Failed to delete cluster");
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Error</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={loadClusters} variant="outline">
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (clusters.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Clusters Found</CardTitle>
                    <CardDescription>
                        There are no Kubernetes clusters configured yet.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {clusters.map((cluster) => (
                    <Card
                        key={cluster.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onSelectCluster?.(cluster)}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                                        <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {cluster.name}
                                        </CardTitle>
                                        {cluster.description && (
                                            <CardDescription>
                                                {cluster.description}
                                            </CardDescription>
                                        )}
                                    </div>
                                </div>
                                <Badge
                                    variant={
                                        cluster.is_active ? "success" : "danger"
                                    }
                                >
                                    {cluster.is_active ? (
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                    ) : (
                                        <XCircle className="mr-1 h-3 w-3" />
                                    )}
                                    {cluster.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Version
                                    </p>
                                    <p className="font-medium">
                                        {cluster.version}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Endpoint
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <p className="truncate font-medium">
                                            {cluster.endpoint}
                                        </p>
                                        <a
                                            href={cluster.endpoint}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                                {cluster.cluster_type && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Type
                                        </p>
                                        <p className="font-medium">
                                            {cluster.cluster_type.name}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {showActions && (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // TODO: Navigate to edit page
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(cluster.id);
                                        }}
                                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
