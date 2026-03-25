"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
    id: string;
    label: string;
    href?: string;
}

interface ComponentSectionNavProps {
    items: NavItem[];
    initial?: string;
    className?: string;
    onChange?: (id: string) => void;
}

export function ComponentSectionNav({
    items,
    initial,
    className,
    onChange,
}: ComponentSectionNavProps) {
    const [active, setActive] = useState<string>(initial ?? items[0]?.id ?? "");

    function handleClick(id: string) {
        setActive(id);
        onChange?.(id);
    }

    return (
        <nav className={cn("w-full", className)} aria-label="Secciones">
            <div className="rounded-full border border-border bg-card/80 px-1 py-1">
                <ul className="flex gap-1 overflow-auto">
                    {items.map((it) => {
                        const isActive = it.id === active;
                        return (
                            <li key={it.id}>
                                <button
                                    onClick={() => handleClick(it.id)}
                                    className={cn(
                                        "rounded-full px-3 py-1 text-xs font-medium transition",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-muted/60"
                                    )}
                                >
                                    {it.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
