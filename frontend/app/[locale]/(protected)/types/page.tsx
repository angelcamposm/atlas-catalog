"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
    HiOutlineTag,
    HiOutlinePlus,
    HiOutlineArrowPath,
    HiOutlineMagnifyingGlass,
    HiOutlineSquares2X2,
    HiOutlineListBullet,
    HiOutlineArrowsUpDown,
} from "react-icons/hi2";
import { apiTypesApi } from "@/lib/api/api-types";
import type { ApiType } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { ApiTypeCard, ApiTypeCardSkeleton, ApiTypeFormModal } from "@/components/api-types";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type ViewMode = "grid" | "list";
type SortField = "name" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";

// ============================================================================
// Example Data (fallback when backend is empty)
// ============================================================================

const exampleApiTypes: ApiType[] = [
    {
        id: 1,
        name: "REST API",
        description: "Representational State Transfer - APIs basadas en recursos HTTP con métodos estándar (GET, POST, PUT, DELETE). Ideal para servicios web escalables y stateless.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 2,
        name: "GraphQL",
        description: "Lenguaje de consulta flexible para APIs que permite solicitar exactamente los datos necesarios. Perfecto para aplicaciones con requisitos de datos complejos.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 3,
        name: "gRPC",
        description: "Framework RPC de alto rendimiento usando Protocol Buffers. Excelente para microservicios con comunicación de baja latencia y streaming bidireccional.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 4,
        name: "WebSocket",
        description: "Protocolo de comunicación bidireccional en tiempo real. Ideal para aplicaciones de chat, notificaciones en vivo y dashboards en tiempo real.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 5,
        name: "SOAP",
        description: "Simple Object Access Protocol - Protocolo basado en XML para intercambio de información estructurada. Usado en integraciones empresariales legacy.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 6,
        name: "Webhook",
        description: "Callbacks HTTP para notificaciones en tiempo real. Permite a los sistemas recibir actualizaciones automáticas cuando ocurren eventos específicos.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 7,
        name: "Event-Driven",
        description: "APIs basadas en eventos asincrónicos usando message brokers (Kafka, RabbitMQ). Perfectas para arquitecturas desacopladas y procesamiento de alto volumen.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
    {
        id: 8,
        name: "OpenAPI/Swagger",
        description: "APIs RESTful documentadas con especificación OpenAPI. Facilita la generación automática de clientes, documentación y validación de contratos.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
    },
];

// Mock API counts per type
const mockApiCounts: Record<number, number> = {
    1: 24, // REST
    2: 8,  // GraphQL
    3: 5,  // gRPC
    4: 3,  // WebSocket
    5: 12, // SOAP
    6: 6,  // Webhook
    7: 4,  // Event-Driven
    8: 15, // OpenAPI
};

// ============================================================================
// Sort Options
// ============================================================================

const sortOptions: Array<{ field: SortField; label: string }> = [
    { field: "name", label: "Nombre" },
    { field: "created_at", label: "Fecha creación" },
    { field: "updated_at", label: "Última actualización" },
];

// ============================================================================
// Main Page Component
// ============================================================================

export default function ApiTypesPage() {
    const params = useParams();
    const locale = (params?.locale as string) || "es";
    const common = useTranslations("common");

    // Data state
    const [apiTypes, setApiTypes] = useState<ApiType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [useExampleData, setUseExampleData] = useState(false);

    // View state
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingType, setEditingType] = useState<ApiType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load API Types
    const loadApiTypes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiTypesApi.getAll();
            
            if (response.data.length === 0) {
                // If no data from backend, use examples
                setApiTypes(exampleApiTypes);
                setUseExampleData(true);
            } else {
                setApiTypes(response.data);
                setUseExampleData(false);
            }
        } catch (err) {
            console.error("Error loading API Types:", err);
            // On error, use example data
            setApiTypes(exampleApiTypes);
            setUseExampleData(true);
            setError("No se pudo conectar al backend. Mostrando datos de ejemplo.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        void loadApiTypes();
    }, [loadApiTypes]);

    // Filter and sort
    const filteredAndSortedTypes = useMemo(() => {
        let result = [...apiTypes];

        // Filter by search
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            result = result.filter(
                (type) =>
                    type.name.toLowerCase().includes(searchLower) ||
                    type.description?.toLowerCase().includes(searchLower)
            );
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "created_at":
                    comparison =
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime();
                    break;
                case "updated_at":
                    comparison =
                        new Date(a.updated_at).getTime() -
                        new Date(b.updated_at).getTime();
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

        return result;
    }, [apiTypes, searchQuery, sortField, sortOrder]);

    // Handlers
    const handleRefresh = useCallback(() => {
        void loadApiTypes();
    }, [loadApiTypes]);

    const handleCreate = useCallback(async (data: { name: string; description?: string | null }) => {
        if (useExampleData) {
            // Simulate creation with example data
            const newType: ApiType = {
                id: Math.max(...apiTypes.map((t) => t.id)) + 1,
                name: data.name,
                description: data.description,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                created_by: 1,
                updated_by: 1,
            };
            setApiTypes((prev) => [...prev, newType]);
            setShowCreateModal(false);
            return;
        }

        try {
            setIsSubmitting(true);
            await apiTypesApi.create({
                name: data.name,
                description: data.description || undefined,
            });
            await loadApiTypes();
            setShowCreateModal(false);
        } catch (err) {
            console.error("Error creating API Type:", err);
        } finally {
            setIsSubmitting(false);
        }
    }, [apiTypes, loadApiTypes, useExampleData]);

    const handleUpdate = useCallback(async (data: { name: string; description?: string | null }) => {
        if (!editingType) return;

        if (useExampleData) {
            // Simulate update with example data
            setApiTypes((prev) =>
                prev.map((t) =>
                    t.id === editingType.id
                        ? { ...t, ...data, updated_at: new Date().toISOString() }
                        : t
                )
            );
            setEditingType(null);
            return;
        }

        try {
            setIsSubmitting(true);
            await apiTypesApi.update(editingType.id, {
                name: data.name,
                description: data.description || undefined,
            });
            await loadApiTypes();
            setEditingType(null);
        } catch (err) {
            console.error("Error updating API Type:", err);
        } finally {
            setIsSubmitting(false);
        }
    }, [editingType, loadApiTypes, useExampleData]);

    const handleDelete = useCallback(async (type: ApiType) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar "${type.name}"?`)) {
            return;
        }

        if (useExampleData) {
            // Simulate deletion with example data
            setApiTypes((prev) => prev.filter((t) => t.id !== type.id));
            return;
        }

        try {
            await apiTypesApi.delete(type.id);
            await loadApiTypes();
        } catch (err) {
            console.error("Error deleting API Type:", err);
        }
    }, [loadApiTypes, useExampleData]);

    const handleSortSelect = (field: SortField) => {
        if (field === sortField) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
        setShowSortDropdown(false);
    };

    const currentSortLabel =
        sortOptions.find((o) => o.field === sortField)?.label || "Ordenar";

    // Error state (full page)
    if (error && apiTypes.length === 0 && !useExampleData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <p className="text-red-600 dark:text-red-400 mb-4">
                                {error}
                            </p>
                            <Button onClick={handleRefresh}>
                                {common("retry")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Sticky Toolbar */}
            <div className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 gap-4">
                {/* Left side - Search + Stats */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Quick Search */}
                    <div className="relative flex-1 max-w-xs">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar tipos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm bg-muted/50 border-0 rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Stats */}
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {filteredAndSortedTypes.length} de {apiTypes.length}
                    </span>

                    {useExampleData && (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Datos de ejemplo
                        </span>
                    )}
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    {/* Refresh */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <HiOutlineArrowPath
                            className={cn(
                                "h-4 w-4",
                                loading && "animate-spin"
                            )}
                        />
                    </Button>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="gap-2"
                        >
                            <HiOutlineArrowsUpDown className="h-4 w-4" />
                            <span className="hidden sm:inline">{currentSortLabel}</span>
                            <span className="text-xs text-muted-foreground">
                                {sortOrder === "asc" ? "↑" : "↓"}
                            </span>
                        </Button>

                        {showSortDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowSortDropdown(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-20 py-1">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.field}
                                            onClick={() => handleSortSelect(option.field)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors",
                                                sortField === option.field && "bg-muted"
                                            )}
                                        >
                                            <span>{option.label}</span>
                                            {sortField === option.field && (
                                                <span className="text-xs text-muted-foreground">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-1.5 transition-colors",
                                viewMode === "grid"
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                            )}
                        >
                            <HiOutlineSquares2X2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "p-1.5 transition-colors",
                                viewMode === "list"
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                            )}
                        >
                            <HiOutlineListBullet className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Create Button */}
                    <Button
                        size="sm"
                        onClick={() => setShowCreateModal(true)}
                        className="gap-2"
                    >
                        <HiOutlinePlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nuevo Tipo</span>
                    </Button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto space-y-6 px-6 py-4">
                    {/* Page Title */}
                    <PageHeader
                        icon={HiOutlineTag}
                        title="Tipos de API"
                        subtitle={
                            loading
                                ? "Cargando..."
                                : `${apiTypes.length} tipos registrados`
                        }
                    />

                    {/* Content */}
                    {loading ? (
                        <div
                            className={cn(
                                viewMode === "grid"
                                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    : "space-y-3"
                            )}
                        >
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ApiTypeCardSkeleton key={i} viewMode={viewMode} />
                            ))}
                        </div>
                    ) : filteredAndSortedTypes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <HiOutlineTag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No se encontraron tipos
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                                {searchQuery
                                    ? "No hay tipos que coincidan con la búsqueda. Intenta con otros términos."
                                    : "Aún no hay tipos de API registrados. Comienza creando el primero."}
                            </p>
                            {!searchQuery && (
                                <Button onClick={() => setShowCreateModal(true)}>
                                    <HiOutlinePlus className="w-5 h-5 mr-2" />
                                    Crear primer tipo
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div
                            className={cn(
                                viewMode === "grid"
                                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                    : "space-y-3"
                            )}
                        >
                            {filteredAndSortedTypes.map((type) => (
                                <ApiTypeCard
                                    key={type.id}
                                    apiType={type}
                                    locale={locale}
                                    viewMode={viewMode}
                                    apisCount={mockApiCounts[type.id] || 0}
                                    onEdit={(t) => setEditingType(t)}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            <ApiTypeFormModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                mode="create"
                onSubmit={handleCreate}
                isLoading={isSubmitting}
            />

            {/* Edit Modal */}
            <ApiTypeFormModal
                isOpen={!!editingType}
                onClose={() => setEditingType(null)}
                mode="edit"
                initialData={editingType || undefined}
                onSubmit={handleUpdate}
                isLoading={isSubmitting}
            />
        </div>
    );
}
