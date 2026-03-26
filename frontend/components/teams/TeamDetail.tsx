"use client";

import React from "react";
import {
    HiOutlineEnvelope,
    HiOutlineTag,
    HiOutlineUserGroup,
} from "react-icons/hi2";
import type { Group } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const ICON_COLORS: Record<string, string> = {
    server: "bg-blue-500",
    shield: "bg-purple-500",
    "credit-card": "bg-green-500",
    "shopping-cart": "bg-orange-500",
    users: "bg-indigo-500",
    "chart-bar": "bg-cyan-500",
    bell: "bg-yellow-500",
    archive: "bg-red-500",
    default: "bg-gray-500",
};

const getIconColor = (icon: string | null | undefined): string =>
    ICON_COLORS[icon ?? "default"] ?? ICON_COLORS.default;

interface TeamDetailProps {
    /** The team/group to display */
    team: Group;
    /** Optional pre-loaded member count to display */
    membersCount?: number;
}

/**
 * Summary card for a team/group showing its key information.
 *
 * Displays avatar, name/label, description, email and optional member count.
 *
 * @example
 * <TeamDetail team={team} membersCount={members.length} />
 */
export function TeamDetail({ team, membersCount }: TeamDetailProps) {
    const displayName = team.label || team.name;
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div
                        className={cn(
                            "flex h-20 w-20 items-center justify-center rounded-xl text-white shrink-0",
                            getIconColor(team.icon),
                        )}
                    >
                        <span className="text-4xl font-bold">{initial}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-3">
                        <div>
                            <h2 className="text-2xl font-bold truncate">
                                {displayName}
                            </h2>
                            <p className="text-sm text-muted-foreground font-mono">
                                @{team.name}
                            </p>
                            {team.description && (
                                <p className="mt-2 text-muted-foreground">
                                    {team.description}
                                </p>
                            )}
                        </div>

                        {/* Metadata grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <HiOutlineTag className="h-4 w-4 shrink-0" />
                                <span className="font-medium">ID:</span>
                                <span className="font-mono">{team.id}</span>
                            </div>

                            {team.email && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <HiOutlineEnvelope className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                        {team.email}
                                    </span>
                                </div>
                            )}

                            {membersCount !== undefined && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <HiOutlineUserGroup className="h-4 w-4 shrink-0" />
                                    <span className="font-medium">
                                        Miembros:
                                    </span>
                                    <Badge variant="secondary">
                                        {membersCount}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
