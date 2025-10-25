import { apiClient } from "@/lib/api-client";

describe("apiClient.buildQuery", () => {
    it("returns an empty string when no params provided", () => {
        expect(apiClient.buildQuery({})).toBe("");
    });

    it("builds a query string for defined params", () => {
        const query = apiClient.buildQuery({ page: 2, search: "catalog" });
        expect(query).toBe("?page=2&search=catalog");
    });

    it("ignores undefined or null values", () => {
        const query = apiClient.buildQuery({ page: 1, search: undefined });
        expect(query).toBe("?page=1");
    });

    it("serializes boolean values", () => {
        const query = apiClient.buildQuery({ includeArchived: false });
        expect(query).toBe("?includeArchived=false");
    });
});
