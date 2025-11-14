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
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                </div>
            </CardContent>
        </Card>
    );
}
