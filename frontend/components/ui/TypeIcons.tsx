"use client";

import { cn } from "@/lib/utils";
import {
    getClusterTypeIcon,
    getInfrastructureTypeIcon,
    getIconColorClass,
} from "@/lib/icons/infrastructure-icons";
import {
    getVendorIcon,
    getVendorIconColor,
} from "@/lib/icons/vendor-icons";

interface TypeIconProps {
    name: string;
    iconClass?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    showLabel?: boolean;
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
};

/**
 * Displays an icon for a Cluster Type
 */
export function ClusterTypeIcon({
    name,
    iconClass,
    size = "md",
    className,
    showLabel = false,
}: TypeIconProps) {
    const IconComponent = getClusterTypeIcon(name, iconClass);
    const colorClass = getIconColorClass(name);

    return (
        <span
            className={cn("inline-flex items-center gap-1.5")}
            title={name}
        >
            <IconComponent
                className={cn(sizeClasses[size], className || colorClass)}
                aria-hidden="true"
            />
            {showLabel && <span className="truncate">{name}</span>}
        </span>
    );
}

/**
 * Displays an icon for an Infrastructure Type
 */
export function InfrastructureTypeIcon({
    name,
    size = "md",
    className,
    showLabel = false,
}: Omit<TypeIconProps, "iconClass">) {
    const IconComponent = getInfrastructureTypeIcon(name);
    const colorClass = getIconColorClass(name);

    return (
        <span
            className={cn("inline-flex items-center gap-1.5")}
            title={name}
        >
            <IconComponent
                className={cn(sizeClasses[size], className || colorClass)}
                aria-hidden="true"
            />
            {showLabel && <span className="truncate">{name}</span>}
        </span>
    );
}

/**
 * Combined component that can display either type
 */
interface TypeBadgeProps {
    type: "cluster" | "infrastructure";
    name: string;
    iconClass?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    showLabel?: boolean;
    variant?: "default" | "outline" | "filled";
}

const variantClasses = {
    default: "",
    outline:
        "border border-border rounded-md px-2 py-1 bg-background hover:bg-muted/50 transition-colors",
    filled: "rounded-md px-2 py-1 bg-muted hover:bg-muted/80 transition-colors",
};

export function TypeBadge({
    type,
    name,
    iconClass,
    size = "md",
    className,
    showLabel = true,
    variant = "default",
}: TypeBadgeProps) {
    const IconComponent =
        type === "cluster"
            ? getClusterTypeIcon(name, iconClass)
            : getInfrastructureTypeIcon(name);
    const colorClass = getIconColorClass(name);

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5",
                variantClasses[variant],
                className
            )}
            title={name}
        >
            <IconComponent
                className={cn(sizeClasses[size], colorClass)}
                aria-hidden="true"
            />
            {showLabel && (
                <span className="truncate text-sm font-medium">{name}</span>
            )}
        </span>
    );
}

/**
 * Displays an icon for a Vendor
 * Uses react-icons based on vendor name patterns
 */
interface VendorIconProps {
    name: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    showLabel?: boolean;
}

export function VendorIcon({
    name,
    size = "md",
    className,
    showLabel = false,
}: VendorIconProps) {
    const IconComponent = getVendorIcon(name);
    const colorClass = getVendorIconColor(name);

    return (
        <span className={cn("inline-flex items-center gap-1.5")} title={name}>
            <IconComponent
                className={cn(sizeClasses[size], className || colorClass)}
                aria-hidden="true"
            />
            {showLabel && <span className="truncate">{name}</span>}
        </span>
    );
}
