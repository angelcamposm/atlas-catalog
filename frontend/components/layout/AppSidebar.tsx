"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiHome,
    HiUsers,
    HiChartBar,
    HiDocumentText,
    HiBell,
    HiMagnifyingGlass,
    HiChevronDown,
    HiChevronRight,
    HiTag,
    HiCog6Tooth,
    HiArrowsRightLeft,
    HiCodeBracket,
    HiViewColumns,
    HiInbox,
    HiArrowPath,
    HiServerStack,
    HiCpuChip,
    HiSquares2X2,
    HiCube,
    HiLink,
    HiBookOpen,
    HiShieldCheck,
    HiBeaker,
    HiCommandLine,
} from "react-icons/hi2";

interface AppSidebarProps {
    locale: string;
    isCollapsed?: boolean;
    onSearchClick?: () => void;
}

interface MenuItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: "default" | "success" | "warning" | "danger" | "info";
}

interface MenuSection {
    id: string;
    label?: string;
    items: MenuItem[];
    collapsible?: boolean;
}

export function AppSidebar({
    locale,
    isCollapsed = false,
    onSearchClick,
}: AppSidebarProps) {
    const pathname = usePathname();
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

    // Main navigation sections - structured like Backstage/Port.io
    const menuSections: MenuSection[] = useMemo(
        () => [
            {
                id: "catalog",
                label: "Catalog",
                items: [
                    {
                        title: "Dashboard",
                        url: `/${locale}/dashboard`,
                        icon: HiHome,
                    },
                    {
                        title: "APIs",
                        url: `/${locale}/apis`,
                        icon: HiCodeBracket,
                        badge: "100+",
                        badgeColor: "info" as const,
                    },
                    {
                        title: "API Types",
                        url: `/${locale}/types`,
                        icon: HiTag,
                    },
                    {
                        title: "Lifecycles",
                        url: `/${locale}/lifecycles`,
                        icon: HiArrowsRightLeft,
                    },
                ],
            },
            {
                id: "ownership",
                label: "Ownership",
                collapsible: true,
                items: [
                    {
                        title: "Teams",
                        url: `/${locale}/teams`,
                        icon: HiUsers,
                    },
                    {
                        title: "Members",
                        url: `/${locale}/members`,
                        icon: HiUsers,
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
                        icon: HiChartBar,
                    },
                    {
                        title: "Clusters",
                        url: `/${locale}/infrastructure/clusters`,
                        icon: HiServerStack,
                    },
                    {
                        title: "Cluster Types",
                        url: `/${locale}/infrastructure/cluster-types`,
                        icon: HiTag,
                    },
                    {
                        title: "Nodes",
                        url: `/${locale}/infrastructure/nodes`,
                        icon: HiCpuChip,
                    },
                    {
                        title: "Service Accounts",
                        url: `/${locale}/infrastructure/cluster-service-accounts`,
                        icon: HiShieldCheck,
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
                        icon: HiChartBar,
                    },
                    {
                        title: "Platforms",
                        url: `/${locale}/platform/platforms`,
                        icon: HiSquares2X2,
                    },
                    {
                        title: "Component Types",
                        url: `/${locale}/platform/component-types`,
                        icon: HiCube,
                    },
                ],
            },
            {
                id: "integration",
                label: "Integration",
                collapsible: true,
                items: [
                    {
                        title: "Overview",
                        url: `/${locale}/integration`,
                        icon: HiChartBar,
                    },
                    {
                        title: "Links",
                        url: `/${locale}/integration/links`,
                        icon: HiLink,
                    },
                    {
                        title: "Link Types",
                        url: `/${locale}/integration/link-types`,
                        icon: HiTag,
                    },
                ],
            },
            {
                id: "docs",
                label: "Documentation",
                collapsible: true,
                items: [
                    {
                        title: "Tech Docs",
                        url: `/${locale}/documentation`,
                        icon: HiBookOpen,
                    },
                    {
                        title: "API Reference",
                        url: `/${locale}/documentation/api`,
                        icon: HiCodeBracket,
                        badge: "OpenAPI",
                        badgeColor: "success" as const,
                    },
                ],
            },
            {
                id: "analytics",
                label: "Analytics",
                collapsible: true,
                items: [
                    {
                        title: "Insights",
                        url: `/${locale}/analytics`,
                        icon: HiChartBar,
                        badge: "Pro",
                        badgeColor: "warning" as const,
                    },
                    {
                        title: "Security",
                        url: `/${locale}/security`,
                        icon: HiShieldCheck,
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
                        icon: HiBeaker,
                        badge: "New",
                    },
                    {
                        title: "Diagrams",
                        url: `/${locale}/showcase/diagrams`,
                        icon: HiArrowsRightLeft,
                        badge: "New",
                    },
                    {
                        title: "Markdown",
                        url: `/${locale}/showcase/markdown`,
                        icon: HiDocumentText,
                        badge: "New",
                    },
                    {
                        title: "Slide Panel",
                        url: `/${locale}/showcase/slide-panel`,
                        icon: HiViewColumns,
                        badge: "New",
                    },
                    {
                        title: "Empty State",
                        url: `/${locale}/showcase/empty-state`,
                        icon: HiInbox,
                        badge: "New",
                    },
                    {
                        title: "Loading",
                        url: `/${locale}/showcase/loading`,
                        icon: HiArrowPath,
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
                        icon: HiBell,
                        badge: "3",
                        badgeColor: "danger" as const,
                    },
                    {
                        title: "Settings",
                        url: `/${locale}/settings`,
                        icon: HiCog6Tooth,
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
            {/* Search - triggers CommandPalette */}
            <div className="border-b border-border p-3">
                <button
                    onClick={onSearchClick}
                    className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <HiMagnifyingGlass className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">Search...</span>
                    <kbd className="pointer-events-none rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium">
                        ⌘K
                    </kbd>
                </button>
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
                                    className="mb-1 flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <span>{section.label}</span>
                                    {section.collapsible && (
                                        <div className="flex items-center gap-1">
                                            {isCollapsed ? (
                                                <HiChevronRight className="h-3.5 w-3.5" />
                                            ) : (
                                                <HiChevronDown className="h-3.5 w-3.5" />
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

                                        // Badge color styles
                                        const badgeColors = {
                                            default:
                                                "bg-primary/10 text-primary",
                                            success:
                                                "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                                            warning:
                                                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                                            danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                                            info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                        };

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
                                                    <span
                                                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                                                            badgeColors[
                                                                item.badgeColor ||
                                                                    "default"
                                                            ]
                                                        }`}
                                                    >
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
