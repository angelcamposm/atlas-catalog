"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SPACING_TOKENS = [
    { name: "XS", token: "--spacing-xs", value: "0.5rem" },
    { name: "SM", token: "--spacing-sm", value: "0.8125rem" },
    { name: "MD", token: "--spacing-md", value: "1.3125rem" },
    { name: "LG", token: "--spacing-lg", value: "2.125rem" },
    { name: "XL", token: "--spacing-xl", value: "3.4375rem" },
    { name: "2XL", token: "--spacing-2xl", value: "5.5625rem" },
];

interface ThemeSpacingProps {
    className?: string;
}

export function ThemeSpacing({ className }: ThemeSpacingProps) {
    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle className="text-sm font-semibold">Spacing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
                {SPACING_TOKENS.map((spacing) => (
                    <div
                        key={spacing.token}
                        className="flex items-center gap-3"
                    >
                        <div className="flex w-24 items-center">
                            <div className="h-1 rounded-full bg-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                                {spacing.name}
                            </span>
                            <span className="text-muted-foreground">
                                {spacing.token} · {spacing.value}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
