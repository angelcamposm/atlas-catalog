/**
 * CollapsibleSection Component
 *
 * A reusable collapsible/expandable section component with optional:
 * - Custom icon
 * - Percentage indicator
 * - Animation transitions
 * - Accessibility support (ARIA)
 *
 * @example
 * <CollapsibleSection title="Information" percentage={75} icon={HiOutlineInformationCircle}>
 *   <p>Section content here</p>
 * </CollapsibleSection>
 */

"use client";

import React, {
    useState,
    useCallback,
    useId,
    type ReactNode,
    type ComponentType,
} from "react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi2";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface CollapsibleSectionProps {
    /** Section title displayed in the header */
    title: string;
    /** Optional icon component to display before the title */
    icon?: ComponentType<{ className?: string }>;
    /** Optional percentage value (0-100) to display as completion indicator */
    percentage?: number;
    /** Whether the section is expanded by default */
    defaultExpanded?: boolean;
    /** Callback fired when the section is toggled */
    onToggle?: (isExpanded: boolean) => void;
    /** Content to display when expanded */
    children: ReactNode;
    /** Additional CSS classes for the container */
    className?: string;
    /** Remove border styling */
    noBorder?: boolean;
    /** Controlled expanded state */
    expanded?: boolean;
    /** Custom test ID for testing */
    testId?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the color class for the percentage badge based on value
 */
function getPercentageColor(percentage: number): string {
    if (percentage >= 80) {
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    }
    if (percentage >= 50) {
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
    if (percentage >= 25) {
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    }
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
}

// ============================================================================
// Component
// ============================================================================

export function CollapsibleSection({
    title,
    icon: Icon,
    percentage,
    defaultExpanded = false,
    onToggle,
    children,
    className,
    noBorder = false,
    expanded: controlledExpanded,
    testId,
}: CollapsibleSectionProps) {
    // Generate unique IDs for accessibility
    const uniqueId = useId();
    const contentId = `collapsible-content-${uniqueId}`;
    const headerId = `collapsible-header-${uniqueId}`;

    // Internal state for uncontrolled mode
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

    // Determine if component is controlled or uncontrolled
    const isControlled = controlledExpanded !== undefined;
    const isExpanded = isControlled ? controlledExpanded : internalExpanded;

    // Handle toggle
    const handleToggle = useCallback(() => {
        const newValue = !isExpanded;

        if (!isControlled) {
            setInternalExpanded(newValue);
        }

        onToggle?.(newValue);
    }, [isExpanded, isControlled, onToggle]);

    // Handle keyboard events
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleToggle();
            }
        },
        [handleToggle]
    );

    const ChevronIcon = isExpanded ? HiChevronDown : HiChevronRight;

    return (
        <div
            className={cn(
                "rounded-lg bg-white dark:bg-gray-800",
                !noBorder && "border border-gray-200 dark:border-gray-700",
                className
            )}
            data-testid={testId}
        >
            {/* Header */}
            <button
                id={headerId}
                type="button"
                className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3",
                    "text-left transition-colors",
                    "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                    "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500",
                    isExpanded &&
                        "border-b border-gray-200 dark:border-gray-700"
                )}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                aria-expanded={isExpanded}
                aria-controls={contentId}
            >
                <div className="flex items-center gap-3 min-w-0">
                    {/* Chevron icon */}
                    <ChevronIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 transition-transform" />

                    {/* Custom icon */}
                    {Icon && (
                        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                    )}

                    {/* Title */}
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {title}
                    </span>

                    {/* Percentage badge */}
                    {typeof percentage === "number" && (
                        <span
                            className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0",
                                getPercentageColor(percentage)
                            )}
                        >
                            {percentage}%
                        </span>
                    )}
                </div>
            </button>

            {/* Content */}
            {isExpanded && (
                <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className="px-4 py-4"
                >
                    {children}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Sub-components for common patterns
// ============================================================================

export interface SectionFieldProps {
    label: string;
    value?: ReactNode;
    className?: string;
}

/**
 * A field row inside a collapsible section
 */
export function SectionField({ label, value, className }: SectionFieldProps) {
    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2",
                className
            )}
        >
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 shrink-0">
                {label}
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">
                {value ?? (
                    <span className="text-gray-400 dark:text-gray-500">—</span>
                )}
            </dd>
        </div>
    );
}

/**
 * A grid of fields inside a collapsible section
 */
export function SectionFieldGrid({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <dl
            className={cn(
                "divide-y divide-gray-100 dark:divide-gray-700",
                className
            )}
        >
            {children}
        </dl>
    );
}

export default CollapsibleSection;
