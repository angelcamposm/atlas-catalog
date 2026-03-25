"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

interface ProtectedLayoutProps {
    children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const params = useParams();
    const locale = (params?.locale as string) || "es";
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace(`/${locale}/login`);
        }
    }, [isAuthenticated, loading, locale, router]);

    // Show nothing while checking auth status
    if (loading || !isAuthenticated) return null;

    return <DashboardLayout locale={locale}>{children}</DashboardLayout>;
}
