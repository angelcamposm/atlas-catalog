import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NodeList } from "@/components/infrastructure";

export const metadata: Metadata = {
    title: "Nodes | Atlas Catalog",
    description: "Manage infrastructure nodes",
};

export default function NodesPage({ params }: { params: { locale: string } }) {
    return (
        <div className="container mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nodes</h1>
                    <p className="text-muted-foreground">
                        Manage your infrastructure nodes and their configurations
                    </p>
                </div>
                <Link href={`/${params.locale}/infrastructure/nodes/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Node
                    </Button>
                </Link>
            </div>

            {/* Node List */}
            <NodeList />
        </div>
    );
}
