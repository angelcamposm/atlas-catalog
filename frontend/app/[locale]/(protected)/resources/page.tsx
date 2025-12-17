"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { HiCircleStack, HiPlus } from "react-icons/hi2";

export default function ResourcesPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Resources"
                subtitle="Manage databases, caches, queues, and other infrastructure resources"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Resource
                    </button>
                }
            />

            <EmptyState
                icon={<HiCircleStack className="h-12 w-12" />}
                title="No resources yet"
                description="Resources represent infrastructure components like databases, caches, message queues, and storage systems that your APIs and services depend on."
                actionLabel="Add First Resource"
                onAction={() => console.log("Add resource")}
            />
        </div>
    );
}
