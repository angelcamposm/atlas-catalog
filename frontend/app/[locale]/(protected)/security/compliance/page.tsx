"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { HiClipboardDocumentCheck, HiPlus } from "react-icons/hi2";

export default function CompliancePage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Compliance Standards"
                subtitle="Track compliance requirements across your services"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Standard
                    </button>
                }
            />

            <EmptyState
                icon={<HiClipboardDocumentCheck className="h-12 w-12" />}
                title="No compliance standards"
                description="Compliance standards help track regulatory requirements like SOC 2, GDPR, HIPAA, PCI-DSS, and ISO 27001 across your services and APIs."
                actionLabel="Add Standard"
                onAction={() => console.log("Add standard")}
            />
        </div>
    );
}
