/**
 * API endpoints for managing Lifecycles
 */

import { apiClient } from "../api-client";
import {
    lifecycleResponseSchema,
    paginatedLifecycleResponseSchema,
} from "@/types/api";
import type {
    LifecycleResponse,
    PaginatedLifecycleResponse,
    CreateLifecycleRequest,
    UpdateLifecycleRequest,
} from "@/types/api";

export const lifecyclesApi = {
    /**
     * Get all Lifecycles with pagination
     */
    getAll: async (page = 1): Promise<PaginatedLifecycleResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/lifecycles${apiClient.buildQuery({ page })}`
        );
        return paginatedLifecycleResponseSchema.parse(response);
    },

    /**
     * Get a single Lifecycle by ID
     */
    getById: async (id: number): Promise<LifecycleResponse> => {
        const response = await apiClient.get<unknown>(`/v1/architecture/lifecycles/${id}`);
        return lifecycleResponseSchema.parse(response);
    },

    /**
     * Create a new Lifecycle
     */
    create: async (
        data: CreateLifecycleRequest
    ): Promise<LifecycleResponse> => {
        const response = await apiClient.post<unknown>("/v1/architecture/lifecycles", data);
        return lifecycleResponseSchema.parse(response);
    },

    /**
     * Update an existing Lifecycle
     */
    update: async (
        id: number,
        data: UpdateLifecycleRequest
    ): Promise<LifecycleResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/lifecycles/${id}`,
            data
        );
        return lifecycleResponseSchema.parse(response);
    },

    /**
     * Delete a Lifecycle
     */
    delete: (id: number) => apiClient.delete(`/v1/architecture/lifecycles/${id}`),
};
