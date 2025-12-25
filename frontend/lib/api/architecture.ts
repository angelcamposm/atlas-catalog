/**
 * API endpoints for managing Architecture domain
 */

import { apiClient } from "../api-client";
import { apiResponseSchema, paginatedApiResponseSchema } from "@/types/api";
import type {
    PaginatedApiResponse,
    ApiResponse,
    CreateBusinessCapabilityRequest,
    UpdateBusinessCapabilityRequest,
    CreateEntityRequest,
    UpdateEntityRequest,
    CreateSystemRequest,
    UpdateSystemRequest,
} from "@/types/api";

export const businessCapabilitiesApi = {
    /**
     * Get all Business Capabilities with pagination
     */
    getAll: async (page = 1): Promise<PaginatedApiResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-capabilities${apiClient.buildQuery({
                page,
            })}`
        );
        return paginatedApiResponseSchema.parse(response);
    },

    /**
     * Get a single Business Capability by ID
     */
    getById: async (id: number): Promise<ApiResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-capabilities/${id}`
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Create a new Business Capability
     */
    create: async (
        data: CreateBusinessCapabilityRequest
    ): Promise<ApiResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/business-capabilities",
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Update an existing Business Capability
     */
    update: async (
        id: number,
        data: UpdateBusinessCapabilityRequest
    ): Promise<ApiResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/business-capabilities/${id}`,
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Delete a Business Capability
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/architecture/business-capabilities/${id}`);
    },
};

export const entitiesApi = {
    /**
     * Get all Entities with pagination
     */
    getAll: async (page = 1): Promise<PaginatedApiResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/entities${apiClient.buildQuery({ page })}`
        );
        return paginatedApiResponseSchema.parse(response);
    },

    /**
     * Get a single Entity by ID
     */
    getById: async (id: number): Promise<ApiResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/entities/${id}`
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Create a new Entity
     */
    create: async (data: CreateEntityRequest): Promise<ApiResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/entities",
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Update an existing Entity
     */
    update: async (
        id: number,
        data: UpdateEntityRequest
    ): Promise<ApiResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/entities/${id}`,
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Delete an Entity
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/architecture/entities/${id}`);
    },
};

export const systemsApi = {
    /**
     * Get all Systems with pagination
     */
    getAll: async (page = 1): Promise<PaginatedApiResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/systems${apiClient.buildQuery({ page })}`
        );
        return paginatedApiResponseSchema.parse(response);
    },

    /**
     * Get a single System by ID
     */
    getById: async (id: number): Promise<ApiResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/systems/${id}`
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Create a new System
     */
    create: async (data: CreateSystemRequest): Promise<ApiResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/systems",
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Update an existing System
     */
    update: async (
        id: number,
        data: UpdateSystemRequest
    ): Promise<ApiResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/systems/${id}`,
            data
        );
        return apiResponseSchema.parse(response);
    },

    /**
     * Delete a System
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/architecture/systems/${id}`);
    },
};
