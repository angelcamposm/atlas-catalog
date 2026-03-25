"use client";

import { useState } from "react";
import {
    TopLoadingBar,
    Spinner,
    LoadingOverlay,
    Skeleton,
    SkeletonText,
    SkeletonCard,
    SkeletonTable,
    SkeletonList,
    InlineLoading,
    ProgressBar,
    type LoadingColor,
    type LoadingSize,
} from "@/components/ui/loading";
import { CodeBlock } from "@/components/ui/code-block";
import { HiOutlineArrowPath } from "react-icons/hi2";

const usageCode = `import { 
    TopLoadingBar, 
    Spinner, 
    LoadingOverlay, 
    Skeleton,
    SkeletonCard,
    ProgressBar,
    InlineLoading 
} from "@/components/ui/loading";

// Barra superior de carga (tipo YouTube/NProgress)
<TopLoadingBar loading={isLoading} color="primary" />

// Spinner con variantes
<Spinner variant="circle" size="md" color="primary" />
<Spinner variant="dots" size="lg" color="success" />
<Spinner variant="ring" size="sm" color="info" />

// Overlay de carga
<LoadingOverlay 
    visible={loading} 
    text="Cargando datos..." 
    fullScreen={false} 
/>

// Skeleton para placeholders
<Skeleton variant="text" width="60%" />
<Skeleton variant="circular" width={48} height={48} />
<SkeletonCard />

// Barra de progreso
<ProgressBar value={75} showPercentage striped animated />

// Loading inline para botones
<button disabled={loading}>
    {loading ? <InlineLoading text="Guardando" /> : "Guardar"}
</button>`;

type TabType = "bar" | "spinner" | "overlay" | "skeleton" | "progress";

