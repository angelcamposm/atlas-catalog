/**
 * API endpoints for managing Platform resources
 * Includes: Platforms and Component Types
 */

import { apiClient } from "../api-client";
import {
    platformResponseSchema,
    paginatedPlatformResponseSchema,
    componentTypeResponseSchema,
    paginatedComponentTypeResponseSchema,
} from "@/types/api";
import type {
    PlatformResponse,
    PaginatedPlatformResponse,
    CreatePlatformRequest,
    UpdatePlatformRequest,
    ComponentTypeResponse,
    PaginatedComponentTypeResponse,
    CreateComponentTypeRequest,
    UpdateComponentTypeRequest,
} from "@/types/api";

// Platforms ----------------------------------------------------------------

export const platformsApi = {
    /**
     * Get all platforms with pagination
     */
    getAll: async (page = 1): Promise<PaginatedPlatformResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/platforms${apiClient.buildQuery({ page })}`
        );
        return paginatedPlatformResponseSchema.parse(response);
    },

    /**
     * Get a single platform by ID
     */
    getById: async (id: number): Promise<PlatformResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/platforms/${id}`
        );
        return platformResponseSchema.parse(response);
    },

    /**
     * Create a new platform
     */
    create: async (data: CreatePlatformRequest): Promise<PlatformResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/catalog/platforms",
            data
        );
        return platformResponseSchema.parse(response);
    },

    /**
     * Update an existing platform
     */
    update: async (
        id: number,
        data: UpdatePlatformRequest
    ): Promise<PlatformResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/catalog/platforms/${id}`,
            data
        );
        return platformResponseSchema.parse(response);
    },

    /**
     * Delete a platform
     */
    delete: (id: number) => apiClient.delete(`/v1/catalog/platforms/${id}`),
};

// Component Types ----------------------------------------------------------
// Backend endpoint: /v1/catalog/components/types

export const componentTypesApi = {
    /**
     * Get all component types with pagination
     */
    getAll: async (page = 1): Promise<PaginatedComponentTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/components/types${apiClient.buildQuery({ page })}`
        );
        return paginatedComponentTypeResponseSchema.parse(response);
    },

    /**
     * Get a single component type by ID
     */
    getById: async (id: number): Promise<ComponentTypeResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/components/types/${id}`
        );
        return componentTypeResponseSchema.parse(response);
    },

    /**
     * Create a new component type
     */
    create: async (
        data: CreateComponentTypeRequest
    ): Promise<ComponentTypeResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/catalog/components/types",
            data
        );
        return componentTypeResponseSchema.parse(response);
    },

    /**
     * Update an existing component type
     */
    update: async (
        id: number,
        data: UpdateComponentTypeRequest
    ): Promise<ComponentTypeResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/catalog/components/types/${id}`,
            data
        );
        return componentTypeResponseSchema.parse(response);
    },

    /**
     * Delete a component type
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/catalog/components/types/${id}`),
};

// Consolidated Platform API ------------------------------------------------

export const platformApi = {
    platforms: platformsApi,
    componentTypes: componentTypesApi,
};
