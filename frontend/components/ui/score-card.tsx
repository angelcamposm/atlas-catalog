"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    HiCheckCircle,
    HiXCircle,
    HiMinusCircle,
    HiChevronUp,
    HiChevronDown,
} from "react-icons/hi2";

// ============================================================================
// Types
// ============================================================================

export type ScoreLevel = "gold" | "silver" | "bronze" | "basic" | "none";

export interface ScoreRule {
    /** Unique identifier */
    id: string;
    /** Rule name/title */
    title: string;
    /** Rule description */
    description?: string;
    /** Whether the rule is passing */
    passed: boolean;
    /** Weight/importance (1-10) */
    weight?: number;
    /** Optional category */
    category?: string;
    /** Icon override */
    icon?: React.ReactNode;
}

export interface ScoreCardProps {
    /** Card title */
    title: string;
    /** Card subtitle/description */
    subtitle?: string;
    /** List of rules to evaluate */
    rules: ScoreRule[];
    /** Whether to show the score breakdown */
    showBreakdown?: boolean;
    /** Whether the breakdown is collapsed by default */
    defaultCollapsed?: boolean;
    /** Custom thresholds for score levels */
    thresholds?: {
        gold?: number;
        silver?: number;
        bronze?: number;
        basic?: number;
    };
    /** Additional className */
    className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

const DEFAULT_THRESHOLDS = {
    gold: 90,
    silver: 70,
    bronze: 50,
    basic: 25,
};

function calculateScore(rules: ScoreRule[]): number {
    if (rules.length === 0) return 0;

    const totalWeight = rules.reduce((acc, rule) => acc + (rule.weight || 1), 0);
    const passedWeight = rules
        .filter((rule) => rule.passed)
        .reduce((acc, rule) => acc + (rule.weight || 1), 0);

    return Math.round((passedWeight / totalWeight) * 100);
}

function getScoreLevel(
    score: number,
    thresholds: typeof DEFAULT_THRESHOLDS
): ScoreLevel {
    if (score >= thresholds.gold) return "gold";
    if (score >= thresholds.silver) return "silver";
    if (score >= thresholds.bronze) return "bronze";
    if (score >= thresholds.basic) return "basic";
    return "none";
}

const levelConfig: Record<
    ScoreLevel,
    {
        label: string;
        bgColor: string;
        textColor: string;
        ringColor: string;
        badgeBg: string;
        badgeText: string;
    }
> = {
    gold: {
        label: "Gold",
        bgColor: "bg-yellow-500",
        textColor: "text-yellow-600 dark:text-yellow-400",
        ringColor: "ring-yellow-500/30",
        badgeBg: "bg-yellow-100 dark:bg-yellow-900/30",
        badgeText: "text-yellow-700 dark:text-yellow-300",
    },
    silver: {
        label: "Silver",
        bgColor: "bg-slate-400",
        textColor: "text-slate-500 dark:text-slate-400",
        ringColor: "ring-slate-400/30",
        badgeBg: "bg-slate-100 dark:bg-slate-800/50",
        badgeText: "text-slate-700 dark:text-slate-300",
    },
    bronze: {
        label: "Bronze",
        bgColor: "bg-amber-600",
        textColor: "text-amber-600 dark:text-amber-500",
        ringColor: "ring-amber-500/30",
        badgeBg: "bg-amber-100 dark:bg-amber-900/30",
        badgeText: "text-amber-700 dark:text-amber-400",
    },
    basic: {
        label: "Basic",
        bgColor: "bg-blue-500",
        textColor: "text-blue-600 dark:text-blue-400",
        ringColor: "ring-blue-500/30",
        badgeBg: "bg-blue-100 dark:bg-blue-900/30",
        badgeText: "text-blue-700 dark:text-blue-300",
    },
    none: {
        label: "None",
        bgColor: "bg-gray-300 dark:bg-gray-600",
        textColor: "text-gray-500 dark:text-gray-400",
        ringColor: "ring-gray-300/30",
        badgeBg: "bg-gray-100 dark:bg-gray-800/50",
        badgeText: "text-gray-600 dark:text-gray-400",
    },
};

// ============================================================================
// Components
// ============================================================================

/** Circular progress indicator for score */
function ScoreCircle({
    score,
    level,
    size = "lg",
}: {
    score: number;
    level: ScoreLevel;
    size?: "sm" | "md" | "lg";
}) {
    const config = levelConfig[level];
    const sizeConfig = {
        sm: { outer: 64, inner: 52, stroke: 6, text: "text-lg" },
        md: { outer: 80, inner: 64, stroke: 8, text: "text-xl" },
        lg: { outer: 96, inner: 78, stroke: 9, text: "text-2xl" },
    };
    const s = sizeConfig[size];
    const circumference = 2 * Math.PI * (s.inner / 2);
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className={cn("relative", `w-${s.outer / 4} h-${s.outer / 4}`)}>
            <svg
                width={s.outer}
                height={s.outer}
                viewBox={`0 0 ${s.outer} ${s.outer}`}
                className="-rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={s.outer / 2}
                    cy={s.outer / 2}
                    r={s.inner / 2}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={s.stroke}
                    className="text-muted/30"
                />
                {/* Progress circle */}
                <circle
                    cx={s.outer / 2}
                    cy={s.outer / 2}
                    r={s.inner / 2}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={s.stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={config.textColor}
                    style={{
                        transition: "stroke-dashoffset 0.5s ease-in-out",
                    }}
                />
            </svg>
            <div
                className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center",
                    s.text,
                    "font-bold",
                    config.textColor
                )}
            >
                {score}%
            </div>
        </div>
    );
}

