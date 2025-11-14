"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DIMENSION_TOKENS = [
    { name: "Navbar Height", token: "--navbar-height" },
    { name: "Sidebar Width", token: "--sidebar-width" },
    { name: "Sidebar Collapsed", token: "--sidebar-width-collapsed" },
    { name: "Radius", token: "--radius" },
    { name: "Radius LG", token: "--radius-lg" },
    { name: "Radius XL", token: "--radius-xl" },
];

interface ThemeDimensionsProps {
    className?: string;
}

export function ThemeDimensions({ className }: ThemeDimensionsProps) {
    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle className="text-sm font-semibold">
                    Dimensions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
                {DIMENSION_TOKENS.map((dimension) => (
                    <div
                        key={dimension.token}
                        className="flex items-center justify-between gap-3"
                    >
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                                {dimension.name}
                            </span>
                            <span className="text-muted-foreground">
                                {dimension.token}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
