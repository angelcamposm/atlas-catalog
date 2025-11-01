"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Box, Plus, Package, Layers } from "lucide-react";
import { HiCube } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { platformsApi } from "@/lib/api/platform";
import type { Platform } from "@/types/api";

export default function PlatformDashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = use(params);
    const t = useTranslations("platform");
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const platformsResponse = await platformsApi.getAll(1);
            setPlatforms(platformsResponse.data);
        } catch (error) {
            console.error("Error loading platform data:", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        totalPlatforms: platforms.length,
        withVendor: platforms.filter((p) => p.vendor_id).length,
        withUrl: platforms.filter((p) => p.url).length,
        withVersion: platforms.filter((p) => p.version).length,
    };

    if (loading) {
        return (
            <div className="container mx-auto flex min-h-[400px] items-center justify-center p-6">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                    <p className="text-muted-foreground">
                        {t("loading")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <PageHeader
                icon={HiCube}
                title={t("title")}
                subtitle={t("subtitle")}
                actions={
                    <Link href={`/${locale}/platform/platforms/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t("newPlatform")}
                        </Button>
                    </Link>
                }
            />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Platforms */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.totalPlatforms")}
                        </CardTitle>
                        <Box className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalPlatforms}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("stats.registered")}
                        </p>
                    </CardContent>
                </Card>

                {/* With Vendor */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.withVendor")}
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.withVendor}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("stats.vendorAssigned")}
                        </p>
                    </CardContent>
                </Card>

                {/* With URL */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.withUrl")}
                        </CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.withUrl}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("stats.externalLinks")}
                        </p>
                    </CardContent>
                </Card>

                {/* With Version */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("stats.withVersion")}
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.withVersion}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("stats.versionTracked")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Platforms List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{t("platforms.title")}</CardTitle>
                        <Link href={`/${locale}/platform/platforms`}>
                            <Button variant="ghost" size="sm">
                                {t("platforms.viewAll")}
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {platforms.length === 0 ? (
                        <div className="py-12 text-center">
                            <HiCube className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
                            <h3 className="mb-2 text-lg font-semibold">
                                {t("platforms.empty")}
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t("platforms.emptyDescription")}
                            </p>
                            <Link href={`/${locale}/platform/platforms/new`}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Platform
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {platforms.map((platform) => (
                                <Link
                                    key={platform.id}
                                    href={`/${locale}/platform/platforms/${platform.id}`}
                                    className="block"
                                >
                                    <div className="rounded-lg border p-4 transition-all hover:border-purple-500 hover:shadow-md">
                                        <div className="mb-3 flex items-start justify-between">
                                            <HiCube className="h-8 w-8 text-purple-600" />
                                            {platform.version && (
                                                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                    {platform.version}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mb-1 font-semibold">
                                            {platform.name}
                                        </h3>
                                        {platform.description && (
                                            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                                                {platform.description}
                                            </p>
                                        )}
                                        {platform.url && (
                                            <p className="truncate text-xs text-purple-600 dark:text-purple-400">
                                                {platform.url}
                                            </p>
                                        )}
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
