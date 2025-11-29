/**
 * API endpoints for managing Technology resources
 * Includes: Vendors, Frameworks, Authentication Methods
 */

import { apiClient } from "../api-client";
import {
    vendorResponseSchema,
    paginatedVendorResponseSchema,
    frameworkResponseSchema,
    paginatedFrameworkResponseSchema,
    authenticationMethodResponseSchema,
    paginatedAuthenticationMethodResponseSchema,
} from "@/types/api";
import type {
    VendorResponse,
    PaginatedVendorResponse,
    CreateVendorRequest,
    UpdateVendorRequest,
    FrameworkResponse,
    PaginatedFrameworkResponse,
    CreateFrameworkRequest,
    UpdateFrameworkRequest,
    AuthenticationMethodResponse,
    PaginatedAuthenticationMethodResponse,
    CreateAuthenticationMethodRequest,
    UpdateAuthenticationMethodRequest,
} from "@/types/api";

// Vendors ------------------------------------------------------------------

export const vendorsApi = {
    /**
     * Get all vendors with pagination
     */
    getAll: async (page = 1): Promise<PaginatedVendorResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/vendors${apiClient.buildQuery({ page })}`
        );
        return paginatedVendorResponseSchema.parse(response);
    },

    /**
     * Get a single vendor by ID
     */
    getById: async (id: number): Promise<VendorResponse> => {
        const response = await apiClient.get<unknown>(`/v1/vendors/${id}`);
        return vendorResponseSchema.parse(response);
    },

    /**
     * Create a new vendor
     */
    create: async (data: CreateVendorRequest): Promise<VendorResponse> => {
        const response = await apiClient.post<unknown>("/v1/vendors", data);
        return vendorResponseSchema.parse(response);
    },

    /**
     * Update an existing vendor
     */
    update: async (
        id: number,
        data: UpdateVendorRequest
    ): Promise<VendorResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/vendors/${id}`,
            data
        );
        return vendorResponseSchema.parse(response);
    },

    /**
     * Delete a vendor
     */
    delete: (id: number) => apiClient.delete(`/v1/vendors/${id}`),
};

// Frameworks ---------------------------------------------------------------

export const frameworksApi = {
    /**
     * Get all frameworks with pagination
     */
    getAll: async (page = 1): Promise<PaginatedFrameworkResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/frameworks${apiClient.buildQuery({ page })}`
        );
        return paginatedFrameworkResponseSchema.parse(response);
    },

    /**
     * Get a single framework by ID
     */
    getById: async (id: number): Promise<FrameworkResponse> => {
        const response = await apiClient.get<unknown>(`/v1/frameworks/${id}`);
        return frameworkResponseSchema.parse(response);
    },

    /**
     * Create a new framework
     */
    create: async (
        data: CreateFrameworkRequest
    ): Promise<FrameworkResponse> => {
        const response = await apiClient.post<unknown>("/v1/frameworks", data);
        return frameworkResponseSchema.parse(response);
    },

    /**
     * Update an existing framework
     */
    update: async (
        id: number,
        data: UpdateFrameworkRequest
    ): Promise<FrameworkResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/frameworks/${id}`,
            data
        );
        return frameworkResponseSchema.parse(response);
    },

    /**
     * Delete a framework
     */
    delete: (id: number) => apiClient.delete(`/v1/frameworks/${id}`),
};

// Authentication Methods ---------------------------------------------------

export const authenticationMethodsApi = {
    /**
     * Get all authentication methods with pagination
     */
    getAll: async (
        page = 1
    ): Promise<PaginatedAuthenticationMethodResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/authentication-methods${apiClient.buildQuery({ page })}`
        );
        return paginatedAuthenticationMethodResponseSchema.parse(response);
    },

    /**
     * Get a single authentication method by ID
     */
    getById: async (id: number): Promise<AuthenticationMethodResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/authentication-methods/${id}`
        );
        return authenticationMethodResponseSchema.parse(response);
    },

    /**
     * Create a new authentication method
     */
    create: async (
        data: CreateAuthenticationMethodRequest
    ): Promise<AuthenticationMethodResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/authentication-methods",
            data
        );
        return authenticationMethodResponseSchema.parse(response);
    },

    /**
     * Update an existing authentication method
     */
    update: async (
        id: number,
        data: UpdateAuthenticationMethodRequest
    ): Promise<AuthenticationMethodResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/authentication-methods/${id}`,
            data
        );
        return authenticationMethodResponseSchema.parse(response);
    },

    /**
     * Delete an authentication method
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/authentication-methods/${id}`),
};

// Consolidated Technology API ----------------------------------------------

export const technologyApi = {
    vendors: vendorsApi,
    frameworks: frameworksApi,
    authenticationMethods: authenticationMethodsApi,
};
