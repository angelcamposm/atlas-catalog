"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";

interface ComponentHeaderProps {
    title: string;
    statusLabel?: string;
    statusVariant?: "default" | "success" | "warning" | "destructive";
    levelLabel?: string;
    levelVariant?: "outline" | "secondary" | "default";
    actions?: ReactNode;
    subtitle?: string;
}

export function ComponentHeader({
    title,
    statusLabel,
    statusVariant = "default",
    levelLabel,
    levelVariant = "secondary",
    actions,
    subtitle,
}: ComponentHeaderProps) {
    return (
        <PageHeader
            title={title}
            subtitle={subtitle}
            icon={undefined}
            actions={actions}
        >
            <div className="flex flex-wrap items-center gap-2 mt-3">
                {statusLabel && (
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                )}
                {levelLabel && (
                    <Badge variant={levelVariant}>{levelLabel}</Badge>
                )}
            </div>
        </PageHeader>
    );
}
