"use client";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface TagItem {
    label: string;
    variant?: "default" | "secondary" | "outline";
}

interface TagListProps {
    tags: TagItem[];
    className?: string;
}

export function TagList({ tags, className }: TagListProps) {
    if (!tags.length) return null;

    return (
        <div
            className={cn(
                "flex flex-wrap gap-2 text-xs text-muted-foreground",
                className
            )}
        >
            {tags.map((tag) => (
                <Badge
                    key={tag.label}
                    variant={tag.variant ?? "outline"}
                    className="rounded-full px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide"
                >
                    {tag.label}
                </Badge>
            ))}
        </div>
    );
}
