/**
 * API endpoints for managing Lifecycles
 */

import { apiClient } from "../api-client";
import type {
    Lifecycle,
    ApiResponse,
    PaginatedResponse,
    CreateLifecycleRequest,
    UpdateLifecycleRequest,
} from "@/types/api";

export const lifecyclesApi = {
    /**
     * Get all Lifecycles with pagination
     */
    getAll: (page = 1) =>
        apiClient.get<PaginatedResponse<Lifecycle>>(
            `/lifecycles${apiClient.buildQuery({ page })}`
        ),

    /**
     * Get a single Lifecycle by ID
     */
    getById: (id: number) =>
        apiClient.get<ApiResponse<Lifecycle>>(`/lifecycles/${id}`),

    /**
     * Create a new Lifecycle
     */
    create: (data: CreateLifecycleRequest) =>
        apiClient.post<ApiResponse<Lifecycle>>("/lifecycles", data),

    /**
     * Update an existing Lifecycle
     */
    update: (id: number, data: UpdateLifecycleRequest) =>
        apiClient.put<ApiResponse<Lifecycle>>(`/lifecycles/${id}`, data),

    /**
     * Delete a Lifecycle
     */
    delete: (id: number) => apiClient.delete(`/lifecycles/${id}`),
};
