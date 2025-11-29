/**
 * Extended API endpoints for managing API-related resources
 * Includes: API Categories, API Statuses, API Access Policies
 */

import { apiClient } from "../api-client";
import {
    apiCategoryResponseSchema,
    paginatedApiCategoryResponseSchema,
    apiStatusResponseSchema,
    paginatedApiStatusResponseSchema,
    apiAccessPolicyResponseSchema,
    paginatedApiAccessPolicyResponseSchema,
} from "@/types/api";
import type {
    ApiCategoryResponse,
    PaginatedApiCategoryResponse,
    CreateApiCategoryRequest,
    UpdateApiCategoryRequest,
    ApiStatusResponse,
    PaginatedApiStatusResponse,
    CreateApiStatusRequest,
    UpdateApiStatusRequest,
    ApiAccessPolicyResponse,
    PaginatedApiAccessPolicyResponse,
    CreateApiAccessPolicyRequest,
    UpdateApiAccessPolicyRequest,
} from "@/types/api";

// API Categories -----------------------------------------------------------

export const apiCategoriesApi = {
    /**
     * Get all API categories with pagination
     */
    getAll: async (page = 1): Promise<PaginatedApiCategoryResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/apis/categories${apiClient.buildQuery({ page })}`
        );
        return paginatedApiCategoryResponseSchema.parse(response);
    },

    /**
     * Get a single API category by ID
     */
    getById: async (id: number): Promise<ApiCategoryResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/apis/categories/${id}`
        );
        return apiCategoryResponseSchema.parse(response);
    },

    /**
     * Create a new API category
     */
    create: async (
        data: CreateApiCategoryRequest
    ): Promise<ApiCategoryResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/apis/categories",
            data
        );
        return apiCategoryResponseSchema.parse(response);
    },

    /**
     * Update an existing API category
     */
    update: async (
        id: number,
        data: UpdateApiCategoryRequest
    ): Promise<ApiCategoryResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/apis/categories/${id}`,
            data
        );
        return apiCategoryResponseSchema.parse(response);
    },

    /**
     * Delete an API category
     */
    delete: (id: number) => apiClient.delete(`/v1/apis/categories/${id}`),
};

// API Statuses -------------------------------------------------------------

export const apiStatusesApi = {
    /**
     * Get all API statuses with pagination
     */
    getAll: async (page = 1): Promise<PaginatedApiStatusResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/apis/statuses${apiClient.buildQuery({ page })}`
        );
        return paginatedApiStatusResponseSchema.parse(response);
    },

    /**
     * Get a single API status by ID
     */
    getById: async (id: number): Promise<ApiStatusResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/apis/statuses/${id}`
        );
        return apiStatusResponseSchema.parse(response);
    },

    /**
     * Create a new API status
     */
    create: async (
        data: CreateApiStatusRequest
    ): Promise<ApiStatusResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/apis/statuses",
            data
        );
        return apiStatusResponseSchema.parse(response);
    },

    /**
     * Update an existing API status
     */
    update: async (
        id: number,
        data: UpdateApiStatusRequest
    ): Promise<ApiStatusResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/apis/statuses/${id}`,
            data
        );
        return apiStatusResponseSchema.parse(response);
    },

    /**
     * Delete an API status
     */
    delete: (id: number) => apiClient.delete(`/v1/apis/statuses/${id}`),
};

// API Access Policies ------------------------------------------------------

export const apiAccessPoliciesApi = {
    /**
     * Get all API access policies with pagination
     */
    getAll: async (page = 1): Promise<PaginatedApiAccessPolicyResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/apis/access-policies${apiClient.buildQuery({ page })}`
        );
        return paginatedApiAccessPolicyResponseSchema.parse(response);
    },

    /**
     * Get a single API access policy by ID
     */
    getById: async (id: number): Promise<ApiAccessPolicyResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/apis/access-policies/${id}`
        );
        return apiAccessPolicyResponseSchema.parse(response);
    },

    /**
     * Create a new API access policy
     */
    create: async (
        data: CreateApiAccessPolicyRequest
    ): Promise<ApiAccessPolicyResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/apis/access-policies",
            data
        );
        return apiAccessPolicyResponseSchema.parse(response);
    },

    /**
     * Update an existing API access policy
     */
    update: async (
        id: number,
        data: UpdateApiAccessPolicyRequest
    ): Promise<ApiAccessPolicyResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/apis/access-policies/${id}`,
            data
        );
        return apiAccessPolicyResponseSchema.parse(response);
    },

    /**
     * Delete an API access policy
     */
    delete: (id: number) => apiClient.delete(`/v1/apis/access-policies/${id}`),
};

// Consolidated Extended API ------------------------------------------------

export const apiExtendedApi = {
    categories: apiCategoriesApi,
    statuses: apiStatusesApi,
    accessPolicies: apiAccessPoliciesApi,
};
