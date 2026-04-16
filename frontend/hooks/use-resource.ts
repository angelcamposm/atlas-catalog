"use client";

/**
 * Generic resource hooks shared by every domain module.
 *
 * They wrap a plain async fetcher so UI code does not have to
 * reinvent loading / error / refetch state for each endpoint.
 *
 * @example
 *   const { data, loading, error, refetch } = useResourceList(
 *     componentsApi.list,
 *     { filters: { lifecycle_id: 1 } },
 *   );
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiError } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api";

export interface ResourceListState<T> {
    data: PaginatedResponse<T> | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

export interface ResourceDetailState<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

type ListFetcher<T, P> = (params?: P) => Promise<PaginatedResponse<T>>;
type DetailFetcher<T, Id> = (id: Id) => Promise<{ data: T }>;

/**
 * Stable, serialisable snapshot of the params object so that param
 * changes trigger a refetch without relying on referential equality.
 */
function paramsSignature(params: unknown): string {
    if (params === undefined || params === null) return "";
    try {
        return JSON.stringify(params);
    } catch {
        return "";
    }
}

export function useResourceList<T, P = Record<string, unknown>>(
    fetcher: ListFetcher<T, P>,
    params?: P,
): ResourceListState<T> {
    const [data, setData] = useState<PaginatedResponse<T> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    // Keep the latest fetcher/params so refetch() always uses them
    // without forcing consumers to wrap callbacks in useCallback.
    const fetcherRef = useRef(fetcher);
    const paramsRef = useRef(params);
    fetcherRef.current = fetcher;
    paramsRef.current = params;

    const signature = paramsSignature(params);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcherRef.current(paramsRef.current);
            setData(result);
        } catch (err) {
            setError(err as ApiError);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load, signature]);

    return { data, loading, error, refetch: load };
}

export function useResourceDetail<T, Id = number | string>(
    fetcher: DetailFetcher<T, Id>,
    id: Id | null | undefined,
): ResourceDetailState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const load = useCallback(async () => {
        if (id === null || id === undefined) return;
        setLoading(true);
        setError(null);
        try {
            const result = await fetcherRef.current(id);
            setData(result.data);
        } catch (err) {
            setError(err as ApiError);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id === null || id === undefined) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }
        void load();
    }, [id, load]);

    return { data, loading, error, refetch: load };
}
