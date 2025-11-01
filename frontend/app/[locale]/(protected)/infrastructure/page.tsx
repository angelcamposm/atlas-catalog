"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Server, Cpu, Plus, TrendingUp, Activity } from "lucide-react";
import { HiServer, HiServerStack } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { clustersApi, nodesApi } from "@/lib/api/infrastructure";
import type { Cluster, Node } from "@/types/api";

export default function InfrastructureDashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = use(params);
    const t = useTranslations("infrastructure");
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [clustersResponse, nodesResponse] = await Promise.all([
                clustersApi.getAll(1),
                nodesApi.getAll(1),
            ]);
            setClusters(clustersResponse.data);
            setNodes(nodesResponse.data);
        } catch (error) {
            console.error("Error loading infrastructure data:", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        totalClusters: clusters.length,
        activeClusters: clusters.filter((c) => c.is_active).length,
        totalNodes: nodes.length,
        activeNodes: nodes.filter((n) => n.is_active).length,
        masterNodes: nodes.filter((n) => n.node_role === "master").length,
        workerNodes: nodes.filter((n) => n.node_role === "worker").length,
    };

    if (loading) {
        return (
            <div className="container mx-auto flex min-h-[400px] items-center justify-center p-6">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                    <p className="text-muted-foreground">{t("loading")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <PageHeader
                icon={HiServer}
                title={t("title")}
                subtitle={t("subtitle")}
                actions={
                    <>
                        <Link href={`/${locale}/infrastructure/clusters/new`}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                {t("newCluster")}
                            </Button>
                        </Link>
                        <Link href={`/${locale}/infrastructure/nodes/new`}>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                {t("newNode")}
                            </Button>
                        </Link>
                    </>
                }
            />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Clusters */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.totalClusters")}
                        </CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalClusters}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeClusters} {t("stats.active")}
                        </p>
                    </CardContent>
                </Card>

                {/* Total Nodes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.totalNodes")}
                        </CardTitle>
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalNodes}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeNodes} {t("stats.active")}
                        </p>
                    </CardContent>
                </Card>

                {/* Master Nodes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.masterNodes")}
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.masterNodes}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("stats.controlPlane")}
                        </p>
                    </CardContent>
                </Card>

                {/* Worker Nodes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.workerNodes")}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.workerNodes}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("stats.workload")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Clusters and Nodes */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Clusters */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{t("clusters.title")}</CardTitle>
                            <Link href={`/${locale}/infrastructure/clusters`}>
                                <Button variant="ghost" size="sm">
                                    {t("clusters.viewAll")}
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {clusters.length === 0 ? (
                            <div className="py-8 text-center">
                                <HiServerStack className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">
                                    {t("clusters.empty")}
                                </p>
                                <Link
                                    href={`/${locale}/infrastructure/clusters/new`}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t("newCluster")}
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {clusters.slice(0, 5).map((cluster) => (
                                    <Link
                                        key={cluster.id}
                                        href={`/${locale}/infrastructure/clusters/${cluster.id}`}
                                        className="block"
                                    >
                                        <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent">
                                            <div className="flex items-center gap-3">
                                                <HiServerStack className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-medium">
                                                        {cluster.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {cluster.version}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    cluster.is_active
                                                        ? "success"
                                                        : "secondary"
                                                }
                                            >
                                                {cluster.is_active
                                                    ? t("clusters.active")
                                                    : t("clusters.inactive")}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Nodes */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{t("nodes.title")}</CardTitle>
                            <Link href={`/${locale}/infrastructure/nodes`}>
                                <Button variant="ghost" size="sm">
                                    {t("nodes.viewAll")}
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {nodes.length === 0 ? (
                            <div className="py-8 text-center">
                                <Cpu className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">
                                    {t("nodes.empty")}
                                </p>
                                <Link
                                    href={`/${locale}/infrastructure/nodes/new`}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t("newNode")}
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {nodes.slice(0, 5).map((node) => (
                                    <Link
                                        key={node.id}
                                        href={`/${locale}/infrastructure/nodes/${node.id}`}
                                        className="block"
                                    >
                                        <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent">
                                            <div className="flex items-center gap-3">
                                                <Cpu className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-medium">
                                                        {node.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {node.hostname}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant="secondary">
                                                    {node.node_role === "master"
                                                        ? t("nodes.master")
                                                        : t("nodes.worker")}
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        node.is_active
                                                            ? "success"
                                                            : "secondary"
                                                    }
                                                >
                                                    {node.is_active
                                                        ? t("nodes.active")
                                                        : t("nodes.inactive")}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
