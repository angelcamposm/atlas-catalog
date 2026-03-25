"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { HiLink, HiPlus } from "react-icons/hi2";

export default function LinksPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Links"
                subtitle="Manage external links to documentation, dashboards, and related resources"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Link
                    </button>
                }
            />

            <EmptyState
                icon={<HiLink className="h-12 w-12" />}
                title="No links yet"
                description="Links connect your catalog entities to external resources like documentation sites, monitoring dashboards, CI/CD pipelines, and issue trackers."
                actionLabel="Add First Link"
                onAction={() => console.log("Add link")}
            />
        </div>
    );
}
