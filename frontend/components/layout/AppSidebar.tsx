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

            {/* Footer - User Info */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={`/${locale}/profile`}>
                                <div className="flex size-8 items-center justify-center rounded-full bg-gradient-blue-indigo text-sm font-semibold text-white">
                                    JD
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        John Doe
                                    </span>
                                    <span className="truncate text-xs">
                                        john@example.com
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
