"use client";

/**
 * Page-level toolbar with search, filter slots, action buttons, and results count.
 *
 * @example
 * <Toolbar
 *   searchPlaceholder="Search components..."
 *   searchValue={search}
 *   onSearch={setSearch}
 *   totalResults={total}
 *   actions={<Button onClick={onCreate}>New</Button>}
 * >
 *   <Select value={tier} onValueChange={setTier}>...</Select>
 * </Toolbar>
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ToolbarProps {
    /** Placeholder text for the search input */
    searchPlaceholder?: string;
    /** Controlled value for the search input */
    searchValue?: string;
    /** Called on every keystroke in the search input */
    onSearch?: (value: string) => void;
    /** Filter controls rendered between search and actions */
    children?: React.ReactNode;
    /** Action buttons rendered at the trailing end */
    actions?: React.ReactNode;
    /** Displays "N results" near the search box */
    totalResults?: number;
    className?: string;
}

export function Toolbar({
    searchPlaceholder = "Search…",
    searchValue,
    onSearch,
    children,
    actions,
    totalResults,
    className,
}: ToolbarProps) {
    return (
        <div className={cn("flex flex-wrap items-center gap-3", className)}>
            {/* ── Search ── */}
            <div className="relative flex items-center">
                <Input
                    role="searchbox"
                    type="search"
                    placeholder={searchPlaceholder}
                    {...(searchValue !== undefined
                        ? { value: searchValue }
                        : {})}
                    onChange={(e) => onSearch?.(e.target.value)}
                    className="h-9 w-64"
                />
                {totalResults !== undefined && (
                    <span className="ml-2 text-sm text-muted-foreground whitespace-nowrap">
                        {totalResults} results
                    </span>
                )}
            </div>

            {/* ── Filters slot ── */}
            {children}

            {/* ── Actions slot ── */}
            {actions && (
                <div
                    data-slot="toolbar-actions"
                    className="ml-auto flex items-center gap-2"
                >
                    {actions}
                </div>
            )}
        </div>
    );
}
