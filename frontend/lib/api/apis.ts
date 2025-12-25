/**
 * API endpoints for managing APIs
 */

import { apiClient } from "../api-client";
import { apiResponseSchema, paginatedApiResponseSchema } from "@/types/api";
import type {
    PaginatedApiResponse,
    ApiResponse,
    CreateApiRequest,
    UpdateApiRequest,
} from "@/types/api";

export const apisApi = {
    /**
     * Get all APIs with pagination
     */
    getAll: async (page = 1): Promise<PaginatedApiResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/apis${apiClient.buildQuery({ page })}`
        );
        return paginatedApiResponseSchema.parse(response);
    },

    /**
     * Get a single API by ID
     */
    getById: async (id: number): Promise<ApiResponse> => {
        const response = await apiClient.get<unknown>(`/v1/catalog/apis/${id}`);
        return apiResponseSchema.parse(response);
    },

    /**
     * Create a new API
     */
    create: async (data: CreateApiRequest): Promise<ApiResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/catalog/apis",
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Update an existing API
     */
    update: async (
        id: number,
        data: UpdateApiRequest
    ): Promise<ApiResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/catalog/apis/${id}`,
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Delete an API
     */
    delete: (id: number) => apiClient.delete(`/v1/catalog/apis/${id}`),
};
