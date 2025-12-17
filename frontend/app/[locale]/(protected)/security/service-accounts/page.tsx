"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { HiUserGroup, HiPlus } from "react-icons/hi2";

export default function ServiceAccountsPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Service Accounts"
                subtitle="Manage service accounts for automation and integrations"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Create Account
                    </button>
                }
            />

            <EmptyState
                icon={<HiUserGroup className="h-12 w-12" />}
                title="No service accounts"
                description="Service accounts are used by applications and automation tools to authenticate with APIs. They provide a way to track and manage non-human access."
                actionLabel="Create Service Account"
                onAction={() => console.log("Create service account")}
            />
        </div>
    );
}
