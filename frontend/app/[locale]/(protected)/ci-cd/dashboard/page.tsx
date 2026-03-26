import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CiCdOverview } from "@/components/ci-cd/CiCdOverview";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `CI/CD Dashboard - Atlas Catalog`,
        description: "CI/CD pipeline overview with recent runs and deployments",
    };
}

export default async function CICDDashboardPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="CI/CD Dashboard"
                subtitle="Monitor your pipelines, workflow runs, and deployments"
            />
            <CiCdOverview />
        </div>
    );
}
