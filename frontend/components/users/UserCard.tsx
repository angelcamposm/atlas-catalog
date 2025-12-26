"use client";

import { HiOutlineEnvelope, HiOutlineUser } from "react-icons/hi2";
import type { User } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface UserCardProps {
    user: User;
    role?: string;
    onClick?: () => void;
    compact?: boolean;
}

export function UserCard({
    user,
    role,
    onClick,
    compact = false,
}: UserCardProps) {
    const getAvatarColor = (id: number) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-cyan-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-amber-500",
        ];
        return colors[id % colors.length];
    };

    const content = (
        <div
            className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                onClick && "cursor-pointer hover:bg-muted/50"
            )}
            onClick={onClick}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "flex items-center justify-center rounded-full text-white font-semibold shrink-0",
                    getAvatarColor(user.id),
                    compact ? "h-8 w-8 text-sm" : "h-10 w-10"
                )}
            >
                {user.name ? (
                    user.name.charAt(0).toUpperCase()
                ) : (
                    <HiOutlineUser className="h-4 w-4" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p
                        className={cn(
                            "font-medium truncate",
                            compact && "text-sm"
                        )}
                    >
                        {user.name || `Usuario ${user.id}`}
                    </p>
                    {user.is_enabled === false && (
                        <Badge variant="secondary" className="text-xs">
                            Inactivo
                        </Badge>
                    )}
                </div>
                {user.email && (
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <HiOutlineEnvelope className="h-3 w-3 shrink-0" />
                        {user.email}
                    </p>
                )}
            </div>

            {/* Role Badge */}
            {role && (
                <Badge variant="secondary" className="shrink-0">
                    {role}
                </Badge>
            )}
        </div>
    );

    // If we have a locale and onClick is not provided, make it a link to profile
    // For now we don't have user detail pages, so just return the content
    return content;
}

interface UserAvatarProps {
    user: User;
    size?: "sm" | "md" | "lg";
    showName?: boolean;
}

export function UserAvatar({
    user,
    size = "md",
    showName = false,
}: UserAvatarProps) {
    const getAvatarColor = (id: number) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-cyan-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-amber-500",
        ];
        return colors[id % colors.length];
    };

    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
    };

    return (
        <div className="flex items-center gap-2">
            <div
                className={cn(
                    "flex items-center justify-center rounded-full text-white font-semibold",
                    getAvatarColor(user.id),
                    sizeClasses[size]
                )}
                title={user.name || user.email || `Usuario ${user.id}`}
            >
                {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            {showName && (
                <span className="text-sm truncate">
                    {user.name || user.email || `Usuario ${user.id}`}
                </span>
            )}
        </div>
    );
}

interface UserAvatarStackProps {
    users: User[];
    max?: number;
    size?: "sm" | "md" | "lg";
}

export function UserAvatarStack({
    users,
    max = 5,
    size = "md",
}: UserAvatarStackProps) {
    const visibleUsers = users.slice(0, max);
    const remainingCount = users.length - max;

    const getAvatarColor = (id: number) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-cyan-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-amber-500",
        ];
        return colors[id % colors.length];
    };

    const sizeClasses = {
        sm: "h-6 w-6 text-xs -ml-2 first:ml-0",
        md: "h-8 w-8 text-sm -ml-3 first:ml-0",
        lg: "h-10 w-10 text-base -ml-4 first:ml-0",
    };

    return (
        <div className="flex items-center">
            {visibleUsers.map((user) => (
                <div
                    key={user.id}
                    className={cn(
                        "flex items-center justify-center rounded-full text-white font-semibold border-2 border-background",
                        getAvatarColor(user.id),
                        sizeClasses[size]
                    )}
                    title={user.name || user.email || `Usuario ${user.id}`}
                >
                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={cn(
                        "flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold border-2 border-background",
                        sizeClasses[size]
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}

export default UserCard;
