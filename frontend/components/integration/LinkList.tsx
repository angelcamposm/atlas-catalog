"use client";

import { useState, useEffect, useCallback } from "react";
import { Cable, ArrowRight } from "lucide-react";
import { linksApi } from "@/lib/api";
import type { Link } from "@/types/api";
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

interface LinkListProps {
    onSelectLink?: (link: Link) => void;
    showActions?: boolean;
}

export function LinkList({ onSelectLink, showActions = true }: LinkListProps) {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadLinks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await linksApi.getAll(page);
            setLinks(response.data);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error loading links"
            );
            console.error("Error loading links:", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadLinks();
    }, [loadLinks]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this link?")) return;

        try {
            await linksApi.delete(id);
            loadLinks();
        } catch (err) {
            console.error("Error deleting link:", err);
            alert("Failed to delete link");
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
                    <Button onClick={loadLinks} variant="outline">
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (links.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Links Found</CardTitle>
                    <CardDescription>
                        There are no integration links configured yet.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {links.map((link) => (
                    <Card
                        key={link.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onSelectLink?.(link)}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                        <Cable className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {link.name ?? `Link #${link.id}`}
                                        </CardTitle>
                                        {link.description && (
                                            <CardDescription>
                                                {link.description}
                                            </CardDescription>
                                        )}
                                    </div>
                                </div>
                                {link.type_id && (
                                    <Badge variant="secondary">
                                        Type ID: {link.type_id}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Model Info */}
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Model
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {link.model_name && (
                                            <Badge variant="primary">
                                                {link.model_name}
                                            </Badge>
                                        )}
                                        {link.model_id && (
                                            <span className="text-sm font-medium">
                                                ID: {link.model_id}
                                            </span>
                                        )}
                                        {!link.model_name && !link.model_id && (
                                            <span className="text-sm text-muted-foreground">
                                                N/A
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* URL */}
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        URL
                                    </p>
                                    {link.url ? (
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline dark:text-blue-400 truncate block"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {link.url}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">
                                            N/A
                                        </span>
                                    )}
                                </div>
                            </div>

                            {showActions && (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // TODO: Navigate to edit page
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(link.id);
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
