/**
 * API endpoints for managing APIs
 */

import { apiClient } from "../api-client";
import type {
    Api,
    ApiResponse,
    PaginatedResponse,
    CreateApiRequest,
    UpdateApiRequest,
} from "@/types/api";

export const apisApi = {
    /**
     * Get all APIs with pagination
     */
    getAll: (page = 1) =>
        apiClient.get<PaginatedResponse<Api>>(
            `/apis${apiClient.buildQuery({ page })}`
        ),

    /**
     * Get a single API by ID
     */
    getById: (id: number) => apiClient.get<ApiResponse<Api>>(`/apis/${id}`),

    /**
     * Create a new API
     */
    create: (data: CreateApiRequest) =>
        apiClient.post<ApiResponse<Api>>("/apis", data),

    /**
     * Update an existing API
     */
    update: (id: number, data: UpdateApiRequest) =>
        apiClient.put<ApiResponse<Api>>(`/apis/${id}`, data),

    /**
     * Delete an API
     */
    delete: (id: number) => apiClient.delete(`/apis/${id}`),
};
