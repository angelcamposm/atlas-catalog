/**
 * API endpoints for managing Compliance and Governance resources
 * Includes: Compliance Standards, Compliance Requirements
 *
 * Service Statuses have been moved to the Operations domain (@/lib/api/operations).
 * Re-exported here for backward compatibility.
 */

import { apiClient } from "../api-client";
import {
    complianceRequirementResponseSchema,
    paginatedComplianceRequirementResponseSchema,
    complianceStandardResponseSchema,
    paginatedComplianceStandardResponseSchema,
} from "@/types/api";
import type {
    ComplianceRequirementResponse,
    PaginatedComplianceRequirementResponse,
    CreateComplianceRequirementRequest,
    UpdateComplianceRequirementRequest,
    ComplianceStandardResponse,
    PaginatedComplianceStandardResponse,
    CreateComplianceStandardRequest,
    UpdateComplianceStandardRequest,
} from "@/types/api";

export { serviceStatusesApi } from "./operations";

export { complianceRequirementSchema } from "@/types/api";
export type { ComplianceRequirement, CreateComplianceRequirementRequest } from "@/types/api";

// Compliance Requirements --------------------------------------------------

export const complianceRequirementsApi = {
    /**
     * Get all compliance requirements with pagination
     */
    getAll: async (
        page = 1,
    ): Promise<PaginatedComplianceRequirementResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/compliance/compliance-requirements${apiClient.buildQuery({
                page,
            })}`,
        );
        return paginatedComplianceRequirementResponseSchema.parse(response);
    },

    /**
     * Get a single compliance requirement by ID
     */
    getById: async (id: number): Promise<ComplianceRequirementResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/compliance/compliance-requirements/${id}`,
        );
        return complianceRequirementResponseSchema.parse(response);
    },

    /**
     * Create a new compliance requirement
     */
    create: async (
        data: CreateComplianceRequirementRequest,
    ): Promise<ComplianceRequirementResponse> => {
        const response = await apiClient.post<unknown>(
            "/v1/compliance/compliance-requirements",
            data,
        );
        return complianceRequirementResponseSchema.parse(response);
    },

    /**
     * Update an existing compliance requirement
     */
    update: async (
        id: number,
        data: UpdateComplianceRequirementRequest,
    ): Promise<ComplianceRequirementResponse> => {
        const response = await apiClient.put<unknown>(
            `/v1/compliance/compliance-requirements/${id}`,
            data,
        );
        return complianceRequirementResponseSchema.parse(response);
    },

    /**
     * Delete a compliance requirement
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/compliance/compliance-requirements/${id}`),
};

// Compliance Standards -----------------------------------------------------

export const complianceStandardsApi = {
    /**
     * Get all compliance standards with pagination
     */
    getAll: async (page = 1): Promise<PaginatedComplianceStandardResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/compliance/compliance-standards${apiClient.buildQuery({
                page,
            })}`
        );
        return paginatedComplianceStandardResponseSchema.parse(response);
    },

    /**
     * Get a single compliance standard by ID
     */
    getById: async (id: number): Promise<ComplianceStandardResponse> => {
        const response = await apiClient.get<unknown>(
            `/v1/compliance/compliance-standards/${id}`
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
            "/v1/compliance/compliance-standards",
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
            `/v1/compliance/compliance-standards/${id}`,
            data
        );
        return complianceStandardResponseSchema.parse(response);
    },

    /**
     * Delete a compliance standard
     */
    delete: (id: number) =>
        apiClient.delete(`/v1/compliance/compliance-standards/${id}`),
};

// Consolidated Compliance API ----------------------------------------------

export const complianceApi = {
    standards: complianceStandardsApi,
    requirements: complianceRequirementsApi,
};
