"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiLink, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { linkTypesApi } from "@/lib/api/integration";
import type { LinkType, PaginatedResponse } from "@/types/api";

export default function LinkTypesPage() {
    const router = useRouter();
    const [linkTypes, setLinkTypes] = useState<LinkType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadLinkTypes = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: PaginatedResponse<LinkType> =
                await linkTypesApi.getAll(page);
            setLinkTypes(response.data);
            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
        } catch (err) {
            setError("Failed to load link types");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLinkTypes(currentPage);
    }, [currentPage, loadLinkTypes]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this link type?")) {
            return;
        }

        try {
            await linkTypesApi.delete(id);
            await loadLinkTypes(currentPage);
        } catch (err) {
            console.error("Failed to delete link type:", err);
            alert("Failed to delete link type");
        }
    };

    if (loading && linkTypes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <HiLink className="h-8 w-8 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Link Types
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage integration link type configurations
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() =>
                        router.push("/integration/link-types/create")
                    }
                    className="flex items-center gap-2"
                >
                    <HiPlus className="h-5 w-5" />
                    Create Link Type
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <Card className="p-6 border-destructive">
                    <div className="flex items-center gap-2 text-destructive">
                        <p>{error}</p>
                    </div>
                </Card>
            )}

            {/* Link Types Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {linkTypes.map((linkType) => (
                    <Card
                        key={linkType.id}
                        className="p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {linkType.name}
                                    </h3>
                                    {linkType.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {linkType.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Icon */}
                            {linkType.icon && (
                                <div>
                                    <div className="text-xs font-medium text-muted-foreground mb-1">
                                        Icon
                                    </div>
                                    <Badge variant="secondary" className="text-xs font-mono">
                                        {linkType.icon}
                                    </Badge>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t">
                                <div>
                                    ID: <span className="font-mono">{linkType.id}</span>
                                </div>
                                <div>
                                    Created:{" "}
                                    {new Date(
                                        linkType.created_at
                                    ).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.push(
                                            `/integration/link-types/${linkType.id}/edit`
                                        )
                                    }
                                    className="flex-1 flex items-center gap-2"
                                >
                                    <HiPencil className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(linkType.id)}
                                    className="text-destructive hover:text-destructive hover:border-destructive"
                                >
                                    <HiTrash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {!loading && linkTypes.length === 0 && (
                <Card className="p-12 text-center">
                    <HiLink className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No link types found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Get started by creating your first link type
                        configuration.
                    </p>
                    <Button
                        onClick={() =>
                            router.push("/integration/link-types/create")
                        }
                        className="flex items-center gap-2 mx-auto"
                    >
                        <HiPlus className="h-5 w-5" />
                        Create Link Type
                    </Button>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
