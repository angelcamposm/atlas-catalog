/**
 * API endpoints for managing Service Models
 */

import { apiClient } from "../api-client";
import { apiResponseSchema, paginatedApiResponseSchema } from "@/types/api";
import type {
    PaginatedApiResponse,
    ApiResponse,
    CreateServiceModelRequest,
    UpdateServiceModelRequest,
} from "@/types/api";

export const serviceModelsApi = {
    /**
     * Get all Service Models with pagination
     */
    getAll: async (page = 1): Promise<PaginatedApiResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/service-models${apiClient.buildQuery({ page })}`
        );
        return paginatedApiResponseSchema.parse(response);
    },

    /**
     * Get a single Service Model by ID
     */
    getById: async (id: number): Promise<ApiResponse> => {
        const response = await apiClient.get<unknown>(`/v1/catalog/service-models/${id}`);
        return apiResponseSchema.parse(response);
    },

    /**
     * Create a new Service Model
     */
    create: async (data: CreateServiceModelRequest): Promise<ApiResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/catalog/service-models",
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Update an existing Service Model
     */
    update: async (
        id: number,
        data: UpdateServiceModelRequest
    ): Promise<ApiResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/catalog/service-models/${id}`,
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Delete a Service Model
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/catalog/service-models/${id}`);
    },
};