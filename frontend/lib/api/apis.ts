/**
 * APIs API Module
 *
 * Consumes the `/v1/catalog/apis` endpoints.
 * Thin wrapper over `apiClient` using `_shared.buildQueryString` for query
 * composition. Mirrors the lean pattern of `components.ts`.
 */

import { apiClient } from "../api-client";
import { buildQueryString } from "./_shared";
import type { Api, Component, PaginatedResponse } from "@/types/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApisQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    category_id?: number;
    type_id?: number;
    status_id?: number;
    protocol?: string;
    access_policy_id?: number;
    authentication_method_id?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    with?: string[];
}

export interface CreateApiData {
    name: string;
    display_name?: string;
    description?: string;
    url?: string;
    version?: string;
    protocol?: string;
    document_specification?: Record<string, unknown> | string;
    released_at?: string;
    access_policy_id?: number;
    authentication_method_id?: number;
    category_id?: number;
    status_id?: number;
    type_id?: number;
}

export type UpdateApiData = Partial<CreateApiData> & {
    deprecated_at?: string;
    deprecated_by?: number;
    deprecation_reason?: string;
};

export interface ApiWithRelations extends Api {
    category?: { id: number; name: string } | null;
    type?: { id: number; name: string } | null;
    status?: { id: number; name: string } | null;
    access_policy?: { id: number; name: string } | null;
    authentication_method?: { id: number; name: string } | null;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export const apisApi = {
    /**
     * List APIs with optional filters and pagination.
     */
    async getAll(
        params: ApisQueryParams = {},
    ): Promise<PaginatedResponse<Api>> {
        const qs = buildQueryString(params);
        return apiClient.get<PaginatedResponse<Api>>(
            `/v1/catalog/apis${qs}`,
        );
    },

    /**
     * Fetch a single API by numeric ID.
     * @param id API ID
     * @param withRelations Optional list of relations to eager-load
     */
    async getById(
        id: number,
        withRelations?: string[],
    ): Promise<{ data: ApiWithRelations }> {
        const qs = withRelations?.length
            ? buildQueryString({ with: withRelations })
            : "";
        return apiClient.get<{ data: ApiWithRelations }>(
            `/v1/catalog/apis/${id}${qs}`,
        );
    },

    /**
     * Create a new API.
     */
    async create(data: CreateApiData): Promise<{ data: Api }> {
        return apiClient.post<{ data: Api }>("/v1/catalog/apis", data);
    },

    /**
     * Update an existing API.
     */
    async update(
        id: number,
        data: UpdateApiData,
    ): Promise<{ data: Api }> {
        return apiClient.put<{ data: Api }>(`/v1/catalog/apis/${id}`, data);
    },

    /**
     * Delete an API.
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(`/v1/catalog/apis/${id}`);
    },

    /**
     * List components associated with a given API.
     */
    async getComponents(
        apiId: number,
    ): Promise<PaginatedResponse<Component>> {
        return apiClient.get<PaginatedResponse<Component>>(
            `/v1/catalog/apis/${apiId}/components`,
        );
    },
};
