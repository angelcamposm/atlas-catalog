/**
 * User detail card component showing full user information
 *
 * @example
 * <UserDetail user={user} />
 */

import React from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import type { User } from "@/types/api";

interface UserDetailProps {
    /** The user to display */
    user: User;
}

/**
 * Card showing detailed information about a single user including
 * name, email, status, and email verification state.
 */
export function UserDetail({ user }: UserDetailProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            {/* Avatar + Name header */}
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {(user.name ?? "?").charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-xl font-semibold">
                        {user.name ?? "Unknown"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {user.email}
                    </p>
                </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Status
                    </p>
                    <Badge variant={user.is_enabled ? "success" : "secondary"}>
                        {user.is_enabled ? "Active" : "Inactive"}
                    </Badge>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Email Verification
                    </p>
                    <div className="flex items-center gap-2">
                        {user.email_verified_at ? (
                            <>
                                <HiCheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Verified</span>
                            </>
                        ) : (
                            <>
                                <HiXCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Not verified
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Member since
                    </p>
                    <p className="text-sm">{formatDate(user.created_at)}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Last updated
                    </p>
                    <p className="text-sm">{formatDate(user.updated_at)}</p>
                </div>
            </div>
        </div>
    );
}
