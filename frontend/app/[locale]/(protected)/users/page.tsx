"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { HiUsers, HiMagnifyingGlass, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/Badge";
import { usersApi } from "@/lib/api";
import type { User } from "@/types/api";

export default function UsersPage() {
    const params = useParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const locale = (params.locale as string) || "en";

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await usersApi.getAll(page);
            setUsers(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading users");
            console.error("Error loading users:", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filteredUsers = users.filter(
        (u) =>
            (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (u.email ?? "").toLowerCase().includes(search.toLowerCase())
    );

    if (loading && users.length === 0) {
        return (
            <div className="container mx-auto space-y-6 px-6 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="mt-2 h-4 w-96" />
                    </div>
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-6 py-6">
            <PageHeader
                title="Users"
                subtitle="Manage users and their access to the platform"
            />

            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setError(null)}
                        className="mt-2"
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-sm">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

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
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-12 text-center text-muted-foreground"
                                >
                                    <HiUsers className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <p className="mt-4">No users found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-border last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                                {(user.name ?? "?").charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={user.is_enabled ? "success" : "secondary"}
                                        >
                                            {user.is_enabled ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.email_verified_at ? (
                                            <HiCheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <HiXCircle className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
