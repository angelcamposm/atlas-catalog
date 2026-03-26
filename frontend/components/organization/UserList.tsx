/**
 * User list component for displaying a table of users
 *
 * @example
 * <UserList users={users} onViewDetail={(id) => router.push(`/users/${id}`)} />
 */

import React from "react";
import { HiUsers, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import type { User } from "@/types/api";

interface UserListProps {
    /** List of users to display */
    users: User[];
    /** Optional callback when a user row is clicked */
    onViewDetail?: (id: number) => void;
}

/**
 * Table component that renders a list of users with avatar, email, status and
 * email verification state. Shows an empty state when the list is empty.
 */
export function UserList({ users, onViewDetail }: UserListProps) {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <HiUsers className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4">No users found</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border bg-card">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            User
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Verified
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => onViewDetail?.(user.id)}
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                        {(user.name ?? "?")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <span className="font-medium">
                                        {user.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                {user.email}
                            </td>
                            <td className="px-4 py-3">
                                <Badge
                                    variant={
                                        user.is_enabled ? "success" : "secondary"
                                    }
                                >
                                    {user.is_enabled ? "Active" : "Inactive"}
                                </Badge>
                            </td>
                            <td className="px-4 py-3">
                                {user.email_verified_at ? (
                                    <HiCheckCircle
                                        data-testid={`email-verified-${user.id}`}
                                        className="h-5 w-5 text-green-500"
                                    />
                                ) : (
                                    <HiXCircle
                                        data-testid={`email-unverified-${user.id}`}
                                        className="h-5 w-5 text-muted-foreground"
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
