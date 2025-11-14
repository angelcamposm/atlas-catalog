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
        <Card className={cn("h-full", className)}>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold tracking-tight">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="max-h-56 overflow-auto rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
                    {description}
                </div>
            </CardContent>
        </Card>
    );
}
