"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { HiRectangleGroup, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";

const categories = [
    { id: 1, name: "Core", description: "Core platform APIs", count: 8 },
    {
        id: 2,
        name: "Integration",
        description: "Integration and middleware APIs",
        count: 5,
    },
    { id: 3, name: "Data", description: "Data and analytics APIs", count: 4 },
    {
        id: 4,
        name: "Security",
        description: "Security and identity APIs",
        count: 3,
    },
    {
        id: 5,
        name: "Infrastructure",
        description: "Infrastructure and DevOps APIs",
        count: 2,
    },
    {
        id: 6,
        name: "External",
        description: "Third-party and partner APIs",
        count: 2,
    },
];

export default function ApiCategoriesPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="API Categories"
                subtitle="Organize your APIs into logical categories"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Category
                    </button>
                }
            />

            <div className="rounded-lg border border-border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Category
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
                        {categories.map((category) => (
                            <tr
                                key={category.id}
                                className="border-b border-border last:border-0"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <HiRectangleGroup className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">
                                            {category.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {category.description}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                        {category.count}
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
