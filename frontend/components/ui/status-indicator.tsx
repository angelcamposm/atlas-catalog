"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
    | "active"
    | "inactive"
    | "pending"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "deprecated"
    | "draft"
    | "retired"
    | "running"
    | "stopped"
    | "unknown";

interface StatusConfig {
    label: string;
    dotColor: string;
    bgColor: string;
    textColor: string;
    ringColor: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
    active: {
        label: "Active",
        dotColor: "bg-green-500",
        bgColor: "bg-green-50 dark:bg-green-950",
        textColor: "text-green-700 dark:text-green-300",
        ringColor: "ring-green-600/20 dark:ring-green-400/20",
    },
    inactive: {
        label: "Inactive",
        dotColor: "bg-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-900",
        textColor: "text-gray-600 dark:text-gray-400",
        ringColor: "ring-gray-500/20 dark:ring-gray-400/20",
    },
    pending: {
        label: "Pending",
        dotColor: "bg-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
        textColor: "text-yellow-700 dark:text-yellow-300",
        ringColor: "ring-yellow-600/20 dark:ring-yellow-400/20",
    },
    success: {
        label: "Success",
        dotColor: "bg-green-500",
        bgColor: "bg-green-50 dark:bg-green-950",
        textColor: "text-green-700 dark:text-green-300",
        ringColor: "ring-green-600/20 dark:ring-green-400/20",
    },
    warning: {
        label: "Warning",
        dotColor: "bg-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950",
        textColor: "text-yellow-700 dark:text-yellow-300",
        ringColor: "ring-yellow-600/20 dark:ring-yellow-400/20",
    },
    error: {
        label: "Error",
        dotColor: "bg-red-500",
        bgColor: "bg-red-50 dark:bg-red-950",
        textColor: "text-red-700 dark:text-red-300",
        ringColor: "ring-red-600/20 dark:ring-red-400/20",
    },
    info: {
        label: "Info",
        dotColor: "bg-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        textColor: "text-blue-700 dark:text-blue-300",
        ringColor: "ring-blue-600/20 dark:ring-blue-400/20",
    },
    deprecated: {
        label: "Deprecated",
        dotColor: "bg-orange-500",
        bgColor: "bg-orange-50 dark:bg-orange-950",
        textColor: "text-orange-700 dark:text-orange-300",
        ringColor: "ring-orange-600/20 dark:ring-orange-400/20",
    },
    draft: {
        label: "Draft",
        dotColor: "bg-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-900",
        textColor: "text-gray-600 dark:text-gray-400",
        ringColor: "ring-gray-500/20 dark:ring-gray-400/20",
    },
    retired: {
        label: "Retired",
        dotColor: "bg-red-400",
        bgColor: "bg-red-50 dark:bg-red-950",
        textColor: "text-red-600 dark:text-red-400",
        ringColor: "ring-red-500/20 dark:ring-red-400/20",
    },
    running: {
        label: "Running",
        dotColor: "bg-green-500",
        bgColor: "bg-green-50 dark:bg-green-950",
        textColor: "text-green-700 dark:text-green-300",
        ringColor: "ring-green-600/20 dark:ring-green-400/20",
    },
    stopped: {
        label: "Stopped",
        dotColor: "bg-red-500",
        bgColor: "bg-red-50 dark:bg-red-950",
        textColor: "text-red-700 dark:text-red-300",
        ringColor: "ring-red-600/20 dark:ring-red-400/20",
    },
    unknown: {
        label: "Unknown",
        dotColor: "bg-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-900",
        textColor: "text-gray-600 dark:text-gray-400",
        ringColor: "ring-gray-500/20 dark:ring-gray-400/20",
    },
};

export interface StatusIndicatorProps {
    /** Status type */
    status: StatusType;
    /** Custom label (overrides default) */
    label?: string;
    /** Show label text */
    showLabel?: boolean;
    /** Size variant */
    size?: "xs" | "sm" | "md" | "lg";
    /** Animate the dot (pulse effect) */
    pulse?: boolean;
    /** Display variant */
    variant?: "dot" | "badge" | "pill";
    /** Additional className */
    className?: string;
}

