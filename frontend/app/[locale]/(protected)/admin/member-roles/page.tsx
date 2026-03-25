"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { HiUserGroup, HiPlus, HiPencil, HiTrash } from "react-icons/hi2";

const memberRoles = [
    {
        id: 1,
        name: "Owner",
        description: "Full control over the group and its resources",
        permissions: ["read", "write", "delete", "admin"],
        count: 8,
    },
    {
        id: 2,
        name: "Maintainer",
        description: "Can manage resources but not group settings",
        permissions: ["read", "write", "delete"],
        count: 12,
    },
    {
        id: 3,
        name: "Developer",
        description: "Can read and contribute to resources",
        permissions: ["read", "write"],
        count: 25,
    },
    {
        id: 4,
        name: "Viewer",
        description: "Read-only access to group resources",
        permissions: ["read"],
        count: 40,
    },
];

export default function MemberRolesPage() {
    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Member Roles"
                subtitle="Define roles and permissions for group members"
                actions={
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <HiPlus className="h-4 w-4" />
                        Add Role
                    </button>
                }
            />

            <div className="grid gap-4 md:grid-cols-2">
                {memberRoles.map((role) => (
                    <div
                        key={role.id}
                        className="rounded-lg border border-border bg-card p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <HiUserGroup className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {role.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {role.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                                    <HiPencil className="h-4 w-4" />
                                </button>
                                <button className="rounded p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30">
                                    <HiTrash className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                                {role.permissions.map((perm) => (
                                    <span
                                        key={perm}
                                        className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                                    >
                                        {perm}
                                    </span>
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {role.count} members
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
