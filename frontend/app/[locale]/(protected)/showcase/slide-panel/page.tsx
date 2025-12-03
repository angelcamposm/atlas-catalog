"use client";

import { useState, useMemo } from "react";
import { SlidePanelControlled } from "@/components/ui/slide-panel";
import { CodeBlock } from "@/components/ui/code-block";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import {
    HiOutlineViewColumns,
    HiOutlineDocumentText,
    HiOutlineListBullet,
    HiOutlineCog6Tooth,
    HiOutlineArrowsPointingOut,
    HiOutlineArrowsPointingIn,
} from "react-icons/hi2";

const sampleMarkdown = `# Documentación del Servicio

Esta es la documentación detallada del servicio seleccionado.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/users | Lista usuarios |
| POST | /api/users | Crear usuario |
| GET | /api/users/:id | Obtener usuario |

## Ejemplo de uso

\`\`\`typescript
const response = await fetch('/api/users');
const users = await response.json();
\`\`\`

> **Nota:** Requiere autenticación JWT.
`;

const usageCode = `import { SlidePanel, SlidePanelControlled } from "@/components/ui/slide-panel";

// Uso básico - Panel no controlado
<SlidePanel
  panelTitle="Detalles"
  panelContent={<MyPanelContent />}
  panelWidth="400px"
  position="right"
  defaultOpen={false}
>
  <MainContent />
</SlidePanel>

// Uso controlado con fullScreen
import { useState } from "react";

const [isOpen, setIsOpen] = useState(false);

<SlidePanelControlled
  panelTitle="Panel"
  panelContent={<MyContent />}
  isOpen={isOpen}
  onToggle={() => setIsOpen(!isOpen)}
  position="right"
  panelWidth="400px"
  fullScreen={true}  // Ocupa toda la pantalla (h-dvh)
>
  <MainContent />
</SlidePanelControlled>

// Props disponibles:
// - panelTitle: string - Título del panel
// - panelContent: ReactNode - Contenido del panel
// - panelWidth: string - Ancho (ej: "400px", "30%")
// - position: "left" | "right" - Posición del panel
// - fullScreen: boolean - Si true, usa h-dvh (viewport height)
// - className: string - Clases adicionales
// - defaultOpen (SlidePanel) o isOpen/onToggle (SlidePanelControlled)`;

// Sample data for demo
const services = [
    { id: 1, name: "User Service", status: "active", version: "2.1.0" },
    { id: 2, name: "Payment Gateway", status: "active", version: "1.5.3" },
    {
        id: 3,
        name: "Notification Service",
        status: "warning",
        version: "3.0.0",
    },
    { id: 4, name: "Analytics Engine", status: "active", version: "1.2.1" },
    { id: 5, name: "Auth Provider", status: "error", version: "4.0.0" },
];

