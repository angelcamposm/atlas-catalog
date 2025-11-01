"use client";

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface ApiMetricsChartProps {
    data?: {
        labels: string[];
        values: number[];
    };
    title?: string;
    type?: "line" | "bar" | "pie";
    height?: number;
}

const COLORS = [
    "#3b82f6", // blue-500
    "#10b981", // green-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
];

export function ApiMetricsChart({
    data,
    title = "Métricas de APIs",
    type = "bar",
    height = 300,
}: ApiMetricsChartProps) {
    // Datos de ejemplo si no se proporcionan
    const defaultData = data || {
        labels: ["REST", "GraphQL", "SOAP", "gRPC", "WebSocket"],
        values: [45, 28, 12, 8, 7],
    };

    // Transformar datos para Recharts
    const chartData = defaultData.labels.map((label, index) => ({
        name: label,
        value: defaultData.values[index],
    }));

    const renderChart = () => {
        if (type === "bar") {
            return (
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            stroke="#6b7280"
                            style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        if (type === "line") {
            return (
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            stroke="#6b7280"
                            style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: "#3b82f6", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        if (type === "pie") {
            return (
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            );
        }

        return null;
    };

    return (
        <div className="w-full">
            <h3 className="mb-4 text-center text-base font-semibold text-gray-900">
                {title}
            </h3>
            {renderChart()}
        </div>
    );
}
