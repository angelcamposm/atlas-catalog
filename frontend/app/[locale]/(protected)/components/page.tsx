"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineCube } from "react-icons/hi2";
import { componentsApi } from "@/lib/api/components";
import type { ComponentsQueryParams } from "@/lib/api/components";
import type { Component } from "@/types/api";
import { useResourceList } from "@/hooks/use-resource";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Toolbar } from "@/components/ui/Toolbar";
import { PageHeader } from "@/components/layout/PageHeader";

// ── Column definitions ────────────────────────────────────────────────────

const COLUMNS: Column<Component>[] = [
    {
        key: "display_name",
        header: "Nombre",
        render: (c) => c.display_name || c.name,
    },
    { key: "slug", header: "Slug", accessor: "slug" },
    {
        key: "type_id",
        header: "Tipo",
        render: (c) => (c.type_id != null ? String(c.type_id) : "—"),
    },
];

// ============================================================================
// Main Page Component
// ============================================================================

export default function ComponentsPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "es";

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const queryParams: ComponentsQueryParams = {
        page,
        search: search || undefined,
    };

    const { data, loading } = useResourceList(
        componentsApi.getAll,
        queryParams,
    );

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
                title="Componentes"
                subtitle="Catálogo de componentes de la plataforma"
                icon={HiOutlineCube}
            />

            <Toolbar
                searchPlaceholder="Buscar componentes..."
                searchValue={search}
                onSearch={handleSearch}
                totalResults={data?.meta?.total}
            />

            <DataTable
                columns={COLUMNS}
                data={data?.data ?? []}
                loading={loading}
                emptyTitle="Sin resultados"
                emptyDescription="No se encontraron componentes con los filtros actuales."
                onRowClick={(c) =>
                    router.push(`/${locale}/components/${c.slug || c.id}`)
                }
                pagination={pagination}
            />
        </div>
    );
}
