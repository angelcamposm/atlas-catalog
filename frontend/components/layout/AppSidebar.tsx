"use client";

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

interface AppSidebarProps {
    locale: string;
}

export function AppSidebar({ locale }: AppSidebarProps) {
    const t = useTranslations("sidebar");
    const pathname = usePathname();

    // Navigation items with golden ratio spacing consideration
    const menuItems = [
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
    ];

    const infrastructureItems = [
        {
            title: t("clusters"),
            url: `/${locale}/infrastructure/clusters`,
            icon: Server,
        },
        {
            title: t("nodes"),
            url: `/${locale}/infrastructure/nodes`,
            icon: Cpu,
        },
    ];

    const platformItems = [
        {
            title: t("platforms"),
            url: `/${locale}/platform/platforms`,
            icon: Box,
        },
    ];

    const integrationItems = [
        {
            title: t("links"),
            url: `/${locale}/integration/links`,
            icon: Cable,
        },
    ];

    const analyticsItems = [
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
    ];

    const settingsItems = [
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
    ];

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
            </SidebarHeader>

            {/* Content */}
            <SidebarContent>
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url}>
                                                <Icon />
                                                <span>{item.title}</span>
                                                {item.badge && (
                                                    <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
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
                </SidebarGroup>

                {/* Infrastructure */}
                <SidebarGroup>
                    <SidebarGroupLabel>{t("infrastructure")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {infrastructureItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url}>
                                                <Icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Platform */}
                <SidebarGroup>
                    <SidebarGroupLabel>{t("platform")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {platformItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url}>
                                                <Icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Integration */}
                <SidebarGroup>
                    <SidebarGroupLabel>{t("integration")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {integrationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url}>
                                                <Icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Analytics & Docs */}
                <SidebarGroup>
                    <SidebarGroupLabel>Analytics & Docs</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {analyticsItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url}>
                                                <Icon />
                                                <span>{item.title}</span>
                                                {item.badge && (
                                                    <span className="ml-auto rounded-full bg-gradient-amber-orange px-2 py-0.5 text-xs font-medium text-white">
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
                </SidebarGroup>

                {/* Settings */}
                <SidebarGroup>
                    <SidebarGroupLabel>System</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url}>
                                                <Icon />
                                                <span>{item.title}</span>
                                                {item.badge && (
                                                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
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
                </SidebarGroup>
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
