"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { HiServerStack } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { nodesApi } from "@/lib/api/infrastructure";
import type { NodeResponse } from "@/types/api";

export default function NodeDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();
    const [node, setNode] = useState<NodeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadNode = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await nodesApi.getById(parseInt(id));
            setNode(response);
        } catch (err) {
            console.error("Error loading node:", err);
            setError("Failed to load node details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadNode();
    }, [loadNode]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this node?")) {
            return;
        }

        try {
            await nodesApi.delete(parseInt(id));
            router.push(`/${locale}/infrastructure/nodes`);
        } catch (err) {
            console.error("Error deleting node:", err);
            alert("Failed to delete node");
        }
    };

    const handleToggleStatus = async () => {
        if (!node) return;

        /* TODO: Node model doesn't have is_active field
        try {
            await nodesApi.update(parseInt(id), {
                is_active: !node.data.is_active,
            });
            loadNode(); // Reload to get updated data
        } catch (err) {
            console.error("Error updating node status:", err);
            alert("Failed to update node status");
        }
        */
       console.warn("Node status toggle not implemented - field does not exist in model");
    };

    if (loading) {
        return (
            <div className="container mx-auto flex min-h-[400px] items-center justify-center p-6">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                    <p className="text-muted-foreground">Loading node...</p>
                </div>
            </div>
        );
    }

    if (error || !node) {
        return (
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/infrastructure/nodes`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Node Not Found
                    </h1>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                            {error || "The requested node could not be found."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const nodeData = node.data;

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/infrastructure/nodes`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <HiServerStack className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {nodeData.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Node ID: {nodeData.id}
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
                        {nodeData.is_active ? (
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
                                `/${locale}/infrastructure/nodes/${id}/edit`
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
            <div className="flex gap-2">
                <Badge variant={nodeData.is_active ? "success" : "secondary"}>
                    {nodeData.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="secondary">
                    {nodeData.node_type.toUpperCase()}
                </Badge>
                <Badge variant="primary">
                    {nodeData.node_role.toUpperCase()}
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
                            <p className="mt-1 text-base">{nodeData.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Hostname
                            </label>
                            <p className="mt-1 font-mono text-sm">
                                {nodeData.hostname}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                IP Address
                            </label>
                            <p className="mt-1 font-mono text-sm">
                                {nodeData.ip_address}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Environment ID
                            </label>
                            <p className="mt-1 text-base">
                                {nodeData.environment_id}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Hardware Specifications */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hardware Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                CPU Architecture
                            </label>
                            <p className="mt-1 text-base">
                                {nodeData.cpu_architecture}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                CPU Cores
                            </label>
                            <p className="mt-1 text-base">
                                {nodeData.cpu_cores} cores
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Memory
                            </label>
                            <p className="mt-1 text-base">
                                {(
                                    nodeData.memory_bytes /
                                    1024 /
                                    1024 /
                                    1024
                                ).toFixed(2)}{" "}
                                GB
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Storage
                            </label>
                            <p className="mt-1 text-base">
                                {(
                                    nodeData.storage_bytes /
                                    1024 /
                                    1024 /
                                    1024
                                ).toFixed(2)}{" "}
                                GB
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
                                User ID: {nodeData.created_by || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Created At
                            </label>
                            <p className="mt-1 text-base">
                                {new Date(nodeData.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Updated By
                            </label>
                            <p className="mt-1 text-base">
                                User ID: {nodeData.updated_by || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Updated At
                            </label>
                            <p className="mt-1 text-base">
                                {new Date(nodeData.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
