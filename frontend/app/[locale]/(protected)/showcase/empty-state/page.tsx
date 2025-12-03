"use client";

import { useState } from "react";
import {
    EmptyState,
    EmptyList,
    NoSearchResults,
    ErrorState,
    OfflineState,
    ServerErrorState,
} from "@/components/ui/empty-state";
import { CodeBlock } from "@/components/ui/code-block";
import {
    HiOutlineInboxStack,
    HiOutlineRocketLaunch,
    HiOutlineShoppingCart,
    HiOutlineBellAlert,
} from "react-icons/hi2";

const usageCode = `import { 
    EmptyState, 
    EmptyList, 
    NoSearchResults, 
    ErrorState,
    OfflineState,
    ServerErrorState 
} from "@/components/ui/empty-state";

// Uso básico
<EmptyState
    type="empty"
    title="No hay elementos"
    description="Aún no hay elementos para mostrar."
    actionLabel="Crear nuevo"
    onAction={() => console.log("Crear")}
/>

// Variantes pre-configuradas
<EmptyList onRetry={() => refetch()} />

<NoSearchResults 
    searchTerm="api gateway" 
    onClear={() => setSearch("")} 
/>

<ErrorState 
    onRetry={() => refetch()} 
    errorMessage="No se pudo conectar con el servidor"
/>

// Con icono personalizado (React Component)
<EmptyState
    type="custom"
    title="Tu carrito está vacío"
    description="Añade productos para continuar"
    icon={<HiOutlineShoppingCart className="w-full h-full" />}
    actionLabel="Ver productos"
    onAction={() => router.push("/products")}
/>

// Con SVG personalizado inline (generado por IA)
<EmptyState
    type="custom"
    title="Sin proyectos"
    description="Crea tu primer proyecto"
    svgContent={\`<svg viewBox="0 0 100 100">...</svg>\`}
    iconClassName="w-32 h-32"
/>

// Con SVG desde URL
<EmptyState
    type="custom"
    title="Sin datos"
    svgUrl="/illustrations/no-data.svg"
    iconClassName="w-40 h-40"
/>`;

