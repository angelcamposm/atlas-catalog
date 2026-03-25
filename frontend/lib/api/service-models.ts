/**
 * API endpoints for managing Service Models
 */

import { apiClient } from "../api-client";
import {
    serviceModelResponseSchema,
    paginatedServiceModelResponseSchema,
} from "@/types/api";
import type {
    PaginatedServiceModelResponse,
    ServiceModelResponse,
    CreateServiceModelRequest,
    UpdateServiceModelRequest,
} from "@/types/api";

export const serviceModelsApi = {
    /**
     * Get all Service Models with pagination
     */
    getAll: async (page = 1): Promise<PaginatedServiceModelResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/service-models${apiClient.buildQuery({ page })}`
        );
        return paginatedServiceModelResponseSchema.parse(response);
    },

    /**
     * Get a single Service Model by ID
     */
    getById: async (id: number): Promise<ServiceModelResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/service-models/${id}`
        );
        return serviceModelResponseSchema.parse(response);
    },

    /**
     * Create a new Service Model
     */
    create: async (data: CreateServiceModelRequest): Promise<ServiceModelResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/catalog/service-models",
            data
        );
        return serviceModelResponseSchema.parse(response);
    },

    /**
     * Update an existing Service Model
     */
    update: async (
        id: number,
        data: UpdateServiceModelRequest
    ): Promise<ServiceModelResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/catalog/service-models/${id}`,
            data
        );
        return serviceModelResponseSchema.parse(response);
    },

    /**
     * Delete a Service Model
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/catalog/service-models/${id}`);
    },
};
