import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PlatformList } from "@/components/platform";

export const metadata: Metadata = {
    title: "Platforms | Atlas Catalog",
    description: "Manage platforms",
};

export default async function PlatformsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Platforms
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your platforms and their configurations
                    </p>
                </div>
                <Link href={`/${locale}/platform/platforms/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Platform
                    </Button>
                </Link>
            </div>

            {/* Platform List */}
            <PlatformList />
        </div>
    );
}
