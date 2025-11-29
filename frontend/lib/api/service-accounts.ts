/**
 * API endpoints for managing Service Accounts
 */

import { apiClient } from "../api-client";
import {
    serviceAccountResponseSchema,
    paginatedServiceAccountResponseSchema,
} from "@/types/api";
import type {
    ServiceAccountResponse,
    PaginatedServiceAccountResponse,
    CreateServiceAccountRequest,
    UpdateServiceAccountRequest,
} from "@/types/api";

// Service Accounts ---------------------------------------------------------

export const serviceAccountsApi = {
    /**
     * Get all service accounts with pagination
     */
    getAll: async (page = 1): Promise<PaginatedServiceAccountResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/service-accounts${apiClient.buildQuery({ page })}`
        );
        return paginatedServiceAccountResponseSchema.parse(response);
    },

    /**
     * Get a single service account by ID
     */
    getById: async (id: number): Promise<ServiceAccountResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/service-accounts/${id}`
        );
        return serviceAccountResponseSchema.parse(response);
    },

    /**
     * Create a new service account
     */
    create: async (
        data: CreateServiceAccountRequest
    ): Promise<ServiceAccountResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/service-accounts",
            data
        );
        return serviceAccountResponseSchema.parse(response);
    },

    /**
     * Update an existing service account
     */
    update: async (
        id: number,
        data: UpdateServiceAccountRequest
    ): Promise<ServiceAccountResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/service-accounts/${id}`,
            data
        );
        return serviceAccountResponseSchema.parse(response);
    },

    /**
     * Delete a service account
     */
    delete: (id: number) => apiClient.delete(`/v1/service-accounts/${id}`),
};
