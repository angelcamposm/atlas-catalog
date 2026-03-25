/**
 * API endpoints for managing Users in the organization
 */

import { apiClient } from "../api-client";
import { userSchema } from "@/types/api";
import type {
    PaginatedResponse,
    User,
    CreateUserRequest,
    UpdateUserRequest,
} from "@/types/api";
import { z } from "zod";
import { paginationMetaSchema, paginationLinksSchema } from "@/types/api";

const paginatedUserResponseSchema = z.object({
    data: z.array(userSchema),
    links: paginationLinksSchema,
    meta: paginationMetaSchema,
});

const userResponseSchema = z.object({
    data: userSchema,
});

export const usersApi = {
    /**
     * Get all users with pagination
     */
    getAll: async (page = 1): Promise<PaginatedResponse<User>> => {
        const response = await apiClient.get<unknown>(
            `/v1/organization/users${apiClient.buildQuery({ page })}`
        );
        return paginatedUserResponseSchema.parse(response);
    },

    /**
     * Get a single user by ID
     */
    getById: async (id: number): Promise<{ data: User }> => {
        const response = await apiClient.get<unknown>(
            `/v1/organization/users/${id}`
        );
        return userResponseSchema.parse(response);
    },

    /**
     * Create a new user
     */
    create: async (data: CreateUserRequest): Promise<{ data: User }> => {
        const response = await apiClient.post<unknown>(
            "/v1/organization/users",
            data
        );
        return userResponseSchema.parse(response);
    },

    /**
     * Update an existing user
     */
    update: async (
        id: number,
        data: UpdateUserRequest
    ): Promise<{ data: User }> => {
        const response = await apiClient.put<unknown>(
            `/v1/organization/users/${id}`,
            data
        );
        return userResponseSchema.parse(response);
    },

    /**
     * Delete a user
     */
    delete: (id: number) => apiClient.delete(`/v1/organization/users/${id}`),
};
