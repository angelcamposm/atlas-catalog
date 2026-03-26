/**
 * API endpoints for the Operations domain
 * Includes: Service Statuses, Metrics
 */

import { apiClient } from "../api-client";
import {
    metricResponseSchema,
    metricSchema,
    paginatedMetricResponseSchema,
    serviceStatusResponseSchema,
    paginatedServiceStatusResponseSchema,
} from "@/types/api";
import type {
    MetricResponse,
    PaginatedMetricResponse,
    CreateMetricRequest,
    UpdateMetricRequest,
    ServiceStatusResponse,
    PaginatedServiceStatusResponse,
    CreateServiceStatusRequest,
    UpdateServiceStatusRequest,
} from "@/types/api";

export { metricSchema } from "@/types/api";
export type {
    Metric,
    CreateMetricRequest,
    UpdateMetricRequest,
} from "@/types/api";

const OPS_BASE = "/v1/operations";

// Service Statuses ---------------------------------------------------------

export const serviceStatusesApi = {
    /**
     * Get all service statuses with pagination
     */
    getAll: async (page = 1): Promise<PaginatedServiceStatusResponse> => {
        const response = await apiClient.get<unknown>(
            `${OPS_BASE}/service-statuses${apiClient.buildQuery({ page })}`,
        );
        return paginatedServiceStatusResponseSchema.parse(response);
    },

    /**
     * Get a single service status by ID
     */
    getById: async (id: number): Promise<ServiceStatusResponse> => {
        const response = await apiClient.get<unknown>(
            `${OPS_BASE}/service-statuses/${id}`,
        );
        return serviceStatusResponseSchema.parse(response);
    },

    /**
     * Create a new service status
     */
    create: async (
        data: CreateServiceStatusRequest,
    ): Promise<ServiceStatusResponse> => {
        const response = await apiClient.post<unknown>(
            `${OPS_BASE}/service-statuses`,
            data,
        );
        return serviceStatusResponseSchema.parse(response);
    },

    /**
     * Update an existing service status
     */
    update: async (
        id: number,
        data: UpdateServiceStatusRequest,
    ): Promise<ServiceStatusResponse> => {
        const response = await apiClient.put<unknown>(
            `${OPS_BASE}/service-statuses/${id}`,
            data,
        );
        return serviceStatusResponseSchema.parse(response);
    },

    /**
     * Delete a service status
     */
    delete: (id: number) =>
        apiClient.delete(`${OPS_BASE}/service-statuses/${id}`),
};

// Metrics ------------------------------------------------------------------

export const metricsApi = {
    /**
     * Get all metrics with pagination
     */
    getAll: async (page = 1): Promise<PaginatedMetricResponse> => {
        const response = await apiClient.get<unknown>(
            `${OPS_BASE}/metrics${apiClient.buildQuery({ page })}`,
        );
        return paginatedMetricResponseSchema.parse(response);
    },

    /**
     * Get a single metric by ID
     */
    getById: async (id: number): Promise<MetricResponse> => {
        const response = await apiClient.get<unknown>(
            `${OPS_BASE}/metrics/${id}`,
        );
        return metricResponseSchema.parse(response);
    },

    /**
     * Create a new metric
     */
    create: async (data: CreateMetricRequest): Promise<MetricResponse> => {
        const response = await apiClient.post<unknown>(
            `${OPS_BASE}/metrics`,
            data,
        );
        return metricResponseSchema.parse(response);
    },

    /**
     * Update an existing metric
     */
    update: async (
        id: number,
        data: UpdateMetricRequest,
    ): Promise<MetricResponse> => {
        const response = await apiClient.put<unknown>(
            `${OPS_BASE}/metrics/${id}`,
            data,
        );
        return metricResponseSchema.parse(response);
    },

    /**
     * Delete a metric
     */
    delete: (id: number) => apiClient.delete(`${OPS_BASE}/metrics/${id}`),
};

// Consolidated Operations API ----------------------------------------------

export const operationsApi = {
    serviceStatuses: serviceStatusesApi,
    metrics: metricsApi,
};
