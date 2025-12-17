"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { HiQueueList, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";

const statuses = [
    {
        id: 1,
        name: "Active",
        description: "API is live and available",
        color: "bg-green-500",
        count: 18,
    },
    {
        id: 2,
        name: "Beta",
        description: "API is in beta testing",
        color: "bg-yellow-500",
        count: 4,
    },
    {
        id: 3,
        name: "Deprecated",
        description: "API is deprecated and will be removed",
        color: "bg-orange-500",
        count: 2,
    },
    {
        id: 4,
        name: "Retired",
        description: "API has been retired",
        color: "bg-red-500",
        count: 0,
    },
    {
        id: 5,
        name: "Draft",
        description: "API is in development",
        color: "bg-gray-400",
        count: 3,
    },
];

export default function ApiStatusesPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="API Statuses"
                subtitle="Configure the lifecycle statuses for APIs in your catalog"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Status
                    </button>
                }
            />

            <div className="rounded-lg border border-border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Description
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                                APIs
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.map((status) => (
                            <tr
                                key={status.id}
                                className="border-b border-border last:border-0"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`h-3 w-3 rounded-full ${status.color}`}
                                        />
                                        <span className="font-medium">
                                            {status.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {status.description}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                        {status.count}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                                            <HiPencil className="h-4 w-4" />
                                        </button>
                                        <button className="rounded p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30">
                                            <HiTrash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
