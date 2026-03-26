"use client";

/**
 * CommandPalette — Global search overlay triggered by Cmd+K.
 *
 * Searches APIs and Clusters in real-time via backend.
 * Groups results by category. Keyboard-navigable.
 *
 * @example
 * <CommandPalette isOpen={open} onClose={() => setOpen(false)} locale="en" />
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { HiMagnifyingGlass, HiXMark, HiArrowRight } from "react-icons/hi2";
import { useGlobalSearch, type SearchResult } from "@/hooks/useGlobalSearch";

export interface CommandPaletteProps {
    /** Whether the palette is visible */
    isOpen: boolean;
    /** Called when the user requests to close the palette */
    onClose: () => void;
    /** Current locale for navigation hrefs */
    locale: string;
}

export function CommandPalette({
    isOpen,
    onClose,
    locale,
}: CommandPaletteProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { results, isLoading } = useGlobalSearch(query, locale);

    // Group results by category
    const grouped = results.reduce<Record<string, SearchResult[]>>(
        (acc, result) => {
            const cat = result.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(result);
            return acc;
        },
        {},
    );

    const flatResults = Object.values(grouped).flat();

    // Focus input when opened; reset state when closed
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            // Small delay to allow render
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [isOpen]);

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [results]);

    const navigateTo = useCallback(
        (item: SearchResult) => {
            router.push(item.href);
            onClose();
        },
        [router, onClose],
    );

    // Keyboard handlers at document level (for Escape)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Keyboard navigation in input
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && flatResults[selectedIndex]) {
            e.preventDefault();
            navigateTo(flatResults[selectedIndex]);
        }
    };

    if (!isOpen) return null;

    const hasQuery = query.trim().length >= 2;
    const hasResults = flatResults.length > 0;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
        >
            {/* Backdrop */}
            <div
                data-testid="palette-backdrop"
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-xl rounded-xl border border-border bg-background shadow-2xl">
                {/* Search input row */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <HiMagnifyingGlass className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        role="combobox"
                        aria-expanded={hasResults}
                        aria-autocomplete="list"
                        placeholder="Search APIs, clusters..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                    />
                    {isLoading && (
                        <span
                            data-testid="search-loading"
                            className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
                        />
                    )}
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Close"
                    >
                        <HiXMark className="h-4 w-4" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {hasQuery && !isLoading && !hasResults && (
                        <p
                            data-testid="no-results"
                            className="px-4 py-8 text-center text-sm text-muted-foreground"
                        >
                            No results for &ldquo;{query}&rdquo;
                        </p>
                    )}

                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category}>
                            <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {category}
                            </p>
                            {items.map((item, idx) => {
                                const globalIdx = flatResults.indexOf(item);
                                const isSelected = globalIdx === selectedIndex;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => navigateTo(item)}
                                        className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-accent ${
                                            isSelected ? "bg-accent" : ""
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {item.title}
                                            </p>
                                            {item.subtitle && (
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {item.subtitle}
                                                </p>
                                            )}
                                        </div>
                                        <HiArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    </button>
                                );
                            })}
                        </div>
                    ))}

                    {/* Empty state — no query yet */}
                    {!hasQuery && !isLoading && (
                        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                            Type at least 2 characters to search
                        </p>
                    )}
                </div>

                {/* Footer hint */}
                <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-xs text-muted-foreground">
                    <span>
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
                            ↑↓
                        </kbd>{" "}
                        navigate
                    </span>
                    <span>
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
                            ↵
                        </kbd>{" "}
                        open
                    </span>
                    <span>
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
                            esc
                        </kbd>{" "}
                        close
                    </span>
                </div>
            </div>
        </div>
    );
}
