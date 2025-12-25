"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ExternalLink, Copy, Check, Globe, HardDrive } from "lucide-react";
import {
    clustersApi,
    clusterTypesApi,
    vendorsApi,
    lifecyclesApi,
    infrastructureTypesApi,
} from "@/lib/api";
import type {
    Cluster,
    ClusterType,
    InfrastructureType,
    Vendor,
    Lifecycle,
} from "@/types/api";
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
import {
    ClusterTypeIcon,
    InfrastructureTypeIcon,
} from "@/components/ui/TypeIcons";

interface ClusterListProps {
    onSelectCluster?: (cluster: Cluster) => void;
    showActions?: boolean;
}

export function ClusterList({
    onSelectCluster,
    showActions = true,
}: ClusterListProps) {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [clusterTypes, setClusterTypes] = useState<ClusterType[]>([]);
    const [infrastructureTypes, setInfrastructureTypes] = useState<
        InfrastructureType[]
    >([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [lifecycles, setLifecycles] = useState<Lifecycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Create lookup maps for related entities
    const clusterTypeMap = useMemo(() => {
        return new Map(clusterTypes.map((t) => [t.id, t]));
    }, [clusterTypes]);

    const infraTypeMap = useMemo(() => {
        return new Map(infrastructureTypes.map((i) => [i.id, i]));
    }, [infrastructureTypes]);

    const vendorMap = useMemo(() => {
        return new Map(vendors.map((v) => [v.id, v]));
    }, [vendors]);

    const lifecycleMap = useMemo(() => {
        return new Map(lifecycles.map((l) => [l.id, l]));
    }, [lifecycles]);

    // Load reference data on mount
    useEffect(() => {
        const loadReferenceData = async () => {
            try {
                const [typesRes, infraRes, vendorsRes, lifecyclesRes] =
                    await Promise.all([
                        clusterTypesApi.getAll(1),
                        infrastructureTypesApi.getAll(1),
                        vendorsApi.getAll(1),
                        lifecyclesApi.getAll(1),
                    ]);
                setClusterTypes(typesRes.data);
                setInfrastructureTypes(infraRes.data);
                setVendors(vendorsRes.data);
                setLifecycles(lifecyclesRes.data);
            } catch (err) {
                console.error("Error loading reference data:", err);
            }
        };
        loadReferenceData();
    }, []);

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

    const handleCopy = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Get lifecycle status badge variant
    const getLifecycleVariant = (
        lifecycle: Lifecycle | undefined
    ):
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "danger"
        | "outline" => {
        if (!lifecycle) return "secondary";
        const name = lifecycle.name.toLowerCase();
        if (name.includes("prod")) return "success";
        if (name.includes("staging") || name.includes("test")) return "warning";
        if (name.includes("dev")) return "primary";
        if (name.includes("deprecated") || name.includes("retired"))
            return "danger";
        return "secondary";
    };

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

    if (loading && clusters.length === 0) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
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
        <div className="space-y-6">
            {/* Grid of Cluster Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clusters.map((cluster) => {
                    const clusterType = cluster.type_id
                        ? clusterTypeMap.get(cluster.type_id)
                        : undefined;
                    const infraType = cluster.infrastructure_type_id
                        ? infraTypeMap.get(cluster.infrastructure_type_id)
                        : undefined;
                    const vendor = cluster.vendor_id
                        ? vendorMap.get(cluster.vendor_id)
                        : undefined;
                    const lifecycle = cluster.lifecycle_id
                        ? lifecycleMap.get(cluster.lifecycle_id)
                        : undefined;

                    return (
                        <Card
                            key={cluster.id}
                            className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-border/60 hover:border-primary/30"
                            onClick={() => onSelectCluster?.(cluster)}
                        >
                            {/* Gradient accent on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                        {/* Dynamic Icon based on Cluster Type */}
                                        <div className="shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg shadow-blue-500/20">
                                            {clusterType ? (
                                                <ClusterTypeIcon
                                                    name={clusterType.name}
                                                    iconClass={clusterType.icon}
                                                    size="lg"
                                                    className="text-white"
                                                />
                                            ) : (
                                                <HardDrive className="h-6 w-6 text-white" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="text-base font-semibold truncate">
                                                {cluster.name}
                                            </CardTitle>
                                            {cluster.display_name && (
                                                <CardDescription className="truncate text-xs mt-0.5">
                                                    {cluster.display_name}
                                                </CardDescription>
                                            )}
                                        </div>
                                    </div>
                                    {/* Lifecycle Badge */}
                                    {lifecycle && (
                                        <Badge
                                            variant={getLifecycleVariant(
                                                lifecycle
                                            )}
                                            className="shrink-0 text-xs"
                                        >
                                            {lifecycle.name}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Type & Infrastructure Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {clusterType && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1.5 text-xs font-normal"
                                        >
                                            <ClusterTypeIcon
                                                name={clusterType.name}
                                                iconClass={clusterType.icon}
                                                size="sm"
                                            />
                                            {clusterType.name}
                                        </Badge>
                                    )}
                                    {infraType && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1.5 text-xs font-normal"
                                        >
                                            <InfrastructureTypeIcon
                                                name={infraType.name}
                                                size="sm"
                                            />
                                            {infraType.name}
                                        </Badge>
                                    )}
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                                    {cluster.version && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Version
                                            </span>
                                            <p className="font-medium truncate">
                                                {cluster.version}
                                            </p>
                                        </div>
                                    )}
                                    {vendor && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Vendor
                                            </span>
                                            <p className="font-medium truncate">
                                                {vendor.name}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* API URL */}
                                {cluster.api_url && (
                                    <div className="rounded-lg bg-muted/50 border border-border/40 p-2">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Globe className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                                                API Endpoint
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <code className="flex-1 text-[11px] font-mono truncate text-foreground/80">
                                                {cluster.api_url}
                                            </code>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopy(
                                                        cluster.api_url!,
                                                        `api-${cluster.id}`
                                                    );
                                                }}
                                                className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                {copiedId ===
                                                `api-${cluster.id}` ? (
                                                    <Check className="h-3 w-3 text-emerald-500" />
                                                ) : (
                                                    <Copy className="h-3 w-3" />
                                                )}
                                            </button>
                                            <a
                                                href={cluster.api_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="shrink-0 p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                                                title="Open in new tab"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                {showActions && (
                                    <div className="flex gap-2 pt-2 border-t border-border/40">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex-1 h-8 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // TODO: Navigate to edit page
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(cluster.id);
                                            }}
                                            className="flex-1 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-3">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
