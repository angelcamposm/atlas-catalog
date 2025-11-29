/**
 * API endpoints for managing Compliance and Governance resources
 * Includes: Compliance Standards, Service Statuses
 */

import { apiClient } from "../api-client";
import {
    complianceStandardResponseSchema,
    paginatedComplianceStandardResponseSchema,
    serviceStatusResponseSchema,
    paginatedServiceStatusResponseSchema,
} from "@/types/api";
import type {
    ComplianceStandardResponse,
    PaginatedComplianceStandardResponse,
    CreateComplianceStandardRequest,
    UpdateComplianceStandardRequest,
    ServiceStatusResponse,
    PaginatedServiceStatusResponse,
    CreateServiceStatusRequest,
    UpdateServiceStatusRequest,
} from "@/types/api";

// Compliance Standards -----------------------------------------------------

export const complianceStandardsApi = {
    /**
     * Get all compliance standards with pagination
     */
    getAll: async (page = 1): Promise<PaginatedComplianceStandardResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/compliance-standards${apiClient.buildQuery({ page })}`
        );
        return paginatedComplianceStandardResponseSchema.parse(response);
    },

    /**
     * Get a single compliance standard by ID
     */
    getById: async (id: number): Promise<ComplianceStandardResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/compliance-standards/${id}`
        );
        return complianceStandardResponseSchema.parse(response);
    },

    /**
     * Create a new compliance standard
     */
    create: async (
        data: CreateComplianceStandardRequest
    ): Promise<ComplianceStandardResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/compliance-standards",
            data
        );
        return complianceStandardResponseSchema.parse(response);
    },

    /**
     * Update an existing compliance standard
     */
    update: async (
        id: number,
        data: UpdateComplianceStandardRequest
    ): Promise<ComplianceStandardResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/compliance-standards/${id}`,
            data
        );
        return complianceStandardResponseSchema.parse(response);
    },

    /**
     * Delete a compliance standard
     */
    delete: (id: number) => apiClient.delete(`/v1/compliance-standards/${id}`),
};

// Service Statuses ---------------------------------------------------------

export const serviceStatusesApi = {
    /**
     * Get all service statuses with pagination
     */
    getAll: async (page = 1): Promise<PaginatedServiceStatusResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/service-statuses${apiClient.buildQuery({ page })}`
        );
        return paginatedServiceStatusResponseSchema.parse(response);
    },

    /**
     * Get a single service status by ID
     */
    getById: async (id: number): Promise<ServiceStatusResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/service-statuses/${id}`
        );
        return serviceStatusResponseSchema.parse(response);
    },

    /**
     * Create a new service status
     */
    create: async (
        data: CreateServiceStatusRequest
    ): Promise<ServiceStatusResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/service-statuses",
            data
        );
        return serviceStatusResponseSchema.parse(response);
    },

    /**
     * Update an existing service status
     */
    update: async (
        id: number,
        data: UpdateServiceStatusRequest
    ): Promise<ServiceStatusResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/service-statuses/${id}`,
            data
        );
        return serviceStatusResponseSchema.parse(response);
    },

    /**
     * Delete a service status
     */
    delete: (id: number) => apiClient.delete(`/v1/service-statuses/${id}`),
};

// Consolidated Compliance API ----------------------------------------------

export const complianceApi = {
    standards: complianceStandardsApi,
    serviceStatuses: serviceStatusesApi,
};
