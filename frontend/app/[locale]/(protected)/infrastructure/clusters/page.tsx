"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ClusterList } from "@/components/infrastructure";
import { ClusterDetailSlideOver } from "@/components/infrastructure/ClusterDetailSlideOver";
import type { Cluster } from "@/types/api";

export default function ClustersPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params.locale as string) || "en";

    const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(
        null
    );
    const [slideOverOpen, setSlideOverOpen] = useState(false);

    const handleSelectCluster = (cluster: Cluster) => {
        setSelectedCluster(cluster);
        setSlideOverOpen(true);
    };

    const handleCloseSlideOver = () => {
        setSlideOverOpen(false);
        // Delay clearing the cluster so the animation can complete
        setTimeout(() => setSelectedCluster(null), 300);
    };

    const handleEditCluster = (cluster: Cluster) => {
        router.push(`/${locale}/infrastructure/clusters/${cluster.id}/edit`);
        handleCloseSlideOver();
    };

    const handleDeleteCluster = (cluster: Cluster) => {
        // Refresh the page to reload the list
        router.refresh();
    };

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Kubernetes Clusters
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your Kubernetes clusters and their configurations
                    </p>
                </div>
                <Link href={`/${locale}/infrastructure/clusters/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Cluster
                    </Button>
                </Link>
            </div>

            {/* Cluster List */}
            <ClusterList onSelectCluster={handleSelectCluster} />

            {/* Cluster Detail SlideOver */}
            <ClusterDetailSlideOver
                cluster={selectedCluster}
                open={slideOverOpen}
                onClose={handleCloseSlideOver}
                onEdit={handleEditCluster}
                onDelete={handleDeleteCluster}
                locale={locale}
            />
        </div>
    );
}
