"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { HiServer } from "react-icons/hi2";
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
    const router = useRouter();
    const resolvedParams = use(params);
    const { locale, id } = resolvedParams;

    const [node, setNode] = useState<NodeResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const loadNode = useCallback(async () => {
        try {
            setLoading(true);
            const response = await nodesApi.getById(parseInt(id));
            setNode(response);
        } catch (err) {
            console.error("Error loading node:", err);
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

    if (!node) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <p className="text-muted-foreground">Node not found</p>
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.push(`/${locale}/infrastructure/nodes`)
                        }
                        className="mt-4"
                    >
                        Back to Nodes
                    </Button>
                </div>
            </div>
        );
    }

    const nodeData = node.data;

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <Link
                        href={`/${locale}/infrastructure/nodes`}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Nodes
                    </Link>
                    <div className="flex items-center gap-3">
                        <HiServer className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
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

            {/* Badges */}
            <div className="flex gap-2">
                <Badge variant="secondary">
                    {nodeData.node_type.toUpperCase()}
                </Badge>
                <Badge variant={nodeData.is_virtual ? "primary" : "secondary"}>
                    {nodeData.is_virtual ? "Virtual" : "Physical"}
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
                                IP Address
                            </label>
                            <p className="mt-1 font-mono text-base">
                                {nodeData.ip_address}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Node Type
                            </label>
                            <p className="mt-1 text-base">
                                {nodeData.node_type}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Hardware Specs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hardware Specs</CardTitle>
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
                                CPU Count
                            </label>
                            <p className="mt-1 text-base">
                                {nodeData.cpu_count}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                CPU Sockets
                            </label>
                            <p className="mt-1 text-base">
                                {nodeData.cpu_sockets}
                            </p>
                        </div>
                        {nodeData.memory_bytes && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Memory
                                </label>
                                <p className="mt-1 text-base">
                                    {(
                                        nodeData.memory_bytes /
                                        1024 ** 3
                                    ).toFixed(2)}{" "}
                                    GB
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
