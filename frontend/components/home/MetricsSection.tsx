"use client";

import { ApiMetricsChart } from "@/components/charts/ApiMetricsChart";

interface MetricsSectionProps {
    title: string;
    subtitle?: string;
}

export function MetricsSection({ title, subtitle }: MetricsSectionProps) {
    return (
        <section className="bg-gradient-metrics py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Charts Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* API Types Distribution */}
                    <div className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <ApiMetricsChart
                            title="Distribución por Tipo"
                            type="bar"
                            height={280}
                            data={{
                                labels: [
                                    "REST",
                                    "GraphQL",
                                    "SOAP",
                                    "gRPC",
                                    "WebSocket",
                                ],
                                values: [45, 28, 12, 8, 7],
                            }}
                        />
                    </div>

                    {/* Lifecycle Status */}
                    <div className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <ApiMetricsChart
                            title="Estados del Ciclo de Vida"
                            type="pie"
                            height={280}
                            data={{
                                labels: [
                                    "Producción",
                                    "Desarrollo",
                                    "Testing",
                                    "Deprecated",
                                ],
                                values: [42, 28, 18, 12],
                            }}
                        />
                    </div>

                    {/* Growth Trend */}
                    <div className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                        <ApiMetricsChart
                            title="Tendencia de Crecimiento"
                            type="line"
                            height={280}
                            data={{
                                labels: [
                                    "Ene",
                                    "Feb",
                                    "Mar",
                                    "Abr",
                                    "May",
                                    "Jun",
                                ],
                                values: [65, 72, 78, 85, 92, 100],
                            }}
                        />
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                        <div className="mb-2 text-4xl font-bold text-blue-600">
                            100+
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            APIs Registradas
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                        <div className="mb-2 text-4xl font-bold text-green-600">
                            98.5%
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            Disponibilidad
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                        <div className="mb-2 text-4xl font-bold text-purple-600">
                            15
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            Equipos Activos
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                        <div className="mb-2 text-4xl font-bold text-orange-600">
                            24/7
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            Monitoreo
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
