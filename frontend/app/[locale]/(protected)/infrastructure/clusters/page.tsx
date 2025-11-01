import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ClusterList } from "@/components/infrastructure";

export const metadata: Metadata = {
    title: "Clusters | Atlas Catalog",
    description: "Manage Kubernetes clusters in your infrastructure",
};

export default async function ClustersPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
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
            <ClusterList />
        </div>
    );
}
