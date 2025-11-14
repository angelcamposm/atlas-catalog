"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Users,
    BarChart3,
    FileText,
    Bell,
    Search,
    ChevronDown,
    ChevronRight,
    Tag,
    Settings,
} from "lucide-react";

interface AppSidebarProps {
    locale: string;
    isCollapsed?: boolean;
}

interface MenuItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
}

interface MenuSection {
    id: string;
    label?: string;
    items: MenuItem[];
    collapsible?: boolean;
}

export function AppSidebar({ locale, isCollapsed = false }: AppSidebarProps) {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
        new Set()
    );

    const toggleSection = (sectionId: string) => {
        setCollapsedSections((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    // Main navigation sections - matching original project structure
    const menuSections: MenuSection[] = useMemo(
        () => [
            {
                id: "main",
                label: "Main",
                items: [
                    {
                        title: "Dashboard",
                        url: `/${locale}/dashboard`,
                        icon: Home,
                    },
                    {
                        title: "APIs",
                        url: `/${locale}/apis`,
                        icon: FileText,
                        badge: "100+",
                    },
                    {
                        title: "Lifecycles",
                        url: `/${locale}/lifecycles`,
                        icon: BarChart3,
                    },
                    {
                        title: "Types",
                        url: `/${locale}/types`,
                        icon: Tag,
                    },
                    {
                        title: "Teams",
                        url: `/${locale}/teams`,
                        icon: Users,
                    },
                ],
            },
            {
                id: "infrastructure",
                label: "Infrastructure",
                collapsible: true,
                items: [
                    {
                        title: "Overview",
                        url: `/${locale}/infrastructure`,
                        icon: BarChart3,
                    },
                    {
                        title: "Clusters",
                        url: `/${locale}/infrastructure/clusters`,
                        icon: Home,
                    },
                    {
                        title: "Cluster Types",
                        url: `/${locale}/infrastructure/cluster-types`,
                        icon: Tag,
                    },
                    {
                        title: "Nodes",
                        url: `/${locale}/infrastructure/nodes`,
                        icon: Home,
                    },
                    {
                        title: "Service Accounts",
                        url: `/${locale}/infrastructure/cluster-service-accounts`,
                        icon: Users,
                    },
                ],
            },
            {
                id: "platform",
                label: "Platform",
                collapsible: true,
                items: [
                    {
                        title: "Overview",
                        url: `/${locale}/platform`,
                        icon: BarChart3,
                    },
                    {
                        title: "Platforms",
                        url: `/${locale}/platform/platforms`,
                        icon: Home,
                    },
                    {
                        title: "Component Types",
                        url: `/${locale}/platform/component-types`,
                        icon: Tag,
                    },
                ],
            },
            {
                id: "analytics",
                label: "Analytics & Docs",
                collapsible: true,
                items: [
                    {
                        title: "Analytics",
                        url: `/${locale}/analytics`,
                        icon: BarChart3,
                        badge: "Pro",
                    },
                    {
                        title: "Documentation",
                        url: `/${locale}/documentation`,
                        icon: FileText,
                    },
                    {
                        title: "Security",
                        url: `/${locale}/security`,
                        icon: Users,
                    },
                ],
            },
            {
                id: "labs",
                label: "Labs",
                collapsible: true,
                items: [
                    {
                        title: "Component Demos",
                        url: `/${locale}/components/demo`,
                        icon: Home,
                        badge: "New",
                    },
                ],
            },
            {
                id: "system",
                label: "System",
                collapsible: true,
                items: [
                    {
                        title: "Notifications",
                        url: `/${locale}/notifications`,
                        icon: Bell,
                        badge: "3",
                    },
                    {
                        title: "Settings",
                        url: `/${locale}/settings`,
                        icon: Settings,
                    },
                ],
            },
        ],
        [locale]
    );

    const isActive = (url: string) => {
        return pathname === url;
    };

    return (
        <div
            className={`flex h-full flex-col border-r border-border bg-card transition-all duration-300 ${
                isCollapsed ? "w-0 overflow-hidden" : "w-60"
            }`}
        >
            {/* Search */}
            <div className="border-b border-border p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                    />
                    <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3">
                {menuSections.map((section) => {
                    const isCollapsed = collapsedSections.has(section.id);

                    return (
                        <div key={section.id} className="mb-4">
                            {/* Section Label */}
                            {section.label && (
                                <button
                                    onClick={() =>
                                        section.collapsible &&
                                        toggleSection(section.id)
                                    }
                                    className="mb-1 flex w-full items-center justify-between px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <span>{section.label}</span>
                                    {section.collapsible && (
                                        <div className="flex items-center gap-1">
                                            {isCollapsed ? (
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            ) : (
                                                <ChevronDown className="h-3.5 w-3.5" />
                                            )}
                                        </div>
                                    )}
                                </button>
                            )}

                            {/* Menu Items */}
                            {!isCollapsed && (
                                <div className="space-y-0.5">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.url);

                                        return (
                                            <Link
                                                key={item.url}
                                                href={item.url}
                                                className={`group flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-all ${
                                                    active
                                                        ? "bg-accent font-medium text-accent-foreground"
                                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-5 w-5 shrink-0 ${
                                                        active
                                                            ? "text-accent-foreground"
                                                            : "text-muted-foreground group-hover:text-foreground"
                                                    }`}
                                                />
                                                <span className="flex-1">
                                                    {item.title}
                                                </span>
                                                {item.badge && (
                                                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer - User */}
            <div className="border-t border-gray-200 p-3 dark:border-gray-800">
                <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                        JD
                    </div>
                    <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            John Doe
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            john@example.com
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
