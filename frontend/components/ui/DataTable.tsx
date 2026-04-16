"use client";

/**
 * Generic sortable/paginated data table.
 *
 * @example
 * <DataTable
 *   columns={[{ key: "name", header: "Name", accessor: "name" }]}
 *   data={items}
 *   loading={isLoading}
 *   pagination={{ page: 1, totalPages: 4, onPageChange: setPage }}
 *   onRowClick={(row) => router.push(`/items/${row.id}`)}
 * />
 */

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─── Column definition ──────────────────────────────────────────────────────

export interface Column<T> {
    /** Unique key for this column */
    key: string;
    /** Display header text */
    header: string;
    /** Simple accessor – reads `row[accessor]` as the cell value */
    accessor?: keyof T;
    /** Custom render function (takes precedence over accessor) */
    render?: (row: T) => React.ReactNode;
    /** Adds a sort indicator (UI only) */
    sortable?: boolean;
}

// ─── Pagination ─────────────────────────────────────────────────────────────

export interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// ─── DataTable props ─────────────────────────────────────────────────────────

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    /** Show skeleton rows instead of data */
    loading?: boolean;
    /** Number of skeleton rows to render while loading (default: 5) */
    loadingRows?: number;
    /** Title shown in the empty state */
    emptyTitle?: string;
    /** Description shown in the empty state */
    emptyDescription?: string;
    /** Called when a body row is clicked */
    onRowClick?: (row: T) => void;
    /** Pagination controls rendered below the table */
    pagination?: PaginationProps;
    className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DataTable<T extends { id: number | string }>({
    columns,
    data,
    loading = false,
    loadingRows = 5,
    emptyTitle = "No results",
    emptyDescription,
    onRowClick,
    pagination,
    className,
}: DataTableProps<T>) {
    const showEmpty = !loading && data.length === 0;

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {/* ── Table ── */}
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/40">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 text-left font-medium text-muted-foreground"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading &&
                            Array.from({ length: loadingRows }).map((_, i) => (
                                <tr
                                    key={`skeleton-${i}`}
                                    data-testid="data-table-skeleton-row"
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3">
                                            <Skeleton className="h-4 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {!loading &&
                            data.map((row) => (
                                <tr
                                    key={row.id}
                                    onClick={
                                        onRowClick
                                            ? () => onRowClick(row)
                                            : undefined
                                    }
                                    className={cn(
                                        "border-b last:border-0 transition-colors hover:bg-muted/30",
                                        onRowClick && "cursor-pointer",
                                    )}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3">
                                            {col.render
                                                ? col.render(row)
                                                : col.accessor !== undefined
                                                  ? String(
                                                        row[col.accessor] ?? "",
                                                    )
                                                  : null}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>

                {showEmpty && (
                    <div className="p-8">
                        <EmptyState
                            type="no-results"
                            title={emptyTitle}
                            description={emptyDescription}
                        />
                    </div>
                )}
            </div>

            {/* ── Pagination ── */}
            {pagination && (
                <div className="flex items-center justify-between px-1">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            aria-label="Previous page"
                            disabled={pagination.page <= 1}
                            onClick={() =>
                                pagination.onPageChange(pagination.page - 1)
                            }
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            aria-label="Next page"
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() =>
                                pagination.onPageChange(pagination.page + 1)
                            }
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
