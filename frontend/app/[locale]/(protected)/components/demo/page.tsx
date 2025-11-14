"use client";
import { ComponentPageLayout } from "@/components/components/ComponentPageLayout";
import { ComponentHeader } from "@/components/components/ComponentHeader";
import { ComponentDetailsSidebar } from "@/components/components/ComponentDetailsSidebar";
import { ComponentDescription } from "@/components/components/ComponentDescription";
import { TagList } from "@/components/components/TagList";
import { MetricWidget } from "@/components/components/MetricWidget";
import { MetricsGrid } from "@/components/components/MetricsGrid";
import { EventsGrid } from "@/components/components/EventsGrid";
import { ReadinessWidget } from "@/components/components/ReadinessWidget";
import { MetricChart } from "@/components/components/MetricChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentSectionNav } from "@/components/components/ComponentSectionNav";
import ActivityPanel from "@/components/components/ActivityPanel";

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
            <ComponentSectionNav
                items={[
                    { id: "overview", label: "Descripción" },
                    { id: "docs", label: "Documentación" },
                    { id: "dashboards", label: "Cuadros" },
                    { id: "deps", label: "Dependencias" },
                    { id: "metrics", label: "Métricas" },
                ]}
                initial="overview"
                className="mb-4"
            />

            <ActivityPanel className="mb-6" />
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

            <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
                <EventsGrid
                    rows={[
                        {
                            id: "design-system",
                            component: "Design System",
                            time: "14 Nov 10:00",
                            status: "ok",
                        },
                        {
                            id: "frontend-api-gateway",
                            component: "Frontend API Gateway",
                            time: "14 Nov 11:30",
                            status: "ok",
                        },
                        {
                            id: "mobile-ui",
                            component: "Mobile App UI",
                            time: "14 Nov 09:15",
                            status: "warning",
                        },
                    ]}
                />

                <div className="space-y-3">
                    <ReadinessWidget
                        title="Component readiness"
                        subtitle="Cuadro de mandos de estado con umbral"
                        valueLabel="Cantidad de aprobados: 4"
                        status="good"
                    />
                    <ReadinessWidget
                        title="DevOps health"
                        subtitle="Cuadro de mandos de estado con umbral"
                        valueLabel="3 requieren atención"
                        status="attention"
                    />
                </div>
            </div>

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
