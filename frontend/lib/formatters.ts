/**
 * Formatting utilities for Atlas Catalog frontend
 */

/**
 * Format a date string to a localized format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormat options
 */
export function formatDate(
    dateString: string | Date | null | undefined,
    locale = "en-US",
    options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    }
): string {
    if (!dateString) return "-";

    try {
        const date =
            typeof dateString === "string" ? new Date(dateString) : dateString;
        if (isNaN(date.getTime())) return "-";
        return new Intl.DateTimeFormat(locale, options).format(date);
    } catch {
        return "-";
    }
}

/**
 * Format a date string to a relative time format (e.g., "2 hours ago")
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: 'en-US')
 */
export function formatRelativeTime(
    dateString: string | Date | null | undefined,
    locale = "en-US"
): string {
    if (!dateString) return "-";

    try {
        const date =
            typeof dateString === "string" ? new Date(dateString) : dateString;
        if (isNaN(date.getTime())) return "-";

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

        if (diffInSeconds < 60) {
            return rtf.format(-diffInSeconds, "second");
        } else if (diffInSeconds < 3600) {
            return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
        } else if (diffInSeconds < 86400) {
            return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
        } else if (diffInSeconds < 2592000) {
            return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
        } else if (diffInSeconds < 31536000) {
            return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
        } else {
            return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
        }
    } catch {
        return "-";
    }
}

/**
 * Format bytes to human-readable size
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatBytes(
    bytes: number | null | undefined,
    decimals = 2
): string {
    if (bytes === null || bytes === undefined || bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Format a number to a localized format
 * @param value - Number to format
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.NumberFormat options
 */
export function formatNumber(
    value: number | null | undefined,
    locale = "en-US",
    options: Intl.NumberFormatOptions = {}
): string {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a number as a percentage
 * @param value - Number to format (0-1 or 0-100)
 * @param isDecimal - Whether the value is a decimal (0-1) or already a percentage (0-100)
 * @param decimals - Number of decimal places
 */
export function formatPercentage(
    value: number | null | undefined,
    isDecimal = true,
    decimals = 1
): string {
    if (value === null || value === undefined) return "-";
    const percentage = isDecimal ? value * 100 : value;
    return `${percentage.toFixed(decimals)}%`;
}

/**
 * Truncate a string to a maximum length with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length (default: 50)
 * @param suffix - Suffix to add when truncated (default: '...')
 */
export function truncate(
    str: string | null | undefined,
    maxLength = 50,
    suffix = "..."
): string {
    if (!str) return "";
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert a string to title case
 * @param str - String to convert
 */
export function toTitleCase(str: string | null | undefined): string {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(/[\s_-]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Convert a string to slug format (kebab-case)
 * @param str - String to convert
 */
export function toSlug(str: string | null | undefined): string {
    if (!str) return "";
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Format an API version string
 * @param version - Version string (e.g., "1.0.0" or "v1")
 */
export function formatVersion(version: string | null | undefined): string {
    if (!version) return "-";
    // Ensure version starts with 'v' if it doesn't
    return version.startsWith("v") ? version : `v${version}`;
}

/**
 * Get initials from a name
 * @param name - Full name
 * @param maxLength - Maximum number of initials (default: 2)
 */
export function getInitials(
    name: string | null | undefined,
    maxLength = 2
): string {
    if (!name) return "";
    return name
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, maxLength)
        .join("");
}

/**
 * Format a duration in milliseconds to human-readable format
 * @param ms - Duration in milliseconds
 */
export function formatDuration(ms: number | null | undefined): string {
    if (ms === null || ms === undefined || ms < 0) return "-";

    if (ms < 1000) return `${ms}ms`;

    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
        return remainingMinutes > 0
            ? `${hours}h ${remainingMinutes}m`
            : `${hours}h`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

/**
 * Format a URL to display only the hostname
 * @param url - Full URL
 */
export function formatHostname(url: string | null | undefined): string {
    if (!url) return "-";
    try {
        const parsed = new URL(url);
        return parsed.hostname;
    } catch {
        return url;
    }
}

/**
 * Pluralize a word based on count
 * @param count - Number to check
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word (optional, defaults to singular + 's')
 */
export function pluralize(
    count: number,
    singular: string,
    plural?: string
): string {
    return count === 1 ? singular : (plural || `${singular}s`);
}

/**
 * Format a count with its label (e.g., "1 item" or "5 items")
 * @param count - Number to format
 * @param singular - Singular label
 * @param plural - Plural label (optional)
 */
export function formatCount(
    count: number | null | undefined,
    singular: string,
    plural?: string
): string {
    if (count === null || count === undefined) return "-";
    return `${formatNumber(count)} ${pluralize(count, singular, plural)}`;
}
