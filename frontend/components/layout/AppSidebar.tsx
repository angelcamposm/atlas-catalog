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
    Inbox,
    CheckSquare,
    Plus,
    Briefcase,
    Hash,
    BookOpen,
    Tag,
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

    // Main navigation sections
    const menuSections: MenuSection[] = useMemo(
        () => [
            {
                id: "main",
                items: [
                    {
                        title: "Home",
                        url: `/${locale}/dashboard`,
                        icon: Home,
                    },
                    {
                        title: "Updates",
                        url: `/${locale}/updates`,
                        icon: Bell,
                    },
                    {
                        title: "Inbox",
                        url: `/${locale}/inbox`,
                        icon: Inbox,
                    },
                    {
                        title: "Clients",
                        url: `/${locale}/clients`,
                        icon: Users,
                        badge: "Beta",
                    },
                    {
                        title: "My Tasks",
                        url: `/${locale}/tasks`,
                        icon: CheckSquare,
                    },
                ],
            },
            {
                id: "workspaces",
                label: "Workspaces",
                collapsible: true,
                items: [
                    {
                        title: "Business Concepts",
                        url: `/${locale}/workspaces/business-concepts`,
                        icon: Briefcase,
                    },
                    {
                        title: "KeenThemes Studio",
                        url: `/${locale}/workspaces/keenthemes`,
                        icon: Briefcase,
                    },
                    {
                        title: "Teams",
                        url: `/${locale}/teams`,
                        icon: Users,
                        badge: "Pro",
                    },
                    {
                        title: "Reports",
                        url: `/${locale}/analytics`,
                        icon: BarChart3,
                    },
                ],
            },
            {
                id: "communities",
                label: "Communities",
                collapsible: true,
                items: [
                    {
                        title: "Designers Hub",
                        url: `/${locale}/communities/designers`,
                        icon: Hash,
                    },
                    {
                        title: "React Js",
                        url: `/${locale}/communities/react`,
                        icon: Hash,
                    },
                    {
                        title: "Node Js",
                        url: `/${locale}/communities/node`,
                        icon: Hash,
                    },
                ],
            },
            {
                id: "resources",
                label: "Resources",
                collapsible: true,
                items: [
                    {
                        title: "About Metronic",
                        url: `/${locale}/resources/about`,
                        icon: BookOpen,
                    },
                    {
                        title: "Advertise",
                        url: `/${locale}/resources/advertise`,
                        icon: Tag,
                        badge: "Pro",
                    },
                    {
                        title: "Help",
                        url: `/${locale}/resources/help`,
                        icon: FileText,
                    },
                    {
                        title: "Blog",
                        url: `/${locale}/resources/blog`,
                        icon: BookOpen,
                    },
                    {
                        title: "Careers",
                        url: `/${locale}/resources/careers`,
                        icon: Briefcase,
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
            className={`flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
                isCollapsed ? "w-0 overflow-hidden" : "w-60"
            }`}
        >
            {/* Search */}
            <div className="border-b border-gray-200 p-3 dark:border-gray-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-12 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-500 dark:focus:bg-gray-900"
                    />
                    <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
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
                                    className="mb-1 flex w-full items-center justify-between px-2 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    <span>{section.label}</span>
                                    {section.collapsible && (
                                        <div className="flex items-center gap-1">
                                            {section.id === "communities" && (
                                                <Plus className="h-3 w-3" />
                                            )}
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
                                                        ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200"
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-5 w-5 shrink-0 ${
                                                        active
                                                            ? "text-gray-900 dark:text-white"
                                                            : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400"
                                                    }`}
                                                />
                                                <span className="flex-1">
                                                    {item.title}
                                                </span>
                                                {item.badge && (
                                                    <span
                                                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                                                            item.badge === "Pro"
                                                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500"
                                                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
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
