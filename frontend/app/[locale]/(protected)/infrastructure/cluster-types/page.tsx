"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { HiCube, HiPlus, HiPencil, HiTrash, HiXCircle } from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { clusterTypesApi } from "@/lib/api/infrastructure";
import type { ClusterType, PaginatedResponse } from "@/types/api";

export default function ClusterTypesPage() {
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const [clusterTypes, setClusterTypes] = useState<ClusterType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadClusterTypes = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: PaginatedResponse<ClusterType> =
                await clusterTypesApi.getAll(page);
            setClusterTypes(response.data);
            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError("Failed to load cluster types");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadClusterTypes(currentPage);
    }, [currentPage, loadClusterTypes]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this cluster type?")) {
            return;
        }

        try {
            await clusterTypesApi.delete(id);
            await loadClusterTypes(currentPage);
        } catch (err) {
            console.error("Failed to delete cluster type:", err);
            alert("Failed to delete cluster type");
        }
    };

    if (loading && clusterTypes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <HiCube className="h-8 w-8 text-cyan-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Cluster Types
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage cluster type configurations and licensing
                            models
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() =>
                        router.push("/infrastructure/cluster-types/create")
                    }
                    className="flex items-center gap-2"
                >
                    <HiPlus className="h-5 w-5" />
                    Create Cluster Type
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <Card className="p-6 border-destructive">
                    <div className="flex items-center gap-2 text-destructive">
                        <HiXCircle className="h-5 w-5" />
                        <p>{error}</p>
                    </div>
                </Card>
            )}

            {/* Cluster Types Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clusterTypes.map((clusterType) => (
                    <Card
                        key={clusterType.id}
                        className="p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {clusterType.name}
                                    </h3>
                                </div>
                                {clusterType.is_enabled !== null && (
                                    <Badge
                                        variant={
                                            clusterType.is_enabled
                                                ? "success"
                                                : "secondary"
                                        }
                                        className="text-xs"
                                    >
                                        {clusterType.is_enabled
                                            ? "Enabled"
                                            : "Disabled"}
                                    </Badge>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t">
                                <div>
                                    ID:{" "}
                                    <span className="font-mono">
                                        {clusterType.id}
                                    </span>
                                </div>
                                {clusterType.vendor_id && (
                                    <div>
                                        Vendor ID: {clusterType.vendor_id}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.push(
                                            `/${locale}/infrastructure/cluster-types/${clusterType.id}/edit`
                                        )
                                    }
                                    className="flex-1 flex items-center gap-2"
                                >
                                    <HiPencil className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(clusterType.id)}
                                    className="text-destructive hover:text-destructive hover:border-destructive"
                                >
                                    <HiTrash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {!loading && clusterTypes.length === 0 && (
                <Card className="p-12 text-center">
                    <HiCube className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No cluster types found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Get started by creating your first cluster type
                        configuration.
                    </p>
                    <Button
                        onClick={() =>
                            router.push("/infrastructure/cluster-types/create")
                        }
                        className="flex items-center gap-2 mx-auto"
                    >
                        <HiPlus className="h-5 w-5" />
                        Create Cluster Type
                    </Button>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
