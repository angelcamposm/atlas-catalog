"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLOR_TOKENS = [
    { name: "Background", token: "--background", className: "bg-background" },
    { name: "Foreground", token: "--foreground", className: "bg-foreground" },
    { name: "Primary", token: "--primary", className: "bg-primary" },
    {
        name: "Primary FG",
        token: "--primary-foreground",
        className: "bg-primary-foreground",
    },
    { name: "Secondary", token: "--secondary", className: "bg-secondary" },
    { name: "Accent", token: "--accent", className: "bg-accent" },
    { name: "Muted", token: "--muted", className: "bg-muted" },
    { name: "Border", token: "--border", className: "bg-border" },
];

interface ThemeColorsProps {
    className?: string;
}

export function ThemeColors({ className }: ThemeColorsProps) {
    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle className="text-sm font-semibold">Colors</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs">
                {COLOR_TOKENS.map((color) => (
                    <div key={color.token} className="flex items-center gap-3">
                        <div
                            className={cn(
                                "h-8 w-8 rounded-md border border-border shadow-sm",
                                color.className
                            )}
                        />
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                                {color.name}
                            </span>
                            <span className="text-muted-foreground">
                                {color.token}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
