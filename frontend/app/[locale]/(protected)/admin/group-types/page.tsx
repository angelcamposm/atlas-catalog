"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { HiUsers, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";

const groupTypes = [
    {
        id: 1,
        name: "Team",
        description: "Product or feature teams",
        icon: "👥",
        count: 5,
    },
    {
        id: 2,
        name: "Squad",
        description: "Cross-functional squads",
        icon: "🎯",
        count: 3,
    },
    {
        id: 3,
        name: "Chapter",
        description: "Skill-based chapters",
        icon: "📚",
        count: 4,
    },
    {
        id: 4,
        name: "Guild",
        description: "Interest-based guilds",
        icon: "🏛️",
        count: 2,
    },
    {
        id: 5,
        name: "Platform",
        description: "Platform engineering teams",
        icon: "⚙️",
        count: 1,
    },
];

export default function GroupTypesPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Group Types"
                subtitle="Define the types of groups in your organization"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Type
                    </button>
                }
            />

            <div className="rounded-lg border border-border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Type
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Description
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                                Groups
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupTypes.map((type) => (
                            <tr
                                key={type.id}
                                className="border-b border-border last:border-0"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">
                                            {type.icon}
                                        </span>
                                        <span className="font-medium">
                                            {type.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {type.description}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                        {type.count}
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