// StatusBadge component defined outside
function StatusBadge({ status }: { status: string }) {
    const colors = {
        active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
        <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                colors[status as keyof typeof colors]
            }`}
        >
            {status}
        </span>
    );
}

// PanelContent component defined outside
function PanelContent({ service }: { service: (typeof services)[0] }) {
    return (
        <div className="space-y-6">
            {/* Service Info */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {service.name}
                    </h4>
                    <StatusBadge status={service.status} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Versión: {service.version}
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { label: "Requests/min", value: "1.2K" },
                    { label: "Latencia", value: "45ms" },
                    { label: "Uptime", value: "99.9%" },
                    { label: "Errores", value: "0.1%" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stat.label}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Documentation */}
            <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <HiOutlineDocumentText className="w-4 h-4" />
                    Documentación
                </h4>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <MarkdownRenderer content={sampleMarkdown} />
                </div>
            </div>
        </div>
    );
}

export default function SlidePanelShowcasePage() {
    const [selectedService, setSelectedService] = useState(services[0]);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [panelPosition, setPanelPosition] = useState<"left" | "right">(
        "right"
    );
    const [isFullScreen, setIsFullScreen] = useState(true);

    // Memoize the panel content to avoid re-renders
    const panelContent = useMemo(
        () => <PanelContent service={selectedService} />,
        [selectedService]
    );

    // Render en modo fullscreen
    if (isFullScreen) {
        return (
            <SlidePanelControlled
                panelTitle={`Detalles: ${selectedService.name}`}
                panelContent={panelContent}
                panelWidth="380px"
                isOpen={isPanelOpen}
                onToggle={() => setIsPanelOpen(!isPanelOpen)}
                position={panelPosition}
                fullScreen={true}
            >
                {/* Main Content - Full Screen */}
                <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
                    {/* Toolbar */}
                    <div className="shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <HiOutlineViewColumns className="w-6 h-6 text-indigo-600" />
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Slide Panel - Full Screen Demo
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        isPanelOpen
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    Panel: {isPanelOpen ? "ON" : "OFF"}
                                </button>
                                <button
                                    onClick={() =>
                                        setPanelPosition(
                                            panelPosition === "right"
                                                ? "left"
                                                : "right"
                                        )
                                    }
                                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {panelPosition === "right" ? "→" : "←"}
                                </button>
                                <button
                                    onClick={() => setIsFullScreen(false)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <HiOutlineArrowsPointingIn className="w-4 h-4" />
                                    Salir
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-auto p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-2 mb-6">
                                <HiOutlineListBullet className="w-6 h-6 text-gray-500" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Servicios Disponibles
                                </h2>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => {
                                            setSelectedService(service);
                                            setIsPanelOpen(true);
                                        }}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                            selectedService.id === service.id
                                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                                : "border-transparent bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {service.name}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    v{service.version}
                                                </p>
                                            </div>
                                            <StatusBadge
                                                status={service.status}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    💡 <strong>Modo Full Screen:</strong> El
                                    contenido ocupa toda la pantalla disponible.
                                    El panel lateral empuja el contenido y todo
                                    es responsive.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SlidePanelControlled>
        );
    }

    // Render normal con documentación
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <HiOutlineViewColumns className="w-10 h-10 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Slide Panel
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                        Panel lateral que empuja el contenido en lugar de
                        superponerse. Ideal para mostrar detalles,
                        configuraciones o documentación.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Full Screen Demo Button */}
                <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">
                                🚀 Demo Full Screen
                            </h2>
                            <p className="text-indigo-100">
                                Experimenta el SlidePanel ocupando toda la
                                pantalla de forma responsive.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsFullScreen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
                        >
                            <HiOutlineArrowsPointingOut className="w-5 h-5" />
                            Probar Full Screen
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <HiOutlineCog6Tooth className="w-5 h-5" />
                        Controles de Demo
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setIsPanelOpen(!isPanelOpen)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                isPanelOpen
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            Panel: {isPanelOpen ? "Abierto" : "Cerrado"}
                        </button>
                        <button
                            onClick={() =>
                                setPanelPosition(
                                    panelPosition === "right" ? "left" : "right"
                                )
                            }
                            className="px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Posición:{" "}
                            {panelPosition === "right"
                                ? "Derecha"
                                : "Izquierda"}
                        </button>
                    </div>
                </div>

                {/* Embedded Demo */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Demo Embebida
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Vista previa del componente. Para ver el efecto
                            completo, usa el modo Full Screen.
                        </p>
                    </div>

                    {/* Demo Container - Fixed height for embedded view */}
                    <div className="h-[500px]">
                        <SlidePanelControlled
                            panelTitle={`Detalles: ${selectedService.name}`}
                            panelContent={panelContent}
                            panelWidth="320px"
                            isOpen={isPanelOpen}
                            onToggle={() => setIsPanelOpen(!isPanelOpen)}
                            position={panelPosition}
                        >
                            {/* Main Content - Service List */}
                            <div className="h-full p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
                                <div className="flex items-center gap-2 mb-4">
                                    <HiOutlineListBullet className="w-5 h-5 text-gray-500" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Servicios
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {services.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => {
                                                setSelectedService(service);
                                                setIsPanelOpen(true);
                                            }}
                                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                                selectedService.id ===
                                                service.id
                                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                                    : "border-transparent bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                                        {service.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        v{service.version}
                                                    </p>
                                                </div>
                                                <StatusBadge
                                                    status={service.status}
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </SlidePanelControlled>
                    </div>
                </div>

                {/* Usage Code */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Cómo Usar el Componente
                    </h2>
                    <CodeBlock
                        code={usageCode}
                        language="tsx"
                        title="slide-panel-usage.tsx"
                        theme="dark"
                    />
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            icon: "↔️",
                            title: "Empuja el Contenido",
                            description:
                                "El panel empuja el contenido principal en lugar de superponerse",
                        },
                        {
                            icon: "📱",
                            title: "Full Screen & Responsive",
                            description:
                                "Modo fullScreen con h-dvh para ocupar toda la pantalla",
                        },
                        {
                            icon: "🎯",
                            title: "Sin Overlay",
                            description:
                                "No oscurece ni bloquea el contenido de fondo",
                        },
                        {
                            icon: "⬅️➡️",
                            title: "Posición Flexible",
                            description:
                                "Puede posicionarse a la izquierda o derecha",
                        },
                        {
                            icon: "🎛️",
                            title: "Controlado/No Controlado",
                            description: "Dos variantes según tus necesidades",
                        },
                        {
                            icon: "🌙",
                            title: "Dark Mode",
                            description: "Soporte completo para tema oscuro",
                        },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-gray-800 rounded-lg border p-4"
                        >
                            <div className="text-2xl mb-2">{feature.icon}</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
