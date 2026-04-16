/**
 * Shared helpers for API resource modules.
 *
 * These utilities centralise behaviours that every `lib/api/*.ts` client used to
 * implement ad-hoc:
 *
 *  - `buildQueryString`: turns a parameter bag into a Laravel-friendly query
 *    string. Supports scalar params, `with=a,b,c`, `sort=-name,created_at` and
 *    the `filter[key]=value` convention used throughout the backend.
 *  - `unwrap` / `unwrapPaginated`: peel the `{ data }` / `{ data, meta, links }`
 *    envelope Laravel Resources return.
 *  - `parseLaravelErrors`: normalise 422 validation errors into a predictable
 *    `{ message, fields }` shape consumable by forms.
 */

import { ApiError } from "@/lib/api-client";
import type { PaginationLinks, PaginationMeta } from "@/types/api";

// ---------------------------------------------------------------------------
// Query string builder
// ---------------------------------------------------------------------------

/** Scalar values accepted by the query builder. */
export type QueryScalar = string | number | boolean | null | undefined;

/** A map of scalar / array filter values. */
export type QueryFilters = Record<string, QueryScalar | QueryScalar[]>;

/** Params bag accepted by {@link buildQueryString}. */
export interface QueryParams {
    /** Page number (1-indexed). */
    page?: number;
    /** Items per page. */
    per_page?: number;
    /** Free-text search term. */
    search?: string;
    /** Relations to eager load (serialised as `with=a,b,c`). */
    with?: string[];
    /** Sort expression(s). Use `-field` for descending. */
    sort?: string[] | string;
    /** Laravel-style nested filters (`filter[key]=value`). */
    filter?: QueryFilters;
    /** Any additional top-level scalar params. */
    [key: string]: QueryScalar | QueryScalar[] | QueryFilters | undefined;
}

function isScalarDefined(
    value: QueryScalar,
): value is string | number | boolean {
    return value !== undefined && value !== null && value !== "";
}

function scalarToString(value: string | number | boolean): string {
    return typeof value === "string" ? value : String(value);
}

function serialiseArray(values: QueryScalar[]): string | undefined {
    const cleaned = values.filter(isScalarDefined).map(scalarToString);
    return cleaned.length > 0 ? cleaned.join(",") : undefined;
}

function pushTopLevel(
    entries: Array<[string, string]>,
    key: string,
    value: QueryScalar | QueryScalar[] | QueryFilters | undefined,
): void {
    if (Array.isArray(value)) {
        const joined = serialiseArray(value);
        if (joined !== undefined) entries.push([key, joined]);
        return;
    }
    if (typeof value === "object" && value !== null) {
        // Unexpected at top level; skip silently.
        return;
    }
    if (isScalarDefined(value)) {
        entries.push([key, scalarToString(value)]);
    }
}

function pushFilters(
    entries: Array<[string, string]>,
    filter: QueryFilters,
): void {
    for (const [key, raw] of Object.entries(filter)) {
        if (Array.isArray(raw)) {
            const joined = serialiseArray(raw);
            if (joined !== undefined) entries.push([`filter[${key}]`, joined]);
            continue;
        }
        if (isScalarDefined(raw)) {
            entries.push([`filter[${key}]`, scalarToString(raw)]);
        }
    }
}

/**
 * Build a query string (with leading `?`) for Laravel-style APIs.
 *
 * Returns an empty string when no parameter survives filtering.
 */
export function buildQueryString(params?: QueryParams): string {
    if (!params) return "";

    const entries: Array<[string, string]> = [];

    for (const [key, value] of Object.entries(params)) {
        if (key === "filter") continue;
        pushTopLevel(entries, key, value);
    }

    if (params.filter) pushFilters(entries, params.filter);

    if (entries.length === 0) return "";

    const query = entries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

    return `?${query}`;
}

// ---------------------------------------------------------------------------
// Envelope helpers
// ---------------------------------------------------------------------------

/** Shape of a Laravel single-resource response. */
export interface ResourceEnvelope<T> {
    data: T;
}

/** Shape of a Laravel paginated response. */
export interface PaginatedEnvelope<T> {
    data: T[];
    meta?: PaginationMeta;
    links?: PaginationLinks;
}

function hasDataProperty<T>(value: unknown): value is ResourceEnvelope<T> {
    return (
        typeof value === "object" &&
        value !== null &&
        "data" in (value as Record<string, unknown>)
    );
}

/** Return `response.data` when wrapped, or the value itself otherwise. */
export function unwrap<T>(response: ResourceEnvelope<T> | T): T {
    if (hasDataProperty<T>(response)) return response.data;
    return response;
}

/** Peel a paginated envelope, synthesising defaults when meta/links missing. */
export function unwrapPaginated<T>(
    response: PaginatedEnvelope<T>,
): Required<Pick<PaginatedEnvelope<T>, "data">> & {
    meta: PaginationMeta;
    links: PaginationLinks;
} {
    const data = response.data ?? [];
    const meta: PaginationMeta = response.meta ?? {
        current_page: 1,
        from: data.length > 0 ? 1 : 0,
        to: data.length,
        per_page: data.length || 15,
        total: data.length,
        last_page: 1,
        path: "",
    };
    const links: PaginationLinks = response.links ?? {
        first: "",
        last: "",
        prev: null,
        next: null,
    };
    return { data, meta, links };
}

// ---------------------------------------------------------------------------
// Error normalisation
// ---------------------------------------------------------------------------

/** Normalised shape for form consumption. */
export interface NormalisedValidationError {
    message: string;
    fields: Record<string, string[]>;
}

interface Laravel422Payload {
    message?: string;
    errors?: Record<string, string[]>;
}

function is422Payload(value: unknown): value is Laravel422Payload {
    return typeof value === "object" && value !== null;
}

/**
 * Normalise any thrown error into `{ message, fields }`. Laravel's 422
 * responses ship a `{ message, errors: { field: [msg] } }` body; everything
 * else falls back to a message-only entry with an empty `fields` map.
 */
export function parseLaravelErrors(error: unknown): NormalisedValidationError {
    if (error instanceof ApiError) {
        if (error.status === 422 && is422Payload(error.data)) {
            return {
                message: error.data.message ?? error.message,
                fields: error.data.errors ?? {},
            };
        }
        return { message: error.message, fields: {} };
    }

    if (error instanceof Error) {
        return { message: error.message, fields: {} };
    }

    return { message: "Unexpected error", fields: {} };
}
