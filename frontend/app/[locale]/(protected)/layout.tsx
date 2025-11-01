import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import type { ReactNode } from "react";

interface ProtectedLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function ProtectedLayout({
    children,
    params,
}: ProtectedLayoutProps) {
    const { locale } = await params;

    return <DashboardLayout locale={locale}>{children}</DashboardLayout>;
}
