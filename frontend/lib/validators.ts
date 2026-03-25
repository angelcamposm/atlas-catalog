/**
 * Validation utilities for Atlas Catalog frontend
 */

/**
 * Check if a value is a valid email address
 * @param email - Email string to validate
 */
export function isValidEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if a value is a valid URL
 * @param url - URL string to validate
 */
export function isValidUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if a value is a valid IP address (IPv4 or IPv6)
 * @param ip - IP address string to validate
 */
export function isValidIpAddress(ip: string | null | undefined): boolean {
    if (!ip) return false;

    // IPv4 pattern
    const ipv4Regex =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // Simplified IPv6 pattern
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    // IPv6 with :: shorthand (simplified)
    const ipv6ShortRegex =
        /^(?:[0-9a-fA-F]{1,4}:)*(?::[0-9a-fA-F]{1,4})*$|^::$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ipv6ShortRegex.test(ip);
}

/**
 * Check if a value is a valid UUID
 * @param uuid - UUID string to validate
 */
export function isValidUuid(uuid: string | null | undefined): boolean {
    if (!uuid) return false;
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

/**
 * Check if a value is a valid semantic version
 * @param version - Version string to validate
 */
export function isValidSemanticVersion(
    version: string | null | undefined
): boolean {
    if (!version) return false;
    // Optionally starts with 'v', then major.minor.patch with optional pre-release and build
    const semverRegex =
        /^v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/;
    return semverRegex.test(version);
}

/**
 * Check if a value is a valid hostname
 * @param hostname - Hostname string to validate
 */
export function isValidHostname(hostname: string | null | undefined): boolean {
    if (!hostname) return false;
    // RFC 1123 compliant hostname
    const hostnameRegex =
        /^(?=.{1,253}$)(?:(?![0-9]+$)(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)*(?!-)[a-zA-Z0-9-]{1,63}(?<!-)$/;
    return hostnameRegex.test(hostname);
}

/**
 * Check if a value is a valid port number
 * @param port - Port number to validate
 */
export function isValidPort(port: number | string | null | undefined): boolean {
    if (port === null || port === undefined) return false;
    const portNum = typeof port === "string" ? parseInt(port, 10) : port;
    return !isNaN(portNum) && portNum >= 0 && portNum <= 65535;
}

/**
 * Check if a value is empty (null, undefined, empty string, or empty array/object)
 * @param value - Value to check
 */
export function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
}

/**
 * Check if a value is not empty
 * @param value - Value to check
 */
export function isNotEmpty(value: unknown): boolean {
    return !isEmpty(value);
}

/**
 * Check if a string contains only alphanumeric characters
 * @param str - String to check
 */
export function isAlphanumeric(str: string | null | undefined): boolean {
    if (!str) return false;
    return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Check if a string is a valid slug (lowercase letters, numbers, and dashes)
 * @param str - String to check
 */
export function isValidSlug(str: string | null | undefined): boolean {
    if (!str) return false;
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str);
}

/**
 * Check if a string is a valid namespace (lowercase letters, numbers, and dashes, max 63 chars)
 * @param namespace - Namespace string to check
 */
export function isValidNamespace(
    namespace: string | null | undefined
): boolean {
    if (!namespace) return false;
    if (namespace.length > 63) return false;
    return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(namespace);
}

/**
 * Check if a number is within a range (inclusive)
 * @param value - Number to check
 * @param min - Minimum value
 * @param max - Maximum value
 */
export function isInRange(
    value: number | null | undefined,
    min: number,
    max: number
): boolean {
    if (value === null || value === undefined) return false;
    return value >= min && value <= max;
}

/**
 * Check if a string length is within bounds
 * @param str - String to check
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 */
export function isLengthInRange(
    str: string | null | undefined,
    minLength: number,
    maxLength: number
): boolean {
    if (!str) return minLength === 0;
    return str.length >= minLength && str.length <= maxLength;
}

/**
 * Check if a date string is in the future
 * @param dateString - ISO date string
 */
export function isFutureDate(
    dateString: string | Date | null | undefined
): boolean {
    if (!dateString) return false;
    try {
        const date =
            typeof dateString === "string" ? new Date(dateString) : dateString;
        if (isNaN(date.getTime())) return false;
        return date.getTime() > Date.now();
    } catch {
        return false;
    }
}

/**
 * Check if a date string is in the past
 * @param dateString - ISO date string
 */
export function isPastDate(
    dateString: string | Date | null | undefined
): boolean {
    if (!dateString) return false;
    try {
        const date =
            typeof dateString === "string" ? new Date(dateString) : dateString;
        if (isNaN(date.getTime())) return false;
        return date.getTime() < Date.now();
    } catch {
        return false;
    }
}

/**
 * Validate a required field
 * @param value - Value to check
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateRequired(
    value: unknown,
    fieldName: string
): string | null {
    if (isEmpty(value)) {
        return `${fieldName} is required`;
    }
    return null;
}

/**
 * Validate minimum string length
 * @param value - String to check
 * @param minLength - Minimum length
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateMinLength(
    value: string | null | undefined,
    minLength: number,
    fieldName: string
): string | null {
    if (!value || value.length < minLength) {
        return `${fieldName} must be at least ${minLength} characters`;
    }
    return null;
}

/**
 * Validate maximum string length
 * @param value - String to check
 * @param maxLength - Maximum length
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateMaxLength(
    value: string | null | undefined,
    maxLength: number,
    fieldName: string
): string | null {
    if (value && value.length > maxLength) {
        return `${fieldName} must be at most ${maxLength} characters`;
    }
    return null;
}

/**
 * Validate email format
 * @param email - Email to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateEmail(
    email: string | null | undefined,
    fieldName = "Email"
): string | null {
    if (!email) return null; // Use validateRequired for required check
    if (!isValidEmail(email)) {
        return `${fieldName} is not a valid email address`;
    }
    return null;
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message or null if valid
 */
export function validateUrl(
    url: string | null | undefined,
    fieldName = "URL"
): string | null {
    if (!url) return null; // Use validateRequired for required check
    if (!isValidUrl(url)) {
        return `${fieldName} is not a valid URL`;
    }
    return null;
}

/**
 * Combine multiple validation results
 * @param validations - Array of validation results (error messages or null)
 * @returns First error message found, or null if all validations pass
 */
export function combineValidations(
    validations: (string | null)[]
): string | null {
    for (const validation of validations) {
        if (validation !== null) {
            return validation;
        }
    }
    return null;
}

/**
 * Get all validation errors
 * @param validations - Array of validation results (error messages or null)
 * @returns Array of error messages (empty if all validations pass)
 */
export function getAllValidationErrors(
    validations: (string | null)[]
): string[] {
    return validations.filter((v): v is string => v !== null);
}
