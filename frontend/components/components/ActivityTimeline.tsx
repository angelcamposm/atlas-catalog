"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

export interface ActivityItem {
    id: string;
    type: string;
    message: string;
    timestamp: string; // ISO string
}

interface ActivityTimelineProps {
    items: ActivityItem[];
    query?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    className?: string;
}

function groupByDay(items: ActivityItem[]) {
    const map = new Map<string, number>();
    for (const it of items) {
        const day = new Date(it.timestamp).toISOString().slice(0, 10); // YYYY-MM-DD
        map.set(day, (map.get(day) ?? 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([date, count]) => ({
        date,
        count,
    }));
    arr.sort((a, b) => (a.date < b.date ? -1 : 1));
    return arr;
}

function pad(n: number) {
    return n.toString().padStart(2, "0");
}

function formatUTC(ts: string) {
    const d = new Date(ts);
    return `${pad(d.getUTCDate())}/${pad(
        d.getUTCMonth() + 1
    )}/${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(
        d.getUTCMinutes()
    )}:${pad(d.getUTCSeconds())}`;
}

export function ActivityTimeline({
    items,
    query,
    type,
    dateFrom,
    dateTo,
    className,
}: ActivityTimelineProps) {
    const filtered = React.useMemo(() => {
        return items.filter((it) => {
            if (
                query &&
                !it.message.toLowerCase().includes(query.toLowerCase())
            )
                return false;
            if (type && type !== "" && it.type !== type) return false;
            if (dateFrom) {
                const from = new Date(dateFrom);
                if (new Date(it.timestamp) < from) return false;
            }
            if (dateTo) {
                const to = new Date(dateTo);
                const itemDate = new Date(it.timestamp);
                to.setHours(23, 59, 59, 999);
                if (itemDate > to) return false;
            }
            return true;
        });
    }, [items, query, type, dateFrom, dateTo]);

    const series = React.useMemo(() => groupByDay(filtered), [filtered]);

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Actividad</CardTitle>
            </CardHeader>

            <CardContent>
                <div style={{ width: "100%", height: 160 }} className="mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={series}
                            margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#4F46E5"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                    {filtered.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                            No hay actividad
                        </div>
                    )}
                    {filtered.map((it) => (
                        <div key={it.id} className="flex items-start gap-3">
                            <div className="text-xs text-muted-foreground w-36">
                                {formatUTC(it.timestamp)}
                            </div>
                            <div>
                                <div className="text-sm font-medium">
                                    {it.message}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {it.type}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default ActivityTimeline;
