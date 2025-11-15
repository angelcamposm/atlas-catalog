"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import {
    Server,
    Cube,
    Link as LinkIcon,
    Tag,
    GitBranch,
    BarChart3,
    TrendingUp,
    Activity,
} from "lucide-react";
import {
    apisApi,
    clustersApi,
    platformsApi,
    linksApi,
    apiTypesApi,
    lifecyclesApi,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Stats {
    apis: number;
    clusters: number;
    platforms: number;
    links: number;
    apiTypes: number;
    lifecycles: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        apis: 0,
        clusters: 0,
        platforms: 0,
        links: 0,
        apiTypes: 0,
        lifecycles: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const [
                    apisResponse,
                    clustersResponse,
                    platformsResponse,
                    linksResponse,
                    apiTypesResponse,
                    lifecyclesResponse,
                ] = await Promise.all([
                    apisApi.getAll(1).catch(() => ({ meta: { total: 0 } })),
                    clustersApi.getAll(1).catch(() => ({ meta: { total: 0 } })),
                    platformsApi.getAll(1).catch(() => ({ meta: { total: 0 } })),
                    linksApi.getAll(1).catch(() => ({ meta: { total: 0 } })),
                    apiTypesApi.getAll(1).catch(() => ({ meta: { total: 0 } })),
                    lifecyclesApi
                        .getAll(1)
                        .catch(() => ({ meta: { total: 0 } })),
                ]);

                setStats({
                    apis: apisResponse.meta.total,
                    clusters: clustersResponse.meta.total,
                    platforms: platformsResponse.meta.total,
                    links: linksResponse.meta.total,
                    apiTypes: apiTypesResponse.meta.total,
                    lifecycles: lifecyclesResponse.meta.total,
                });
            } catch (error) {
                console.error("Error loading dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const statCards = [
        {
            title: "APIs",
            value: stats.apis,
            icon: Activity,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
        },
        {
            title: "Clusters",
            value: stats.clusters,
            icon: Server,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/30",
        },
        {
            title: "Platforms",
            value: stats.platforms,
            icon: Cube,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
        },
        {
            title: "Links",
            value: stats.links,
            icon: LinkIcon,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
        },
        {
            title: "API Types",
            value: stats.apiTypes,
            icon: Tag,
            color: "text-pink-600 dark:text-pink-400",
            bgColor: "bg-pink-100 dark:bg-pink-900/30",
        },
        {
            title: "Lifecycles",
            value: stats.lifecycles,
            icon: GitBranch,
            color: "text-cyan-600 dark:text-cyan-400",
            bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
        },
    ];

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your Atlas Catalog
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Total registered
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <a
                            href="/apis"
                            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                            <Activity className="h-5 w-5 text-blue-600" />
                            <div>
                                <div className="font-medium">Manage APIs</div>
                                <div className="text-sm text-muted-foreground">
                                    View and edit API catalog
                                </div>
                            </div>
                        </a>
                        <a
                            href="/infrastructure/clusters"
                            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                            <Server className="h-5 w-5 text-green-600" />
                            <div>
                                <div className="font-medium">View Clusters</div>
                                <div className="text-sm text-muted-foreground">
                                    Infrastructure management
                                </div>
                            </div>
                        </a>
                        <a
                            href="/platform/platforms"
                            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                            <Cube className="h-5 w-5 text-purple-600" />
                            <div>
                                <div className="font-medium">Platforms</div>
                                <div className="text-sm text-muted-foreground">
                                    Platform components
                                </div>
                            </div>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
