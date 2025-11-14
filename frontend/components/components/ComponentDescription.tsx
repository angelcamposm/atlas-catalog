"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ComponentDescriptionProps {
    title?: string;
    description: ReactNode;
    className?: string;
}

export function ComponentDescription({
    title = "Descripción",
    description,
    className,
}: ComponentDescriptionProps) {
    return (
        <Card className={cn(className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
                <div className="text-sm leading-relaxed text-foreground/80">
                    {description}
                </div>
            </CardContent>
        </Card>
    );
}
