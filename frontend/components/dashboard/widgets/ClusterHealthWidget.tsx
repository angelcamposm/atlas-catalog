"use client";

import { useEffect, useState } from "react";
import { HiOutlineServerStack } from "react-icons/hi2";
import { clustersApi } from "@/lib/api";
import type { Cluster } from "@/types/api";

/**
 * Dashboard widget showing total number of registered clusters.
 */
export function ClusterHealthWidget() {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        clustersApi
            .getAll()
            .then((res) => setClusters(res.data))
            .catch(() => setClusters([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl border bg-card p-6 animate-pulse">
                <div className="h-4 w-24 bg-muted rounded mb-4" />
                <div className="h-8 w-12 bg-muted rounded" />
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <HiOutlineServerStack className="w-4 h-4" />
                <span>Clusters</span>
            </div>
            <p className="text-3xl font-bold">{clusters.length}</p>
            <p className="text-xs text-muted-foreground">registered clusters</p>
        </div>
    );
}
