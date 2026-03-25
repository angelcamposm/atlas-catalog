"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReadinessStatus = "good" | "attention" | "bad";

interface ReadinessWidgetProps {
    title: string;
    subtitle?: string;
    valueLabel: string;
    status?: ReadinessStatus;
    footer?: ReactNode;
    className?: string;
}

export function ReadinessWidget({
    title,
    subtitle,
    valueLabel,
    status = "good",
    footer,
    className,
}: ReadinessWidgetProps) {
    const barColor =
        status === "good"
            ? "bg-emerald-500"
            : status === "attention"
            ? "bg-amber-500"
            : "bg-red-500";

    return (
        <Card className={cn("h-full", className)}>
            <CardContent className="space-y-3 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {title}
                        </p>
                        {subtitle && (
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {valueLabel}
                    </div>
                </div>
                <div className="h-1 w-full rounded-full bg-muted">
                    <div className={cn("h-1 w-3/4 rounded-full", barColor)} />
                </div>
                {footer && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {footer}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
