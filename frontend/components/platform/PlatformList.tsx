"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box } from "lucide-react";
import { platformsApi } from "@/lib/api";
import type { Platform } from "@/types/api";
import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PlatformListProps {
    onSelectPlatform?: (platform: Platform) => void;
    showActions?: boolean;
}

export function PlatformList({
    onSelectPlatform,
    showActions = true,
}: PlatformListProps) {
    const router = useRouter();
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadPlatforms = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await platformsApi.getAll(page);
            setPlatforms(response.data);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading platforms"
            );
            console.error("Error loading platforms:", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadPlatforms();
    }, [loadPlatforms]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this platform?")) return;

        try {
            await platformsApi.delete(id);
            loadPlatforms();
        } catch (err) {
            console.error("Error deleting platform:", err);
            alert("Failed to delete platform");
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
                    <Button onClick={loadPlatforms} variant="outline">
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (platforms.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Platforms Found</CardTitle>
                    <CardDescription>
                        There are no platforms configured yet.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {platforms.map((platform) => (
                    <Card
                        key={platform.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onSelectPlatform?.(platform)}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                                        <Box className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {platform.name}
                                        </CardTitle>
                                        {platform.description && (
                                            <CardDescription>
                                                {platform.description}
                                            </CardDescription>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Version
                                    </p>
                                    <p className="font-medium">
                                        {platform.version || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        URL
                                    </p>
                                    <p className="font-medium truncate text-sm">
                                        {platform.url ? (
                                            <a
                                                href={platform.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline dark:text-blue-400"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                {platform.url}
                                            </a>
                                        ) : (
                                            "N/A"
                                        )}
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
                                            router.push(`/platform/platforms/${platform.id}`);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(platform.id);
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