// SVGs de ejemplo generados por IA
const customSvgExamples = {
    rocket: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="#EEF2FF" stroke="#818CF8" stroke-width="2"/>
        <path d="M60 25C60 25 45 45 45 70C45 80 50 90 60 95C70 90 75 80 75 70C75 45 60 25 60 25Z" fill="#818CF8"/>
        <circle cx="60" cy="55" r="8" fill="#C7D2FE"/>
        <path d="M35 75L45 70M75 70L85 75" stroke="#818CF8" stroke-width="3" stroke-linecap="round"/>
        <path d="M55 95L50 110M65 95L70 110M60 95V115" stroke="#F97316" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    emptyBox: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="40" width="70" height="55" rx="4" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="2"/>
        <path d="M25 55H95" stroke="#9CA3AF" stroke-width="2"/>
        <path d="M20 40L60 20L100 40" stroke="#9CA3AF" stroke-width="2" fill="#E5E7EB"/>
        <circle cx="60" cy="72" r="12" stroke="#9CA3AF" stroke-width="2" stroke-dasharray="4 4"/>
        <path d="M55 72H65M60 67V77" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    search: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" fill="#DBEAFE" stroke="#3B82F6" stroke-width="3"/>
        <circle cx="50" cy="50" r="18" stroke="#3B82F6" stroke-width="2" stroke-dasharray="6 4"/>
        <path d="M72 72L95 95" stroke="#3B82F6" stroke-width="4" stroke-linecap="round"/>
        <path d="M40 50H60M50 40V60" stroke="#93C5FD" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
    cloud: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 75C20 75 15 65 20 55C15 45 25 35 40 40C45 25 70 25 80 40C95 35 105 50 95 65C105 75 95 85 80 80H30Z" fill="#FEE2E2" stroke="#EF4444" stroke-width="2"/>
        <path d="M50 55L60 65L70 50" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
        <path d="M55 55L65 65M65 55L55 65" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
        <path d="M35 95L45 85M60 100V88M85 95L75 85" stroke="#FCA5A5" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4"/>
    </svg>`,
    folder: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 35H50L58 25H100V30H60L52 40H20V35Z" fill="#FDE68A" stroke="#F59E0B" stroke-width="2"/>
        <rect x="15" y="40" width="90" height="55" rx="4" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
        <circle cx="60" cy="67" r="15" stroke="#F59E0B" stroke-width="2" stroke-dasharray="5 5"/>
        <path d="M60 60V74M53 67H67" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
};

type DemoType = "basic" | "variants" | "custom" | "svg" | "sizes";

export default function EmptyStateShowcasePage() {
    const [loadingDemo, setLoadingDemo] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<DemoType>("basic");

    const simulateRetry = (id: string) => {
        setLoadingDemo(id);
        setTimeout(() => setLoadingDemo(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <HiOutlineInboxStack className="w-10 h-10 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Empty State
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                        Componente reutilizable para mostrar estados vacíos con
                        ilustración, texto explicativo y acciones.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border">
                    {[
                        { id: "basic", label: "Tipos Básicos" },
                        { id: "variants", label: "Variantes" },
                        { id: "custom", label: "Personalizado" },
                        { id: "svg", label: "SVG Custom" },
                        { id: "sizes", label: "Tamaños" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as DemoType)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Basic Types */}
                {activeTab === "basic" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                type=&quot;empty&quot;
                            </h3>
                            <EmptyState
                                type="empty"
                                title="No hay elementos"
                                description="Aún no hay elementos para mostrar en esta lista."
                                actionLabel="Crear nuevo"
                                onAction={() => alert("Crear nuevo")}
                                size="sm"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                type=&quot;no-results&quot;
                            </h3>
                            <EmptyState
                                type="no-results"
                                title="Sin resultados"
                                description="No se encontraron resultados para tu búsqueda."
                                actionLabel="Limpiar filtros"
                                onAction={() => alert("Limpiar")}
                                size="sm"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                type=&quot;error&quot;
                            </h3>
                            <EmptyState
                                type="error"
                                title="Algo salió mal"
                                description="Ha ocurrido un error inesperado."
                                actionLabel="Reintentar"
                                onAction={() => simulateRetry("error")}
                                loading={loadingDemo === "error"}
                                size="sm"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                type=&quot;offline&quot;
                            </h3>
                            <EmptyState
                                type="offline"
                                title="Sin conexión"
                                description="Verifica tu conexión a internet."
                                actionLabel="Reintentar"
                                onAction={() => simulateRetry("offline")}
                                loading={loadingDemo === "offline"}
                                size="sm"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                type=&quot;server-error&quot;
                            </h3>
                            <EmptyState
                                type="server-error"
                                title="Error del servidor"
                                description="El servidor no está respondiendo."
                                actionLabel="Reintentar"
                                onAction={() => simulateRetry("server")}
                                loading={loadingDemo === "server"}
                                size="sm"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                type=&quot;no-data&quot;
                            </h3>
                            <EmptyState
                                type="no-data"
                                title="Sin datos"
                                description="No hay datos disponibles para mostrar."
                                size="sm"
                            />
                        </div>
                    </div>
                )}

                {/* Pre-configured Variants */}
                {activeTab === "variants" && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                EmptyList
                            </h3>
                            <EmptyList
                                onRetry={() => simulateRetry("list")}
                                loading={loadingDemo === "list"}
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                NoSearchResults
                            </h3>
                            <NoSearchResults
                                searchTerm="api gateway"
                                onClear={() => alert("Limpiar búsqueda")}
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                ErrorState
                            </h3>
                            <ErrorState
                                onRetry={() => simulateRetry("errorState")}
                                loading={loadingDemo === "errorState"}
                                errorMessage="No se pudo conectar con el servidor. Código: ECONNREFUSED"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                OfflineState
                            </h3>
                            <OfflineState
                                onRetry={() => simulateRetry("offlineState")}
                                loading={loadingDemo === "offlineState"}
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                ServerErrorState
                            </h3>
                            <ServerErrorState
                                onRetry={() => simulateRetry("serverState")}
                                loading={loadingDemo === "serverState"}
                            />
                        </div>
                    </div>
                )}

                {/* Custom Icons */}
                {activeTab === "custom" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                Carrito vacío
                            </h3>
                            <EmptyState
                                type="custom"
                                title="Tu carrito está vacío"
                                description="Añade productos para continuar con tu compra."
                                icon={
                                    <HiOutlineShoppingCart className="w-full h-full text-emerald-500" />
                                }
                                actionLabel="Ver productos"
                                onAction={() => alert("Ver productos")}
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                Sin notificaciones
                            </h3>
                            <EmptyState
                                type="custom"
                                title="Sin notificaciones"
                                description="No tienes notificaciones nuevas. ¡Todo al día!"
                                icon={
                                    <HiOutlineBellAlert className="w-full h-full text-amber-500" />
                                }
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                Lanzamiento próximo
                            </h3>
                            <EmptyState
                                type="custom"
                                title="Próximamente"
                                description="Esta funcionalidad estará disponible muy pronto."
                                icon={
                                    <HiOutlineRocketLaunch className="w-full h-full text-violet-500" />
                                }
                                actionLabel="Notificarme"
                                onAction={() => alert("Suscrito!")}
                                secondaryActionLabel="Más info"
                                onSecondaryAction={() => alert("Info")}
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                Con contenido adicional
                            </h3>
                            <EmptyState
                                type="empty"
                                title="Sin APIs registradas"
                                description="Comienza añadiendo tu primera API al catálogo."
                                actionLabel="Añadir API"
                                onAction={() => alert("Añadir")}
                            >
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                    <p>¿Necesitas ayuda?</p>
                                    <a
                                        href="#"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Consulta la documentación
                                    </a>
                                </div>
                            </EmptyState>
                        </div>
                    </div>
                )}

                {/* SVG Custom */}
                {activeTab === "svg" && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 p-4">
                            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                                🎨 SVG Personalizados
                            </h3>
                            <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                                Puedes usar SVGs generados por IA (como ChatGPT,
                                Claude, etc.) pasándolos como string en la prop{" "}
                                <code className="bg-indigo-100 dark:bg-indigo-800 px-1 rounded">
                                    svgContent
                                </code>
                                , o cargar desde una URL con{" "}
                                <code className="bg-indigo-100 dark:bg-indigo-800 px-1 rounded">
                                    svgUrl
                                </code>
                                .
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                    SVG: Cohete 🚀
                                </h3>
                                <EmptyState
                                    type="custom"
                                    title="¡Próximamente!"
                                    description="Esta funcionalidad está en desarrollo."
                                    svgContent={customSvgExamples.rocket}
                                    iconClassName="w-24 h-24"
                                    actionLabel="Notificarme"
                                    onAction={() => alert("¡Te notificaremos!")}
                                />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                    SVG: Caja vacía 📦
                                </h3>
                                <EmptyState
                                    type="custom"
                                    title="Sin contenido"
                                    description="Esta sección está vacía por ahora."
                                    svgContent={customSvgExamples.emptyBox}
                                    iconClassName="w-24 h-24"
                                    actionLabel="Añadir contenido"
                                    onAction={() => alert("Añadir")}
                                />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                    SVG: Búsqueda 🔍
                                </h3>
                                <EmptyState
                                    type="custom"
                                    title="Sin resultados"
                                    description="No encontramos lo que buscas."
                                    svgContent={customSvgExamples.search}
                                    iconClassName="w-24 h-24"
                                    actionLabel="Nueva búsqueda"
                                    onAction={() => alert("Buscar")}
                                />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                    SVG: Error de conexión ☁️
                                </h3>
                                <EmptyState
                                    type="custom"
                                    title="Error de conexión"
                                    description="No pudimos conectar con el servidor."
                                    svgContent={customSvgExamples.cloud}
                                    iconClassName="w-24 h-24"
                                    actionLabel="Reintentar"
                                    onAction={() => simulateRetry("cloud")}
                                    loading={loadingDemo === "cloud"}
                                />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                    SVG: Carpeta vacía 📁
                                </h3>
                                <EmptyState
                                    type="custom"
                                    title="Carpeta vacía"
                                    description="No hay archivos en esta carpeta."
                                    svgContent={customSvgExamples.folder}
                                    iconClassName="w-24 h-24"
                                    actionLabel="Subir archivo"
                                    onAction={() => alert("Subir")}
                                />
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                    Con iconClassName personalizado
                                </h3>
                                <EmptyState
                                    type="custom"
                                    title="Tamaño grande"
                                    description="Usa iconClassName para ajustar el tamaño del SVG."
                                    svgContent={customSvgExamples.rocket}
                                    iconClassName="w-32 h-32"
                                />
                            </div>
                        </div>

                        {/* Código de ejemplo */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Cómo usar SVG personalizado
                            </h3>
                            <CodeBlock
                                code={`// SVG generado por IA (puedes pedir a ChatGPT/Claude que cree uno)
const mySvg = \`<svg viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="50" fill="#EEF2FF" stroke="#818CF8"/>
    <path d="M40 60L55 75L80 45" stroke="#818CF8" stroke-width="4"/>
</svg>\`;

// Usar con svgContent
<EmptyState
    type="custom"
    title="Operación exitosa"
    description="Todo salió bien"
    svgContent={mySvg}
    iconClassName="w-32 h-32" // Ajusta el tamaño
/>

// O desde URL
<EmptyState
    type="custom"
    title="Sin datos"
    svgUrl="/illustrations/empty.svg"
    iconClassName="w-40 h-40"
/>`}
                                language="tsx"
                                title="svg-example.tsx"
                                theme="dark"
                            />
                        </div>
                    </div>
                )}

                {/* Sizes */}
                {activeTab === "sizes" && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    size=&quot;sm&quot;
                                </h3>
                            </div>
                            <EmptyState
                                type="empty"
                                title="Tamaño pequeño"
                                description="Ideal para espacios reducidos o listas compactas."
                                actionLabel="Acción"
                                onAction={() => {}}
                                size="sm"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    size=&quot;md&quot; (default)
                                </h3>
                            </div>
                            <EmptyState
                                type="empty"
                                title="Tamaño mediano"
                                description="El tamaño por defecto, equilibrado para la mayoría de casos."
                                actionLabel="Acción"
                                onAction={() => {}}
                                size="md"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    size=&quot;lg&quot;
                                </h3>
                            </div>
                            <EmptyState
                                type="empty"
                                title="Tamaño grande"
                                description="Para pantallas completas o cuando el estado vacío es el foco principal."
                                actionLabel="Acción"
                                onAction={() => {}}
                                size="lg"
                            />
                        </div>
                    </div>
                )}

                {/* Usage Code */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Cómo Usar el Componente
                    </h2>
                    <CodeBlock
                        code={usageCode}
                        language="tsx"
                        title="empty-state-usage.tsx"
                        theme="dark"
                    />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            icon: "🎨",
                            title: "Múltiples Tipos",
                            description:
                                "8 tipos predefinidos: empty, no-results, error, offline, server-error, no-data, no-users, no-items",
                        },
                        {
                            icon: "🖼️",
                            title: "SVG Personalizado",
                            description:
                                "Usa SVGs generados por IA con svgContent o carga desde URL con svgUrl",
                        },
                        {
                            icon: "🔄",
                            title: "Estado de Carga",
                            description:
                                "Soporte integrado para mostrar estado de carga en los botones",
                        },
                        {
                            icon: "📏",
                            title: "3 Tamaños",
                            description:
                                "sm, md y lg para adaptarse a diferentes contextos",
                        },
                        {
                            icon: "🎯",
                            title: "Variantes Pre-configuradas",
                            description:
                                "EmptyList, NoSearchResults, ErrorState, OfflineState, ServerErrorState",
                        },
                        {
                            icon: "🌙",
                            title: "Dark Mode",
                            description:
                                "Soporte completo para tema oscuro integrado",
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
