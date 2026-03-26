"use client";

import { useState, useEffect } from "react";
import { workflowsApi, deploymentsApi } from "@/lib/api";
import { RecentRunsWidget } from "@/components/ci-cd/RecentRunsWidget";
import { DeploymentStatusWidget } from "@/components/ci-cd/DeploymentStatusWidget";
import type { WorkflowRun, CiDeployment } from "@/types/api";

/**
 * CI/CD overview dashboard displaying recent pipeline activity.
 *
 * Fetches and renders recent workflow runs and deployments
 * using the CI/CD API modules.
 */
export function CiCdOverview() {
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [deployments, setDeployments] = useState<CiDeployment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [runsRes, deploymentsRes] = await Promise.all([
                    workflowsApi.getRuns(),
                    deploymentsApi.getAll(),
                ]);
                setRuns(runsRes.data.slice(0, 5));
                setDeployments(deploymentsRes.data.slice(0, 5));
            } catch {
                // Keep empty state on error
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-40 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-xl" />
                <div className="h-40 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RecentRunsWidget runs={runs} />
                <DeploymentStatusWidget deployments={deployments} />
            </div>
        </div>
    );
}