/** Individual rule item */
function RuleItem({ rule }: { rule: ScoreRule }) {
    return (
        <div
            className={cn(
                "flex items-start gap-3 px-3 py-2 rounded-lg transition-colors",
                rule.passed
                    ? "bg-green-50 dark:bg-green-900/10"
                    : "bg-red-50 dark:bg-red-900/10"
            )}
        >
            <span className="shrink-0 mt-0.5">
                {rule.icon ? (
                    rule.icon
                ) : rule.passed ? (
                    <HiCheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                    <HiXCircle className="h-5 w-5 text-red-500" />
                )}
            </span>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{rule.title}</div>
                {rule.description && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                        {rule.description}
                    </div>
                )}
            </div>
            {rule.weight && rule.weight > 1 && (
                <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                    ×{rule.weight}
                </span>
            )}
        </div>
    );
}

/** Main ScoreCard component */
export function ScoreCard({
    title,
    subtitle,
    rules,
    showBreakdown = true,
    defaultCollapsed = true,
    thresholds = DEFAULT_THRESHOLDS,
    className,
}: ScoreCardProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const score = calculateScore(rules);
    const level = getScoreLevel(score, { ...DEFAULT_THRESHOLDS, ...thresholds });
    const config = levelConfig[level];

    const passedCount = rules.filter((r) => r.passed).length;
    const totalCount = rules.length;

    // Group rules by category if they have categories
    const groupedRules = React.useMemo(() => {
        const groups: Record<string, ScoreRule[]> = {};
        rules.forEach((rule) => {
            const category = rule.category || "Rules";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(rule);
        });
        return groups;
    }, [rules]);

    return (
        <div
            className={cn(
                "bg-card rounded-xl border shadow-sm overflow-hidden",
                className
            )}
        >
            {/* Header */}
            <div className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                    <ScoreCircle score={score} level={level} />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        {subtitle && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {subtitle}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span
                                className={cn(
                                    "inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium",
                                    config.badgeBg,
                                    config.badgeText
                                )}
                            >
                                {config.label}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {passedCount}/{totalCount} rules passing
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breakdown toggle */}
            {showBreakdown && rules.length > 0 && (
                <>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center justify-between px-4 sm:px-6 py-3 border-t bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium"
                    >
                        <span>
                            {isCollapsed ? "Show breakdown" : "Hide breakdown"}
                        </span>
                        {isCollapsed ? (
                            <HiChevronDown className="h-4 w-4" />
                        ) : (
                            <HiChevronUp className="h-4 w-4" />
                        )}
                    </button>

                    {/* Rules breakdown */}
                    {!isCollapsed && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                            {Object.entries(groupedRules).map(
                                ([category, categoryRules]) => (
                                    <div key={category}>
                                        {Object.keys(groupedRules).length > 1 && (
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                {category}
                                            </h4>
                                        )}
                                        <div className="space-y-2">
                                            {categoryRules.map((rule) => (
                                                <RuleItem key={rule.id} rule={rule} />
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ============================================================================
// Mini ScoreCard variant
// ============================================================================

interface MiniScoreCardProps {
    /** Card title */
    title: string;
    /** Score value (0-100) */
    score: number;
    /** Score level override */
    level?: ScoreLevel;
    /** Trend indicator */
    trend?: "up" | "down" | "neutral";
    /** Trend value */
    trendValue?: string;
    /** Click handler */
    onClick?: () => void;
    /** Additional className */
    className?: string;
}

export function MiniScoreCard({
    title,
    score,
    level: levelOverride,
    trend,
    trendValue,
    onClick,
    className,
}: MiniScoreCardProps) {
    const level = levelOverride || getScoreLevel(score, DEFAULT_THRESHOLDS);
    const config = levelConfig[level];

    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-card rounded-lg border p-4 transition-all",
                onClick && "cursor-pointer hover:border-primary/50 hover:shadow-md",
                className
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-muted-foreground truncate">
                        {title}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className={cn("text-2xl font-bold", config.textColor)}>
                            {score}%
                        </span>
                        <span
                            className={cn(
                                "text-xs font-medium px-1.5 py-0.5 rounded",
                                config.badgeBg,
                                config.badgeText
                            )}
                        >
                            {config.label}
                        </span>
                    </div>
                </div>
                {trend && (
                    <div
                        className={cn(
                            "flex items-center gap-0.5 text-sm",
                            trend === "up" && "text-green-500",
                            trend === "down" && "text-red-500",
                            trend === "neutral" && "text-muted-foreground"
                        )}
                    >
                        {trend === "up" && <HiChevronUp className="h-4 w-4" />}
                        {trend === "down" && <HiChevronDown className="h-4 w-4" />}
                        {trend === "neutral" && <HiMinusCircle className="h-4 w-4" />}
                        {trendValue && <span>{trendValue}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// Score Badge (inline)
// ============================================================================

interface ScoreBadgeProps {
    score: number;
    level?: ScoreLevel;
    size?: "sm" | "md";
    className?: string;
}

export function ScoreBadge({
    score,
    level: levelOverride,
    size = "md",
    className,
}: ScoreBadgeProps) {
    const level = levelOverride || getScoreLevel(score, DEFAULT_THRESHOLDS);
    const config = levelConfig[level];

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full font-medium",
                config.badgeBg,
                config.badgeText,
                size === "sm" && "px-2 py-0.5 text-xs",
                size === "md" && "px-2.5 py-1 text-sm",
                className
            )}
        >
            <span
                className={cn("rounded-full", config.bgColor)}
                style={{
                    width: size === "sm" ? 6 : 8,
                    height: size === "sm" ? 6 : 8,
                }}
            />
            {score}% {config.label}
        </span>
    );
}

// ============================================================================
// Predefined rule sets (for common use cases)
// ============================================================================

export const defaultServiceRules = {
    documentation: (hasReadme: boolean, hasChangelog: boolean): ScoreRule[] => [
        {
            id: "readme",
            title: "Has README.md",
            description: "Service has a README file documenting its purpose",
            passed: hasReadme,
            category: "Documentation",
        },
        {
            id: "changelog",
            title: "Has CHANGELOG",
            description: "Service maintains a changelog",
            passed: hasChangelog,
            category: "Documentation",
        },
    ],
    ownership: (hasOwner: boolean, hasTeam: boolean): ScoreRule[] => [
        {
            id: "owner",
            title: "Has owner assigned",
            description: "Service has a designated owner",
            passed: hasOwner,
            category: "Ownership",
            weight: 2,
        },
        {
            id: "team",
            title: "Has team assigned",
            description: "Service is assigned to a team",
            passed: hasTeam,
            category: "Ownership",
        },
    ],
    quality: (
        hasCi: boolean,
        hasTests: boolean,
        codeQuality: boolean
    ): ScoreRule[] => [
        {
            id: "ci",
            title: "CI/CD configured",
            description: "Service has continuous integration",
            passed: hasCi,
            category: "Quality",
            weight: 2,
        },
        {
            id: "tests",
            title: "Has automated tests",
            description: "Service has test coverage",
            passed: hasTests,
            category: "Quality",
            weight: 2,
        },
        {
            id: "code-quality",
            title: "Passes code quality checks",
            description: "No critical issues in static analysis",
            passed: codeQuality,
            category: "Quality",
        },
    ],
    security: (
        hasSecurityScanning: boolean,
        noCriticalVulnerabilities: boolean
    ): ScoreRule[] => [
        {
            id: "security-scanning",
            title: "Security scanning enabled",
            description: "Automated security vulnerability scanning",
            passed: hasSecurityScanning,
            category: "Security",
            weight: 2,
        },
        {
            id: "no-critical-vulns",
            title: "No critical vulnerabilities",
            description: "No unresolved critical security issues",
            passed: noCriticalVulnerabilities,
            category: "Security",
            weight: 3,
        },
    ],
};
