"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HiChevronRight, HiHome } from "react-icons/hi2";

export interface BreadcrumbItem {
    /** Label to display */
    label: string;
    /** URL path (optional for last item) */
    href?: string;
    /** Icon to display before label */
    icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
    /** Array of breadcrumb items */
    items?: BreadcrumbItem[];
    /** Show home icon as first item */
    showHome?: boolean;
    /** Home URL */
    homeHref?: string;
    /** Separator component */
    separator?: React.ReactNode;
    /** Maximum items to show (will collapse middle items) */
    maxItems?: number;
    /** Size variant */
    size?: "sm" | "md" | "lg";
    /** Additional className */
    className?: string;
}

// Auto-generate breadcrumbs from pathname
export function useAutoBreadcrumbs(
    locale: string,
    customLabels?: Record<string, string>
): BreadcrumbItem[] {
    const pathname = usePathname();

    const defaultLabels: Record<string, string> = {
        dashboard: "Dashboard",
        apis: "APIs",
        infrastructure: "Infrastructure",
        clusters: "Clusters",
        nodes: "Nodes",
        platform: "Platform",
        platforms: "Platforms",
        integration: "Integration",
        links: "Links",
        teams: "Teams",
        settings: "Settings",
        analytics: "Analytics",
        documentation: "Documentation",
        security: "Security",
        types: "Types",
        lifecycles: "Lifecycles",
        new: "New",
        edit: "Edit",
        ...customLabels,
    };

    const segments = pathname
        .replace(`/${locale}`, "")
        .split("/")
        .filter(Boolean);

    const items: BreadcrumbItem[] = [];
    let currentPath = `/${locale}`;

    for (const segment of segments) {
        // Skip numeric IDs, show them differently
        if (/^\d+$/.test(segment)) {
            currentPath += `/${segment}`;
            items.push({
                label: `#${segment}`,
                href: currentPath,
            });
        } else {
            currentPath += `/${segment}`;
            const label =
                defaultLabels[segment] ||
                segment.charAt(0).toUpperCase() +
                    segment.slice(1).replace(/-/g, " ");
            items.push({
                label,
                href: currentPath,
            });
        }
    }

    // Remove href from last item
    if (items.length > 0) {
        items[items.length - 1].href = undefined;
    }

    return items;
}

export function Breadcrumbs({
    items = [],
    showHome = true,
    homeHref,
    separator,
    maxItems,
    size = "md",
    className,
}: BreadcrumbsProps) {
    const pathname = usePathname();

    // Try to extract locale from pathname
    const localeMatch = pathname.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : "en";
    const defaultHomeHref = homeHref || `/${locale}/dashboard`;

    const sizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    const iconSizes = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    const DefaultSeparator = (
        <HiChevronRight
            className={cn("text-muted-foreground/50", iconSizes[size])}
        />
    );

    // Collapse items if maxItems is set
    let displayItems = items;
    let hasCollapsed = false;

    if (maxItems && items.length > maxItems) {
        const start = items.slice(0, 1);
        const end = items.slice(-(maxItems - 2));
        displayItems = [...start, { label: "...", href: undefined }, ...end];
        hasCollapsed = true;
    }

    return (
        <nav aria-label="Breadcrumb" className={cn("flex", className)}>
            <ol className={cn("flex items-center gap-1.5", sizeClasses[size])}>
                {/* Home */}
                {showHome && (
                    <>
                        <li>
                            <Link
                                href={defaultHomeHref}
                                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <HiHome className={iconSizes[size]} />
                                <span className="sr-only">Home</span>
                            </Link>
                        </li>
                        {items.length > 0 && (
                            <li
                                role="presentation"
                                className="flex items-center"
                            >
                                {separator || DefaultSeparator}
                            </li>
                        )}
                    </>
                )}

                {/* Items */}
                {displayItems.map((item, index) => {
                    const isLast = index === displayItems.length - 1;
                    const isCollapsedIndicator =
                        hasCollapsed && item.label === "...";

                    return (
                        <React.Fragment key={index}>
                            <li className="flex items-center">
                                {isCollapsedIndicator ? (
                                    <span className="text-muted-foreground px-1">
                                        ...
                                    </span>
                                ) : item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ) : (
                                    <span
                                        className={cn(
                                            "flex items-center gap-1",
                                            isLast
                                                ? "font-medium text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                        aria-current={
                                            isLast ? "page" : undefined
                                        }
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </span>
                                )}
                            </li>
                            {!isLast && (
                                <li
                                    role="presentation"
                                    className="flex items-center"
                                >
                                    {separator || DefaultSeparator}
                                </li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}

// Convenience component with auto-generated breadcrumbs
export interface AutoBreadcrumbsProps extends Omit<BreadcrumbsProps, "items"> {
    /** Locale for URL generation */
    locale: string;
    /** Custom labels for path segments */
    customLabels?: Record<string, string>;
    /** Additional items to append */
    additionalItems?: BreadcrumbItem[];
}

export function AutoBreadcrumbs({
    locale,
    customLabels,
    additionalItems = [],
    ...props
}: AutoBreadcrumbsProps) {
    const items = useAutoBreadcrumbs(locale, customLabels);

    return (
        <Breadcrumbs
            items={[
                ...items.slice(0, -1),
                ...additionalItems,
                items[items.length - 1],
            ].filter(Boolean)}
            homeHref={`/${locale}/dashboard`}
            {...props}
        />
    );
}
