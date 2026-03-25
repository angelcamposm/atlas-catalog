"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { HiKey, HiPlus } from "react-icons/hi2";

export default function AuthMethodsPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Authentication Methods"
                subtitle="Configure authentication methods available for your APIs"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Method
                    </button>
                }
            />

            <EmptyState
                icon={<HiKey className="h-12 w-12" />}
                title="No authentication methods"
                description="Authentication methods define how clients can authenticate with your APIs. Common methods include OAuth 2.0, API Keys, JWT tokens, and mTLS."
                actionLabel="Add Auth Method"
                onAction={() => console.log("Add auth method")}
            />
        </div>
    );
}
