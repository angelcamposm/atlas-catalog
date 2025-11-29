"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HiServerStack } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { EditClusterForm } from "@/components/infrastructure/EditClusterForm";
import { clustersApi } from "@/lib/api/infrastructure";
import type { ClusterResponse } from "@/types/api";

export default function EditClusterPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();
    const [cluster, setCluster] = useState<ClusterResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCluster = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await clustersApi.getById(parseInt(id));
            setCluster(response);
        } catch (err) {
            console.error("Error loading cluster:", err);
            setError("Failed to load cluster details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadCluster();
    }, [loadCluster]);

    const handleSuccess = () => {
        router.push(`/${locale}/infrastructure/clusters/${id}`);
    };

    const handleCancel = () => {
        router.push(`/${locale}/infrastructure/clusters/${id}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto flex min-h-[400px] items-center justify-center p-6">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                    <p className="text-muted-foreground">Loading cluster...</p>
                </div>
            </div>
        );
    }

    if (error || !cluster) {
        return (
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/infrastructure/clusters`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Cluster Not Found
                    </h1>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">
                            {error ||
                                "The requested cluster could not be found."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/${locale}/infrastructure/clusters/${id}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <HiServerStack className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Cluster
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {cluster.data.name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <EditClusterForm
                cluster={cluster.data}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
}
