"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    Home,
    Database,
    GitBranch,
    Tag,
    Users,
    Settings,
    BarChart3,
    FileText,
    Shield,
    Bell,
    Server,
    Cpu,
    Cable,
    Box,
    Search,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

interface AppSidebarProps {
    locale: string;
}

interface MenuItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
}

interface MenuGroup {
    id: string;
    label: string;
    items: MenuItem[];
}

export function AppSidebar({ locale }: AppSidebarProps) {
    const t = useTranslations("sidebar");
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
        new Set()
    );

    const toggleGroup = (groupId: string) => {
        setCollapsedGroups((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
            }
            return newSet;
        });
    };

    // Navigation items with golden ratio spacing consideration
    const menuGroups: MenuGroup[] = useMemo(
        () => [
            {
                id: "main",
                label: "Main",
                items: [
                    {
                        title: t("dashboard"),
                        url: `/${locale}/dashboard`,
                        icon: Home,
                    },
                    {
                        title: t("apis"),
                        url: `/${locale}/apis`,
                        icon: Database,
                        badge: "100+",
                    },
                    {
                        title: t("lifecycles"),
                        url: `/${locale}/lifecycles`,
                        icon: GitBranch,
                    },
                    {
                        title: t("types"),
                        url: `/${locale}/types`,
                        icon: Tag,
                    },
                    {
                        title: t("teams"),
                        url: `/${locale}/teams`,
                        icon: Users,
                    },
                ],
            },
            {
                id: "infrastructure",
                label: t("infrastructure"),
                items: [
                    {
                        title: t("overview"),
                        url: `/${locale}/infrastructure`,
                        icon: BarChart3,
                    },
                    {
                        title: t("clusters"),
                        url: `/${locale}/infrastructure/clusters`,
                        icon: Server,
                    },
                    {
                        title: t("cluster_types"),
                        url: `/${locale}/infrastructure/cluster-types`,
                        icon: Tag,
                    },
                    {
                        title: t("nodes"),
                        url: `/${locale}/infrastructure/nodes`,
                        icon: Cpu,
                    },
                    {
                        title: t("service_accounts"),
                        url: `/${locale}/infrastructure/cluster-service-accounts`,
                        icon: Shield,
                    },
                ],
            },
            {
                id: "platform",
                label: t("platform"),
                items: [
                    {
                        title: t("overview"),
                        url: `/${locale}/platform`,
                        icon: BarChart3,
                    },
                    {
                        title: t("platforms"),
                        url: `/${locale}/platform/platforms`,
                        icon: Box,
                    },
                    {
                        title: t("component_types"),
                        url: `/${locale}/platform/component-types`,
                        icon: Tag,
                    },
                ],
            },
            {
                id: "integration",
                label: t("integration"),
                items: [
                    {
                        title: t("overview"),
                        url: `/${locale}/integration`,
                        icon: BarChart3,
                    },
                    {
                        title: t("links"),
                        url: `/${locale}/integration/links`,
                        icon: Cable,
                    },
                    {
                        title: t("link_types"),
                        url: `/${locale}/integration/link-types`,
                        icon: Tag,
                    },
                ],
            },
            {
                id: "analytics",
                label: "Analytics & Docs",
                items: [
                    {
                        title: t("analytics"),
                        url: `/${locale}/analytics`,
                        icon: BarChart3,
                        badge: "Pro",
                    },
                    {
                        title: t("documentation"),
                        url: `/${locale}/documentation`,
                        icon: FileText,
                    },
                    {
                        title: t("security"),
                        url: `/${locale}/security`,
                        icon: Shield,
                    },
                ],
            },
            {
                id: "system",
                label: "System",
                items: [
                    {
                        title: t("notifications"),
                        url: `/${locale}/notifications`,
                        icon: Bell,
                        badge: "3",
                    },
                    {
                        title: t("settings"),
                        url: `/${locale}/settings`,
                        icon: Settings,
                    },
                ],
            },
        ],
        [locale, t]
    );

    // Filter groups based on search query
    const filteredGroups = useMemo(() => {
        if (!searchQuery.trim()) {
            return menuGroups;
        }

        const query = searchQuery.toLowerCase();
        return menuGroups
            .map((group) => ({
                ...group,
                items: group.items.filter((item) =>
                    item.title.toLowerCase().includes(query)
                ),
            }))
            .filter((group) => group.items.length > 0);
    }, [menuGroups, searchQuery]);

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            {/* Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={`/${locale}`}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-blue-indigo text-sidebar-primary-foreground">
                                    <span className="text-sm font-bold">A</span>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Atlas Catalog
                                    </span>
                                    <span className="truncate text-xs">
                                        API Platform
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Search Input */}
                <div className="px-3 py-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={t("search") || "Search..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 w-full rounded-md border bg-background pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </div>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent>
                {filteredGroups.map((group) => {
                    const isCollapsed = collapsedGroups.has(group.id);
                    const hasActiveItem = group.items.some(
                        (item) => pathname === item.url
                    );

                    return (
                        <SidebarGroup key={group.id}>
                            <SidebarGroupLabel
                                className="flex cursor-pointer items-center justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md px-2 py-1.5 transition-colors"
                                onClick={() => toggleGroup(group.id)}
                            >
                                <span className="flex items-center gap-2">
                                    {group.label}
                                    {hasActiveItem && !isCollapsed && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    )}
                                </span>
                                {isCollapsed ? (
                                    <ChevronRight className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </SidebarGroupLabel>

                            {!isCollapsed && (
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.items.map((item) => {
                                            const Icon = item.icon;
                                            const isActive =
                                                pathname === item.url;
                                            return (
                                                <SidebarMenuItem
                                                    key={item.title}
                                                >
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={isActive}
                                                        tooltip={item.title}
                                                    >
                                                        <Link href={item.url}>
                                                            <Icon />
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                            {item.badge && (
                                                                <span
                                                                    className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                        item.badge ===
                                                                        "Pro"
                                                                            ? "bg-gradient-amber-orange text-white"
                                                                            : item.badge ===
                                                                              "100+"
                                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                                            : "flex h-5 w-5 items-center justify-center bg-blue-600 text-white"
                                                                    }`}
                                                                >
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            )}
                        </SidebarGroup>
                    );
                })}

                {/* No results message */}
                {searchQuery && filteredGroups.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No results found for &quot;{searchQuery}&quot;
                    </div>
                )}
            </SidebarContent>

            {/* Footer - Version Info */}
            <SidebarFooter>
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Frontend</span>
                        </div>
                        <div className="rounded-full bg-gradient-blue-indigo px-2.5 py-0.5 text-xs font-semibold text-white">
                            v0.1.0
                        </div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
