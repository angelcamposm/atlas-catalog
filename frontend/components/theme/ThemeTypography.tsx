"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TYPOGRAPHY_SAMPLES = [
    {
        label: "Heading",
        className: "text-2xl font-semibold tracking-tight",
        description: "Page titles and section headers",
    },
    {
        label: "Body",
        className: "text-sm text-muted-foreground",
        description: "Primary body copy",
    },
    {
        label: "Caption",
        className: "text-xs text-muted-foreground",
        description: "Helper text and metadata",
    },
];

interface ThemeTypographyProps {
    className?: string;
}

export function ThemeTypography({ className }: ThemeTypographyProps) {
    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle className="text-sm font-semibold">
                    Typography
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
                {TYPOGRAPHY_SAMPLES.map((item) => (
                    <div key={item.label} className="space-y-1">
                        <div className={cn(item.className)}>
                            The quick brown fox jumps over the lazy dog
                        </div>
                        <div className="text-muted-foreground">
                            {item.label} · {item.description}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
