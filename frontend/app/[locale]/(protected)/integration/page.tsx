"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Cable, Plus, ArrowRight, Activity, Zap } from "lucide-react";
import { HiLink } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { linksApi } from "@/lib/api/integration";
import type { Link as IntegrationLink } from "@/types/api";

export default function IntegrationDashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = use(params);
    const [links, setLinks] = useState<IntegrationLink[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const linksResponse = await linksApi.getAll(1);
            setLinks(linksResponse.data);
        } catch (error) {
            console.error("Error loading integration data:", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        totalLinks: links.length,
        activeLinks: links.filter((l) => l.is_active).length,
        synchronous: links.filter(
            (l) => l.communication_style === "synchronous"
        ).length,
        asynchronous: links.filter(
            (l) => l.communication_style === "asynchronous"
        ).length,
        httpProtocol: links.filter(
            (l) => l.protocol === "http" || l.protocol === "https"
        ).length,
        grpcProtocol: links.filter((l) => l.protocol === "grpc").length,
    };

    if (loading) {
        return (
            <div className="container mx-auto flex min-h-[400px] items-center justify-center p-6">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                    <p className="text-muted-foreground">
                        Loading integrations...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <PageHeader
                icon={HiLink}
                title="Integration Overview"
                subtitle="Manage your service integrations and communication links"
                actions={
                    <Link href={`/${locale}/integration/links/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Link
                        </Button>
                    </Link>
                }
            />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Links */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Links
                        </CardTitle>
                        <Cable className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalLinks}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeLinks} active
                        </p>
                    </CardContent>
                </Card>

                {/* Synchronous */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Synchronous
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.synchronous}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Request-response
                        </p>
                    </CardContent>
                </Card>

                {/* Asynchronous */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Asynchronous
                        </CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.asynchronous}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Message-driven
                        </p>
                    </CardContent>
                </Card>

                {/* HTTP/HTTPS */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            HTTP/HTTPS
                        </CardTitle>
                        <Cable className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.httpProtocol}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.grpcProtocol} gRPC
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Integration Links */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Integration Links</CardTitle>
                        <Link href={`/${locale}/integration/links`}>
                            <Button variant="ghost" size="sm">
                                View All
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {links.length === 0 ? (
                        <div className="py-12 text-center">
                            <HiLink className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
                            <h3 className="mb-2 text-lg font-semibold">
                                No integration links found
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Get started by creating your first integration
                                link
                            </p>
                            <Link href={`/${locale}/integration/links/new`}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Link
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {links.slice(0, 10).map((link) => (
                                <Link
                                    key={link.id}
                                    href={`/${locale}/integration/links/${link.id}`}
                                    className="block"
                                >
                                    <div className="flex items-center justify-between rounded-lg border p-4 transition-all hover:border-green-500 hover:shadow-md">
                                        <div className="flex flex-1 items-center gap-4">
                                            <HiLink className="h-5 w-5 text-green-600" />
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <p className="font-medium">
                                                        {link.name}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            link.is_active
                                                                ? "success"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {link.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                        {link.source_type}
                                                    </span>
                                                    <ArrowRight className="h-3 w-3" />
                                                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        {link.target_type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">
                                                {link.protocol.toUpperCase()}
                                            </Badge>
                                            <Badge variant="primary">
                                                {link.communication_style.replace(
                                                    "_",
                                                    " "
                                                )}
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
    );
}
