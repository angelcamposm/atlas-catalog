"use client";

import { useEffect, useState } from "react";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { apisApi } from "@/lib/api";
import type { Api } from "@/types/api";

/**
 * Dashboard widget showing total number of registered APIs.
 */
export function ApiStatsWidget() {
    const [apis, setApis] = useState<Api[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apisApi
            .getAll()
            .then((res) => setApis(res.data))
            .catch(() => setApis([]))
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
                <HiOutlineGlobeAlt className="w-4 h-4" />
                <span>APIs</span>
            </div>
            <p className="text-3xl font-bold">{apis.length}</p>
            <p className="text-xs text-muted-foreground">registered APIs</p>
        </div>
    );
}
