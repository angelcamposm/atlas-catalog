"use client";

import { useEffect, useState } from "react";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { apisApi } from "@/lib/api";
import type { Api } from "@/types/api";

/**
 * Maximum number of APIs fetched for client-side aggregation. The dashboard
 * widget is intentionally bounded; large catalogs should rely on a future
 * server-side stats endpoint.
 */
const MAX_APIS = 100;

type LifecycleBucket = "Active" | "Deprecated" | "Pre-release";

const BUCKETS: LifecycleBucket[] = ["Active", "Deprecated", "Pre-release"];

const COLORS: Record<LifecycleBucket, string> = {
    Active: "#10b981", // emerald-500
    Deprecated: "#ef4444", // red-500
    "Pre-release": "#f59e0b", // amber-500
};

/**
 * Derive the lifecycle bucket of an API from its date fields.
 *
 * Rules (in order):
 *   1. `deprecated_at` set        → Deprecated
 *   2. `released_at` set          → Active
 *   3. otherwise                  → Pre-release
 */
function bucketOf(api: Api): LifecycleBucket {
    if (api.deprecated_at) return "Deprecated";
    if (api.released_at) return "Active";
    return "Pre-release";
}

interface DataPoint {
    name: LifecycleBucket;
    value: number;
    [key: string]: string | number;
}

/**
 * Dashboard widget that renders a pie chart with the distribution of APIs
 * across lifecycle buckets (Active / Deprecated / Pre-release).
 */
export function ApisByLifecycleChart() {
    const [data, setData] = useState<DataPoint[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apisApi
            .getAll({ per_page: MAX_APIS })
            .then((res) => {
                if (cancelled) return;
                const counts: Record<LifecycleBucket, number> = {
                    Active: 0,
                    Deprecated: 0,
                    "Pre-release": 0,
                };
                for (const api of res.data) {
                    counts[bucketOf(api)] += 1;
                }
                setData(BUCKETS.map((name) => ({ name, value: counts[name] })));
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
            <h3 className="text-sm font-semibold mb-4">APIs by Lifecycle</h3>

            {loading && (
                <div
                    className="animate-pulse h-48 bg-muted rounded"
                    aria-label="Loading chart"
                />
            )}

            {!loading && error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {!loading && !error && data && data.every((d) => d.value === 0) && (
                <p className="text-sm text-muted-foreground">
                    No APIs to display
                </p>
            )}

            {!loading && !error && data && data.some((d) => d.value > 0) && (
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius="50%"
                                outerRadius="80%"
                                paddingAngle={2}
                            >
                                {data.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={COLORS[entry.name]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
