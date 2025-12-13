"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { apisApi } from "@/lib/api/apis";
import type { ApiResponse } from "@/types/api";
import {
    ApiHeader,
    ApiHeaderSkeleton,
    ApiOverview,
    ApiOverviewSkeleton,
    ApiDocs,
    ApiDocsSkeleton,
    ApiDependencies,
    ApiDependenciesSkeleton,
    ApiMetadata,
    ApiMetadataSkeleton,
} from "@/components/apis";
import { cn } from "@/lib/utils";
import {
    HiOutlineViewColumns,
    HiOutlineDocumentText,
    HiOutlineArrowsRightLeft,
    HiOutlineTableCells,
    HiOutlineExclamationCircle,
} from "react-icons/hi2";

// Tab configuration
const tabs = [
    {
        id: "overview",
        label: "Información general",
        icon: HiOutlineViewColumns,
    },
    {
        id: "docs",
        label: "Documentación",
        icon: HiOutlineDocumentText,
    },
    {
        id: "dependencies",
        label: "Dependencias",
        icon: HiOutlineArrowsRightLeft,
    },
    {
        id: "metadata",
        label: "Metadatos",
        icon: HiOutlineTableCells,
    },
] as const;

type TabId = (typeof tabs)[number]["id"];

function TabNavigation({
    activeTab,
    onTabChange,
    disabled = false,
}: {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    disabled?: boolean;
}) {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav
                className="-mb-px flex space-x-4 px-4 sm:px-6 overflow-x-auto"
                aria-label="Tabs"
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => !disabled && onTabChange(tab.id)}
                            disabled={disabled}
                            className={cn(
                                "group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                                isActive
                                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600",
                                disabled && "cursor-not-allowed opacity-50"
                            )}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive
                                        ? "text-primary-500"
                                        : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                                )}
                            />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

function TabContent({
    activeTab,
    api,
    loading,
}: {
    activeTab: TabId;
    api: ApiResponse["data"] | null;
    loading: boolean;
}) {
    if (loading) {
        return (
            <div className="p-4 sm:p-6">
                {activeTab === "overview" && <ApiOverviewSkeleton />}
                {activeTab === "docs" && <ApiDocsSkeleton />}
                {activeTab === "dependencies" && <ApiDependenciesSkeleton />}
                {activeTab === "metadata" && <ApiMetadataSkeleton />}
            </div>
        );
    }

    if (!api) {
        return null;
    }

    return (
        <div className="p-4 sm:p-6">
            {activeTab === "overview" && <ApiOverview api={api} />}
            {activeTab === "docs" && <ApiDocs api={api} />}
            {activeTab === "dependencies" && <ApiDependencies api={api} />}
            {activeTab === "metadata" && <ApiMetadata api={api} />}
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <HiOutlineExclamationCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    API no disponible
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </div>
        </div>
    );
}

export default function ApiDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const idParam = params?.id;
    const apiId = typeof idParam === "string" ? parseInt(idParam, 10) : NaN;

    // Get initial tab from URL or default to overview
    const tabParam = searchParams?.get("tab") as TabId | null;
    const initialTab = tabs.some((t) => t.id === tabParam)
        ? tabParam!
        : "overview";

    const [activeTab, setActiveTab] = useState<TabId>(initialTab);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Handle tab change with URL update
    const handleTabChange = useCallback(
        (tab: TabId) => {
            setActiveTab(tab);
            // Update URL without full page reload
            const url = new URL(window.location.href);
            if (tab === "overview") {
                url.searchParams.delete("tab");
            } else {
                url.searchParams.set("tab", tab);
            }
            router.replace(url.pathname + url.search, { scroll: false });
        },
        [router]
    );

    // Load API data
    useEffect(() => {
        if (!Number.isFinite(apiId)) {
            setError("Identificador de API no válido.");
            setLoading(false);
            return;
        }

        const loadApi = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apisApi.getById(apiId);
                setData(response);
            } catch (err) {
                console.error("Error loading API detail:", err);
                setError("No se ha podido cargar esta API. Por favor, inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        void loadApi();
    }, [apiId]);

    // Sync tab state with URL on initial load
    useEffect(() => {
        if (tabParam && tabs.some((t) => t.id === tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    // Handle edit action
    const handleEdit = useCallback(() => {
        router.push(`/apis/${apiId}/edit`);
    }, [router, apiId]);

    // Handle delete action
    const handleDelete = useCallback(async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta API?")) {
            return;
        }

        try {
            await apisApi.delete(apiId);
            router.push("/apis");
        } catch (err) {
            console.error("Error deleting API:", err);
            alert("No se ha podido eliminar la API. Por favor, inténtalo de nuevo.");
        }
    }, [router, apiId]);

    // Handle duplicate action
    const handleDuplicate = useCallback(() => {
        // Navigate to create page with pre-filled data
        const duplicateParams = new URLSearchParams({
            duplicate: apiId.toString(),
        });
        router.push(`/apis/new?${duplicateParams.toString()}`);
    }, [router, apiId]);

    // Render loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    {/* Header skeleton */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <ApiHeaderSkeleton />
                    </div>

                    {/* Tabs - disabled during loading */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm">
                        <TabNavigation
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            disabled
                        />
                        <TabContent activeTab={activeTab} api={null} loading />
                    </div>
                </div>
            </div>
        );
    }

    // Render error state
    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mt-6 mx-4">
                        <ErrorState
                            message={error ?? "No se ha encontrado la API solicitada."}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const api = data.data;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <ApiHeader
                        api={api}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDuplicate={handleDuplicate}
                    />
                </div>

                {/* Tabs and Content */}
                <div className="bg-white dark:bg-gray-800 shadow-sm mt-0.5">
                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />
                    <TabContent activeTab={activeTab} api={api} loading={false} />
                </div>
            </div>
        </div>
    );
}
