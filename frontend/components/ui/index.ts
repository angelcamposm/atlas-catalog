/**
 * UI Components Index
 *
 * Export all reusable UI components for easy importing throughout the application.
 * These components follow Backstage/Port.io design patterns for developer portals.
 */

// Cards
export { EntityCard, EntityCardGrid } from "./entity-card";
export type { EntityCardProps, EntityType } from "./entity-card";

export { StatCard, StatsGrid, QuickStat } from "./stat-card";
export type {
    StatCardProps,
    StatsGridProps,
    QuickStatProps,
    TrendDirection,
} from "./stat-card";

export {
    ScoreCard,
    MiniScoreCard,
    ScoreBadge,
    defaultServiceRules,
} from "./score-card";
export type { ScoreCardProps, ScoreRule, ScoreLevel } from "./score-card";

// Status & Indicators
export {
    StatusIndicator,
    HealthIndicator,
    UptimeIndicator,
} from "./status-indicator";
export type {
    StatusIndicatorProps,
    StatusType,
    HealthIndicatorProps,
    UptimeIndicatorProps,
} from "./status-indicator";

// Navigation
export {
    Breadcrumbs,
    AutoBreadcrumbs,
    useAutoBreadcrumbs,
} from "./breadcrumbs";
export type {
    BreadcrumbsProps,
    BreadcrumbItem,
    AutoBreadcrumbsProps,
} from "./breadcrumbs";

export { CommandPalette, useCommandPalette } from "./command-palette";
export type { CommandPaletteProps, CommandItem } from "./command-palette";

// Empty States (existing component)
export {
    default as EmptyState,
    EmptyList,
    NoSearchResults,
    ErrorState,
    OfflineState,
    ServerErrorState,
} from "./empty-state";
export type {
    EmptyStateProps,
    EmptyStateType,
    RetryableEmptyStateProps,
    NoSearchResultsProps,
    ErrorStateProps,
} from "./empty-state";

// Core UI (existing components - re-export if they exist)
// export { Badge } from "./badge";
// export { Card, CardHeader, CardContent, CardFooter } from "./card";
// export { LoadingSpinner } from "./loading-spinner";
// export { Button } from "./button";
