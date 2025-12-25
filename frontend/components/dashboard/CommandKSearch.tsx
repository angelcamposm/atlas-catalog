"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { HiServer, HiLink, HiCube, HiChartBar } from "react-icons/hi2";
import {
    Search,
    X,
    Home,
    Bell,
    Users,
    BookOpen,
    FileText,
    Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface CommandKSearchProps {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
}

interface SearchItem {
    id: string;
    title: string;
    description: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
}

export function CommandKSearch({
    isOpen,
    onClose,
    locale,
}: CommandKSearchProps) {
    const router = useRouter();
    const t = useTranslations("sidebar");
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleSelect = useCallback(
        (item: SearchItem) => {
            router.push(item.url);
            onClose();
        },
        [router, onClose]
    );

    // All searchable items - memoized with locale dependency
    const searchItems = useMemo<SearchItem[]>(
        () => [
            // Main Navigation
            {
                id: "dashboard",
                title: t("dashboard"),
                description: "Dashboard principal",
                url: `/${locale}/dashboard`,
                icon: Home,
                category: "Main",
            },
            {
                id: "apis",
                title: t("apis"),
                description: "Catálogo de APIs",
                url: `/${locale}/apis`,
                icon: FileText,
                category: "Main",
            },
            {
                id: "lifecycles",
                title: t("lifecycles"),
                description: "Gestión de lifecycles",
                url: `/${locale}/lifecycles`,
                icon: BookOpen,
                category: "Main",
            },
            {
                id: "types",
                title: t("types"),
                description: "Tipos de recursos",
                url: `/${locale}/types`,
                icon: FileText,
                category: "Main",
            },
            {
                id: "teams",
                title: t("teams"),
                description: "Equipos",
                url: `/${locale}/teams`,
                icon: Users,
                category: "Main",
            },

            // Infrastructure
            {
                id: "infrastructure",
                title: t("infrastructure"),
                description: "Vista general de infraestructura",
                url: `/${locale}/infrastructure`,
                icon: HiServer,
                category: "Infrastructure",
            },
            {
                id: "clusters",
                title: t("clusters"),
                description: "Gestión de clusters",
                url: `/${locale}/infrastructure/clusters`,
                icon: HiServer,
                category: "Infrastructure",
            },
            {
                id: "cluster-types",
                title: t("cluster_types"),
                description: "Tipos de clusters",
                url: `/${locale}/infrastructure/cluster-types`,
                icon: HiServer,
                category: "Infrastructure",
            },
            {
                id: "nodes",
                title: t("nodes"),
                description: "Gestión de nodos",
                url: `/${locale}/infrastructure/nodes`,
                icon: HiServer,
                category: "Infrastructure",
            },
            {
                id: "service-accounts",
                title: "Service Accounts",
                description: "Cuentas de servicio",
                url: `/${locale}/infrastructure/cluster-service-accounts`,
                icon: Users,
                category: "Infrastructure",
            },

            // Platform
            {
                id: "platform",
                title: "Platform",
                description: "Vista general de plataforma",
                url: `/${locale}/platform`,
                icon: HiCube,
                category: "Platform",
            },
            {
                id: "platforms",
                title: "Platforms",
                description: "Gestión de plataformas",
                url: `/${locale}/platform/platforms`,
                icon: HiCube,
                category: "Platform",
            },
            {
                id: "component-types",
                title: "Component Types",
                description: "Tipos de componentes",
                url: `/${locale}/platform/component-types`,
                icon: HiCube,
                category: "Platform",
            },

            // Integration
            {
                id: "integration",
                title: "Integration",
                description: "Vista general de integraciones",
                url: `/${locale}/integration`,
                icon: HiLink,
                category: "Integration",
            },
            {
                id: "links",
                title: "Links",
                description: "Enlaces de integración",
                url: `/${locale}/integration/links`,
                icon: HiLink,
                category: "Integration",
            },
            {
                id: "link-types",
                title: "Link Types",
                description: "Tipos de enlaces",
                url: `/${locale}/integration/link-types`,
                icon: HiLink,
                category: "Integration",
            },

            // Analytics & Docs
            {
                id: "analytics",
                title: "Analytics",
                description: "Análisis y métricas",
                url: `/${locale}/analytics`,
                icon: HiChartBar,
                category: "Analytics",
            },
            {
                id: "documentation",
                title: "Documentation",
                description: "Centro de documentación",
                url: `/${locale}/documentation`,
                icon: FileText,
                category: "Analytics",
            },
            {
                id: "security",
                title: "Security",
                description: "Seguridad",
                url: `/${locale}/security`,
                icon: Settings,
                category: "Analytics",
            },

            // System
            {
                id: "notifications",
                title: "Notifications",
                description: "Notificaciones",
                url: `/${locale}/notifications`,
                icon: Bell,
                category: "System",
            },
            {
                id: "settings",
                title: "Settings",
                description: "Configuración del sistema",
                url: `/${locale}/settings`,
                icon: Settings,
                category: "System",
            },
        ],
        [locale]
    ); // Filter items based on query - memoized
    const filteredItems = useMemo(() => {
        if (!query.trim()) return searchItems;

        const lowerQuery = query.toLowerCase();
        return searchItems.filter(
            (item) =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery) ||
                item.category.toLowerCase().includes(lowerQuery)
        );
    }, [searchItems, query]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < filteredItems.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (filteredItems[selectedIndex]) {
                        handleSelect(filteredItems[selectedIndex]);
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredItems, selectedIndex, onClose, handleSelect]);

    // Reset state on open/close
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Reset selection when filtered items change
    useEffect(() => {
        if (selectedIndex >= filteredItems.length && filteredItems.length > 0) {
            setSelectedIndex(0);
        }
    }, [filteredItems.length, selectedIndex]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
                {/* Search Input */}
                <div className="flex items-center border-b border-gray-200 px-4 dark:border-gray-700">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search pages, sections, and more..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent px-4 py-4 text-base outline-none placeholder:text-gray-400 dark:text-white"
                        autoFocus
                    />
                    <button
                        onClick={onClose}
                        className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto p-2">
                    {filteredItems.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                            No results found for &quot;{query}&quot;
                        </div>
                    ) : (
                        <>
                            {/* Group by category */}
                            {Array.from(
                                new Set(
                                    filteredItems.map((item) => item.category)
                                )
                            ).map((category) => {
                                const categoryItems = filteredItems.filter(
                                    (item) => item.category === category
                                );

                                return (
                                    <div key={category} className="mb-4">
                                        <div className="mb-1 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {category}
                                        </div>
                                        {categoryItems.map((item) => {
                                            const globalIndex =
                                                filteredItems.indexOf(item);
                                            const Icon = item.icon;
                                            const isSelected =
                                                globalIndex === selectedIndex;

                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() =>
                                                        handleSelect(item)
                                                    }
                                                    onMouseEnter={() =>
                                                        setSelectedIndex(
                                                            globalIndex
                                                        )
                                                    }
                                                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                                                        isSelected
                                                            ? "bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
                                                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                                                    }`}
                                                >
                                                    <Icon
                                                        className={`h-5 w-5 shrink-0 ${
                                                            isSelected
                                                                ? "text-blue-600 dark:text-blue-400"
                                                                : "text-gray-400 dark:text-gray-500"
                                                        }`}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium">
                                                            {item.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <kbd className="ml-auto hidden rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 sm:inline-block dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                                            ↵
                                                        </kbd>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono dark:border-gray-700 dark:bg-gray-800">
                                ↑
                            </kbd>
                            <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono dark:border-gray-700 dark:bg-gray-800">
                                ↓
                            </kbd>
                            <span>to navigate</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono dark:border-gray-700 dark:bg-gray-800">
                                ↵
                            </kbd>
                            <span>to select</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono dark:border-gray-700 dark:bg-gray-800">
                                ESC
                            </kbd>
                            <span>to close</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
