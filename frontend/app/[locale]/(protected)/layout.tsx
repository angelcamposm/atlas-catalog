import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthProvider } from "@/contexts/AuthContext";
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

    return (
        <AuthProvider>
            <DashboardLayout locale={locale}>{children}</DashboardLayout>
        </AuthProvider>
    );
}
