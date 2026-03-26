import type { Metadata } from "next";
import { ApiStatsWidget } from "@/components/dashboard/widgets/ApiStatsWidget";
import { ClusterHealthWidget } from "@/components/dashboard/widgets/ClusterHealthWidget";
import { CiCdWidget } from "@/components/dashboard/widgets/CiCdWidget";
import { ComplianceWidget } from "@/components/dashboard/widgets/ComplianceWidget";
import { QuickActionsWidget } from "@/components/dashboard/widgets/QuickActionsWidget";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Dashboard - Atlas Catalog`,
        description: "Atlas Catalog Dashboard",
    };
}

export default async function DashboardPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Overview of your API catalog
                </p>
            </div>

            {/* Stats widgets grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ApiStatsWidget />
                <ClusterHealthWidget />
                <CiCdWidget />
                <ComplianceWidget />
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <QuickActionsWidget />
            </div>
        </div>
    );
}
