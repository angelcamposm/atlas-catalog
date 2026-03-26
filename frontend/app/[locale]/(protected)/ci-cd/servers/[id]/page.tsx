"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { ciServersApi } from "@/lib/api";
import { ServerDetail } from "@/components/ci-cd/ServerDetail";
import type { CiServer } from "@/types/api";

interface Props {
    params: Promise<{ id: string; locale: string }>;
}

export default function CiServerDetailPage({ params }: Props) {
    const { id, locale } = use(params);
    const router = useRouter();

    const [server, setServer] = useState<CiServer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        ciServersApi
            .getById(Number(id))
            .then((res) => setServer(res.data))
            .catch((err) =>
                setError(
                    err instanceof Error ? err.message : "Error loading server",
                ),
            )
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title={server?.name ?? "CI Server"}
                subtitle="CI server details"
                actions={
                    <button
                        onClick={() => router.push(`/${locale}/ci-cd/servers`)}
                        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Back to Servers
                    </button>
                }
            />

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                </div>
            ) : server ? (
                <ServerDetail server={server} />
            ) : (
                <p className="text-gray-500">Server not found.</p>
            )}
        </div>
    );
}
