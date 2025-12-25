"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiHome,
    HiServer,
    HiSquares2X2,
    HiChartBar,
    HiCog6Tooth,
    HiStar,
} from "react-icons/hi2";
import { useTranslations } from "next-intl";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface IconBarProps {
    locale: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    userFavorites?: FavoriteItem[];
}

interface FavoriteItem {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    label: string;
    category?: string;
}

export function IconBar({
    locale,
    isCollapsed,
    onToggleCollapse,
    userFavorites = [],
}: IconBarProps) {
    const pathname = usePathname();
    const t = useTranslations("sidebar");

    // Favoritos por defecto si el usuario no tiene ninguno
    const defaultFavorites: FavoriteItem[] = [
        {
            id: "home",
            icon: HiHome,
            href: `/${locale}/dashboard`,
            label: t("dashboard"),
            category: "General",
        },
        {
            id: "apis",
            icon: HiSquares2X2,
            href: `/${locale}/apis`,
            label: t("apis"),
            category: "Catálogo",
        },
        {
            id: "infrastructure",
            icon: HiServer,
            href: `/${locale}/infrastructure`,
            label: t("infrastructure"),
            category: "Recursos",
        },
        {
            id: "analytics",
            icon: HiChartBar,
            href: `/${locale}/analytics`,
            label: t("analytics"),
            category: "Reportes",
        },
    ];

    // Usar favoritos del usuario o los por defecto
    const favorites =
        userFavorites.length > 0 ? userFavorites : defaultFavorites;

    const isActive = (href: string) => {
        if (href === `/${locale}/dashboard`) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="flex h-full w-16 flex-col items-center border-r border-border bg-card py-4">
            {/* Logo */}
            <Link
                href={`/${locale}/dashboard`}
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105"
            >
                <span className="text-lg font-bold">A</span>
            </Link>

            {/* Toggle Sidebar Button */}
            <button
                onClick={onToggleCollapse}
                className="group mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                title={isCollapsed ? t("expand") : t("collapse")}
            >
                {isCollapsed ? (
                    <PanelLeft className="h-5 w-5" />
                ) : (
                    <PanelLeftClose className="h-5 w-5" />
                )}
            </button>

            {/* Favoritos Label */}
            <div className="mb-2 flex h-6 w-11 items-center justify-center">
                <HiStar className="h-4 w-4 text-yellow-500" />
            </div>

            {/* Favoritos del Usuario */}
            <nav className="flex flex-1 flex-col items-center space-y-2">
                {favorites.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`group relative flex h-11 w-11 items-center justify-center rounded-lg transition-all ${
                                active
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                            title={item.label}
                        >
                            <Icon className="h-5 w-5" />

                            {/* Tooltip con categoría */}
                            <div className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg ring-1 ring-border group-hover:block">
                                <div className="font-medium">{item.label}</div>
                                {item.category && (
                                    <div className="text-[10px] text-muted-foreground">
                                        {item.category}
                                    </div>
                                )}
                                <div className="absolute right-full top-1/2 -mr-1 -mt-1 border-4 border-transparent border-r-popover" />
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Separator */}
            <div className="my-2 h-px w-10 bg-border" />

            {/* Settings Link */}
            <Link
                href={`/${locale}/settings`}
                className={`group relative mb-2 flex h-11 w-11 items-center justify-center rounded-lg transition-all ${
                    pathname.startsWith(`/${locale}/settings`)
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                title="Configuración"
            >
                <HiCog6Tooth className="h-5 w-5" />

                {/* Tooltip */}
                <div className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg ring-1 ring-border group-hover:block">
                    {t("settings")}
                    <div className="absolute right-full top-1/2 -mr-1 -mt-1 border-4 border-transparent border-r-popover" />
                </div>
            </Link>

            {/* User Avatar */}
            <div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-border ring-offset-2 ring-offset-background transition-transform hover:scale-105">
                    JD
                </button>
            </div>
        </div>
    );
}
