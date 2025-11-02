"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiHome,
    HiServer,
    HiLink,
    HiCube,
    HiSquares2X2,
    HiChartBar,
    HiCog6Tooth,
} from "react-icons/hi2";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface IconBarProps {
    locale: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

interface IconItem {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    label: string;
}

export function IconBar({
    locale,
    isCollapsed,
    onToggleCollapse,
}: IconBarProps) {
    const pathname = usePathname();

    const iconItems: IconItem[] = [
        {
            id: "home",
            icon: HiHome,
            href: `/${locale}/dashboard`,
            label: "Home",
        },
        {
            id: "infrastructure",
            icon: HiServer,
            href: `/${locale}/infrastructure`,
            label: "Infrastructure",
        },
        {
            id: "integration",
            icon: HiLink,
            href: `/${locale}/integration`,
            label: "Integration",
        },
        {
            id: "platform",
            icon: HiCube,
            href: `/${locale}/platform`,
            label: "Platform",
        },
        {
            id: "apis",
            icon: HiSquares2X2,
            href: `/${locale}/apis`,
            label: "APIs",
        },
        {
            id: "analytics",
            icon: HiChartBar,
            href: `/${locale}/analytics`,
            label: "Analytics",
        },
        {
            id: "settings",
            icon: HiCog6Tooth,
            href: `/${locale}/settings`,
            label: "Settings",
        },
    ];

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
                title={isCollapsed ? "Expandir menú" : "Contraer menú"}
            >
                {isCollapsed ? (
                    <PanelLeft className="h-5 w-5" />
                ) : (
                    <PanelLeftClose className="h-5 w-5" />
                )}
            </button>

            {/* Navigation Icons */}
            <nav className="flex flex-1 flex-col items-center space-y-2">
                {iconItems.map((item) => {
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

                            {/* Tooltip */}
                            <div className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-lg ring-1 ring-border group-hover:block">
                                {item.label}
                                <div className="absolute right-full top-1/2 -mr-1 -mt-1 border-4 border-transparent border-r-popover" />
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Avatar */}
            <div className="mt-auto">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-border ring-offset-2 ring-offset-background transition-transform hover:scale-105">
                    JD
                </button>
            </div>
        </div>
    );
}
