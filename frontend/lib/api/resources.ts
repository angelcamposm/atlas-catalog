/**
 * API endpoints for managing Resources
 * Includes: Resources, Resource Categories
 */

import { apiClient } from "../api-client";
import {
    resourceResponseSchema,
    paginatedResourceResponseSchema,
    resourceCategoryResponseSchema,
    paginatedResourceCategoryResponseSchema,
} from "@/types/api";
import type {
    ResourceResponse,
    PaginatedResourceResponse,
    CreateResourceRequest,
    UpdateResourceRequest,
    ResourceCategoryResponse,
    PaginatedResourceCategoryResponse,
    CreateResourceCategoryRequest,
    UpdateResourceCategoryRequest,
} from "@/types/api";

// Resources ----------------------------------------------------------------

export const resourcesApi = {
    /**
     * Get all resources with pagination
     */
    getAll: async (page = 1): Promise<PaginatedResourceResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/resources${apiClient.buildQuery({ page })}`
        );
        return paginatedResourceResponseSchema.parse(response);
    },

    /**
     * Get a single resource by ID
     */
    getById: async (id: number): Promise<ResourceResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/resources/${id}`
        );
        return resourceResponseSchema.parse(response);
    },

    /**
     * Create a new resource
     */
    create: async (data: CreateResourceRequest): Promise<ResourceResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/catalog/resources",
            data
        );
        return resourceResponseSchema.parse(response);
    },

    /**
     * Update an existing resource
     */
    update: async (
        id: number,
        data: UpdateResourceRequest
    ): Promise<ResourceResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/catalog/resources/${id}`,
            data
        );
        return resourceResponseSchema.parse(response);
    },

    /**
     * Delete a resource
     */
    delete: (id: number) => apiClient.delete(`/v1/catalog/resources/${id}`),
};

// Resource Categories ------------------------------------------------------

export const resourceCategoriesApi = {
    /**
     * Get all resource categories with pagination
     */
    getAll: async (page = 1): Promise<PaginatedResourceCategoryResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/resources/categories${apiClient.buildQuery({ page })}`
        );
        return paginatedResourceCategoryResponseSchema.parse(response);
    },

    /**
     * Get a single resource category by ID
     */
    getById: async (id: number): Promise<ResourceCategoryResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/catalog/resources/categories/${id}`
        );
        return resourceCategoryResponseSchema.parse(response);
    },

    /**
     * Create a new resource category
     */
    create: async (
        data: CreateResourceCategoryRequest
    ): Promise<ResourceCategoryResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/catalog/resources/categories",
            data
        );
        return resourceCategoryResponseSchema.parse(response);
    },

    /**
     * Update an existing resource category
     */
    update: async (
        id: number,
        data: UpdateResourceCategoryRequest
    ): Promise<ResourceCategoryResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/catalog/resources/categories/${id}`,
            data
        );
        return resourceCategoryResponseSchema.parse(response);
    },

    /**
     * Delete a resource category
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/catalog/resources/categories/${id}`),
};

// Consolidated Resources API -----------------------------------------------

export const resourcesApiComplete = {
    resources: resourcesApi,
    categories: resourceCategoriesApi,
};
