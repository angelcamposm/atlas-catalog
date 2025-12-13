"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreateApiWizard } from "@/components/apis";

function CreateApiContent() {
    const searchParams = useSearchParams();
    const duplicateFrom = searchParams?.get("duplicate");
    const duplicateId = duplicateFrom ? parseInt(duplicateFrom, 10) : undefined;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <CreateApiWizard
                duplicateFrom={
                    Number.isFinite(duplicateId) ? duplicateId : undefined
                }
            />
        </div>
    );
}

export default function CreateApiPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
                </div>
            }
        >
            <CreateApiContent />
        </Suspense>
    );
}
