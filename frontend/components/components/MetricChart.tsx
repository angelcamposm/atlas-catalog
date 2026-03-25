"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricChartPoint {
    label: string;
    value: number;
}

interface MetricChartProps {
    title: string;
    data: MetricChartPoint[];
    valueLabel?: string;
}

export function MetricChart({ title, data, valueLabel }: MetricChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(148, 163, 184, 0.3)"
                        />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 8,
                                border: "1px solid rgba(148, 163, 184, 0.4)",
                                fontSize: 12,
                            }}
                            labelStyle={{ fontWeight: 500 }}
                            formatter={(value) =>
                                valueLabel
                                    ? [`${value ?? 0} ${valueLabel}`, ""]
                                    : [value ?? 0, ""]
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="var(--primary)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
