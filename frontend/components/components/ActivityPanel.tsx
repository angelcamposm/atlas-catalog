"use client";

import React from "react";
import ActivityFiltersBar from "@/components/components/ActivityFiltersBar";
import ActivityTimeline, {
    ActivityItem,
} from "@/components/components/ActivityTimeline";

interface Filters {
    query?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
}

interface ActivityPanelProps {
    className?: string;
}

// Use deterministic mock timestamps (UTC) to avoid SSR/CSR hydration mismatches
const BASE = new Date("2025-11-13T19:38:05Z");
const MOCK: ActivityItem[] = [
    {
        id: "1",
        type: "deploy",
        message: "Deploy v1.2.0 to production",
        timestamp: new Date(BASE.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: "2",
        type: "update",
        message: "Updated API schema for /users endpoint",
        timestamp: new Date(BASE.getTime() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        id: "3",
        type: "alert",
        message: "Health check failed for instance a-3",
        timestamp: new Date(BASE.getTime() - 1000 * 60 * 30).toISOString(),
    },
    {
        id: "4",
        type: "deploy",
        message: "Canary deploy started for v1.3.0",
        timestamp: new Date(BASE.getTime() - 1000 * 60 * 10).toISOString(),
    },
];

export function ActivityPanel({ className }: ActivityPanelProps) {
    const [filters, setFilters] = React.useState<Filters>({});

    return (
        <div className={className}>
            <ActivityFiltersBar
                initial={filters}
                onChange={(f) => setFilters(f)}
                className="mb-4"
            />

            <ActivityTimeline
                items={MOCK}
                query={filters.query}
                type={filters.type}
                dateFrom={filters.dateFrom}
                dateTo={filters.dateTo}
            />
        </div>
    );
}

export default ActivityPanel;
