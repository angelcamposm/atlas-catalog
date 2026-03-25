"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { HiCodeBracket, HiPlus } from "react-icons/hi2";

export default function ProgrammingLanguagesPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Programming Languages"
                subtitle="Manage the programming languages used across your organization"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Language
                    </button>
                }
            />

            <EmptyState
                icon={<HiCodeBracket className="h-12 w-12" />}
                title="No languages configured"
                description="Programming languages help categorize your services and APIs by the technology stack they use. Common examples include Java, Python, TypeScript, Go, and Rust."
                actionLabel="Add First Language"
                onAction={() => console.log("Add language")}
            />
        </div>
    );
}
