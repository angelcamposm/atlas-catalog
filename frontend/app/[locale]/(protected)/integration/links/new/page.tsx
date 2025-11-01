"use client";
import { use } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateLinkForm } from "@/components/integration";

export default function NewLinkPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = use(params);
    const router = useRouter();

    const handleSuccess = () => {
        router.push(`/${locale}/integration/links`);
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/${locale}/integration/links`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        New Integration Link
                    </h1>
                    <p className="text-muted-foreground">
                        Create a new integration link
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl">
                <CreateLinkForm
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
