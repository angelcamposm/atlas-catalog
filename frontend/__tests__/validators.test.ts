/**
 * Tests for validation utilities
 */

import {
    isValidEmail,
    isValidUrl,
    isValidIpAddress,
    isValidUuid,
    isValidSemanticVersion,
    isValidHostname,
    isValidPort,
    isEmpty,
    isNotEmpty,
    isAlphanumeric,
    isValidSlug,
    isValidNamespace,
    isInRange,
    isLengthInRange,
    isFutureDate,
    isPastDate,
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validateEmail,
    validateUrl,
    combineValidations,
    getAllValidationErrors,
} from "@/lib/validators";

describe("Validation Utilities", () => {
    describe("isValidEmail", () => {
        it("should return true for valid email", () => {
            expect(isValidEmail("test@example.com")).toBe(true);
            expect(isValidEmail("user.name@domain.org")).toBe(true);
            expect(isValidEmail("user+tag@domain.co.uk")).toBe(true);
        });

        it("should return false for invalid email", () => {
            expect(isValidEmail("not-an-email")).toBe(false);
            expect(isValidEmail("@example.com")).toBe(false);
            expect(isValidEmail("test@")).toBe(false);
            expect(isValidEmail("test@.com")).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isValidEmail(null)).toBe(false);
            expect(isValidEmail(undefined)).toBe(false);
        });
    });

    describe("isValidUrl", () => {
        it("should return true for valid URLs", () => {
            expect(isValidUrl("https://example.com")).toBe(true);
            expect(isValidUrl("http://localhost:3000")).toBe(true);
            expect(isValidUrl("https://api.example.com/v1/users")).toBe(true);
        });

        it("should return false for invalid URLs", () => {
            expect(isValidUrl("not-a-url")).toBe(false);
            expect(isValidUrl("example.com")).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isValidUrl(null)).toBe(false);
            expect(isValidUrl(undefined)).toBe(false);
        });
    });

    describe("isValidIpAddress", () => {
        it("should return true for valid IPv4 addresses", () => {
            expect(isValidIpAddress("192.168.1.1")).toBe(true);
            expect(isValidIpAddress("10.0.0.1")).toBe(true);
            expect(isValidIpAddress("255.255.255.255")).toBe(true);
            expect(isValidIpAddress("0.0.0.0")).toBe(true);
        });

        it("should return false for invalid IPv4 addresses", () => {
            expect(isValidIpAddress("256.1.1.1")).toBe(false);
            expect(isValidIpAddress("192.168.1")).toBe(false);
            expect(isValidIpAddress("192.168.1.1.1")).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isValidIpAddress(null)).toBe(false);
            expect(isValidIpAddress(undefined)).toBe(false);
        });
    });

    describe("isValidUuid", () => {
        it("should return true for valid UUIDs", () => {
            expect(isValidUuid("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
            expect(isValidUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
        });

        it("should return false for invalid UUIDs", () => {
            expect(isValidUuid("not-a-uuid")).toBe(false);
            expect(isValidUuid("123e4567-e89b-12d3-a456")).toBe(false);
            expect(isValidUuid("123e4567e89b12d3a456426614174000")).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isValidUuid(null)).toBe(false);
            expect(isValidUuid(undefined)).toBe(false);
        });
    });

    describe("isValidSemanticVersion", () => {
        it("should return true for valid semantic versions", () => {
            expect(isValidSemanticVersion("1.0.0")).toBe(true);
            expect(isValidSemanticVersion("v1.0.0")).toBe(true);
            expect(isValidSemanticVersion("2.1.3")).toBe(true);
            expect(isValidSemanticVersion("1.0.0-alpha")).toBe(true);
            expect(isValidSemanticVersion("1.0.0-beta.1")).toBe(true);
            expect(isValidSemanticVersion("1.0.0+build")).toBe(true);
        });

        it("should return false for invalid semantic versions", () => {
            expect(isValidSemanticVersion("1.0")).toBe(false);
            expect(isValidSemanticVersion("1")).toBe(false);
            expect(isValidSemanticVersion("not-a-version")).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isValidSemanticVersion(null)).toBe(false);
            expect(isValidSemanticVersion(undefined)).toBe(false);
        });
    });

    describe("isValidHostname", () => {
        it("should return true for valid hostnames", () => {
            expect(isValidHostname("example.com")).toBe(true);
            expect(isValidHostname("api.example.com")).toBe(true);
            expect(isValidHostname("my-server")).toBe(true);
        });

        it("should return false for invalid hostnames", () => {
            expect(isValidHostname("-invalid.com")).toBe(false);
            expect(isValidHostname("invalid-.com")).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isValidHostname(null)).toBe(false);
            expect(isValidHostname(undefined)).toBe(false);
        });
    });

    describe("isValidPort", () => {
        it("should return true for valid port numbers", () => {
            expect(isValidPort(80)).toBe(true);
            expect(isValidPort(443)).toBe(true);
            expect(isValidPort(3000)).toBe(true);
            expect(isValidPort(0)).toBe(true);
            expect(isValidPort(65535)).toBe(true);
            expect(isValidPort("8080")).toBe(true);
        });

        it("should return false for invalid port numbers", () => {
            expect(isValidPort(-1)).toBe(false);
            expect(isValidPort(65536)).toBe(false);
            expect(isValidPort("not-a-port")).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isValidPort(null)).toBe(false);
            expect(isValidPort(undefined)).toBe(false);
        });
    });

    describe("isEmpty", () => {
        it("should return true for empty values", () => {
            expect(isEmpty(null)).toBe(true);
            expect(isEmpty(undefined)).toBe(true);
            expect(isEmpty("")).toBe(true);
            expect(isEmpty("   ")).toBe(true);
            expect(isEmpty([])).toBe(true);
            expect(isEmpty({})).toBe(true);
        });

        it("should return false for non-empty values", () => {
            expect(isEmpty("hello")).toBe(false);
            expect(isEmpty([1, 2, 3])).toBe(false);
            expect(isEmpty({ key: "value" })).toBe(false);
            expect(isEmpty(0)).toBe(false);
            expect(isEmpty(false)).toBe(false);
        });
    });

    describe("isNotEmpty", () => {
        it("should return false for empty values", () => {
            expect(isNotEmpty(null)).toBe(false);
            expect(isNotEmpty(undefined)).toBe(false);
            expect(isNotEmpty("")).toBe(false);
        });

        it("should return true for non-empty values", () => {
            expect(isNotEmpty("hello")).toBe(true);
            expect(isNotEmpty([1, 2, 3])).toBe(true);
            expect(isNotEmpty({ key: "value" })).toBe(true);
        });
    });

    describe("isAlphanumeric", () => {
        it("should return true for alphanumeric strings", () => {
            expect(isAlphanumeric("abc123")).toBe(true);
            expect(isAlphanumeric("ABC")).toBe(true);
            expect(isAlphanumeric("123")).toBe(true);
        });

        it("should return false for non-alphanumeric strings", () => {
            expect(isAlphanumeric("abc-123")).toBe(false);
            expect(isAlphanumeric("abc 123")).toBe(false);
            expect(isAlphanumeric("abc_123")).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isAlphanumeric(null)).toBe(false);
            expect(isAlphanumeric(undefined)).toBe(false);
        });
    });

    describe("isValidSlug", () => {
        it("should return true for valid slugs", () => {
            expect(isValidSlug("my-api")).toBe(true);
            expect(isValidSlug("api123")).toBe(true);
            expect(isValidSlug("my-api-v2")).toBe(true);
        });

        it("should return false for invalid slugs", () => {
            expect(isValidSlug("My-API")).toBe(false);
            expect(isValidSlug("my_api")).toBe(false);
            expect(isValidSlug("-my-api")).toBe(false);
            expect(isValidSlug("my-api-")).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isValidSlug(null)).toBe(false);
            expect(isValidSlug(undefined)).toBe(false);
        });
    });

    describe("isValidNamespace", () => {
        it("should return true for valid namespaces", () => {
            expect(isValidNamespace("default")).toBe(true);
            expect(isValidNamespace("kube-system")).toBe(true);
            expect(isValidNamespace("my-namespace")).toBe(true);
        });

        it("should return false for invalid namespaces", () => {
            expect(isValidNamespace("-invalid")).toBe(false);
            expect(isValidNamespace("invalid-")).toBe(false);
            expect(isValidNamespace("Invalid")).toBe(false);
            expect(isValidNamespace("a".repeat(64))).toBe(false); // Too long
        });

        it("should return false for null/undefined", () => {
            expect(isValidNamespace(null)).toBe(false);
            expect(isValidNamespace(undefined)).toBe(false);
        });
    });

    describe("isInRange", () => {
        it("should return true for values in range", () => {
            expect(isInRange(5, 0, 10)).toBe(true);
            expect(isInRange(0, 0, 10)).toBe(true);
            expect(isInRange(10, 0, 10)).toBe(true);
        });

        it("should return false for values out of range", () => {
            expect(isInRange(-1, 0, 10)).toBe(false);
            expect(isInRange(11, 0, 10)).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isInRange(null, 0, 10)).toBe(false);
            expect(isInRange(undefined, 0, 10)).toBe(false);
        });
    });

    describe("isLengthInRange", () => {
        it("should return true for strings in range", () => {
            expect(isLengthInRange("hello", 1, 10)).toBe(true);
            expect(isLengthInRange("a", 1, 10)).toBe(true);
            expect(isLengthInRange("0123456789", 1, 10)).toBe(true);
        });

        it("should return false for strings out of range", () => {
            expect(isLengthInRange("hello world", 1, 10)).toBe(false);
            expect(isLengthInRange("", 1, 10)).toBe(false);
        });

        it("should return true for null/undefined with minLength 0", () => {
            expect(isLengthInRange(null, 0, 10)).toBe(true);
        });
    });

    describe("isFutureDate", () => {
        it("should return true for future dates", () => {
            const futureDate = new Date(Date.now() + 86400000).toISOString();
            expect(isFutureDate(futureDate)).toBe(true);
        });

        it("should return false for past dates", () => {
            const pastDate = new Date(Date.now() - 86400000).toISOString();
            expect(isFutureDate(pastDate)).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isFutureDate(null)).toBe(false);
            expect(isFutureDate(undefined)).toBe(false);
        });

        it("should return false for invalid dates", () => {
            expect(isFutureDate("not-a-date")).toBe(false);
        });
    });

    describe("isPastDate", () => {
        it("should return true for past dates", () => {
            const pastDate = new Date(Date.now() - 86400000).toISOString();
            expect(isPastDate(pastDate)).toBe(true);
        });

        it("should return false for future dates", () => {
            const futureDate = new Date(Date.now() + 86400000).toISOString();
            expect(isPastDate(futureDate)).toBe(false);
        });

        it("should return false for null/undefined", () => {
            expect(isPastDate(null)).toBe(false);
            expect(isPastDate(undefined)).toBe(false);
        });
    });

    describe("validateRequired", () => {
        it("should return null for non-empty values", () => {
            expect(validateRequired("hello", "Field")).toBe(null);
            expect(validateRequired([1, 2], "Field")).toBe(null);
        });

        it("should return error message for empty values", () => {
            expect(validateRequired(null, "Name")).toBe("Name is required");
            expect(validateRequired("", "Name")).toBe("Name is required");
        });
    });

    describe("validateMinLength", () => {
        it("should return null for strings meeting minimum", () => {
            expect(validateMinLength("hello", 3, "Field")).toBe(null);
        });

        it("should return error message for short strings", () => {
            expect(validateMinLength("hi", 3, "Name")).toBe(
                "Name must be at least 3 characters"
            );
        });

        it("should return error message for null/undefined", () => {
            expect(validateMinLength(null, 3, "Name")).toBe(
                "Name must be at least 3 characters"
            );
        });
    });

    describe("validateMaxLength", () => {
        it("should return null for strings within limit", () => {
            expect(validateMaxLength("hello", 10, "Field")).toBe(null);
        });

        it("should return error message for long strings", () => {
            expect(validateMaxLength("hello world", 10, "Name")).toBe(
                "Name must be at most 10 characters"
            );
        });

        it("should return null for null/undefined", () => {
            expect(validateMaxLength(null, 10, "Name")).toBe(null);
        });
    });

    describe("validateEmail", () => {
        it("should return null for valid emails", () => {
            expect(validateEmail("test@example.com")).toBe(null);
        });

        it("should return error message for invalid emails", () => {
            expect(validateEmail("not-an-email")).toBe(
                "Email is not a valid email address"
            );
        });

        it("should return null for null/undefined", () => {
            expect(validateEmail(null)).toBe(null);
        });

        it("should use custom field name", () => {
            expect(validateEmail("bad", "Contact")).toBe(
                "Contact is not a valid email address"
            );
        });
    });

    describe("validateUrl", () => {
        it("should return null for valid URLs", () => {
            expect(validateUrl("https://example.com")).toBe(null);
        });

        it("should return error message for invalid URLs", () => {
            expect(validateUrl("not-a-url")).toBe("URL is not a valid URL");
        });

        it("should return null for null/undefined", () => {
            expect(validateUrl(null)).toBe(null);
        });
    });

    describe("combineValidations", () => {
        it("should return first error found", () => {
            const result = combineValidations([null, "Error 1", "Error 2"]);
            expect(result).toBe("Error 1");
        });

        it("should return null if all pass", () => {
            const result = combineValidations([null, null, null]);
            expect(result).toBe(null);
        });
    });

    describe("getAllValidationErrors", () => {
        it("should return all errors", () => {
            const result = getAllValidationErrors([null, "Error 1", null, "Error 2"]);
            expect(result).toEqual(["Error 1", "Error 2"]);
        });

        it("should return empty array if no errors", () => {
            const result = getAllValidationErrors([null, null]);
            expect(result).toEqual([]);
        });
    });
});
