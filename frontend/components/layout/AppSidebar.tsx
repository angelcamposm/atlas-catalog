"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiMagnifyingGlass,
    HiChevronDown,
    HiChevronRight,
    HiCodeBracket,
    HiDocumentText,
    HiArrowsPointingOut,
    HiRectangleStack,
    HiExclamationCircle,
    HiArrowPath,
    HiHome,
    HiCube,
    HiBriefcase,
    HiSquares2X2,
    HiServer,
    HiUserGroup,
    HiShieldCheck,
    HiCog6Tooth,
    HiArrowPathRoundedSquare,
} from "react-icons/hi2";
import { useModule } from "./ModuleContext";
import { useTranslations } from "next-intl";

interface AppSidebarProps {
    locale: string;
    isCollapsed?: boolean;
    onSearchClick?: () => void;
}

interface SubMenuItem {
    title: string;
    url: string;
}

interface MenuItem {
    title: string;
    url?: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: "default" | "success" | "warning" | "danger" | "info";
    subItems?: SubMenuItem[];
}

interface MenuSection {
    id: string;
    items: MenuItem[];
}

export function AppSidebar({
    locale,
    isCollapsed = false,
    onSearchClick,
}: AppSidebarProps) {
    const t = useTranslations("sidebar");
    const pathname = usePathname();
    const { activeModule } = useModule();

    // Track expanded menu items (for items with submenus)
    const [expandedItems, setExpandedItems] = useState<Set<string>>(
        new Set([
            "architecture",
            "business",
            "catalog",
            "ci_cd",
            "infrastructure",
            "organization",
            "security",
            "management",
        ])
    );

    const toggleItem = (itemTitle: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemTitle)) {
                newSet.delete(itemTitle);
            } else {
                newSet.add(itemTitle);
            }
            return newSet;
        });
    };

    // Main menu structure based on the design
    const mainMenuSections: MenuSection[] = useMemo(
        () => [
            {
                id: "main",
                items: [
                    {
                        title: "dashboard",
                        url: `/${locale}/dashboard`,
                        icon: HiHome,
                    },
                    {
                        title: "architecture",
                        icon: HiCube,
                        subItems: [
                            { title: "entities", url: `/${locale}/components` },
                            {
                                title: "lifecycle",
                                url: `/${locale}/lifecycles`,
                            },
                            { title: "systems", url: `/${locale}/types` },
                        ],
                    },
                    {
                        title: "business",
                        icon: HiBriefcase,
                        subItems: [
                            {
                                title: "business_capabilities",
                                url: `/${locale}/business/capabilities`,
                            },
                            {
                                title: "business_domains",
                                url: `/${locale}/business/domains`,
                            },
                            {
                                title: "business_tiers",
                                url: `/${locale}/taxonomy/business-tiers`,
                            },
                        ],
                    },
                    {
                        title: "catalog",
                        icon: HiSquares2X2,
                        subItems: [
                            { title: "apis", url: `/${locale}/apis` },
                            {
                                title: "components",
                                url: `/${locale}/components`,
                            },
                            {
                                title: "environments",
                                url: `/${locale}/business/environments`,
                            },
                            { title: "resources", url: `/${locale}/resources` },
                        ],
                    },
                    {
                        title: "ci_cd",
                        icon: HiArrowPathRoundedSquare,
                        subItems: [
                            {
                                title: "ci_cd_dashboard",
                                url: `/${locale}/ci-cd/dashboard`,
                            },
                            {
                                title: "artifact_releases",
                                url: `/${locale}/ci-cd/releases`,
                            },
                            {
                                title: "ci_servers",
                                url: `/${locale}/ci-cd/servers`,
                            },
                            {
                                title: "workflows",
                                url: `/${locale}/ci-cd/workflows`,
                            },
                        ],
                    },
                    {
                        title: "infrastructure",
                        icon: HiServer,
                        subItems: [
                            {
                                title: "clusters",
                                url: `/${locale}/infrastructure/clusters`,
                            },
                            {
                                title: "nodes",
                                url: `/${locale}/infrastructure/nodes`,
                            },
                        ],
                    },
                    {
                        title: "organization",
                        icon: HiUserGroup,
                        subItems: [
                            { title: "groups", url: `/${locale}/teams` },
                            { title: "users", url: `/${locale}/users` },
                        ],
                    },
                    {
                        title: "security",
                        icon: HiShieldCheck,
                        subItems: [
                            {
                                title: "security_dashboard",
                                url: `/${locale}/security`,
                            },
                            {
                                title: "service_accounts",
                                url: `/${locale}/security/service-accounts`,
                            },
                        ],
                    },
                    {
                        title: "management",
                        icon: HiCog6Tooth,
                        subItems: [
                            {
                                title: "authentication_methods",
                                url: `/${locale}/security/auth-methods`,
                            },
                            {
                                title: "categories",
                                url: `/${locale}/admin/api-categories`,
                            },
                            {
                                title: "frameworks",
                                url: `/${locale}/technology/frameworks`,
                            },
                            {
                                title: "group_member_roles",
                                url: `/${locale}/admin/member-roles`,
                            },
                            {
                                title: "group_types",
                                url: `/${locale}/admin/group-types`,
                            },
                            {
                                title: "programming_languages",
                                url: `/${locale}/technology/languages`,
                            },
                            {
                                title: "service_models",
                                url: `/${locale}/platform/component-types`,
                            },
                            {
                                title: "vendors",
                                url: `/${locale}/technology/vendors`,
                            },
                        ],
                    },
                ],
            },
        ],
        [locale]
    );

    // Menu sections for Examples module
    const examplesSections: MenuSection[] = useMemo(
        () => [
            {
                id: "examples",
                items: [
                    {
                        title: "diagrams",
                        url: `/${locale}/showcase/diagrams`,
                        icon: HiArrowsPointingOut,
                    },
                    {
                        title: "empty_state",
                        url: `/${locale}/showcase/empty-state`,
                        icon: HiExclamationCircle,
                    },
                    {
                        title: "loading",
                        url: `/${locale}/showcase/loading`,
                        icon: HiArrowPath,
                    },
                    {
                        title: "markdown",
                        url: `/${locale}/showcase/markdown`,
                        icon: HiDocumentText,
                    },
                    {
                        title: "slide_panel",
                        url: `/${locale}/showcase/slide-panel`,
                        icon: HiRectangleStack,
                    },
                    {
                        title: "buttons",
                        url: `/${locale}/showcase/buttons`,
                        icon: HiCodeBracket,
                    },
                    {
                        title: "badges",
                        url: `/${locale}/showcase/badges`,
                        icon: HiRectangleStack,
                    },
                    {
                        title: "cards",
                        url: `/${locale}/showcase/cards`,
                        icon: HiRectangleStack,
                    },
                    {
                        title: "alerts",
                        url: `/${locale}/showcase/alerts`,
                        icon: HiExclamationCircle,
                    },
                    {
                        title: "forms",
                        url: `/${locale}/showcase/forms`,
                        icon: HiDocumentText,
                    },
                ],
            },
        ],
        [locale]
    );

    // Select menu sections based on active module
    const menuSections =
        activeModule === "examples" ? examplesSections : mainMenuSections;

    const isActive = (url: string) => {
        return pathname === url;
    };

    const isParentActive = (subItems: SubMenuItem[]) => {
        return subItems.some(
            (item) =>
                pathname === item.url || pathname.startsWith(item.url + "/")
        );
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
                    <span className="flex-1 text-left">{t("search")}</span>
                    <kbd className="pointer-events-none rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium">
                        ⌘K
                    </kbd>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3">
                {menuSections.map((section) => (
                    <div key={section.id} className="space-y-1">
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const hasSubItems =
                                item.subItems && item.subItems.length > 0;
                            const isExpanded = expandedItems.has(item.title);
                            const active = item.url
                                ? isActive(item.url)
                                : hasSubItems
                                ? isParentActive(item.subItems!)
                                : false;

                            // Badge color styles
                            const badgeColors = {
                                default: "bg-primary/10 text-primary",
                                success:
                                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                                warning:
                                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                                danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                                info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                            };

                            if (hasSubItems) {
                                return (
                                    <div key={item.title}>
                                        <button
                                            onClick={() =>
                                                toggleItem(item.title)
                                            }
                                            className={`group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-all ${
                                                active
                                                    ? "text-foreground"
                                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                            }`}
                                        >
                                            {isExpanded ? (
                                                <HiChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            ) : (
                                                <HiChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            )}
                                            <span className="flex-1 text-left">
                                                {t(item.title)}
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
                                        </button>
                                        {isExpanded && (
                                            <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                                                {item.subItems!.map(
                                                    (subItem) => {
                                                        const subActive =
                                                            isActive(
                                                                subItem.url
                                                            ) ||
                                                            pathname.startsWith(
                                                                subItem.url +
                                                                    "/"
                                                            );
                                                        return (
                                                            <Link
                                                                key={
                                                                    subItem.url
                                                                }
                                                                href={
                                                                    subItem.url
                                                                }
                                                                className={`block rounded-md px-2 py-1.5 text-sm transition-all ${
                                                                    subActive
                                                                        ? "bg-accent font-medium text-accent-foreground"
                                                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                                                }`}
                                                            >
                                                                {t(
                                                                    subItem.title
                                                                )}
                                                            </Link>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.url}
                                    href={item.url!}
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
                                        {t(item.title)}
                                    </span>
                                    {item.badge && (
                                        <span
                                            className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                                                badgeColors[
                                                    item.badgeColor || "default"
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
                ))}
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
                {/* App Version */}
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <span>Atlas Catalog</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                        v{process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0"}
                    </span>
                </div>
            </div>
        </div>
    );
}
