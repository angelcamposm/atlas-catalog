"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { HiArrowLeft } from "react-icons/hi2";
import { ReleaseDetail } from "@/components/ci-cd/ReleaseDetail";
import { releasesApi } from "@/lib/api";
import type { CiRelease } from "@/types/api";

export default function ReleaseDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();

    const [release, setRelease] = useState<CiRelease | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        releasesApi
            .getById(parseInt(id))
            .then((res) => setRelease(res.data))
            .catch(() => setError("Failed to load release"))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="p-6">
            <div className="mb-4">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/${locale}/ci-cd/releases`)}
                >
                    <HiArrowLeft className="h-4 w-4 mr-1" />
                    Back to Releases
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

            {!loading && !error && release && (
                <>
                    <PageHeader
                        title={release.version ?? `Release #${release.id}`}
                        subtitle="Release details"
                    />
                    <div className="mt-4">
                        <ReleaseDetail release={release} />
                    </div>
                </>
            )}
        </div>
    );
}
