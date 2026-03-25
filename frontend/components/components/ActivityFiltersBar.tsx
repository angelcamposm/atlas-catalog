"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Filters {
    query?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
}

interface ActivityFiltersBarProps {
    initial?: Filters;
    onChange?: (filters: Filters) => void;
    className?: string;
}

export function ActivityFiltersBar({
    initial,
    onChange,
    className,
}: ActivityFiltersBarProps) {
    const [filters, setFilters] = React.useState<Filters>(initial ?? {});

    function update(partial: Partial<Filters>) {
        const next = { ...filters, ...partial };
        setFilters(next);
        onChange?.(next);
    }

    function clear() {
        setFilters({});
        onChange?.({});
    }

    return (
        <div className={cn("w-full", className)}>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex-1 min-w-0 flex gap-2 items-center">
                    <input
                        value={filters.query ?? ""}
                        onChange={(e) => update({ query: e.target.value })}
                        placeholder="Buscar actividad..."
                        className="w-full rounded-md border px-3 py-2 text-sm placeholder:opacity-60"
                        aria-label="Buscar actividad"
                    />
                    <select
                        value={filters.type ?? ""}
                        onChange={(e) => update({ type: e.target.value })}
                        className="rounded-md border px-3 py-2 text-sm"
                        aria-label="Filtrar por tipo"
                    >
                        <option value="">Todos</option>
                        <option value="deploy">Deploy</option>
                        <option value="update">Update</option>
                        <option value="alert">Alert</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="sr-only">Desde</label>
                    <input
                        type="date"
                        value={filters.dateFrom ?? ""}
                        onChange={(e) => update({ dateFrom: e.target.value })}
                        className="rounded-md border px-2 py-2 text-sm"
                        aria-label="Fecha desde"
                    />

                    <label className="sr-only">Hasta</label>
                    <input
                        type="date"
                        value={filters.dateTo ?? ""}
                        onChange={(e) => update({ dateTo: e.target.value })}
                        className="rounded-md border px-2 py-2 text-sm"
                        aria-label="Fecha hasta"
                    />

                    <button
                        type="button"
                        onClick={clear}
                        className="rounded-md bg-muted/20 px-3 py-2 text-sm hover:bg-muted/30"
                    >
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ActivityFiltersBar;
