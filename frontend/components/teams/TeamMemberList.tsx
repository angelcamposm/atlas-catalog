"use client";

import React from "react";
import {
    HiOutlineEnvelope,
    HiOutlineUserGroup,
} from "react-icons/hi2";
import type { User } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-amber-500",
];

interface TeamMemberListProps {
    /** List of team members to display */
    members: User[];
    /** Optional callback when a member row is clicked */
    onViewMember?: (id: number) => void;
}

/**
 * Reusable list component for displaying team members (User[]).
 *
 * Shows avatar initials, name, email and active/inactive badge.
 * Displays an empty state message when the list is empty.
 *
 * @example
 * <TeamMemberList members={members} onViewMember={(id) => router.push(`/users/${id}`)} />
 */
export function TeamMemberList({ members, onViewMember }: TeamMemberListProps) {
    if (members.length === 0) {
        return (
            <div className="text-center py-6">
                <HiOutlineUserGroup className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                    No hay miembros asignados
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {/* Header with count */}
            <div className="flex items-center gap-2 mb-3">
                <HiOutlineUserGroup className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                    Miembros
                </span>
                <Badge variant="secondary">{members.length}</Badge>
            </div>

            {/* Member rows */}
            {members.map((member) => (
                <div
                    key={member.id}
                    className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                        onViewMember && "cursor-pointer hover:bg-muted/50",
                    )}
                    onClick={() => onViewMember?.(member.id)}
                >
                    {/* Avatar */}
                    <div
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full text-white font-semibold shrink-0",
                            AVATAR_COLORS[member.id % AVATAR_COLORS.length],
                        )}
                    >
                        {member.name ? member.name.charAt(0).toUpperCase() : "?"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                            {member.name || member.email || `Usuario ${member.id}`}
                        </p>
                        {member.email && (
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                <HiOutlineEnvelope className="h-3 w-3 shrink-0" />
                                {member.email}
                            </p>
                        )}
                    </div>

                    {/* Status badge */}
                    <Badge variant={member.is_enabled ? "success" : "secondary"}>
                        {member.is_enabled ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
            ))}
        </div>
    );
}
