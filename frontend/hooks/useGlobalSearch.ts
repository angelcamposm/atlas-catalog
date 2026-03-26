/**
 * useGlobalSearch — Searches APIs and Clusters in parallel via backend search.
 *
 * Debounces requests by 300ms. Requires >= 2 characters.
 *
 * @param query - Search term typed by the user
 * @param locale - Locale for building hrefs (default: "en")
 * @returns { results, isLoading }
 *
 * @example
 * const { results, isLoading } = useGlobalSearch(query, locale);
 */

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export interface SearchResult {
    /** Unique identifier (format: "<category>-<id>") */
    id: string;
    /** Display title */
    title: string;
    /** Optional subtitle or description */
    subtitle?: string;
    /** Navigation URL */
    href: string;
    /** Result category (e.g. "APIs", "Clusters") */
    category: string;
}

interface ApiEntry {
    id: number;
    name: string;
    description?: string | null;
}

interface ClusterEntry {
    id: number;
    name: string;
    display_name?: string | null;
}

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

export function useGlobalSearch(
    query: string,
    locale: string = "en",
): { results: SearchResult[]; isLoading: boolean } {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (query.length < MIN_QUERY_LENGTH) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const timer = setTimeout(async () => {
            try {
                const searchParam = apiClient.buildQuery({ search: query });
                const [apisRes, clustersRes] = await Promise.allSettled([
                    apiClient.get(
                        `/v1/catalog/apis${searchParam}`,
                    ) as Promise<{ data: ApiEntry[] }>,
                    apiClient.get(
                        `/v1/infrastructure/clusters${searchParam}`,
                    ) as Promise<{ data: ClusterEntry[] }>,
                ]);

                const newResults: SearchResult[] = [];

                if (apisRes.status === "fulfilled") {
                    for (const api of apisRes.value.data ?? []) {
                        newResults.push({
                            id: `api-${api.id}`,
                            title: api.name,
                            subtitle: api.description ?? undefined,
                            href: `/${locale}/catalog/apis/${api.id}`,
                            category: "APIs",
                        });
                    }
                }

                if (clustersRes.status === "fulfilled") {
                    for (const cluster of clustersRes.value.data ?? []) {
                        newResults.push({
                            id: `cluster-${cluster.id}`,
                            title: cluster.name,
                            subtitle: cluster.display_name ?? undefined,
                            href: `/${locale}/infrastructure/clusters/${cluster.id}`,
                            category: "Clusters",
                        });
                    }
                }

                setResults(newResults);
            } finally {
                setIsLoading(false);
            }
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [query, locale]);

    return { results, isLoading };
}
