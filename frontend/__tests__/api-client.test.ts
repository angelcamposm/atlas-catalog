import { apiClient } from "@/lib/api-client";

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock fetch for token injection tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

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

describe("apiClient — Bearer token injection", () => {
    beforeEach(() => {
        localStorageMock.clear();
        mockFetch.mockReset();
    });

    it("does not add Authorization header when no token in localStorage", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [] }),
        });

        await apiClient.get("/v1/test");

        const callHeaders = mockFetch.mock.calls[0][1].headers;
        expect(callHeaders?.Authorization).toBeUndefined();
        expect(callHeaders?.authorization).toBeUndefined();
    });

    it("injects Authorization: Bearer <token> when token is in localStorage", async () => {
        localStorageMock.setItem("auth_token", "my-secret-token");
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [] }),
        });

        await apiClient.get("/v1/test");

        const callHeaders = mockFetch.mock.calls[0][1].headers;
        expect(callHeaders?.Authorization).toBe("Bearer my-secret-token");
    });

    it("sends different tokens per request (no caching)", async () => {
        localStorageMock.setItem("auth_token", "token-one");
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
        await apiClient.get("/v1/first");

        localStorageMock.setItem("auth_token", "token-two");
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
        await apiClient.get("/v1/second");

        expect(mockFetch.mock.calls[0][1].headers?.Authorization).toBe("Bearer token-one");
        expect(mockFetch.mock.calls[1][1].headers?.Authorization).toBe("Bearer token-two");
    });
});

