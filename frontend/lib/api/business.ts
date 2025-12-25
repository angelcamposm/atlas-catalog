/**
 * API endpoints for managing Business Domain resources
 * Includes: Business Domains, Business Tiers, Environments
 */

import { apiClient } from "../api-client";
import {
    businessDomainResponseSchema,
    paginatedBusinessDomainResponseSchema,
    businessTierResponseSchema,
    paginatedBusinessTierResponseSchema,
    environmentResponseSchema,
    paginatedEnvironmentResponseSchema,
} from "@/types/api";
import type {
    BusinessDomainResponse,
    PaginatedBusinessDomainResponse,
    CreateBusinessDomainRequest,
    UpdateBusinessDomainRequest,
    BusinessTierResponse,
    PaginatedBusinessTierResponse,
    CreateBusinessTierRequest,
    UpdateBusinessTierRequest,
    EnvironmentResponse,
    PaginatedEnvironmentResponse,
    CreateEnvironmentRequest,
    UpdateEnvironmentRequest,
} from "@/types/api";

// Business Domains ---------------------------------------------------------

export const businessDomainsApi = {
    /**
     * Get all business domains with pagination
     */
    getAll: async (page = 1): Promise<PaginatedBusinessDomainResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-domains${apiClient.buildQuery({ page })}`
        );
        return paginatedBusinessDomainResponseSchema.parse(response);
    },

    /**
     * Get a single business domain by ID
     */
    getById: async (id: number): Promise<BusinessDomainResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-domains/${id}`
        );
        return businessDomainResponseSchema.parse(response);
    },

    /**
     * Create a new business domain
     */
    create: async (
        data: CreateBusinessDomainRequest
    ): Promise<BusinessDomainResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/business-domains",
            data
        );
        return businessDomainResponseSchema.parse(response);
    },

    /**
     * Update an existing business domain
     */
    update: async (
        id: number,
        data: UpdateBusinessDomainRequest
    ): Promise<BusinessDomainResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/business-domains/${id}`,
            data
        );
        return businessDomainResponseSchema.parse(response);
    },

    /**
     * Delete a business domain
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/architecture/business-domains/${id}`),
};

// Business Tiers -----------------------------------------------------------

export const businessTiersApi = {
    /**
     * Get all business tiers with pagination
     */
    getAll: async (page = 1): Promise<PaginatedBusinessTierResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-tiers${apiClient.buildQuery({ page })}`
        );
        return paginatedBusinessTierResponseSchema.parse(response);
    },

    /**
     * Get a single business tier by ID
     */
    getById: async (id: number): Promise<BusinessTierResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/business-tiers/${id}`
        );
        return businessTierResponseSchema.parse(response);
    },

    /**
     * Create a new business tier
     */
    create: async (
        data: CreateBusinessTierRequest
    ): Promise<BusinessTierResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/business-tiers",
            data
        );
        return businessTierResponseSchema.parse(response);
    },

    /**
     * Update an existing business tier
     */
    update: async (
        id: number,
        data: UpdateBusinessTierRequest
    ): Promise<BusinessTierResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/business-tiers/${id}`,
            data
        );
        return businessTierResponseSchema.parse(response);
    },

    /**
     * Delete a business tier
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/architecture/business-tiers/${id}`),
};

// Environments -------------------------------------------------------------

export const environmentsApi = {
    /**
     * Get all environments with pagination
     */
    getAll: async (page = 1): Promise<PaginatedEnvironmentResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/environments${apiClient.buildQuery({ page })}`
        );
        return paginatedEnvironmentResponseSchema.parse(response);
    },

    /**
     * Get a single environment by ID
     */
    getById: async (id: number): Promise<EnvironmentResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/architecture/environments/${id}`
        );
        return environmentResponseSchema.parse(response);
    },

    /**
     * Create a new environment
     */
    create: async (
        data: CreateEnvironmentRequest
    ): Promise<EnvironmentResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/architecture/environments",
            data
        );
        return environmentResponseSchema.parse(response);
    },

    /**
     * Update an existing environment
     */
    update: async (
        id: number,
        data: UpdateEnvironmentRequest
    ): Promise<EnvironmentResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/architecture/environments/${id}`,
            data
        );
        return environmentResponseSchema.parse(response);
    },

    /**
     * Delete an environment
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/architecture/environments/${id}`),
};

// Consolidated Business API ------------------------------------------------

export const businessApi = {
    domains: businessDomainsApi,
    tiers: businessTiersApi,
    environments: environmentsApi,
};
