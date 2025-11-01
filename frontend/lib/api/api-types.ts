/**
 * API endpoints for managing API Types
 */

import { apiClient } from "../api-client";
import {
    apiTypeResponseSchema,
    paginatedApiTypeResponseSchema,
} from "@/types/api";
import type {
    ApiTypeResponse,
    PaginatedApiTypeResponse,
    CreateApiTypeRequest,
    UpdateApiTypeRequest,
} from "@/types/api";

export const apiTypesApi = {
    /**
     * Get all API Types with pagination
     */
    getAll: async (page = 1): Promise<PaginatedApiTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/api-types${apiClient.buildQuery({ page })}`
        );
        return paginatedApiTypeResponseSchema.parse(response);
    },

    /**
     * Get a single API Type by ID
     */
    getById: async (id: number): Promise<ApiTypeResponse> => {
        const response = await apiClient.get<unknown>(`/v1/api-types/${id}`);
        return apiTypeResponseSchema.parse(response);
    },

    /**
     * Create a new API Type
     */
    create: async (data: CreateApiTypeRequest): Promise<ApiTypeResponse> => {
        const response = await apiClient.post<unknown>("/v1/api-types", data);
        return apiTypeResponseSchema.parse(response);
    },

    /**
     * Update an existing API Type
     */
    update: async (
        id: number,
        data: UpdateApiTypeRequest
    ): Promise<ApiTypeResponse> => {
        const response = await apiClient.put<unknown>(`/v1/api-types/${id}`, data);
        return apiTypeResponseSchema.parse(response);
    },

    /**
     * Delete an API Type
     */
    delete: (id: number) => apiClient.delete(`/v1/api-types/${id}`),
};
