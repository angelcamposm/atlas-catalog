"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { DeploymentList } from "@/components/ci-cd/DeploymentList";
import { deploymentsApi } from "@/lib/api";
import type { CiDeployment } from "@/types/api";

export default function DeploymentsPage() {
    const { locale } = useParams<{ locale: string }>();
    const router = useRouter();

    const [deployments, setDeployments] = useState<CiDeployment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        setLoading(true);
        deploymentsApi
            .getAll()
            .then((res) => setDeployments(res.data))
            .catch(() => setError("Failed to load deployments"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div className="p-6">
            <PageHeader
                title="Deployments"
                subtitle="CI/CD deployment history"
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
                    <DeploymentList
                        deployments={deployments}
                        onView={(id) =>
                            router.push(`/${locale}/ci-cd/deployments/${id}`)
                        }
                    />
                </div>
            )}
        </div>
    );
}
