"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface HighlightProps {
    /** Text to display and potentially highlight */
    text: string;
    /** Search query to highlight */
    query?: string;
    /** CSS classes for the wrapper */
    className?: string;
    /** CSS classes for the highlighted text */
    highlightClassName?: string;
    /** Whether to ignore case when matching */
    ignoreCase?: boolean;
    /** Minimum query length to activate highlighting */
    minQueryLength?: number;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits text into parts based on a search query
 */
function splitByQuery(
    text: string,
    query: string,
    ignoreCase: boolean
): { text: string; isMatch: boolean }[] {
    if (!query || query.length === 0) {
        return [{ text, isMatch: false }];
    }

    const regex = new RegExp(
        `(${escapeRegExp(query)})`,
        ignoreCase ? "gi" : "g"
    );
    const parts = text.split(regex);

    return parts
        .filter((part) => part.length > 0)
        .map((part) => ({
            text: part,
            isMatch: ignoreCase
                ? part.toLowerCase() === query.toLowerCase()
                : part === query,
        }));
}

// ============================================================================
// Component
// ============================================================================

/**
 * Highlight component that highlights matching text in a string.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Highlight text="Hello World" query="World" />
 *
 * // With custom styling
 * <Highlight
 *   text="Search results"
 *   query="results"
 *   highlightClassName="bg-yellow-300 font-semibold"
 * />
 *
 * // Case-sensitive matching
 * <Highlight text="ABC abc ABC" query="ABC" ignoreCase={false} />
 * ```
 */
export function Highlight({
    text,
    query = "",
    className,
    highlightClassName,
    ignoreCase = true,
    minQueryLength = 1,
}: HighlightProps) {
    const parts = useMemo(() => {
        if (!query || query.length < minQueryLength) {
            return [{ text, isMatch: false }];
        }
        return splitByQuery(text, query, ignoreCase);
    }, [text, query, ignoreCase, minQueryLength]);

    // If no matches or no query, return plain text
    if (parts.length === 1 && !parts[0].isMatch) {
        return <span className={className}>{text}</span>;
    }

    return (
        <span className={className}>
            {parts.map((part, index) =>
                part.isMatch ? (
                    <mark
                        key={index}
                        className={cn(
                            "bg-yellow-200 dark:bg-yellow-500/30",
                            "text-inherit rounded-sm px-0.5",
                            highlightClassName
                        )}
                    >
                        {part.text}
                    </mark>
                ) : (
                    <span key={index}>{part.text}</span>
                )
            )}
        </span>
    );
}

// ============================================================================
// Utility Hook
// ============================================================================

/**
 * Hook to create highlighted text parts
 *
 * @example
 * ```tsx
 * const { parts, hasMatch } = useHighlight("Hello World", "World");
 * // parts = [{ text: "Hello ", isMatch: false }, { text: "World", isMatch: true }]
 * // hasMatch = true
 * ```
 */
export function useHighlight(
    text: string,
    query: string,
    options: { ignoreCase?: boolean; minQueryLength?: number } = {}
): { parts: { text: string; isMatch: boolean }[]; hasMatch: boolean } {
    const { ignoreCase = true, minQueryLength = 1 } = options;

    return useMemo(() => {
        if (!query || query.length < minQueryLength) {
            return { parts: [{ text, isMatch: false }], hasMatch: false };
        }

        const parts = splitByQuery(text, query, ignoreCase);
        const hasMatch = parts.some((p) => p.isMatch);

        return { parts, hasMatch };
    }, [text, query, ignoreCase, minQueryLength]);
}

// ============================================================================
// Multi-term Highlight
// ============================================================================

export interface MultiHighlightProps {
    /** Text to display and potentially highlight */
    text: string;
    /** Array of search terms to highlight */
    queries?: string[];
    /** CSS classes for the wrapper */
    className?: string;
    /** CSS classes for the highlighted text */
    highlightClassName?: string;
    /** Whether to ignore case when matching */
    ignoreCase?: boolean;
}

/**
 * Multi-term highlight component that highlights multiple search terms.
 *
 * @example
 * ```tsx
 * <MultiHighlight
 *   text="Search for API and documentation"
 *   queries={["API", "documentation"]}
 * />
 * ```
 */
export function MultiHighlight({
    text,
    queries = [],
    className,
    highlightClassName,
    ignoreCase = true,
}: MultiHighlightProps) {
    const parts = useMemo(() => {
        if (!queries || queries.length === 0) {
            return [{ text, isMatch: false }];
        }

        // Filter out empty queries and create pattern
        const validQueries = queries.filter((q) => q && q.length > 0);
        if (validQueries.length === 0) {
            return [{ text, isMatch: false }];
        }

        const pattern = validQueries.map(escapeRegExp).join("|");
        const regex = new RegExp(`(${pattern})`, ignoreCase ? "gi" : "g");
        const splitParts = text.split(regex);

        return splitParts
            .filter((part) => part.length > 0)
            .map((part) => ({
                text: part,
                isMatch: validQueries.some((q) =>
                    ignoreCase
                        ? part.toLowerCase() === q.toLowerCase()
                        : part === q
                ),
            }));
    }, [text, queries, ignoreCase]);

    // If no matches, return plain text
    if (parts.length === 1 && !parts[0].isMatch) {
        return <span className={className}>{text}</span>;
    }

    return (
        <span className={className}>
            {parts.map((part, index) =>
                part.isMatch ? (
                    <mark
                        key={index}
                        className={cn(
                            "bg-yellow-200 dark:bg-yellow-500/30",
                            "text-inherit rounded-sm px-0.5",
                            highlightClassName
                        )}
                    >
                        {part.text}
                    </mark>
                ) : (
                    <span key={index}>{part.text}</span>
                )
            )}
        </span>
    );
}

export default Highlight;
