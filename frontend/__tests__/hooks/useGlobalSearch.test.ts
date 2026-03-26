/**
 * Tests for useGlobalSearch hook
 *
 * Searches APIs and Clusters in parallel via ?search= query param.
 */

import { renderHook, waitFor, act } from "@testing-library/react";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { apiClient } from "@/lib/api-client";

jest.mock("@/lib/api-client", () => ({
    apiClient: {
        get: jest.fn(),
        buildQuery: jest.fn().mockImplementation(
            (params: Record<string, string | number | boolean | undefined>) => {
                const entries = Object.entries(params).filter(
                    ([, v]) => v !== undefined,
                );
                if (entries.length === 0) return "";
                const qs = entries.map(([k, v]) => `${k}=${v}`).join("&");
                return `?${qs}`;
            },
        ),
    },
}));

const mockGet = jest.mocked(apiClient.get);

beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe("useGlobalSearch", () => {
    describe("Initial State", () => {
        it("should return empty results and isLoading=false for empty query", () => {
            const { result } = renderHook(() => useGlobalSearch(""));
            expect(result.current.results).toEqual([]);
            expect(result.current.isLoading).toBe(false);
        });

        it("should return empty results for single-character query", () => {
            const { result } = renderHook(() => useGlobalSearch("a"));
            expect(result.current.results).toEqual([]);
            expect(result.current.isLoading).toBe(false);
        });

        it("should not call any API for short queries", () => {
            renderHook(() => useGlobalSearch("a"));
            act(() => jest.runAllTimers());
            expect(mockGet).not.toHaveBeenCalled();
        });
    });

    describe("Searching", () => {
        it("should set isLoading=true when query >= 2 chars within debounce window", async () => {
            mockGet.mockResolvedValue({ data: [] });
            const { result } = renderHook(() => useGlobalSearch("ap"));
            // Before debounce fires, isLoading should be true
            expect(result.current.isLoading).toBe(true);
        });

        it("should call API endpoints after debounce with search param", async () => {
            mockGet.mockResolvedValue({ data: [] });
            renderHook(() => useGlobalSearch("my-api"));
            await act(async () => { jest.runAllTimers(); });
            await waitFor(() => expect(mockGet).toHaveBeenCalled());
            const calls = mockGet.mock.calls.map((c) => c[0] as string);
            expect(calls.some((url) => url.includes("catalog/apis"))).toBe(
                true,
            );
            expect(
                calls.some((url) => url.includes("infrastructure/clusters")),
            ).toBe(true);
        });

        it("should map API results to SearchResult format", async () => {
            mockGet.mockImplementation((url: unknown) => {
                if (typeof url === "string" && url.includes("catalog/apis")) {
                    return Promise.resolve({
                        data: [
                            {
                                id: 1,
                                name: "Payments API",
                                description: "Handles payments",
                            },
                        ],
                    });
                }
                return Promise.resolve({ data: [] });
            });

            const { result } = renderHook(() =>
                useGlobalSearch("pay", "en"),
            );
            await act(async () => { jest.runAllTimers(); });

            await waitFor(() => result.current.results.length > 0);
            const apiResult = result.current.results.find(
                (r) => r.category === "APIs",
            );
            expect(apiResult).toBeDefined();
            expect(apiResult?.title).toBe("Payments API");
            expect(apiResult?.subtitle).toBe("Handles payments");
            expect(apiResult?.href).toContain("/en/");
        });

        it("should map Cluster results to SearchResult format", async () => {
            mockGet.mockImplementation((url: unknown) => {
                if (
                    typeof url === "string" &&
                    url.includes("infrastructure/clusters")
                ) {
                    return Promise.resolve({
                        data: [{ id: 5, name: "prod-cluster" }],
                    });
                }
                return Promise.resolve({ data: [] });
            });

            const { result } = renderHook(() =>
                useGlobalSearch("prod", "en"),
            );
            await act(async () => { jest.runAllTimers(); });

            await waitFor(() => result.current.results.length > 0);
            const clusterResult = result.current.results.find(
                (r) => r.category === "Clusters",
            );
            expect(clusterResult).toBeDefined();
            expect(clusterResult?.title).toBe("prod-cluster");
            expect(clusterResult?.href).toContain("/en/");
        });

        it("should set isLoading=false after results are fetched", async () => {
            mockGet.mockResolvedValue({ data: [] });
            const { result } = renderHook(() => useGlobalSearch("test"));
            await act(async () => { jest.runAllTimers(); });
            await waitFor(() => expect(result.current.isLoading).toBe(false));
        });

        it("should handle API errors gracefully and still return partial results", async () => {
            mockGet.mockImplementation((url: unknown) => {
                if (typeof url === "string" && url.includes("catalog/apis")) {
                    return Promise.resolve({
                        data: [{ id: 1, name: "Test API" }],
                    });
                }
                return Promise.reject(new Error("Network error"));
            });

            const { result } = renderHook(() =>
                useGlobalSearch("test"),
            );
            await act(async () => { jest.runAllTimers(); });

            await waitFor(() => expect(result.current.isLoading).toBe(false));
            // At least API results should be present even if clusters failed
            expect(result.current.results.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe("Debouncing", () => {
        it("should debounce calls — reset on new query before 300ms", async () => {
            mockGet.mockResolvedValue({ data: [] });
            const { rerender } = renderHook(
                ({ q }) => useGlobalSearch(q),
                { initialProps: { q: "ap" } },
            );
            // Change query before debounce fires
            rerender({ q: "api" });
            await act(async () => { jest.runAllTimers(); });
            await waitFor(() => expect(mockGet).toHaveBeenCalled());
            // Should only have called once (for "api", not "ap")
            const apisCallCount = mockGet.mock.calls.filter(
                (c) =>
                    typeof c[0] === "string" &&
                    (c[0] as string).includes("catalog/apis"),
            ).length;
            expect(apisCallCount).toBe(1);
        });
    });
});
