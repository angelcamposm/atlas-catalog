"use client";

import * as React from "react";
import { X, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SlideOver Component
 *
 * A premium slide-over panel with smooth animations and modern design.
 * Features glass morphism effects, elegant transitions, and accessibility.
 */

type SlideOverSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
type SlideOverSide = "left" | "right";

interface SlideOverProps {
    /** Whether the slide-over is open */
    open: boolean;
    /** Callback when the slide-over should close */
    onClose: () => void;
    /** Title displayed in the header */
    title?: string;
    /** Description displayed below the title */
    description?: string;
    /** Icon to display next to title */
    icon?: React.ReactNode;
    /** Content to render inside the slide-over */
    children: React.ReactNode;
    /** Size of the slide-over panel */
    size?: SlideOverSize;
    /** Which side the panel slides from */
    side?: SlideOverSide;
    /** Additional class names for the content container */
    className?: string;
    /** Whether to show the overlay backdrop */
    showOverlay?: boolean;
    /** Footer content (buttons, actions, etc.) */
    footer?: React.ReactNode;
    /** Whether content is loading */
    loading?: boolean;
    /** Breadcrumb items */
    breadcrumbs?: { label: string; onClick?: () => void }[];
    /** Status badge to show in header */
    status?: {
        label: string;
        variant: "success" | "warning" | "danger" | "info" | "neutral";
    };
    /** Mode: overlay (default) or push (panel pushes content) */
    mode?: "overlay" | "push";
}

const sizeClasses: Record<SlideOverSize, string> = {
    sm: "max-w-sm w-full",
    md: "max-w-md w-full",
    lg: "max-w-lg w-full",
    xl: "max-w-xl w-full",
    "2xl": "max-w-2xl w-full",
    full: "max-w-full w-full",
};

const statusColors: Record<string, string> = {
    success:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export function SlideOver({
    open,
    onClose,
    title,
    description,
    icon,
    children,
    size = "lg",
    side = "right",
    className,
    showOverlay = true,
    footer,
    loading = false,
    breadcrumbs,
    status,
    mode = "overlay",
}: SlideOverProps) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState(false);

    // Handle visibility with delay for smoother animation
    React.useEffect(() => {
        if (open) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, onClose]);

    // Prevent body scroll when open unless we're in push mode
    React.useEffect(() => {
        if (open && (typeof ({} as any).mode === "undefined" ? true : true)) {
            // default behavior is to disable scroll for overlay mode only; consumers using push should set mode="push"
        }

        return () => {
            // cleanup - ensure we don't leave overflow hidden
            document.body.style.overflow = "";
        };
    }, [open]);

    // If mode === 'push', measure panel width and set body margin to emulate pushing content
    React.useEffect(() => {
        if (!panelRef.current) return;
        if (!open) {
            // cleanup margin
            document.body.style.marginRight = "";
            document.body.style.marginLeft = "";
            return;
        }

        // Only when mode is push
        if ((arguments as any)?.[0]?.mode === "push") return; // noop if passed incorrectly
    }, [open]);

    // NEW: observe mode prop via ref/closure; apply push behavior when requested
    React.useEffect(() => {
        // we will apply push behavior only if the caller provided mode === 'push'
        // to detect that, read dataset attribute on panel
        const modeAttr = panelRef.current?.dataset?.mode;
        if (!panelRef.current) return;
        const applyPush = modeAttr === "push";
        if (!applyPush) return;

        const updateMargin = () => {
            if (!panelRef.current) return;
            const width = panelRef.current.getBoundingClientRect().width;
            if (panelRef.current?.dataset?.side === "left") {
                document.body.style.marginLeft = `${width}px`;
            } else {
                document.body.style.marginRight = `${width}px`;
            }
        };

        if (open) {
            updateMargin();
            window.addEventListener("resize", updateMargin);
        }

        return () => {
            document.body.style.marginRight = "";
            document.body.style.marginLeft = "";
            window.removeEventListener("resize", updateMargin);
        };
    }, [open]);

    // Focus trap
    React.useEffect(() => {
        if (open && panelRef.current) {
            const firstFocusable = panelRef.current.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            firstFocusable?.focus();
        }
    }, [open]);

    if (!isVisible && !open) return null;

    return (
        <>
            {/* Overlay with blur effect (only rendered when showOverlay is true and mode is overlay) */}
            {showOverlay && mode !== "push" && (
                <div
                    className={cn(
                        "fixed inset-0 z-40 backdrop-blur-sm transition-all duration-300 ease-out",
                        "bg-black/40 dark:bg-black/60",
                        open ? "opacity-100" : "pointer-events-none opacity-0"
                    )}
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Panel Container */}
            <div
                ref={panelRef}
                data-mode={mode}
                data-side={side}
                role="dialog"
                aria-modal={mode === "overlay"}
                aria-labelledby={title ? "slideover-title" : undefined}
                className={cn(
                    // fixed unless push mode (still fixed visually but body margin will be applied)
                    "fixed inset-y-0 z-50 flex flex-col",
                    "bg-background/95 backdrop-blur-xl",
                    "shadow-2xl shadow-black/10 dark:shadow-black/30",
                    "transition-all duration-300 ease-out",
                    sizeClasses[size],
                    // Position
                    side === "right" && "right-0",
                    side === "left" && "left-0",
                    // Border with gradient effect
                    side === "right" && "border-l border-border/50",
                    side === "left" && "border-r border-border/50",
                    // Animation
                    open
                        ? "translate-x-0 opacity-100"
                        : side === "right"
                        ? "translate-x-full opacity-0"
                        : "-translate-x-full opacity-0",
                    className
                )}
            >
                {/* Header */}
                <div className="relative flex-shrink-0 border-b border-border/50">
                    {/* Subtle gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent pointer-events-none" />

                    <div className="relative px-5 py-4 sm:px-6">
                        {/* Breadcrumbs */}
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && (
                                            <ChevronRight className="h-3 w-3 opacity-50" />
                                        )}
                                        {crumb.onClick ? (
                                            <button
                                                onClick={crumb.onClick}
                                                className="hover:text-foreground transition-colors"
                                            >
                                                {crumb.label}
                                            </button>
                                        ) : (
                                            <span>{crumb.label}</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </nav>
                        )}

                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                {/* Icon */}
                                {icon && (
                                    <div className="flex-shrink-0 mt-0.5">
                                        {icon}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {title && (
                                            <h2
                                                id="slideover-title"
                                                className="text-lg font-semibold text-foreground truncate"
                                            >
                                                {title}
                                            </h2>
                                        )}
                                        {status && (
                                            <span
                                                className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                                    statusColors[status.variant]
                                                )}
                                            >
                                                {status.label}
                                            </span>
                                        )}
                                    </div>
                                    {description && (
                                        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                type="button"
                                onClick={onClose}
                                className={cn(
                                    "flex-shrink-0 rounded-lg p-2",
                                    "text-muted-foreground hover:text-foreground",
                                    "hover:bg-muted/80 active:bg-muted",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                    "transition-all duration-150"
                                )}
                                aria-label="Close panel"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Loading...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="px-5 py-5 sm:px-6">{children}</div>
                    )}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="relative flex-shrink-0 border-t border-border/50">
                        {/* Subtle gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />
                        <div className="relative px-5 py-4 sm:px-6">
                            {footer}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

/**
 * SlideOverSection - A collapsible section with icon support
 */
interface SlideOverSectionProps {
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    /** Visual style variant */
    variant?: "default" | "card" | "minimal";
    /** Default collapsed state */
    defaultCollapsed?: boolean;
    /** Whether section is collapsible */
    collapsible?: boolean;
    /** Action buttons to show in section header */
    actions?: React.ReactNode;
}

export function SlideOverSection({
    title,
    icon,
    children,
    className,
    variant = "default",
    defaultCollapsed = false,
    collapsible = false,
    actions,
}: SlideOverSectionProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    const content = (
        <div
            className={cn(
                "transition-all duration-200",
                isCollapsed && "hidden"
            )}
        >
            {children}
        </div>
    );

    const header = title && (
        <div
            className={cn(
                "flex items-center justify-between gap-2 mb-3",
                collapsible && "cursor-pointer select-none"
            )}
            onClick={
                collapsible ? () => setIsCollapsed(!isCollapsed) : undefined
            }
        >
            <div className="flex items-center gap-2">
                {icon && <span className="text-muted-foreground">{icon}</span>}
                <h3
                    className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        variant === "card"
                            ? "text-foreground"
                            : "text-muted-foreground"
                    )}
                >
                    {title}
                </h3>
                {collapsible && (
                    <ChevronRight
                        className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform duration-200",
                            !isCollapsed && "rotate-90"
                        )}
                    />
                )}
            </div>
            {actions && (
                <div onClick={(e) => e.stopPropagation()}>{actions}</div>
            )}
        </div>
    );

    if (variant === "card") {
        return (
            <div
                className={cn(
                    "mb-4 rounded-xl border border-border/60 bg-card/50",
                    "hover:border-border hover:bg-card/80",
                    "transition-all duration-200",
                    className
                )}
            >
                <div className="px-4 py-3">
                    {header}
                    {content}
                </div>
            </div>
        );
    }

    if (variant === "minimal") {
        return (
            <div className={cn("mb-5", className)}>
                {header}
                {content}
            </div>
        );
    }

    // Default variant
    return (
        <div className={cn("mb-6", className)}>
            {header}
            <div className="rounded-lg border border-border/40 bg-muted/20 overflow-hidden">
                <div className="divide-y divide-border/40">{content}</div>
            </div>
        </div>
    );
}

