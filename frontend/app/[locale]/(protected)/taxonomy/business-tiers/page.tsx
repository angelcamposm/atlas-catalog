"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { HiStar, HiPlus } from "react-icons/hi2";

export default function BusinessTiersPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Business Tiers"
                subtitle="Define criticality levels for your services and APIs"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Tier
                    </button>
                }
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Tier 1 - Critical */}
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                            T1
                        </span>
                        <div>
                            <h3 className="font-semibold text-red-900 dark:text-red-100">
                                Tier 1 - Critical
                            </h3>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                Mission-critical systems
                            </p>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                        24/7 support, 99.99% SLA, immediate incident response
                    </p>
                </div>

                {/* Tier 2 - Important */}
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                            T2
                        </span>
                        <div>
                            <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                                Tier 2 - Important
                            </h3>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                                Business-critical
                            </p>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-orange-600 dark:text-orange-400">
                        Business hours support, 99.9% SLA, 4h response time
                    </p>
                </div>

                {/* Tier 3 - Standard */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                            T3
                        </span>
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                Tier 3 - Standard
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Normal operations
                            </p>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                        Best effort support, 99% SLA, 24h response time
                    </p>
                </div>

                {/* Tier 4 - Low */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                            T4
                        </span>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                Tier 4 - Low
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Non-critical
                            </p>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
                        No SLA, best effort, internal tools
                    </p>
                </div>
            </div>
        </div>
    );
}
