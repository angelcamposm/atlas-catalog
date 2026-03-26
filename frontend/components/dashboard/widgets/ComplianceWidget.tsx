"use client";

import { useEffect, useState } from "react";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { complianceApi } from "@/lib/api";
import type { ComplianceStandard } from "@/types/api";

/**
 * Dashboard widget showing total number of compliance standards.
 */
export function ComplianceWidget() {
    const [standards, setStandards] = useState<ComplianceStandard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        complianceApi.standards
            .getAll()
            .then((res) => setStandards(res.data))
            .catch(() => setStandards([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl border bg-card p-6 animate-pulse">
                <div className="h-4 w-24 bg-muted rounded mb-4" />
                <div className="h-8 w-12 bg-muted rounded" />
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <HiOutlineShieldCheck className="w-4 h-4" />
                <span>Compliance Standards</span>
            </div>
            <p className="text-3xl font-bold">{standards.length}</p>
            <p className="text-xs text-muted-foreground">active standards</p>
        </div>
    );
}