/**
 * SlideOverField - Enhanced field display with copy and link support
 */
interface SlideOverFieldProps {
    label: string;
    value?: React.ReactNode;
    className?: string;
    /** Icon to show before the label */
    icon?: React.ReactNode;
    /** Whether the value can be copied */
    copyable?: boolean;
    /** Link URL for the value */
    href?: string;
    /** Visual variant */
    variant?: "default" | "code" | "highlight";
    /** Size variant */
    size?: "sm" | "md";
}

export function SlideOverField({
    label,
    value,
    className,
    icon,
    copyable = false,
    href,
    variant = "default",
    size = "md",
}: SlideOverFieldProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        if (value && typeof value === "string") {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const valueContent = () => {
        if (!value) {
            return <span className="text-muted-foreground/60">—</span>;
        }

        if (variant === "code") {
            return (
                <code className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono">
                    {value}
                </code>
            );
        }

        if (href) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 hover:underline transition-colors inline-flex items-center gap-1"
                >
                    {value}
                    <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </a>
            );
        }

        return value;
    };

    return (
        <div
            className={cn(
                "flex items-start justify-between gap-4 px-4",
                size === "sm" ? "py-2" : "py-3",
                variant === "highlight" && "bg-primary/5",
                "hover:bg-muted/50 transition-colors",
                className
            )}
        >
            <dt
                className={cn(
                    "flex items-center gap-2 text-muted-foreground flex-shrink-0",
                    size === "sm" ? "text-xs" : "text-sm"
                )}
            >
                {icon && <span className="opacity-70">{icon}</span>}
                <span className="font-medium">{label}</span>
            </dt>
            <dd
                className={cn(
                    "text-foreground text-right min-w-0 flex items-center gap-2",
                    size === "sm" ? "text-xs" : "text-sm"
                )}
            >
                <span className="truncate">{valueContent()}</span>
                {copyable && value && typeof value === "string" && (
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex-shrink-0 p-1 rounded-md",
                            "text-muted-foreground hover:text-foreground hover:bg-muted",
                            "transition-all duration-150",
                            copied && "text-emerald-500"
                        )}
                        title={copied ? "Copied!" : "Copy to clipboard"}
                    >
                        {copied ? (
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </dd>
        </div>
    );
}

/**
 * SlideOverTabs - Tab navigation within slide-over
 */
interface SlideOverTabsProps {
    tabs: { id: string; label: string; icon?: React.ReactNode }[];
    activeTab: string;
    onChange: (tabId: string) => void;
    className?: string;
}

export function SlideOverTabs({
    tabs,
    activeTab,
    onChange,
    className,
}: SlideOverTabsProps) {
    return (
        <div className={cn("mb-5", className)}>
            <nav
                className="flex gap-1 p-1 rounded-lg bg-muted/50"
                role="tablist"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md",
                            "transition-all duration-150",
                            activeTab === tab.id
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}

/**
 * SlideOverDivider - Visual separator
 */
export function SlideOverDivider({ className }: { className?: string }) {
    return <div className={cn("my-5 border-t border-border/50", className)} />;
}

/**
 * SlideOverEmptyState - Empty state display
 */
interface SlideOverEmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function SlideOverEmptyState({
    icon,
    title,
    description,
    action,
    className,
}: SlideOverEmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 text-center",
                className
            )}
        >
            {icon && (
                <div className="mb-4 rounded-full bg-muted/50 p-4 text-muted-foreground">
                    {icon}
                </div>
            )}
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

export default SlideOver;