export default function LoadingShowcasePage() {
    const [activeTab, setActiveTab] = useState<TabType>("bar");
    const [topBarLoading, setTopBarLoading] = useState(false);
    const [topBarColor, setTopBarColor] = useState<LoadingColor>("primary");
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [progressValue, setProgressValue] = useState(45);

    const colors: LoadingColor[] = [
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "info",
    ];
    const sizes: LoadingSize[] = ["xs", "sm", "md", "lg", "xl"];

    const startTopBar = () => {
        setTopBarLoading(true);
        setTimeout(() => setTopBarLoading(false), 3000);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Top Loading Bar - Siempre montada */}
            <TopLoadingBar loading={topBarLoading} color={topBarColor} />

            {/* Header */}
            <div className="bg-card border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <HiOutlineArrowPath className="w-10 h-10 text-primary animate-spin" />
                        <h1 className="text-3xl font-bold text-foreground">
                            Loading Components
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Componentes de carga: barra superior, spinners,
                        overlays, skeletons y barras de progreso.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 bg-card p-2 rounded-lg border border-border">
                    {[
                        { id: "bar", label: "Top Bar" },
                        { id: "spinner", label: "Spinners" },
                        { id: "overlay", label: "Overlay" },
                        { id: "skeleton", label: "Skeleton" },
                        { id: "progress", label: "Progress" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Top Loading Bar */}
                {activeTab === "bar" && (
                    <div className="space-y-6">
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Barra de Carga Superior
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Barra minimalista tipo YouTube/NProgress que se
                                muestra en la parte superior de la pantalla.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <button
                                    onClick={startTopBar}
                                    disabled={topBarLoading}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
                                >
                                    {topBarLoading
                                        ? "Cargando..."
                                        : "Iniciar Barra"}
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Color:
                                    </span>
                                    <select
                                        value={topBarColor}
                                        onChange={(e) =>
                                            setTopBarColor(
                                                e.target.value as LoadingColor
                                            )
                                        }
                                        className="px-2 py-1 rounded border border-input bg-background text-sm"
                                    >
                                        {colors.map((color) => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            setTopBarColor(color);
                                            startTopBar();
                                        }}
                                        className="p-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm capitalize"
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-accent/10 rounded-lg border border-accent/30 p-4">
                            <p className="text-accent-foreground text-sm">
                                💡 <strong>Tip:</strong> La barra se adapta
                                automáticamente al tema seleccionado y puede
                                recibir un progreso manual o funcionar en modo
                                indeterminado.
                            </p>
                        </div>
                    </div>
                )}

                {/* Spinners */}
                {activeTab === "spinner" && (
                    <div className="space-y-6">
                        {/* Variantes */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Variantes de Spinner
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                {(
                                    [
                                        "circle",
                                        "dots",
                                        "pulse",
                                        "bars",
                                        "ring",
                                    ] as const
                                ).map((variant) => (
                                    <div
                                        key={variant}
                                        className="flex flex-col items-center gap-3 p-4 rounded-lg bg-muted"
                                    >
                                        <Spinner
                                            variant={variant}
                                            size="lg"
                                            color="primary"
                                        />
                                        <span className="text-sm text-muted-foreground capitalize">
                                            {variant}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tamaños */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Tamaños
                            </h3>
                            <div className="flex items-end gap-6 flex-wrap">
                                {sizes.map((size) => (
                                    <div
                                        key={size}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <Spinner size={size} color="primary" />
                                        <span className="text-xs text-muted-foreground">
                                            {size}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Colores */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Colores
                            </h3>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                {colors.map((color) => (
                                    <div
                                        key={color}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted"
                                    >
                                        <Spinner size="md" color={color} />
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {color}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Con label */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Con Label
                            </h3>
                            <div className="flex flex-wrap gap-8">
                                <Spinner
                                    size="md"
                                    showLabel
                                    label="Cargando datos..."
                                />
                                <Spinner
                                    variant="dots"
                                    size="md"
                                    showLabel
                                    label="Procesando..."
                                    color="success"
                                />
                                <InlineLoading text="Guardando" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlay */}
                {activeTab === "overlay" && (
                    <div className="space-y-6">
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Loading Overlay
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Overlay para cubrir secciones o la pantalla
                                completa durante la carga.
                            </p>

                            <button
                                onClick={() => {
                                    setOverlayVisible(true);
                                    setTimeout(
                                        () => setOverlayVisible(false),
                                        3000
                                    );
                                }}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                            >
                                Mostrar Overlay (3s)
                            </button>
                        </div>

                        {/* Demo en contenedor */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Overlay en Contenedor
                            </h3>
                            <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
                                <div className="p-4">
                                    <h4 className="font-medium text-foreground">
                                        Contenido de ejemplo
                                    </h4>
                                    <p className="text-muted-foreground mt-2">
                                        Este es un contenedor con overlay de
                                        carga posicionado absolutamente.
                                    </p>
                                </div>
                                <LoadingOverlay
                                    visible={true}
                                    text="Cargando contenido..."
                                    backgroundOpacity={90}
                                />
                            </div>
                        </div>

                        {/* Variantes de overlay */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(["circle", "dots", "ring"] as const).map(
                                (variant) => (
                                    <div
                                        key={variant}
                                        className="relative h-40 bg-card rounded-lg border border-border overflow-hidden"
                                    >
                                        <LoadingOverlay
                                            visible={true}
                                            spinnerVariant={variant}
                                            text={`Spinner: ${variant}`}
                                            backgroundOpacity={95}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Skeleton */}
                {activeTab === "skeleton" && (
                    <div className="space-y-6">
                        {/* Básico */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Skeleton Básico
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton
                                        variant="circular"
                                        width={48}
                                        height={48}
                                    />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton
                                            variant="text"
                                            width="40%"
                                            height={20}
                                        />
                                        <Skeleton
                                            variant="text"
                                            width="60%"
                                            height={16}
                                        />
                                    </div>
                                </div>
                                <Skeleton
                                    variant="rounded"
                                    height={120}
                                    animation="wave"
                                />
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-card rounded-lg border border-border p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                    SkeletonText
                                </h3>
                                <SkeletonText lines={4} />
                            </div>

                            <div className="bg-card rounded-lg border border-border p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                    SkeletonList
                                </h3>
                                <SkeletonList items={3} />
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                SkeletonCard
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                SkeletonTable
                            </h3>
                            <SkeletonTable rows={4} columns={5} />
                        </div>
                    </div>
                )}

                {/* Progress */}
                {activeTab === "progress" && (
                    <div className="space-y-6">
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Barra de Progreso
                            </h3>

                            <div className="mb-6">
                                <label className="text-sm text-muted-foreground mb-2 block">
                                    Progreso: {progressValue}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progressValue}
                                    onChange={(e) =>
                                        setProgressValue(Number(e.target.value))
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            <div className="space-y-6">
                                <ProgressBar
                                    value={progressValue}
                                    label="Básica"
                                    showPercentage
                                />

                                <ProgressBar
                                    value={progressValue}
                                    label="Con rayas"
                                    showPercentage
                                    striped
                                />

                                <ProgressBar
                                    value={progressValue}
                                    label="Animada"
                                    showPercentage
                                    striped
                                    animated
                                />
                            </div>
                        </div>

                        {/* Tamaños */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Tamaños
                            </h3>
                            <div className="space-y-4">
                                <ProgressBar
                                    value={60}
                                    size="sm"
                                    label="Pequeña (sm)"
                                />
                                <ProgressBar
                                    value={60}
                                    size="md"
                                    label="Mediana (md)"
                                />
                                <ProgressBar
                                    value={60}
                                    size="lg"
                                    label="Grande (lg)"
                                />
                            </div>
                        </div>

                        {/* Colores */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Colores
                            </h3>
                            <div className="space-y-4">
                                {colors.map((color) => (
                                    <ProgressBar
                                        key={color}
                                        value={65}
                                        color={color}
                                        label={color}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Indeterminado */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Indeterminado
                            </h3>
                            <ProgressBar
                                value={0}
                                indeterminate
                                label="Procesando..."
                            />
                        </div>
                    </div>
                )}

                {/* Usage Code */}
                <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                        Cómo Usar los Componentes
                    </h2>
                    <CodeBlock
                        code={usageCode}
                        language="tsx"
                        title="loading-usage.tsx"
                        theme="dark"
                    />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            icon: "🔝",
                            title: "Top Loading Bar",
                            description:
                                "Barra superior minimalista tipo YouTube/NProgress con progreso indeterminado o manual",
                        },
                        {
                            icon: "🔄",
                            title: "5 Variantes de Spinner",
                            description:
                                "circle, dots, pulse, bars, ring - cada uno con 5 tamaños y 7 colores",
                        },
                        {
                            icon: "🎭",
                            title: "Loading Overlay",
                            description:
                                "Cubre secciones o pantalla completa con blur y opacidad configurable",
                        },
                        {
                            icon: "💀",
                            title: "Skeleton Presets",
                            description:
                                "Placeholders listos: Text, Card, Table, List con animaciones pulse/wave",
                        },
                        {
                            icon: "📊",
                            title: "Progress Bar",
                            description:
                                "Barra de progreso con rayas, animación e modo indeterminado",
                        },
                        {
                            icon: "🌙",
                            title: "Dark Mode",
                            description:
                                "Todos los componentes se adaptan automáticamente al tema",
                        },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-card rounded-lg border border-border p-4"
                        >
                            <div className="text-2xl mb-2">{feature.icon}</div>
                            <h3 className="font-semibold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full screen overlay */}
            <LoadingOverlay
                visible={overlayVisible}
                fullScreen
                text="Cargando aplicación..."
                spinnerSize="xl"
            />
        </div>
    );
}
