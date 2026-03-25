"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { businessCapabilitiesApi } from "@/lib/api";

type Capability = {
    id: number | string;
    name: string;
    description?: string;
    [key: string]: unknown;
};

export default function BusinessCapabilitiesPage() {
    const params = useParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const locale = (params.locale as string) || "en";

    const [capabilities, setCapabilities] = useState<Capability[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadCapabilities = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await businessCapabilitiesApi.getAll(page);
            setCapabilities((response.data as Capability[]) || []);
            setTotalPages(
                (response.meta as { last_page?: number })?.last_page || 1
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error loading business capabilities"
            );
            console.error("Error loading business capabilities:", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadCapabilities();
    }, [loadCapabilities]);

    if (loading && capabilities.length === 0) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="mt-2 h-4 w-96" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Business Capabilities"
                subtitle="Define and manage business capabilities for your organization"
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setError(null)}
                        className="mt-2"
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {capabilities.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
                    <HiBuildingOffice2 className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                        No business capabilities found
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {capabilities.map((cap) => (
                        <div
                            key={String(cap.id)}
                            className="rounded-lg border border-border bg-card p-4"
                        >
                            <div className="flex items-start gap-3">
                                <HiBuildingOffice2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{cap.name}</p>
                                    {cap.description && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {String(cap.description)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
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
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
