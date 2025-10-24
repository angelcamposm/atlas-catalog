/**
 * API endpoints for managing API Types
 */

import { apiClient } from "../api-client";
import type {
    ApiType,
    ApiResponse,
    PaginatedResponse,
    CreateApiTypeRequest,
    UpdateApiTypeRequest,
} from "@/types/api";

export const apiTypesApi = {
    /**
     * Get all API Types with pagination
     */
    getAll: (page = 1) =>
        apiClient.get<PaginatedResponse<ApiType>>(
            `/api-types${apiClient.buildQuery({ page })}`
        ),

    /**
     * Get a single API Type by ID
     */
    getById: (id: number) =>
        apiClient.get<ApiResponse<ApiType>>(`/api-types/${id}`),

    /**
     * Create a new API Type
     */
    create: (data: CreateApiTypeRequest) =>
        apiClient.post<ApiResponse<ApiType>>("/api-types", data),

    /**
     * Update an existing API Type
     */
    update: (id: number, data: UpdateApiTypeRequest) =>
        apiClient.put<ApiResponse<ApiType>>(`/api-types/${id}`, data),

    /**
     * Delete an API Type
     */
    delete: (id: number) => apiClient.delete(`/api-types/${id}`),
};
