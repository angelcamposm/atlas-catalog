/**
 * Tests for useResourceList and useResourceDetail generic hooks.
 *
 * These hooks wrap any resource-fetcher function with consistent
 * loading / error / data state so every domain module in the app
 * can reuse them without duplicating boilerplate.
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { useResourceDetail, useResourceList } from "@/hooks/use-resource";
import { ApiError } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api";

interface Thing {
    id: number;
    name: string;
}

function paginated(items: Thing[]): PaginatedResponse<Thing> {
    return {
        data: items,
        links: { first: null, last: null, prev: null, next: null },
        meta: {
            current_page: 1,
            from: items.length ? 1 : null,
            last_page: 1,
            path: "http://localhost/things",
            per_page: 15,
            to: items.length || null,
            total: items.length,
        },
    };
}

describe("useResourceList", () => {
    it("starts in loading state and resolves with data", async () => {
        const fetcher = jest
            .fn()
            .mockResolvedValue(paginated([{ id: 1, name: "A" }]));

        const { result } = renderHook(() =>
            useResourceList<Thing>(fetcher, { page: 1 }),
        );

        expect(result.current.loading).toBe(true);
        expect(result.current.data).toBeNull();

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(fetcher).toHaveBeenCalledWith({ page: 1 });
        expect(result.current.data?.data).toEqual([{ id: 1, name: "A" }]);
        expect(result.current.error).toBeNull();
    });

    it("exposes ApiError on failure", async () => {
        const err = new ApiError("boom", 500);
        const fetcher = jest.fn().mockRejectedValue(err);

        const { result } = renderHook(() => useResourceList<Thing>(fetcher));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe(err);
        expect(result.current.data).toBeNull();
    });

    it("refetches when params change", async () => {
        const fetcher = jest
            .fn()
            .mockResolvedValueOnce(paginated([{ id: 1, name: "A" }]))
            .mockResolvedValueOnce(paginated([{ id: 2, name: "B" }]));

        const { result, rerender } = renderHook(
            ({ params }) => useResourceList<Thing>(fetcher, params),
            { initialProps: { params: { page: 1 } } },
        );

        await waitFor(() => expect(result.current.data?.data[0]?.id).toBe(1));

        rerender({ params: { page: 2 } });

        await waitFor(() => expect(result.current.data?.data[0]?.id).toBe(2));
        expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it("allows manual refetch", async () => {
        const fetcher = jest
            .fn()
            .mockResolvedValue(paginated([{ id: 1, name: "A" }]));

        const { result } = renderHook(() => useResourceList<Thing>(fetcher));
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.refetch();
        });

        expect(fetcher).toHaveBeenCalledTimes(2);
    });
});

describe("useResourceDetail", () => {
    it("skips the fetch when the id is nullish", () => {
        const fetcher = jest.fn();

        const { result } = renderHook(() =>
            useResourceDetail<Thing>(fetcher, null),
        );

        expect(fetcher).not.toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
    });

    it("loads the resource when an id is provided", async () => {
        const fetcher = jest
            .fn()
            .mockResolvedValue({ data: { id: 7, name: "X" } });

        const { result } = renderHook(() =>
            useResourceDetail<Thing>(fetcher, 7),
        );

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(fetcher).toHaveBeenCalledWith(7);
        expect(result.current.data).toEqual({ id: 7, name: "X" });
    });

    it("captures ApiError and keeps data null", async () => {
        const err = new ApiError("nope", 404);
        const fetcher = jest.fn().mockRejectedValue(err);

        const { result } = renderHook(() =>
            useResourceDetail<Thing>(fetcher, 42),
        );

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe(err);
        expect(result.current.data).toBeNull();
    });
});
