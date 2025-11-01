"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreatePlatformForm } from "@/components/platform";

export default function NewPlatformPage({
    params,
}: {
    params: { locale: string };
}) {
    const router = useRouter();

    const handleSuccess = () => {
        router.push(`/${params.locale}/platform/platforms`);
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/${params.locale}/platform/platforms`}>
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
