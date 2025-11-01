import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LinkList } from "@/components/integration";

export const metadata: Metadata = {
    title: "Integration Links | Atlas Catalog",
    description: "Manage integration links",
};

export default async function LinksPage({
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
                        Integration Links
                    </h1>
                    <p className="text-muted-foreground">
                        Manage integration links between components
                    </p>
                </div>
                <Link href={`/${locale}/integration/links/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Link
                    </Button>
                </Link>
            </div>

            {/* Link List */}
            <LinkList />
        </div>
    );
}
