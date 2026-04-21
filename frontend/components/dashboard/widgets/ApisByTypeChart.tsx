"use client";

import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { apisApi, apiTypesApi } from "@/lib/api";
import type { Api, ApiType } from "@/types/api";

/**
 * Maximum number of APIs fetched for client-side aggregation. Should remain
 * in sync with the bound used by the other dashboard distribution widgets.
 */
const MAX_APIS = 100;

const UNKNOWN_LABEL = "Unknown";

interface DataPoint {
    name: string;
    value: number;
}

/**
 * Aggregate APIs by type, resolving each `type_id` to a human-readable
 * name using the provided types catalog. APIs without a type fall under
 * the "Unknown" bucket.
 */
function aggregate(apis: Api[], types: ApiType[]): DataPoint[] {
    const typeNameById = new Map<number, string>(
        types.map((t) => [t.id, t.name]),
    );
    const counts = new Map<string, number>();

    for (const api of apis) {
        const name =
            api.type_id != null
                ? (typeNameById.get(api.type_id) ?? UNKNOWN_LABEL)
                : UNKNOWN_LABEL;
        counts.set(name, (counts.get(name) ?? 0) + 1);
    }

    return Array.from(counts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
}

/**
 * Dashboard widget that renders a bar chart with the distribution of APIs
 * by their type (REST, GraphQL, gRPC, …).
 */
export function ApisByTypeChart() {
    const [data, setData] = useState<DataPoint[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            apisApi.getAll({ per_page: MAX_APIS }),
            apiTypesApi.getAll(),
        ])
            .then(([apisRes, typesRes]) => {
                if (cancelled) return;
                setData(aggregate(apisRes.data, typesRes.data));
            })
            .catch(() => {
                if (cancelled) return;
                setError("Failed to load APIs");
            })
            .finally(() => {
                if (cancelled) return;
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="border rounded-lg p-4 bg-card">
            <h3 className="text-sm font-semibold mb-4">APIs by Type</h3>

            {loading && (
                <div
                    className="animate-pulse h-48 bg-muted rounded"
                    aria-label="Loading chart"
                />
            )}

            {!loading && error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {!loading && !error && data && data.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No APIs to display
                </p>
            )}

            {!loading && !error && data && data.length > 0 && (
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
