"use client";

import { useEffect, useState } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { workflowsApi, deploymentsApi } from "@/lib/api";
import type { WorkflowRun, CiDeployment } from "@/types/api";

/**
 * Dashboard widget showing recent CI/CD workflow runs and deployments.
 */
export function CiCdWidget() {
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [deployments, setDeployments] = useState<CiDeployment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            workflowsApi.getRuns().then((res) => res.data),
            deploymentsApi.getAll().then((res) => res.data),
        ])
            .then(([r, d]) => {
                setRuns(r);
                setDeployments(d);
            })
            .catch(() => {
                setRuns([]);
                setDeployments([]);
            })
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
                <HiOutlineArrowPath className="w-4 h-4" />
                <span>CI/CD</span>
            </div>
            <p className="text-3xl font-bold">{runs.length}</p>
            <p className="text-xs text-muted-foreground">
                workflow runs · {deployments.length} deployments
            </p>
        </div>
    );
}
