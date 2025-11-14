"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TrendDirection = "up" | "down" | "neutral" | undefined;

interface MetricWidgetProps {
    title: string;
    value: ReactNode;
    description?: string;
    trendLabel?: string;
    trendDirection?: TrendDirection;
    className?: string;
}

export function MetricWidget({
    title,
    value,
    description,
    trendLabel,
    trendDirection,
    className,
}: MetricWidgetProps) {
    const trendColor =
        trendDirection === "up"
            ? "text-emerald-600 dark:text-emerald-400"
            : trendDirection === "down"
            ? "text-red-600 dark:text-red-400"
            : "text-muted-foreground";

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-xl font-semibold text-foreground">
                    {value}
                </div>
                {description && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                )}
                {trendLabel && (
                    <p className={cn("text-xs font-medium", trendColor)}>
                        {trendLabel}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
