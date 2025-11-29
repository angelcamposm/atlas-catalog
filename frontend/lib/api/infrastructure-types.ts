/**
 * API endpoints for managing Infrastructure Types
 */

import { apiClient } from "../api-client";
import {
    infrastructureTypeResponseSchema,
    paginatedInfrastructureTypeResponseSchema,
} from "@/types/api";
import type {
    InfrastructureTypeResponse,
    PaginatedInfrastructureTypeResponse,
    CreateInfrastructureTypeRequest,
    UpdateInfrastructureTypeRequest,
} from "@/types/api";

// Infrastructure Types -----------------------------------------------------

export const infrastructureTypesApi = {
    /**
     * Get all infrastructure types with pagination
     */
    getAll: async (page = 1): Promise<PaginatedInfrastructureTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure-types${apiClient.buildQuery({ page })}`
        );
        return paginatedInfrastructureTypeResponseSchema.parse(response);
    },

    /**
     * Get a single infrastructure type by ID
     */
    getById: async (id: number): Promise<InfrastructureTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/infrastructure-types/${id}`
        );
        return infrastructureTypeResponseSchema.parse(response);
    },

    /**
     * Create a new infrastructure type
     */
    create: async (
        data: CreateInfrastructureTypeRequest
    ): Promise<InfrastructureTypeResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/infrastructure-types",
            data
        );
        return infrastructureTypeResponseSchema.parse(response);
    },

    /**
     * Update an existing infrastructure type
     */
    update: async (
        id: number,
        data: UpdateInfrastructureTypeRequest
    ): Promise<InfrastructureTypeResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/infrastructure-types/${id}`,
            data
        );
        return infrastructureTypeResponseSchema.parse(response);
    },

    /**
     * Delete an infrastructure type
     */
    delete: (id: number) => apiClient.delete(`/v1/infrastructure-types/${id}`),
};
