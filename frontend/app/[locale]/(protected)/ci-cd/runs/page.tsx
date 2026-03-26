"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkflowRunList } from "@/components/ci-cd/WorkflowRunList";
import { workflowsApi } from "@/lib/api";
import type { WorkflowRun } from "@/types/api";

export default function WorkflowRunsPage() {
    const { locale } = useParams<{ locale: string }>();
    const router = useRouter();

    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        workflowsApi
            .getRuns()
            .then((res) => setRuns(res.data))
            .catch(() => setError("Failed to load workflow runs"))
            .finally(() => setLoading(false));
    }, []);

    const handleView = (id: number) => {
        router.push(`/${locale}/ci-cd/runs/${id}`);
    };

    return (
        <div className="p-6">
            <PageHeader
                title="Workflow Runs"
                description="All CI/CD workflow run executions"
            />

            {loading && (
                <div className="space-y-2 mt-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="mt-4">
                    <WorkflowRunList runs={runs} onView={handleView} />
                </div>
            )}
        </div>
    );
}
