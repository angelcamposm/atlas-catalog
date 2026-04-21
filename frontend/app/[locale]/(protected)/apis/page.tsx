"use client";

import { useEffect, useState } from "react";
import {
    useParams,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { apisApi } from "@/lib/api/apis";
import type { ApisQueryParams } from "@/lib/api/apis";
import type { Api } from "@/types/api";
import { useResourceList } from "@/hooks/use-resource";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Toolbar } from "@/components/ui/Toolbar";
import { PageHeader } from "@/components/layout/PageHeader";

const COLUMNS: Column<Api>[] = [
    {
        key: "display_name",
        header: "Nombre",
        render: (api) => api.display_name || api.name,
    },
    {
        key: "protocol",
        header: "Protocolo",
        render: (api) => api.protocol ?? "—",
    },
    {
        key: "version",
        header: "Versión",
        render: (api) => api.version ?? "—",
    },
];

export default function ApisPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const locale = (params?.locale as string) || "es";

    // Initialize state from URL so that deep-links and the browser
    // back/forward buttons restore the user's context.
    const [search, setSearch] = useState<string>(
        () => searchParams?.get("search") ?? "",
    );
    const [page, setPage] = useState<number>(() => {
        const raw = Number(searchParams?.get("page"));
        return Number.isFinite(raw) && raw >= 1 ? raw : 1;
    });

    // Keep the URL in sync with the current filters so the state is
    // shareable and survives page reloads.
    useEffect(() => {
        const qs = new URLSearchParams();
        if (search) qs.set("search", search);
        if (page > 1) qs.set("page", String(page));
        const nextQs = qs.toString();
        router.replace(nextQs ? `?${nextQs}` : "?", { scroll: false });
    }, [search, page, router]);

    const queryParams: ApisQueryParams = {
        page,
        search: search || undefined,
    };

    const { data, loading } = useResourceList(apisApi.getAll, queryParams);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const pagination =
        data?.meta && data.meta.last_page > 1
            ? {
                  page: data.meta.current_page,
                  totalPages: data.meta.last_page,
                  onPageChange: setPage,
              }
            : undefined;

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <PageHeader
                title="APIs"
                subtitle="Catálogo de APIs disponibles en la plataforma"
                icon={HiOutlineSquares2X2}
            />

            <Toolbar
                searchPlaceholder="Buscar APIs..."
                searchValue={search}
                onSearch={handleSearch}
                totalResults={data?.meta?.total}
            />

            <DataTable
                columns={COLUMNS}
                data={data?.data ?? []}
                loading={loading}
                emptyTitle="Sin resultados"
                emptyDescription="No se encontraron APIs con los filtros actuales."
                onRowClick={(api) => router.push(`/${locale}/apis/${api.id}`)}
                pagination={pagination}
            />
        </div>
    );
}
