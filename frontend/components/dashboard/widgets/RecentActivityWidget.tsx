"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    HiOutlineClock,
    HiOutlineCubeTransparent,
    HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { apisApi, componentsApi } from "@/lib/api";
import type { Api, Component } from "@/types/api";

/**
 * Maximum number of merged activity entries shown.
 */
const MAX_ITEMS = 5;

/**
 * Unified activity entry shown in the timeline.
 */
interface ActivityEntry {
    /** Stable key built from kind + id. */
    key: string;
    /** Kind of entity. */
    kind: "api" | "component";
    /** Display label. */
    label: string;
    /** Detail page URL (relative to current locale). */
    href: string;
    /** ISO timestamp used for sorting & display. */
    updatedAt: string;
}

function apiToEntry(api: Api): ActivityEntry {
    return {
        key: `api-${api.id}`,
        kind: "api",
        label: api.display_name?.trim() || api.name,
        href: `/apis/${api.id}`,
        updatedAt: api.updated_at,
    };
}

function componentToEntry(component: Component): ActivityEntry {
    const slug = component.slug || String(component.id);
    return {
        key: `component-${component.id}`,
        kind: "component",
        label: component.display_name?.trim() || component.name,
        href: `/components/${slug}`,
        updatedAt: component.updated_at,
    };
}

function formatRelative(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString();
}

/**
 * Dashboard widget that shows the most recently updated APIs and
 * Components as a unified timeline.
 *
 * Loads data from the backend in parallel; failures of one source do not
 * block the other.
 */
export function RecentActivityWidget() {
    const [entries, setEntries] = useState<ActivityEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = {
            sort_by: "updated_at",
            sort_order: "desc" as const,
            per_page: MAX_ITEMS,
        };

        Promise.allSettled([
            apisApi.getAll(params),
            componentsApi.getAll(params),
        ])
            .then(([apisResult, componentsResult]) => {
                const merged: ActivityEntry[] = [];

                if (apisResult.status === "fulfilled") {
                    merged.push(...apisResult.value.data.map(apiToEntry));
                }
                if (componentsResult.status === "fulfilled") {
                    merged.push(
                        ...componentsResult.value.data.map(componentToEntry),
                    );
                }

                merged.sort(
                    (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime(),
                );

                setEntries(merged.slice(0, MAX_ITEMS));
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl border bg-card p-6 animate-pulse">
                <div className="h-4 w-32 bg-muted rounded mb-4" />
                <div className="space-y-3">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-5/6 bg-muted rounded" />
                    <div className="h-3 w-4/6 bg-muted rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <HiOutlineClock className="w-4 h-4" />
                <span>Recent Activity</span>
            </div>

            {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No recent activity
                </p>
            ) : (
                <ul className="flex flex-col divide-y divide-border">
                    {entries.map((entry) => (
                        <li
                            key={entry.key}
                            data-testid="recent-activity-item"
                            className="py-2 first:pt-0 last:pb-0"
                        >
                            <Link
                                href={entry.href}
                                className="flex items-center gap-3 text-sm hover:bg-muted/40 rounded-md -mx-2 px-2 py-1 transition-colors"
                            >
                                <span className="shrink-0 text-muted-foreground">
                                    {entry.kind === "api" ? (
                                        <HiOutlineGlobeAlt className="w-4 h-4" />
                                    ) : (
                                        <HiOutlineCubeTransparent className="w-4 h-4" />
                                    )}
                                </span>
                                <span className="flex-1 truncate font-medium">
                                    {entry.label}
                                </span>
                                <span className="text-xs text-muted-foreground shrink-0">
                                    {formatRelative(entry.updatedAt)}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
