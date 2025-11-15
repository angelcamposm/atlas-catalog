"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Cpu, CheckCircle2, XCircle } from "lucide-react";
import { nodesApi } from "@/lib/api";
import type { Node } from "@/types/api";
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

interface NodeListProps {
    onSelectNode?: (node: Node) => void;
    showActions?: boolean;
}

export function NodeList({ onSelectNode, showActions = true }: NodeListProps) {
    const router = useRouter();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadNodes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await nodesApi.getAll(page);
            setNodes(response.data);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading nodes"
            );
            console.error("Error loading nodes:", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadNodes();
    }, [loadNodes]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this node?")) return;

        try {
            await nodesApi.delete(id);
            loadNodes();
        } catch (err) {
            console.error("Error deleting node:", err);
            alert("Failed to delete node");
        }
    };

    const formatBytes = (bytes: number) => {
        const gb = bytes / (1024 * 1024 * 1024);
        return `${gb.toFixed(2)} GB`;
    };

    const getNodeTypeColor = (type: string) => {
        switch (type) {
            case "physical":
                return "primary";
            case "virtual":
                return "secondary";
            case "cloud":
                return "warning";
            default:
                return "secondary";
        }
    };

    const getNodeRoleColor = (role: string) => {
        switch (role) {
            case "master":
                return "danger";
            case "worker":
                return "success";
            case "etcd":
                return "warning";
            default:
                return "secondary";
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
                    <Button onClick={loadNodes} variant="outline">
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (nodes.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Nodes Found</CardTitle>
                    <CardDescription>
                        There are no nodes configured yet.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {nodes.map((node) => (
                    <Card
                        key={node.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onSelectNode?.(node)}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                                        <Cpu className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {node.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {node.hostname} ({node.ip_address})
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge
                                        variant={getNodeTypeColor(
                                            node.node_type
                                        )}
                                    >
                                        {node.node_type}
                                    </Badge>
                                    <Badge
                                        variant={getNodeRoleColor(
                                            node.node_role
                                        )}
                                    >
                                        {node.node_role}
                                    </Badge>
                                    <Badge
                                        variant={
                                            node.is_active
                                                ? "success"
                                                : "danger"
                                        }
                                    >
                                        {node.is_active ? (
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                        ) : (
                                            <XCircle className="mr-1 h-3 w-3" />
                                        )}
                                        {node.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        CPU
                                    </p>
                                    <p className="font-medium">
                                        {node.cpu_cores} cores
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {node.cpu_architecture}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Memory
                                    </p>
                                    <p className="font-medium">
                                        {formatBytes(node.memory_bytes)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Storage
                                    </p>
                                    <p className="font-medium">
                                        {formatBytes(node.storage_bytes)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Type
                                    </p>
                                    <p className="font-medium capitalize">
                                        {node.node_type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Role
                                    </p>
                                    <p className="font-medium capitalize">
                                        {node.node_role}
                                    </p>
                                </div>
                            </div>

                            {showActions && (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/infrastructure/nodes/${node.id}`);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(node.id);
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
