/**
 * Tests for formatting utilities
 */

import {
    formatDate,
    formatRelativeTime,
    formatBytes,
    formatNumber,
    formatPercentage,
    truncate,
    toTitleCase,
    toSlug,
    formatVersion,
    getInitials,
    formatDuration,
    formatHostname,
    pluralize,
    formatCount,
} from "@/lib/formatters";

describe("Formatting Utilities", () => {
    describe("formatDate", () => {
        it("should format a valid date string", () => {
            const result = formatDate("2024-01-15T10:30:00Z");
            expect(result).toContain("2024");
            expect(result).toContain("15");
        });

        it("should format a Date object", () => {
            const date = new Date("2024-06-20");
            const result = formatDate(date);
            expect(result).toContain("2024");
        });

        it("should return dash for null", () => {
            expect(formatDate(null)).toBe("-");
        });

        it("should return dash for undefined", () => {
            expect(formatDate(undefined)).toBe("-");
        });

        it("should return dash for invalid date", () => {
            expect(formatDate("not-a-date")).toBe("-");
        });

        it("should respect locale", () => {
            const result = formatDate("2024-01-15", "es-ES");
            expect(typeof result).toBe("string");
        });

        it("should respect custom options", () => {
            const result = formatDate("2024-01-15", "en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            expect(result).toContain("January");
        });
    });

    describe("formatRelativeTime", () => {
        beforeEach(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it("should format seconds ago", () => {
            const result = formatRelativeTime("2024-06-15T11:59:30Z");
            expect(result).toContain("second");
        });

        it("should format minutes ago", () => {
            const result = formatRelativeTime("2024-06-15T11:30:00Z");
            expect(result).toContain("minute");
        });

        it("should format hours ago", () => {
            const result = formatRelativeTime("2024-06-15T08:00:00Z");
            expect(result).toContain("hour");
        });

        it("should format days ago", () => {
            const result = formatRelativeTime("2024-06-10T12:00:00Z");
            expect(result).toContain("day");
        });

        it("should return dash for null", () => {
            expect(formatRelativeTime(null)).toBe("-");
        });

        it("should return dash for undefined", () => {
            expect(formatRelativeTime(undefined)).toBe("-");
        });

        it("should return dash for invalid date", () => {
            expect(formatRelativeTime("not-a-date")).toBe("-");
        });
    });

    describe("formatBytes", () => {
        it("should format zero bytes", () => {
            expect(formatBytes(0)).toBe("0 Bytes");
        });

        it("should format bytes", () => {
            expect(formatBytes(500)).toBe("500 Bytes");
        });

        it("should format kilobytes", () => {
            expect(formatBytes(1024)).toBe("1 KB");
        });

        it("should format megabytes", () => {
            expect(formatBytes(1048576)).toBe("1 MB");
        });

        it("should format gigabytes", () => {
            expect(formatBytes(1073741824)).toBe("1 GB");
        });

        it("should format terabytes", () => {
            expect(formatBytes(1099511627776)).toBe("1 TB");
        });

        it("should respect decimal places", () => {
            expect(formatBytes(1536, 0)).toBe("2 KB");
            expect(formatBytes(1536, 1)).toBe("1.5 KB");
            expect(formatBytes(1536, 2)).toBe("1.5 KB");
        });

        it("should return 0 Bytes for null", () => {
            expect(formatBytes(null)).toBe("0 Bytes");
        });

        it("should return 0 Bytes for undefined", () => {
            expect(formatBytes(undefined)).toBe("0 Bytes");
        });
    });

    describe("formatNumber", () => {
        it("should format a number", () => {
            expect(formatNumber(1234567)).toBe("1,234,567");
        });

        it("should return dash for null", () => {
            expect(formatNumber(null)).toBe("-");
        });

        it("should return dash for undefined", () => {
            expect(formatNumber(undefined)).toBe("-");
        });

        it("should respect locale", () => {
            const result = formatNumber(1234.56, "de-DE");
            expect(result).toContain("1");
        });

        it("should respect options", () => {
            const result = formatNumber(1234.567, "en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            expect(result).toBe("1,234.57");
        });
    });

    describe("formatPercentage", () => {
        it("should format decimal as percentage", () => {
            expect(formatPercentage(0.75)).toBe("75.0%");
        });

        it("should format integer percentage", () => {
            expect(formatPercentage(75, false)).toBe("75.0%");
        });

        it("should respect decimal places", () => {
            expect(formatPercentage(0.7567, true, 2)).toBe("75.67%");
        });

        it("should return dash for null", () => {
            expect(formatPercentage(null)).toBe("-");
        });

        it("should return dash for undefined", () => {
            expect(formatPercentage(undefined)).toBe("-");
        });
    });

    describe("truncate", () => {
        it("should not truncate short strings", () => {
            expect(truncate("Hello", 50)).toBe("Hello");
        });

        it("should truncate long strings", () => {
            const longString = "This is a very long string that should be truncated";
            const result = truncate(longString, 20);
            expect(result.length).toBe(20);
            expect(result.endsWith("...")).toBe(true);
        });

        it("should use custom suffix", () => {
            const result = truncate("Hello World!", 8, "…");
            expect(result.endsWith("…")).toBe(true);
        });

        it("should return empty string for null", () => {
            expect(truncate(null)).toBe("");
        });

        it("should return empty string for undefined", () => {
            expect(truncate(undefined)).toBe("");
        });
    });

    describe("toTitleCase", () => {
        it("should convert lowercase to title case", () => {
            expect(toTitleCase("hello world")).toBe("Hello World");
        });

        it("should handle uppercase", () => {
            expect(toTitleCase("HELLO WORLD")).toBe("Hello World");
        });

        it("should handle underscores", () => {
            expect(toTitleCase("hello_world")).toBe("Hello World");
        });

        it("should handle dashes", () => {
            expect(toTitleCase("hello-world")).toBe("Hello World");
        });

        it("should return empty string for null", () => {
            expect(toTitleCase(null)).toBe("");
        });

        it("should return empty string for undefined", () => {
            expect(toTitleCase(undefined)).toBe("");
        });
    });

    describe("toSlug", () => {
        it("should convert string to slug", () => {
            expect(toSlug("Hello World")).toBe("hello-world");
        });

        it("should handle special characters", () => {
            expect(toSlug("Hello, World!")).toBe("hello-world");
        });

        it("should handle multiple spaces", () => {
            expect(toSlug("Hello    World")).toBe("hello-world");
        });

        it("should handle underscores", () => {
            expect(toSlug("hello_world")).toBe("hello-world");
        });

        it("should trim leading/trailing dashes", () => {
            expect(toSlug("-Hello World-")).toBe("hello-world");
        });

        it("should return empty string for null", () => {
            expect(toSlug(null)).toBe("");
        });

        it("should return empty string for undefined", () => {
            expect(toSlug(undefined)).toBe("");
        });
    });

    describe("formatVersion", () => {
        it("should format version without v prefix", () => {
            expect(formatVersion("1.0.0")).toBe("v1.0.0");
        });

        it("should keep version with v prefix", () => {
            expect(formatVersion("v2.1.0")).toBe("v2.1.0");
        });

        it("should return dash for null", () => {
            expect(formatVersion(null)).toBe("-");
        });

        it("should return dash for undefined", () => {
            expect(formatVersion(undefined)).toBe("-");
        });
    });

    describe("getInitials", () => {
        it("should get initials from full name", () => {
            expect(getInitials("John Doe")).toBe("JD");
        });

        it("should get initials from single name", () => {
            expect(getInitials("John")).toBe("J");
        });

        it("should respect maxLength", () => {
            expect(getInitials("John Michael Doe", 3)).toBe("JMD");
        });

        it("should handle multiple spaces", () => {
            expect(getInitials("John   Doe")).toBe("JD");
        });

        it("should return empty string for null", () => {
            expect(getInitials(null)).toBe("");
        });

        it("should return empty string for undefined", () => {
            expect(getInitials(undefined)).toBe("");
        });
    });

    describe("formatDuration", () => {
        it("should format milliseconds", () => {
            expect(formatDuration(500)).toBe("500ms");
        });

        it("should format seconds", () => {
            expect(formatDuration(5000)).toBe("5s");
        });

        it("should format minutes", () => {
            expect(formatDuration(180000)).toBe("3m");
        });

        it("should format minutes and seconds", () => {
            expect(formatDuration(185000)).toBe("3m 5s");
        });

        it("should format hours", () => {
            expect(formatDuration(7200000)).toBe("2h");
        });

        it("should format hours and minutes", () => {
            expect(formatDuration(7500000)).toBe("2h 5m");
        });

        it("should format days", () => {
            expect(formatDuration(172800000)).toBe("2d");
        });

        it("should format days and hours", () => {
            expect(formatDuration(180000000)).toBe("2d 2h");
        });

        it("should return dash for null", () => {
            expect(formatDuration(null)).toBe("-");
        });

        it("should return dash for undefined", () => {
            expect(formatDuration(undefined)).toBe("-");
        });

        it("should return dash for negative values", () => {
            expect(formatDuration(-100)).toBe("-");
        });
    });

    describe("formatHostname", () => {
        it("should extract hostname from URL", () => {
            expect(formatHostname("https://api.example.com/v1/users")).toBe(
                "api.example.com"
            );
        });

        it("should handle URL with port", () => {
            expect(formatHostname("http://localhost:3000/api")).toBe("localhost");
        });

        it("should return original string for invalid URL", () => {
            expect(formatHostname("not-a-url")).toBe("not-a-url");
        });

        it("should return dash for null", () => {
            expect(formatHostname(null)).toBe("-");
        });

        it("should return dash for undefined", () => {
            expect(formatHostname(undefined)).toBe("-");
        });
    });

    describe("pluralize", () => {
        it("should return singular for count 1", () => {
            expect(pluralize(1, "item")).toBe("item");
        });

        it("should return plural for count > 1", () => {
            expect(pluralize(5, "item")).toBe("items");
        });

        it("should return plural for count 0", () => {
            expect(pluralize(0, "item")).toBe("items");
        });

        it("should use custom plural", () => {
            expect(pluralize(2, "child", "children")).toBe("children");
        });
    });

    describe("formatCount", () => {
        it("should format count with singular", () => {
            expect(formatCount(1, "item")).toBe("1 item");
        });

        it("should format count with plural", () => {
            expect(formatCount(5, "item")).toBe("5 items");
        });

        it("should format count with custom plural", () => {
            expect(formatCount(3, "person", "people")).toBe("3 people");
        });

        it("should format large numbers", () => {
            expect(formatCount(1000, "item")).toBe("1,000 items");
        });

        it("should return dash for null", () => {
            expect(formatCount(null, "item")).toBe("-");
        });

        it("should return dash for undefined", () => {
            expect(formatCount(undefined, "item")).toBe("-");
        });
    });
});
