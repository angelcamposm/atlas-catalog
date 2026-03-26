"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { HiArrowLeft } from "react-icons/hi2";
import { WorkflowRunDetail } from "@/components/ci-cd/WorkflowRunDetail";
import { workflowsApi } from "@/lib/api";
import type { WorkflowRun, WorkflowJob, WorkflowCommit } from "@/types/api";

interface PageProps {
    params: Promise<{ locale: string; id: string }>;
}

export default function WorkflowRunDetailPage({ params }: PageProps) {
    const { locale, id } = use(params);
    const router = useRouter();
    const runId = parseInt(id, 10);

    const [run, setRun] = useState<WorkflowRun | null>(null);
    const [jobs, setJobs] = useState<WorkflowJob[]>([]);
    const [commits, setCommits] = useState<WorkflowCommit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNaN(runId)) {
            setError("Invalid run ID");
            setLoading(false);
            return;
        }

        Promise.all([
            workflowsApi.getRunById(runId),
            workflowsApi.getJobs(runId),
            workflowsApi.getCommits(),
        ])
            .then(([runRes, jobsRes, commitsRes]) => {
                setRun(runRes.data);
                setJobs(jobsRes.data);
                setCommits(commitsRes.data);
            })
            .catch(() => setError("Failed to load workflow run details"))
            .finally(() => setLoading(false));
    }, [runId]);

    return (
        <div className="p-6">
            <div className="mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/${locale}/ci-cd/runs`)}
                >
                    <HiArrowLeft className="h-4 w-4 mr-1" />
                    Back to Runs
                </Button>
            </div>

            {loading && (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-48 w-full" />
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {!loading && !error && run && (
                <>
                    <PageHeader
                        title={run.name}
                        description={`Run #${run.id}`}
                    />
                    <div className="mt-4">
                        <WorkflowRunDetail
                            run={run}
                            jobs={jobs}
                            commits={commits}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
