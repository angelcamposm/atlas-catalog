/**
 * Tests for lib/api/_shared.ts
 *
 * Shared helpers for every resource API module:
 *  - buildQueryString: Laravel-flavoured query builder (filter[x]=y, with, sort, search, page, per_page).
 *  - unwrap / unwrapPaginated: peel the `{ data }` / `{ data, meta, links }` envelope.
 *  - parseLaravelErrors: turn a 422 ApiError into a FieldErrors map.
 */

import { ApiError } from "@/lib/api-client";
import {
    buildQueryString,
    parseLaravelErrors,
    unwrap,
    unwrapPaginated,
} from "@/lib/api/_shared";

describe("buildQueryString", () => {
    it("returns an empty string when there are no params", () => {
        expect(buildQueryString({})).toBe("");
        expect(buildQueryString(undefined)).toBe("");
    });

    it("serialises scalar params", () => {
        expect(
            buildQueryString({ page: 2, per_page: 25, search: "catalog" }),
        ).toBe("?page=2&per_page=25&search=catalog");
    });

    it("skips undefined, null and empty strings", () => {
        expect(
            buildQueryString({
                page: 1,
                search: undefined,
                status: null,
                owner: "",
            }),
        ).toBe("?page=1");
    });

    it("serialises booleans as 'true' / 'false'", () => {
        expect(
            buildQueryString({ is_exposed: true, is_stateless: false }),
        ).toBe("?is_exposed=true&is_stateless=false");
    });

    it("joins 'with' arrays with commas", () => {
        expect(
            buildQueryString({ with: ["domain", "platform", "owner"] }),
        ).toBe("?with=domain%2Cplatform%2Cowner");
    });

    it("joins 'sort' arrays with commas for Laravel multi-sort", () => {
        expect(buildQueryString({ sort: ["-created_at", "name"] })).toBe(
            "?sort=-created_at%2Cname",
        );
    });

    it("emits filter[key]=value entries for the 'filter' object", () => {
        expect(
            buildQueryString({
                filter: { type_id: 3, is_enabled: true, search: "auth" },
            }),
        ).toBe(
            "?filter%5Btype_id%5D=3&filter%5Bis_enabled%5D=true&filter%5Bsearch%5D=auth",
        );
    });

    it("supports array values inside filter as comma-joined lists", () => {
        expect(buildQueryString({ filter: { status: ["active", "beta"] } })).toBe(
            "?filter%5Bstatus%5D=active%2Cbeta",
        );
    });

    it("combines top-level and filter params without clobbering", () => {
        expect(
            buildQueryString({
                page: 1,
                per_page: 15,
                filter: { domain_id: 2 },
                with: ["apis"],
            }),
        ).toBe(
            "?page=1&per_page=15&with=apis&filter%5Bdomain_id%5D=2",
        );
    });
});

describe("unwrap", () => {
    it("returns `response.data` when the envelope is present", () => {
        expect(unwrap({ data: { id: 1, name: "api" } })).toEqual({
            id: 1,
            name: "api",
        });
    });

    it("returns the value unchanged when there is no envelope", () => {
        expect(unwrap({ id: 2 })).toEqual({ id: 2 });
    });
});

describe("unwrapPaginated", () => {
    it("extracts data, meta and links from a paginated envelope", () => {
        const page = {
            data: [{ id: 1 }, { id: 2 }],
            meta: {
                current_page: 1,
                from: 1,
                to: 2,
                per_page: 15,
                total: 42,
                last_page: 3,
                path: "/api/v1/items",
            },
            links: { first: "a", last: "b", prev: null, next: "c" },
        };

        expect(unwrapPaginated(page)).toEqual({
            data: [{ id: 1 }, { id: 2 }],
            meta: page.meta,
            links: page.links,
        });
    });

    it("falls back to empty meta / links when they are missing", () => {
        const result = unwrapPaginated({ data: [{ id: 9 }] });
        expect(result.data).toEqual([{ id: 9 }]);
        expect(result.meta?.current_page).toBe(1);
        expect(result.meta?.total).toBe(1);
    });
});

describe("parseLaravelErrors", () => {
    it("extracts field errors from a 422 ApiError", () => {
        const error = new ApiError("Validation failed", 422, {
            message: "The given data was invalid.",
            errors: {
                name: ["The name field is required."],
                "owner.id": ["The owner id must be an integer."],
            },
        });

        const result = parseLaravelErrors(error);

        expect(result.message).toBe("The given data was invalid.");
        expect(result.fields).toEqual({
            name: ["The name field is required."],
            "owner.id": ["The owner id must be an integer."],
        });
    });

    it("returns an empty fields map when the error is not 422", () => {
        const error = new ApiError("Not found", 404, {});
        expect(parseLaravelErrors(error)).toEqual({
            message: "Not found",
            fields: {},
        });
    });

    it("handles unknown errors without throwing", () => {
        expect(parseLaravelErrors(new Error("boom"))).toEqual({
            message: "boom",
            fields: {},
        });
        expect(parseLaravelErrors("weird")).toEqual({
            message: "Unexpected error",
            fields: {},
        });
    });
});
