"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apisApi } from "@/lib/api/apis";
import type { ApiResponse } from "@/types/api";
import { ComponentPageLayout } from "@/components/components/ComponentPageLayout";
import { ComponentHeader } from "@/components/components/ComponentHeader";
import { ComponentDetailsSidebar } from "@/components/components/ComponentDetailsSidebar";
import { ComponentDescription } from "@/components/components/ComponentDescription";
import { MetricsGrid } from "@/components/components/MetricsGrid";
import { MetricWidget } from "@/components/components/MetricWidget";
import { EventsGrid } from "@/components/components/EventsGrid";
import { ReadinessWidget } from "@/components/components/ReadinessWidget";
import ActivityPanel from "@/components/components/ActivityPanel";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiDetailPage() {
    const params = useParams();
    const idParam = params?.id;
    const apiId = typeof idParam === "string" ? parseInt(idParam, 10) : NaN;

    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!Number.isFinite(apiId)) {
            setError("Identificador de API no válido.");
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                const response = await apisApi.getById(apiId);
                setData(response);
            } catch (err) {
                console.error("Error loading API detail", err);
                setError("No se ha podido cargar esta API.");
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [apiId]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>API no disponible</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {error ?? "No se ha encontrado la API solicitada."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const api = data.data;

    const header = (
        <ComponentHeader
            title={api.name}
            subtitle={api.description ?? undefined}
            statusLabel={api.protocol?.toUpperCase()}
            statusVariant="success"
            levelLabel={api.version ? `v${api.version}` : undefined}
        />
    );

    const sidebar = (
        <ComponentDetailsSidebar
            ownerTeams={[]}
            chatChannels={[]}
            repositories={[]}
            projects={[]}
            dashboards={[]}
            links={api.url ? [{ label: "Endpoint", href: api.url }] : []}
        />
    );

    const eventsRows = [
        {
            id: "deploys",
            component: api.name,
            time: "",
            status: "ok" as const,
        },
    ];

    return (
        <ComponentPageLayout header={header} sidebar={sidebar}>
            <ActivityPanel className="mb-6" />

            <ComponentDescription
                title="Descripción de la API"
                description={
                    api.description ?? "Esta API todavía no tiene descripción."
                }
            />

            <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
                <EventsGrid rows={eventsRows} />

                <div className="space-y-3">
                    <ReadinessWidget
                        title="Disponibilidad de la API"
                        subtitle="Mock basado en los últimos despliegues"
                        valueLabel="Dentro de umbral"
                        status="good"
                    />
                    <ReadinessWidget
                        title="Errores recientes"
                        subtitle="Mock de errores 4xx/5xx"
                        valueLabel="Bajo control"
                        status="attention"
                    />
                </div>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Detalle técnico
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <span className="text-xs font-medium uppercase text-muted-foreground">
                                Protocolo
                            </span>
                            <div>{api.protocol ?? "N/A"}</div>
                        </div>
                        {api.url && (
                            <div>
                                <span className="text-xs font-medium uppercase text-muted-foreground">
                                    URL base
                                </span>
                                <div className="truncate">{api.url}</div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <MetricsGrid>
                <MetricWidget
                    title="Tiempo medio de respuesta"
                    value="-- ms"
                    description="Pendiente de conectar con métricas reales."
                    trendDirection="neutral"
                />
                <MetricWidget
                    title="Peticiones por minuto"
                    value="-- rpm"
                    description="Mock de throughput de la API."
                    trendDirection="neutral"
                />
                <MetricWidget
                    title="Errores 5xx (24h)"
                    value="--"
                    description="Mock de estabilidad de la API."
                    trendDirection="neutral"
                />
            </MetricsGrid>
        </ComponentPageLayout>
    );
}
