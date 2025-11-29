"use client";
import { useState } from "react";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { ComponentSectionNav } from "@/components/components/ComponentSectionNav";
import ActivityPanel from "@/components/components/ActivityPanel";
import {
    SlideOver,
    SlideOverSection,
    SlideOverField,
    SlideOverTabs,
    SlideOverDivider,
} from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    HiServerStack,
    HiCube,
    HiFolder,
    HiCog6Tooth,
    HiDocumentText,
    HiChartBar,
} from "react-icons/hi2";

export default function ComponentDemoPage() {
    // SlideOver demo state
    const [slideOverOpen, setSlideOverOpen] = useState(false);
    const [slideOverSize, setSlideOverSize] = useState<
        "sm" | "md" | "lg" | "xl" | "2xl" | "full"
    >("lg");
    const [slideOverSide, setSlideOverSide] = useState<"left" | "right">(
        "right"
    );
    const [demoTab, setDemoTab] = useState("overview");

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

            {/* SlideOver Demo Section */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HiCube className="h-5 w-5" />
                        SlideOver Component Demo
                    </CardTitle>
                    <CardDescription>
                        Panel deslizante animado que se abre desde el lateral de
                        la pantalla. Ideal para mostrar detalles sin perder el
                        contexto de la página principal.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Tamaño:</span>
                            <div className="flex gap-1">
                                {(
                                    ["sm", "md", "lg", "xl", "full"] as const
                                ).map((size) => (
                                    <Button
                                        key={size}
                                        variant={
                                            slideOverSize === size
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() => setSlideOverSize(size)}
                                    >
                                        {size.toUpperCase()}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Lado:</span>
                            <div className="flex gap-1">
                                {(["left", "right"] as const).map((side) => (
                                    <Button
                                        key={side}
                                        variant={
                                            slideOverSide === side
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() => setSlideOverSide(side)}
                                    >
                                        {side === "left"
                                            ? "Izquierda"
                                            : "Derecha"}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => setSlideOverOpen(true)}>
                        Abrir SlideOver
                    </Button>
                </CardContent>
            </Card>

            {/* SlideOver Demo Component */}
            <SlideOver
                open={slideOverOpen}
                onClose={() => setSlideOverOpen(false)}
                title="Ejemplo de SlideOver"
                description="Panel deslizante con animación"
                size={slideOverSize}
                side={slideOverSide}
                footer={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setSlideOverOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={() => setSlideOverOpen(false)}>
                            Guardar Cambios
                        </Button>
                    </div>
                }
                icon={<HiServerStack className="h-5 w-5" />}
                status={<Badge variant="success">Activo</Badge>}
                breadcrumbs={[{ label: "Componentes" }, { label: "Demo" }]}
            >
                {/* Tabs Demo */}
                <SlideOverTabs
                    tabs={[
                        {
                            id: "overview",
                            label: "General",
                            icon: <HiDocumentText className="h-4 w-4" />,
                        },
                        {
                            id: "config",
                            label: "Configuración",
                            icon: <HiCog6Tooth className="h-4 w-4" />,
                        },
                        {
                            id: "stats",
                            label: "Estadísticas",
                            icon: <HiChartBar className="h-4 w-4" />,
                        },
                    ]}
                    activeTab={demoTab}
                    onTabChange={setDemoTab}
                />

                {demoTab === "overview" && (
                    <>
                        <SlideOverSection
                            title="Información General"
                            variant="card"
                            icon={<HiDocumentText className="h-4 w-4" />}
                        >
                            <SlideOverField
                                label="Nombre"
                                value="Componente de Ejemplo"
                            />
                            <SlideOverField label="Versión" value="1.0.0" />
                            <SlideOverField
                                label="Endpoint"
                                value="https://api.ejemplo.com/v1"
                                copyable
                                href="https://api.ejemplo.com/v1"
                            />
                            <SlideOverField
                                label="Creado"
                                value={new Date().toLocaleDateString()}
                            />
                        </SlideOverSection>

                        <SlideOverSection
                            title="Características"
                            variant="default"
                            collapsible
                            defaultCollapsed={false}
                        >
                            <div className="flex flex-wrap gap-2">
                                <Badge>Animación suave</Badge>
                                <Badge>Responsive</Badge>
                                <Badge>Dark Mode</Badge>
                                <Badge>Accesible</Badge>
                                <Badge>Glass Effect</Badge>
                            </div>
                        </SlideOverSection>

                        <SlideOverSection title="Descripción" variant="minimal">
                            <p className="text-sm text-muted-foreground">
                                El componente SlideOver es un panel lateral
                                animado con efecto glass morphism que se desliza
                                desde el borde de la pantalla. Es ideal para
                                mostrar detalles de un elemento seleccionado.
                            </p>
                        </SlideOverSection>
                    </>
                )}

                {demoTab === "config" && (
                    <>
                        <SlideOverSection
                            title="Configuración Básica"
                            variant="card"
                        >
                            <SlideOverField
                                label="Tema"
                                value="Sistema"
                                icon={<HiCog6Tooth className="h-4 w-4" />}
                            />
                            <SlideOverField label="Idioma" value="Español" />
                            <SlideOverField
                                label="Zona Horaria"
                                value="Europe/Madrid"
                            />
                        </SlideOverSection>

                        <SlideOverDivider label="Opciones Avanzadas" />

                        <SlideOverSection
                            title="Tamaños Disponibles"
                            variant="default"
                            collapsible
                        >
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <HiCube className="h-4 w-4 text-blue-500" />
                                    <strong>SM:</strong> 384px (24rem)
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiCube className="h-4 w-4 text-green-500" />
                                    <strong>MD:</strong> 448px (28rem)
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiCube className="h-4 w-4 text-yellow-500" />
                                    <strong>LG:</strong> 512px (32rem)
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiCube className="h-4 w-4 text-orange-500" />
                                    <strong>XL:</strong> 576px (36rem)
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiCube className="h-4 w-4 text-red-500" />
                                    <strong>2XL:</strong> 672px (42rem)
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiCube className="h-4 w-4 text-purple-500" />
                                    <strong>Full:</strong> 100% pantalla
                                </li>
                            </ul>
                        </SlideOverSection>
                    </>
                )}

                {demoTab === "stats" && (
                    <>
                        <SlideOverSection
                            title="Uso del Componente"
                            variant="card"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        6
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Tamaños
                                    </div>
                                </div>
                                <div className="rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5 p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        2
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Lados
                                    </div>
                                </div>
                                <div className="rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        5
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Sub-componentes
                                    </div>
                                </div>
                                <div className="rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                        ∞
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Posibilidades
                                    </div>
                                </div>
                            </div>
                        </SlideOverSection>

                        <SlideOverSection
                            title="Subcomponentes"
                            variant="minimal"
                        >
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <HiFolder className="h-4 w-4 text-blue-500" />
                                    <code className="rounded bg-muted px-1">
                                        SlideOverSection
                                    </code>{" "}
                                    - 3 variantes
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiDocumentText className="h-4 w-4 text-green-500" />
                                    <code className="rounded bg-muted px-1">
                                        SlideOverField
                                    </code>{" "}
                                    - con copyable/href
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiCog6Tooth className="h-4 w-4 text-purple-500" />
                                    <code className="rounded bg-muted px-1">
                                        SlideOverTabs
                                    </code>{" "}
                                    - navegación
                                </li>
                                <li className="flex items-center gap-2">
                                    <HiCube className="h-4 w-4 text-orange-500" />
                                    <code className="rounded bg-muted px-1">
                                        SlideOverDivider
                                    </code>{" "}
                                    - separador
                                </li>
                            </ul>
                        </SlideOverSection>
                    </>
                )}
            </SlideOver>
        </ComponentPageLayout>
    );
}
