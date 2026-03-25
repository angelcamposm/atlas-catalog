/**
 * API endpoints for managing Security resources
 * Includes: Service Account Tokens
 */

import { apiClient } from "../api-client";
import {
    serviceAccountTokenResponseSchema,
    paginatedServiceAccountTokenResponseSchema,
} from "@/types/api";
import type {
    ServiceAccountTokenResponse,
    PaginatedServiceAccountTokenResponse,
    CreateServiceAccountTokenRequest,
    UpdateServiceAccountTokenRequest,
} from "@/types/api";

// Service Account Tokens ---------------------------------------------------
// TODO: Backend has /v1/service-accounts but not /v1/service-account-tokens.
// Service Account Tokens may be a nested resource under service-accounts.
// These calls will fail until the endpoint structure is clarified.

export const serviceAccountTokensApi = {
    /**
     * Get all service account tokens with pagination
     * @deprecated Backend endpoint not yet implemented - consider /v1/service-accounts
     */
    getAll: async (page = 1): Promise<PaginatedServiceAccountTokenResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/security/service-accounts/tokens${apiClient.buildQuery({
                page,
            })}`
        );
        return paginatedServiceAccountTokenResponseSchema.parse(response);
    },

    /**
     * Get a single service account token by ID
     */
    getById: async (id: number): Promise<ServiceAccountTokenResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/security/service-accounts/tokens/${id}`
        );
        return serviceAccountTokenResponseSchema.parse(response);
    },

    /**
     * Create a new service account token
     */
    create: async (
        data: CreateServiceAccountTokenRequest
    ): Promise<ServiceAccountTokenResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/security/service-accounts/tokens",
            data
        );
        return serviceAccountTokenResponseSchema.parse(response);
    },

    /**
     * Update an existing service account token
     */
    update: async (
        id: number,
        data: UpdateServiceAccountTokenRequest
    ): Promise<ServiceAccountTokenResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/security/service-accounts/tokens/${id}`,
            data
        );
        return serviceAccountTokenResponseSchema.parse(response);
    },

    /**
     * Delete a service account token
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/security/service-accounts/tokens/${id}`),
};

// Consolidated Security API ------------------------------------------------

export const securityApi = {
    serviceAccountTokens: serviceAccountTokensApi,
};
