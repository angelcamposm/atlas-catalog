"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    HiArrowTrendingUp,
    HiArrowTrendingDown,
    HiMinus,
} from "react-icons/hi2";

export type TrendDirection = "up" | "down" | "neutral";

export interface StatCardProps {
    /** Main title/label */
    title: string;
    /** The main statistic value */
    value: string | number;
    /** Optional subtitle or additional context */
    subtitle?: string;
    /** Trend information */
    trend?: {
        value: number;
        direction: TrendDirection;
        label?: string;
    };
    /** Icon to display */
    icon?: React.ReactNode;
    /** Link to detail page */
    href?: string;
    /** Color variant */
    variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
    /** Size variant */
    size?: "sm" | "md" | "lg";
    /** Additional className */
    className?: string;
    /** Loading state */
    loading?: boolean;
    /** Footer content */
    footer?: React.ReactNode;
    /** Click handler */
    onClick?: () => void;
}

const variantConfig = {
    default: {
        bg: "bg-card",
        border: "border-border",
        iconBg: "bg-muted",
        iconColor: "text-muted-foreground",
        valueColor: "text-foreground",
    },
    primary: {
        bg: "bg-card",
        border: "border-blue-200 dark:border-blue-800",
        iconBg: "bg-blue-50 dark:bg-blue-950",
        iconColor: "text-blue-600 dark:text-blue-400",
        valueColor: "text-blue-600 dark:text-blue-400",
    },
    success: {
        bg: "bg-card",
        border: "border-green-200 dark:border-green-800",
        iconBg: "bg-green-50 dark:bg-green-950",
        iconColor: "text-green-600 dark:text-green-400",
        valueColor: "text-green-600 dark:text-green-400",
    },
    warning: {
        bg: "bg-card",
        border: "border-yellow-200 dark:border-yellow-800",
        iconBg: "bg-yellow-50 dark:bg-yellow-950",
        iconColor: "text-yellow-600 dark:text-yellow-400",
        valueColor: "text-yellow-600 dark:text-yellow-400",
    },
    danger: {
        bg: "bg-card",
        border: "border-red-200 dark:border-red-800",
        iconBg: "bg-red-50 dark:bg-red-950",
        iconColor: "text-red-600 dark:text-red-400",
        valueColor: "text-red-600 dark:text-red-400",
    },
    info: {
        bg: "bg-card",
        border: "border-cyan-200 dark:border-cyan-800",
        iconBg: "bg-cyan-50 dark:bg-cyan-950",
        iconColor: "text-cyan-600 dark:text-cyan-400",
        valueColor: "text-cyan-600 dark:text-cyan-400",
    },
};

const trendConfig: Record<
    TrendDirection,
    { icon: typeof HiArrowTrendingUp; color: string }
> = {
    up: {
        icon: HiArrowTrendingUp,
        color: "text-green-600 dark:text-green-400",
    },
    down: {
        icon: HiArrowTrendingDown,
        color: "text-red-600 dark:text-red-400",
    },
    neutral: {
        icon: HiMinus,
        color: "text-muted-foreground",
    },
};

export function StatCard({
    title,
    value,
    subtitle,
    trend,
    icon,
    href,
    variant = "default",
    size = "md",
    className,
    loading = false,
    footer,
    onClick,
}: StatCardProps) {
    const config = variantConfig[variant];

    const sizeClasses = {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
    };

    const valueSizes = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-4xl",
    };

    const iconSizes = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-14 w-14",
    };

    const TrendIcon = trend ? trendConfig[trend.direction].icon : null;

    const baseClassName = cn(
        "group relative flex flex-col rounded-xl border shadow-sm transition-all duration-200",
        config.bg,
        config.border,
        href || onClick
            ? "cursor-pointer hover:shadow-md hover:border-primary/50"
            : "",
        sizeClasses[size],
        className
    );

    const cardContent = (
        <>
            {/* Top section: Icon and Title */}
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    {/* Value */}
                    {loading ? (
                        <div className="mt-2 h-8 w-24 animate-pulse rounded bg-muted" />
                    ) : (
                        <p
                            className={cn(
                                "mt-1 font-bold tracking-tight",
                                valueSizes[size],
                                config.valueColor
                            )}
                        >
                            {value}
                        </p>
                    )}

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Icon */}
                {icon && (
                    <div
                        className={cn(
                            "flex shrink-0 items-center justify-center rounded-lg",
                            config.iconBg,
                            iconSizes[size]
                        )}
                    >
                        <div className={config.iconColor}>{icon}</div>
                    </div>
                )}
            </div>

            {/* Trend */}
            {trend && TrendIcon && (
                <div className="mt-3 flex items-center gap-1">
                    <TrendIcon
                        className={cn(
                            "h-4 w-4",
                            trendConfig[trend.direction].color
                        )}
                    />
                    <span
                        className={cn(
                            "text-sm font-medium",
                            trendConfig[trend.direction].color
                        )}
                    >
                        {trend.value > 0 ? "+" : ""}
                        {trend.value}%
                    </span>
                    {trend.label && (
                        <span className="text-xs text-muted-foreground">
                            {trend.label}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            {footer && (
                <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
                    {footer}
                </div>
            )}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={baseClassName}>
                {cardContent}
            </Link>
        );
    }

    return (
        <div
            className={baseClassName}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {cardContent}
        </div>
    );
}

// Stats Grid component
export interface StatsGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4 | 5;
    className?: string;
}

export function StatsGrid({
    children,
    columns = 4,
    className,
}: StatsGridProps) {
    const gridCols = {
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    };

    return (
        <div className={cn("grid gap-4", gridCols[columns], className)}>
            {children}
        </div>
    );
}

// Quick stat for inline use
export interface QuickStatProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    className?: string;
}

export function QuickStat({ label, value, icon, className }: QuickStatProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {icon && (
                <span className="text-muted-foreground">{icon}</span>
            )}
            <span className="text-sm text-muted-foreground">{label}:</span>
            <span className="text-sm font-semibold">{value}</span>
        </div>
    );
}
