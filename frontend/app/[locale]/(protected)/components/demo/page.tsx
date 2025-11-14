"use client";
import { ComponentPageLayout } from "@/components/components/ComponentPageLayout";
import { ComponentHeader } from "@/components/components/ComponentHeader";
import { ComponentDetailsSidebar } from "@/components/components/ComponentDetailsSidebar";
import { ComponentDescription } from "@/components/components/ComponentDescription";
import { TagList } from "@/components/components/TagList";
import { MetricWidget } from "@/components/components/MetricWidget";
import { MetricsGrid } from "@/components/components/MetricsGrid";
import { MetricChart } from "@/components/components/MetricChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComponentDemoPage() {
    const sidebar = (
        <ComponentDetailsSidebar
            ownerTeams={[
                { label: "Frontend Development" },
                { label: "Analytics Guild" },
            ]}
            chatChannels={[
                { label: "#frontend", href: "https://example.com/frontend" },
                { label: "#analytics", href: "https://example.com/analytics" },
            ]}
            repositories={[
                {
                    label: "user-analytics-dashboard",
                    href: "https://example.com/repos/user-analytics-dashboard",
                },
            ]}
            projects={[{ label: "ANALYTICS" }]}
            dashboards={[{ label: "User Analytics Dashboard" }]}
            links={[
                { label: "Runbook", href: "https://example.com/runbook" },
                {
                    label: "On-call schedule",
                    href: "https://example.com/oncall",
                },
            ]}
        />
    );

    const header = (
        <ComponentHeader
            title="User Analytics Dashboard"
            subtitle="Última implementación hace 23 horas"
            statusLabel="Activo"
            statusVariant="success"
            levelLabel="Nivel 2"
        />
    );

    const activityData = [
        { label: "Lun", value: 12 },
        { label: "Mar", value: 18 },
        { label: "Mié", value: 16 },
        { label: "Jue", value: 22 },
        { label: "Vie", value: 19 },
        { label: "Sáb", value: 14 },
        { label: "Dom", value: 17 },
    ];

    return (
        <ComponentPageLayout header={header} sidebar={sidebar}>
            <ComponentDescription
                description={
                    <>
                        <p>Tracks user interactions and analytics.</p>
                        <TagList
                            tags={[
                                { label: "analytics" },
                                { label: "frontend" },
                            ]}
                            className="pt-2"
                        />
                    </>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Actividad</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Eventos de usuario por día (mock).
                    </p>
                    <MetricChart
                        title="Eventos por día"
                        data={activityData}
                        valueLabel="eventos"
                    />
                </CardContent>
            </Card>

            <MetricsGrid>
                <MetricWidget
                    title="Duración del ciclo de la solicitud"
                    value="3d 16h 51min"
                    description="Media de las últimas 10 solicitudes de extracción."
                    trendLabel="Mejorando 8% vs. semana anterior"
                    trendDirection="up"
                />
                <MetricWidget
                    title="Frecuencia de implementación"
                    value="5.33 deploys per week"
                    description="Basado en los últimos 28 días."
                    trendLabel="Ligera caída en los últimos 7 días"
                    trendDirection="down"
                />
                <MetricWidget
                    title="Errores abiertos"
                    value="12"
                    description="Número de errores abiertos, actualizado diariamente."
                    trendLabel="Estable respecto al mes anterior"
                    trendDirection="neutral"
                />
            </MetricsGrid>
        </ComponentPageLayout>
    );
}
