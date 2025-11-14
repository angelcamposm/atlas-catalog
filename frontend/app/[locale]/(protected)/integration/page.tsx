"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Cable, Plus, Activity, Zap } from "lucide-react";
import { HiLink } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
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
    const t = useTranslations("integration");
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
        activeLinks: links.length, // TODO: El campo is_active no existe en el modelo Link
        synchronous: 0, // TODO: El campo communication_style no existe en el modelo Link
        asynchronous: 0, // TODO: El campo communication_style no existe en el modelo Link
        httpProtocol: 0, // TODO: El campo protocol no existe en el modelo Link
        grpcProtocol: 0, // TODO: El campo protocol no existe en el modelo Link
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
                icon={HiLink}
                title={t("title")}
                subtitle={t("subtitle")}
                actions={
                    <Link href={`/${locale}/integration/links/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t("newLink")}
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
                            {t("stats.totalLinks")}
                        </CardTitle>
                        <Cable className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalLinks}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeLinks} {t("stats.active")}
                        </p>
                    </CardContent>
                </Card>

                {/* Synchronous */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.synchronous")}
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
                            {t("stats.asynchronous")}
                        </CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.asynchronous}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("stats.messageDriven")}
                        </p>
                    </CardContent>
                </Card>

                {/* HTTP/HTTPS */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.httpProtocol")}
                        </CardTitle>
                        <Cable className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.httpProtocol}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.grpcProtocol} {t("stats.grpcProtocol")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Integration Links */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{t("links.title")}</CardTitle>
                        <Link href={`/${locale}/integration/links`}>
                            <Button variant="ghost" size="sm">
                                {t("links.viewAll")}
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {links.length === 0 ? (
                        <div className="py-12 text-center">
                            <HiLink className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
                            <h3 className="mb-2 text-lg font-semibold">
                                {t("links.empty")}
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t("links.emptyDescription")}
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
                                                    {link.description && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {link.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    {link.model_name && (
                                                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                            {link.model_name}
                                                        </span>
                                                    )}
                                                    {link.url && (
                                                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            {link.url}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
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
