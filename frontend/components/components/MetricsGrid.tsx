"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricsGridProps {
    children: ReactNode;
    className?: string;
}

export function MetricsGrid({ children, className }: MetricsGridProps) {
    return (
        <div
            className={cn(
                "grid gap-4 md:grid-cols-3 lg:grid-cols-3",
                className
            )}
        >
            {children}
        </div>
    );
}