export function StatusIndicator({
    status,
    label,
    showLabel = true,
    size = "sm",
    pulse = false,
    variant = "dot",
    className,
}: StatusIndicatorProps) {
    const config = statusConfig[status] || statusConfig.unknown;
    const displayLabel = label || config.label;

    const dotSizes = {
        xs: "h-1.5 w-1.5",
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3",
    };

    const textSizes = {
        xs: "text-xs",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    const paddingSizes = {
        xs: "px-1.5 py-0.5",
        sm: "px-2 py-0.5",
        md: "px-2.5 py-1",
        lg: "px-3 py-1.5",
    };

    // Dot variant
    if (variant === "dot") {
        return (
            <span className={cn("inline-flex items-center gap-1.5", className)}>
                <span className="relative flex">
                    <span
                        className={cn(
                            "rounded-full",
                            dotSizes[size],
                            config.dotColor
                        )}
                    />
                    {pulse && (
                        <span
                            className={cn(
                                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                                config.dotColor
                            )}
                        />
                    )}
                </span>
                {showLabel && (
                    <span
                        className={cn(
                            "font-medium",
                            textSizes[size],
                            config.textColor
                        )}
                    >
                        {displayLabel}
                    </span>
                )}
            </span>
        );
    }

    // Badge variant
    if (variant === "badge") {
        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 rounded-md ring-1 ring-inset",
                    config.bgColor,
                    config.ringColor,
                    paddingSizes[size],
                    className
                )}
            >
                <span
                    className={cn(
                        "rounded-full",
                        dotSizes[size],
                        config.dotColor
                    )}
                />
                {showLabel && (
                    <span
                        className={cn(
                            "font-medium",
                            textSizes[size],
                            config.textColor
                        )}
                    >
                        {displayLabel}
                    </span>
                )}
            </span>
        );
    }

    // Pill variant
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full ring-1 ring-inset",
                config.bgColor,
                config.ringColor,
                paddingSizes[size],
                className
            )}
        >
            <span
                className={cn("rounded-full", dotSizes[size], config.dotColor)}
            />
            {showLabel && (
                <span
                    className={cn(
                        "font-medium",
                        textSizes[size],
                        config.textColor
                    )}
                >
                    {displayLabel}
                </span>
            )}
        </span>
    );
}

// Health indicator for services/clusters
export interface HealthIndicatorProps {
    /** Health percentage (0-100) */
    health: number;
    /** Show percentage text */
    showPercentage?: boolean;
    /** Size variant */
    size?: "sm" | "md" | "lg";
    /** Additional className */
    className?: string;
}

export function HealthIndicator({
    health,
    showPercentage = true,
    size = "md",
    className,
}: HealthIndicatorProps) {
    const getStatus = (value: number): StatusType => {
        if (value >= 90) return "success";
        if (value >= 70) return "warning";
        if (value >= 50) return "error";
        return "error";
    };

    const status = getStatus(health);
    const config = statusConfig[status];

    const barHeights = {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2",
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div
                className={cn(
                    "flex-1 rounded-full bg-muted overflow-hidden",
                    barHeights[size]
                )}
            >
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500",
                        config.dotColor
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, health))}%` }}
                />
            </div>
            {showPercentage && (
                <span
                    className={cn(
                        "text-sm font-medium tabular-nums",
                        config.textColor
                    )}
                >
                    {health}%
                </span>
            )}
        </div>
    );
}

// Uptime indicator
export interface UptimeIndicatorProps {
    /** Array of status for each period (e.g., last 30 days) */
    history: ("up" | "down" | "partial" | "unknown")[];
    /** Period label */
    periodLabel?: string;
    /** Additional className */
    className?: string;
}

export function UptimeIndicator({
    history,
    periodLabel = "Last 30 days",
    className,
}: UptimeIndicatorProps) {
    const statusColors = {
        up: "bg-green-500",
        down: "bg-red-500",
        partial: "bg-yellow-500",
        unknown: "bg-gray-300 dark:bg-gray-600",
    };

    const upCount = history.filter((s) => s === "up").length;
    const uptimePercentage = ((upCount / history.length) * 100).toFixed(2);

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{periodLabel}</span>
                <span className="font-medium">{uptimePercentage}% uptime</span>
            </div>
            <div className="flex gap-0.5">
                {history.map((status, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex-1 h-6 rounded-sm transition-colors hover:opacity-80",
                            statusColors[status]
                        )}
                        title={`Day ${idx + 1}: ${status}`}
                    />
                ))}
            </div>
        </div>
    );
}
