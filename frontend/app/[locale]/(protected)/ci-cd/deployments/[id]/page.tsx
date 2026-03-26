"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { HiArrowLeft } from "react-icons/hi2";
import { deploymentsApi } from "@/lib/api";
import type { CiDeployment } from "@/types/api";

function field(label: string, value: string | number | null | undefined) {
    return (
        <div>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">
                {value != null && value !== "" ? String(value) : "—"}
            </dd>
        </div>
    );
}

export default function DeploymentDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();

    const [deployment, setDeployment] = useState<CiDeployment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        deploymentsApi
            .getById(parseInt(id))
            .then((res) => setDeployment(res.data))
            .catch(() => setError("Failed to load deployment"))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="p-6">
            <div className="mb-4">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/${locale}/ci-cd/deployments`)}
                >
                    <HiArrowLeft className="h-4 w-4 mr-1" />
                    Back to Deployments
                </Button>
            </div>

            {loading && (
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {!loading && !error && deployment && (
                <>
                    <PageHeader
                        title={
                            deployment.version ??
                            `Deployment #${deployment.id}`
                        }
                        description="Deployment details"
                    />
                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border p-6">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {field("Status", deployment.status)}
                            {field("Version", deployment.version)}
                            {field("Commit Hash", deployment.commit_hash)}
                            {field(
                                "Docker Image Digest",
                                deployment.docker_image_digest
                            )}
                            {field("Environment ID", deployment.environment_id)}
                            {field("Component ID", deployment.component_id)}
                            {field(
                                "Workflow Run ID",
                                deployment.workflow_run_id
                            )}
                            {field("Started At", deployment.started_at)}
                            {field("Ended At", deployment.ended_at)}
                            {field(
                                "Duration (ms)",
                                deployment.duration_milliseconds
                            )}
                        </dl>
                    </div>
                </>
            )}
        </div>
    );
}
