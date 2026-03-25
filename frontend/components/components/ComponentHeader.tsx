"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";

interface ComponentHeaderProps {
    title: string;
    statusLabel?: string;
    statusVariant?: "primary" | "secondary" | "success" | "warning" | "danger";
    levelLabel?: string;
    levelVariant?: "primary" | "secondary" | "success" | "warning" | "danger";
    actions?: ReactNode;
    subtitle?: string;
}

export function ComponentHeader({
    title,
    statusLabel,
    statusVariant = "primary",
    levelLabel,
    levelVariant = "secondary",
    actions,
    subtitle,
}: ComponentHeaderProps) {
    const badges = (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {statusLabel && (
                <Badge variant={statusVariant}>{statusLabel}</Badge>
            )}
            {levelLabel && <Badge variant={levelVariant}>{levelLabel}</Badge>}
        </div>
    );

    return (
        <PageHeader
            title={title}
            subtitle={subtitle}
            icon={undefined}
            actions={
                <>
                    {badges}
                    {actions}
                </>
            }
        />
    );
}
