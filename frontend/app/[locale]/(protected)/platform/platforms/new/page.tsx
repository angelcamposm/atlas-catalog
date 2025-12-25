"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreatePlatformForm } from "@/components/platform";

export default function NewPlatformPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || "en";

    const handleSuccess = () => {
        router.push(`/${locale}/platform/platforms`);
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/${locale}/platform/platforms`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        New Platform
                    </h1>
                    <p className="text-muted-foreground">
                        Create a new platform
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-2xl">
                <CreatePlatformForm
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
