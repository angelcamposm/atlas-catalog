"use client";

import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import type { ReactNode } from "react";

interface ProtectedLayoutProps {
    children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const params = useParams();
    const locale = (params?.locale as string) || "es";

    return <DashboardLayout locale={locale}>{children}</DashboardLayout>;
}
