"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { HiShieldCheck, HiPlus } from "react-icons/hi2";

export default function AccessPoliciesPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Access Policies"
                subtitle="Define and manage API access policies"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Policy
                    </button>
                }
            />

            <EmptyState
                icon={<HiShieldCheck className="h-12 w-12" />}
                title="No access policies"
                description="Access policies control who can access your APIs and under what conditions. Define policies like 'Internal Only', 'Partner Access', or 'Public'."
                actionLabel="Create Policy"
                onAction={() => console.log("Create policy")}
            />
        </div>
    );
}
